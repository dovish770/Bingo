import React, { useState } from "react";
import { IProduct } from "../../types";
import { useAppDispatch } from "../../store/hook";
import { fetchUpdateInventory } from "../../store/features/products/productSlice";
import { FaDollarSign } from "react-icons/fa6";

interface ProductProps {
  product: IProduct;
}

const ProductItem: React.FC<ProductProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const [amount, setAmount] = useState<number>(1);

  const hendelIncremnt = () => {
    setAmount(amount + 1);
  };
  const hendelDicrimnt = () => {
    if (amount > 0) {
      setAmount(amount - 1);
    }
    return;
  };
  const hendelSend = async () => {
    await dispatch(
      fetchUpdateInventory({
        productId: product._id.toString(),
        amount: amount,
      })
    );
    setAmount(1);
  };
  return (
    <div className="Product">
      <p>{product.name}</p>
      <img src={product.imageURL} />
      <p>
        {product.price}
        {<FaDollarSign />}
      </p>
      <p>{product.inventory}</p>
      <section className="adding">
        <button onClick={hendelIncremnt}>+</button>
        <input
          type="string"
          value={amount}
          name={product.name}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button onClick={hendelDicrimnt}>-</button>
      </section>
      <button onClick={hendelSend}>send</button>
    </div>
  );
};

export default ProductItem;
