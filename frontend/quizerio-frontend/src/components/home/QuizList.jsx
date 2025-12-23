import React from "react";
import "../../styles/QuizList.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const QuizList = ({ quizzes }) => {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth); // get user from redux

    const handleStart = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    const handleEdit = (quizId) => {
        navigate(`/quiz/edit/${quizId}`);
    };

    const handleDelete = (quizId) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            fetch(`http://localhost:5039/api/Quiz/${quizId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${auth.token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Failed to delete quiz");
                    }
                    window.location.reload();

                })
                .catch((err) => {
                    console.error(err);
                    alert("Error deleting quiz");
                });
        }
    };


    const getDifficultyColor = (level) => {
        switch (level) {
            case "Easy":
                return "#4caf50";
            case "Medium":
                return "#ffb300";
            case "Hard":
                return "#f44336";
            default:
                return "#999";
        }
    };

    if (!quizzes || quizzes.length === 0) {
        return (
            <div className="quiz-list-container">
                <div className="quiz-list-wrapper">
                    <p style={{ color: "#c0c0ff", textAlign: "center" }}>No quizzes found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-list-container">
            <div className="quiz-list-wrapper">
                {quizzes.map((quiz) => (
                    <div key={quiz.id} className="quiz-card">
                        <div className="quiz-info">
                            <h2 className="quiz-title">{quiz.title}</h2>
                            <p className="quiz-category"><strong>Category:</strong> {quiz.category}</p>
                            <div className="quiz-difficulty">
                                <span
                                    className="difficulty-circle"
                                    style={{ backgroundColor: getDifficultyColor(quiz.difficulty) }}
                                ></span>
                                <span>{quiz.difficulty}</span>
                            </div>
                            <p className="quiz-meta">Questions: {quiz.questionsCount}</p>
                            <p className="quiz-meta">Duration: {quiz.timeLimit}</p>
                        </div>

                        <div className="quiz-actions">
                            <button className="quiz-start-btn" onClick={() => handleStart(quiz.id)}>
                                Start
                            </button>

                            {auth.user?.role === "Admin" && (
                                <>
                                    <button className="quiz-edit-btn" onClick={() => handleEdit(quiz.id)}>
                                        Edit
                                    </button>
                                    <button className="quiz-delete-btn" onClick={() => handleDelete(quiz.id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {auth.user?.role === "Admin" && (
                    <div className="quiz-create-container">
                        <button className="quiz-create-btn" onClick={() => navigate("/quiz/create")}>
                            + Create New Quiz
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizList;
