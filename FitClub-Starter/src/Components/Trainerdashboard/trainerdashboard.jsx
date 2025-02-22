import React, { useState } from "react";
import { useauthstore } from "../../Store/useauthstore";
import "./trainerdashboard.css";

const Trainerdashboard = () => {
    const { authuser } = useauthstore(); // Get trainer's username

    // Mock data for schedule
    const [schedule, setSchedule] = useState([
        { time: "9:00 AM", client: "John Doe" },
        { time: "11:00 AM", client: "Jane Smith" },
        { time: "2:00 PM", client: "Alice Johnson" },
        { time: "4:00 PM", client: "Bob Brown" },
    ]);

    // Mock data for progress
    const [progress, setProgress] = useState({
        "John Doe": 50,
        "Jane Smith": 70,
        "Alice Johnson": 30,
        "Bob Brown": 85,
    });

    // State for new appointment
    const [newAppointment, setNewAppointment] = useState({
        time: "",
        client: "",
    });


    const convertTo12HourFormat = (time) => {
        let [hours, minutes] = time.split(":");
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert "00" or "12" to "12"
        return `${hours}:${minutes} ${ampm}`;
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment({ ...newAppointment, [name]: value });
    };

    // Handle adding an appointment
    const handleAddAppointment = (e) => {
        e.preventDefault();
        if (newAppointment.time && newAppointment.client) {
            const formattedTime = convertTo12HourFormat(newAppointment.time); // Convert time
            setSchedule([...schedule, { time: formattedTime, client: newAppointment.client }]);

            // Add new client to progress with default 0%
            setProgress({ ...progress, [newAppointment.client]: 0 });

            setNewAppointment({ time: "", client: "" }); // Clear the form
        } else {
            alert("Please fill in both time and client name.");
        }
    };

    // Handle progress update
    const handleProgressChange = (client, newValue) => {
        setProgress({ ...progress, [client]: newValue });
    };

    return (
        <div className="trainer-dashboard">
            {/* Navbar/Header */}
            <div className="navbar">
                <h2>Welcome, {authuser}</h2>
            </div>

            <div className="dashboard-container">
                {/* Left Side: Today's Schedule */}
                <div className="schedule">
                    <h2>Today's Schedule</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Client</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.client}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Right Side: Update Schedule */}
                <div className="update-schedule">
                    <h2>Update Schedule</h2>
                    <form onSubmit={handleAddAppointment}>
                        <div className="form-group">
                            <label>Time:</label>
                            <input
                                type="time"
                                name="time"
                                value={newAppointment.time}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Client Name:</label>
                            <input
                                type="text"
                                name="client"
                                value={newAppointment.client}
                                onChange={handleInputChange}
                                placeholder="Enter client name"
                                required
                            />
                        </div>
                        <button type="submit">Add Appointment</button>
                    </form>
                </div>

                {/* Progress Report Box */}
                <div className="progress-report">
                    <h2>Progress Report</h2>
                    {Object.keys(progress).map((client) => (
                        <div key={client} className="progress-item">
                            <span>{client}</span>
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{ width: `${progress[client]}%` }}></div>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress[client]}
                                onChange={(e) => handleProgressChange(client, e.target.value)}
                            />
                            <span>{progress[client]}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Trainerdashboard;
