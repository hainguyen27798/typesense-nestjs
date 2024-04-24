import { Module } from '@nestjs/common';
import { TypesenseNestModule } from '@app/typesense-nestjs-lib';

@Module({
    imports: [
        TypesenseNestModule.forRootSync({
            useFactory: () => ({
                apiKey: "",
                us
            }),
        }),
    ],
})
export class AppModule {}
