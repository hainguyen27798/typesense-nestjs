import { CollectionFieldSchema } from 'typesense/lib/Typesense/Collection';

export type TypesenseFieldOptions = Omit<CollectionFieldSchema, 'name'>;
