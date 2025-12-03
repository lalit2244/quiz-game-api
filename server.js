const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Quiz Game API Server running on port ${PORT}`);
  console.log(`📍 Base URL: http://localhost:${PORT}`);
  console.log(`\n🎮 Available endpoints:`);
  console.log(`   POST   /api/players/register - Register a player`);
  console.log(`   POST   /api/match/find       - Find a match`);
  console.log(`   GET    /api/quiz/:matchId    - Get quiz questions`);
  console.log(`   POST   /api/quiz/submit      - Submit answers`);
  console.log(`   GET    /api/match/result/:matchId - Get match result`);
  console.log(`\n✨ Server ready! Start testing with Postman or cURL\n`);
});