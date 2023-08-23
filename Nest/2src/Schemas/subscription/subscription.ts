import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { userDocument } from "../user.schema";

export type SubscriptionDocument = Subscription & Document;

export enum SubscriptionType {
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Yearly = "Yearly",
}

export function getPrice(type: SubscriptionType): number {
  console.log(type);
  
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
    
    @Prop({ required: true })
    SubscriptionType: SubscriptionType;

    @Prop({ required: true })
    StartDate: Date;

    @Prop({ required: true })
    EndDate: Date;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    User: Types.ObjectId | userDocument;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);