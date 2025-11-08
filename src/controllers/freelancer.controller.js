import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';

import Freelancer from '../models/Freelancer.js';

import { isFreelancerPublic } from '../utils/freelancer.util.js';

import ErrorResponse from '../classes/ErrorResponse.js';

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
 * @api {GET} /freelancer/:id Get Freelancer
 * @apiGroup Freelancer
 * @apiName FreelancerGetFreelancer
 *
 * @apiDescription Get a specific freelancer.
 *
 * @apiParam {String} id The freelancer's id
 *
 * @apiSuccess (Success (200)) {String} _id The freelancer's id
 * @apiSuccess (Success (200)) {String} email The freelancer's email
 * @apiSuccess (Success (200)) {String} firstName The freelancer's first name
 * @apiSuccess (Success (200)) {String} lastName The freelancer's last name
 * @apiSuccess (Success (200)) {String} image The freelancer's profile picture
 * @apiSuccess (Success (200)) {Object} location The freelancer's location
 * @apiSuccess (Success (200)) {Number} hourlyRate The freelancer's hourly rate
 * @apiSuccess (Success (200)) {String} title The freelancer's title
 * @apiSuccess (Success (200)) {String} presentationText The freelancer's presentation text
 * @apiSuccess (Success (200)) {String[]} skills The freelancer's skills
 * @apiSuccess (Success (200)) {Object[]} experiences The freelancer's experiences
 * @apiSuccess (Success (200)) {Object[]} education The freelancer's educations
 * @apiSuccess (Success (200)) {Object[]} languages The freelancer's spoken languages
 * @apiSuccess (Success (200)) {Object} contact The freelancer's contact information
 *
 * @apiPermission Public
 */
const getFreelancer = async (req, res) => {
  const { id } = req.params;

  try {
    const freelancer = await Freelancer.findOne({
      _id: id,
      'location.town': { $exists: true, $ne: '' },
      'location.countryCode': { $exists: true, $ne: '' },
      hourlyRate: { $exists: true, $ne: '' },
      title: { $exists: true, $ne: '' },
      presentationText: { $exists: true, $ne: '' },
      $or: [{ 'contact.email': { $exists: true, $ne: '' } }, { 'contact.phone': { $exists: true, $ne: '' } }]
    }).select({
      _id: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
      image: 1,
      location: 1,
      hourlyRate: 1,
      title: 1,
      presentationText: 1,
      skills: 1,
      experiences: 1,
      educations: 1,
      languages: 1,
      contact: 1
    });

    if (freelancer === null || isFreelancerPublic(freelancer) === false) {
      throw new Error();
    }

    freelancer.experiences = freelancer.experiences.sort((experience1, experience2) => {
      if (experience1.endDate < experience2.endDate || experience2.endDate === null) {
        return 1;
      } else if (experience1.endDate > experience2.endDate) {
        return -1;
      }

      return 0;
    });

    freelancer.educations = freelancer.educations.sort((education1, education2) => {
      if (education1.endDate < education2.endDate || education2.endDate === null) {
        return 1;
      } else if (education1.endDate > education2.endDate) {
        return -1;
      }

      return 0;
    });

    res.status(httpStatus.OK).json(freelancer);
  } catch {
    throw new ErrorResponse('Not found', httpStatus.NOT_FOUND, 'NOT_FOUND');
  }
};

/**
 * @api {GET} /freelancer/:id/visibility Get Freelancer Visibility
 * @apiGroup Freelancer
 * @apiName FreelancerGetVisibility
 *
 * @apiDescription Get a freelancer visibility.
 *
 * @apiParam {String} id The freelancer's id
 *
 * @apiSuccess (Success (200)) {Boolean} visible Indicate if the freelancer is visible
 * @apiSuccess (Success (200)) {Boolean} missing.location.town Indicate if town is filled
 * @apiSuccess (Success (200)) {Boolean} missing.location.countryCode Indicate if the country is filled
 * @apiSuccess (Success (200)) {Boolean} missing.hourlyRate Indicate if the hourly rate is filled
 * @apiSuccess (Success (200)) {Boolean} missing.title Indicate if the title is filled
 * @apiSuccess (Success (200)) {Boolean} missing.presentationText Indicate if the presentation text is filled
 * @apiSuccess (Success (200)) {Boolean} missing.contact Indicate if the contact informations are filled
 *
 * @apiPermission Public
 */
