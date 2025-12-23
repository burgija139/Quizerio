import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginSuccess } from "../../redux/authSlice";
import "../../styles/Form.css";
import { Link } from "react-router-dom";

const LoginForm = () => {
    const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        // Menja samo polje koje korisnik unosi
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post(
                "http://localhost:5039/api/Auth/login",
                form
            );
            // Backend vraća AuthResponseDto: { token, user }
            const { token, user } = res.data;

            // Čuvamo token i user u Redux + localStorage
            dispatch(loginSuccess({ token, user }));
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            alert("Login successful!");
            navigate("/");

        } catch (err) {
            // Prikaz poruke koju backend vraća
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="text"
                name="usernameOrEmail"
                placeholder="Username or Email"
                value={form.usernameOrEmail}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />
            <button type="submit">Login</button>
            <p style={{ textAlign: "center", marginTop: "10px", fontSize: "14px", color: "#a0a0c0" }}>
                Dont have an account? <Link to="/register" style={{ color: "#6c63ff", textDecoration: "none" }}>Register</Link>
            </p>

        </form>
    );
};

export default LoginForm;
