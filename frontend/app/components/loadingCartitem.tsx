import React from "react";

const CartItemSkeleton: React.FC = () => {
    return (
        <div className="mb-4 border-b pb-4">
            <div className="py-6 h-14 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="px-36 py-8 grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <div className="py-6 h-80 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="col-span-1 pl-4">
                    <div className="h-56 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default CartItemSkeleton;
