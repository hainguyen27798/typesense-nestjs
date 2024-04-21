import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';

export type TypesenseSyncOptions = Pick<ModuleMetadata, 'imports'> &
    Pick<FactoryProvider<ConfigurationOptions>, 'useFactory' | 'inject'>;
