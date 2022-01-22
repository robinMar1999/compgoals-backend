import jwt from "jsonwebtoken";

import config from "../../config/config.js";

const auth = (req, res, next) => {
  // get token from header
  const token = req.header("x-auth-token");

  // check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied!" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.body = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid!" });
  }
};

export default auth;
