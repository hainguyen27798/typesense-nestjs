import { Inject } from '@nestjs/common';

export const InjectTypesenseModel = (model: string) => Inject(model);
