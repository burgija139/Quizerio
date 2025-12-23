// src/components/SearchBar.jsx
import { useState } from "react";
import "../../styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value); // šaljemo upit parent-u
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search quizzes..."
                value={query}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBar;
