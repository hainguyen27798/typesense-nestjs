import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import { Type, DynamicModule, ForwardReference, OptionalFactoryDependency, InjectionToken } from '@nestjs/common';

export interface TypesenseSyncOptions {
    imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
    useFactory: (...args: any[]) => ConfigurationOptions | Promise<ConfigurationOptions>;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
}
