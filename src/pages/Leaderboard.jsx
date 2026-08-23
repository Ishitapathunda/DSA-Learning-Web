import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchLeaderboard } from '../api/social';
import { useAuth } from '../context/AuthContext';

const medalFor = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const data = await fetchLeaderboard();
        if (!cancelled) {
          setEntries(data.leaderboard);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Could not load the leaderboard.');
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

  return (
    <div className="page-container">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <h1 className="page-title">Leaderboard</h1>
          <p className="page-subtitle">See how you stack up against everyone else solving problems</p>
        </div>
      </motion.div>

      <motion.section
        className="dashboard-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container">
          {isLoading && (
            <div className="no-problems">
              <p>Loading leaderboard...</p>
            </div>
          )}

          {!isLoading && loadError && (
            <div className="no-problems">
              <p>{loadError}</p>
            </div>
          )}

          {!isLoading && !loadError && entries.length === 0 && (
            <div className="no-problems">
              <p>No one has solved a problem yet — be the first!</p>
            </div>
          )}

          {!isLoading && !loadError && entries.length > 0 && (
            <div className="dashboard-card">
              <div className="category-progress-list">
                {entries.map((entry) => {
                  const isMe = user?.username === entry.username;
                  return (
                    <motion.div
                      key={entry.userId}
                      className="category-progress-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: entry.rank * 0.03 }}
                      style={isMe ? { background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-sm)', padding: '0.5rem' } : undefined}
                    >
                      <div className="category-header">
                        <span className="category-name">
                          {medalFor(entry.rank) ? `${medalFor(entry.rank)} ` : `#${entry.rank} `}
                          {entry.username}
                          {isMe && ' (you)'}
                        </span>
                        <span className="category-count">
                          {entry.solvedCount} solved · 🔥 {entry.currentStreak}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Leaderboard;
