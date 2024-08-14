import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { UserDocument } from "../user.schema";
import { ApiProperty } from "@nestjs/swagger";

export type SubscriptionDocument = Subscription & Document;

export enum SubscriptionType {
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Yearly = "Yearly",
}

export function getPrice(type: SubscriptionType): number {
  switch (type) {
    case SubscriptionType.Yearly:
      return 2000;
    case SubscriptionType.Monthly:
      return 500;
    case SubscriptionType.Weekly:
      return 200;
    default:
      throw new Error('Invalid SubscriptionType');
  }
}
@Schema()
export class Subscription {


  @ApiProperty()
  @Prop({ required: true })
  SubscriptionType: SubscriptionType;


  @ApiProperty()
  @Prop({ required: true })
  StartDate: Date;


  @ApiProperty()
  @Prop({ required: true })
  EndDate: Date;


  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User' })
  User: Types.ObjectId | UserDocument;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);