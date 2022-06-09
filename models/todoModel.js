import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
	belongTo: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Group",
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

export default mongoose.model("Todo", todoSchema);
