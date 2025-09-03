// Home.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <motion.h1
        className="home-title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to <span className="highlight">My Notes</span>
      </motion.h1>

      <motion.p
        className="home-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Organize your thoughts, jot down quick ideas, and keep everything in
        one place.
      </motion.p>

      <motion.div
        className="home-buttons"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Link to="/notes" className="start-btn">
          ✏️ Start Taking Notes
        </Link>
      </motion.div>
    </div>
  );
}

export default Home;
