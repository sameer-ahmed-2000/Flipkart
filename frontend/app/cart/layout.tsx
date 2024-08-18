"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { AppDispatch } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchUsername,
    selectUserError,
    selectUsername,
    selectUserStatus,
} from "../store/slices/userSlice";
import CartItemSkeleton from "../components/loadingCartitem";

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    const router = useRouter();
    const handleClick = () => {
        router.push("/products");
    };
    const dispatch: AppDispatch = useDispatch();
    const username = useSelector(selectUsername);
    const status = useSelector(selectUserStatus);
    const error = useSelector(selectUserError);
    useEffect(() => {
        dispatch(fetchUsername());
    }, [dispatch]);
    if (status === "loading") {
        return <CartItemSkeleton />;
    }
    if (status === "failed") {
        return <p>Error: {error}</p>;
    }
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
                <div className="flex justify-between">
                    <div className="pt-2 px-4 text-3xl font-bold text-white">
                        {username}
                    </div>
                </div>
            </nav>
            <div>{children}</div>
        </>
    );
}

export default Layout;
