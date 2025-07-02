const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.user.id },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized: User not found" });
    }

    req.user = {
      userId: user.id,
      username: user.username,
      role: user.role.name, // สำคัญมาก สำหรับการเช็ก permission
    };

    next();
  } catch (err) {
    console.log("middleware error: " + err);
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
};

module.exports = { authenticateToken };
