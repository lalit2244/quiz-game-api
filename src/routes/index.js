const express = require('express');
const { body, param, validationResult } = require('express-validator');
const playerController = require('../controllers/playerController');
const matchController = require('../controllers/matchController');
const quizController = require('../controllers/quizController');

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Player routes
router.post(
  '/players/register',
  [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('level').isInt({ min: 1, max: 10 }).withMessage('Level must be between 1 and 10'),
  ],
  validate,
  playerController.registerPlayer
);

router.get('/players/:playerId', playerController.getPlayer);

// Match routes
router.post(
  '/match/find',
  [
    body('playerId').notEmpty().withMessage('Player ID is required'),
  ],
  validate,
  matchController.findMatch
);

router.get(
  '/match/:matchId',
  [
    param('matchId').notEmpty().withMessage('Match ID is required'),
  ],
  validate,
  matchController.getMatch
);

router.get(
  '/match/result/:matchId',
  [
    param('matchId').notEmpty().withMessage('Match ID is required'),
  ],
  validate,
  matchController.getMatchResult
);

// Quiz routes
router.get(
  '/quiz/:matchId',
  [
    param('matchId').notEmpty().withMessage('Match ID is required'),
  ],
  validate,
  quizController.getQuizQuestions
);

router.post(
  '/quiz/submit',
  [
    body('matchId').notEmpty().withMessage('Match ID is required'),
    body('playerId').notEmpty().withMessage('Player ID is required'),
    body('answers').isArray({ min: 10, max: 10 }).withMessage('Must submit exactly 10 answers'),
  ],
  validate,
  quizController.submitAnswers
);

module.exports = router;