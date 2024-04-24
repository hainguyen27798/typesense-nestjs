import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Document } from 'bson';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

import { TypesenseSyncOptions } from './interfaces';
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
    static forFeature<TSchema extends Document = Document>(schema: CollectionCreateSchema): DynamicModule {
        const provider: Provider[] = TypesenseFeatureProvider<TSchema>(schema);
        return {
            module: TypesenseNestModule,
            providers: provider,
            exports: provider,
        };
    }
}
