import { TypesenseFieldMetadata } from '../interfaces';
import { TypesenseSchemaOptions } from '../types';

export interface TypesenseSchemaMetadata {
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Function;
    options?: TypesenseSchemaOptions;
    properties?: TypesenseFieldMetadata[];
}
