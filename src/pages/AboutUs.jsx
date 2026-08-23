import { motion } from 'framer-motion';

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const teamMembers = [
    {
      name: "Ishita",
      role: "Co-Founder & Developer",
      description: "Passionate about computer science and education. Loves solving complex problems and sharing knowledge with others.",
      skills: ["Data Structures", "Algorithms", "Web Development", "Problem Solving"],
      image: "👩‍💻"
    },
    {
      name: "Riya",
      role: "Co-Founder & Developer",
      description: "Enthusiastic about teaching and making learning accessible. Dedicated to helping students master DSA concepts.",
      skills: ["System Design", "Algorithms", "Teaching", "Mentoring"],
      image: "👩‍🎓"
    }
  ];

  const features = [
    {
      icon: "📚",
      title: "Comprehensive Content",
      description: "Covering all essential data structures and algorithms with detailed explanations"
    },
    {
      icon: "💡",
      title: "Interactive Learning",
      description: "Hands-on practice with 50+ coding problems and real-world examples"
    },
    {
      icon: "🎯",
      title: "Structured Path",
      description: "Follow a clear roadmap from basics to advanced topics"
    },
    {
      icon: "🚀",
      title: "Interview Prep",
      description: "Get ready for technical interviews with curated problem sets"
    }
  ];

  const stats = [
    { number: "50+", label: "Coding Problems" },
    { number: "8", label: "Data Structures" },
    { number: "8", label: "Algorithm Categories" },
    { number: "100%", label: "Free Learning" }
  ];

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <p className="page-subtitle">
            Learn about the team behind DSA Learning and our mission to make coding education accessible
          </p>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.section
        className="about-mission"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <motion.div
            className="mission-content"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <h2>Our Mission</h2>
            <p>
              At DSA Learning, we believe that mastering Data Structures and Algorithms is essential 
              for every programmer. Our mission is to provide a comprehensive, interactive, and free 
              learning platform that helps students and professionals build strong foundations in 
              computer science fundamentals.
            </p>
            <p>
              We understand that learning DSA can be challenging, which is why we've created a 
              structured learning path with clear explanations, practical examples, and hands-on 
              coding problems. Whether you're preparing for technical interviews or simply want 
              to improve your problem-solving skills, we're here to support your journey.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="about-team"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container">
          <motion.h2 className="section-title" variants={itemVariants}>
            Meet the Team
          </motion.h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="team-image">{member.image}</div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-description">{member.description}</p>
                <div className="team-skills">
                  <h4>Skills:</h4>
                  <div className="skills-tags">
                    {member.skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="about-stats"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200,
                  delay: index * 0.1
                }}
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="about-features"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container">
          <motion.h2 className="section-title" variants={itemVariants}>
            Why Choose Us?
          </motion.h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
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
            <h2>Start Your Learning Journey Today</h2>
            <p>Join thousands of learners mastering Data Structures and Algorithms</p>
            <div className="cta-buttons">
              <a href="/datastructures" className="btn btn-primary btn-large">
                Explore Data Structures
              </a>
              <a href="/problems" className="btn btn-secondary btn-large">
                Start Practicing
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUs;

