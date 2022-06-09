import dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
import {
	checkIsAuthenticated,
	checkIsNotAuthenticated,
} from "../middlewares.js";
const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL;

router.get(
	"/google",
	checkIsNotAuthenticated,
	passport.authenticate("google", { scope: ["profile"] })
);

router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: CLIENT_URL,
		successRedirect: CLIENT_URL,
	})
);

router.get("/getuser", checkIsAuthenticated, (req, res) => {
	try {
		return res.status(200).json({ user: req.user });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.get("/logout", checkIsAuthenticated, (req, res) => {
	req.logOut(() => {
		res.json({ message: "Log Out" });
	});
});

export default router;
