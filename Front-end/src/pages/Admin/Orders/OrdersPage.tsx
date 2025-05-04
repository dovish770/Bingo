import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SlActionUndo } from "react-icons/sl";
import { LuLogOut } from "react-icons/lu";
import { useAppDispatch } from "../../../store/hook";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { fetchAllOrders } from "../../../store/features/orderSlice/orderSlice";
import OrderCard from "../../../components/AdminComponents/OrderCard";
import "./OrdersPage.css";

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const orders = useSelector((state: RootState) => state.order.data);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await dispatch(fetchAllOrders());
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [dispatch]);

  return (
    <div className="orders-page-wrapper">
      <div className="orders-page-header">
        <h2>Orders Management</h2>
        <div className="orders-action-buttons">
          <button className="orders-back-button" onClick={() => navigate("/admin")}>
            <SlActionUndo />
            Go Back
          </button>
          <Link to="/">
            <button className="orders-logout-button">
              <LuLogOut />
              Log Out
            </button>
          </Link>
        </div>
      </div>

      <div className="orders-list-wrapper">
        {orders?.length ? (
          orders.map((order) => <OrderCard key={order._id} order={order} />)
        ) : (
          <p className="no-orders-text">No orders available</p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
