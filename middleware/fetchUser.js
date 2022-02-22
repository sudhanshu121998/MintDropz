const jwt = require("jsonwebtoken");
const JWT_SIGN = "MintDopzTest";

const fetchUser = (req, res, next) => {
  //Get the user from the jwt-token and add id to req object
  const token = req.header('auth-token' );
  if (!token) {
    res.status(401).json({
      error: "Please authenticate using valid token",
    });
  }
  try {
    const data = jwt.verify(token, JWT_SIGN);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({
      error: "Please authenticate using valid token",
    });
  }
};
module.exports = fetchUser;
