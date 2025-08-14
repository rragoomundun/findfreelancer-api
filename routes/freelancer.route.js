import express from 'express';

import { getMe } from '../controllers/freelancer.controller.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router.get('/', authenticateMiddleware, getMe);

export default router;
