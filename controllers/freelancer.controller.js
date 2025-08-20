import httpStatus from 'http-status-codes';

import Freelancer from '../models/Freelancer.js';

/**
 * @api {GET} /freelancer Get Me
 * @apiGroup Freelancer
 * @apiName FreelancerGetMe
 *
 * @apiDescription Get logged in freelancer.
 *
 * @apiSuccess (Success (200)) {String} _id Freelancer's id
 * @apiSuccess (Success (200)) {String} firstName Freelancer's first name
 * @apiSuccess (Success (200)) {String} lastName Freelancer's last name
 * @apiSuccess (Success (200)) {String} email Freelancer's email
 * @apiSuccess (Success (200)) {String} image Freelancer's image
 *
 * @apiError (Error (400)) INVALID_TOKEN Invalid token
 *
 * @apiPermission Private
 */
const getMe = async (req, res) => {
  res.status(httpStatus.OK).json(req.freelancer);
};

/**
 * @api {PUT} /freelancer/settings/identity Update Identity
 * @apiGroup Freelancer
 * @apiName FreelancerSettingsUpdateIdentity
 *
 * @apiDescription Updates a freelancer's identity.
 *
 * @apiBody {String} email Freelancer's login email
 * @apiBody {String} firstName Freelancer's first name
 * @apiBody {String} lastName Freelancer's last name
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Private
 */
const updateIdentity = async (req, res) => {
  const { _id } = req.freelancer;
  const { email, firstName, lastName } = req.body;

  await Freelancer.updateOne({ _id }, { $set: { email, firstName, lastName } });

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /freelancer/settings/security Update Security
 * @apiGroup Freelancer
 * @apiName FreelancerSettingsUpdateSecurity
 *
 * @apiDescription Updates a freelancer's security information.
 *
 * @apiBody {String} password The updated password
 * @apiBody {String} passwordConfirmation The password confirmation
 *
 * @apiError (Error (400)) INVALID_PARAMETERS One or more parameters are invalid
 *
 * @apiPermission Private
 */
const updateSecurity = async (req, res) => {
  const { _id } = req.freelancer;
  const { password } = req.body;
  const freelancer = await Freelancer.findById(_id);

  freelancer.password = password;

  await freelancer.save();

  res.status(httpStatus.OK).end();
};

/**
 * @api {DELETE} /freelancer Delete Account
 * @apiGroup Freelancer
 * @apiName FreelancerDelete
 *
 * @apiDescription Delete freelancer.
 *
 * @apiPermission Private
 */
const deleteAccount = async (req, res) => {
  const { _id } = req.freelancer;

  await Freelancer.findByIdAndDelete(_id);

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /freelancer/profile/general Update General Information
 * @apiGroup Freelancer
 * @apiName FreelancerUpdateGeneral
 *
 * @apiDescription Update a freelancer general profil's information.
 *
 * @apiBody {String} image The freelancer profile picture link
 * @apiBody {String} town The freelancer town
 * @apiBody {String} countryCode The freelancer country code
 * @apiBody {Number} hourlyRate The freelancer hourly rate
 *
 * @apiPermission Private
 */
const updateGeneral = async (req, res) => {
  const { _id } = req.freelancer;
  const { image, town, countryCode, hourlyRate } = req.body;

  await Freelancer.findByIdAndUpdate(_id, { image, location: { town, countryCode }, hourlyRate });

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /freelancer/profile/presentation Update Presentation Information
 * @apiGroup Freelancer
 * @apiName FreelancerUpdatePresentation
 *
 * @apiDescription Update a freelancer presentation profil's information
 *
 * @apiBody {String} title The title of the freelancer
 * @apiBody {String} presentationText The presentation text of the freelancer
 *
 * @apiPermission Private
 */
const updatePresentation = async (req, res) => {
  const { _id } = req.freelancer;
  const { title, presentationText } = req.body;

  await Freelancer.findByIdAndUpdate(_id, { title, presentationText });

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /freelancer/profile/skills Update Skills
 * @apiGroup Freelancer
 * @apiName FreelancerUpdateSkills
 *
 * @apiDescription Update a freelancer skills
 *
 * @apiBody {String[]} skills The skills of the freelancer
 *
 * @apiPermission Private
 */
const updateSkills = async (req, res) => {
  const { _id } = req.freelancer;
  const { skills } = req.body;

  for (let i = 0; i < skills.length; i++) {
    skills[i] = skills[i].toLowerCase();
  }

  await Freelancer.findByIdAndUpdate(_id, { skills });

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /freelancer/profile/experiences Update Experiences
 * @apiGroup Freelancer
 * @apiName FreelancerUpdateExperiences
 *
 * @apiDescription Update a freelancer experiences
 *
 * @apiBody {Object[]} experiences The experiences of the freelancer
 *
 * @apiPermission Private
 */
const updateExperiences = async (req, res) => {
  const { _id } = req.freelancer;
  const { experiences } = req.body;

  await Freelancer.findByIdAndUpdate(_id, { experiences });

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /freelancer/profile/education Update Education
 * @apiGroup Freelancer
 * @apiName FreelancerUpdateEducation
 *
 * @apiDescription Update a freelancer education
 *
 * @apiBody {Object[]} education The education of the freelancer
 *
 * @apiPermission Private
 */
const updateEducation = async (req, res) => {
  const { _id } = req.freelancer;
  const { education } = req.body;

  await Freelancer.findByIdAndUpdate(_id, { educations: education });

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /freelancer/profile/languages Update Languages
 * @apiGroup Freelancer
 * @apiName FreelancerUpdateLanguages
 *
 * @apiDescription Update a freelancer languages
 *
 * @apiBody {Object[]} languages The languages of the freelancer
 *
 * @apiPermission Private
 */
const updateLanguages = async (req, res) => {
  const { _id } = req.freelancer;
  const { languages } = req.body;

  await Freelancer.findByIdAndUpdate(_id, { languages });

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /freelancer/profile/contact Update Contact Information
 * @apiGroup Freelancer
 * @apiName FreelancerUpdateContact
 *
 * @apiDescription Update a freelancer contact information
 *
 * @apiBody {String} email The contact email
 * @apiBody {String} phone The contact phone number
 *
 * @apiPermission Private
 */
const updateContact = async (req, res) => {
  const { _id } = req.freelancer;
  const { email, phone } = req.body;

  await Freelancer.findByIdAndUpdate(_id, { contact: { email, phone } });

  res.status(httpStatus.OK).end();
};

export {
  getMe,
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
};
