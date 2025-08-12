import express from 'express';

import { register, registerConfirm, login, logout, forgotPassword } from '../controllers/auth.controller.js';

import { registerValidator, loginValidator, forgotPasswordValidator } from '../validators/auth.validator.js';

const router = express.Router();

router
  .post('/register', registerValidator, register)
  .post('/register/confirm/:confirmationToken', registerConfirm)
  .post('/login', loginValidator, login)
  .get('/logout', logout)
  .post('/password/forgot', forgotPasswordValidator, forgotPassword);

export default router;
