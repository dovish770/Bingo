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
exports.InventoryUpdateForManager = exports.updateShippingStatusInOrder = exports.getOrderByUserId = exports.getAllOrders = exports.addOrder = void 0;
const OrderModel_1 = __importDefault(require("../models/OrderModel"));
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const addOrder = (userId, region) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const totalAmount = yield Promise.all(user.cart.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield ProductModel_1.default.findById(item.product);
            return product.price * item.amount;
        })));
        const totalPrice = totalAmount.reduce((sum, price) => sum + price, 0);
        if (totalPrice === 0) {
            console.log(user);
            throw new Error("Cart is empty");
        }
        const newOrder = {
            userId: userId,
            products: user.cart,
            region,
            totalAmount: totalPrice,
            orderDate: new Date(),
            isDelivered: false,
        };
        user.cart = [];
        const order = yield OrderModel_1.default.create(newOrder);
        yield order.save();
        if (!order) {
            throw new Error("Order not created");
        }
        yield user.save();
        const orders = yield OrderModel_1.default.find({});
        return orders;
    }
    catch (err) {
        throw err;
    }
});
exports.addOrder = addOrder;
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield OrderModel_1.default.find({});
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
const getOrderByUserId = (userName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findOne({ username: userName });
        if (!user) {
            throw new Error("User not found");
        }
        const order = yield OrderModel_1.default.find({ userId: user._id });
        if (!order) {
            throw new Error("Orders for user not found");
        }
        return order;
    }
    catch (err) {
        throw err;
    }
});
exports.getOrderByUserId = getOrderByUserId;
const updateShippingStatusInOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield OrderModel_1.default.findById(orderId);
        if (!order) {
            throw new Error("Order not found");
        }
        order.isDelivered = order.isDelivered === false ? true : false;
        yield order.save();
        const orders = yield OrderModel_1.default.find({});
        return orders;
    }
    catch (err) {
        throw err;
    }
});
exports.updateShippingStatusInOrder = updateShippingStatusInOrder;
const InventoryUpdateForManager = (productId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield ProductModel_1.default.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        if (amount === 0) {
            throw new Error("Quantity must be greater than 0");
        }
        if (product.inventory + amount < 0) {
            throw new Error("Quantity must be greater than 0");
        }
        product.inventory += amount;
        yield product.save();
        const products = yield ProductModel_1.default.find({});
        return products;
    }
    catch (err) {
        throw err;
    }
});
exports.InventoryUpdateForManager = InventoryUpdateForManager;
