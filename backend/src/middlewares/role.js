const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "ต้องเป็นแอดมินเท่านั้น" });
  }
  next();
};

const isSelfOrAdmin = (req, res, next) => {
  const { id } = req.params;
  if (req.user.role === "admin" || req.user.userId === Number(id)) {
    return next();
  }
  return res.status(403).json({ msg: "ไม่มีสิทธิ์เข้าถึงข้อมูลนี้" });
};

module.exports = { isAdmin, isSelfOrAdmin };
