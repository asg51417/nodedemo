const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {

    // get token from request header
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    // if there is not token in request then throw error
    if (!token) {
        return res.status(403).send({ code: 403, message: "A token is required for authentication", Date: new Date() });
    }

    try {
        // verify jwt token
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        // token is invalid
        return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;