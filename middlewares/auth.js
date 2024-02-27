const { getUser } = require("../services/auth"); // Replace with the actual path

function checkForUserAuthCookie(cookieName) {
  return async (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = await getUser(tokenCookieValue); // Assuming getUser is an asynchronous function
      req.user = userPayload;
    } catch (error) {
      // Handle error appropriately, e.g., log it or send an error response
      console.error(error);
    }

    return next();
  };
}

module.exports = {
  checkForUserAuthCookie,
};
