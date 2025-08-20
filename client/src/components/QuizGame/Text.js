// client/src/components/QuizGame/Text.js
const Texts = {
    loading_questions: "Loading questions...",
    no_quiz_selected: "No quiz selected",
    correct_answer_alert: "Correct! Great job!",
    wrong_answer_alert: "Oops! That's not correct.",
    citizen_counter_label: "Citizens:",
    end_title: "Quiz finished!",
    end_summary: (score, total) => `You scored ${score} out of ${total}.`,
    restart: "Restart",
};

export default Texts;
