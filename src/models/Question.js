class Question {
  constructor(id, question, options, correctAnswer, level, category) {
    this.id = id;
    this.question = question;
    this.options = options;
    this.correctAnswer = correctAnswer;
    this.level = level;
    this.category = category;
  }

  toJSON(includeAnswer = false) {
    const data = {
      id: this.id,
      question: this.question,
      options: this.options,
      level: this.level,
      category: this.category
    };
    
    if (includeAnswer) {
      data.correctAnswer = this.correctAnswer;
    }
    
    return data;
  }
}

module.exports = Question;