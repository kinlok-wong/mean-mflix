
import * as argon2 from 'argon2';

import type { RegisterInput } from './auth.schema';
import { findByEmail, createUser } from './auth.repository';

import { AppError } from '../../utils/app-error';

export async function registerUser(input: RegisterInput) {
  // 1. Check whether the email already exists
  const existingUser = await findByEmail(input.email);

  if (existingUser) {
    throw new AppError('Email address is already registered', 409);
  }

  // 2. Hash the password using Argon2id
  const passwordHash = await argon2.hash(input.password, {
    type: argon2.argon2id,
  });

  // 3. Create the user in the Application Database
  try {
    const user = await createUser({
      email: input.email,
      displayName: input.displayName,
      passwordHash,
    });

    // 4. Never expose the password hash
    const {
      passwordHash: _passwordHash,
      ...safeUser
    } = user.toObject();

    return safeUser;

  } catch (error) {
    // 5. Handle duplicate email errors caused by concurrent requests
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      throw new AppError('Email address is already registered', 409);
    }

    throw error;
  }
}
