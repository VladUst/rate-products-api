import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<ProductModel>;

class ProductCharacteristics {
	@Prop()
	name: string;

	@Prop()
	value: string;
}

@Schema({ timestamps: true })
export class ProductModel {
	@Prop()
	image: string;

	@Prop()
	title: string;

	@Prop()
	price: number;

	@Prop()
	oldPrice?: number;

	@Prop()
	credit: number;

	@Prop()
	description: string;

	@Prop()
	advantages: string;

	@Prop()
	disadvantages: string;

	@Prop([String])
	categories: string[];

	@Prop([String])
	tags: string[];

	@Prop([ProductCharacteristics])
	characteristics: ProductCharacteristics[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
