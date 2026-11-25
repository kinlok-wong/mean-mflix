
import { getUserModel, type User } from './auth.model';

import type { HydratedDocument } from 'mongoose';

// Fields allowed when creating a user
export type CreateUserInput = Pick<
  User,
  'email' | 'displayName'
> &
  Partial<
    Pick<
      User,
      | 'passwordHash'
      | 'googleId'
      | 'avatarUrl'
      | 'emailVerified'
      | 'isActive'
    >
  >;

// Fields allowed when updating a user
export type UpdateUserInput = Partial<
  Pick<
    User,
    | 'displayName'
    | 'passwordHash'
    | 'googleId'
    | 'avatarUrl'
    | 'emailVerified'
    | 'isActive'
  >
>;

type UserDocument = HydratedDocument<User>;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Find user by email (password hash excluded by default)
export async function findByEmail(
  email: string
): Promise<UserDocument | null> {
  return getUserModel()
    .findOne({ email: normalizeEmail(email) })
    .exec();
}

// Find user by email including password hash.
// Only use this when verifying a local login.
export async function findByEmailWithPassword(
  email: string
): Promise<UserDocument | null> {
  return getUserModel()
    .findOne({ email: normalizeEmail(email) })
    .select('+passwordHash')
    .exec();
}

// Find user by Google account ID
export async function findByGoogleId(
  googleId: string
): Promise<UserDocument | null> {
  return getUserModel()
    .findOne({ googleId })
    .exec();
}

// Find user by MongoDB ObjectId
export async function findById(
  id: string
): Promise<UserDocument | null> {
  return getUserModel()
    .findById(id)
    .exec();
}

// Create a new user
export async function createUser(
  input: CreateUserInput
): Promise<UserDocument> {
  const UserModel = getUserModel();

  return UserModel.create({
    ...input,
    email: normalizeEmail(input.email),
  });
}

// Update an existing user
export async function updateUser(
  id: string,
  updates: UpdateUserInput
): Promise<UserDocument | null> {
  return getUserModel()
    .findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    )
    .exec();
}
