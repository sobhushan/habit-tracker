// src/pages/Dashboard.tsx
import { Link } from "react-router-dom";
import Dashnav from "../components/Dashnav";
import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const [newHabit, setNewHabit] = useState({
    title: "",
    description: "",
    frequency: "Daily",
    time_req: "30 mins",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHabit, setEditHabit] = useState<any>(null);
  const [username, setUsername] = useState<string | null>("User");


  // useEffect(() => {
  //   const storedUsername = localStorage.getItem("username");
  //   setUsername(storedUsername);
  //   const fetchHabits = async () => {
  //     const user_id = localStorage.getItem("user_id");
  //     if (!user_id) {
  //       alert("Unauthorized access");
  //       window.location.href = "/";
  //       return;
  //     }

  //     try {
  //       const response = await axios.get(`http://localhost:3000/api/habits?user_id=${user_id}`);
  
  //       // Set default values for any habit if not present
  //       const habitsWithDefaults = response.data.map((habit: any) => ({
  //         ...habit,
  //         status: habit.status || "Pending", 
  //         streak: habit.streak || 0, 
  //       }));
  
  //       setHabits(habitsWithDefaults);
  //     } catch (error) {
  //       console.error("Error fetching habits:", error);
  //     }
  //   };

  //   fetchHabits();
  // }, []);
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
    const fetchHabits = async () => {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        alert("Unauthorized access");
        window.location.href = "/";
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/habits?user_id=${user_id}`);
        console.log('GET on reload:',response.data)
    
        // Use the data returned by the backend directly
        setHabits(response.data);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };

    fetchHabits();
  }, []);
  
  // Logout Function
  const handleLogout = () => {
    alert("Logged out!");
    window.location.href = "/";
  };

  // Toggle Complete Button
  const handleToggleComplete = async (habit_id: number) => {
    const confirmComplete = window.confirm("Are you sure?");
    if (!confirmComplete) return;
  
    const user_id = parseInt(localStorage.getItem("user_id") || "0", 10);
    const habitToUpdate = habits.find((habit) => habit.habit_id === habit_id);
    if (!habitToUpdate) return;
  
    // Toggle status
    // const isCompleted = habitToUpdate.status !== "Completed"; // Toggle status
    const isCompleted = habitToUpdate.status === "Completed" ? "Pending" : "Completed"
    // const updatedStreak = habitToUpdate.status === "Completed" ? habitToUpdate.streak - 1 : habitToUpdate.streak + 1,
    try {
      console.log('Payload to be sent habitlog:', {
        user_id: user_id,
        habit_id: habitToUpdate.habit_id,
        status: isCompleted
      });
      // Update habitlog for status
      const habitLogResponse = await axios.post("http://localhost:3000/api/habitlog", {
        user_id: user_id,
        habit_id: habitToUpdate.habit_id,
        status: isCompleted,
      }, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (habitLogResponse.status === 200) {
        console.log('Payload to be sent streaklog:', {
          user_id: user_id,
          habit_id: habitToUpdate.habit_id,
          status: isCompleted
        });
        // Update streaklog for streak count
        const streakLogResponse = await axios.post("http://localhost:3000/api/streaklog", {
          user_id: user_id,
          habit_id: habitToUpdate.habit_id,
          status: isCompleted,
        }, {
          headers: { "Content-Type": "application/json" },
        });
  
        if (streakLogResponse.status === 200) {
          // Update the state with the new streak and status
          const updatedStreak = streakLogResponse.data.streak_count;
          const updatedHabits = habits.map((habit) =>
            habit.habit_id === habit_id ? { ...habit, status: isCompleted, streak: updatedStreak } : habit
          );
          setHabits(updatedHabits);
        }
      }
    } catch (error) {
      console.error("Error updating habit status and streak:", error);
    }
  };
  

  // Delete Function
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
  

  // Add Function
  const addHabit = async () => {
    const user_id = localStorage.getItem("user_id");
  
    if (!user_id) {
      alert("Unauthorized access");
      return;
    }
  
    if (newHabit.title.trim() === "") {
      alert("Habit title cannot be empty!");
      return;
    }
  
    try {
      await axios.post("http://localhost:3000/api/habits", {
        user_id,
        title: newHabit.title,
        description: newHabit.description,
        frequency: newHabit.frequency,
        time_req: newHabit.time_req,
        streak: 0,
        status: "Pending",
      });
  
      alert("Habit added successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };
  

  // Edit Funtion
  const handleEditHabit = (habit: any) => {
    console.log("index:",habit)
    console.log({...habit})


    setShowEditModal(true);
    setEditHabit({...habit});
  };
  
  //   setHabits(updatedHabits); 
  //   setEditHabit(null);
  //   setShowEditModal(false);

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
      });
  
      console.log("Update response:", response.data);
      alert("Habit updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };
  

  return (
    <>
      <Dashnav />
      <div className="container mt-4">
        <div className="row">
          {/* Left Section (User Card) */}
          <div className="col-md-4">
            <div className="card p-3 text-center">
              <img
                src="/habit logo.png"
                alt="User"
                className="rounded-circle mx-auto d-block"
                style={{ width: "200px", height: "200px" }}
              />
              <h5 className="mt-3">Welcome, {username}</h5>
              <ul className="list-group mt-3">
                <Link className="list-group-item" to="/dashboard">
                  📋 All Habits
                </Link>
                <Link className="list-group-item" to="/statistics">
                  📊 Statistics
                </Link>
                <Link className="list-group-item" to="/events">
                  🏆 Rewards
                </Link>
              </ul>
              <button onClick={handleLogout} className="btn btn-danger mt-3">
                Logout
              </button>
            </div>
          </div>

          {/* Right Section (Dashboard) */}
          <div className="col-md-8">
            <div className="card p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Your Habits</h4>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  + Add Habit
                </button>
              </div>

              {/* Habit List - Single Column */}
              <div className="row">
                {habits.map((habit) => (
                  <div key={habit.id} className="col-12 mb-3">
                    <div className="card p-3">
                      <h3>{habit.title}</h3>
                      <h5>{habit.description}</h5>
                      <h6>📅 Frequency: {habit.frequency}</h6>
                      <h6>⏳ Time Required: {habit.time_req}</h6>
                      <h5>Status: <strong>{habit.status}</strong></h5>
                      <h5>🔥 Streak: {habit.streak} days</h5>

                      <div className="d-flex justify-content-between mt-2">
                      <button
                          className={`btn ${habit.status === "Completed" ? "btn-secondary" : "btn-success"}`}
                          onClick={() => handleToggleComplete(habit.habit_id)}
                        >
                          {habit.status === "Completed" ? "🔄 Mark as Incomplete" : "✅ Mark as Complete"}
                        </button>
                        <div className="d-flex">
                        <button className="btn btn-outline-warning mx-2" onClick={() => handleEditHabit(habit)}>
                          Edit
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDeleteHabit(habit.habit_id)}>
                          Delete
                        </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
      <div className="modal fade show d-block" id="addHabitModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Habit</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Habit Title"
                value={newHabit.title}
                onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
              />
              <textarea
                className="form-control mb-2"
                placeholder="Habit Description"
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              ></textarea>
              <select
                className="form-control mb-2"
                value={newHabit.frequency}
                onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Custom...</option>
              </select>
              <select
                className="form-control mb-2"
                value={newHabit.time_req}
                onChange={(e) => setNewHabit({ ...newHabit, time_req: e.target.value })}
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
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={addHabit}>
                Add Habit
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
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
    </>
  );
};

export default Dashboard;

