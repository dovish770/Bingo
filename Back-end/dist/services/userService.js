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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.gitUserById = exports.AddProductToCart = exports.login = void 0;
exports.CreateObjectUser = CreateObjectUser;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const utils_1 = require("../utils/utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const ProductService_1 = require("./ProductService");
dotenv_1.default.config();
const Jwt_Secret = process.env.JWT_SECRET;
function CreateObjectUser(username, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!username || !password || !email) {
                throw new Error("Username or password or email are required");
            }
            const userExists = yield (0, utils_1.IfUserExists)(username);
            if (userExists.userExists) {
                throw new Error("User already exists");
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = new UserModel_1.default({
                username,
                email,
                password: hashedPassword,
                isAdmin: false,
            });
            return newUser;
        }
        catch (err) {
            throw err;
        }
    });
}
const login = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!username || !password) {
            throw new Error("Username and password are required");
        }
        const userFind = yield (0, utils_1.IfUserExists)(username);
        if (!userFind.userExists) {
            throw new Error("One of the details is wrong");
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, userFind.user.password);
        if (!isPasswordValid) {
            throw new Error("One of the details is wrong");
        }
        const token = jsonwebtoken_1.default.sign({ userId: userFind.user._id }, Jwt_Secret, { expiresIn: "1h" });
        return { token: token, user: userFind.user };
    }
    catch (err) {
        throw err;
    }
});
exports.login = login;
const AddProductToCart = (userId, productId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!userId || !productId || !amount) {
            throw new Error("User ID, product ID, and quantity are required");
        }
        if (amount === 0) {
            throw new Error("Quantity must be greater than 0");
        }
        const user = yield UserModel_1.default.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const product = yield ProductModel_1.default.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        const existingItem = user.cart.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.amount += amount;
        }
        else {
            if (amount < 0) {
                throw new Error("Quantity must be greater than 0");
            }
            const newProductInOrder = {
                product: productId,
                amount: amount,
            };
            user.cart.push(newProductInOrder);
        }
        yield user.save();
        yield (0, ProductService_1.UpdateTheQuantityOfAProductInStock)(productId, amount);
        return user;
    }
    catch (error) {
        throw new Error(error.message || "An error occurred while adding the product to the cart");
    }
});
exports.AddProductToCart = AddProductToCart;
const gitUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    catch (error) {
        throw new Error(error.message || "An error occurred while getting the user");
    }
});
exports.gitUserById = gitUserById;
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield UserModel_1.default.find({});
        if (orders.length === 0) {
            throw new Error("No orders found");
        }
        return orders;
    }
    catch (err) {
        throw err;
    }
});
exports.getAllOrders = getAllOrders;
