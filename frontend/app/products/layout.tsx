"use client";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { AppDispatch } from "../store/store";
import { fetchCartDetails } from "../store/slices/cartSlice";
import {
    selectCartTotalItems,
    selectCartStatus,
} from "../store/slices/cartSlice";
import {
    clearUserData,
    fetchUsername,
    selectUserError,
    selectUsername,
    selectUserStatus,
} from "../store/slices/userSlice";
import { Loading } from "../components/loading";
import SkeletonLoader from "../components/loadingProduct";

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
    const [forceRender, setForceRender] = useState(false);

    useEffect(() => {
        setForceRender((prev) => !prev);
    }, [username]);
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
    const pathname = usePathname();

    const isMainPage = pathname === "/products";
    if (status === "loading") {
        return isMainPage ? <Loading /> : <SkeletonLoader />;
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
    const handleLogout = () => {
        try {
            Cookies.remove("token");
            dispatch(clearUserData());
            router.push("/signin");
            console.log(username);
        } catch (error) {
            console.error("Error removing token:", error);
        }
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
                <div className="flex justify-between items-center px-12">
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
                                <span className="fixed -top-0 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>
                    </div>
                    <div px-2 pt-1>
                        <button className="static rounded-full" onClick={handleLogout}>
                            <svg
                                width="50px"
                                height="50px"
                                viewBox="0 -0.5 25 25"
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
                                    <path
                                        d="M11.75 9.874C11.75 10.2882 12.0858 10.624 12.5 10.624C12.9142 10.624 13.25 10.2882 13.25 9.874H11.75ZM13.25 4C13.25 3.58579 12.9142 3.25 12.5 3.25C12.0858 3.25 11.75 3.58579 11.75 4H13.25ZM9.81082 6.66156C10.1878 6.48991 10.3542 6.04515 10.1826 5.66818C10.0109 5.29121 9.56615 5.12478 9.18918 5.29644L9.81082 6.66156ZM5.5 12.16L4.7499 12.1561L4.75005 12.1687L5.5 12.16ZM12.5 19L12.5086 18.25C12.5029 18.25 12.4971 18.25 12.4914 18.25L12.5 19ZM19.5 12.16L20.2501 12.1687L20.25 12.1561L19.5 12.16ZM15.8108 5.29644C15.4338 5.12478 14.9891 5.29121 14.8174 5.66818C14.6458 6.04515 14.8122 6.48991 15.1892 6.66156L15.8108 5.29644ZM13.25 9.874V4H11.75V9.874H13.25ZM9.18918 5.29644C6.49843 6.52171 4.7655 9.19951 4.75001 12.1561L6.24999 12.1639C6.26242 9.79237 7.65246 7.6444 9.81082 6.66156L9.18918 5.29644ZM4.75005 12.1687C4.79935 16.4046 8.27278 19.7986 12.5086 19.75L12.4914 18.25C9.08384 18.2892 6.28961 15.5588 6.24995 12.1513L4.75005 12.1687ZM12.4914 19.75C16.7272 19.7986 20.2007 16.4046 20.2499 12.1687L18.7501 12.1513C18.7104 15.5588 15.9162 18.2892 12.5086 18.25L12.4914 19.75ZM20.25 12.1561C20.2345 9.19951 18.5016 6.52171 15.8108 5.29644L15.1892 6.66156C17.3475 7.6444 18.7376 9.79237 18.75 12.1639L20.25 12.1561Z"
                                        fill="#ffffff"
                                    ></path>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
            <div>{children}</div>
        </>
    );
}

export default Layout;
