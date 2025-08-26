import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./QuizGame.css";

const Texts = {
    loading: "Loading questions...",
    error: "Failed to load questions.",
    correct: "Correct! Great job!",
    wrong: "Oops! That's not correct.",
    citizens: "Citizens:",
    endTitle: "Quiz finished!",
    endSummary: (score, total) => `You scored ${score} out of ${total}.`,
    restart: "Restart",
};

import civ1 from "../../assets/civ1.png";
import civ2 from "../../assets/civ2.png";
import civ3 from "../../assets/civ3.png";
import gameBg from "../../assets/game_bg.png";

const CIVS = [civ1, civ2, civ3];
const MAX_SPRITES = CIVS.length;

const QuizGame = ({ onFinish }) => {
    const { id } = useParams();
    const quizId = Number(id) > 0 ? Number(id) : 1;

    const [questions, setQuestions] = useState([]);
    const [idx, setIdx] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [citizens, setCitizens] = useState(0);
    const [locked, setLocked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        let cancel = false;

        const load = async () => {
            setLoading(true);
            setLoadError("");
            setQuestions([]);
            setIdx(0);
            setFeedback("");
            setCitizens(0);
            setLocked(false);
            setFinished(false);

            try {
                // NOTE: הקומפוננטה הזו משתמשת ב-/api/quiz/:id שמחזיר correctAnswer כטקסט
                const res = await fetch(`/api/quiz/${quizId}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const list = Array.isArray(data?.questions) ? data.questions : [];
                const normalized = list.map((q) => ({
                    question: q.question ?? "",
                    answers: (q.answers ?? [])
                        .map((a) => String(a ?? "").trim())
                        .filter(Boolean),
                    correctAnswer: String(q.correctAnswer ?? "").trim(),
                }));
                if (!cancel) setQuestions(normalized);
            } catch (e) {
                console.error(e);
                if (!cancel) setLoadError(Texts.error);
            } finally {
                if (!cancel) setLoading(false);
            }
        };

        load();
        return () => {
            cancel = true;
        };
    }, [quizId]);

    const cur = useMemo(() => (questions.length ? questions[idx] : null), [questions, idx]);

    // ✨ NEW: submit the final score to the server
    const submitResult = async (finalScore, quiz) => {
        const token = localStorage.getItem("token");
        if (!token) return; // Guests play without server writes
        try {
            await fetch("/api/game/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    quizId: Number(quiz) || 1,
                    scoreDelta: Number(finalScore) || 0,
                }),
            });
        } catch (e) {
            console.error("Submit result failed:", e);
        }
    };

    if (loading) return <div className="status">{Texts.loading}</div>;
    if (loadError) return <div className="status error">{loadError}</div>;
    if (!cur) return <div className="status">{Texts.loading}</div>;

    const handleClick = (answerText) => {
        if (locked || finished) return;
        setLocked(true);

        const clicked = String(answerText ?? "").trim();
        const correct = String(cur.correctAnswer ?? "").trim();
        const isCorrect = clicked === correct;

        // חישוב לוקאלי – ואז setCitizens + שימוש מיידי בערך החדש
        const nextCitizens = isCorrect ? citizens + 1 : Math.max(citizens - 1, 0);
        setCitizens(nextCitizens);
        setFeedback(isCorrect ? Texts.correct : Texts.wrong);

        setTimeout(() => {
            setFeedback("");
            setLocked(false);

            setIdx((prevIdx) => {
                const next = prevIdx + 1;
                const isLast = next >= questions.length;

                if (!isLast) return next;

                if (!finished) {
                    setFinished(true);
                    submitResult(nextCitizens, quizId); // ← כאן התיקון
                    if (typeof onFinish === "function") {
                        onFinish({ score: nextCitizens, total: questions.length, quizId });
                    }
                }
                return prevIdx;
            });
        }, 800);
    };


    const restart = () => {
        setIdx(0);
        setFeedback("");
        setCitizens(0);
        setLocked(false);
        setFinished(false);
    };

    return (
        <div className="quiz-container">
            <div className="left-side">
                <div className="info-panel">
                    <div className="pill">
                        {Texts.citizens} {citizens}
                    </div>

                    <div className={`feedback ${feedback ? "visible" : ""}`}>{feedback}</div>

                    <div
                        className="game-frame"
                        style={{ backgroundImage: `url(${gameBg})` }}
                    >
                        <div className="citizens-panel">
                            {CIVS.slice(0, Math.min(citizens, MAX_SPRITES)).map((src, i) => (
                                <img key={i} src={src} alt={`Citizen ${i + 1}`} className="citizen-img" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="right-side">
                {finished ? (
                    <div className="end">
                        <h3>{Texts.endTitle}</h3>
                        <p>{Texts.endSummary(citizens, questions.length)}</p>
                        <button className="btn" onClick={restart}>{Texts.restart}</button>
                    </div>
                ) : (
                    <>
                        <div className="question">{cur.question}</div>
                        <div className="answers">
                            {cur.answers.map((ans, i) => (
                                <button
                                    key={i}
                                    className="btn answer"
                                    onClick={() => handleClick(ans)}
                                    disabled={locked}
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
