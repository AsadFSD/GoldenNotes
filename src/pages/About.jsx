// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      {/* Title */}
      <motion.h1
        className="about-title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About GoldenNotes
      </motion.h1>

      {/* Intro */}
      <motion.p
        className="about-intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        GoldenNotes is a simple yet powerful notes and to-do manager, built to
        help you stay productive and organized.  
        Check out my portfolio:{" "}
        <a href="https://asadomer.vercel.app/" target="_blank" rel="noopener noreferrer">
          asadomer.vercel.app
        </a>
      </motion.p>

      {/* Future updates */}
      <motion.div
        className="about-section"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h2>🚀 Future Updates</h2>
        <ul>
          <li>Cloud sync across devices</li>
          <li>Customizable themes (Dark / Light / Gold)</li>
          <li>Reminders & Notifications</li>
          <li>Tags & Advanced Search</li>
          <li>Collaboration with friends</li>
        </ul>
      </motion.div>

      {/* Closing */}
      <motion.p
        className="about-footer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        Made with ❤️ using React + Vite + Framer Motion.  
        Stay tuned for more updates!
      </motion.p>
    </div>
  );
};

export default About;
