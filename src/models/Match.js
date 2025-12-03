const { v4: uuidv4 } = require('uuid');

// In-memory storage
const matches = new Map();

class Match {
  constructor(player1Id, player2Id, level) {
    this.id = uuidv4();
    this.player1Id = player1Id;
    this.player2Id = player2Id;
    this.level = level;
    this.status = 'active'; // active, completed
    this.questions = [];
    this.player1Answers = null;
    this.player2Answers = null;
    this.player1Score = 0;
    this.player2Score = 0;
    this.player1CompletedAt = null;
    this.player2CompletedAt = null;
    this.winnerId = null;
    this.createdAt = new Date();
  }

  static create(player1Id, player2Id, level) {
    const match = new Match(player1Id, player2Id, level);
    matches.set(match.id, match);
    return match;
  }

  static findById(matchId) {
    return matches.get(matchId);
  }

  static findAll() {
    return Array.from(matches.values());
  }

  static update(matchId, updates) {
    const match = matches.get(matchId);
    if (!match) return null;
    
    Object.assign(match, updates);
    matches.set(matchId, match);
    return match;
  }

  static findActiveByPlayer(playerId) {
    return Array.from(matches.values()).find(
      match => 
        (match.player1Id === playerId || match.player2Id === playerId) &&
        match.status === 'active'
    );
  }

  isComplete() {
    return this.player1Answers !== null && this.player2Answers !== null;
  }

  toJSON() {
    return {
      id: this.id,
      player1Id: this.player1Id,
      player2Id: this.player2Id,
      level: this.level,
      status: this.status,
      player1Score: this.player1Score,
      player2Score: this.player2Score,
      winnerId: this.winnerId,
      createdAt: this.createdAt
    };
  }
}

module.exports = Match;