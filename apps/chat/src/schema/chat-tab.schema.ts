import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'chat_tab' })
export class ChatTab extends Document {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const ChatTabSchema = SchemaFactory.createForClass(ChatTab);
