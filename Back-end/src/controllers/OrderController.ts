import { Request, Response } from "express";
import { addOrder, getAllOrders, getOrderByUserId, InventoryUpdateForManager, updateShippingStatusInOrder } from "../services/OrderService";



export const addPurchaseToDatabaseController = async (req: Request, res: Response) => {
    try {
        const { userId, region } = req.body;
        const orders = await addOrder(userId, region);
        // console.log(orders)
        res.status(200).json({
            message: "Order added successfully",
            data: orders,
            success: true,
        });
    } catch (error:any) {
        res.status(400).json({ message: error.message, success: false });
    }
}

export const getAllOrdersController = async (req: Request, res: Response) => {
    try {
        const orders = await getAllOrders();
        res.status(200).json({
            message: "Orders fetched successfully",
            data: orders,
            success: true,
        });
    } catch (error:any) {
        res.status(400).json({ message: error.message, success: false });
    }
}

export const getOrderByIdController = async (req: Request, res: Response) => {
    try {
        const { userName } = req.params;
        const order = await getOrderByUserId(userName);
        res.status(200).json({
            message: "Order fetched successfully",
            data: order,
            success: true,
        });
    } catch (error:any) {
        res.status(400).json({ message: error.message, success: false });
    }
}

export const updateShippingStatusInOrderController = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;
        const order = await updateShippingStatusInOrder(orderId);
        res.status(200).json({
            message: "Order updated successfully",
            data: order,
            success: true,
        });
    } catch (error:any) {
        res.status(400).json({ message: error.message, success: false });
    }
}

export const InventoryUpdateForManagerController = async (req: Request, res: Response) => {
    try {
        const { productId, amount } = req.body;
        const orders = await InventoryUpdateForManager(productId, amount);
        res.status(200).json({
            message: "Order updated successfully",
            data: orders,
            success: true,
        });
    } catch (error:any) {
        res.status(400).json({ message: error.message, success: false });
    }
}
