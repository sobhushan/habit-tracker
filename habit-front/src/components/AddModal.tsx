// //src/components/AddModal.tsx
import  { useState } from "react";
import axios from "axios";

const AddHabitModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
  const [newHabit, setNewHabit] = useState({
    title: "",
    description: "",
    frequency: "Daily",
    time_req: "Select time required",
  });

  // const handleAddHabit = () => {
  //   if (!newHabit.title.trim()) {
  //     alert("Habit title is required!");
  //     return;
  //   }
  //   addHabit(newHabit);
  //   setNewHabit({ title: "", description: "", frequency: "Daily", time_req: "Select time required" });
  //   onClose();
  // };

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

  if (!show) return null;

  return (
    <div className="modal fade show d-block" id="addHabitModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Habit</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
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
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={addHabit}>
              Add Habit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHabitModal;
