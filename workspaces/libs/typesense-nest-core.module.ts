import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { TypesenseCoreSyncProvider } from './providers';
import { TypesenseSyncOptions } from './types';

@Global()
@Module({})
export class TypesenseNestCoreModule {
    static forRootSync(options: TypesenseSyncOptions): DynamicModule {
        const provider: Provider[] = TypesenseCoreSyncProvider(options);
        return {
            module: TypesenseNestCoreModule,
            imports: options.imports,
            providers: provider,
            exports: provider,
        };
    }
}
