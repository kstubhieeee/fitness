import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const Signup = () => {
    const [userType, setUserType] = useState("member");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
    });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            // Call the backend signup API
            const response = await fetch("http://localhost:5000/api/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    userType: userType, // "member" or "trainer"
                }),
            });

            // Parse the response
            const data = await response.json();

            // Handle the response
            if (response.ok) {
                console.log("Signup successful:", data);
                if (userType === "member") {
                    navigate("/planspage"); // Redirect to Pricing Plans page
                } else {
                    setShowSuccessMessage(true); // Show success message for trainers
                }
            } else {
                alert(data.message || "Signup failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong");
        }
    };

    const closeSuccessMessage = () => {
        setShowSuccessMessage(false); // Close the success message
        navigate("/trainerdashboard"); // Redirect to Trainer Dashboard
    };

    return (
        <div className="signup-container">
            <div className="user-type-buttons">
                <button
                    className={userType === "member" ? "active" : ""}
                    onClick={() => setUserType("member")}
                >
                    New Member
                </button>
                <button
                    className={userType === "trainer" ? "active" : ""}
                    onClick={() => setUserType("trainer")}
                >
                    New Trainer
                </button>
            </div>

            <div className="signup-form-container">
                <h2 className="signup-title">
                    Sign Up as a {userType === "member" ? "Member" : "Trainer"}
                </h2>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Create Username</label>
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
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Create Password</label>
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
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                        />
                    </div>
                    <button type="submit" className="signup-btn">
                        Sign Up
                    </button>
                </form>
            </div>

            {/* Success Message Popup */}
            {showSuccessMessage && (
                <div className="success-popup">
                    <div className="success-popup-content">
                        <h2>Success!</h2>
                        <p>You have successfully signed up as a new trainer for our gym.</p>
                        <button onClick={closeSuccessMessage}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;