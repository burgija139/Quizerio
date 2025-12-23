import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AllUsersPage = () => {
    const auth = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`http://localhost:5039/api/User`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            }
        };

        if (auth.user?.role === "Admin") fetchUsers();
    }, [auth]);

    return (
        <div className="my-results-page">
            <div className="my-results-card">
                <h2 className="my-results-title">All Users</h2>
                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <table className="my-results-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <button className="details-btn"
                                            onClick={() => navigate("/MyResults", { state: { user: u } })}
                                        >
                                            Check results
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

export default AllUsersPage;
