import "../../styles/QuizPage.css";


export default function QuizAnswers({ question, answer, onSingle, onMultiple, onFill }) {
    return (
        <div className="answers">
            {question.type === "SingleChoice" && (
                <div className="option-group">
                    {question.options.map((opt, i) => (
                        <label key={i} className="option-row">
                            <input
                                type="radio"
                                name={`q-${question.id}`}
                                checked={answer === i}
                                onChange={() => onSingle(question.id, i)}
                            />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            )}

            {question.type === "MultipleChoice" && (
                <div className="option-group">
                    {question.options.map((opt, i) => {
                        const selected = Array.isArray(answer) ? answer.includes(i) : false;
                        return (
                            <label key={i} className="option-row">
                                <input
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => onMultiple(question.id, i)}
                                />
                                <span>{opt}</span>
                            </label>
                        );
                    })}
                </div>
            )}

            {question.type === "TrueFalse" && (
                <div className="option-group">
                    {["True", "False"].map((opt, i) => (
                        <label key={i} className="option-row">
                            <input
                                type="radio"
                                name={`q-${question.id}`}
                                checked={answer === i}
                                onChange={() => onSingle(question.id, i)}
                            />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            )}

            {question.type === "FillInTheBlank" && (
                <input
                    className="fill-input"
                    type="text"
                    placeholder="Type your answer..."
                    value={answer || ""}
                    onChange={(e) => onFill(question.id, e.target.value)}
                />
            )}
        </div>
    );
}
