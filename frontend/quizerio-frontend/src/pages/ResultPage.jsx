import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ResultPage.css";

export default function ResultPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const result = location.state?.result;

    if (!result) return <div>Loading...</div>;

    return (
        <div className="result-page">
            <h1>Quiz Result</h1>
            <div className="result-info">
                <p><strong>Score:</strong> {result.score}</p>
                <p><strong>Date Taken:</strong> {new Date(result.takenAt).toLocaleString()}</p>
            </div>
            <table className="result-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Question ID</th>
                        <th>Your Answer</th>
                        <th>Correct Answer</th>
                        <th>Is Correct</th>
                    </tr>
                </thead>
                <tbody>
                    {result.answers.map((ans, idx) => (
                        <tr
                            key={ans.questionId}
                            className={ans.isCorrect ? "correct" : "incorrect"}
                        >
                            <td>{idx + 1}</td>
                            <td>{ans.questionId}</td>
                            <td>{ans.userAnswerText}</td>
                            <td>{ans.correctAnswerText}</td>
                            <td>{ans.isCorrect ? "✔" : "✖"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-row">
                <button className="btn-back" onClick={() => navigate("/")}>
                    Back to Quizzes
                </button>
                <button className="btn-progress" onClick={() => navigate("/result/progress", { state: { result: result } })}>
                    View Progress
                </button>
            </div>
        </div>
    );
}
