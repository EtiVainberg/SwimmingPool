import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Types } from 'mongoose';
import { User } from '../user.schema';
import { Courses } from '../courses/courses';
import { ApiProperty } from '@nestjs/swagger';

export type EnrollmentDocument = Enrollment & Document;

@Schema()
export class Enrollment {

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | User;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'Courses', required: true })
  course: Types.ObjectId | Courses;

  @ApiProperty()
  @Prop({ required: true })
  registrationDate: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
