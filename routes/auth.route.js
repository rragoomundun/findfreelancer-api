import express from 'express';

import { register, registerConfirm } from '../controllers/auth.controller.js';

import { registerValidator } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', registerValidator, register).post('/register/confirm/:confirmationToken', registerConfirm);

export default router;
