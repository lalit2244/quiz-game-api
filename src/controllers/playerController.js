const Player = require('../models/Player');

class PlayerController {
  /**
   * Register a new player
   * POST /api/players/register
   */
  async registerPlayer(req, res) {
    try {
      const { name, level } = req.body;

      // Create new player
      const player = Player.create(name, level);

      res.status(201).json({
        success: true,
        message: 'Player registered successfully',
        player: player.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get player by ID
   * GET /api/players/:playerId
   */
  async getPlayer(req, res) {
    try {
      const { playerId } = req.params;

      const player = Player.findById(playerId);
      
      if (!player) {
        return res.status(404).json({
          success: false,
          error: 'Player not found'
        });
      }

      res.json({
        success: true,
        player: player.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new PlayerController();