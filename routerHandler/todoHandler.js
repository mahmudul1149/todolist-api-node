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
  const { title, author, released } = req.body;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: title,
          author: author,
          released: released,
        },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        error: "Todo not found!",
      });
    }

    return res.status(200).json({
      message: "Todo was updated successfully!",
      updatedTodo,
    });
  } catch (err) {
    return res.status(500).json({
      error: "There was a server-side error!",
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
