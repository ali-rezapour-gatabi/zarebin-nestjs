import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'chat_tab' })
export class ChatTab extends Document {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt: Date;

  @Prop({ required: false })
  deletedAt: Date;

  @Prop({ required: true })
  isDeleted: boolean;
}

export const ChatTabSchema = SchemaFactory.createForClass(ChatTab);
