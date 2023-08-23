import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/Roles/Role.enum';
import { Enrollment } from './Enrollment/enrollment';

export type userDocument = User & Document;

@Schema()
export class User {

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    role: Role

}

export const UserSchema = SchemaFactory.createForClass(User);