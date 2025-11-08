import express from 'express';

import { searchFreelancers } from '../controllers/search.controller.js';

const router = express.Router();

router.get('/freelancer', searchFreelancers);

export default router;
