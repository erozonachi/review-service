import { Model, Mongoose } from 'mongoose';

import { CreateInput, ProductRepositoryPort, UpdateInput } from '../../../domain/repositories/product.repository.port';
import { ProductDocument, getProductSchema } from './product.schema';
import { Product } from '../../../domain/entities/product';
import { BaseRepository } from '../base.repository';

class ProductRepositoryAdapter
  extends BaseRepository<ProductDocument, Product, CreateInput, UpdateInput>
  implements ProductRepositoryPort
{
  constructor(model: Model<ProductDocument>) {
    super({ model });
  }

  /**
   * Converts the ProductDocument into the Product type.
   */
  protected toObject(document: ProductDocument): Product {
    return {
      id: document._id.toString(),
      sellerId: document.sellerId.toString(),
      name: document.name,
      description: document.description,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}

export const getProductRepositoryInstance = (mongoose: Mongoose): ProductRepositoryAdapter =>
  new ProductRepositoryAdapter(mongoose.model<ProductDocument>('Product', getProductSchema()));

export { ProductRepositoryAdapter };
