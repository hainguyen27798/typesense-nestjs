import { CollectionFieldSchema } from 'typesense/lib/Typesense/Collection';

export interface TypesenseFieldMetadata {
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Function;
    propertyKey: string;
    options: CollectionFieldSchema;
}
