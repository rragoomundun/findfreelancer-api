import express from 'express';

import { getMe, updateIdentity, updateSecurity } from '../controllers/freelancer.controller.js';

import { identityValidator, securityValidator } from '../validators/freelancer.validator.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router
  .get('/', authenticateMiddleware, getMe)
  .put('/settings/identity', authenticateMiddleware, identityValidator, updateIdentity)
  .put('/settings/security', authenticateMiddleware, securityValidator, updateSecurity);

export default router;
