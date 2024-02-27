const JWT = require("jsonwebtoken");

const secret = "12345!@#$%";

function setUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function getUser(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  setUser,
  getUser,
};
