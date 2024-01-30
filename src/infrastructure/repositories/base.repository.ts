/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { Document, Model } from 'mongoose';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

import { BaseRepositoryPort, SortObject } from '../../domain/repositories/base.repository.port';
import { mapId } from '../../lib/ids';

abstract class BaseRepository<
  MongooseDocument extends Document,
  DomainObject extends object,
  CreateInput extends object,
  UpdateInput extends object
> implements BaseRepositoryPort<DomainObject, CreateInput, UpdateInput>
{
  protected model: Model<MongooseDocument>;

  protected toDocument(domain: Partial<DomainObject> | CreateInput | UpdateInput): MongooseDocument {
    const toReturn: MongooseDocument = {} as MongooseDocument;

    for (const [key, value] of Object.entries(domain)) {
      toReturn[key as keyof MongooseDocument] = value;
    }

    return toReturn;
  }

  public constructor(input: { model: Model<MongooseDocument> }) {
    const { model } = input;

    this.model = model;
  }

  protected abstract toObject(document: MongooseDocument): DomainObject;

  public async create(input: CreateInput): Promise<DomainObject> {
    const document = await this.model.create(this.toDocument(input));
    const object = this.toObject(document);

    return object;
  }

  public async findByFields(query: Partial<DomainObject>, sort?: SortObject): Promise<DomainObject[]> {
    const documentQuery = this.toDocument(query);

    const undefinedExcludedDocumentQuery = omitBy(documentQuery, isUndefined);

    const documents = await this.model
      .find(mapId(undefinedExcludedDocumentQuery as Record<string, never>))
      .sort(sort)
      .lean()
      .exec();

    return documents.map((document) => this.toObject(document as MongooseDocument));
  }

  public async findOneByFields(query: Partial<DomainObject>, sort?: SortObject): Promise<DomainObject | undefined> {
    const documentQuery = this.toDocument(query);
    const document = await this.model
      .findOne(mapId(omitBy(documentQuery, isUndefined) as Record<string, never>))
      .sort(sort)
      .lean()
      .exec();

    if (document) {
      return this.toObject(document as MongooseDocument);
    }

    return;
  }

  public async findById(id: string): Promise<DomainObject> {
    const document = await this.model.findById(id).lean().exec();

    if (!document) {
      const message = `${this.model.modelName} not found for findById`;

      throw new Error(message);
    }

    return this.toObject(document as MongooseDocument);
  }
}

export { BaseRepository };
