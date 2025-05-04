import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import './AdminPage.css';
import IMG from "../../../../WhatsApp Image 2024-11-22 at 12.47.59_48201cde.jpg";

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page-container">
      <div className="header">
      <img  className = "gg" src={IMG} alt="" />
        <Link to="/">
          <button className="logout-button">{<LuLogOut />} Logout</button>
        </Link>
      </div>
      <div className="buttons-container">
        <button
          onClick={() => navigate("/admin/products")}
          className="admin-button"
        >
          Manage Products
        </button>
        <button
          onClick={() => navigate("/admin/orders")}
          className="admin-button"
        >
          Manage Orders
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
