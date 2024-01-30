import { Product } from '../entities/product';
import { BaseRepositoryPort } from './base.repository.port';

export type CreateInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInput = never;

export interface ProductRepositoryPort extends BaseRepositoryPort<Product, CreateInput, UpdateInput> {}
