import React from "react";
import QuizGame from "../../components/QuizGame/QuizGame";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const GamePage = () => {
    return (
        <>
            <Header />
            <main>
                <QuizGame />
            </main>
            <Footer />
        </>
    );
};

export default GamePage;
