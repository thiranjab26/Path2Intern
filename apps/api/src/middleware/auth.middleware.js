import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    // Check Authorization header first
    let token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;

    // If no token in header, check cookies
    if (!token) {
      token = req.cookies.authToken;
    }

    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, globalRole }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.globalRole) return res.status(401).json({ message: "Unauthorized" });

    if (!allowedRoles.includes(req.user.globalRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};