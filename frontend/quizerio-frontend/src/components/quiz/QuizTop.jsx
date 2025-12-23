import "../../styles/QuizPage.css";

export default function QuizTop({ index, total, time }) {
    return (
        <div className="quiz-top">
            <div className="question-counter">
                Question {index + 1} of {total}
            </div>
            <div className="quiz-timer">{time}</div>
        </div>
    );
}
