
import React from "react";
import { motion } from "framer-motion";
import "./About.css";

const About = () => {
  const features = [
    { icon: "🎨", title: "Multiple Themes", desc: "Warm Minimalism, Liquid Glass, Notes App Chic" },
    { icon: "✍️", title: "Full Markdown Editor", desc: "Rich formatting, live preview, distraction-free mode" },
    { icon: "📊", title: "Knowledge Graph", desc: "Visualize connections with bi-directional linking" },
    { icon: "🤖", title: "AI Assistant", desc: "Summarize, fix grammar, generate templates" },
    { icon: "🏷️", title: "Smart Tags", desc: "Auto-categorization and advanced search" },
    { icon: "📌", title: "Pin & Favorites", desc: "Quick access to important notes" },
  ];

  const upcoming = [
    "☁️ Cloud sync across devices",
    "🔗 Real-time collaboration",
    "📤 Export to PDF, Markdown, CSV",
    "⏰ Note version history & restore",
    "🔐 End-to-end encryption",
    "🌐 Share public links with comments",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="about-page">
      <motion.div
        className="about-hero"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="about-title">GoldenNotes Studio</h1>
        <p className="about-subtitle">Your all-in-one knowledge management system for the modern age</p>
      </motion.div>

      <motion.p
        className="about-intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        GoldenNotes is a powerful, beautifully designed note-taking application that goes beyond basic note storage. With AI-powered suggestions, visual knowledge graphs, multiple curated themes, and advanced markdown editing, it's built for anyone who wants to organize their thoughts intelligently.
      </motion.p>

      <motion.div
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        {features.map((feature, idx) => (
          <motion.div key={idx} className="feature-card" variants={itemVariants}>
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="about-section"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h2>🚀 Coming Soon</h2>
        <ul className="upcoming-list">
          {upcoming.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="about-section tech-stack"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <h2>⚙️ Built With</h2>
        <div className="tech-badges">
          <span className="badge">React 19</span>
          <span className="badge">Vite 7</span>
          <span className="badge">Framer Motion</span>
          <span className="badge">Marked.js</span>
          <span className="badge">CSS Grid & Flexbox</span>
          <span className="badge">SVG Graphs</span>
        </div>
      </motion.div>

      <motion.div
        className="about-cta"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <p>Designed & developed with ❤️ for knowledge workers</p>
        <p className="portfolio-link">
          🔗 Portfolio: <a href="https://asadomer.vercel.app/" target="_blank" rel="noopener noreferrer">asadomer.vercel.app</a>
        </p>
        <p className="version">GoldenNotes v2.0 • May 2026</p>
      </motion.div>
    </div>
  );
};

export default About;
