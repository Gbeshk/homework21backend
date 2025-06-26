import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  gender: string;

  @Prop({
    type: String,
    required: true,
  })
  phoneNumber: string;

  @Prop({
    type: String,
    required: true,
  })
  subscriptionStartDate: string;
  @Prop({
    type: String,
    required: true,
  })
  subscriptionEndDate: string;

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: 'expenses',
    default: [],
  })
  expenses: mongoose.Types.ObjectId[];
}

export const userSchema = SchemaFactory.createForClass(User);
