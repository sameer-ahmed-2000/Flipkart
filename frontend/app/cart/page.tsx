"use client";
import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchCartDetails,
    updateCartItem,
    removeProductFromCart,
    selectCartItems,
    selectCartTotalItems,
    selectCartSubtotal,
    selectCartTotal,
    selectCartStatus,
    selectCartError,
    checkoutCart,
    selectCheckoutStatus,
} from "../store/slices/cartSlice";
import { AppDispatch, RootState } from "../store/store";
import { ProtectedRoute } from "../auth/protectedRoute";
import CartItem from "../components/cartItem";
import EmptyCart from "../components/emptyCart";
import { useRouter } from "next/navigation";

const CartDetails: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    const cartItems = useSelector(selectCartItems) || [];
    const totalItems = useSelector(selectCartTotalItems);
    const subtotal = useSelector(selectCartSubtotal);
    const total = useSelector(selectCartTotal);
    const status = useSelector(selectCartStatus);
    const error = useSelector(selectCartError);
    const checkoutStatus = useSelector(selectCheckoutStatus);
    useEffect(() => {
        dispatch(fetchCartDetails());
    }, [dispatch]);
    const handleQuantityChange = useCallback(
        (productId: string, newQuantity: number) => {
            if (newQuantity < 1) return;
            dispatch(updateCartItem({ productId, quantity: newQuantity }));
        },
        [dispatch],
    );
    const handleRemove = useCallback(
        (productId: string) => {
            dispatch(removeProductFromCart(productId)).then(() => {
                dispatch(fetchCartDetails());
            });
        },
        [dispatch],
    );
    const handleCheckout = useCallback(() => {
        dispatch(checkoutCart()).then(() => {
            dispatch(fetchCartDetails());
            router.push("/checkout");
        });
    }, [dispatch, router]);

    if (status === "failed") {
        return "error while";
    }

    return (
        <div className="bg-slate-100 min-h-screen">
            <div className="px-4 md:px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProtectedRoute>
                    <div className="px-2 py-6 col-span-2">
                        <div className="p-6 bg-white shadow-md rounded-lg">
                            {cartItems.length === 0 ? (
                                <EmptyCart></EmptyCart>
                            ) : (
                                cartItems.map((item) => (
                                    <CartItem
                                        key={item.productId}
                                        item={item}
                                        onQuantityChange={handleQuantityChange}
                                        onRemove={handleRemove}
                                    />
                                ))
                            )}
                            {cartItems.length > 0 && (
                                <div className="flex justify-end mt-4">
                                    <button
                                        className="h-12 w-48 bg-[#ff641c] font-bold text-white rounded-lg"
                                        onClick={handleCheckout}
                                    >
                                        {checkoutStatus === "loading"
                                            ? "Processing..."
                                            : "PLACE ORDER"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {cartItems.length > 0 && (
                        <div className="py-6 col-span-1">
                            <div className="bg-white px-6 py-4 border rounded-lg shadow-md">
                                <div className="text-lg font-bold text-slate-400 mb-4">
                                    PRICE DETAILS
                                </div>
                                <div className="py-2 flex justify-between">
                                    <div className="text-lg">
                                        {`Item${totalItems > 1 ? "s" : ""} (${totalItems} item${totalItems > 1 ? "s" : ""
                                            })`}
                                    </div>
                                    <div>₹{subtotal}</div>
                                </div>
                                <div className="py-2 flex justify-between">
                                    <div className="text-lg">Delivery charges</div>
                                    <div>Free</div>
                                </div>
                                <div className="py-2 flex justify-between font-semibold">
                                    <div className="text-lg">Total</div>
                                    <div>₹{total}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </ProtectedRoute>
            </div>
        </div>
    );
};

export default CartDetails;
