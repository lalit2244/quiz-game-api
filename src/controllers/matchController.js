const Match = require('../models/Match');
const Player = require('../models/Player');
const MatchmakingService = require('../services/matchmakingService');
const ScoringService = require('../services/scoringService');

class MatchController {
  /**
   * Find a match for a player
   * POST /api/match/find
   */
  async findMatch(req, res) {
    try {
      const { playerId } = req.body;

      // Verify player exists
      const player = Player.findById(playerId);
      if (!player) {
        return res.status(404).json({
          success: false,
          error: 'Player not found'
        });
      }

      // Check if player already has an active match
      const existingMatch = Match.findActiveByPlayer(playerId);
      if (existingMatch) {
        return res.status(400).json({
          success: false,
          error: 'Player already in an active match',
          matchId: existingMatch.id
        });
      }

      // Try to find a match
      const match = await MatchmakingService.findMatch(playerId, player.level);

      if (match) {
        // Match found!
        res.json({
          success: true,
          message: 'Match found!',
          match: match.toJSON(),
          status: 'matched'
        });
      } else {
        // Player added to queue
        res.json({
          success: true,
          message: 'Added to matchmaking queue. Waiting for opponent...',
          status: 'queued',
          level: player.level
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get match details
   * GET /api/match/:matchId
   */
  async getMatch(req, res) {
    try {
      const { matchId } = req.params;

      const match = Match.findById(matchId);
      
      if (!match) {
        return res.status(404).json({
          success: false,
          error: 'Match not found'
        });
      }

      // Get player details
      const player1 = Player.findById(match.player1Id);
      const player2 = Player.findById(match.player2Id);

      res.json({
        success: true,
        match: {
          ...match.toJSON(),
          player1: player1 ? { id: player1.id, name: player1.name } : null,
          player2: player2 ? { id: player2.id, name: player2.name } : null
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get match result and determine winner
   * GET /api/match/result/:matchId
   */
  async getMatchResult(req, res) {
    try {
      const { matchId } = req.params;

      const match = Match.findById(matchId);
      
      if (!match) {
        return res.status(404).json({
          success: false,
          error: 'Match not found'
        });
      }

      if (!match.isComplete()) {
        return res.status(400).json({
          success: false,
          error: 'Match is not complete yet. Both players must submit answers.'
        });
      }

      // Calculate winner if not already done
      if (!match.winnerId) {
        ScoringService.determineWinner(match);
      }

      const player1 = Player.findById(match.player1Id);
      const player2 = Player.findById(match.player2Id);
      const winner = Player.findById(match.winnerId);

      res.json({
        success: true,
        result: {
          matchId: match.id,
          status: match.status,
          player1: {
            id: player1.id,
            name: player1.name,
            score: match.player1Score,
            completedAt: match.player1CompletedAt
          },
          player2: {
            id: player2.id,
            name: player2.name,
            score: match.player2Score,
            completedAt: match.player2CompletedAt
          },
          winner: {
            id: winner.id,
            name: winner.name,
            score: match.winnerId === match.player1Id ? match.player1Score : match.player2Score
          }
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

module.exports = new MatchController();