import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

export type TypesenseSchemaOptions = Omit<CollectionCreateSchema, 'fields'>;
