import { Provider } from '@nestjs/common';
import { Document } from 'bson';
import { Client } from 'typesense';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

import { TYPESENSE_NEST_CLIENT } from '../constants';
import { TypesenseFeature } from './typesense-feature';

export function TypesenseFeatureProvider<TSchema extends Document = Document>(
    schema: CollectionCreateSchema,
): Provider[] {
    return [
        {
            provide: schema.name,
            inject: [TYPESENSE_NEST_CLIENT],
            useFactory: (client: Client) => new TypesenseFeature<TSchema>(client, schema),
        },
    ];
}
