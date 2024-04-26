import { TypesenseMetadataStorage } from '@app/typesense-nestjs-lib/storages';
import { Type } from '@nestjs/common';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

export class TypesenseSchemaFactory {
    static createForClass<TClass = any>(target: Type<TClass>): CollectionCreateSchema {
        const schemaMetadata = TypesenseMetadataStorage.getSchemaMetadataByTarget(target);
        return {
            ...schemaMetadata.options,
            name: schemaMetadata.options.name,
            fields: schemaMetadata.properties.map((field) => field.options),
        };
    }
}
