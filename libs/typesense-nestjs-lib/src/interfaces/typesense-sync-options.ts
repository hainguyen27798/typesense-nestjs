import { DynamicModule, ForwardReference, InjectionToken, OptionalFactoryDependency, Type } from '@nestjs/common';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';

export interface TypesenseSyncOptions {
    imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
    useFactory: (...args: any[]) => ConfigurationOptions | Promise<ConfigurationOptions>;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
}
