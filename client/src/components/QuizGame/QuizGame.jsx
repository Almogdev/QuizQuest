import React from "react";
import "./QuizGame.css";

const QuizGame = () => {
    return (
        <div className="quiz-container">
            {/* צד שמאל */}
            <div className="left-panel">
                <div className="citizen-count-box">
                    מספר האזרחים
                </div>

                <div className="feedback-box">
                    הודעה האם ענה נכון או לא
                </div>

                <div className="citizens-row">
                    <div className="citizen-shape">אזרח</div>
                    <div className="citizen-shape">אזרח</div>
                    <div className="citizen-shape">אזרח</div>
                </div>
            </div>

            {/* צד ימין */}
            <div className="right-panel">
                <div className="question-box">
                    שאלה
                </div>

                <div className="answers-grid">
                    <button className="answer-button">תשובה</button>
                    <button className="answer-button">תשובה</button>
                    <button className="answer-button">תשובה</button>
                    <button className="answer-button">תשובה</button>
                </div>
            </div>
        </div>
    );
};

export default QuizGame;
