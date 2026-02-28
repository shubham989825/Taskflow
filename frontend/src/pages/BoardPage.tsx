import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import TaskModal from "../components/TaskModal";
import "../style/board.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: string;
}

const BoardPage = () => {
  const { boardId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statuses = ["todo", "in-progress", "done"];

  useEffect(() => {
    if (!boardId) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${boardId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }
        
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [boardId]);

  //.................................
  useEffect(() => {
    if (!boardId) return;

    socket.emit("joinBoard", boardId);

    socket.on("taskCreated", (task: Task) =>
      setTasks((prev) => [...prev, task])
    );
    socket.on("taskUpdated", (updatedTask: Task) =>
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      )
    );
    socket.on("taskDeleted", (taskId: string) =>
      setTasks((prev) => prev.filter((t) => t._id !== taskId))
    );

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [boardId]);

  const handleTaskClick = (task: Task) => setSelectedTask(task);
  const handleCloseModal = () => setSelectedTask(null);

  const handleUpdateTask = (updatedTask: Task | { deleted: string }) => {
    if ("deleted" in updatedTask) {
      setTasks((prev) => prev.filter((t) => t._id !== updatedTask.deleted));
    } else {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${boardId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title: newTaskTitle, 
          description: "", 
          status: "todo" 
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await res.json();
      socket.emit("taskCreated", newTask);
      setTasks((prev) => [...prev, newTask]);
      setNewTaskTitle("");
      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const updatedTask = await res.json();
      socket.emit("taskUpdated", updatedTask);
      handleUpdateTask(updatedTask);
    } catch (err) {
      console.error(err);
      alert("Failed to update task status");
    }
  };

  return (
    <div className="board-page">
      <h2>Board: {boardId}</h2>
      
      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Loading tasks...
        </div>
      )}
      
      {error && (
        <div style={{ 
          textAlign: "center", 
          padding: "20px", 
          color: "#ef4444",
          backgroundColor: "#fee",
          borderRadius: "8px",
          marginBottom: "20px"
        }}>
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <>
          <button 
            className="create-board-btn" 
            onClick={() => setShowCreateForm(true)}
            style={{ marginBottom: "20px", padding: "10px 20px" }}
          >
            Create New Task
          </button>

          {showCreateForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Create New Task</h3>
                <form onSubmit={handleCreateTask}>
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                  />
                  <div className="modal-buttons">
                    <button type="submit" className="save-btn">Create</button>
                    <button type="button" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="columns">
              {statuses.map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided) => (
                    <div
                      className="column"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h3>{status.toUpperCase()}</h3>
                      {tasks
                        .filter((t) => t.status === status)
                        .map((task, index) => (
                          <Draggable
                            draggableId={task._id}
                            index={index}
                            key={task._id}
                          >
                            {(provided) => (
                              <div
                                className="task-item"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => handleTaskClick(task)}
                              >
                                <h4>{task.title}</h4>
                                <p>{task.description || "No description"}</p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                      {tasks.filter((t) => t.status === status).length === 0 && (
                        <div style={{ 
                          textAlign: "center", 
                          color: "#999", 
                          padding: "20px",
                          fontStyle: "italic"
                        }}>
                          No tasks in {status}
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>

          {selectedTask && (
            <TaskModal
              task={selectedTask}
              boardId={boardId!}
              onClose={handleCloseModal}
              onUpdate={handleUpdateTask}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BoardPage;