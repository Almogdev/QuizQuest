import React, { useState } from "react";

const QuizGame = () => {
  const questions = [
    {
        id: 1,
      question: "What is the capital of France?",
      answers: ["Berlin", "Madrid", "Paris", "Rome"],
      correct: 2, // אינדקס התשובה הנכונה
    },
    {
        id: 2,
      question: "What is 5 + 3?",
      answers: ["5", "8", "10", "15"],
      correct: 1,
    },
    {
        id: 3,
      question: "What color is the sky?",
      answers: ["Blue", "Green", "Red", "Yellow"],
      correct: 0,
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [citizens, setCitizens] = useState(1);

  const handleAnswer = (index) => {
    if (index === questions[currentQuestion].correct) {
      setCitizens((prev) => prev + 1); // תשובה נכונה - מוסיפים אזרח
    }

    // עוברים לשאלה הבאה אם יש עוד שאלות
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      alert(`Great job! You finished the quiz with ${citizens} citizens!`);
      setCurrentQuestion(0);
      setCitizens(1); // מאפסים למשחק חדש
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Quiz Game</h1>
      <p>Citizens: {citizens}</p>
      <h2>{questions[currentQuestion].id + '. ' + questions[currentQuestion].question}</h2>
      <div>
        {questions[currentQuestion].answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            style={{
              margin: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizGame;
