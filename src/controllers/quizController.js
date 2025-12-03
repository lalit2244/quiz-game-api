const Match = require('../models/Match');
const Player = require('../models/Player');
const questionGenerator = require('../utils/questionGenerator');
const ScoringService = require('../services/scoringService');

class QuizController {
  /**
   * Get quiz questions for a match
   * GET /api/quiz/:matchId
   */
  async getQuizQuestions(req, res) {
    try {
      const { matchId } = req.params;

      const match = Match.findById(matchId);
      
      if (!match) {
        return res.status(404).json({
          success: false,
          error: 'Match not found'
        });
      }

      // Generate questions if not already generated
      if (match.questions.length === 0) {
        const questions = questionGenerator.generateQuestions(match.level, 10);
        match.questions = questions;
        Match.update(matchId, { questions });
      }

      // Return questions without correct answers
      const questionsForClient = match.questions.map(q => q.toJSON(false));

      res.json({
        success: true,
        matchId: match.id,
        level: match.level,
        totalQuestions: questionsForClient.length,
        questions: questionsForClient
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Submit quiz answers
   * POST /api/quiz/submit
   */
  async submitAnswers(req, res) {
    try {
      const { matchId, playerId, answers } = req.body;

      const match = Match.findById(matchId);
      
      if (!match) {
        return res.status(404).json({
          success: false,
          error: 'Match not found'
        });
      }

      const player = Player.findById(playerId);
      if (!player) {
        return res.status(404).json({
          success: false,
          error: 'Player not found'
        });
      }

      // Verify player is part of this match
      if (match.player1Id !== playerId && match.player2Id !== playerId) {
        return res.status(403).json({
          success: false,
          error: 'Player is not part of this match'
        });
      }

      // Check if player already submitted
      const isPlayer1 = match.player1Id === playerId;
      if ((isPlayer1 && match.player1Answers) || (!isPlayer1 && match.player2Answers)) {
        return res.status(400).json({
          success: false,
          error: 'Answers already submitted for this player'
        });
      }

      // Record submission time
      const completedAt = new Date();

      // Calculate score
      const { correctCount, score } = ScoringService.calculateScore(
        match.questions,
        answers,
        completedAt,
        match.createdAt
      );

      // Store answers and score
      const updates = isPlayer1 ? {
        player1Answers: answers,
        player1Score: score,
        player1CompletedAt: completedAt
      } : {
        player2Answers: answers,
        player2Score: score,
        player2CompletedAt: completedAt
      };

      Match.update(matchId, updates);

      // Update player stats
      Player.update(playerId, {
        gamesPlayed: player.gamesPlayed + 1
      });

      res.json({
        success: true,
        message: 'Answers submitted successfully',
        result: {
          correctAnswers: correctCount,
          totalQuestions: match.questions.length,
          score: score,
          completedAt: completedAt
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new QuizController();