import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProblems } from '../api/problems';

const Problems = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const topics = ['All', 'Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Strings', 'Sorting', 'Searching'];

  useEffect(() => {
    let cancelled = false;

    const loadProblems = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const data = await fetchProblems();
        if (!cancelled) {
          setProblems(data.problems);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Could not load problems. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProblems();
    return () => {
      cancelled = true;
    };
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "#10b981";
      case "Medium":
        return "#f59e0b";
      case "Hard":
        return "#ef4444";
      default:
        return "#6366f1";
    }
  };

  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === 'All' || problem.topic === selectedTopic;
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesTopic && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <h1 className="page-title">Practice Problems</h1>
          <p className="page-subtitle">
            Solve 50+ coding problems to master Data Structures and Algorithms
          </p>
        </div>
      </motion.div>

      <motion.section
        className="problems-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container">
          {/* Filters */}
          <div className="problems-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <label>Difficulty:</label>
              <div className="filter-buttons">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    className={`filter-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                    onClick={() => setSelectedDifficulty(diff)}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Topic:</label>
              <div className="filter-buttons">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    className={`filter-btn ${selectedTopic === topic ? 'active' : ''}`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Problems Count */}
          {!isLoading && !loadError && (
            <div className="problems-count">
              <span>{filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} found</span>
            </div>
          )}

          {isLoading && (
            <div className="no-problems">
              <p>Loading problems...</p>
            </div>
          )}

          {!isLoading && loadError && (
            <div className="no-problems">
              <p>{loadError}</p>
            </div>
          )}

          {/* Problems Grid */}
          {!isLoading && !loadError && (
            <motion.div
              className="problems-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProblems.map((problem) => (
                <motion.div
                  key={problem.id}
                  className="problem-card"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    y: -5,
                    boxShadow: "0 15px 35px rgba(99, 102, 241, 0.3)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="problem-header">
                    <h3 className="problem-title">{problem.title}</h3>
                    <span
                      className="problem-difficulty"
                      style={{ backgroundColor: getDifficultyColor(problem.difficulty) }}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                  <p className="problem-description">{problem.description}</p>
                  <div className="problem-footer">
                    <span className="problem-topic">{problem.topic}</span>
                    <Link to={`/problems/${problem.slug}`} className="problem-solve-btn">
                      Solve →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && !loadError && filteredProblems.length === 0 && (
            <div className="no-problems">
              <p>No problems found matching your filters.</p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Problems;