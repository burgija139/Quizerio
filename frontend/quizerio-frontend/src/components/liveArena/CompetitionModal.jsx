import { useState, useEffect } from "react";
import "../../styles/CompetitionModal.css";

const CompetitionModal = ({ isAdmin, onClose, onCreate, onJoin }) => {
    const [roomName, setRoomName] = useState("");
    const [quizList, setQuizList] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState("");
    const [startTime, setStartTime] = useState("");
    const [rooms, setRooms] = useState([]);

    // Fetch quizzes samo ako je admin
    useEffect(() => {
        if (!isAdmin) return;
        const fetchQuizzes = async () => {
            try {
                const res = await fetch("http://localhost:5039/api/Quiz");
                if (!res.ok) throw new Error("Failed to fetch quizzes");
                const data = await res.json();
                // Sortiranje abecedno po title
                const sorted = data.sort((a, b) => a.title.localeCompare(b.title));
                setQuizList(sorted);
            } catch (err) {
                console.error(err);
            }
        };
        fetchQuizzes();
    }, [isAdmin]);

    // Fetch rooms samo ako nije admin
    useEffect(() => {
        if (isAdmin) return;
        const fetchRooms = async () => {
            try {
                const res = await fetch("http://localhost:5039/api/Arena/list");
                if (!res.ok) throw new Error("Failed to fetch rooms");
                const data = await res.json();
                setRooms(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRooms();
    }, [isAdmin]);

    const handleCreate = () => {
        if (!roomName || !selectedQuizId || !startTime) return;
        onCreate({ roomName, quizId: selectedQuizId, startTime });
    };

    return (
        <div className="cm-overlay">
            <div className="cm-modal">
                <button className="cm-close" onClick={onClose}>
                    &times;
                </button>

                <h2>{isAdmin ? "Create Competition Room" : "Join Room"}</h2>

                {isAdmin ? (
                    <>
                        <label>Room Name</label>
                        <input
                            type="text"
                            value={roomName}
                            placeholder="Enter room name"
                            onChange={(e) => setRoomName(e.target.value)}
                        />

                        <label>Select Quiz</label>
                        <select
                            value={selectedQuizId}
                            onChange={(e) => setSelectedQuizId(e.target.value)}
                        >
                            <option value="">-- Choose a quiz --</option>
                            {quizList.map((q) => (
                                <option key={q.id} value={q.id}>
                                    {q.title}
                                </option>
                            ))}
                        </select>

                        <label>Start Time</label>
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />

                        <button
                            className="cm-btn"
                            onClick={handleCreate}
                            disabled={!roomName || !selectedQuizId || !startTime}
                        >
                            Create Room
                        </button>
                    </>
                ) : (
                    <div className="rooms-list">
                        {rooms.length === 0 ? (
                            <p>No active rooms.</p>
                        ) : (
                            rooms
                                .filter(r => !r.started)
                                .map((r) => (
                                    <button
                                        key={r.id}
                                        className="cm-btn room-card"
                                        onClick={() => onJoin(r.id)}
                                    >
                                        <div className="room-card-header">{r.name}</div>
                                        <div className="room-card-body">
                                            <span className="room-quiz">{r.quizName}</span>
                                            <span className="room-time">{new Date(r.startTime).toLocaleString()}</span>
                                        </div>
                                    </button>
                                ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompetitionModal;
