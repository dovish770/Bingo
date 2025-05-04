import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SlActionUndo } from "react-icons/sl";
import { LuLogOut } from "react-icons/lu";
import { useAppDispatch } from "../../../store/hook";
import { fetchDataAllProducts } from "../../../store/features/products/productSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import ProductItem from "../../../components/AdminComponents/InventoryProducts";
import "./Products.css";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useSelector((state: RootState) => state.product.data);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await dispatch(fetchDataAllProducts());
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <div className="products-container">
      <button
        className="back-button"
        onClick={() => {
          navigate("/admin");
        }}
      >
        <SlActionUndo />
        Go Back
      </button>
      <Link to="/">
        <button className="logout-button">
          <LuLogOut />
          Log Out

        </button>
      </Link>
      <div className="products-list">
        {products?.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
