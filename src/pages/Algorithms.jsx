import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Algorithms = () => {
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

  const algorithmCategories = [
    {
      title: "Sorting Algorithms",
      icon: "🔄",
      description: "Learn various sorting techniques including bubble sort, merge sort, quick sort, and more.",
      algorithms: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "Heap Sort"],
      complexity: "O(n log n) - O(n²)",
      difficulty: "Intermediate"
    },
    {
      title: "Searching Algorithms",
      icon: "🔍",
      description: "Master linear search, binary search, and advanced searching techniques.",
      algorithms: ["Linear Search", "Binary Search", "Ternary Search", "Jump Search", "Interpolation Search"],
      complexity: "O(log n) - O(n)",
      difficulty: "Beginner"
    },
    {
      title: "Graph Algorithms",
      icon: "🕸️",
      description: "Explore depth-first search, breadth-first search, and shortest path algorithms.",
      algorithms: ["BFS", "DFS", "Dijkstra's", "Bellman-Ford", "Floyd-Warshall", "A*"],
      complexity: "O(V + E) - O(V³)",
      difficulty: "Advanced"
    },
    {
      title: "Dynamic Programming",
      icon: "💡",
      description: "Solve complex problems by breaking them down into simpler subproblems.",
      algorithms: ["Fibonacci", "Knapsack", "LCS", "Edit Distance", "Coin Change", "LIS"],
      complexity: "O(n²) - O(n³)",
      difficulty: "Advanced"
    },
    {
      title: "Greedy Algorithms",
      icon: "🎯",
      description: "Learn to make locally optimal choices to find global solutions.",
      algorithms: ["Activity Selection", "Huffman Coding", "Kruskal's MST", "Prim's MST", "Dijkstra's"],
      complexity: "O(n log n) - O(n²)",
      difficulty: "Intermediate"
    },
    {
      title: "Divide & Conquer",
      icon: "✂️",
      description: "Break problems into smaller subproblems, solve recursively, and combine results.",
      algorithms: ["Merge Sort", "Quick Sort", "Binary Search", "Strassen's Matrix", "Karatsuba"],
      complexity: "O(n log n)",
      difficulty: "Intermediate"
    },
    {
      title: "Backtracking",
      icon: "🔙",
      description: "Systematically explore all possible solutions by building candidates incrementally.",
      algorithms: ["N-Queens", "Sudoku Solver", "Rat in Maze", "Subset Sum", "Hamiltonian Path"],
      complexity: "O(2^n) - O(n!)",
      difficulty: "Advanced"
    },
    {
      title: "String Algorithms",
      icon: "📝",
      description: "Master pattern matching, string manipulation, and text processing algorithms.",
      algorithms: ["KMP", "Rabin-Karp", "Z-Algorithm", "Manacher's", "Suffix Array", "Trie"],
      complexity: "O(n) - O(n log n)",
      difficulty: "Intermediate"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "#10b981";
      case "Intermediate":
        return "#f59e0b";
      case "Advanced":
        return "#ef4444";
      default:
        return "#6366f1";
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
          <h1 className="page-title">Algorithms</h1>
          <p className="page-subtitle">
            Master essential algorithms and problem-solving techniques used in computer science
          </p>
        </div>
      </motion.div>

      <motion.section
        className="content-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container">
          <div className="algorithm-grid">
            {algorithmCategories.map((category, index) => (
              <motion.div
                key={index}
                className="algorithm-card"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03, 
                  y: -8,
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="algorithm-card-header">
                  <div className="algorithm-icon">{category.icon}</div>
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(category.difficulty) }}
                  >
                    {category.difficulty}
                  </span>
                </div>
                <h3 className="algorithm-card-title">{category.title}</h3>
                <p className="algorithm-card-description">{category.description}</p>
                
                <div className="algorithm-complexity">
                  <strong>Time Complexity:</strong> {category.complexity}
                </div>

                <div className="algorithm-list">
                  <h4>Algorithms Covered:</h4>
                  <div className="algorithm-tags">
                    {category.algorithms.map((algo, idx) => (
                      <span key={idx} className="algorithm-tag">{algo}</span>
                    ))}
                  </div>
                </div>
                
                <Link to="/problems" className="algorithm-learn-btn">
                  Practice Problems →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="info-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="info-grid">
            <motion.div
              className="info-card"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="info-icon">⚡</div>
              <h3>Time Complexity</h3>
              <p>Understand how algorithms perform with different input sizes</p>
            </motion.div>
            <motion.div
              className="info-card"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="info-icon">💾</div>
              <h3>Space Complexity</h3>
              <p>Learn about memory usage and optimization techniques</p>
            </motion.div>
            <motion.div
              className="info-card"
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="info-icon">🎓</div>
              <h3>Best Practices</h3>
              <p>Follow industry standards and coding best practices</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

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
            <h2>Ready to Solve Problems?</h2>
            <p>Apply algorithms to real-world coding challenges</p>
            <Link to="/problems" className="btn btn-primary btn-large">
              View All Problems
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Algorithms;

