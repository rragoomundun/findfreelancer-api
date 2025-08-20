import express from 'express';

import { upload } from '../files/upload.js';

import { uploadFile } from '../controllers/file.controller.js';

import { fileUploadValidator } from '../validators/file.validator.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router.post('/', authenticateMiddleware, upload.single('file'), fileUploadValidator, uploadFile);

export default router;
