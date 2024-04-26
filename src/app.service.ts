import { InjectTypesenseModel, TypesenseSearchModel } from '@app/typesense-nestjs-lib';
import { Injectable } from '@nestjs/common';

import { Product } from './schemas/product.schema';

@Injectable()
export class AppService {
    constructor(@InjectTypesenseModel(Product.name) private readonly productModel: TypesenseSearchModel<Product>) {}
}
