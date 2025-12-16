import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum Role {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
  EXPORT = 'export',
}

@Schema({ collection: 'users', timestamps: true })
export class Users extends Document {
  @Prop({ required: false })
  firstName?: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ required: false, unique: true })
  email?: string;

  @Prop({ required: true, unique: true })
  phoneNumber?: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: true, enum: Object.values(Role) })
  role: Role;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: false, default: false })
  isDeleted?: boolean;

  @Prop({ required: false })
  avatar?: string;

  @Prop({ required: false })
  nationalId?: number;

  @Prop({ type: Types.ObjectId, ref: Users.name })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Users.name })
  updatedBy: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(Users);
