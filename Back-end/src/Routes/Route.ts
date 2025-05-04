import express, { Router } from "express";
import { registerUserHandler, loginUserHandler, addProductToCartController, getUserByIdController, getAllUsersController } from "../controllers/userController";
import { getAllProductsHandler } from "../controllers/ProductController";
import { verifyToken } from "../middlewares/verifyToken";
import { addPurchaseToDatabaseController, getAllOrdersController, getOrderByIdController, InventoryUpdateForManagerController, updateShippingStatusInOrderController } from "../controllers/OrderController";

const router: Router = express.Router();

router.route("/register").post(registerUserHandler);
router.route("/login").post(loginUserHandler);
router.route("/products").get(verifyToken,getAllProductsHandler);
router.route("/products/addItemToCart").post(verifyToken,addProductToCartController);
router.route("/orders").post(verifyToken, addPurchaseToDatabaseController);
router.route("/orders").get(verifyToken, getAllOrdersController);
router.route("/order/:userName").get(verifyToken,getOrderByIdController );
router.route("/orders/updateShippingStatus").post(verifyToken,updateShippingStatusInOrderController );
router.route("/orders/updateInventory").post(verifyToken,InventoryUpdateForManagerController)
router.route("/users/getById/:userId").get(verifyToken,getUserByIdController);
router.route("/users").get(verifyToken,getAllUsersController);
export default router;
