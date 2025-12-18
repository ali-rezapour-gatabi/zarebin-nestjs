import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from './users.schema';

export enum ExperienceYears {
  LESS_THAN_1_YEAR = 'LESS_THAN_1_YEAR',
  ONE_TO_THREE_YEARS = 'ONE_TO_THREE_YEARS',
  THREE_TO_FIVE_YEARS = 'THREE_TO_FIVE_YEARS',
  FIVE_TO_TEN_YEARS = 'FIVE_TO_TEN_YEARS',
  MORE_THAN_TEN_YEARS = 'MORE_THAN_TEN_YEARS',
}

@Schema({ collection: 'experts', timestamps: true })
export class Experts extends Document {
  @Prop({ type: Types.ObjectId, ref: Users.name })
  userId: Types.ObjectId;

  @Prop()
  domains: string;

  @Prop([String])
  subdomains: string[];

  @Prop([String])
  skills: string[];

  @Prop()
  description: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ type: [String] })
  documents: string[];

  @Prop({ type: [String] })
  contactLinks: string[];

  @Prop({ type: [String] })
  contactNumbers: string[];

  @Prop()
  availability?: string;

  @Prop({ type: [String] })
  sampleJob?: string[];

  @Prop({ type: String, enum: Object.values(ExperienceYears) })
  yearsOfExperience?: ExperienceYears;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  location: string;

  @Prop({ type: [String] })
  searchKeywords: string[];

  @Prop({ type: Types.ObjectId, ref: Users.name })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Users.name })
  updatedBy: Types.ObjectId;
}

export const ExpertsSchema = SchemaFactory.createForClass(Experts);
