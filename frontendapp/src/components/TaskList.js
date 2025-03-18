import React, { useEffect, useState } from "react";
import axios from "axios";
import editIcon from "./edit-icon.png"; // Add an edit icon image in your project
import deleteIcon from "./delete-icon.png"; // Add a delete icon image in your project

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Pending");
  const [editingTaskId, setEditingTaskId] = useState(null); // Track task being edited

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
    if (!title) {
      alert("Title is required");
      return;
    }

    const taskData = { title, description, dueDate: dueDate || null, priority, status };

    if (editingTaskId) {
      // Update task
      axios
        .put(`http://localhost:5000/api/tasks/${editingTaskId}`, taskData)
        .then(() => {
          resetForm();
          fetchTasks();
        })
        .catch((error) => console.error("Error updating task", error));
    } else {
      // Create new task
      axios
        .post("http://localhost:5000/api/tasks", taskData)
        .then(() => {
          resetForm();
          fetchTasks();
        })
        .catch((error) => console.error("Error adding task", error));
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : ""); // Convert date format
    setPriority(task.priority);
    setStatus(task.status);
  };

  const handleDelete = (taskId) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${taskId}`)
      .then(() => fetchTasks())
      .catch((error) => console.error("Error deleting task", error));
  };

  const resetForm = () => {
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Low");
    setStatus("Pending");
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentBox}>
        <h2 style={styles.heading}>Task Management</h2>

        {/* Form to Add/Update Tasks */}
        <form style={styles.form} onSubmit={handleSubmit}>
          <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={styles.input} />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={styles.input} />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.input}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.input}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <button type="submit" style={styles.button}>{editingTaskId ? "Update Task" : "Add Task"}</button>
          {editingTaskId && <button type="button" onClick={resetForm} style={styles.cancelButton}>Cancel</button>}
        </form>

        {/* Task List Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.noTasks}>No tasks available</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.taskID}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</td>
                  <td>{task.priority}</td>
                  <td>{task.status}</td>
                  <td style={styles.actionCell}>
                    <img src={editIcon} alt="Edit" style={styles.iconButton} onClick={() => handleEdit(task)} />
                    <img src={deleteIcon} alt="Delete" style={styles.iconButton} onClick={() => handleDelete(task._id)} />
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

const styles = {
  container: { display: "flex", justifyContent: "center", padding: "20px" },
  contentBox: { width: "80%", backgroundColor: "#f4f4f4", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" },
  heading: { textAlign: "center", fontSize: "24px", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { width: "95%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" },
  button: { padding: "10px 20px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  cancelButton: { padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginLeft: "10px" },

  table: { 
    width: "100%", 
    marginTop: "20px", 
    borderCollapse: "collapse", 
    textAlign: "left"
  },
  th: { 
    backgroundColor: "#007BFF", 
    color: "white", 
    padding: "12px", 
    border: "1px solid #ccc", 
    textAlign: "left" 
  },
  td: { 
    padding: "10px", 
    border: "1px solid #ccc", 
    textAlign: "left"
  },
  noTasks: { textAlign: "center", padding: "10px", fontWeight: "bold" },

  actionCell: { 
    display: "flex", 
    justifyContent: "left", 
    gap: "10px",
    alignItems: "left"
  },
  iconButton: { width: "25px", height: "25px", cursor: "pointer" },
};

export default TaskList;
