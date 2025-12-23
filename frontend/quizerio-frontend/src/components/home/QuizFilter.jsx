// src/components/QuizFilter.jsx
import React, { useState } from "react";
import "../../styles/QuizFilter.css";

const QuizFilter = ({ onFilterChange }) => {
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    const handleDifficultyChange = (difficulty) => {
        let updated;
        if (selectedDifficulties.includes(difficulty)) {
            updated = selectedDifficulties.filter(d => d !== difficulty);
        } else {
            updated = [...selectedDifficulties, difficulty];
        }
        setSelectedDifficulties(updated);
        onFilterChange({ difficulties: updated, category: selectedCategory });
    };

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);
        onFilterChange({ difficulties: selectedDifficulties, category: newCategory });
    };

    return (
        <div className="quiz-filter-wrapper">
            <div className="difficulty-filters">
                <label>
                    <input
                        type="checkbox"
                        checked={selectedDifficulties.includes("Easy")}
                        onChange={() => handleDifficultyChange("Easy")}
                    /> EASY
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedDifficulties.includes("Medium")}
                        onChange={() => handleDifficultyChange("Medium")}
                    /> MEDIUM
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedDifficulties.includes("Hard")}
                        onChange={() => handleDifficultyChange("Hard")}
                    /> HARD
                </label>
            </div>
            <div className="category-dropdown">
                <select value={selectedCategory} onChange={handleCategoryChange}>
                    <option>All Categories</option>
                    <option>Math</option>
                    <option>Science</option>
                    <option>History</option>
                    <option>Sport</option>
                    <option>Programing</option>
                </select>
            </div>
        </div>
    );
};

export default QuizFilter;
