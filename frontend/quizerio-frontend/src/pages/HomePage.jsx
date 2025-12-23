import { useState, useEffect } from "react";
import SearchBar from "../components/home/SearchBar";
import QuizFilter from "../components/home/QuizFilter";
import QuizList from "../components/home/QuizList.jsx";

const HomePage = () => {
    const [quizzes, setQuizzes] = useState([]);              // svi kvizovi sa servisa
    const [filteredQuizzes, setFilteredQuizzes] = useState([]); // filtrirani kvizovi

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");

    // 👇 fake fetch sa servisa (možeš zameniti sa API pozivom)
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await fetch("http://localhost:5039/api/Quiz"); // replace with your API URL
                if (!res.ok) throw new Error("Failed to fetch quizzes");
                const data = await res.json();
                setQuizzes(data);
                setFilteredQuizzes(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchQuizzes();
    }, []);

    // 🔹 Search handler
    const handleSearch = (query) => {
        setSearchQuery(query.toLowerCase());
    };

    // 🔹 Filter handler
    const handleFilterChange = ({ difficulties, category }) => {
        setSelectedDifficulties(difficulties);
        setSelectedCategory(category);
    };

    // 🔹 primeni search + filter
    useEffect(() => {
        let result = quizzes;

        // search filter
        if (searchQuery) {
            result = result.filter(q =>
                q.title.toLowerCase().includes(searchQuery)
            );
        }

        // difficulty filter
        if (selectedDifficulties.length > 0) {
            result = result.filter(q =>
                selectedDifficulties.includes(q.difficulty)
            );
        }

        // category filter
        if (selectedCategory !== "All Categories") {
            result = result.filter(q => q.category === selectedCategory);
        }

        setFilteredQuizzes(result);
    }, [searchQuery, selectedDifficulties, selectedCategory, quizzes]);

    return (
        <div style={{ padding: "20px" }}>
            <SearchBar onSearch={handleSearch} />
            <QuizFilter onFilterChange={handleFilterChange} />
            <QuizList quizzes={filteredQuizzes} />
        </div>
    );
};

export default HomePage;
