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
  createExperience,
  updateExperience,
  deleteExperience,
  updateExperiences,
  createEducation,
  updateEducation,
  updateEducations,
  deleteEducation,
  updateLanguages,
  updateContact
} from '../controllers/freelancer.controller.js';

import {
  identityValidator,
  securityValidator,
  generalValidator,
  skillsValidator,
  createExperienceValidator,
  singleExperienceValidator,
  experiencesValidator,
  createEducationValidator,
  singleEducationValidator,
  educationValidator,
  languagesValidator,
  contactValidator
} from '../validators/freelancer.validator.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router
  .get('/', authenticateMiddleware, getMe)
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
  .post('/profile/experience', authenticateMiddleware, createExperienceValidator, createExperience)
  .put('/profile/experience/:id', authenticateMiddleware, singleExperienceValidator, updateExperience)
  .delete('/profile/experience/:id', authenticateMiddleware, deleteExperience)
  .put('/profile/experiences', authenticateMiddleware, experiencesValidator, updateExperiences)
  .post('/profile/education', authenticateMiddleware, createEducationValidator, createEducation)
  .put('/profile/education/:id', authenticateMiddleware, singleEducationValidator, updateEducation)
  .put('/profile/education', authenticateMiddleware, educationValidator, updateEducations)
  .delete('/profile/education/:id', authenticateMiddleware, deleteEducation)
  .put('/profile/languages', authenticateMiddleware, languagesValidator, updateLanguages)
  .put('/profile/contact', authenticateMiddleware, contactValidator, updateContact)
  .get('/:id', getFreelancer)
  .get('/:id/visibility', getFreelancerVisibility);

export default router;
