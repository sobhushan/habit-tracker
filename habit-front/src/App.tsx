import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home"
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics'
import Rewards from './pages/Rewards';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import './App.css';


const App = () => {
  return (
    <Router>
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;