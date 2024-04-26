import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

export interface TypesenseModelDefinition {
    name: string;
    schema: CollectionCreateSchema;
}
