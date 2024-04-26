import { Prop, TypesenseSchema, TypesenseSchemaFactory } from '@app/typesense-nestjs-lib';

@TypesenseSchema({ name: 'products' })
export class Product {
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

export const ProductSchema = TypesenseSchemaFactory.createForClass(Product);
