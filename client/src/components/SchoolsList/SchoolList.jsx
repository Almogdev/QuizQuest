import React, { useEffect, useMemo, useState } from "react";
import "./SchoolList.css";

/**
 * Expected server response (array):
 * [{ id, rank?, name, city, score, logo }]
 */
const SchoolList = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            try {
                setLoading(true);
                setErr("");
                const res = await fetch("/api/leaderboard");
                if (!res.ok) throw new Error("Failed to fetch leaderboard");
                const data = await res.json();
                if (!isMounted) return;
                setSchools(Array.isArray(data) ? data : []);
            } catch (e) {
                if (isMounted) {
                    setErr(e.message);
                    setSchools([]); // no demo fallback
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        load();
        return () => (isMounted = false);
    }, []);

    // Sort by score desc and assign rank if missing
    const ranked = useMemo(() => {
        const copy = [...schools].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
        return copy.map((s, i) => ({ ...s, rank: s.rank ?? i + 1 }));
    }, [schools]);

    const podium = ranked.slice(0, 3);
    const rest = ranked.slice(3);

    return (
        <section className="lb-container" aria-label="Leaderboard">
            {loading && <div className="lb-status">Loading…</div>}
            {!loading && err && <div className="lb-status lb-error">{err}</div>}

            {/* PODIUM (Top 3) */}
            <div className="lb-podium" dir="rtl">
                {podium[1] && <PodiumCard place={2} school={podium[1]} />}
                {podium[0] && <PodiumCard place={1} school={podium[0]} highlight />}
                {podium[2] && <PodiumCard place={3} school={podium[2]} />}
            </div>

            {/* LIST (4+) */}
            <div className="lb-list" dir="rtl">
                {rest.map((s) => (
                    <RowItem key={s.id ?? s.rank} school={s} />
                ))}
            </div>
        </section>
    );
};

const PodiumCard = ({ place, school = {}, highlight = false }) => {
    const { name = "School name", city = "City", score = 0, logo } = school;

    const placeClass =
        place === 1 ? "gold" : place === 2 ? "silver" : place === 3 ? "bronze" : "";

    return (
        <article className={`podium-card ${placeClass} ${highlight ? "highlight" : ""}`} role="article">
            <div className="rank-badge">{place}</div>
            <Logo logo={logo} name={name} />
            <h3 className="school-name" title={name}>{name}</h3>
            <div className="school-city">{city}</div>
            <div className="school-score">{score.toLocaleString()}</div>
        </article>
    );
};

const RowItem = ({ school = {} }) => {
    const { rank = "-", name = "School name", city = "City", score = 0, logo } = school;
    return (
        <article className="row-item">
            <div className="row-rank">{rank}</div>
            <div className="row-name" title={name}>{name}</div>
            <div className="row-city">{city}</div>
            <div className="row-score">{score.toLocaleString()}</div>
            <div className="row-logo"><Logo small logo={logo} name={name} /></div>
        </article>
    );
};

const Logo = ({ logo, name, small = false }) => {
    if (logo) {
        return (
            <img
                className={`logo ${small ? "logo-sm" : ""}`}
                src={logo}
                alt={`${name} logo`}
                loading="lazy"
            />
        );
    }
    // Fallback avatar with initials
    const initials = (name || "S N")
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className={`logo avatar ${small ? "logo-sm" : ""}`} aria-label={`${name} logo`}>
            {initials}
        </div>
    );
};

export default SchoolList;
