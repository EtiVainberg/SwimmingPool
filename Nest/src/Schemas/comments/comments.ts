import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { UserDocument } from "../user.schema";
import { ApiProperty } from "@nestjs/swagger";
// import { ApiProperty } from "@nestjs/swagger";

export type CommentsDocument = Comments & Document;

export enum status {
  new = 'new',
  old = 'old',
}

@Schema()
export class Comments {

  @ApiProperty()
  @Prop({ required: false })
  firstName?: string;

  @ApiProperty()
  @Prop({ required: false })
  email?: string;

  @ApiProperty()
  @Prop({ required: false })
  address?: string;

  @ApiProperty()
  @Prop({ required: true })
  content: string;

  @ApiProperty()
  @Prop({ required: false })
  reply: string;

  @ApiProperty()
  @Prop({ required: false, default: status.new })
  statusReply: status;
  
  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  user?: Types.ObjectId | UserDocument;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  to?: Types.ObjectId | UserDocument;

  @ApiProperty()
  @Prop({ required: true })
  date: Date;
  
  @ApiProperty()
  @Prop({ required: false, default: status.new })
  status: status;
}

export const CommentSchema = SchemaFactory.createForClass(Comments);
