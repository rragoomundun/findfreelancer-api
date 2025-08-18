import express from 'express';

import { getMe, updateIdentity } from '../controllers/freelancer.controller.js';

import { identityValidator } from '../validators/freelancer.validator.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router
  .get('/', authenticateMiddleware, getMe)
  .put('/settings/identity', authenticateMiddleware, identityValidator, updateIdentity);

export default router;
