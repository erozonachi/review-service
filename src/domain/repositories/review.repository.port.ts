import { Review } from '../entities/review';
import { BaseRepositoryPort } from './base.repository.port';

export type CreateInput = Omit<Review, 'id' | 'createdAt'>;
export type UpdateInput = never;

export interface ReviewRepositoryPort extends BaseRepositoryPort<Review, CreateInput, UpdateInput> {}
