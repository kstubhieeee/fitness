import React, { useState } from 'react';
import './front.css';
import Header from '../Header/Header';
import hero_image from '../../assets/hero_image.png';
import hero_image_back from '../../assets/hero_image_back.png';
import heart from '../../assets/heart.png';
import calories from '../../assets/calories.png';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const Front = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const transition = { type: 'spring', duration: 3 };
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToSignup = () => {
    navigate("/signup");
  };


  const handleGetStarted = () => {
    // Scroll to the "Join Now" section
    const joinSection = document.getElementById("join-now-section");
    if (joinSection) {
      joinSection.scrollIntoView({ behavior: "smooth" });
    }

    // Open the dropdown
    setShowDropdown(true);
  };

  return (
    <div className="front" id="home">
      <div className="left-s">
        <Header />
        <div className="the-best-ad">
          <motion.div
            initial={{ left: '238px' }}
            whileInView={{ left: '8px' }}
            transition={{ ...transition, type: 'tween' }}
          ></motion.div>
          <span>Power-Fit Change yourself into new YOU</span>
        </div>
        <div className="hero-text">
          <div>
            <span className="stroke-text">Transform </span>
            <span>Your</span>
          </div>
          <div>
            <span>Ideal Body </span>
          </div>
          <div>
            <span>
              In here we will help you to shape and build your ideal body and live up your life to
              fullest
            </span>
          </div>
        </div>
        <div className="figures">
          <div>
            <span>+100</span>
            <span>Certified Trainers</span>
          </div>
          <div>
            <span>1000+</span>
            <span>Members Joined</span>
          </div>
          <div>
            <span>50+</span>
            <span>Fitness Programs</span>
          </div>
        </div>
        <div className="front-buttons">
          <button className="btn" onClick={handleGetStarted}>Get Started</button>
          <button className="btn">Learn More</button>
        </div>
      </div>
      <div className="right-s">
        <div className="dropdown-container" id="join-now-section">
          <button className="btn" onClick={toggleDropdown}>
            Join Now
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={navigateToSignup}>Sign Up</button>
              <button className="dropdown-item" onClick={navigateToLogin}>Login</button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ right: '-1rem' }}
          whileInView={{ right: '4rem' }}
          transition={transition}
          className="heart-rate"
        >
          <img src={heart} alt="" />
          <span>heart rate</span>
          <span>121 bpm</span>
        </motion.div>

        <img src={hero_image} alt="" className="hero-image" />
        <img src={hero_image_back} alt="" className="hero-image-back" />

        <motion.div
          initial={{ right: '37rem' }}
          whileInView={{ right: '28rem' }}
          transition={transition}
          className="calories"
        >
          <img src={calories} alt="" />
          <div>
            <span>Calories Burned</span>
            <span>220 kcal</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Front;