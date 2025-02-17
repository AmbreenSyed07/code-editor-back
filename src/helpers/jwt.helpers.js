const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const expiresIn = String(process.env.JWT_EXPIRY) || "1d";

const createToken = (info) => {
  const accessToken = jwt.sign(info, jwtSecret, {
    expiresIn: expiresIn,
  });
  return accessToken;
};

const verifyToken = (token) => {
  try {
    const tokenData = jwt.verify(token, jwtSecret);
    return tokenData;
  } catch (error) {
    return false;
  }
};

module.exports = {
  createToken,
  verifyToken,
};
