import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { Courses } from "../courses/courses";
import { ApiProperty } from "@nestjs/swagger";

export type ScheduleDocument = Schedule & Document;

@Schema()
export class Schedule {


    @ApiProperty()
    @Prop({ required: true })
    TimeBegin: Date;


    @ApiProperty()
    @Prop({ required: true })
    TimeEnd: Date;


    @ApiProperty()
    @Prop({ type: Types.ObjectId, ref: 'Courses' })
    Course: Types.ObjectId | Courses;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
