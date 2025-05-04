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
exports.getAllProductsHandler = void 0;
const ProductService_1 = require("../services/ProductService");
const getAllProductsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, ProductService_1.GetAllProducts)();
        if (!products) {
            res.status(404).json({ message: "No products found", success: false });
            return;
        }
        res
            .status(200)
            .json({
            massage: "Products fetched successfully",
            data: products,
            success: true,
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
});
exports.getAllProductsHandler = getAllProductsHandler;
