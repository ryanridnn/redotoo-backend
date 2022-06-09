import express from "express";
import {
	getGroups,
	addGroup,
	deleteGroup,
	updateGroup,
} from "../contorllers/groupController.js";

const router = express.Router();

router.get("/", getGroups);
router.post("/", addGroup);
router.patch("/", updateGroup);
router.delete("/:id", deleteGroup);

export default router;
