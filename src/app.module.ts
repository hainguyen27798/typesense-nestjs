import { TypesenseNestModule } from '@app/typesense-nestjs-lib';
import { Module } from '@nestjs/common';

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
    ],
})
export class AppModule {}
