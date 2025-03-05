// // src/components/Usercard.tsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

interface UserCardProps {
  username: string | null;
  user_id: string | null;
  handleLogout: () => void;
  refreshProgress: () => void; 
  habitProgress: { completed: number; pending: number; progress: number };
}

  const UserCard: React.FC<UserCardProps> = ({ username, user_id, handleLogout, refreshProgress, habitProgress  }) => {
  const [, setProgress] = useState(0); // Progress percentage
  const [, setCompleted] = useState(0);
  const [, setPending] = useState(0);

  const fetchHabitProgress = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/charts/donutchart?user_id=${user_id}&t=${new Date().getTime()}`);
      console.log("Fetched Progress Data:", response.data);
      const { completed, pending } = response.data;
      const total = completed + pending;
      const progressPercentage = total > 0 ? (completed / total) * 100 : 0;

      setCompleted(completed);
      setPending(pending);
      setProgress(progressPercentage);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    }
  };  

  useEffect(() => {
    fetchHabitProgress();
  }, [user_id, refreshProgress]);

  // useEffect(() => {
  //   refreshProgress();  // 👈 Refresh when triggered
  // }, [refreshProgress]);

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
          <h6>🏆 Progress: {Math.round(habitProgress.progress)}%</h6>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${habitProgress.progress}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1 text-gray-600">
          ✅ {habitProgress.completed} Completed | ⏳ {habitProgress.pending} Pending
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