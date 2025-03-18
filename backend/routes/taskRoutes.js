const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Function to generate a new human-readable task ID (increments by 100)
const generateTaskID = async () => {
  const lastTask = await Task.findOne().sort({ taskID: -1 }); // Get last task by taskID
  const lastID = lastTask ? parseInt(lastTask.taskID.split("-")[1]) : 1000; // Extract numeric part
  return `TASK-${lastID + 100}`; // Increment by 100
};

// Create Task
router.post("/", async (req, res) => {
  try {
    const newTaskID = await generateTaskID();

    const taskData = {
      taskID: newTaskID,
      title: req.body.title,
      description: req.body.description || "",
      dueDate: req.body.dueDate || null,
      priority: req.body.priority || "Low",
      status: req.body.status || "Pending",
      createdBy: req.body.createdBy || null, // Optional
    };

    const task = new Task(taskData);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error });
  }
});

// Get All Tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

// Update Task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: "Error updating task", error });
  }
});

// Delete Task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

module.exports = router;
