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
exports.InventoryUpdateForManagerController = exports.updateShippingStatusInOrderController = exports.getOrderByIdController = exports.getAllOrdersController = exports.addPurchaseToDatabaseController = void 0;
const OrderService_1 = require("../services/OrderService");
const addPurchaseToDatabaseController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, region } = req.body;
        const orders = yield (0, OrderService_1.addOrder)(userId, region);
        // console.log(orders)
        res.status(200).json({
            message: "Order added successfully",
            data: orders,
            success: true,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
});
exports.addPurchaseToDatabaseController = addPurchaseToDatabaseController;
const getAllOrdersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield (0, OrderService_1.getAllOrders)();
        res.status(200).json({
            message: "Orders fetched successfully",
            data: orders,
            success: true,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
});
exports.getAllOrdersController = getAllOrdersController;
const getOrderByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName } = req.params;
        const order = yield (0, OrderService_1.getOrderByUserId)(userName);
        res.status(200).json({
            message: "Order fetched successfully",
            data: order,
            success: true,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
});
exports.getOrderByIdController = getOrderByIdController;
const updateShippingStatusInOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        const order = yield (0, OrderService_1.updateShippingStatusInOrder)(orderId);
        res.status(200).json({
            message: "Order updated successfully",
            data: order,
            success: true,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
});
exports.updateShippingStatusInOrderController = updateShippingStatusInOrderController;
const InventoryUpdateForManagerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, amount } = req.body;
        const orders = yield (0, OrderService_1.InventoryUpdateForManager)(productId, amount);
        res.status(200).json({
            message: "Order updated successfully",
            data: orders,
            success: true,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
});
exports.InventoryUpdateForManagerController = InventoryUpdateForManagerController;
