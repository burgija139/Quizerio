import React, { useEffect, useState } from "react";
import "../styles/LeaderboardPage.css";

const LeaderboardPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [query, setQuery] = useState("");
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [results, setResults] = useState([]);
    const [timeFilter, setTimeFilter] = useState("all");

    // 1. Fetch all quizzes once
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await fetch("http://localhost:5039/api/quiz");
                const data = await res.json();
                setQuizzes(data);
            } catch (err) {
                console.error("Error fetching quizzes:", err);
            }
        };
        fetchQuizzes();
    }, []);

    // 2. Local search filter
    useEffect(() => {
        if (query.length < 2) {
            setFilteredQuizzes([]);
            return;
        }
        setFilteredQuizzes(
            quizzes.filter((q) =>
                q.title.toLowerCase().includes(query.toLowerCase())
            )
        );
    }, [query, quizzes]);

    // 3. Fetch results for selected quiz
    useEffect(() => {
        if (!selectedQuiz) return;

        const fetchResults = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5039/api/result/leaderboard?quizId=${selectedQuiz.id}&period=${timeFilter}`
                );
                const data = await res.json();
                setResults(data);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            }
        };

        fetchResults();
    }, [selectedQuiz, timeFilter]);

    return (
        <div className="leaderboard-container">
            <h1 className="leaderboard-title">Leaderboard</h1>

            {/* Search bar */}
            <input
                type="text"
                placeholder="Search quiz..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-bar-lb"
            />

            {/* Suggestions */}
            {filteredQuizzes.length > 0 && (
                <ul className="quiz-suggestions">
                    {filteredQuizzes.map((q) => (
                        <li
                            key={q.id}
                            onClick={() => {
                                setSelectedQuiz(q);
                                setQuery(q.title);
                                setFilteredQuizzes([]);
                            }}
                        >
                            {q.title}
                        </li>
                    ))}
                </ul>
            )}

            {/* Filters */}
            {selectedQuiz && (
                <div className="filters">
                    <h2>{selectedQuiz.title}</h2>
                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                    >
                        <option value="all">All time</option>
                        <option value="weekly">This week</option>
                        <option value="monthly">This month</option>
                    </select>
                </div>
            )}

            {/* Results table */}
            {results.length > 0 && (
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>User</th>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, index) => (
                            <tr key={r.userId}>
                                <td>{index + 1}</td>
                                <td>{r.username}</td>
                                <td>{r.score}</td>
                                <td>{new Date(r.takenAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LeaderboardPage;
