import { Provider } from '@nestjs/common';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';

import { TYPESENSE_NEST_CLIENT, TYPESENSE_NEST_OPTIONS } from '../constants';
import { TypesenseSyncOptions } from '../interfaces';
import { TypesenseCoreSync } from './typesense-core-sync';

export const TypesenseCoreSyncProvider = (options: TypesenseSyncOptions): Provider[] => [
    {
        provide: TYPESENSE_NEST_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
    },
    {
        inject: [TYPESENSE_NEST_OPTIONS],
        provide: TYPESENSE_NEST_CLIENT,
        useFactory: async (options: ConfigurationOptions) => {
            return await TypesenseCoreSync.init(options);
        },
    },
];
