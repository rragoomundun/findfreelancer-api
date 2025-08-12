import express from 'express';

import { register } from '../controllers/auth.controller.js';

import { registerValidator } from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', registerValidator, register);

export default router;
