import { useState, useEffect } from "react";
import "../../styles/QuestionModal.css";

export default function QuestionModal({ question, onSave, onClose }) {
    const [qData, setQData] = useState({
        text: "",
        type: "SingleChoice",
        options: ["", ""],
        correctOptionIndexes: [],
        correctAnswerText: "",
        points: 1,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (question) setQData(question);
    }, [question]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (idx, value) => {
        const newOpts = [...qData.options];
        newOpts[idx] = value;
        setQData((prev) => ({ ...prev, options: newOpts }));
    };

    const addOption = () => setQData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    const removeOption = (idx) => setQData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== idx),
        correctOptionIndexes: prev.correctOptionIndexes.filter(i => i !== idx)
    }));

    const handleCorrectIndexChange = (idx) => {
        setQData((prev) => {
            let newIndexes = [...prev.correctOptionIndexes];
            if (newIndexes.includes(idx)) {
                newIndexes = newIndexes.filter(i => i !== idx);
            } else {
                newIndexes.push(idx);
            }
            return { ...prev, correctOptionIndexes: newIndexes };
        });
    };

    const validate = () => {
        const errs = {};
        if (!qData.text.trim()) errs.text = "Question text is required";

        if (qData.type === "FillInTheBlank") {
            if (!qData.correctAnswerText.trim()) errs.correctAnswerText = "Answer is required";
            qData.type = "FillIn";
        } else {
            if (!qData.options.length || qData.options.some(o => !o.trim())) errs.options = "All options are required";
            if (!qData.correctOptionIndexes.length) errs.correctOptionIndexes = "At least one correct option required";
        }

        if (!qData.points || qData.points <= 0) errs.points = "Points must be greater than 0";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        onSave(qData, question?.index);
    };

    return (
        <div className="question-modal-backdrop">
            <div className="question-modal">
                <h2>{question ? "Edit Question" : "Add Question"}</h2>

                <input
                    name="text"
                    value={qData.text}
                    placeholder="Question text"
                    onChange={handleChange}
                />
                {errors.text && <p className="error">{errors.text}</p>}

                <select
                    name="type"
                    value={qData.type}
                    onChange={handleChange}
                >
                    <option value="SingleChoice">Single Choice</option>
                    <option value="MultipleChoice">Multiple Choice</option>
                    <option value="TrueFalse">True/False</option>
                    <option value="FillInTheBlank">Fill in</option>
                </select>

                <input
                    name="points"
                    type="number"
                    value={qData.points}
                    onChange={handleChange}
                />
                {errors.points && <p className="error">{errors.points}</p>}

                {qData.type !== "FillInTheBlank" && (
                    <div className="options-list">
                        <h3>Options</h3>
                        {qData.options.map((opt, idx) => (
                            <div key={idx} className="option-item">
                                <input
                                    value={opt}
                                    placeholder={`Option ${idx + 1}`}
                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                />
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={qData.correctOptionIndexes.includes(idx)}
                                        onChange={() => handleCorrectIndexChange(idx)}
                                    /> Correct
                                </label>
                                <button type="button" onClick={() => removeOption(idx)}>X</button>
                            </div>
                        ))}
                        {errors.options && <p className="error">{errors.options}</p>}
                        {errors.correctOptionIndexes && <p className="error">{errors.correctOptionIndexes}</p>}
                        <button type="button" onClick={addOption}>Add Option</button>
                    </div>
                )}

                {qData.type === "FillInTheBlank" && (
                    <input
                        name="correctAnswerText"
                        placeholder="Correct answer text"
                        value={qData.correctAnswerText}
                        onChange={handleChange}
                    />
                )}
                {errors.correctAnswerText && <p className="error">{errors.correctAnswerText}</p>}

                <div className="modal-actions">
                    <button type="button" onClick={handleSave}>Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
