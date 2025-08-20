import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GameMainMenu.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const GameMainMenu = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("/api/quizzes")
            .then((r) => r.json())
            .then((data) => {
                setQuizzes(data || []);
                setLoading(false);
            })
            .catch((e) => {
                console.error("Error fetching quizzes:", e);
                setLoading(false);
            });
    }, []);

    const filtered = useMemo(() => {
        const s = search.trim().toLowerCase();
        if (!s) return quizzes;
        return quizzes.filter((q) =>
            [q.name, q.category]
                .filter(Boolean)
                .some((v) => v.toLowerCase().includes(s))
        );
    }, [search, quizzes]);

    return (
        <>
            <Header />
            <main className="gm-container">
                {/* Start new quiz (hexagon) */}
                <button
                    className="gm-cta"
                    onClick={() => console.log("Start new quiz clicked")}
                >
                    Start new quiz
                </button>

                {/* Search */}
                <div className="gm-search">
                    <input
                        type="text"
                        placeholder="Search bar"
                        aria-label="Search quizzes"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Library */}
                <section className="gm-library">
                    {loading ? (
                        <div className="gm-empty">Loading…</div>
                    ) : filtered.length === 0 ? (
                        <div className="gm-empty">No quizzes found.</div>
                    ) : (
                        <div className="quiz-grid">
                            {filtered.map((q) => (
                                <button
                                    key={q.id}
                                    className="quiz-card"
                                    onClick={() => navigate(`/game/${q.id}`)}
                                    title={`${q.name} (${q.questions_count || 0} questions)`}
                                >
                                    <img
                                        src={q.image_url || "https://picsum.photos/seed/quiz/600/360"}
                                        alt={q.name}
                                        loading="lazy"
                                    />
                                    <div className="quiz-body">
                                        <h3>{q.name}</h3>
                                        <p>
                                            {(q.category || "General") + " · "}
                                            {(q.difficulty ?? "").toString()} ·{" "}
                                            {(q.questions_count || 0) + " Qs"}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
};

export default GameMainMenu;
