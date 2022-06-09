import express from "express";
import {
	addTodo,
	deleteTodo,
	getTodos,
	updateTodo,
} from "../contorllers/todoController.js";

const router = express.Router();

router.get("/", getTodos);
router.post("/", addTodo);
router.patch("/", updateTodo);
router.delete("/:todoId", deleteTodo);

export default router;
