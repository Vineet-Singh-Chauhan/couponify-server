const onlyAdminAccess = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "only admin access allowed" });
  }
  next();
};

module.exports = onlyAdminAccess;
