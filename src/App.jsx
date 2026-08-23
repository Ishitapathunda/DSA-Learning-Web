import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import DataStructures from './pages/DataStructures';
import Algorithms from './pages/Algorithms';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import './style.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/datastructures" element={<DataStructures />} />
              <Route path="/algorithms" element={<Algorithms />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/problems/:slug" element={<ProblemDetail />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

