import express from 'express';

import {
  getMe,
  getFreelancer,
  getFreelancerVisibility,
  getGeneral,
  getPresentation,
  getSkills,
  getExperiences,
  getEducation,
  getLanguages,
  getContact,
  updateIdentity,
  updateSecurity,
  deleteAccount,
  updateGeneral,
  updatePresentation,
  updateSkills,
  updateExperiences,
  updateEducation,
  updateLanguages,
  updateContact
} from '../controllers/freelancer.controller.js';

import {
  identityValidator,
  securityValidator,
  generalValidator,
  skillsValidator,
  experiencesValidator,
  educationValidator,
  languagesValidator,
  contactValidator
} from '../validators/freelancer.validator.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router
  .get('/', authenticateMiddleware, getMe)
  .get('/:id', getFreelancer)
  .get('/:id/visibility', getFreelancerVisibility)
  .get('/general', authenticateMiddleware, getGeneral)
  .get('/presentation', authenticateMiddleware, getPresentation)
  .get('/skills', authenticateMiddleware, getSkills)
  .get('/experiences', authenticateMiddleware, getExperiences)
  .get('/education', authenticateMiddleware, getEducation)
  .get('/languages', authenticateMiddleware, getLanguages)
  .get('/contact', authenticateMiddleware, getContact)
  .put('/settings/identity', authenticateMiddleware, identityValidator, updateIdentity)
  .put('/settings/security', authenticateMiddleware, securityValidator, updateSecurity)
  .delete('/', authenticateMiddleware, deleteAccount)
  .put('/profile/general', authenticateMiddleware, generalValidator, updateGeneral)
  .put('/profile/presentation', authenticateMiddleware, updatePresentation)
  .put('/profile/skills', authenticateMiddleware, skillsValidator, updateSkills)
  .put('/profile/experiences', authenticateMiddleware, experiencesValidator, updateExperiences)
  .put('/profile/education', authenticateMiddleware, educationValidator, updateEducation)
  .put('/profile/languages', authenticateMiddleware, languagesValidator, updateLanguages)
  .put('/profile/contact', authenticateMiddleware, contactValidator, updateContact);

export default router;
