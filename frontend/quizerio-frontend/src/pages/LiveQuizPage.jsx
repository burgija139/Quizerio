// src/components/liveArena/LiveQuizPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import "../styles/LiveQuizPage.css";

const LiveQuizPage = () => {
    const { roomId } = useParams();
    var user = JSON.parse(sessionStorage.getItem("user"));
    const [connection, setConnection] = useState(null);
    if (!user) user = JSON.parse(localStorage.getItem("user"));
    const [question, setQuestion] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [startCountdown, setStartCountdown] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [multipleAnswers, setMultipleAnswers] = useState([]);
    const [fillAnswer, setFillAnswer] = useState("");
    const [leaderboard, setLeaderboard] = useState([]);
    const [toast, setToast] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const connect = async () => {
            const hub = new signalR.HubConnectionBuilder()
                .withUrl("http://localhost:5039/arenaHub", {
                    accessTokenFactory: () => localStorage.getItem("token"),
                })
                .withAutomaticReconnect()
                .build();

            hub.on("ReceiveQuestion", (q, duration) => {
                setQuestion(q);
                setCountdown(duration);
                setSelectedAnswer(null);
                setMultipleAnswers([]);
                setFillAnswer("");
                setSubmitted(false);
            });

            hub.on("NextQuestion", (q, duration) => {
                setQuestion(q);
                setCountdown(duration);
                setSelectedAnswer(null);
                setMultipleAnswers([]);
                setFillAnswer("");
            });

            hub.on("QuizFinished", () => {
                console.log("Quiz finished!");
                hub.invoke("SendLeaderboard", parseInt(roomId))
            });

            hub.on("ShowLeaderboard", (leaderboard) => {
                console.log("Leaderboard:", leaderboard);
                setLeaderboard(leaderboard);
                setQuestion(null); // ukloni pitanje
            });

            hub.on("UpdateLeaderboard", (leaderboard) => {
                setLeaderboard(leaderboard);
            });




            hub.on("AnswerChecked", (result) => {
                console.log("Answer result:", result);
                // result.QuestionId
                // result.IsCorrect
                // result.Points
                // result.TimeLeft
            });

            hub.on("UpdateLeaderboard", setLeaderboard);

            hub.on("UserJoined", (u) => showToast(`User ${u.username} joined!`));
            hub.on("QuizStartingIn", setStartCountdown);

            try {
                await hub.start();
                await hub.invoke("JoinRoom", parseInt(roomId), user.id);
            } catch (err) {
                console.error(err);
            }

            setConnection(hub);
        };
        connect();
        return () => { if (connection) connection.stop(); };
    }, [roomId, user?.id]);



    useEffect(() => {
        if (!startCountdown || startCountdown <= 0) return;
        const interval = setInterval(() => setStartCountdown(c => c - 1), 1000);
        return () => clearInterval(interval);
    }, [startCountdown]);

    useEffect(() => {
        if (!countdown || countdown <= 0) return;
        const interval = setInterval(() => setCountdown(c => c - 1), 1000);
        return () => clearInterval(interval);
    }, [countdown]);

    const toggleMultiple = (i) => {
        setMultipleAnswers(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    };

    const sendAnswer = async () => {
        if (!connection || !question || submitted) return;

        let ans;
        if (question.type === "SingleChoice" || question.type === "TrueFalse") ans = selectedAnswer;
        else if (question.type === "MultipleChoice") ans = multipleAnswers;
        else if (question.type === "FillInTheBlank") ans = fillAnswer.trim();
        console.log("roomId =", roomId, "type:", typeof roomId);
        console.log("userId =", user.id, "type:", typeof user.id);
        console.log("questionId =", question.id, "type:", typeof question.id);
        console.log("answer =", ans, "type:", typeof ans);
        console.log("timeLeft =", countdown, "type:", typeof countdown);
        await connection.invoke("SubmitAnswer", parseInt(roomId), user.id, question.id, ans, countdown)
            .catch(err => console.error("SubmitAnswer error:", err));

        setSubmitted(true);
        showToast("Answer submitted!");
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const renderOptions = () => {
        if (!question) return null;

        if (question.type === "SingleChoice" || question.type === "TrueFalse") {
            const opts = question.type === "TrueFalse" ? ["True", "False"] : question.options;
            return opts.map((o, i) => (
                <button
                    key={i}
                    className={`option-btn ${selectedAnswer === i ? "selected" : ""}`}
                    onClick={() => setSelectedAnswer(i)}
                >{o}</button>
            ));
        }

        if (question.type === "MultipleChoice") {
            return question.options.map((o, i) => (
                <button
                    key={i}
                    className={`option-btn ${multipleAnswers.includes(i) ? "selected" : ""}`}
                    onClick={() => toggleMultiple(i)}
                >{o}</button>
            ));
        }

        if (question.type === "FillInTheBlank") {
            return (
                <input
                    type="text"
                    value={fillAnswer}
                    onChange={e => setFillAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="fill-input"
                />
            );
        }
    };

    const isSubmitDisabled = () => {
        if (!question) return true;
        if (question.type === "SingleChoice" || question.type === "TrueFalse") return selectedAnswer === null;
        if (question.type === "MultipleChoice") return multipleAnswers.length === 0;
        if (question.type === "FillInTheBlank") return fillAnswer.trim() === "";
        return true;
    };

    return (
        <div className="livequiz-container">
            <h2>Welcome to the arena</h2>

            {toast && <div className="toast">{toast}</div>}

            {!question && startCountdown > 0 && (
                <p className="countdown">Quiz starting in: {startCountdown}s</p>
            )}

            {question && (
                <div className="question-section">
                    <h3>{question.text}</h3>
                    <div className="options">{renderOptions()}</div>
                    <p className="countdown">Time left: {countdown}s</p>
                    <button onClick={sendAnswer} disabled={isSubmitDisabled() || submitted} className="submit-btn">
                        Submit Answer
                    </button>
                </div>
            )}

            {!question && startCountdown <= 0 && <p>Waiting for quiz to start...</p>}

            {leaderboard.length > 0 &&
                <div className="leaderboard">
                    <h3>Leaderboard</h3>
                    <ul>
                        {leaderboard.map((u, i) => (
                            <li key={i}>{u.username} – {u.points} pts</li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    );
};

export default LiveQuizPage;
