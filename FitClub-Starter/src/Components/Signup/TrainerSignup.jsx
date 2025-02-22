import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const TrainerSignup = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        fullName: "",
        age: "",
        gender: "male",
        specialization: "",
        experience: "",
        certification: "",
        feePerMonth: "",
        availability: "",
        photo: null
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });
            formDataToSend.append('userType', 'trainer');

            const response = await fetch("http://localhost:5000/api/trainers/signup", {
                method: "POST",
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Trainer signup successful:", data);
                navigate("/trainerdashboard");
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
            <div className="signup-form-container trainer-signup">
                <h2 className="signup-title">Trainer Registration</h2>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
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
                            placeholder="Create a password"
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
                        <label htmlFor="specialization">Specialization</label>
                        <input
                            type="text"
                            id="specialization"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            placeholder="Your area of expertise"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="experience">Years of Experience</label>
                        <input
                            type="number"
                            id="experience"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Years of experience"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="certification">Certifications</label>
                        <textarea
                            id="certification"
                            name="certification"
                            value={formData.certification}
                            onChange={handleChange}
                            placeholder="List your certifications"
                            rows="3"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="feePerMonth">Monthly Fee (in $)</label>
                        <input
                            type="number"
                            id="feePerMonth"
                            name="feePerMonth"
                            value={formData.feePerMonth}
                            onChange={handleChange}
                            placeholder="Your monthly fee"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="availability">Availability</label>
                        <textarea
                            id="availability"
                            name="availability"
                            value={formData.availability}
                            onChange={handleChange}
                            placeholder="Describe your available hours"
                            rows="3"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Contact Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Your contact number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="photo">Profile Photo</label>
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            onChange={handlePhotoChange}
                            accept="image/*"
                            required
                        />
                        {photoPreview && (
                            <div className="photo-preview">
                                <img src={photoPreview} alt="Preview" style={{ maxWidth: '200px' }} />
                            </div>
                        )}
                    </div>
                    <button type="submit" className="signup-btn">
                        Register as Trainer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TrainerSignup;