import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import "../../styles/Form.css";

const RegisterForm = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (imageFile) {
        formData.append("image", imageFile); // "avatar" = ime parametra na backendu
      }

      const res = await axios.post("http://localhost:5039/api/Auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const loginRes = await axios.post("http://localhost:5039/api/Auth/login", {
        usernameOrEmail: form.username,
        password: form.password,
      });

      dispatch(loginSuccess({ token: loginRes.data.token, user: loginRes.data.user }));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering user");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />

      {/* file input */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      <button type="submit">Register</button>
      <p style={{ textAlign: "center", marginTop: "10px", fontSize: "14px", color: "#a0a0c0" }}>
        Already have an account? <Link to="/login" style={{ color: "#6c63ff", textDecoration: "none" }}>Login</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
