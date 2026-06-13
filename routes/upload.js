const authenticate = require('../middleware/auth.js');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3.js');

const router = express.Router();
router.use(authenticate);

const BUCKET_NAME = 'journal-images-jayanta';

// Multer S3 storage config
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const userId = req.userId;
      const fileName = `${userId}/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Upload image and return presigned URL
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const key = req.file.key;

    // Generate presigned URL valid for 15 minutes
    const presignedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key }),
      { expiresIn: 900 }
    );

    res.status(201).json({
      message: 'Image uploaded successfully',
      key,
      presignedUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
