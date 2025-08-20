import httpStatus from 'http-status-codes';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import ErrorResponse from '../classes/ErrorResponse.js';

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

/**
 * @api {POST} /file Upload file
 * @apiGroup File
 * @apiName FileUpload
 *
 * @apiDescription Upload a file to S3. File size is limited to 5 MB.
 *
 * @apiBody {File{5}} file The file to be uploaded.
 *
 * @apiSuccessExample Success Example
 * {
 *   "link": "https://s3.eu-west-1.bucketname.com/freelancers/68a5ac5f23f5568efe176431/1723795173514.jpeg",
 *   "key": "freelancers/68a5ac5f23f5568efe176431/1723795173514.jpeg"
 * }
 *
 * @apiError (Error (400)) INVALID_PARAMETERS The file parameter is invalid
 * @apiError (Error (500)) UPLOAD_FAILED Cannot upload file
 *
 * @apiPermission Private
 */

const uploadFile = async (req, res, next) => {
  const { file } = req;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `freelancers/${req.freelancer._id}/${Date.now()}.${file.mimetype.split('/')[1]}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  try {
    await s3.send(new PutObjectCommand(params));

    res.status(httpStatus.OK).json({
      link: `https://s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Bucket}/${params.Key}`,
      key: params.Key
    });
  } catch (e) {
    console.log(e);
    next(new ErrorResponse('Upload failed', httpStatus.INTERNAL_SERVER_ERROR, 'UPLOAD_FAILED'));
  }
};

export { uploadFile };
