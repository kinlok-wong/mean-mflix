
import type { RequestHandler } from 'express';

import { registerUser } from './auth.service';
import type { RegisterInput } from './auth.schema';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const input = req.body as RegisterInput;

    const user = await registerUser(input);

    res.status(201).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
