import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'ai_chats' })
export class AiChat extends Document {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  chatTabId: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const AiChatSchema = SchemaFactory.createForClass(AiChat);
