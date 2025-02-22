import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/front-view-male-boxer-posing.jpg";
import { useauthstore } from "../../Store/useauthstore.js";
const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "member",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    //const [authuser, setauthUser] = useState(null)
    const navigate = useNavigate();
    const { login } = useauthstore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = await login(formData)



        setErrorMessage("");


        if (data) {
            console.log("Login successful:", data);
            localStorage.setItem("token", data.token);
            if (formData.role === "member") {
                navigate("/memberdashboard"); // Redirect to Member Dashboard
            } else if (formData.role === "trainer") {
                navigate("/trainerdashboard"); // Redirect to Trainer Dashboard
            } else if (formData.role === "admin") {
                navigate("/admindashboard"); // Redirect to Admin Dashboard
            }
        } else {
            setErrorMessage(data.message || "Invalid credentials");
        }

        setLoading(false);
    };

    return (
        <div className="login-container" style={{ backgroundImage: `url(${loginBg})` }}>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="member">Member</option>
                        <option value="trainer">Trainer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
