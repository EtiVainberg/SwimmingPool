// ddd.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/Roles/Role.enum';
import { ApiProperty } from '@nestjs/swagger';

export type dddDocument = ddd & Document;

@Schema()
export class ddd {

    @ApiProperty()
    @Prop({ required: true })
    firstName: string;

    @ApiProperty()
    @Prop({ required: true })
    lastName: string;

    @ApiProperty()
    @Prop({ required: true })
    email: string;

    @ApiProperty()
    @Prop({ required: true })
    phone: string;

    @ApiProperty()
    @Prop({ required: true })
    address: string;

    @ApiProperty()
    @Prop({ required: true })
    password: string;

    @ApiProperty()
    @Prop({ required: true })
    role: Role;
}

export const dddSchema = SchemaFactory.createForClass(ddd);
