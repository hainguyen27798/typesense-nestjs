import { TypesenseNestModule } from '@app/typesense-nestjs-lib';
import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
    imports: [
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
        TypesenseNestModule.forFeature({
            name: Product.name,
            schema: ProductSchema,
        }),
    ],
    providers: [AppService],
})
export class AppModule {}
