import Image from "next/image";
import React from "react";

interface CartItemProps {
    item: {
        productId: string;
        productImage: string;
        productName: string;
        productPrice: number;
        mrp: number;
        discountPercentage: string;
        itemTotal: number;
        quantity: number;
    };
    onQuantityChange: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
    item,
    onQuantityChange,
    onRemove,
}) => {
    return (
        <div key={item.productId} className="mb-4 border-b pb-4">
            <div className="grid grid-cols-4 items-center">
                <div className="col-span-1">
                    <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-24 h-24 object-hover"
                        loading="lazy"
                    />
                </div>
                <div className="col-span-3 pl-4">
                    <div className="text-xl font-semibold">{item.productName}</div>
                    <div className="flex items-center py-2 text-sm">
                        <div className="pr-2">Price:</div>
                        <div className="font-semibold pr-2 text-lg">
                            ₹{item.productPrice}
                        </div>
                        {item.productPrice !== item.mrp && (
                            <>
                                <div className="line-through text-gray-500">₹{item.mrp}</div>
                                <div className="text-green-600 font-bold pl-2">
                                    {item.discountPercentage}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="text-md font-semibold">
                        Total: ₹{item.itemTotal.toFixed(2)}
                    </div>
                </div>
            </div>
            <div className="flex items-center py-4">
                <div className="flex items-center">
                    <button
                        className="h-8 w-8 bg-slate-100 text-md rounded-full font-bold"
                        onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >
                        -
                    </button>
                    <div className="h-8 w-12 text-md font-bold border flex justify-center items-center mx-1">
                        {item.quantity}
                    </div>
                    <button
                        className="h-8 w-8 bg-slate-100 text-md rounded-full font-bold"
                        onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= 20}
                    >
                        +
                    </button>
                </div>
                <button
                    className="text-lg font-bold text-red-600 ml-8"
                    onClick={() => onRemove(item.productId)}
                >
                    REMOVE
                </button>
            </div>
        </div>
    );
};

export default CartItem;
