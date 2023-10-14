import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CryptoDocument = HydratedDocument<Crypto>;

@Schema()
export class Crypto {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  privateKey: string;

  @Prop({ required: true })
  currency: string;
}

export const CryptoSchema = SchemaFactory.createForClass(Crypto);
