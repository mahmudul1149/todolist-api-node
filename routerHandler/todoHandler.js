const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const todosSchema = require("../schems/todoSchema");
const Todo = new mongoose.model("Todo", todosSchema);
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.status(200).json({
      todos,
      message: "Success",
    });
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});
router.post("/", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(200).json({
      message: "Todo was inserted successfully!",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server-side error!",
    });
  }
});
router.post("/all", async (req, res) => {
  try {
    const todosToInsert = req.body;
    if (!Array.isArray(todosToInsert)) {
      return res.status(400).json({
        error: "Invalid request body. Expected an array of todos.",
      });
    }
    await Todo.insertMany(todosToInsert);
    res.status(200).json({
      message: "Todos were inserted successfully!",
    });
  } catch (err) {
    console.error("Error inserting todos:", err);
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});
router.put("/:id", async (req, res) => {
  const todo = req.body;
  const id = parseInt(req.params.id);
  try {
    const updated = await Todo.updateOne(
      { id },
      { $set: { title: todo.title } }
    );
    if (updated.nModified === 0) {
      res.send({
        success: false,
        message: "Could not update todo",
      });
    } else {
      res.send({
        success: true,
        todo,
        message: "Updated Succesfully",
      });
    }
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while updating the todo",
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Todo.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Deleted Succesfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error occured to deleted",
    });
  }
});

module.exports = router;
