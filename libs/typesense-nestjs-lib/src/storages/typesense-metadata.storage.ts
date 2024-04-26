import { Type } from '@nestjs/common';

import { TypesenseFieldMetadata, TypesenseSchemaMetadata } from '../interfaces';
import { isTargetEqual } from '../utils';

export class TypesenseMetadataStorageHost {
    private schemas = new Array<TypesenseSchemaMetadata>();
    private properties = new Array<TypesenseFieldMetadata>();

    addSchemaMetadata(metadata: TypesenseSchemaMetadata) {
        this.compileClassMetadata(metadata);
        this.schemas.push(metadata);
    }

    addPropertyMetadata(metadata: TypesenseFieldMetadata) {
        this.properties.push(metadata);
    }

    getSchemaMetadataByTarget(target: Type<unknown>): TypesenseSchemaMetadata | undefined {
        return this.schemas.find((item) => item.target === target);
    }

    private compileClassMetadata(metadata: TypesenseSchemaMetadata) {
        const belongsToClass = isTargetEqual.bind(undefined, metadata);

        if (!metadata.properties) {
            metadata.properties = this.getClassFieldsByPredicate(belongsToClass);
        }
    }

    private getClassFieldsByPredicate(belongsToClass: (item: TypesenseFieldMetadata) => boolean) {
        return this.properties.filter(belongsToClass);
    }
}

const typesenseGlobalRef = global as any;

export const TypesenseMetadataStorage: TypesenseMetadataStorageHost =
    typesenseGlobalRef.typesenseMetadataStorageHost ||
    (typesenseGlobalRef.typesenseMetadataStorageHost = new TypesenseMetadataStorageHost());
