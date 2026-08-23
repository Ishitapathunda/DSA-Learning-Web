import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { fetchProblemBySlug } from '../api/problems';
import { runCode, submitCode } from '../api/submissions';
import { useAuth } from '../context/AuthContext';

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy':
      return '#10b981';
    case 'Medium':
      return '#f59e0b';
    case 'Hard':
      return '#ef4444';
    default:
      return '#6366f1';
  }
};

const verdictColor = (verdict) => {
  switch (verdict) {
    case 'PASSED':
      return '#10b981';
    case 'FAILED':
      return '#ef4444';
    case 'TIMEOUT':
      return '#f59e0b';
    default:
      return '#6366f1';
  }
};

const ProblemDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();

  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [judgeResult, setJudgeResult] = useState(null);
  const [judgeError, setJudgeError] = useState('');
  const [lastAction, setLastAction] = useState(null); // 'run' | 'submit'
  const [newBadges, setNewBadges] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadProblem = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const data = await fetchProblemBySlug(slug);
        if (!cancelled) {
          setProblem(data.problem);
          setCode(data.problem.starterCode?.cpp || '');
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Could not load this problem.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProblem();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleRun = async () => {
    setJudgeError('');
    setJudgeResult(null);
    setLastAction('run');
    setIsRunning(true);
    try {
      const data = await runCode(slug, code);
      setJudgeResult(data.result);
    } catch (err) {
      setJudgeError(err.message || 'Could not run your code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setJudgeError('');
    setJudgeResult(null);
    setNewBadges([]);
    setLastAction('submit');
    setIsSubmitting(true);
    try {
      const data = await submitCode(slug, code);
      setJudgeResult(data.result);
      if (data.result.newlyAwardedBadges?.length) {
        setNewBadges(data.result.newlyAwardedBadges);
      }
    } catch (err) {
      setJudgeError(err.message || 'Could not submit your code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>Loading problem...</p>
        </div>
      </div>
    );
  }

  if (loadError || !problem) {
    return (
      <div className="page-container">
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>{loadError || 'Problem not found.'}</p>
          <Link to="/problems" className="quick-action-btn" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>
            ← Back to Problems
          </Link>
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
          <Link to="/problems" className="auth-link" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            ← Back to Problems
          </Link>
          <div className="problem-header" style={{ alignItems: 'center' }}>
            <h1 className="page-title" style={{ marginBottom: 0 }}>{problem.title}</h1>
            <span
              className="problem-difficulty"
              style={{ backgroundColor: getDifficultyColor(problem.difficulty) }}
            >
              {problem.difficulty}
            </span>
          </div>
          <p className="page-subtitle">{problem.topic}</p>
        </div>
      </motion.div>

      <motion.section
        className="dashboard-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container">
          <div className="dashboard-card">
            <h3 className="card-title">Description</h3>
            <p>{problem.description}</p>
          </div>

          {problem.examples?.length > 0 && (
            <div className="dashboard-card">
              <h3 className="card-title">Examples</h3>
              {problem.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: '1rem' }}>
                  <p><strong>Input:</strong> {ex.input}</p>
                  <p><strong>Output:</strong> {ex.output}</p>
                  {ex.explanation && <p><strong>Explanation:</strong> {ex.explanation}</p>}
                </div>
              ))}
            </div>
          )}

          {problem.constraints?.length > 0 && (
            <div className="dashboard-card">
              <h3 className="card-title">Constraints</h3>
              <ul>
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {problem.hasExecution ? (
            <div className="dashboard-card">
              <h3 className="card-title">Solve it (C++)</h3>

              {!isAuthenticated && (
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <Link to="/login" state={{ from: `/problems/${slug}` }} className="auth-link">Log in</Link> to run and submit code.
                </p>
              )}

              <div style={{ border: '1px solid var(--border-color, rgba(255,255,255,0.1))', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                <Editor
                  height="380px"
                  defaultLanguage="cpp"
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value ?? '')}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="quick-action-btn"
                  onClick={handleRun}
                  disabled={!isAuthenticated || isRunning || isSubmitting}
                >
                  {isRunning ? 'Running...' : 'Run'}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!isAuthenticated || isRunning || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              {judgeError && (
                <p className="error-message" style={{ marginTop: '1rem' }}>{judgeError}</p>
              )}

              {judgeResult && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h4 style={{ marginBottom: '0.75rem' }}>
                    {lastAction === 'submit' ? 'Submission Result: ' : 'Run Result: '}
                    <span style={{ color: judgeResult.overallStatus === 'PASSED' ? '#10b981' : '#ef4444' }}>
                      {judgeResult.overallStatus}
                    </span>
                  </h4>

                  {newBadges.length > 0 && (
                    <p style={{ color: '#f59e0b', fontWeight: 600, marginBottom: '1rem' }}>
                      🏆 New badge{newBadges.length > 1 ? 's' : ''} earned! Check your <Link to="/dashboard" className="auth-link">dashboard</Link>.
                    </p>
                  )}

                  {judgeResult.compileError ? (
                    <pre style={{ overflowX: 'auto', padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-sm)', color: '#ef4444' }}>
                      <code>{judgeResult.compileError}</code>
                    </pre>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {judgeResult.results?.map((r, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255,255,255,0.03)',
                            borderLeft: `4px solid ${verdictColor(r.verdict)}`,
                          }}
                        >
                          <p style={{ fontWeight: 600, color: verdictColor(r.verdict), marginBottom: '0.35rem' }}>
                            Test {i + 1}: {r.verdict}
                          </p>
                          <p><strong>Input:</strong> {r.input}</p>
                          <p><strong>Expected:</strong> {r.expectedOutput}</p>
                          <p><strong>Got:</strong> {r.actualOutput}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            problem.starterCode?.cpp && (
              <div className="dashboard-card">
                <h3 className="card-title">Starter Code (C++)</h3>
                <pre style={{ overflowX: 'auto', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                  <code>{problem.starterCode.cpp}</code>
                </pre>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                  This problem doesn't have a graded test suite yet, so the in-browser judge isn't available here — you can still read the starter code above.
                </p>
              </div>
            )
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default ProblemDetail;
