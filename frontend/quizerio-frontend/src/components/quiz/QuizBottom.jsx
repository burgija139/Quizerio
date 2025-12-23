import "../../styles/QuizPage.css";

export default function QuizBottom({ onPrev, onNext, isFirst, isLast }) {
  return (
    <div className="quiz-bottom">
      <button className="nav-btn prev" onClick={onPrev} disabled={isFirst}>
        Previous
      </button>

      <button className="nav-btn next" onClick={onNext}>
        {isLast ? "Finish" : "Next"}
      </button>
    </div>
  );
}
