import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { UserDocument } from "../user.schema";
import { ApiProperty } from "@nestjs/swagger";

export type SatisfactionDocument = Satisfaction & Document;

@Schema()
export class Satisfaction {

    @ApiProperty()
    @Prop({ required: true })
    Service: number;

    @ApiProperty()
    @Prop({ required: true })
    Availability: number;

    @ApiProperty()
    @Prop({ required: true })
    Cleanly: number;

    @ApiProperty()
    @Prop({ required: true })
    lessons: number;

    @ApiProperty()
    @Prop({ required: true })
    Staff: number;

    @ApiProperty()
    @Prop({ required: true })
    Date: Date;

    @ApiProperty()
    @Prop({ type: Types.ObjectId, ref: 'User' })
    User: Types.ObjectId | UserDocument;
}

export const SatisfactionSchema = SchemaFactory.createForClass(Satisfaction);