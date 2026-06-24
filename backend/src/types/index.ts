export interface JwtPayload {
  userId: string;
  email: string;
}

export interface RecommendationItem {
  title: string;
  reason: string;
  confidence: number;
  posterPath?: string | null;
}
