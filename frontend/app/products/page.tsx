"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProducts,
    selectAllProducts,
    selectProductStatus,
    selectProductError,
    selectCurrentPage,
    selectTotalPages,
} from "../store/slices/productSlice";
import { AppDispatch, RootState } from "../store/store";
import { ProductCard } from "../components/productCard";
import { ProtectedRoute } from "../auth/protectedRoute";

const ProductList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const products = useSelector((state: RootState) => selectAllProducts(state));
    const status = useSelector((state: RootState) => selectProductStatus(state));
    const error = useSelector((state: RootState) => selectProductError(state));
    const currentPage = useSelector((state: RootState) =>
        selectCurrentPage(state),
    );
    const totalPages = useSelector((state: RootState) => selectTotalPages(state));

    useEffect(() => {
        dispatch(fetchProducts(currentPage));
    }, [dispatch, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            dispatch(fetchProducts(page));
        }
    };

    return (
        <>
            <ProtectedRoute>
                {status === "failed" ? (
                    <p>Error: {error}</p>
                ) : (
                    <>
                        <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="flex justify-center py-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative px-4 py-2 bg-[#3074f4] h-10 w-32 text-white font-semibold rounded mr-2 flex items-center justify-center"
                            >
                                <svg
                                    className={`absolute left-2 transition-opacity duration-300 ${currentPage === 1 ? "opacity-0" : "opacity-100"}`}
                                    width="16px"
                                    height="16px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15 19l-7-7 7-7"
                                        stroke="#ffffff"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                </svg>
                                Previous
                            </button>
                            <div className="px-2 h-10 pt-2  w-30 flex justify-center font-bold">
                                {currentPage} / {totalPages}
                            </div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative px-4 py-2 bg-[#3074f4] h-10 w-32 ml-2 text-white font-semibold rounded flex items-center justify-center"
                            >
                                <svg
                                    className={`absolute right-2 transition-opacity duration-300 ${currentPage === totalPages ? "opacity-0" : "opacity-100"}`}
                                    width="16px"
                                    height="16px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9 5l7 7-7 7"
                                        stroke="#ffffff"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    ></path>
                                </svg>
                                Next
                            </button>
                        </div>
                    </>
                )}
            </ProtectedRoute>
        </>
    );
};

export default ProductList;
