import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DataStructures = () => {
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

  const dataStructures = [
    {
      title: "Arrays",
      icon: "📊",
      description: "Learn about one-dimensional and multi-dimensional arrays, array operations, and common patterns.",
      topics: ["Static Arrays", "Dynamic Arrays", "2D Arrays", "Array Manipulation"],
      difficulty: "Beginner"
    },
    {
      title: "Linked Lists",
      icon: "🔗",
      description: "Master singly linked lists, doubly linked lists, and circular linked lists with implementations.",
      topics: ["Singly Linked List", "Doubly Linked List", "Circular Linked List", "Operations"],
      difficulty: "Intermediate"
    },
    {
      title: "Stacks",
      icon: "📚",
      description: "Understand the LIFO (Last In First Out) principle and stack-based problem solving.",
      topics: ["Stack Operations", "Implementation", "Applications", "Problems"],
      difficulty: "Beginner"
    },
    {
      title: "Queues",
      icon: "🚶",
      description: "Learn about FIFO (First In First Out) data structures and their real-world applications.",
      topics: ["Queue Operations", "Circular Queue", "Priority Queue", "Deque"],
      difficulty: "Beginner"
    },
    {
      title: "Trees",
      icon: "🌳",
      description: "Explore binary trees, BST, AVL trees, and tree traversal algorithms.",
      topics: ["Binary Tree", "BST", "AVL Tree", "Tree Traversal"],
      difficulty: "Intermediate"
    },
    {
      title: "Graphs",
      icon: "🕸️",
      description: "Master graph representations, traversal algorithms, and shortest path problems.",
      topics: ["Graph Representation", "BFS/DFS", "Shortest Path", "MST"],
      difficulty: "Advanced"
    },
    {
      title: "Hash Tables",
      icon: "🗂️",
      description: "Learn about hash functions, collision handling, and hash table implementations.",
      topics: ["Hash Functions", "Collision Resolution", "Open Addressing", "Chaining"],
      difficulty: "Intermediate"
    },
    {
      title: "Heaps",
      icon: "⛰️",
      description: "Understand min-heap, max-heap, and priority queue implementations.",
      topics: ["Min Heap", "Max Heap", "Heap Operations", "Heap Sort"],
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
          <h1 className="page-title">Data Structures</h1>
          <p className="page-subtitle">
            Master fundamental data structures to build a strong foundation in computer science
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
          <div className="ds-grid">
            {dataStructures.map((ds, index) => (
              <motion.div
                key={index}
                className="ds-card"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03, 
                  y: -8,
                  boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="ds-card-header">
                  <div className="ds-icon">{ds.icon}</div>
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(ds.difficulty) }}
                  >
                    {ds.difficulty}
                  </span>
                </div>
                <h3 className="ds-card-title">{ds.title}</h3>
                <p className="ds-card-description">{ds.description}</p>
                <div className="ds-topics">
                  <h4>Topics Covered:</h4>
                  <ul>
                    {ds.topics.map((topic, idx) => (
                      <li key={idx}>{topic}</li>
                    ))}
                  </ul>
                </div>
                <Link to="/problems" className="ds-learn-btn">
                  Start Learning →
                </Link>
              </motion.div>
            ))}
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
            <h2>Ready to Practice?</h2>
            <p>Apply your knowledge with hands-on problems</p>
            <Link to="/problems" className="btn btn-primary btn-large">
              View Problems
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default DataStructures;

