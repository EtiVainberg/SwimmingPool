import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from './user.schema';
import { ApiProperty } from "@nestjs/swagger";

export type CreditDetailsDocument = CreditDetails & Document;


@Schema()
export class CreditDetails {
    
    @ApiProperty()
    @Prop({ required: true })
    nameCard: string;


    @ApiProperty()
    @Prop({ required: true })
    cardNumber: string;


    @ApiProperty()
    @Prop({ required: true })
    expDate: Date;


    @ApiProperty()
    @Prop({ required: true })
    cvv: string;


    @ApiProperty()
    @Prop({ type: Types.ObjectId, ref: 'User', unique: true })
    user: User | string;

}



export const CreditDetailsSchema = SchemaFactory.createForClass(CreditDetails);
