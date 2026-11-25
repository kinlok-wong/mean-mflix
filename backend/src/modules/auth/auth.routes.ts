
import { Router } from 'express';

import { register } from './auth.controller';
import { registerSchema } from './auth.schema';

import {
  requireJson,
  validateBody,
} from '../../middlewares/validate.middleware';

const router = Router();

router.post(
  '/register',
  requireJson,
  validateBody(registerSchema),
  register
);

export default router;
