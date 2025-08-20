import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./QuizGame.css";

// טקסטים בסיסיים בתוך הקובץ
const Texts = {
    loading_questions: "Loading questions...",
    correct_answer_alert: "Correct! Great job!",
    wrong_answer_alert: "Oops! That's not correct.",
    citizen_counter_label: "Citizens:",
    end_title: "Quiz finished!",
    end_summary: (score, total) => `You scored ${score} out of ${total}.`,
    restart: "Restart",
};

// ספרייטים (ודא שהקבצים קיימים)
import civ1 from "../../assets/civ1.png";
import civ2 from "../../assets/civ2.png";
import civ3 from "../../assets/civ3.png";
const CIVILIANS = [civ1, civ2, civ3];

const QuizGame = ({ onFinish }) => {
    const { id } = useParams();            // /game/:id
    const quizId = Number(id) > 0 ? Number(id) : 1;

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [citizenCount, setCitizenCount] = useState(1);
    const [score, setScore] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        let cancel = false;
        const load = async () => {
            setIsLoading(true);
            setLoadError("");
            setQuestions([]);
            setCurrentIndex(0);
            setFeedback("");
            setCitizenCount(1);
            setScore(0);
            setIsLocked(false);
            setFinished(false);

            try {
                const res = await fetch(`/api/questions/${quizId}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                // מצפים: [{ question, answers: [..], correctAnswerIndex }]
                const normalized = (Array.isArray(data) ? data : []).map((q) => ({
                    question: q.question ?? "",
                    answers: (q.answers ?? []).map((a) => (a == null ? "" : String(a))),
                    correctAnswerIndex: Number(q.correctAnswerIndex ?? 0),
                }));

                if (!cancel) setQuestions(normalized);
            } catch (e) {
                console.error("Failed to fetch questions:", e);
                if (!cancel) setLoadError("Failed to load questions.");
            } finally {
                if (!cancel) setIsLoading(false);
            }
        };
        load();
        return () => { cancel = true; };
    }, [quizId]);

    const currentQuestion = useMemo(
        () => (questions.length ? questions[currentIndex] : null),
        [questions, currentIndex]
    );

    if (isLoading) return <div>{Texts.loading_questions}</div>;
    if (loadError) return <div>{loadError}</div>;
    if (!currentQuestion) return <div>{Texts.loading_questions}</div>;

    const handleAnswerClick = (index) => {
        if (isLocked || finished) return;
        setIsLocked(true);

        const isCorrect = index === currentQuestion.correctAnswerIndex;

        if (isCorrect) {
            setFeedback(Texts.correct_answer_alert);
            setScore((s) => s + 1);
            setCitizenCount((prev) => Math.min(prev + 1, CIVILIANS.length));
        } else {
            setFeedback(Texts.wrong_answer_alert);
            setCitizenCount((prev) => Math.max(prev - 1, 1));
        }

        setTimeout(() => {
            setFeedback("");
            setIsLocked(false);

            setCurrentIndex((prev) => {
                const next = prev + 1;
                if (next < questions.length) return next;

                // סיום
                const finalScore = isCorrect ? score + 1 : score;
                setFinished(true);
                if (typeof onFinish === "function") {
                    onFinish({ score: finalScore, total: questions.length });
                }
                return prev;
            });
        }, 800);
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setFeedback("");
        setCitizenCount(1);
        setScore(0);
        setIsLocked(false);
        setFinished(false);
    };

    return (
        <div className="quiz-container">
            {/* LEFT */}
            <div className="left-side">
                <div className="info-panel">
                    <div className="citizen-count-box">
                        {Texts.citizen_counter_label} {citizenCount}
                    </div>

                    <div className={`feedback-box ${feedback ? "visible" : ""}`}>
                        {feedback}
                    </div>

                    <div className="game-frame">
                        <div className="citizens-panel">
                            {CIVILIANS.slice(0, citizenCount).map((src, idx) => (
                                <img key={idx} src={src} alt={`Citizen ${idx + 1}`} className="citizen-img" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="right-side">
                {finished ? (
                    <div className="end-screen">
                        <h3>{Texts.end_title}</h3>
                        <p>{Texts.end_summary(score, questions.length)}</p>
                        <button className="restart-button" onClick={handleRestart}>
                            {Texts.restart}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="question-box">{currentQuestion.question}</div>
                        <div className="answers-grid">
                            {currentQuestion.answers.map((ans, idx) => (
                                <button
                                    key={idx}
                                    className="answer-button"
                                    onClick={() => handleAnswerClick(idx)}
                                    disabled={isLocked}
                                >
                                    {ans}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuizGame;
