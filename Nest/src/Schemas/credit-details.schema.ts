import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from './user.schema';

export type CreditDetailsDocument = CreditDetails & Document;


@Schema()
export class CreditDetails {

    @Prop({ required: true })
    nameCard: string;

    @Prop({ required: true })
    cardNumber: string;

    @Prop({ required: true })
    expDate: Date;

    @Prop({ required: true })
    cvv: string;

    @Prop({ type: Types.ObjectId, ref: 'User', unique: true })
    user: User |string;

}



export const CreditDetailsSchema = SchemaFactory.createForClass(CreditDetails);
