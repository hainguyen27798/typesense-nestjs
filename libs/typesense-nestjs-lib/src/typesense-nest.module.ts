import { DynamicModule, Module, Provider } from '@nestjs/common';

import { TypesenseModelDefinition, TypesenseSyncOptions } from './interfaces';
import { TypesenseFeatureProvider } from './providers';
import { TypesenseNestCoreModule } from './typesense-nest-core.module';

@Module({})
export class TypesenseNestModule {
    static forRootSync(options: TypesenseSyncOptions): DynamicModule {
        return {
            module: TypesenseNestCoreModule,
            imports: [TypesenseNestCoreModule.forRootSync(options)],
        };
    }
    static forFeature(model: TypesenseModelDefinition): DynamicModule {
        const provider: Provider[] = TypesenseFeatureProvider(model);
        return {
            module: TypesenseNestModule,
            providers: provider,
            exports: provider,
        };
    }
}
