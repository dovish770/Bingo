"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsersController = exports.getUserByIdController = exports.addProductToCartController = exports.loginUserHandler = exports.registerUserHandler = void 0;
const userService_1 = require("../services/userService");
const registerUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const newUser = yield (0, userService_1.CreateObjectUser)(username, email, password);
        yield newUser.save();
        res.status(201).json({
            message: "User created successfully",
            data: newUser,
            success: true,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
});
exports.registerUserHandler = registerUserHandler;
const loginUserHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const data = yield (0, userService_1.login)(username, password);
        const { token, user } = data;
        console.log("token", token);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'none',
        });
        res.status(200).json({
            message: "Login successful",
            data: { user, token },
            success: true,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(400).json({
            message: error.message || "Something went wrong during login",
            success: false,
        });
    }
});
exports.loginUserHandler = loginUserHandler;
const addProductToCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, productId, userId } = req.body;
        console.log(amount);
        const data = yield (0, userService_1.AddProductToCart)(userId, productId, amount);
        res.status(200).json({
            message: "Product added to cart successfully",
            data: data,
            success: true,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
});
exports.addProductToCartController = addProductToCartController;
const getUserByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield (0, userService_1.gitUserById)(userId);
        res.status(200).json({
            message: "User fetched successfully",
            data: user,
            success: true,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
});
exports.getUserByIdController = getUserByIdController;
const getAllUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield gitAllUsers();
        res.status(200).json({
            message: "Users fetched successfully",
            data: users,
            success: true,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
});
exports.getAllUsersController = getAllUsersController;
function gitAllUsers() {
    throw new Error("Function not implemented.");
}
