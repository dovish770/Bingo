import { useEffect, useState } from "react";
import { IProduct } from "../../types";
import { fetchDataAllProducts } from "../../store/features/products/productSlice";
import { useAppDispatch } from "../../store/hook.ts";
import Product from "../../components/Product/Product.tsx";
import IMG from "../../../WhatsApp Image 2024-11-22 at 12.47.59_48201cde.jpg";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import "./AllProducts.css";
import { createNewOrder } from "../../store/features/orderSlice/orderSlice.ts";
import { useNavigate } from "react-router-dom";



const AllProducts = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const [cart, setCart] = useState(user?.cart || []);
  const dispatch = useAppDispatch();
  const products = useSelector((state: RootState) => state.product.data);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [isCheckout, setIsCheckout] = useState(false);

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value)
    if(event.target.value == "" ){
      alert("you have to chose region")
    }
    const region = event.target.value;
    setSelectedRegion(region);
  };
  
  const logout = ()=>{
navigate("/")  }


  const addToCart = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const existingIndex = updatedCart.findIndex((item) => item.product === productId);

      if (existingIndex !== -1) {
        updatedCart[existingIndex].amount += quantity;
      } else {

        updatedCart.push({ product: productId, amount: quantity });
      }
      return updatedCart;
    });
  };

  
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


  useEffect(() => {
    setCart(user?.cart || []);
  }, [user]);

  const toggleCartVisibility = () => {
    setIsCartVisible((prev) => !prev);
  };

  const totalPrice = cart.reduce((sum, productInCart) => {
    const product = products?.find((p) => p._id === productInCart.product);
    const price = product ? product.price : 0;
    return sum + price * productInCart.amount;
  }, 0);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("user", user);
        await dispatch(fetchDataAllProducts());
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);
  useEffect(() => {
    setCart(user?.cart || []);
  }, [user]);




  

  const handleCheckout = async () => {

    if (cart.length === 0) {
      alert(
        "Your cart is empty. Please add products to your cart before checking out."
      );
      if (!selectedRegion){
        alert("Please select a region before checking out.");
        return;
      }
      return;
    } else {
      await dispatch(
        createNewOrder({ userId: user?._id!, region: selectedRegion })
      );
      setIsCheckout(true);
    }
  };

  const getProductsName = (id: string): string => {
    const product = products?.find((f) => f._id === id);
    return product ? product.name : "Unknown Product";
  };

  return (
    <div className="AllProducts">
      <button onClick={logout}>logout</button>
      <img src={IMG} alt="" />
      <h4>{`Welcome ${user?.username}!`}</h4>

      <button onClick={toggleCartVisibility}>
        {isCartVisible ? "Close Cart" : "View Cart"}
      </button>

      {isCartVisible && (
        <div className="cartSection">
          <h5>Your Cart:</h5>
          {cart.length > 0 ? (
            <table className="cartTable">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((productInCart, index) => {
                  const productName = getProductsName(productInCart.product);
                  const product = products?.find(
                    (p) => p._id === productInCart.product
                  );
                  const price = product ? product.price : 0;
                  const total = price * productInCart.amount;

                  return (
                    <tr key={index}>
                      <td>{productName}</td>
                      <td>{productInCart.amount}</td>
                      <td>{price}$</td>
                      <td>{total}$</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>Your cart is empty.</p>
          )}
          <div className="cartTotal">
            <p>
              <strong>Total Price:</strong> {totalPrice}$
            </p>
          </div>
         {!isCheckout && <div>
          <div>
            <select value={selectedRegion} onChange={handleRegionChange}>
              {/* <option value="">Select Region</option> */}
              <option value="TelAviv">Tel Aviv</option>
              <option value="RamatGan">Ramat Gan</option>
              <option value="PetahTikva">Petah Tikva</option>
              <option value="Holon">Holon</option>
              <option value="BneiBrak">Bnei Brak</option>
            </select>
          </div>
          <div className="checkoutBar">
            <button onClick={handleCheckout}>Checkout</button>
          </div>

          </div>}
        </div>
      )}

      {!isCheckout &&<div className="productsSection">
        {products ? (
          products.map((product: IProduct) => (
            <Product
              key={product._id}
              product={product}
              addToCart ={addToCart}
            />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>}
    </div>
  );
};

export default AllProducts;
