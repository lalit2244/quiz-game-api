const Question = require('../models/Question');

// Question bank organized by level and category
const questionBank = {
  1: [ // Easy level - FIXED ORDER
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
      category: "Math"
    },
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: "Paris",
      category: "Geography"
    },
    {
      question: "How many days are in a week?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "7",
      category: "General"
    },
    {
      question: "What color is the sky on a clear day?",
      options: ["Green", "Blue", "Red", "Yellow"],
      correctAnswer: "Blue",
      category: "General"
    },
    {
      question: "What is 10 - 5?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "5",
      category: "Math"
    },
    {
      question: "Which animal is known as the 'King of the Jungle'?",
      options: ["Tiger", "Lion", "Elephant", "Bear"],
      correctAnswer: "Lion",
      category: "Science"
    },
    {
      question: "How many sides does a triangle have?",
      options: ["2", "3", "4", "5"],
      correctAnswer: "3",
      category: "Math"
    },
    {
      question: "What is the opposite of hot?",
      options: ["Warm", "Cold", "Cool", "Freezing"],
      correctAnswer: "Cold",
      category: "General"
    },
    {
      question: "What is 3 × 3?",
      options: ["6", "9", "12", "15"],
      correctAnswer: "9",
      category: "Math"
    },
    {
      question: "Which planet is closest to the Sun?",
      options: ["Venus", "Earth", "Mercury", "Mars"],
      correctAnswer: "Mercury",
      category: "Science"
    }
  ],
  2: [ // Medium level
    {
      question: "What is 15 × 4?",
      options: ["45", "50", "60", "75"],
      correctAnswer: "60",
      category: "Math"
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: "William Shakespeare",
      category: "Literature"
    },
    {
      question: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "O2", "N2"],
      correctAnswer: "H2O",
      category: "Science"
    },
    {
      question: "In which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: "1945",
      category: "History"
    },
    {
      question: "What is the square root of 144?",
      options: ["10", "11", "12", "13"],
      correctAnswer: "12",
      category: "Math"
    },
    {
      question: "Which ocean is the largest?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctAnswer: "Pacific",
      category: "Geography"
    },
    {
      question: "What is 25% of 200?",
      options: ["25", "50", "75", "100"],
      correctAnswer: "50",
      category: "Math"
    },
    {
      question: "How many bones are in the human body?",
      options: ["186", "206", "226", "246"],
      correctAnswer: "206",
      category: "Science"
    },
    {
      question: "What is the capital of Japan?",
      options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
      correctAnswer: "Tokyo",
      category: "Geography"
    },
    {
      question: "What is 72 ÷ 8?",
      options: ["7", "8", "9", "10"],
      correctAnswer: "9",
      category: "Math"
    }
  ]
};

// Fill other levels
questionBank[3] = questionBank[2];
questionBank[4] = questionBank[2];
questionBank[5] = questionBank[2];
questionBank[6] = questionBank[2];
questionBank[7] = questionBank[2];
questionBank[8] = questionBank[2];
questionBank[9] = questionBank[2];
questionBank[10] = questionBank[2];

class QuestionGenerator {
  /**
   * Generate questions for a specific level - SAME ORDER ALWAYS
   * @param {number} level - Difficulty level (1-10)
   * @param {number} count - Number of questions to generate
   * @returns {Array<Question>} Array of Question objects
   */
  generateQuestions(level, count = 10) {
    const levelQuestions = questionBank[level] || questionBank[1];
    
    // Take first 'count' questions WITHOUT shuffling
    // This ensures both players get same questions in same order
    const selected = levelQuestions.slice(0, count);
    
    // Convert to Question objects with IDs
    return selected.map((q, index) => 
      new Question(
        index + 1,
        q.question,
        q.options,
        q.correctAnswer,
        level,
        q.category
      )
    );
  }

  /**
   * Get question by ID from a specific question set
   * @param {Array<Question>} questions - Array of questions
   * @param {number} questionId - Question ID
   * @returns {Question|null} Question object or null
   */
  getQuestionById(questions, questionId) {
    return questions.find(q => q.id === questionId) || null;
  }
}

module.exports = new QuestionGenerator();