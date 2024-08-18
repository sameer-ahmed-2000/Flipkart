import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "../store/store";
import {
    addProductToCart,
    fetchCartDetails,
    selectCartItems,
} from "../store/slices/cartSlice";
import Image from "next/image";

interface Product {
    id: string;
    title: string;
    mrp: number;
    price: number;
    images: string[];
    discountPercentage: string;
}

interface ProductCardProp {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProp> = React.memo(
    ({ product }) => {
        ProductCard.displayName = "ProductCard";
        const dispatch = useDispatch<AppDispatch>();
        const router = useRouter();
        const cartItems = useSelector(selectCartItems) || [];
        const [isInCart, setIsInCart] = useState(false);
        const [showAddedAnimation, setShowAddedAnimation] = useState(false);

        useEffect(() => {
            const productInCart = cartItems.find(
                (item) => item.productId === product.id,
            );
            setIsInCart(!!productInCart);
        }, [cartItems, product.id]);

        const handleViewProduct = (productId: string) => {
            router.push(`/products/${productId}`);
        };

        const handleAddToCart = async () => {
            if (product) {
                await dispatch(addProductToCart(product.id));
                dispatch(fetchCartDetails());
                setShowAddedAnimation(true);
                setTimeout(() => setShowAddedAnimation(false), 3000);
            }
        };

        const handleViewCart = () => {
            router.push("/cart");
        };

        return (
            <div className="group relative transition-transform transform group-hover:scale-105 group-hover:translate3d-0-0-10 p-4">
                <div className="py-2 flex justify-center">
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        className="h-48 object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="pt-4 pb-1">
                    <div className="py-1 flex justify-start px-4 truncate text-sm sm:text-base">
                        {product.title}
                    </div>
                    <div className="py-1 flex justify-start px-4">
                        <div className="font-bold px-1 text-sm sm:text-base">
                            ₹{product.price}
                        </div>
                        {product.price !== product.mrp && (
                            <>
                                <div className="line-through px-1 text-xs sm:text-sm">
                                    ₹{product.mrp}
                                </div>
                                <div className="text-[#408c3c] font-bold px-1 text-xs sm:text-sm">
                                    {product.discountPercentage}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="py-1 flex justify-start px-4 gap-2">
                        {isInCart ? (
                            <button
                                className="bg-[#ff9c04] h-10 w-full sm:w-32 text-white font-semibold rounded-lg"
                                onClick={handleViewCart}
                            >
                                View Cart
                            </button>
                        ) : (
                            <button
                                className="bg-[#ff9c04] h-10 w-full sm:w-28 text-white font-bold rounded-lg"
                                onClick={handleAddToCart}
                            >
                                {showAddedAnimation ? "Added!" : "Add to Cart"}
                            </button>
                        )}
                        <button
                            className="bg-[#3074f4] h-10 w-full sm:w-32 text-white font-semibold rounded-lg"
                            onClick={() => handleViewProduct(product.id)}
                        >
                            View Product
                        </button>
                    </div>
                </div>
            </div>
        );
    },
);
