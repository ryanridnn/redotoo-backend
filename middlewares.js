import dotenv from "dotenv";
dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL;

export const checkIsAuthenticated = (req, res, next) => {
	console.log(req.user);
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect(CLIENT_URL);
	}
};

export const checkIsNotAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		next();
	} else {
		res.redirect(CLIENT_URL);
	}
};
