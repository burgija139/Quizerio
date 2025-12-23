import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/MyResultsPage.css";

const MyResultsPage = () => {
    const auth = useSelector((state) => state.auth);
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);

    const userId = location.state?.user.id || auth.user?.id;
    const token = auth.token;

    useEffect(() => {
        const fetchResults = async () => {
            if (!userId || !token) return; // mora biti definisano
            try {
                const res = await fetch(`http://localhost:5039/api/Result/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch results");
                const data = await res.json();
                setResults(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchResults();
    }, [userId, token]);


    return (
        <div className="my-results-page">
            <div className="my-results-card">
                <h2 className="my-results-title">
                    {location.state?.userId ? `Results for User ID: ${userId}` : "My Results"}
                </h2>
                {results.length === 0 ? (
                    <p className="my-results-empty">No results found.</p>
                ) : (
                    <table className="my-results-table">
                        <thead>
                            <tr>
                                <th>Quiz</th>
                                <th>Score</th>
                                <th>Date Taken</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.quizTitle}</td>
                                    <td>{r.score}</td>
                                    <td>{new Date(r.takenAt).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="details-btn"
                                            onClick={() => navigate(`/result/${r.id}`, { state: { result: r } })}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MyResultsPage;
