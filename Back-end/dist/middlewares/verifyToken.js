"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Jwt_Secret = process.env.JWT_SECRET;
function verifyToken(req, res, next) {
    var _a;
    if (!Jwt_Secret) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.Token;
    if (!token) {
        return res.status(403).json({
            message: "Access denied, no token provided",
            success: false,
        });
    }
    const tokenWithoutBearer = token.startsWith("Bearer ") ? token.slice(7) : token;
    jsonwebtoken_1.default.verify(tokenWithoutBearer, Jwt_Secret, (err) => {
        if (err) {
            return res.status(401).json({
                message: "Invalid or expired token",
                success: false,
            });
        }
        next();
    });
}
