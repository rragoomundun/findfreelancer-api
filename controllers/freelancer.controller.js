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
 * @api {GET} /freelancer/general Get General Information
 * @apiGroup Freelancer
 * @apiName FreelancerGetGeneral
 *
 * @apiDescription Get freelancer general information.
 *
 * @apiSuccess (Success (200)) {String} image The freelancer's profile picture
 * @apiSuccess (Success (200)) {String} town The freelancer's town
 * @apiSuccess (Success (200)) {String} countryCode The freelancer's country code
 * @apiSuccess (Success (200)) {String} hourlyRate The freelancer's hourly rate
 *
 * @apiPermission Private
 */
const getGeneral = async (req, res) => {
  const { _id } = req.freelancer;
  const freelancer = await Freelancer.findById(_id).select({
    _id: 0,
    image: 1,
    hourlyRate: 1,
    location: 1
  });

  res.status(httpStatus.OK).json({
    image: freelancer.image,
    hourlyRate: freelancer.hourlyRate,
    town: freelancer.location.town,
    countryCode: freelancer.location.countryCode
  });
};

/**
 * @api {GET} /freelancer/presentation Get Presentation Information
 * @apiGroup Freelancer
 * @apiName FreelancerGetPresentation
 *
 * @apiDescription Get freelancer's presentation information.
 *
 * @apiSuccess (Success (200)) {String} title The freelancer's title
 * @apiSuccess (Success (200)) {String} presentationText The freelancer's presentation text
 *
 * @apiPermission Private
 */
const getPresentation = async (req, res) => {
  const { _id } = req.freelancer;
  const freelancer = await Freelancer.findById(_id).select({
    _id: 0,
    title: 1,
    presentationText: 1
  });

  res.status(httpStatus.OK).json({
    title: freelancer.title,
    presentationText: freelancer.presentationText
  });
};

/**
 * @api {GET} /freelancer/skills Get Skills
 * @apiGroup Freelancer
 * @apiName FreelancerGetSkills
 *
 * @apiDescription Get freelancer's skills.
 *
 * @apiSuccess (Success (200)) {String[]} skills The freelancer's skills
 *
 * @apiPermission Private
 */
const getSkills = async (req, res) => {
  const { _id } = req.freelancer;
  const freelancer = await Freelancer.findById(_id).select({
    _id: 0,
    skills: 1
  });

  res.status(httpStatus.OK).json({ skills: freelancer.skills });
};

/**
 * @api {GET} /freelancer/experiences Get Experiences
 * @apiGroup Freelancer
 * @apiName FreelancerGetExperiences
 *
 * @apiDescription Get freelancer's experiences.
 *
 * @apiSuccess (Success (200)) {String} title The experience title
 * @apiSuccess (Success (200)) {String} organization The organization
 * @apiSuccess (Success (200)) {String} town The town
 * @apiSuccess (Success (200)) {String} countryCode The country code
 * @apiSuccess (Success (200)) {Date} startDate The start date of the experience
 * @apiSuccess (Success (200)) {Date} endDate The end date of the experience
 * @apiSuccess (Success (200)) {String} description The description of the experience
 *
 * @apiPermission Private
 */
const getExperiences = async (req, res) => {
  const { _id } = req.freelancer;
  const freelancer = await Freelancer.findById(_id).select({
    _id: 0,
    experiences: 1
  });

  freelancer.experiences = freelancer.experiences.sort((experience1, experience2) => {
    if (experience1.endDate < experience2.endDate || experience2.endDate === null) {
      return 1;
    } else if (experience1.endDate > experience2.endDate) {
      return -1;
    }

    return 0;
  });

  res.status(httpStatus.OK).json(freelancer.experiences);
};

/**
 * @api {GET} /freelancer/education Get Education
 * @apiGroup Freelancer
 * @apiName FreelancerGetEducation
 *
 * @apiDescription Get freelancer's education.
 *
 * @apiSuccess (Success (200)) {String} school The school
 * @apiSuccess (Success (200)) {String} town The town
 * @apiSuccess (Success (200)) {String} countryCode The country Code
 * @apiSuccess (Success (200)) {Date} startDate The start date
 * @apiSuccess (Success (200)) {Date} endDate The end date
 * @apiSuccess (Success (200)) {String} description The description of the education
 *
 * @apiPermission Private
 */
const getEducation = async (req, res) => {
  const { _id } = req.freelancer;
  const freelancer = await Freelancer.findById(_id).select({
    _id: 0,
    educations: 1
  });

  freelancer.educations = freelancer.educations.sort((education1, education2) => {
    if (education1.endDate < education2.endDate || education2.endDate === null) {
      return 1;
    } else if (education1.endDate > education2.endDate) {
      return -1;
    }

    return 0;
  });

  res.status(httpStatus.OK).json(freelancer.educations);
};

/**
 * @api {GET} /freelancer/languages Get Languages
 * @apiGroup Freelancer
 * @apiName FreelancerGetLanguages
 *
 * @apiDescription Get freelancer's languages.
 *
 * @apiSuccess (Success (200)) {String} code The language's code
 * @apiSuccess (Success (200)) {String} level The language's level
 *
 * @apiPermission Private
 */
const getLanguages = async (req, res) => {
  const { _id } = req.freelancer;
  const freelancer = await Freelancer.findById(_id).select({
    _id: 0,
    languages: 1
  });

  res.status(httpStatus.OK).json(freelancer.languages);
};

/**
 * @api {GET} /freelancer/contact Get Contact
 * @apiGroup Freelancer
 * @apiName FreelancerGetContact
 *
 * @apiDescription Get freelancer's contact information.
 *
 * @apiSuccess (Success (200)) {String} email The contact email
 * @apiSuccess (Success (200)) {String} phone The contact phone number
 *
 * @apiPermission Private
 */
const getContact = async (req, res) => {
  const { _id } = req.freelancer;
  const freelancer = await Freelancer.findById(_id).select({
    _id: 0,
    contact: 1
  });

  res.status(httpStatus.OK).json({
    ...freelancer.contact
  });
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
};
