const Match = require('../models/Match');
const Player = require('../models/Player');

class ScoringService {
  /**
   * Calculate score based on correct answers and completion time
   * @param {Array} questions - Array of Question objects
   * @param {Array} answers - Array of player's answers
   * @param {Date} completedAt - When the player finished
   * @param {Date} startedAt - When the match started
   * @returns {Object} Score details
   */
  calculateScore(questions, answers, completedAt, startedAt) {
    // Count correct answers
    let correctCount = 0;
    
    console.log('\n=== SCORE CALCULATION DEBUG ===');
    console.log('Total Questions:', questions.length);
    console.log('Total Answers:', answers.length);
    
    for (let i = 0; i < questions.length; i++) {
      const isCorrect = questions[i].correctAnswer === answers[i];
      console.log(`Q${i + 1}: Expected="${questions[i].correctAnswer}" Got="${answers[i]}" => ${isCorrect ? '✓' : '✗'}`);
      
      if (isCorrect) {
        correctCount++;
      }
    }
    
    console.log('Correct Answers:', correctCount);

    // Base score: 10 points per correct answer
    let baseScore = correctCount * 10;

    // Calculate time taken (in seconds)
    const timeTaken = (completedAt - startedAt) / 1000;
    console.log('Time Taken (seconds):', Math.round(timeTaken));

    // Speed bonus: faster completion gets bonus points
    let speedBonus = 0;
    if (timeTaken < 30) {
      speedBonus = 50;
    } else if (timeTaken < 60) {
      speedBonus = 40;
    } else if (timeTaken < 120) {
      speedBonus = 30;
    } else if (timeTaken < 180) {
      speedBonus = 20;
    } else if (timeTaken < 300) {
      speedBonus = 10;
    }

    const totalScore = baseScore + speedBonus;
    
    console.log('Base Score:', baseScore);
    console.log('Speed Bonus:', speedBonus);
    console.log('Total Score:', totalScore);
    console.log('=== END DEBUG ===\n');

    return {
      correctCount,
      baseScore,
      speedBonus,
      timeTaken: Math.round(timeTaken),
      score: totalScore
    };
  }

  /**
   * Determine the winner of a match
   * @param {Match} match - The completed match
   */
  determineWinner(match) {
    if (!match.isComplete()) {
      throw new Error('Cannot determine winner: match is not complete');
    }

    let winnerId;

    console.log('\n=== WINNER DETERMINATION ===');
    console.log('Player 1 Score:', match.player1Score);
    console.log('Player 2 Score:', match.player2Score);

    // Compare scores
    if (match.player1Score > match.player2Score) {
      winnerId = match.player1Id;
      console.log('Winner: Player 1 (Higher Score)');
    } else if (match.player2Score > match.player1Score) {
      winnerId = match.player2Id;
      console.log('Winner: Player 2 (Higher Score)');
    } else {
      // Scores are tied, compare completion time
      console.log('Scores tied! Comparing completion time...');
      console.log('Player 1 Completed:', match.player1CompletedAt);
      console.log('Player 2 Completed:', match.player2CompletedAt);
      
      if (match.player1CompletedAt < match.player2CompletedAt) {
        winnerId = match.player1Id;
        console.log('Winner: Player 1 (Faster)');
      } else {
        winnerId = match.player2Id;
        console.log('Winner: Player 2 (Faster)');
      }
    }
    
    console.log('=== END WINNER DETERMINATION ===\n');

    // Update match with winner
    Match.update(match.id, {
      winnerId,
      status: 'completed'
    });

    // Update winner's stats
    const winner = Player.findById(winnerId);
    if (winner) {
      Player.update(winnerId, {
        gamesWon: winner.gamesWon + 1
      });
    }

    console.log(`🏆 Winner: ${winnerId} (Match: ${match.id})`);

    return winnerId;
  }

  /**
   * Get detailed match statistics
   * @param {Match} match - The match to analyze
   * @returns {Object} Detailed statistics
   */
  getMatchStatistics(match) {
    if (!match.isComplete()) {
      return null;
    }

    const player1 = Player.findById(match.player1Id);
    const player2 = Player.findById(match.player2Id);

    const timeDiff = Math.abs(
      (match.player1CompletedAt - match.player2CompletedAt) / 1000
    );

    return {
      matchId: match.id,
      level: match.level,
      player1: {
        id: player1.id,
        name: player1.name,
        score: match.player1Score,
        completionTime: Math.round((match.player1CompletedAt - match.createdAt) / 1000)
      },
      player2: {
        id: player2.id,
        name: player2.name,
        score: match.player2Score,
        completionTime: Math.round((match.player2CompletedAt - match.createdAt) / 1000)
      },
      winner: match.winnerId,
      scoreDifference: Math.abs(match.player1Score - match.player2Score),
      timeDifference: Math.round(timeDiff)
    };
  }
}

module.exports = new ScoringService();