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
