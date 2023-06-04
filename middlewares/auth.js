import jwt from "jsonwebtoken";
import env from 'dotenv'
/** auth middleware */
export default async function Auth(req, res, next) {
    try {
        // access authorize header to validate request
        const token = req.headers.authorization.split(" ")[1];

        // retrieve the user details for the logged in user
        const decodedToken = await jwt.verify(token, env.JWT_SECRET);

        req.user = decodedToken;
        next()
    } catch (error) {
        res.status(401).json({ erro: "Authentication failed!" });
    }
}

export function localVariable(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false,
    },
        next()
}