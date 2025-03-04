// // src/pages/Dashboard.tsx

import Dashnav from "../components/Dashnav";
import { useEffect, useState} from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AddHabitModal from "../components/AddModal";
import UserCard from "../components/Usercard";

const Dashboard = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHabit, setEditHabit] = useState<any>(null);
  const [username, setUsername] = useState<string | null>("User");
  const [user_id, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [expandedHabitId, setExpandedHabitId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [refreshTrigger, setRefreshTrigger] = useState(false);
const [habitProgress, setHabitProgress] = useState({ completed: 0, pending: 0, progress: 0 });

const refreshProgress = () => {
  setRefreshTrigger((prev) => !prev); // This will trigger a re-fetch in useEffect
};

// Fetch habit progress when triggered
useEffect(() => {
  const fetchHabitProgress = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/charts/donutchart?user_id=${user_id}&t=${new Date().getTime()}`);
      console.log("Fetched Progress Data:", response.data);
      const { completed, pending } = response.data;
      const total = completed + pending;
      const progressPercentage = total > 0 ? (completed / total) * 100 : 0;

      setHabitProgress({ completed, pending, progress: progressPercentage });
    } catch (error) {
      console.error("Error fetching progress data:", error);
    }
  };

  fetchHabitProgress();
}, [refreshTrigger, user_id]); // Triggers re-fetch on refreshTrigger update



  const toggleExpandHabit = (habitId: number) => {
    setExpandedHabitId(expandedHabitId === habitId ? null : habitId);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("user_id");
    setUsername(storedUsername);
    setUserId(storedUserId);
    const user_id = localStorage.getItem("user_id");
    const fetchHabits = async () => {
      if (!user_id) {
        alert("Unauthorized access");
        window.location.href = "/";
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/habits?user_id=${user_id}`);
        console.log('GET on reload:',response.data)
    
        setHabits(response.data);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };

    fetchHabits();
  }, []);
  
  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    alert("Logged out!");
    window.location.href = "/";
  };

  const displayHabits = habits.filter((habit) => {
    return (
      (selectedCategory === "All" || habit.category === selectedCategory) &&
      (selectedStatus === "All" || habit.status === selectedStatus) &&
      (habit.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Filter habits based on search term
  // const filteredHabits = habits.filter((habit) =>
  //   habit.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // Toggle Complete Button
  const handleToggleComplete = async (habit_id: number, status: string) => {
    const confirmComplete = window.confirm("Are you sure?");
    if (!confirmComplete) return;
  
    const user_id = parseInt(localStorage.getItem("user_id") || "0", 10);
    const habitToUpdate = habits.find((habit) => habit.habit_id === habit_id);
    if (!habitToUpdate) return;

    try {
      const newStatus = status === "Completed" ? "Pending" : "Completed";
      
      await axios.put("http://localhost:3000/api/habitlog", {
        user_id,
        habit_id,
        status: newStatus,
      });

      const streakLogResponse = await axios.get("http://localhost:3000/api/streaklog", {
        params: { habit_id, user_id },
      });
      
      // await axios.put("http://localhost:3000/api/streaklog", {
      //    user_id, habit_id, status, date
      // });

      console.log('Get from streaklog:', {
                user_id: user_id,
                habit_id: habit_id,
                status: newStatus,
                streak: streakLogResponse.data
              });
      const updatedStreak = streakLogResponse.data.streak_count;

      // const rewardsResponse = await axios.put("http://localhost:3000/api/rewards", {
      //   user_id,
      //   habit_id,
      // });
      // console.log("Rewards Updated:", rewardsResponse.data);  
      
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.habit_id === habit_id
            ? { ...habit, 
              status: newStatus, 
              streak: updatedStreak,
              // points: rewardsResponse.data.pointsEarned, 
              // badges: rewardsResponse.data.badges
              }
            : habit
        )
      );
      refreshProgress();
      
    } catch (error) {
      console.error("Error updating habit status:", error);
    }
  };
  

  // // Delete Function
  const handleDeleteHabit = async (habit_id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this habit?");
    if (!confirmDelete) return;
    if (!habit_id) {
      console.error("Habit ID is missing!");
      return;
    }
  
    console.log("Sending delete request for habit:", habit_id);
  
    try {
      const response = await axios.delete("http://localhost:3000/api/habits", {
        data: { habit_id }, 
        headers: { "Content-Type": "application/json" }, 
      });
  
      console.log("Delete response:", response.data);
      alert("Habit deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  // Edit Funtion
  const handleEditHabit = (habit: any) => {
    console.log("index:",habit)
    console.log({...habit})


    setShowEditModal(true);
    setEditHabit({...habit});
  };
  

  const updateHabit = async () => {
    if (!editHabit || editHabit.title.trim() === "") {
      alert("Habit title cannot be empty!");
      return;
    }
  
    console.log("Sending update request:", editHabit);
  
    try {
      const response = await axios.put("http://localhost:3000/api/habits", {
        id: editHabit.habit_id, 
        title: editHabit.title,
        description: editHabit.description,
        frequency: editHabit.frequency,
        time_req: editHabit.time_req,
        category: editHabit.category,
      });
  
      console.log("Update response:", response.data);
      alert("Habit updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };
  

  return (
    <div style={{
      backgroundImage: "url('/images/wood-texture.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)",
      minHeight: "100vh",
      left:0,
      right:0,
      position:"absolute"
    }}>
      <Dashnav setSearchTerm={setSearchTerm} />
      <div className="container-fluid">
        <div className="row">
          {/* Left Section (User Card) */}

          <UserCard
            username={username}
            user_id={user_id}
            handleLogout={handleLogout}
            refreshProgress={refreshProgress}
            habitProgress={habitProgress} // Pass progress data
          />



          {/* Right Section (Dashboard) */}
          <div className="col-md-8 mt-4 mb-4">
            {/* <div className="card p-3"
                                style={{
                                  backgroundImage: "url('/images/old-paper.jpeg')",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  // border: "2px solid #8B4513",
                                  boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)",
                                  color:"white"
                                }}
            > */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 style={{color: "#471514"}}>Your Habits</h4>
                <div className="d-flex">
                  <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="All">All Categories</option>
                    <option value="Work">Work</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Leisure">Leisure</option>
                    <option value="Health">Health</option>
                    <option value="Self-care">Self-care</option>
                    <option value="Growth">Growth</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Finances">Finances</option>
                    <option value="Other">Others</option>
                  </select>
                  <select className="form-select mx-2" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                  <button className="btn" style={{backgroundImage: "url('/images/grad.jpg')",backgroundSize: "cover",
      backgroundPosition: "center", color:"white", border:"black"}} onClick={() => setShowModal(true)}>+AddHabit </button>
                </div>
              </div>

              {/* Habit List - Single Column */}
              <div className="row">
                {displayHabits.map((habit) => (
                <div key={habit.habit_id} className="col-12 mb-3">
                  <div 
                    className="card p-3"
                    style={{ backgroundColor: habit.status === "Completed" ? "#d4edda" : "#f8d7da", color: "#000", cursor: "pointer" }}
                    onClick={() => toggleExpandHabit(habit.habit_id)}
                  >
                    {/* Always Visible */}
                    <div className="d-flex justify-content-between align-items-center">
                      <h3>{habit.title}</h3>
                      <div>
                      <h6>{habit.category}</h6>
                      {/* <h6 style={{color: "#471514"}}>🔥<strong>{habit.streak} days</strong></h6> */}
                      </div>
                    </div>
                    <h5 style={{color: "#471514"}}>🔥<strong>{habit.streak} days</strong></h5>
                    {/* Expandable Section */}
                    {expandedHabitId === habit.habit_id && (
                      <>
                        <h6>📝 {habit.description}</h6>
                        <h6>📅 Frequency: {habit.frequency}</h6>
                        <h6>⏳ Time Required: {habit.time_req}</h6>
                        <h6>🔄 Status: <strong>{habit.status}</strong></h6>

                        <div className="d-flex justify-content-between mt-2">
                          <button
                            className={`btn ${habit.status === "Completed" ? "btn-secondary" : "btn-success"}`}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click from toggling
                              handleToggleComplete(habit.habit_id, habit.status);
                            }}
                          >
                            {habit.status === "Completed" ? "🔄 Mark as Incomplete" : "✅ Mark as Complete"}
                          </button>
                          <div className="d-flex">
                            <button className="btn btn-outline-light mx-2" onClick={(e) => { e.stopPropagation(); handleEditHabit(habit); }}>
                            ✏️
                            </button>
                            <button className="btn btn-outline-light" onClick={(e) => { e.stopPropagation(); handleDeleteHabit(habit.habit_id); }}>
                            🗑️
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              </div>
            </div>
          </div>
        {/* </div> */}
      </div>

      {/* Add Habit Modal */}
      <AddHabitModal show={showModal} onClose={() => setShowModal(false)} />
      
      {/* Edit Habit Modal */}
      {showEditModal && editHabit && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Habit</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                value={editHabit?.title || ""}
                placeholder="Habit Title"
                onChange={(e) => setEditHabit({ ...editHabit, title: e.target.value })}
              />

              <textarea
                className="form-control mb-2"
                value={editHabit?.description || ""}
                placeholder="Habit Description"
                onChange={(e) =>
                  setEditHabit({ ...editHabit, description: e.target.value })
                }
              ></textarea>

              <select
                className="form-control mb-2"
                value={editHabit?.frequency || "Daily"}
                onChange={(e) =>
                  setEditHabit({ ...editHabit, frequency: e.target.value })
                }
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Custom...</option>
              </select>

              <select
                className="form-control mb-2"
                value={editHabit?.time_req || "Select time required"}
                onChange={(e) =>
                  setEditHabit({ ...editHabit, time_req: e.target.value })
                }
              >
                <option>Select time required</option>
                <option>30 mins</option>
                <option>1 hr</option>
                <option>1 hr 30 mins</option>
                <option>2 hrs</option>
                <option>2 hr 30 mins</option>
                <option>Custom...</option>
              </select>

              </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={updateHabit}>
                    Save
                  </button>
                </div>
            </div>
          </div>
        </div>
      )} 
    </div>
  );
};

export default Dashboard;
