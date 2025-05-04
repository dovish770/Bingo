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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const userService_1 = require("../src/services/userService");
const userController_1 = require("../src/controllers/userController");
const ProductController_1 = require("../src/controllers/ProductController");
const ProductService_1 = require("../src/services/ProductService");
const verifyToken_1 = require("../src/middlewares/verifyToken");
const OrderController_1 = require("../src/controllers/OrderController");
const enums_1 = require("../src/types/enums");
const mongoose_1 = require("mongoose");
const mockProductInOrder = {
    _id: 'mockProductId',
    product: 'mockProduct',
    amount: 5
};
const mockUser = {
    _id: 'mockUserId',
    username: 'mockUser',
    email: 'mockuser@example.com',
    password: 'hashed_password_mock',
    isAdmin: false,
    cart: [mockProductInOrder],
};
const mockProducts = [
    {
        name: 'mockProductName',
        price: 5,
        inventory: 77,
        imageURL: 'mockURL',
        description: 'mockDescription',
        category: 'mockCategory'
    },
    {
        name: 'mockProductName',
        price: 54,
        inventory: 7,
        imageURL: 'mockURL',
        description: 'mockDescription',
        category: 'mockCategory'
    },
];
const mockProductsInOrder = [
    {
        product: 'mockProduct',
        amount: 5,
    },
];
const mockOrder = {
    userId: "mockUserId",
    products: mockProductsInOrder,
    isDelivered: true,
    region: enums_1.ERegion.Holon,
    totalAmount: 5,
};
jest.mock('../src/services/userService', () => ({
    CreateObjectUser: jest.fn((username, email, password) => Promise.resolve({
        id: 1,
        username,
        email,
        password: 'hashed_password_mock',
        isAdmin: false,
    })),
    login: jest.fn(() => Promise.resolve({
        user: mockUser,
        token: 'mockToken',
    })),
    AddProductToCart: jest.fn(() => Promise.resolve({
        user: mockUser,
    }))
}));
jest.mock("../src/middlewares/verifyToken", () => ({
    verifyToken: jest.fn((req, res, next) => next()),
}));
jest.mock('../src/services/ProductService', () => ({
    GetAllProducts: jest.fn(),
}));
jest.mock('../src/services/OrderService', () => ({
    addOrder: jest.fn((userId, region) => Promise.resolve(mockOrder)),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/register', userController_1.registerUserHandler);
app.post('/api/login', userController_1.loginUserHandler);
app.get('/api/products', ProductController_1.getAllProductsHandler);
app.post('/api/products/addItemToCart', verifyToken_1.verifyToken, userController_1.addProductToCartController);
app.post('/api/orders', verifyToken_1.verifyToken, OrderController_1.addPurchaseToDatabaseController);
describe('POST /api/register', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('should register a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        userService_1.CreateObjectUser.mockResolvedValue({
            save: jest.fn().mockResolvedValue(true),
            username: 'MockUser',
            email: 'mockuser@example.com',
            password: 'hashed_password_mock',
            isAdmin: false,
        });
        const response = yield (0, supertest_1.default)(app)
            .post('/api/register')
            .send({
            username: 'MockUser',
            email: 'mockuser@example.com',
            password: 'password123',
        });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: 'User created successfully',
            data: {
                username: 'MockUser',
                email: 'mockuser@example.com',
                password: 'hashed_password_mock',
                isAdmin: false,
            },
            success: true,
        });
        expect(userService_1.CreateObjectUser).toHaveBeenCalledWith('MockUser', 'mockuser@example.com', 'password123');
    }));
    it('should return an error if creation fails', () => __awaiter(void 0, void 0, void 0, function* () {
        userService_1.CreateObjectUser.mockRejectedValue(new mongoose_1.Error('User already exists'));
        const response = yield (0, supertest_1.default)(app)
            .post('/api/register')
            .send({
            username: 'ExistingUser',
            email: 'existinguser@example.com',
            password: 'password123',
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'User already exists',
            success: false,
        });
        expect(userService_1.CreateObjectUser).toHaveBeenCalledWith('ExistingUser', 'existinguser@example.com', 'password123');
    }));
});
describe('POST /api/login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('should log in the user and return user data with token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/api/login')
            .send({
            username: 'mockUser',
            password: 'password123',
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Login successful",
            data: {
                user: mockUser,
                token: 'mockToken',
            },
            success: true,
        });
        expect(userService_1.login).toHaveBeenCalledWith('mockUser', 'password123');
    }));
});
describe('GET /api/products', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('should return all products.', () => __awaiter(void 0, void 0, void 0, function* () {
        ProductService_1.GetAllProducts.mockResolvedValue(mockProducts);
        const response = yield (0, supertest_1.default)(app)
            .get('/api/products');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            massage: "Products fetched successfully",
            data: mockProducts,
            success: true,
        });
        expect(ProductService_1.GetAllProducts).toHaveBeenCalled();
    }));
    test('should return 400 if products retrieval fails', () => __awaiter(void 0, void 0, void 0, function* () {
        ProductService_1.GetAllProducts.mockRejectedValue(new mongoose_1.Error('Failed to fetch products'));
        const response = yield (0, supertest_1.default)(app).get('/api/products');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Failed to fetch products',
            success: false,
        });
        expect(ProductService_1.GetAllProducts).toHaveBeenCalledTimes(1);
    }));
});
describe('POST /api/products/addItemToCart', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('should successfully add a product to cart', () => __awaiter(void 0, void 0, void 0, function* () {
        verifyToken_1.verifyToken.mockImplementation((req, res, next) => {
            if (typeof next === "function") {
                next();
            }
        });
        const mockResponseData = {
            cart: [{ product: 'mockProductId', amount: 5 }],
        };
        userService_1.AddProductToCart.mockResolvedValue(mockResponseData);
        const response = yield (0, supertest_1.default)(app).post('/api/products/addItemToCart')
            .send({
            userId: 'mockUserId',
            productId: 'mockProductId',
            amount: 5,
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Product added to cart successfully",
            data: mockResponseData,
            success: true,
        });
        expect(userService_1.AddProductToCart).toHaveBeenCalledWith("mockUserId", "mockProductId", 5);
    }));
});
describe('POST /api/orders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('should successfully add a order to data base', () => __awaiter(void 0, void 0, void 0, function* () {
        verifyToken_1.verifyToken.mockImplementation((req, res, next) => {
            if (typeof next === "function") {
                next();
            }
        });
        const response = yield (0, supertest_1.default)(app).post('/api/orders').send({
            userId: 'mockUserId',
            region: 'mockRegion',
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Order added successfully",
            data: mockOrder,
            success: true,
        });
    }));
});
