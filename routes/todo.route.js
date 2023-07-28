const express = require("express");
const {
  getTodoList,
  addTodo,
  deleteTodo,
  updateTodo,
} = require("../controllers/todo.controller");
const verifyToken = require("../middlewares/token-authentication");
const router = express.Router();

router.get("/",verifyToken, getTodoList);
router.post("/add-todo",verifyToken, addTodo);
router.delete("/delete-todo/:id",verifyToken, deleteTodo);
router.put("/update-todo/:id",verifyToken,updateTodo)

module.exports = router;
