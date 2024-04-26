import { Provider } from '@nestjs/common';
import { Client } from 'typesense';

import { TYPESENSE_NEST_CLIENT } from '../constants';
import { TypesenseModelDefinition } from '../interfaces';
import { TypesenseFeature } from './typesense-feature';

export function TypesenseFeatureProvider(model: TypesenseModelDefinition): Provider[] {
    return [
        {
            provide: model.name,
            inject: [TYPESENSE_NEST_CLIENT],
            useFactory: (client: Client) => new TypesenseFeature(client, model),
        },
    ];
}
