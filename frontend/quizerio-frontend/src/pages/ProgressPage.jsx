import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/ProgressPage.css";

export default function ProgressPage() {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const location = useLocation();
    const quizId = location.state?.result.quizId;
    const auth = useSelector((state) => state.auth);
    const userId = location.state?.result.userId;


    useEffect(() => {
        const fetchResults = async () => {
            if (!userId || !quizId) return; // Wait until we have both
            try {
                const res = await fetch(
                    `http://localhost:5039/api/result/progress?userId=${userId}&quizId=${quizId}`
                );
                if (!res.ok) throw new Error("Failed to fetch results");
                const data = await res.json();
                setResults(data);
            } catch (err) {
                console.error("Error fetching results:", err);
            }
        };

        fetchResults();
    }, [userId, quizId]);

    // Transform and sort data for chart
    const chartData = results
        .sort((a, b) => new Date(a.takenAt) - new Date(b.takenAt))
        .map((r, index) => ({
            attempt: index + 1, // redni broj pokušaja
            score: r.score,
            date: new Date(r.takenAt).toLocaleString(), // za tooltip ako želiš
        }));
    const maxScore = chartData.length > 0 ? Math.max(...chartData.map(d => d.score)) : 100;

    return (
        <div className="progress-page">
            <h1>Your Progress </h1>
            <div className="chart-container">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="attempt" />
                            <YAxis domain={[0, maxScore]} />
                            <Tooltip
                                labelFormatter={(label) => `Attempt #${label}`}
                                formatter={(value) => [`${value}`, "Score"]}
                            />
                            <Line type="monotone" dataKey="score" stroke="#4caf50" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p>No results yet. Take some quizzes!</p>
                )}
            </div>

            <button className="btn-back" onClick={() => navigate("/")}>
                Back to Quizzes
            </button>
        </div>
    );
}
