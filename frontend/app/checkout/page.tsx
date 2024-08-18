"use client";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "../auth/protectedRoute";

const Checkout: React.FC = () => {
    const router = useRouter();
    const handleContinue = () => {
        router.push("/products");
    };
    const handleCheck = () => {
        router.push("/purchasehistory");
    };
    return (
        <>
            <ProtectedRoute>
                <div className="flex flex-col items-center justify-center h-full p-4">
                    <svg
                        width="219px"
                        height="219px"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#ffffff"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            {" "}
                            <rect
                                width="48"
                                height="48"
                                fill="white"
                                fill-opacity="0.01"
                            ></rect>
                            <path
                                d="M24 4L29.2533 7.83204L35.7557 7.81966L37.7533 14.0077L43.0211 17.8197L41 24L43.0211 30.1803L37.7533 33.9923L35.7557 40.1803L29.2533 40.168L24 44L18.7467 40.168L12.2443 40.1803L10.2467 33.9923L4.97887 30.1803L7 24L4.97887 17.8197L10.2467 14.0077L12.2443 7.81966L18.7467 7.83204L24 4Z"
                                fill="#2F88FF"
                                stroke="#ffffff"
                                stroke-width="4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                            <path
                                d="M17 24L22 29L32 19"
                                stroke="white"
                                stroke-width="4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                        </g>
                    </svg>
                    <h2 className="text-2xl font-bold mb-2">
                        Your Order has been Placed
                    </h2>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleContinue}
                    >
                        Continue Shopping
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 my-4 rounded"
                        onClick={handleCheck}
                    >
                        Check Order History
                    </button>
                </div>
            </ProtectedRoute>
        </>
    );
};

export default Checkout;
