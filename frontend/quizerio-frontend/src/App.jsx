import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import QuizPage from "./pages/QuizPage";
import ResultsPage from "./pages/ResultPage";
import MyResultsPage from "./pages/MyResultsPage";
import QuizFormPage from "./pages/QuizFormPage";
import ProgressPage from "./pages/ProgressPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AllResultsPage from "./pages/AllResultsPage";
import LiveQuizPage from "./pages/LiveQuizPage";


function App() {
  const token = useSelector((state) => state.auth.token);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Ako je ulogovan ide na Home, ako nije ide na login */}
          <Route
            index
            element={token ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="login"
            element={<LoginPage />}
          />
          <Route
            path="register"
            element={<RegisterPage />}
          />
          <Route
            path="/quiz/:id"
            element={token ? <QuizPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="result/:id"
            element={token ? <ResultsPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="MyResults"
            element={token ? <MyResultsPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="quiz/edit/:id"
            element={token ? <QuizFormPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="quiz/create"
            element={token ? <QuizFormPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="result/progress"
            element={token ? <ProgressPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="LeaderBoard"
            element={token ? <LeaderboardPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="AllResults"
            element={token ? <AllResultsPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="live-quiz/:roomId"
            element={token ? <LiveQuizPage /> : <Navigate to="/login" replace />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
