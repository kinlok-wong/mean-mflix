
import {
  Schema,
  type InferSchemaType,
  type Model,
} from 'mongoose';

import { getAppDatabase } from '../../config/database';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    avatarUrl: {
      type: String,
      trim: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'users',
  }
);

export type User = InferSchemaType<typeof userSchema>;

// Obtain the model from the Application Database connection.
// Do not use mongoose.model(), which uses the default connection.
export function getUserModel(): Model<User> {
  const connection = getAppDatabase();

  return (
    connection.models.User as Model<User> ??
    connection.model<User>('User', userSchema, 'users')
  );
}
