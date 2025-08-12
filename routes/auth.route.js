import express from 'express';

import {
  register,
  registerConfirm,
  login,
  logout,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller.js';

import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} from '../validators/auth.validator.js';

const router = express.Router();

router
  .post('/register', registerValidator, register)
  .post('/register/confirm/:confirmationToken', registerConfirm)
  .post('/login', loginValidator, login)
  .get('/logout', logout)
  .post('/password/forgot', forgotPasswordValidator, forgotPassword)
  .post('/password/reset/:resetPasswordToken', resetPasswordValidator, resetPassword);

export default router;
