// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import "../styles/Header.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompetitionModal from "./liveArena/CompetitionModal";

const Header = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch(logout());
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/" className="logo-link">
                    QUIZERIO
                </Link>
            </div>

            {user && (
                <div className="header-center">
                    <button
                        className="quiz-create-btn"
                        onClick={() => setShowModal(true)}
                    >
                        {user.role === "Admin" ? "Create Room" : "Join Room"}
                    </button>
                </div>
            )}

            <div className="header-right">
                {user ? (
                    <div className="dropdown">
                        <button className="dropdown-btn">
                            <img
                                src={user.imageUrl ? `http://localhost:5039${user.imageUrl}` : "/default-avatar.png"}
                                className="avatar-img"
                                alt="avatar"
                            />
                        </button>
                        <div className="dropdown-menu">
                            {user.role === "Admin" && (
                                <Link to="/AllResults" className="dropdown-item">
                                    All results
                                </Link>
                            )}
                            <Link to="/MyResults" className="dropdown-item">
                                My results
                            </Link>
                            <Link to="/LeaderBoard" className="dropdown-item">
                                Rang list
                            </Link>
                            <button className="dropdown-item logout" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <CompetitionModal
                    isAdmin={user.role === "Admin"}
                    onClose={() => setShowModal(false)}
                    onCreate={async (roomData) => {
                        try {
                            const res = await fetch("http://localhost:5039/api/Arena/room", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("token")}`
                                },
                                body: JSON.stringify({
                                    name: roomData.roomName,
                                    quizId: roomData.quizId,
                                    startTime: roomData.startTime
                                })
                            });
                            if (!res.ok) throw new Error("Failed to create room");
                            const createdRoom = await res.json();
                            console.log("Created room:", createdRoom);
                            setShowModal(false);
                            // Optional: refresh rooms list if you maintain one
                        } catch (err) {
                            console.error(err);
                            alert("Error creating room");
                        }
                    }}
                    onJoin={(roomId) => {
                        setShowModal(false);
                        navigate(`/live-quiz/${roomId}`);
                    }}
                />
            )}
        </header>
    );
};

export default Header;
