const express = require('express');
const router = express.Router();

const {
  getChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  importChallenges,
} = require('./challenge.controller');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const { protect, admin } = require('../../../middleware/auth');
const { validate } = require('../../../middleware/validate');
const {
  challengeIdParamsSchema,
  challengeCreateSchema,
  challengeUpdateSchema,
  challengeQuerySchema,
} = require('../../../validators/challengeSchemas');

router
  .route('/')
  .get(validate(challengeQuerySchema), getChallenges)
  .post(protect, admin, validate(challengeCreateSchema), createChallenge);

router.post('/import', protect, admin, upload.single('file'), importChallenges);

router
  .route('/:id')
  .get(validate(challengeIdParamsSchema), getChallengeById)
  .put(protect, admin, validate(challengeIdParamsSchema), validate(challengeUpdateSchema), updateChallenge)
  .delete(protect, admin, validate(challengeIdParamsSchema), deleteChallenge);

module.exports = router;

