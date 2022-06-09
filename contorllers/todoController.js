import Todo from "../models/todoModel.js";
import Group from "../models/groupModel.js";

export const getTodos = async (req, res) => {
	try {
		const groups = await Group.find({ user: req.user._id });
		const todos = await Todo.find({ user: req.user._id });

		const all = [];

		todos.forEach((todo) => {
			if (!todo.belongTo) all.push(todo);
		});

		groups.forEach((group) => {
			const matches = todos.filter((todo) => {
				return String(todo.belongTo) === String(group._id);
			});
			all.push({ ...group._doc, todos: matches });
		});

		return res.status(200).json({ todos: all });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
};

export const addTodo = async (req, res) => {
	const { _id } = req.user;
	const { text, group } = req.body;

	try {
		let todo;

		if (group) {
			todo = await Todo.create({ text, belongTo: group, user: _id });
		} else {
			todo = await Todo.create({ text, user: _id });
		}

		return res.status(200).json({ todo });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
};

export const deleteTodo = async (req, res) => {
	const userId = req.user._id;
	const { todoId } = req.params;

	try {
		await Todo.remove({ _id: todoId, user: userId });
		return res.status(200).json({ message: "Todo is deleted" });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
};

export const updateTodo = async (req, res) => {
	const { _id, ...rest } = req.body;

	try {
		const todo = await Todo.findByIdAndUpdate(_id, rest, { new: true });
		return res.status(200).json({ todo });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
};
