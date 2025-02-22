import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const MemberSignup = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        age: "",
        gender: "male",
        emergencyContact: "",
        healthConditions: ""
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/members/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    userType: "member"
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Signup successful:", data);
                navigate("/planspage");
            } else {
                alert(data.message || "Signup failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form-container">
                <h2 className="signup-title">Member Registration</h2>
                <form className="signup-form" onSubmit={handleSubmit}>
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
                        <label htmlFor="age">Age</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Enter your age"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="emergencyContact">Emergency Contact</label>
                        <input
                            type="tel"
                            id="emergencyContact"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            placeholder="Emergency contact number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="healthConditions">Health Conditions</label>
                        <textarea
                            id="healthConditions"
                            name="healthConditions"
                            value={formData.healthConditions}
                            onChange={handleChange}
                            placeholder="List any health conditions or concerns"
                            rows="3"
                        />
                    </div>
                    <button type="submit" className="signup-btn">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MemberSignup;