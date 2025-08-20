import express from 'express';

import { upload } from '../files/upload.js';

import { deleteFile, uploadFile } from '../controllers/file.controller.js';

import { fileUploadValidator, fileDeleteValidator } from '../validators/file.validator.js';

import authenticateMiddleware from '../middlewares/authenticate.middleware.js';

const router = express.Router();

router
  .post('/', authenticateMiddleware, upload.single('file'), fileUploadValidator, uploadFile)
  .delete('/', authenticateMiddleware, fileDeleteValidator, deleteFile);

export default router;
