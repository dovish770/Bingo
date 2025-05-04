import { FC, useState } from 'react'
import "./Product.css"
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { AnyAction } from "redux";
import { AddToCartRequest } from '../../types/serverTypes/cartTypes';
import { addToCartM } from '../../service/cartService';
import { IProduct } from '../../types';


export interface ProductProps {
    product:IProduct
    addToCart: (productId: string, quantity: number) => void;
}
const Product: FC<ProductProps> = ({ product,addToCart  }) => {
    let [amount, setAmount] = useState<number>(1);
    const userId = useSelector((state: RootState) => state.user.user?._id as string);

    const [error, setError] = useState('');

    const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

    const handelIncrement = () => {
        if (product.inventory > amount) {
            setAmount(amount + 1);
        }
    };

    const handelDecrement = () => {
        if (amount > 1) {
            setAmount(amount - 1);
        }
    };

    const handleAddToCart = async () => {
        try {
            const addToCartData: AddToCartRequest = {
                amount: amount,
                productId: product._id,
                userId,
            };

            const resultAction = await dispatch(addToCartM(addToCartData));

            if (addToCartM.fulfilled.match(resultAction)) {
                console.log('added to cart');
                
                addToCart(product._id, amount);
                setAmount(1);
                setError('');
            } else {
                setError(resultAction.payload as string || 'Failed to add to cart');
            }
        } catch (error: any) {
            setError(error.message);
        }
    };
    return (
        <div className='Product'>
            <h5>{product.name}</h5>
            <img src={product.imageURL} alt={product.name} />
            <p>Price: {product.price}₪</p>

            {product.inventory > 0 && <div>

             <section className='adding'>
                    <button onClick={handelIncrement}>+</button>
               
                <input
                    type="string"
                    value={amount}
                    name={product.name}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
                <button onClick={handelDecrement}>-</button>
            </section>

             <button
                id='add-to-cart'
                onClick={handleAddToCart}
                disabled={product.inventory <= 0 || amount > product.inventory}
            >
                Add To Cart
            </button>
            </div>}
            <p> {product.inventory <0 }</p>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Product;
