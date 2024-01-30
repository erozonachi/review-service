export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  description: string;
  createdAt: Date;
}
