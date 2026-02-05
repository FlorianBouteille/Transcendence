import jwt from "jsonwebtoken";

// Verify the JSON Web Token send by the client
export const checkAuthToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.sendStatus(401);

	const token = authHeader.split(" ")[1];
	if (!token) return res.sendStatus(401);

	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
	} catch {
		return res.sendStatus(401);
	}
	next();
};
