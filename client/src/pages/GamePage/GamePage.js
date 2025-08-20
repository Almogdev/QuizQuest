import React from "react";
import { useParams } from "react-router-dom";
import QuizGame from "../../components/QuizGame/QuizGame";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const GamePage = () => {
    const { id } = useParams(); // קבלת ה-id מה-URL

    return (
        <>
            <Header />
            <main>
                <QuizGame quizId={id} /> {/* שולחים את ה-id ל-QuizGame */}
            </main>
            <Footer />
        </>
    );
};

export default GamePage;
