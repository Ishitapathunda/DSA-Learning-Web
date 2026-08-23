import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const roadmapSteps = [
    { title: "Basics", desc: "Learn fundamentals of programming" },
    { title: "Data Structures", desc: "Master arrays, linked lists, trees" },
    { title: "Algorithms", desc: "Sorting, searching, and more" },
    { title: "Problem Solving", desc: "Practice with 50+ problems" },
    { title: "Interview Prep", desc: "Get ready for technical interviews" }
  ];

  const tips = [
    { icon: "📚", title: "Practice Daily", desc: "Consistency is key to mastering DSA" },
    { icon: "💡", title: "Understand First", desc: "Don't just memorize, understand the logic" },
    { icon: "🔄", title: "Review Regularly", desc: "Revisit concepts to reinforce learning" },
    { icon: "🎯", title: "Solve Problems", desc: "Apply what you learn through practice" }
  ];

  const updates = [
    { date: "2024-01-15", text: "New sorting algorithms added!" },
    { date: "2024-01-10", text: "Graph algorithms section updated" },
    { date: "2024-01-05", text: "50+ new interview problems added" }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">DSA Learning</span>
          </h1>
          <p className="hero-subtitle">
            Master Data Structures and Algorithms with interactive learning
          </p>
          <div className="hero-buttons">
            <Link to="/datastructures" className="btn btn-primary">
              Start Learning
            </Link>
            <Link to="/problems" className="btn btn-secondary">
              Practice Problems
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Roadmap Section */}
      <motion.section 
        className="roadmap-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container">
          <motion.h2 className="section-title" variants={itemVariants}>
            Learning Roadmap
          </motion.h2>
          <div className="roadmap-container">
            {roadmapSteps.map((step, index) => (
              <motion.div
                key={index}
                className="roadmap-step"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="step-number">{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tips Section */}
      <motion.section 
        className="tips-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container">
          <motion.h2 className="section-title" variants={itemVariants}>
            Learning Tips
          </motion.h2>
          <div className="tips-grid">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                className="tip-card"
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="tip-icon">{tip.icon}</div>
                <h3>{tip.title}</h3>
                <p>{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Updates Section */}
      <motion.section 
        className="updates-section"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container">
          <motion.h2 className="section-title" variants={itemVariants}>
            Latest Updates
          </motion.h2>
          <div className="updates-list">
            {updates.map((update, index) => (
              <motion.div
                key={index}
                className="update-item"
                variants={itemVariants}
                whileHover={{ x: 10, backgroundColor: "var(--card-hover)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="update-date">{update.date}</div>
                <div className="update-text">{update.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of learners mastering DSA</p>
            <Link to="/signup" className="btn btn-primary btn-large">
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

