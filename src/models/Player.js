const { v4: uuidv4 } = require('uuid');

// In-memory storage (in production, use MongoDB/PostgreSQL)
const players = new Map();

class Player {
  constructor(name, level) {
    this.id = uuidv4();
    this.name = name;
    this.level = level;
    this.createdAt = new Date();
    this.gamesPlayed = 0;
    this.gamesWon = 0;
  }

  static create(name, level) {
    const player = new Player(name, level);
    players.set(player.id, player);
    return player;
  }

  static findById(playerId) {
    return players.get(playerId);
  }

  static findAll() {
    return Array.from(players.values());
  }

  static update(playerId, updates) {
    const player = players.get(playerId);
    if (!player) return null;
    
    Object.assign(player, updates);
    players.set(playerId, player);
    return player;
  }

  static delete(playerId) {
    return players.delete(playerId);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      gamesPlayed: this.gamesPlayed,
      gamesWon: this.gamesWon,
      createdAt: this.createdAt
    };
  }
}

module.exports = Player;