import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import path from "path";

import groupRouter from "./routers/groupRouter.js";
import authRouter from "./routers/authRouter.js";
import todoRouter from "./routers/todoRouter.js";
import User from "./models/userModel.js";
import Todo from "./models/todoModel.js";
import Group from "./models/groupModel.js";

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3001;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

const app = express();

app.use(
	cors({
		allowOrigin: CLIENT_URL,
		origin: CLIENT_URL,
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
	// res.header("Access-Control-Allow-Origin", "*");
	// res.header("Access-Control-Allow-Headers", "*");
	// res.header("Access-Control-Allow-Credentials", true);
	// res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

	next();
});

app.use(
	session({
		secret: COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: MONGO_URL,
		}),
		unset: "destroy",
	})
);

app.use(passport.initialize());
app.use(passport.session());

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { checkIsAuthenticated } from "./middlewares.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: GOOGLE_CALLBACK_URL,
		},
		async function verify(accessToken, refreshToken, profile, cb) {
			try {
				const user = await User.findOne({ gId: profile.id });
				if (user) return cb(null, user);
				else {
					const newUser = await User.create({
						gId: profile.id,
						name: profile.displayName,
					});
					await Todo.create({
						text: "Finishing Web dev course ",
						user: newUser._id,
					});
					const group = await Group.create({
						text: "MERN project todo",
						user: newUser._id,
					});
					await Todo.create({
						text: "Add authentication with JWT",
						belongTo: group._id,
						user: newUser._id,
					});
					await Todo.create({
						text: "Finishing the UI",
						belongTo: group._id,
						user: newUser._id,
					});

					return cb(null, newUser);
				}
			} catch (e) {
				return cb(e);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (e) {
		done(e);
	}
});

app.use("/", express.static("views"));

app.use("/group", checkIsAuthenticated, groupRouter);
app.use("/todo", checkIsAuthenticated, todoRouter);
app.use("/auth", authRouter);

app.get("*", (req, res) => {
	res.sendFile(path.resolve("./views/index.html"));
});

mongoose
	.connect(MONGO_URL, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then((res) => {
		console.log("Connected to MongoDB");

		app.listen(PORT, () => {
			console.log(`Server started at post ${PORT}`);
		});
	});
