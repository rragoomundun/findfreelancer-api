import express from 'express';

import {
  getMe,
  updateIdentity,
  updateSecurity,
  deleteAccount,
  updateGeneral,
  updatePresentation
} from '../controllers/freelancer.controller.js';

import { identityValidator, securityValidator, generalValidator } from '../validators/freelancer.validator.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router
  .get('/', authenticateMiddleware, getMe)
  .put('/settings/identity', authenticateMiddleware, identityValidator, updateIdentity)
  .put('/settings/security', authenticateMiddleware, securityValidator, updateSecurity)
  .delete('/', authenticateMiddleware, deleteAccount)
  .put('/profile/general', authenticateMiddleware, generalValidator, updateGeneral)
  .put('/profile/presentation', authenticateMiddleware, updatePresentation);

export default router;
