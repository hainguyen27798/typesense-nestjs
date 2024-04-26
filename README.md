<div align="center">
    <img src="https://raw.githubusercontent.com/hainguyen27798/typesense-nestjs/main/images/overview.png" width="300px" alt="typesense-nestjs"><br/>
    <h3>Typesense module for NestJS</h3>
</div>

### About Typesense

Typesense is an open-source, typo-tolerant search engine optimized for instant (typically sub-50ms) search-as-you-type experiences and developer productivity.

If you've heard about ElasticSearch or Algolia, a good way to think about Typesense is that it is:
- An open source alternative to Algolia, with some key quirks solved and
- An easier-to-use batteries-included alternative to ElasticSearch

Read more about Typesense at [here](https://typesense.org/docs/overview/what-is-typesense.html)

### Main Feature

| Name                                 | Supported versions |
|--------------------------------------|--------------------|
| Register typesense global            | All versions       |
| Register schema for specified module | All versions       |
| Auto migrate schemas                 | All versions       |
| Auto sync data from MongoDB          | All versions       |
| Import sync module                   | v2.0.0 or later    |
| Define and inject Typesense Schema   | v2.0.0 or later    |

### Install Typesense and MongoDB:

Please follow [this guide](https://github.com/hainguyen27798/typesense-nestjs/blob/main/INSTALL.md) to install and setup necessary services

### Quick start:

**Add necessary dependencies**

```sh
yarn add mongoose @nestjs/mongoose typesense
```

Add ___typesense-nestjs___:

```sh
yarn add typesense-nestjs
```

**Register and config Typesense at ___app.module.ts___**

```ts
import { Module } from '@nestjs/common';
import { TypesenseNestModule } from 'typesense-nestjs';

@Module({
  imports: [
    ...
    TypesenseNestModule.forRootSync({
      useFactory: () => ({
        nodes: [
          {
            host: 'localhost',
            port: 8108,
            protocol: 'http',
          },
        ],
        apiKey: 'your typesense api key',
        logLevel: 'trace',
        retryIntervalSeconds: 2,
        timeoutSeconds: 4,
      }),
    }),
  ],
})
export class AppModule {}
```

**Define new Typesense Schema**

Please create a new schema file. Here's how you can create a new schema file named `product-search.schema.ts` in `product` directory

```ts
// product/product-search.schema.ts

import { Prop, TypesenseSchema, TypesenseSchemaFactory } from 'typesense-nestjs';

@TypesenseSchema({ name: 'products' })
export class ProductSearch {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  category: string;

  @Prop()
  subCategory: string;

  @Prop({ index: false })
  image: string;

  @Prop({ index: false })
  link: string;

  @Prop({ type: 'float' })
  ratings: number;

  @Prop({ type: 'int32' })
  noOfRatings: number;

  @Prop({ type: 'float' })
  discountPrice: number;

  @Prop({ type: 'float' })
  actualPrice: number;
}

export const ProductSearchSchema = TypesenseSchemaFactory.createForClass(ProductSearch);
```

See [Typesense Schema Parameters](https://typesense.org/docs/26.0/api/collections.html#schema-parameters) for all available options for schema, and [Prop Field Parameters](https://typesense.org/docs/26.0/api/collections.html#field-parameters) for all available options for prop.

**Import schema to Typesense**

```ts
// product/product.module.ts

import { TypesenseNestModule } from 'typesense-nestjs';
import { Module } from '@nestjs/common';

import { ProductSearch, ProductSearchSchema } from './schemas/product-search.schema';

@Module({
  imports: [
    ...
    TypesenseNestModule.forFeature({
      name: ProductSearch.name,
      schema: ProductSearchSchema,
    }),
  ],
  ...
})
...
```

**How to sync data from MongoDB**

```ts
// product/product.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectTypesenseModel, TypesenseSearchModel } from 'typesense-nestjs';

import { Product } from './product/schemas/product.schema';
import { ProductSearch } from './product/schemas/product-search.schema';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private readonly _ProductModel: Model<Product>,
        @InjectTypesenseModel(ProductSearch.name)
        private readonly _ProductSearchCollection: TypesenseSearchModel<ProductSearch>,
    ) {
        this._ProductModel.watch().on('change', async (e) => {
            await this._ProductSearchCollection.syncData(e);
        });
    }
}
```

The code above will update data
