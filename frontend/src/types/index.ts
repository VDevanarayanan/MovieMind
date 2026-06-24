export interface MovieCard {
  id: number;
  title: string;
  poster_path?: string | null;
  release_date?: string;
  overview?: string;
  vote_average?: number;
}

export interface RecommendationItem {
  title: string;
  reason: string;
  confidence: number;
  posterPath?: string | null;
}
