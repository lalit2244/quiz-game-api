# 🎮 Quiz Game Matching API

A production-ready RESTful API for a real-time multiplayer quiz game with intelligent level-based matchmaking, synchronized gameplay, and advanced scoring system built with Node.js and Express.

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Testing Guide](#testing-guide)
- [Scoring Algorithm](#scoring-algorithm)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)

## ✨ Features

- **🎯 Smart Matchmaking**: Level-based player pairing with queue management
- **⚡ Real-time Gameplay**: Synchronized 10-question quizzes for matched players
- **🏆 Advanced Scoring**: Combined accuracy and speed-based winner determination
- **🛡️ Input Validation**: Comprehensive request validation using Express Validator
- **🔄 RESTful Design**: Clean API architecture following REST principles
- **📝 Error Handling**: Detailed error messages and proper HTTP status codes
- **🎨 Modular Code**: MVC pattern with service layer separation
- **📊 In-Memory Storage**: Fast data access (easily upgradable to MongoDB/PostgreSQL)

## 🛠️ Tech Stack

- **Runtime**: Node.js v16+
- **Framework**: Express.js 4.18+
- **Validation**: Express Validator 7.0+
- **ID Generation**: UUID v4
- **Architecture**: MVC with Service Layer

## 🏗️ Architecture
```
┌─────────────┐
│   Client    │ (Postman, Frontend, Mobile App)
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│          Express Router             │
│  (Routes + Validation Middleware)   │
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌─────────────┐ ┌─────────────┐
│ Controllers │ │  Services   │
│  (Request   │ │  (Business  │
│   Handling) │ │    Logic)   │
└──────┬──────┘ └──────┬──────┘
       │               │
       └───────┬───────┘
               │
               ▼
        ┌─────────────┐
        │   Models    │
        │   (Data)    │
        └─────────────┘
```

## 📥 Installation

### Prerequisites

- Node.js v16 or higher ([Download here](https://nodejs.org/))
- npm (comes with Node.js)
- Postman ([Download here](https://www.postman.com/downloads/))

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/lalit2244/quiz-game-api.git
cd quiz-game-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the server**
```bash
npm start
```

Server will run at: `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/players/register` | Register a new player |
| GET | `/api/players/:playerId` | Get player details |
| POST | `/api/match/find` | Find or create a match |
| GET | `/api/match/:matchId` | Get match details |
| GET | `/api/quiz/:matchId` | Get quiz questions |
| POST | `/api/quiz/submit` | Submit quiz answers |
| GET | `/api/match/result/:matchId` | Get match winner |

---

### 1. Register Player

**Endpoint:** `POST /api/players/register`

**Request Body:**
```json
{
  "name": "Alice",
  "level": 1
}
```

**Validation:**
- `name`: Required, non-empty string
- `level`: Required, integer between 1-10

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Player registered successfully",
  "player": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Alice",
    "level": 1,
    "gamesPlayed": 0,
    "gamesWon": 0,
    "createdAt": "2025-12-03T10:00:00.000Z"
  }
}
```

---

### 2. Find Match

**Endpoint:** `POST /api/match/find`

**Request Body:**
```json
{
  "playerId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response (Match Found):**
```json
{
  "success": true,
  "message": "Match found!",
  "match": {
    "id": "match-uuid",
    "player1Id": "player1-uuid",
    "player2Id": "player2-uuid",
    "level": 1,
    "status": "active"
  },
  "status": "matched"
}
```

**Response (Queued):**
```json
{
  "success": true,
  "message": "Added to matchmaking queue. Waiting for opponent...",
  "status": "queued",
  "level": 1
}
```

---

### 3. Get Quiz Questions

**Endpoint:** `GET /api/quiz/:matchId`

**Response:**
```json
{
  "success": true,
  "matchId": "match-uuid",
  "level": 1,
  "totalQuestions": 10,
  "questions": [
    {
      "id": 1,
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "level": 1,
      "category": "Math"
    }
    // ... 9 more questions
  ]
}
```

**Note:** Correct answers are NOT included in response (server-side validation)

---

### 4. Submit Answers

**Endpoint:** `POST /api/quiz/submit`

**Request Body:**
```json
{
  "matchId": "match-uuid",
  "playerId": "player-uuid",
  "answers": [
    "4", "Paris", "7", "Blue", "5", 
    "Lion", "3", "Cold", "9", "Mercury"
  ]
}
```

**Validation:**
- Must submit exactly 10 answers
- Player must be part of the match
- Cannot submit twice

**Response:**
```json
{
  "success": true,
  "message": "Answers submitted successfully",
  "result": {
    "correctAnswers": 8,
    "totalQuestions": 10,
    "score": 110,
    "completedAt": "2025-12-03T10:05:30.000Z"
  }
}
```

---

### 5. Get Match Result

**Endpoint:** `GET /api/match/result/:matchId`

**Response:**
```json
{
  "success": true,
  "result": {
    "matchId": "match-uuid",
    "status": "completed",
    "player1": {
      "id": "player1-uuid",
      "name": "Alice",
      "score": 110,
      "completedAt": "2025-12-03T10:05:30.000Z"
    },
    "player2": {
      "id": "player2-uuid",
      "name": "Bob",
      "score": 90,
      "completedAt": "2025-12-03T10:06:00.000Z"
    },
    "winner": {
      "id": "player1-uuid",
      "name": "Alice",
      "score": 110
    }
  }
}
```

**Error Response (Match not complete):**
```json
{
  "success": false,
  "error": "Match is not complete yet. Both players must submit answers."
}
```

## 🧪 Testing Guide

### Using Postman

1. **Import Collection** (Optional)
   - Download the Postman collection from `/postman`
   - Import into Postman

2. **Manual Testing Flow**

**Step 1: Register Players**
```
POST http://localhost:3000/api/players/register
Body: {"name": "Alice", "level": 1}
```
Save Alice's `id`
```
POST http://localhost:3000/api/players/register
Body: {"name": "Bob", "level": 1}
```
Save Bob's `id`

**Step 2: Matchmaking**
```
POST http://localhost:3000/api/match/find
Body: {"playerId": "alice-id"}
```
```
POST http://localhost:3000/api/match/find
Body: {"playerId": "bob-id"}
```
Save the `match.id`

**Step 3: Get Questions**
```
GET http://localhost:3000/api/quiz/match-id
```

**Step 4: Submit Answers**
```
POST http://localhost:3000/api/quiz/submit
Body: {
  "matchId": "match-id",
  "playerId": "alice-id",
  "answers": ["4", "Paris", "7", "Blue", "5", "Lion", "3", "Cold", "9", "Mercury"]
}
```

Repeat for Bob with different/wrong answers

**Step 5: Check Winner**
```
GET http://localhost:3000/api/match/result/match-id
```

### Using cURL
```bash
# Register Player
curl -X POST http://localhost:3000/api/players/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","level":1}'

# Find Match
curl -X POST http://localhost:3000/api/match/find \
  -H "Content-Type: application/json" \
  -d '{"playerId":"player-uuid"}'

# Get Quiz
curl http://localhost:3000/api/quiz/match-uuid

# Submit Answers
curl -X POST http://localhost:3000/api/quiz/submit \
  -H "Content-Type: application/json" \
  -d '{"matchId":"match-uuid","playerId":"player-uuid","answers":["4","Paris","7","Blue","5","Lion","3","Cold","9","Mercury"]}'

# Get Result
curl http://localhost:3000/api/match/result/match-uuid
```

## 🎯 Scoring Algorithm

### Score Calculation
```
Total Score = Base Score + Speed Bonus
```

**Base Score:**
- 10 points per correct answer
- Maximum: 100 points (10/10 correct)

**Speed Bonus:**
| Completion Time | Bonus Points |
|----------------|--------------|
| < 30 seconds | +50 |
| < 1 minute | +40 |
| < 2 minutes | +30 |
| < 3 minutes | +20 |
| < 5 minutes | +10 |
| > 5 minutes | +0 |

**Maximum Score:** 150 points (100 + 50)

### Winner Determination

1. **Primary:** Player with higher total score
2. **Tiebreaker:** Faster completion time

### Examples

| Player | Correct | Time | Base | Bonus | Total | Result |
|--------|---------|------|------|-------|-------|--------|
| Alice | 10/10 | 45s | 100 | 40 | **140** | Winner |
| Bob | 8/10 | 30s | 80 | 50 | 130 | - |

## 📁 Project Structure
```
quiz-game-api/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── playerController.js
│   │   ├── matchController.js
│   │   └── quizController.js
│   ├── models/              # Data models
│   │   ├── Player.js
│   │   ├── Match.js
│   │   └── Question.js
│   ├── services/            # Business logic
│   │   ├── matchmakingService.js
│   │   └── scoringService.js
│   ├── routes/              # API routes
│   │   └── index.js
│   ├── utils/               # Helper functions
│   │   └── questionGenerator.js
│   └── app.js               # Express configuration
├── server.js                # Entry point
├── package.json             # Dependencies
└── README.md               # Documentation
```

### Key Components

**Controllers:** Handle HTTP requests/responses
- Validate input
- Call appropriate services
- Return formatted responses

**Models:** Define data structures
- Player: User information
- Match: Game session data
- Question: Quiz question structure

**Services:** Business logic
- Matchmaking: Queue management, pairing logic
- Scoring: Score calculation, winner determination

**Routes:** API endpoint definitions
- Define HTTP methods and paths
- Apply validation middleware
- Map to controller functions

## 🚀 Future Enhancements

- [ ] **Database Integration** (MongoDB/PostgreSQL)
- [ ] **WebSocket Support** for real-time updates
- [ ] **Authentication** (JWT-based)
- [ ] **Player Rankings** and leaderboards
- [ ] **Multiple Game Modes** (time attack, sudden death)
- [ ] **Admin Panel** for question management
- [ ] **Statistics Dashboard**
- [ ] **Tournament System**
- [ ] **Friend System**
- [ ] **Chat Functionality**

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@lalit2244](https://github.com/lalit2244)
- LinkedIn: [Lalit Patil](https://linkedin.com/in/lalit-patil-330882256)

## 🙏 Acknowledgments

- Built with Express.js
- Inspired by real-time gaming systems
- Created for educational and portfolio purposes

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: lalitpatil6445@gmail.com

---

**⭐ Star this repo if you find it helpful!**

Made with ❤️ and Node.js
