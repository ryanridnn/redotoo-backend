import Group from "../models/groupModel.js";
import Todo from "../models/todoModel.js";

export const getGroups = async (req, res) => {
	try {
		const groups = await Group.find({ user: req.user._id });
		return res.status(200).json({ groups });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
};

export const addGroup = async (req, res) => {
	const { text } = req.body;
	const { _id } = req.user;

	try {
		const group = await Group.create({ text, user: _id });
		return res.status(201).json({ group });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
};

export const deleteGroup = async (req, res) => {
	const { id } = req.params;

	try {
		await Todo.deleteMany({ belongTo: id, user: req.user._id });

		await Group.remove({ _id: id, user: req.user._id });

		return res.status(200).json({ message: "OK" });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
};

export const updateGroup = async (req, res) => {
	const { id, text } = req.body;

	try {
		const group = await Group.findByIdAndUpdate(
			id,
			{ text },
			{ new: true }
		);
		return res.status(200).json({ group });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
};
