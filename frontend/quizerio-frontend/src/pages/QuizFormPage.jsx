import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/QuizForm.css";
import QuestionModal from "../components/question/QuestionModal";

export default function QuizFormPage() {
    const { id } = useParams(); // if id exists => edit, else create
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const userRole = auth.user?.role;

    const [quiz, setQuiz] = useState({
        title: "",
        category: "",
        difficulty: "",
        timeLimit: 10,
        questions: [],
    });


    const [modalOpen, setModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [errors, setErrors] = useState({});

    // fetch quiz if editing
    useEffect(() => {
        if (!id) return;
        const fetchQuiz = async () => {
            try {
                const res = await fetch(`http://localhost:5039/api/Quiz/${id}`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch quiz");
                const data = await res.json();
                setQuiz(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuiz((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddQuestion = () => {
        setEditingQuestion(null);
        setModalOpen(true);
    };

    const handleEditQuestion = (q, index) => {
        setEditingQuestion({ ...q, index });
        setModalOpen(true);
    };

    const handleDeleteQuestion = (index) => {
        setQuiz((prev) => {
            const newQs = [...prev.questions];
            newQs.splice(index, 1);
            return { ...prev, questions: newQs };
        });
    };

    const handleSaveQuestion = (question, index = null) => {
        setQuiz((prev) => {
            const newQs = [...prev.questions];
            if (index !== null) newQs[index] = question;
            else newQs.push(question);
            return { ...prev, questions: newQs };
        });
        setModalOpen(false);
    };

    const validate = () => {
        let errs = {};
        if (!quiz.title.trim()) errs.title = "Title is required";
        if (!quiz.category) errs.category = "Category is required";
        if (!quiz.difficulty) errs.difficulty = "Difficulty is required";
        if (quiz.questions.length === 0) errs.questions = "At least one question is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const method = id ? "PUT" : "POST";
            const url = id ? `http://localhost:5039/api/Quiz/${id}` : "http://localhost:5039/api/Quiz";
            const body = {
                ...quiz,
                questionsCount: quiz.questions.length, // auto calculated
            };
            const payload = {
                Title: quiz.title,
                Category: quiz.category,
                Difficulty: quiz.difficulty,
                QuestionsCount: quiz.questions.length,
                TimeLimit: Number(quiz.timeLimit),
                Questions: quiz.questions.map(q => {
                    const typeMap = {
                        SingleChoice: 0,
                        MultipleChoice: 1,
                        TrueFalse: 2,
                        FillIn: 3,
                    };

                    // Ako nije FillIn, popuni CorrectAnswerText automatski preko indexa
                    const correctAnswerText = q.type === "FillIn"
                        ? q.correctAnswerText
                        : q.correctOptionIndexes.map(i => q.options[i]).join(", ");

                    return {
                        Text: q.text,
                        Type: typeMap[q.type],
                        Options: q.type !== "FillIn" ? q.options : [],
                        CorrectOptionIndexes: q.type !== "FillIn" ? q.correctOptionIndexes : [],
                        CorrectAnswerText: correctAnswerText,
                        Points: Number(q.points)
                    };
                })
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to save quiz");
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Error saving quiz");
        }
    };

    if (userRole !== "Admin") return <div>Access denied</div>;

    return (
        <div className="quiz-form-page">
            <h1>{id ? "Edit Quiz" : "Create Quiz"}</h1>
            <div className="quiz-form">
                <input
                    name="title"
                    value={quiz.title}
                    placeholder="Title"
                    onChange={handleChange}
                />
                {errors.title && <p className="error">{errors.title}</p>}

                {/* Category Dropdown */}
                <select name="category" value={quiz.category} onChange={handleChange}>
                    <option value="">Select Category</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    <option value="Math">Math</option>
                    <option value="Programing">Programing</option>
                    <option value="Sport">Sport</option>
                </select>
                {errors.category && <p className="error">{errors.category}</p>}

                {/* Difficulty Dropdown */}
                <select name="difficulty" value={quiz.difficulty} onChange={handleChange}>
                    <option value="">Select Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
                {errors.difficulty && <p className="error">{errors.difficulty}</p>}

                <input
                    name="timeLimit"
                    type="number"
                    value={quiz.timeLimit}
                    placeholder="Time Limit (minutes)"
                    onChange={handleChange}
                />

                <div className="questions-list">
                    <h2>Questions ({quiz.questions.length})</h2>
                    <button onClick={handleAddQuestion}>Add Question</button>
                    {errors.questions && <p className="error">{errors.questions}</p>}

                    {quiz.questions.map((q, idx) => (
                        <div key={idx} className="question-item">
                            <span>{q.text}</span>
                            <div className="question-actions">
                                <button onClick={() => handleEditQuestion(q, idx)}>Edit</button>
                                <button onClick={() => handleDeleteQuestion(idx)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="save-btn" onClick={handleSubmit}>
                    {id ? "Update Quiz" : "Create Quiz"}
                </button>
            </div>

            {modalOpen && (
                <QuestionModal
                    question={editingQuestion}
                    onSave={handleSaveQuestion}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
}
