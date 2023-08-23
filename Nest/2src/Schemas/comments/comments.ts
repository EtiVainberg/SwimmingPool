import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { userDocument } from "../user.schema";

export type CommentsDocument = Comments & Document;

@Schema()
export class Comments {
  @Prop({ required: false })
  firstName?: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: false })
  address?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  user?: Types.ObjectId | userDocument;

  @Prop({ required: true })
  date: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comments);
