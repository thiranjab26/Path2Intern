import jwt from "jsonwebtoken";
import { ModuleScopedRole } from "../models/moduleScopedRole.model.js";

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

/**
 * Checks that the authenticated user holds one of the specified scoped
 * roles for a given module.
 *
 * Usage:
 *   requireModuleRole("DS", ["MODULE_MANAGER"])
 *   requireModuleRole("DS", ["MODULE_MANAGER", "MODULE_OPERATOR"])
 *
 * The module code is read from:
 *   1. req.params.module  (preferred for route params like /questions/:module)
 *   2. req.body.module    (for POST bodies)
 *   3. req.query.module   (query string fallback)
 *
 * Or you can hard-code the module code as the first argument.
 *
 * @param {string|null} moduleCode  - Hard-coded module, or null to read from request
 * @param {string[]}    allowedRoles - Array of scoped roles that are permitted
 */
export const requireModuleRole = (moduleCode, allowedRoles = ["MODULE_MANAGER"]) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.userId) return res.status(401).json({ message: "Unauthorized" });

      // Resolve the module code
      const module =
        moduleCode ||
        req.params.module ||
        req.body.module ||
        req.query.module;

      if (!module) {
        return res.status(400).json({ message: "Module code is required" });
      }

      const scopedRole = await ModuleScopedRole.findOne({
        userId: req.user.userId,
        module,
        role: { $in: allowedRoles },
      });

      if (!scopedRole) {
        return res.status(403).json({
          message: `Forbidden: you do not hold a required role (${allowedRoles.join(" or ")}) for module ${module}`,
        });
      }

      // Attach to request for downstream use
      req.moduleRole = scopedRole;
      next();
    } catch {
      res.status(500).json({ message: "Server error checking module role" });
    }
  };
};