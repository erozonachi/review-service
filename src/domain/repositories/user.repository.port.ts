import { User } from '../entities/user';
import { BaseRepositoryPort } from './base.repository.port';

export type CreateInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInput = never;

export interface UserRepositoryPort extends BaseRepositoryPort<User, CreateInput, UpdateInput> {}
