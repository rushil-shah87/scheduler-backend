const jwt = require("../node_modules/jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.status(401).json({ msg: "no authentication token found" });

        const verified = jwt.verify(token, "jwt_password_here");
        if (!verified) return res.status(401).json({ msg: "token verification failed" });

        req.user = verified.id;
        next();
    } catch (err) {
        res.status(500).json(err);
    }

};

module.exports = auth;