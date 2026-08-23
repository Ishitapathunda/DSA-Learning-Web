import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchAnalytics, fetchStreak, fetchBadges } from '../api/social';
import { fetchSubmissions } from '../api/submissions';

const timeAgo = (isoDate) => {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const Dashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const [progress, setProgress] = useState(null);
  const [streak, setStreak] = useState(null);
  const [badges, setBadges] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const [analyticsData, submissionsData, streakData, badgesData] = await Promise.all([
          fetchAnalytics(),
          fetchSubmissions(),
          fetchStreak(),
          fetchBadges(),
        ]);
        if (!cancelled) {
          setProgress(analyticsData.analytics);
          setRecentActivity(submissionsData.submissions.slice(0, 6));
          setStreak(streakData.streak);
          setBadges(badgesData.badges);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Could not load your dashboard data.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const overallProgress = progress ? Math.round((progress.solvedCount / progress.totalProblems) * 100) || 0 : 0;
  const categoryProgress = progress
    ? progress.topicBreakdown.map((t) => ({
        name: t.topic,
        completed: t.solved,
        total: t.total,
        percentage: t.total > 0 ? Math.round((t.solved / t.total) * 100) : 0,
      }))
    : [];
  const difficultyProgress = progress
    ? progress.difficultyBreakdown.map((d) => ({
        name: d.difficulty,
        completed: d.solved,
        total: d.total,
        percentage: d.total > 0 ? Math.round((d.solved / d.total) * 100) : 0,
      }))
    : [];

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page-container">
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Track your progress and continue your learning journey
          </p>
        </div>
      </motion.div>

      <motion.section
        className="dashboard-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          {/* Stats Overview */}
          <div className="dashboard-stats">
            <motion.div
              className="stat-box"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="stat-icon">📊</div>
              <div className="stat-value">{overallProgress}%</div>
              <div className="stat-label">Overall Progress</div>
            </motion.div>

            <motion.div
              className="stat-box"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="stat-icon">✅</div>
              <div className="stat-value">{progress?.solvedCount ?? 0}/{progress?.totalProblems ?? 0}</div>
              <div className="stat-label">Problems Solved</div>
            </motion.div>

            <motion.div
              className="stat-box"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{streak?.currentStreak ?? 0}</div>
              <div className="stat-label">Day Streak</div>
            </motion.div>

            <motion.div
              className="stat-box"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{progress?.accuracy ?? 0}%</div>
              <div className="stat-label">Accuracy</div>
            </motion.div>

            <motion.div
              className="stat-box"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="stat-icon">🏆</div>
              <div className="stat-value">{badges.filter(b => b.earned).length}</div>
              <div className="stat-label">Badges Earned</div>
            </motion.div>
          </div>

          {/* Overall Progress Bar */}
          <motion.div
            className="progress-card"
            variants={itemVariants}
          >
            <div className="progress-header">
              <h3>Overall Learning Progress</h3>
              <span className="progress-percentage">{overallProgress}%</span>
            </div>
            <div className="progress-bar-container">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Category Progress */}
          <motion.div
            className="dashboard-card"
            variants={itemVariants}
          >
            <h3 className="card-title">Progress by Category</h3>
            <div className="category-progress-list">
              {categoryProgress.map((category, index) => (
                <motion.div
                  key={index}
                  className="category-progress-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="category-header">
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">{category.completed}/{category.total}</span>
                  </div>
                  <div className="progress-bar-container">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="category-percentage">{category.percentage}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Difficulty Breakdown */}
          <motion.div
            className="dashboard-card"
            variants={itemVariants}
          >
            <h3 className="card-title">Progress by Difficulty</h3>
            <div className="category-progress-list">
              {difficultyProgress.map((d, index) => (
                <motion.div
                  key={index}
                  className="category-progress-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="category-header">
                    <span className="category-name">{d.name}</span>
                    <span className="category-count">{d.completed}/{d.total}</span>
                  </div>
                  <div className="progress-bar-container">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${d.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    />
                  </div>
                  <span className="category-percentage">{d.percentage}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Badges Section */}
          <motion.div
            className="dashboard-card"
            variants={itemVariants}
          >
            <h3 className="card-title">Your Badges</h3>
            <div className="badges-grid">
              {badges.map((badge) => (
                <motion.div
                  key={badge.key}
                  className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-name">{badge.name}</div>
                  <div className="badge-description">{badge.description}</div>
                  {!badge.earned && <div className="badge-lock">🔒</div>}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="dashboard-card"
            variants={itemVariants}
          >
            <h3 className="card-title">Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>
                No submissions yet — <Link to="/problems" className="auth-link">solve a problem</Link> to see your activity here.
              </p>
            ) : (
              <div className="activity-list">
                {recentActivity.map((submission, index) => {
                  const action =
                    submission.mode === 'SUBMIT'
                      ? submission.status === 'PASSED'
                        ? 'Solved'
                        : submission.status === 'ERROR'
                        ? 'Error on'
                        : 'Attempted'
                      : 'Ran';
                  return (
                    <motion.div
                      key={submission.id}
                      className="activity-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="activity-icon">
                        {submission.status === 'PASSED' ? '✅' : submission.status === 'ERROR' ? '⚠️' : '🚀'}
                      </div>
                      <div className="activity-content">
                        <div className="activity-text">
                          <strong>{action}</strong> {submission.problem.title}
                          <span className={`activity-difficulty ${submission.problem.difficulty.toLowerCase()}`}>
                            {submission.problem.difficulty}
                          </span>
                        </div>
                        <div className="activity-date">{timeAgo(submission.createdAt)}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="dashboard-card"
            variants={itemVariants}
          >
            <h3 className="card-title">Quick Actions</h3>
            <div className="quick-actions">
              <Link to="/problems" className="quick-action-btn">
                <span>💻</span>
                <span>Solve Problems</span>
              </Link>
              <Link to="/datastructures" className="quick-action-btn">
                <span>📚</span>
                <span>Learn Data Structures</span>
              </Link>
              <Link to="/algorithms" className="quick-action-btn">
                <span>⚡</span>
                <span>Study Algorithms</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;

