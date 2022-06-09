import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

export default mongoose.model("Group", groupSchema);
