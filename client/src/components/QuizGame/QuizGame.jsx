import React from "react";
import "./QuizGame.css";
import Texts from "./Text";

const QuizGame = () => {
    // ספרייטים של האזרחים (שימוש ב־require)
    const CiviliansSprites = [
        require("../../assets/civ1.png"),
        require("../../assets/civ2.png"),
        require("../../assets/civ3.png"),
    ];


    return (
        <div className="quiz-container">
            <div className="left-side">
                <div className="info-panel">
                    <div className="citizen-count-box">{Texts.citizen_counter}{Texts.citizen_number}</div>
                    <div className="feedback-box">{ }</div>
                    <div className="game-frame">
                        {/* צד שמאל */}
                        <div className="citizens-panel">
                            {CiviliansSprites.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`אזרח ${index + 1}`}
                                    className="citizen-img"
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* צד ימין */}
            <div className="right-side">
                <div className="question-box">כמה זה 2 + 2?</div>
                <div className="answers-grid">
                    <button className="answer-button">1</button>
                    <button className="answer-button">4</button>
                    <button className="answer-button">3</button>
                    <button className="answer-button">2</button>
                </div>
            </div>
        </div>
    );
};

export default QuizGame;
