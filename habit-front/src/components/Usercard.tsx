// // src/components/Usercard.tsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

interface UserCardProps {
    username: string | null;
    user_id: string | null;
    handleLogout: () => void;
  } 

  const UserCard: React.FC<UserCardProps> = ({ username, user_id, handleLogout }) => {
  const [progress, setProgress] = useState(0); // Progress percentage
  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      console.error("User ID is missing!");
      return;
    }
    const fetchHabitProgress = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/charts/donutchart?user_id=${user_id}`);
        const { completed, pending } = response.data;

        const total = completed + pending;
        const progressPercentage = total > 0 ? (completed / total) * 100 : 0;

        setCompleted(completed);
        setPending(pending);
        setProgress(progressPercentage);
        console.log("PROGRESS:",response.data)
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchHabitProgress();
  }, [user_id]); // Runs whenever user_id changes

  return (
    <div className="col-md-4 mt-4">
      <div className="card p-3 text-center bg-gradient-to-br from-pink-200 to-purple-200 shadow-lg rounded-lg">
        <img
          src="/habit logo.png"
          alt="User"
          className="rounded-circle mx-auto d-block border-4 border-pink-400 shadow-md"
          style={{ width: "150px", height: "150px" }}
        />
        <h5 className="mt-3">Welcome, {username} 👋</h5>


        {/* 🏆 Dynamic Progress Bar */}
        <div className="mt-2 w-full px-3">
          <h6>🏆 Progress: {Math.round(progress)}%</h6>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1 text-gray-600">
            ✅ {completed} Completed | ⏳ {pending} Pending
          </p>
        </div>

        <ul className="list-group mt-3">
          <Link className="list-group-item hover:bg-gray-100 transition duration-200" to="/dashboard">
            📋 Dashboard
          </Link>
          <Link className="list-group-item hover:bg-gray-100 transition duration-200" to="/statistics">
            📊 Statistics
          </Link>
          <Link className="list-group-item hover:bg-gray-100 transition duration-200" to="/rewards">
            🏆 Rewards
          </Link>
        </ul>

        {/* 🔔 Motivational Quote */}
        <div className="mt-3 italic text-gray-700">
          "Small habits, big results!"
        </div>

        <button onClick={handleLogout} className="btn btn-danger mt-3">
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserCard;
