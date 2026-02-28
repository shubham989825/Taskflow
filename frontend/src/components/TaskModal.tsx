import { useState } from "react";
import { socket } from "../socket";
import "../style/board.css";

type TaskUpdate =
  | {
      _id: string;
      title: string;
      description?: string;
      status: string;
      dueDate?: string;
    }
  | { deleted: string };

 
interface TaskModalProps {
  task: {
    _id: string;
    title: string;
    description?: string;
    dueDate?: string;
    status: string;
  };
  boardId: string;
  onClose: () => void;
  onUpdate: (updatedTask: TaskUpdate) => void;
}

 
const TaskModal: React.FC<TaskModalProps> = ({ task, boardId, onClose, onUpdate }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });

      const updatedTask = await res.json();
      socket.emit("taskUpdated", updatedTask);
      onUpdate(updatedTask);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update task.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      socket.emit("taskDeleted", task._id);
      onUpdate({ deleted: task._id });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Task</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;