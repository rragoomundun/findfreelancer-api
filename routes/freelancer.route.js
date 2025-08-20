import express from 'express';

import {
  getMe,
  updateIdentity,
  updateSecurity,
  deleteAccount,
  updateGeneral,
  updatePresentation,
  updateSkills,
  updateExperiences,
  updateEducation
} from '../controllers/freelancer.controller.js';

import {
  identityValidator,
  securityValidator,
  generalValidator,
  skillsValidator,
  experiencesValidator,
  educationValidator
} from '../validators/freelancer.validator.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router
  .get('/', authenticateMiddleware, getMe)
  .put('/settings/identity', authenticateMiddleware, identityValidator, updateIdentity)
  .put('/settings/security', authenticateMiddleware, securityValidator, updateSecurity)
  .delete('/', authenticateMiddleware, deleteAccount)
  .put('/profile/general', authenticateMiddleware, generalValidator, updateGeneral)
  .put('/profile/presentation', authenticateMiddleware, updatePresentation)
  .put('/profile/skills', authenticateMiddleware, skillsValidator, updateSkills)
  .put('/profile/experiences', authenticateMiddleware, experiencesValidator, updateExperiences)
  .put('/profile/education', authenticateMiddleware, educationValidator, updateEducation);

export default router;
