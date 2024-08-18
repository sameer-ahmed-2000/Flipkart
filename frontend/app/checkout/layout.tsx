"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "../store/store";
import { fetchCartDetails } from "../store/slices/cartSlice";
import {
    selectCartTotalItems,
    selectCartStatus,
} from "../store/slices/cartSlice";
import {
    fetchUsername,
    selectUserError,
    selectUsername,
    selectUserStatus,
} from "../store/slices/userSlice";

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const cartItemsCount = useSelector(selectCartTotalItems);
    const cartStatus = useSelector(selectCartStatus);
    const username = useSelector(selectUsername);
    const status = useSelector(selectUserStatus);
    const error = useSelector(selectUserError);
    useEffect(() => {
        dispatch(fetchCartDetails());
    }, [dispatch]);

    useEffect(() => {
        if (cartStatus === "failed") {
            console.error("Failed to fetch cart details");
        }
    }, [cartStatus]);
    useEffect(() => {
        dispatch(fetchUsername());
    }, [dispatch]);
    if (status === "loading") {
        return <p>Loading...</p>;
    }

    if (status === "failed") {
        return <p>Error: {error}</p>;
    }
    const handleCartClick = () => {
        router.push("/cart");
    };
    const handleClick = () => {
        router.push("/products");
    };
    return (
        <>
            <nav className="bg-[#3074f4] h-14 flex justify-between">
                <div className="flex">
                    <div className="pl-4 pt-2">
                        <svg
                            fill="#ffffff"
                            width="40px"
                            height="38px"
                            viewBox="0 0 24 24"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M3.833 1.333a.993.993 0 0 0-.333.061V1c0-.551.449-1 1-1h14.667c.551 0 1 .449 1 1v.333H3.833zm17.334 2.334H2.833c-.551 0-1 .449-1 1V23c0 .551.449 1 1 1h7.3l1.098-5.645h-2.24c-.051 0-5.158-.241-5.158-.241l4.639-.327-.078-.366-1.978-.285 1.882-.158-.124-.449-3.075-.467s3.341-.373 3.392-.373h3.232l.247-1.331c.289-1.616.945-2.807 1.973-3.693 1.033-.892 2.344-1.332 3.937-1.332.643 0 1.053.151 1.231.463.118.186.201.516.279.859.074.352.14.671.095.903-.057.345-.461.465-1.197.465h-.253c-1.327 0-2.134.763-2.405 2.31l-.243 1.355h1.54c.574 0 .781.402.622 1.306-.17.941-.539 1.36-1.111 1.36H14.9L13.804 24h7.362c.551 0 1-.449 1-1V4.667a1 1 0 0 0-.999-1zM20.5 2.333A.334.334 0 0 0 20.167 2H3.833a.334.334 0 0 0-.333.333V3h17v-.667z"></path>
                            </g>
                        </svg>
                    </div>
                    <button
                        className="text-4xl italic font-bold pt-2 px-2 text-white"
                        onClick={handleClick}
                    >
                        Flipkart
                    </button>
                </div>
                <div className="flex justify-between items-center">
                    <div className="pt-2 px-4 text-3xl font-bold text-white">
                        {username}
                    </div>
                    <div className="px-2 pt-1">
                        <button className="static rounded-full" onClick={handleCartClick}>
                            <svg
                                fill="#ffffff"
                                width="44px"
                                height="46px"
                                viewBox="-1 0 19 19"
                                xmlns="http://www.w3.org/2000/svg"
                                className="cf-icon-svg"
                            >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                ></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path d="M16.417 9.579A7.917 7.917 0 1 1 8.5 1.662a7.917 7.917 0 0 1 7.917 7.917zm-3.34-2.323a.63.63 0 0 0-.628-.628H5.892l-.436-1a.384.384 0 0 0-.351-.23H3.68a.384.384 0 1 0 0 .768h1.173l1.785 4.096a.37.37 0 0 0-.087-.01 1.161 1.161 0 1 0 0 2.322h.042a.792.792 0 1 0 .864 0h3.452a.792.792 0 1 0 .864 0h.565a.384.384 0 1 0 0-.767H6.55a.393.393 0 0 1 0-.787.38.38 0 0 0 .098-.013l5.803-.602a.714.714 0 0 0 .625-.694z"></path>
                                </g>
                            </svg>
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-0 -right-0 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>
            <div>{children}</div>
        </>
    );
}

export default Layout;
