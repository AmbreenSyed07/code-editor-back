const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
const secretKey = parseInt(process.env.SECRET_KEY);

const addSecretKey = (password) => {
  return password + secretKey;
};

const hashPassword = (password) => {
  return bcrypt.hashSync(addSecretKey(password), saltRounds).toString();
};

const comparePassword = (password, hash) => {
  return bcrypt.compareSync(addSecretKey(password), hash); 
};

module.exports = {
  hashPassword,
  comparePassword,
};
