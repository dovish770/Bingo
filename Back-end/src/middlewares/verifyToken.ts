import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const Jwt_Secret = process.env.JWT_SECRET;

export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  if (!Jwt_Secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const token = req.cookies?.Token;

  if (!token) {
    return res.status(403).json({
      message: "Access denied, no token provided",
      success: false,
    });
  }

  const tokenWithoutBearer = token.startsWith("Bearer ") ? token.slice(7) : token;

  jwt.verify(tokenWithoutBearer, Jwt_Secret as string, (err: any) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
        success: false,
      });
    }
    next();
  });
}
