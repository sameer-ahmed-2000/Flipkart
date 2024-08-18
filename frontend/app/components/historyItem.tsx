import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface HistoryItemProps {
    record: {
        id: string;
        cartId: string;
        totalAmount: number;
        processedAt: string;
        items: {
            productId: string;
            productTitle?: string;
            priceAtPurchase: number;
            quantity: number;
        }[];
    };
}

const HistoryItem: React.FC<HistoryItemProps> = ({ record }) => {
    const [selectedProductId, setSelectedProductId] = useState<string | null>(
        null,
    );
    const router = useRouter();
    const handleProductClick = (productId: string) => {
        setSelectedProductId(productId);
        router.push(`/products/${productId}`);
    };
    const selectedProduct = record.items.find(
        (item) => item.productId === selectedProductId,
    );
    return (
        <div key={record.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 ">Order ID: {record.id}</h2>
            <div className=" flex justify-center py-4">
                <table className="w-1/2 bg-white ">
                    <thead>
                        <tr className="bg-[#3074f4]">
                            <th className="py-2 pr-8 border-b">Product Name</th>
                            <th className="py-2 pr-8 border-b">Price at Purchase</th>
                            <th className="py-2 pr-4 border-b">Quantity</th>
                            <th className="py-2 pr-4 border-b">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {record.items.map((item) => (
                            <tr key={item.productId}>
                                <td
                                    className="py-2 px-4 pl-8 border-b hover-pointer"
                                    onClick={() => handleProductClick(item.productId)}
                                >
                                    {item.productTitle}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    ₹{item.priceAtPurchase.toFixed()}
                                </td>
                                <td className="py-2 px-4 border-b">{item.quantity}</td>
                                <td className="py-2 px-4 border-b">
                                    ₹{item.priceAtPurchase * item.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4  flex justify-center">
                <p className="text-lg font-semibold">
                    Total Amount: ₹{record.totalAmount}
                </p>
            </div>
            <div className="mt-4  flex justify-center">
                <p className="text-lg font-semibold">
                    Ordered At: {new Date(record.processedAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default HistoryItem;
