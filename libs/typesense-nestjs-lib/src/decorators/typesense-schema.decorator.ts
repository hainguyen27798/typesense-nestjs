import { TypesenseMetadataStorage } from '@app/typesense-nestjs-lib/storages/typesense-metadata.storage';

import { TypesenseSchemaOptions } from '../types';

export const TypesenseSchema = (options: TypesenseSchemaOptions): ClassDecorator => {
    return (target) => {
        TypesenseMetadataStorage.addSchemaMetadata({
            target,
            options,
        });
    };
};
