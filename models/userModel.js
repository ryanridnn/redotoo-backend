import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	gId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

export default mongoose.model("User", userSchema);
