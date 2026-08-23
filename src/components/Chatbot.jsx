import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your DSA learning assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response (in real app, this would be an API call)
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! I'm here to help you with Data Structures and Algorithms. What would you like to learn?";
    }
    
    if (input.includes('array') || input.includes('arrays')) {
      return "Arrays are fundamental data structures! They store elements in contiguous memory. Would you like to learn about array operations, or practice array problems?";
    }
    
    if (input.includes('tree') || input.includes('trees')) {
      return "Trees are hierarchical data structures. We cover Binary Trees, BST, AVL Trees, and more. Check out the Data Structures page for detailed explanations!";
    }
    
    if (input.includes('graph') || input.includes('graphs')) {
      return "Graphs represent relationships between nodes. We have tutorials on BFS, DFS, shortest path algorithms, and more. Start with the Algorithms page!";
    }
    
    if (input.includes('problem') || input.includes('practice')) {
      return "Great! We have 50+ coding problems for you to practice. Visit the Problems page to filter by difficulty and topic. Good luck!";
    }
    
    if (input.includes('difficulty') || input.includes('hard')) {
      return "Our problems are categorized into Easy, Medium, and Hard. Start with Easy problems to build confidence, then gradually move to harder ones!";
    }
    
    if (input.includes('help') || input.includes('stuck')) {
      return "I can help you with:\n- Understanding data structures\n- Algorithm explanations\n- Problem-solving strategies\n- Learning path guidance\n\nWhat specific topic are you working on?";
    }
    
    if (input.includes('sort') || input.includes('sorting')) {
      return "Sorting algorithms organize data in a specific order. We cover Bubble Sort, Merge Sort, Quick Sort, and more. Check the Algorithms page for detailed explanations!";
    }
    
    if (input.includes('thank')) {
      return "You're welcome! Keep practicing and you'll master DSA in no time. Feel free to ask me anything else!";
    }
    
    // Default response
    return "That's an interesting question! I can help you with data structures, algorithms, problem-solving strategies, or guide you to the right resources. Could you be more specific?";
  };

  const quickQuestions = [
    "What are arrays?",
    "Explain trees",
    "Help with problems",
    "Sorting algorithms"
  ];

  const handleQuickQuestion = (question) => {
    setInputValue(question);
    // Trigger send after a brief delay
    setTimeout(() => {
      const userMessage = {
        id: messages.length + 1,
        text: question,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: getBotResponse(question),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }, 100);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 1 }}
      >
        {isOpen ? '✕' : '💬'}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Chatbot Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">🤖</div>
                <div>
                  <h3>DSA Assistant</h3>
                  <p>Online</p>
                </div>
              </div>
              <button
                className="chatbot-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Chatbot Messages */}
            <div className="chatbot-messages">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.sender}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="quick-questions">
                <p>Quick questions:</p>
                <div className="quick-questions-list">
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      className="quick-question-btn"
                      onClick={() => handleQuickQuestion(question)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Chatbot Input */}
            <form className="chatbot-input-form" onSubmit={handleSend}>
              <input
                type="text"
                className="chatbot-input"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="chatbot-send-btn">
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

