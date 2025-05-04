import request from 'supertest';
import express from 'express';
import {AddProductToCart, CreateObjectUser, login} from '../src/services/userService';
import {addProductToCartController, loginUserHandler, registerUserHandler} from '../src/controllers/userController';
import {IOrder, IProduct, IProductInOrder, IUser} from "../src/types";
import {getAllProductsHandler} from "../src/controllers/ProductController";
import {GetAllProducts} from "../src/services/ProductService";
import {verifyToken} from "../src/middlewares/verifyToken";
import {addPurchaseToDatabaseController} from "../src/controllers/OrderController";
import {ERegion} from "../src/types/enums";
import {Error} from 'mongoose';


const mockProductInOrder: IProductInOrder = {
    _id: 'mockProductId',
    product: 'mockProduct',
    amount: 5
} as IProductInOrder;

const mockUser: IUser = {
    _id: 'mockUserId',
    username: 'mockUser',
    email: 'mockuser@example.com',
    password: 'hashed_password_mock',
    isAdmin: false,
    cart: [mockProductInOrder],
} as IUser;

const mockProducts: IProduct[] = [
    {
        name: 'mockProductName',
        price: 5,
        inventory: 77,
        imageURL: 'mockURL',
        description: 'mockDescription',
        category: 'mockCategory'
    } as IProduct,
    {
        name: 'mockProductName',
        price: 54,
        inventory: 7,
        imageURL: 'mockURL',
        description: 'mockDescription',
        category: 'mockCategory'
    } as IProduct,
];
const mockProductsInOrder: IProductInOrder[] = [
    {
        product: 'mockProduct',
        amount: 5,
    } as IProductInOrder,
]

const mockOrder: IOrder = {
    userId: "mockUserId",
    products: mockProductsInOrder,
    isDelivered: true,
    region: ERegion.Holon,
    totalAmount: 5,
} as IOrder;


jest.mock('../src/services/userService', () => ({
    CreateObjectUser: jest.fn((username: string, email: string, password: string) =>
        Promise.resolve({
            id: 1,
            username,
            email,
            password: 'hashed_password_mock',
            isAdmin: false,
        })
    ),
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
}))


jest.mock('../src/services/OrderService', () => ({
    addOrder: jest.fn((userId: string, region: ERegion) => Promise.resolve(mockOrder)),
}))


const app = express();
app.use(express.json());
app.post('/api/register', registerUserHandler);
app.post('/api/login', loginUserHandler);
app.get('/api/products', getAllProductsHandler);
app.post('/api/products/addItemToCart', verifyToken, addProductToCartController);
app.post('/api/orders', verifyToken, addPurchaseToDatabaseController);


describe('POST /api/register', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should register a user successfully', async () => {
        (CreateObjectUser as jest.Mock).mockResolvedValue({
            save: jest.fn().mockResolvedValue(true),
            username: 'MockUser',
            email: 'mockuser@example.com',
            password: 'hashed_password_mock',
            isAdmin: false,
        });

        const response = await request(app)
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

        expect(CreateObjectUser).toHaveBeenCalledWith(
            'MockUser',
            'mockuser@example.com',
            'password123'
        );
    });

    it('should return an error if creation fails', async () => {
        (CreateObjectUser as jest.Mock).mockRejectedValue(
            new Error('User already exists')
        );

        const response = await request(app)
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

        expect(CreateObjectUser).toHaveBeenCalledWith(
            'ExistingUser',
            'existinguser@example.com',
            'password123'
        );
    });
});

describe('POST /api/login', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should log in the user and return user data with token', async () => {
        const response = await request(app)
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

        expect(login).toHaveBeenCalledWith('mockUser', 'password123');
    });
});

describe('GET /api/products', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('should return all products.', async () => {
        (GetAllProducts as jest.Mock).mockResolvedValue(mockProducts);

        const response = await request(app)
            .get('/api/products');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            massage: "Products fetched successfully",
            data: mockProducts,
            success: true,
        })
        expect(GetAllProducts).toHaveBeenCalled();

    })

    test('should return 400 if products retrieval fails', async () => {
        (GetAllProducts as jest.Mock).mockRejectedValue(new Error('Failed to fetch products'));

        const response = await request(app).get('/api/products');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'Failed to fetch products',
            success: false,
        });
        expect(GetAllProducts).toHaveBeenCalledTimes(1);
    });
})

describe('POST /api/products/addItemToCart', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('should successfully add a product to cart', async () => {
        (verifyToken as jest.Mock).mockImplementation((req, res, next) => {
            if (typeof next === "function") {
                next();
            }
        });
        const mockResponseData = {
            cart: [{product: 'mockProductId', amount: 5}],
        };
        (AddProductToCart as jest.Mock).mockResolvedValue(mockResponseData);


        const response = await request(app).post('/api/products/addItemToCart')
            .send({
                userId: 'mockUserId',
                productId: 'mockProductId',
                amount: 5,
            })

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Product added to cart successfully",
            data: mockResponseData,
            success: true,
        });

        expect(AddProductToCart).toHaveBeenCalledWith("mockUserId", "mockProductId", 5);

    })
})

describe('POST /api/orders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('should successfully add a order to data base', async () => {
        (verifyToken as jest.Mock).mockImplementation((req, res, next) => {
            if (typeof next === "function") {
                next();
            }
        });

        const response = await request(app).post('/api/orders').send({
            userId: 'mockUserId',
            region: 'mockRegion',
        })


        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Order added successfully",
            data: mockOrder,
            success: true,
        })
    })
})
