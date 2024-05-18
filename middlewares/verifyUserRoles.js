const jwt = require("jsonwebtoken");

const verifyUserRoles = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) return res.sendStatus(403);
      req.isAdmin = data.userType == "admin";
      req.email = data.email;
      next();
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(403)
      .send({ error: "Please authenticate using a valid token !" });
  }
};

module.exports = verifyUserRoles;
