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
exports.UpdateTheQuantityOfAProductInStock = exports.GetAllProducts = void 0;
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const GetAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield ProductModel_1.default.find({});
        if (products.length === 0) {
            throw new Error("No products found");
        }
        return products;
    }
    catch (err) {
        throw err;
    }
});
exports.GetAllProducts = GetAllProducts;
const UpdateTheQuantityOfAProductInStock = (productId, inventory) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield ProductModel_1.default.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        if (inventory !== 0) {
            product.inventory += inventory * -1;
        }
        yield product.save();
        return yield (0, exports.GetAllProducts)();
    }
    catch (error) {
        throw new Error("An error occurred while updating the product inventory.");
    }
});
exports.UpdateTheQuantityOfAProductInStock = UpdateTheQuantityOfAProductInStock;
