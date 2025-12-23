import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/QuizPage.css";

import QuizTop from "../components/quiz/QuizTop";
import QuizQuestion from "../components/quiz/QuizQuestion";
import QuizAnswers from "../components/quiz/QuizAnswers";
import QuizBottom from "../components/quiz/QuizBottom";

const QUESTION_TYPES = {
    SingleChoice: 0,
    MultipleChoice: 1,
    TrueFalse: 2,
    FillIn: 3,
};

export default function QuizPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const userId = auth.user?.id;

    const [quiz, setQuiz] = useState(null);
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    // Fetch quiz from backend
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch(`http://localhost:5039/api/Quiz/${id}`);
                if (!res.ok) throw new Error("Failed to fetch quiz");
                const data = await res.json();
                setQuiz(data);
                setTimeLeft((data.timeLimit || 10) * 60);
            } catch (err) {
                console.error(err);
                alert("Error fetching quiz data");
            }
        };

        fetchQuiz();
    }, [id]);

    // Timer
    useEffect(() => {
        const t = setInterval(() => {
            setTimeLeft((s) => {
                if (s <= 0) {
                    clearInterval(t);
                    finishQuiz();
                    return 0;
                }
                return s - 1;
            });
        }, 1000);

        return () => clearInterval(t);
    }, []);

    const current = quiz?.questions?.[index];

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // Handlers for answers
    const handleSingle = (qid, optIndex) =>
        setAnswers((prev) => ({ ...prev, [qid]: optIndex }))

    const handleMultiple = (qid, optIndex) =>
        setAnswers((prev) => {
            const prevArr = Array.isArray(prev[qid]) ? prev[qid] : [];
            const exists = prevArr.includes(optIndex);
            const nextArr = exists ? prevArr.filter((i) => i !== optIndex) : [...prevArr, optIndex];
            return { ...prev, [qid]: nextArr };
        });

    const handleFill = (qid, text) =>
        setAnswers((prev) => ({ ...prev, [qid]: text }));

    const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
    const goNext = () => {
        if (!quiz) return;
        if (index < quiz.questions.length - 1) {
            setIndex((i) => i + 1);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        if (!quiz || submitted) return;
        setSubmitted(true);

        alert(JSON.stringify(answers));
        const payload = {
            userId,
            quizId: quiz.id,
            timeLeftSeconds: timeLeft,

            answers: quiz.questions.map((q) => {
                const ans = answers[q.id];
                if (q.type === "MultipleChoice") {
                    return {
                        questionId: q.id,
                        UserAnswer: Array.isArray(ans)
                            ? ans.map(i => q.options[i]).join(",")
                            : "",
                        SelectedOptionIndexes: Array.isArray(ans) ? ans : [],
                    };
                } else if (q.type === "SingleChoice" || q.type === "TrueFalse") {
                    return {
                        questionId: q.id,
                        UserAnswer: typeof ans === "number" ? q.options[ans] : "",
                        SelectedOptionIndexes: typeof ans === "number" ? [ans] : [],
                    };
                } else if (q.type === "FillInTheBlank") {
                    return {
                        questionId: q.id,
                        UserAnswer: ans || "",
                        SelectedOptionIndexes: [],
                    };
                } else {
                    return {
                        questionId: q.id,
                        UserAnswer: "",
                        SelectedOptionIndexes: [],
                    };
                }
            }),
        };

        try {
            const res = await fetch("http://localhost:5039/api/Result/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to submit results");
            const data = await res.json();
            console.log("Result submitted:", data);
            navigate(`/result/${data.id}`, { state: { result: data } });
        } catch (err) {
            console.error(err);
            alert("Error submitting results");
        }
    };

    if (!quiz || !current) return <div>Loading...</div>;
    if (timeLeft <= 0) {
        finishQuiz();
    }

    const isLast = index === quiz.questions.length - 1;

    return (
        <div className="quiz-page">
            <div className="quiz-bubble">
                <QuizTop index={index} total={quiz.questions.length} time={formatTime(timeLeft)} />
                <QuizQuestion text={current.text} />
                <QuizAnswers
                    question={current}
                    answer={answers[current.id]}
                    onSingle={handleSingle}
                    onMultiple={handleMultiple}
                    onFill={handleFill}
                />
                <QuizBottom
                    onPrev={goPrev}
                    onNext={isLast ? finishQuiz : goNext}
                    isFirst={index === 0}
                    isLast={isLast}
                />
            </div>
        </div>
    );
}
