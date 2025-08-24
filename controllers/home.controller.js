import httpStatus from 'http-status-codes';

import Freelancer from '../models/Freelancer.js';
import CarouselItem from '../models/CarouselItem.js';

/**
 * @api {GET} /home Get Home
 * @apiGroup Home
 * @apiName HomeGetHome
 *
 * @apiDescription Get data for the home page.
 *
 * @apiSuccess (Success (200)) {Object[]} carousel The carousel's informations
 * @apiSuccess (Success (200)) {Object[]} freelancers Information on the last four freelancers
 *
 * @apiPermission Public
 */
const getHome = async (req, res) => {
  const carousel = await CarouselItem.find().select({ _id: 0, image: 1, imageSmall: 1, routerLink: 1, queryParams: 1 });
  const freelancers = await Freelancer.find()
    .select({ firstName: 1, lastName: 1, image: 1, title: 1, hourlyRate: 1, location: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .limit(6);

  res.status(httpStatus.OK).json({ carousel, freelancers });
};

export { getHome };