const getFreelancerVisibility = async (req, res) => {
  const { id } = req.params;

  try {
    const freelancer = await Freelancer.findById(id);

    if (freelancer === null) {
      throw new Error();
    }

    const data = {
      visible: isFreelancerPublic(freelancer) ? true : false,
      missing: {}
    };

    if (!freelancer.location) {
      data.missing.location = { town: true, countryCode: true };
    } else {
      data.missing.location = {};

      if (!freelancer.location.town) {
        data.missing.location.town = true;
      }

      if (!freelancer.location.countryCode) {
        data.missing.location.countryCode = true;
      }
    }

    if (!freelancer.hourlyRate) {
      data.missing.hourlyRate = true;
    }

    if (!freelancer.title) {
      data.missing.title = true;
    }

    if (!freelancer.presentationText) {
      data.missing.presentationText = true;
    }

    if (!freelancer.contact) {
      data.missing.contact = true;
    } else {
      data.missing.contact = {};

      if (!freelancer.contact.email) {
        data.missing.contact.email = true;
      }

      if (!freelancer.contact.phone) {
        data.missing.contact.phone = true;
      }
    }

    res.status(httpStatus.OK).json(data);
  } catch {
    throw new ErrorResponse('Not found', httpStatus.NOT_FOUND, 'NOT_FOUND');
  }
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
    if (!experience1.endDate) return -1;
    if (!experience2.endDate) return 1;

    return new Date(experience2.endDate).getTime() - new Date(experience1.endDate).getTime();
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
    if (!education1.endDate) return -1;
    if (!education2.endDate) return 1;

    return new Date(education2.endDate).getTime() - new Date(education1.endDate).getTime();
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
 * @api {POST} /freelancer/profile/experience Create Experience
 * @apiGroup Freelancer
 * @apiName FreelancerCreateExperience
 *
 * @apiDescription Create a new experience
 *
 * @apiBody {String} title The experience title
 * @apiBody {String} organization The organization where the experience happened
 * @apiBody {String} town The town where the experience happened
 * @apiBody {String} countryCode The country code of where the experience happened
 * @apiBody {Date} startDate The start date of the experience
 * @apiBody {Date} [endDate] The end date of the experience
 * @apiBody {String} description The description of the experience
 *
 * @apiSuccess (Success (200)) {String} _id The created experience id
 * @apiSuccess (Success (200)) {String} organization The created experience organization
 * @apiSuccess (Success (200)) {String} town The created experience town
 * @apiSuccess (Success (200)) {String} countryCode The created experience country code
 * @apiSuccess (Success (200)) {Date} startDate The created experience start date
 * @apiSuccess (Success (200)) {Date} endDate The created experience end date
 * @apiSuccess (Success (200)) {String} description The created experience description
 *
 * @apiSuccessExample Success Example
 * {
 *   "_id": "68ba9eb02a28ce5490e0e17f",
 *   "title": "Backend PHP Developer",
 *   "organization": "BackPHP",
 *   "town": "Belfort",
 *   "countryCode": "FR",
 *   "startDate": "2020-01-01",
 *   "endDate": "2023-08-01",
 *   "description": "Lorem ipsum... experience de developpement web a Belfort"
 * }
 *
 * @apiPermission Private
 */
const createExperience = async (req, res) => {
  const { _id } = req.freelancer;
  const { title, organization, town, countryCode, startDate, endDate, description } = req.body;
  const newExperience = {
    _id: new Types.ObjectId(),
    title,
    organization,
    town,
    countryCode,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
    description
  };

  await Freelancer.updateOne(
    { _id },
    {
      $push: {
        experiences: newExperience
      }
    }
  );

  res.status(httpStatus.OK).json(newExperience);
};

/**
 * @api {PUT} /freelancer/profile/experience/:id Update Experience
 * @apiGroup Freelancer
 * @apiName FreelancerUpdateExperience
 *
 * @apiDescription Update a freelancer's experience
 *
 * @apiParam {String} id The experience id
 *
 * @apiBody {String} title The experience title
 * @apiBody {String} organization The organization where the experience happened
 * @apiBody {String} town The town where the experience happened
 * @apiBody {String} countryCode The country code of where the experience happened
 * @apiBody {Date} startDate The start date of the experience
 * @apiBody {Date} [endDate] The end date of the experience
 * @apiBody {String} description The description of the experience
 *
 * @apiPermission Private
 */

const updateExperience = async (req, res) => {
  const { _id } = req.freelancer;
  const { id } = req.params;
  const { title, organization, town, countryCode, description } = req.body;
  let { startDate, endDate } = req.body;

  startDate = new Date(startDate);

  if (endDate) {
    endDate = new Date(endDate);
  } else {
    endDate = null;
  }

  await Freelancer.updateMany(
    { _id, 'experiences._id': id },
    {
      $set: {
        'experiences.$.title': title,
        'experiences.$.organization': organization,
        'experiences.$.town': town,
        'experiences.$.countryCode': countryCode,
        'experiences.$.description': description,
        'experiences.$.startDate': startDate,
        'experiences.$.endDate': endDate
      }
    }
  );

  res.status(httpStatus.OK).end();
};

/**
 * @api {DELETE} /freelancer/profile/experience/:id Delete Experience
 * @apiGroup Freelancer
 * @apiName FreelancerDeleteExperience
 *
 * @apiDescription Delete a freelancer's experience
 *
 * @apiParam {String} id The experience id
 *
 * @apiPermission Private
 */
const deleteExperience = async (req, res) => {
  const { _id } = req.freelancer;
  const { id } = req.params;

  await Freelancer.updateOne({ _id }, { $pull: { experiences: { _id: id } } });

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
 * @api {POST} /freelancer/profile/education Create Education
 * @apiGroup Freelancer
 * @apiName FreelancerCreateEducation
 *
 * @apiDescription Create an education.
 *
 * @apiBody {String} school The education school
 * @apiBody {String} town The town where the education happeped
 * @apiBody {String} countryCode The country code of where the education happened
 * @apiBody {Date} startDate The start date of the education
 * @apiBody {Date} [endDate] The end date of the education
 * @apiBody {String} description The description of the education
 *
 * @apiSuccess (Success (200)) {String} _id The id of the newly created education
 * @apiSuccess (Success (200)) {String} school The education school
 * @apiSuccess (Success (200)) {String} town The town where the education happeped
 * @apiSuccess (Success (200)) {String} countryCode The country code of where the education happened
 * @apiSuccess (Success (200)) {Date} startDate The start date of the education
 * @apiSuccess (Success (200)) {Date} endDate The end date of the education
 * @apiSuccess (Success (200)) {String} description The description of the education
 *
 * @apiSuccessExample Success Example
 * {
 *   "_id": "68ba9eb02a28ce5490e0e17f",
 *   "school": "University of Portsmouth",
 *   "town": "Portmsouth",
 *   "countryCode": "GB",
 *   "startDate": "2020-01-01",
 *   "endDate": "2023-08-01",
 *   "description": "Lorem ipsum... education at portsmouth"
 * }
 */
const createEducation = async (req, res) => {
  const { _id } = req.freelancer;
  const { school, town, countryCode, startDate, endDate, description } = req.body;
  const newEducation = {
    _id: new Types.ObjectId(),
    school,
    town,
    countryCode,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
    description
  };

  await Freelancer.updateOne(
    { _id },
    {
      $push: {
        educations: newEducation
      }
    }
  );

  res.status(httpStatus.OK).json(newEducation);
};

/**
 * @api {PUT} /freelancer/profile/education/:id Update Education
 * @apiGroup Freelancer
 * @apiName FreelancerUpdateEducation
 *
 * @apiDescription Update an education.
 *
 * @apiParam {String} id The education id
 *
 * @apiBody {String} school The education school
 * @apiBody {String} town The town where the education happeped
 * @apiBody {String} countryCode The country code of where the education happened
 * @apiBody {Date} startDate The start date of the education
 * @apiBody {Date} [endDate] The end date of the education
 * @apiBody {String} description The description of the education
 *
 * @apiPermission Private
 */
const updateEducation = async (req, res) => {
  const { _id } = req.freelancer;
  const { id } = req.params;
  const { school, town, countryCode, description } = req.body;
  let { startDate, endDate } = req.body;

  startDate = new Date(startDate);

  if (endDate) {
    endDate = new Date(endDate);
  } else {
    endDate = null;
  }

  await Freelancer.updateOne(
    { _id, 'educations._id': id },
    {
      $set: {
        'educations.$.school': school,
        'educations.$.town': town,
        'educations.$.countryCode': countryCode,
        'educations.$.description': description,
        'educations.$.startDate': startDate,
        'educations.$.endDate': endDate
      }
    }
  );

  res.status(httpStatus.OK).end();
};

/**
 * @api {PUT} /freelancer/profile/education Update Educations
 * @apiGroup Freelancer
 * @apiName FreelancerUpdateEducations
 *
 * @apiDescription Update a freelancer's educations
 *
 * @apiBody {Object[]} education The education of the freelancer
 *
 * @apiPermission Private
 */
const updateEducations = async (req, res) => {
  const { _id } = req.freelancer;
  const { education } = req.body;

  await Freelancer.findByIdAndUpdate(_id, { educations: education });

  res.status(httpStatus.OK).end();
};

/**
 * @api {DELETE} /freelancer/profile/education/:id Delete Education
 * @apiGroup Freelancer
 * @apiName FreelancerDeleteEducation
 *
 * @apiDescription Delete a freelancer's education
 *
 * @apiParam {String} id The education id
 *
 * @apiPermission Private
 */
const deleteEducation = async (req, res) => {
  const { _id } = req.freelancer;
  const { id } = req.params;

  await Freelancer.updateOne({ _id }, { $pull: { educations: { _id: id } } });

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
};
