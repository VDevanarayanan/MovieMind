import { Prisma } from '@prisma/client';
import prisma from '../prisma/client';
import { getRatings } from './ratingService';
import { getWatchedMovies } from './watchedService';
import { getMovieDetail, searchMovieCatalog } from './movieService';
import { generateRecommendationsWithGemini } from '../utils/openai';
import { RecommendationItem } from '../types';

const buildTasteProfile = async (ratings: Array<{ tmdbId: number; rating: number }>) => {
  const profiles = await Promise.all(
    ratings.map(async (rating) => {
      const details = await getMovieDetail(rating.tmdbId);
      return {
        tmdbId: rating.tmdbId,
        rating: rating.rating,
        genres: details.genres?.map((genre: any) => genre.name) || [],
        directors: details.credits?.crew?.filter((member: any) => member.job === 'Director').map((member: any) => member.name) || [],
        actors: details.credits?.cast?.slice(0, 5).map((actor: any) => actor.name) || [],
        title: details.title,
      };
    }),
  );

  const favoriteGenres = profiles
    .flatMap((item) => item.rating >= 7 ? item.genres : [])
    .reduce<Record<string, number>>((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

  const favoriteActors = profiles
    .flatMap((item) => item.rating >= 7 ? item.actors : [])
    .reduce<Record<string, number>>((acc, actor) => {
      acc[actor] = (acc[actor] || 0) + 1;
      return acc;
    }, {});

  const favoriteDirectors = profiles
    .flatMap((item) => item.rating >= 7 ? item.directors : [])
    .reduce<Record<string, number>>((acc, director) => {
      acc[director] = (acc[director] || 0) + 1;
      return acc;
    }, {});

  return {
    favorites: {
      genres: Object.entries(favoriteGenres).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([genre]) => genre),
      actors: Object.entries(favoriteActors).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([actor]) => actor),
      directors: Object.entries(favoriteDirectors).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([director]) => director),
    },
    examples: profiles,
  };
};

const parseRecommendationCache = (value: unknown): RecommendationItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    if (typeof item !== 'object' || item === null) {
      return { title: 'Unknown Movie', reason: 'Recommended based on your preferences.', confidence: 70 };
    }

    const obj = item as Record<string, unknown>;
    return {
      title: String(obj.title ?? 'Unknown Movie'),
      reason: String(obj.reason ?? 'Recommended based on your preferences.'),
      confidence: Number(obj.confidence ?? 70),
      posterPath: obj.posterPath ? String(obj.posterPath) : undefined,
    };
  });
};

export const getRecommendationCache = async (userId: string) => {
  const record = await prisma.recommendationCache.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    return null;
  }

  // Check if user has added/updated watched movies since recommendations were generated
  const latestWatched = await prisma.watchedMovie.findFirst({
    where: { userId },
    orderBy: { watchedAt: 'desc' },
  });

  if (latestWatched && latestWatched.watchedAt > record.createdAt) {
    console.log('[Recommendation Cache] Invalidation: new watched movies added since cache generation.');
    return null;
  }

  // Check if user has added/updated ratings since recommendations were generated
  const latestRating = await prisma.movieRating.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  if (latestRating && latestRating.createdAt > record.createdAt) {
    console.log('[Recommendation Cache] Invalidation: new ratings added since cache generation.');
    return null;
  }

  const ageMs = Date.now() - record.createdAt.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  if (ageMs > oneDayMs) {
    return null;
  }

  return parseRecommendationCache(record.recommendations);
};

export const cacheRecommendations = async (userId: string, recommendations: RecommendationItem[]) => {
  return prisma.recommendationCache.create({
    data: {
      userId,
      recommendations: recommendations as unknown as Prisma.JsonArray,
    },
  });
};

export const generateRecommendations = async (userId: string) => {
  const ratings = await getRatings(userId);
  const watched = await getWatchedMovies(userId);

  if (ratings.length < 3) {
    throw new Error('Please rate at least 3 movies to get personalized recommendations.');
  }

  const profile = await buildTasteProfile(ratings);

  const watchedTitles = watched.map((movie) => movie.title);
  const highlyRated = ratings.filter((rating) => rating.rating >= 8);
  const poorlyRated = ratings.filter((rating) => rating.rating <= 5);

  const getMovieTitle = (tmdbId: number) => {
    const matched = profile.examples.find((item) => item.tmdbId === tmdbId);
    return matched?.title || `TMDB ${tmdbId}`;
  };

  const prompt = `You are a movie recommendation assistant.

User taste summary:
- favorite genres: ${profile.favorites.genres.join(', ') || 'None'}
- favorite directors: ${profile.favorites.directors.join(', ') || 'None'}
- favorite actors: ${profile.favorites.actors.join(', ') || 'None'}
- rated movies: ${ratings.length}
- watched titles: ${watchedTitles.slice(0, 10).join(', ') || 'None'}

The user highly rated:
${highlyRated
    .slice(0, 5)
    .map((rating) => `- ${getMovieTitle(rating.tmdbId)} (${rating.rating}/10)`)
    .join('\n') || 'None'}

The user poorly rated:
${poorlyRated
    .slice(0, 5)
    .map((rating) => `- ${getMovieTitle(rating.tmdbId)} (${rating.rating}/10)`)
    .join('\n') || 'None'}

Recommend 10 movies the user has not watched yet. Use movie titles and explain why each recommendation matches the user's taste.

Return JSON array only with objects in this format:
[
  {"title": "", "reason": "", "confidence": 0}
]
`;

  const aiResponse = await generateRecommendationsWithGemini(prompt);
  
  let content = '';
  
  // Handle new Gemini v1beta API response format
  if (aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
    content = aiResponse.candidates[0].content.parts[0].text;
  } else if (aiResponse?.candidates?.[0]?.content) {
    // Fallback for older format
    content = aiResponse.candidates[0].content;
  } else if (aiResponse?.output?.[0]?.content) {
    // Additional fallback
    content = aiResponse.output[0].content;
  } else {
    content = JSON.stringify(aiResponse);
  }
  let recommendations: RecommendationItem[] = [];
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      recommendations = parsed.map((item) => ({
        title: item.title || 'Unknown Movie',
        reason: item.reason || 'Recommended based on your preferences.',
        confidence: Number(item.confidence) || 70,
      }));
    }
  } catch (e: any) {
    console.error("JSON parse error for recommendations:", e.message);
    throw new Error('Failed to parse recommendation response');
  }

  if (!recommendations.length) {
    throw new Error('No recommendations returned from AI service');
  }

  // Resolve poster path for each recommendation
  const recommendationsWithPosters = await Promise.all(
    recommendations.map(async (item) => {
      try {
        const searchResults = await searchMovieCatalog(item.title);
        const firstMatch = searchResults.results?.[0];
        return {
          ...item,
          posterPath: firstMatch?.poster_path || null,
        };
      } catch (err: any) {
        console.warn(`Failed to resolve poster for recommended movie ${item.title}:`, err.message);
        return {
          ...item,
          posterPath: null,
        };
      }
    })
  );

  await cacheRecommendations(userId, recommendationsWithPosters);
  return recommendationsWithPosters;
};
