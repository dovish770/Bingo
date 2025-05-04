import React, { useEffect, useState } from "react";
import { IOrder, IUser } from "../../types";
import { updateOrderShippingStatus } from "../../store/features/orderSlice/orderSlice";
import { useAppDispatch } from "../../store/hook";
import { fetchGetUserById } from "../../store/features/userSlice/userSlice";
import "./OrderCard.css";

interface OrderProps {
  order: IOrder;
}

const OrderCard: React.FC<OrderProps> = ({ order }) => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    dispatch(fetchGetUserById({ userId: order.userId }))
      .unwrap()
      .then(setUser)
      .catch(() => console.error("Failed to load user"));
  }, [dispatch, order.userId]);

  const handleSend = () => {
    dispatch(updateOrderShippingStatus({ orderId: order._id }))
      .unwrap()
      .then(() => console.log("Order status updated"))
      .catch(() => console.error("Failed to update order status"));
  };

  return (
    <div className="order-card-container">
      <div className="order-card-content">
        <p className="order-name">Name: {user?.username}</p>
        <p className="order-region">Region: {order.region}</p>
        <p className="order-total-amount">Total Amount: {order.totalAmount}</p>
        <div className="order-card-actions">
          {!order.isDelivered ? (
            <button className="create-shipment-button" onClick={handleSend}>
              Create shipment
            </button>
          ) : (
            <p className="shipment-status">Shipment created</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
