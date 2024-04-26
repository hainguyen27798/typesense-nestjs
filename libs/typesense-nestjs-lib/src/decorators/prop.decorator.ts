import { TypesenseMetadataStorage } from '@app/typesense-nestjs-lib/storages';
import { CollectionFieldSchema, FieldType } from 'typesense/lib/Typesense/Collection';

import { TypesenseFieldOptions } from '../types';

export function Prop(options?: TypesenseFieldOptions): PropertyDecorator {
    return (target: NonNullable<unknown>, propertyKey: string) => {
        const propertyOptions: CollectionFieldSchema = {
            ...(options || {}),
            name: propertyKey,
            type: (options?.type || 'string') as FieldType,
        };

        TypesenseMetadataStorage.addPropertyMetadata({
            target: target.constructor,
            propertyKey,
            options: propertyOptions,
        });
    };
}
