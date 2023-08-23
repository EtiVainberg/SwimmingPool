import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { userDocument } from "../user.schema";

export type SatisfactionDocument = Satisfaction & Document;

@Schema()
export class Satisfaction {

    @Prop({ required: true })
    Service: number;

    @Prop({ required: true })
    Availability: number;

    @Prop({ required: true })
    Cleanly: number;

    @Prop({ required: true })
    lessons: number;

    @Prop({ required: true })
    Staff: number;

    @Prop({ required: true })
    Date: Date;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    User: Types.ObjectId | userDocument;
}

export const SatisfactionSchema = SchemaFactory.createForClass(Satisfaction);