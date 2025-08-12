import express from 'express';

import { register, registerConfirm, login } from '../controllers/auth.controller.js';

import { registerValidator, loginValidator } from '../validators/auth.validator.js';

const router = express.Router();

router
  .post('/register', registerValidator, register)
  .post('/register/confirm/:confirmationToken', registerConfirm)
  .post('/login', loginValidator, login);

export default router;
