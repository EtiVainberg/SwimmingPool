import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user.schema';
import { Courses } from '../courses/courses';

export type EnrollmentDocument = Enrollment & Document;

@Schema()
export class Enrollment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'Courses', required: true })
  course: Types.ObjectId | Courses;

  @Prop({ required: true })
  registrationDate: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
