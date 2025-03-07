import React, { useEffect, useState } from "react";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !status) {
      alert("Please fill in all fields");
      return;
    }

    axios
      .post("http://localhost:5000/api/tasks", { title, status })
      .then(() => {
        setTitle("");
        setStatus("");
        fetchTasks(); // Refresh the task list
      })
      .catch((error) => console.error("Error adding task", error));
  };

  const handleDelete = (taskId) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${taskId}`)
      .then(() => {
        fetchTasks(); // Refresh list after deletion
      })
      .catch((error) => console.error("Error deleting task", error));
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentBox}>
        <h2 style={styles.heading}>Task Management</h2>

        {/* Form to Add Tasks */}
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button type="submit" style={styles.button}>
            Add Task
          </button>
        </form>

        {/* Task List Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.noTasks}>
                  No tasks available
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task._id}</td>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                  <td>{new Date(task.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },
  contentBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: "700px",
    textAlign: "center",
  },
  heading: {
    textAlign: "center",
    marginBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  input: {
    width: "90%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    textAlign: "left",
  },
  noTasks: {
    textAlign: "center",
    padding: "10px",
    fontWeight: "bold",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  th: {
    background: "#007BFF",
    color: "#fff",
    padding: "10px",
    border: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
  },
};

export default TaskList;
