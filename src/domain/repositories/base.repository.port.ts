export enum SortDirection {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export interface SortObject {
  [field: string]: SortDirection;
}

export interface BaseRepositoryPort<DomainObject, CreateInput, _UpdateInput> {
  create(input: CreateInput): Promise<DomainObject>;
  findByFields(query: Partial<DomainObject>, sort?: SortObject): Promise<DomainObject[]>;
  findOneByFields(query: Partial<DomainObject>, sort?: SortObject): Promise<DomainObject | undefined>;
  findById(id: string): Promise<DomainObject>;
}
