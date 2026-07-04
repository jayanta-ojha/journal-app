const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require('../config/s3.js');

const express = require('express');
const { PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const docClient = require('../config/dynamodb.js');
const authenticate = require('../middleware/auth.js');

const router = express.Router();
router.use(authenticate);

const TABLE_NAME = 'journals';

const BUCKET_NAME = 'journal-images-jayanta';

async function attachPresignedUrl(journal) {
  if (journal.imageKey) {
    journal.imageUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: BUCKET_NAME, Key: journal.imageKey }),
      { expiresIn: 900 }
    );
  }
  return journal;
}


// CREATE journal
router.post('/', async (req, res) => {
  try {
    
    const { title, content, imageKey } = req.body;
    const userId = req.userId;

   if (!title || !content) {
  	return res.status(400).json({ error: 'Title and content are required' });
   }

    const journal = {
  	userId,
  	journalId: uuidv4(),
  	title,
  	content,
  	...(imageKey && { imageKey }),
  	createdAt: new Date().toISOString(),
  	updatedAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: journal,
    }));
    res.status(201).json(journal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create journal' });
  }
});

// GET all journals
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': userId },
    }));
   
    const journals = await Promise.all(result.Items.map(attachPresignedUrl));
    res.status(200).json(journals);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch journals' });
  }
});

// GET single journal
router.get('/:journalId', async (req, res) => {
  try {
    const userId = req.userId;
    const { journalId } = req.params;
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { userId, journalId },
    }));
    if (!result.Item) {
      return res.status(404).json({ error: 'Journal not found' });
    }
    
   const journal = await attachPresignedUrl(result.Item);
   res.status(200).json(journal);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch journal' });
  }
});

// UPDATE journal
router.put('/:journalId', async (req, res) => {
  try {
    const userId = req.userId;
    const { journalId } = req.params;
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await docClient.send(new UpdateCommand({
  TableName: TABLE_NAME,
  Key: { userId, journalId },
  UpdateExpression: 'set title = :t, content = :c, updatedAt = :u' + (req.body.imageKey ? ', imageKey = :i' : ''),
  ExpressionAttributeValues: {
  	':t': title,
  	':c': content,
  	':u': new Date().toISOString(),
  	...(req.body.imageKey && { ':i': req.body.imageKey }),
   },

  ConditionExpression: 'attribute_exists(journalId)',
  ReturnValues: 'ALL_NEW',
}));



    res.status(200).json(result.Attributes);
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return res.status(404).json({ error: 'Journal not found' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update journal' });
  }
});

// DELETE journal
router.delete('/:journalId', async (req, res) => {
  try {
    const userId = req.userId;
    const { journalId } = req.params;
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { userId, journalId },
      ConditionExpression: 'attribute_exists(journalId)',
    }));
    res.status(200).json({ message: 'Journal deleted successfully' });
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return res.status(404).json({ error: 'Journal not found' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to delete journal' });
  }
});

module.exports = router;
