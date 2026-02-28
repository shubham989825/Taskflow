import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/board.css";

interface Board {
  _id: string;
  name: string;
  description?: string;
}

const BoardsListPage = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        
        console.log("Token from localStorage:", token);
        
        if (!token) {
          setError("Please login to view boards");
          navigate("/login");
          return;
        }
        
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/boards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Boards API response status:", res.status);
        
        if (!res.ok) {
          if (res.status === 401) {
            setError("Please login again");
            localStorage.removeItem("token"); // Clear invalid token
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch boards");
        }
        
        const data = await res.json();
        console.log("Boards data:", data);
        setBoards(data);
      } catch (err) {
        console.error("Error fetching boards:", err);
        setError("Failed to load boards");
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [navigate]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: newBoardName, 
          description: newBoardDescription 
        }),
      });

      const newBoard = await res.json();
      setBoards([...boards, newBoard]);
      setNewBoardName("");
      setNewBoardDescription("");
      setShowCreateForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create board");
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/boards/${boardId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setBoards(boards.filter(board => board._id !== boardId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete board");
    }
  };

  return (
    <div className="board-container">
      <h1 className="board-title">My Boards</h1>
      
      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Loading boards...
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
            Create New Board
          </button>

          {showCreateForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Create New Board</h3>
                <form onSubmit={handleCreateBoard}>
                  <input
                    type="text"
                    placeholder="Board Name"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    required
                  />
                  <textarea
                    placeholder="Board Description (optional)"
                    value={newBoardDescription}
                    onChange={(e) => setNewBoardDescription(e.target.value)}
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

          <div className="boards-grid" style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "20px" 
          }}>
            {boards.map((board) => (
              <div 
                key={board._id} 
                className="board-card"
                style={{ 
                  background: "white", 
                  padding: "20px", 
                  borderRadius: "10px", 
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onClick={() => navigate(`/board/${board._id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", color: "#4f46e5" }}>
                  {board.name}
                </h3>
                {board.description && (
                  <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                    {board.description}
                  </p>
                )}
                <button 
                  className="delete-board-btn"
                  style={{ 
                    marginTop: "10px", 
                    padding: "5px 10px", 
                    fontSize: "12px" 
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm("Are you sure you want to delete this board?")) {
                      handleDeleteBoard(board._id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {boards.length === 0 && (
            <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>
              No boards found. Create your first board to get started!
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BoardsListPage;
