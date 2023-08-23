import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user.schema';
import { Courses } from '../courses/courses';

export type EmailDocument = Email & Document;

@Schema()
export class Email {
  
}

export const EmailSchema = SchemaFactory.createForClass(Email);
