const Match = require('../models/Match');

// Queue to store players waiting for a match
// Structure: Map<level, Set<playerId>>
const matchmakingQueue = new Map();

class MatchmakingService {
  /**
   * Find or create a match for a player
   * @param {string} playerId - The player looking for a match
   * @param {number} level - The player's level
   * @returns {Match|null} - Returns match if found, null if added to queue
   */
  async findMatch(playerId, level) {
    // Get queue for this level
    if (!matchmakingQueue.has(level)) {
      matchmakingQueue.set(level, new Set());
    }
    
    const levelQueue = matchmakingQueue.get(level);
    
    // Check if there's a waiting player at this level
    if (levelQueue.size > 0) {
      // Get the first waiting player
      const waitingPlayerId = Array.from(levelQueue)[0];
      
      // Remove from queue
      levelQueue.delete(waitingPlayerId);
      
      // Create match between the two players
      const match = Match.create(waitingPlayerId, playerId, level);
      
      console.log(`✅ Match created: ${waitingPlayerId} vs ${playerId} (Level ${level})`);
      
      return match;
    } else {
      // No waiting player, add current player to queue
      levelQueue.add(playerId);
      
      console.log(`⏳ Player ${playerId} added to queue (Level ${level})`);
      
      return null;
    }
  }

  /**
   * Remove a player from matchmaking queue
   * @param {string} playerId - The player to remove
   */
  removeFromQueue(playerId) {
    for (const [level, queue] of matchmakingQueue.entries()) {
      if (queue.has(playerId)) {
        queue.delete(playerId);
        console.log(`❌ Player ${playerId} removed from queue (Level ${level})`);
        return true;
      }
    }
    return false;
  }

  /**
   * Get current queue status
   * @returns {Object} Queue statistics
   */
  getQueueStatus() {
    const status = {};
    for (const [level, queue] of matchmakingQueue.entries()) {
      status[`level_${level}`] = queue.size;
    }
    return status;
  }

  /**
   * Clear all queues (for testing/admin purposes)
   */
  clearAllQueues() {
    matchmakingQueue.clear();
    console.log('🧹 All matchmaking queues cleared');
  }
}

module.exports = new MatchmakingService();