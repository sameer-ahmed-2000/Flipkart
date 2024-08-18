"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
    addProductToCart,
    fetchCartDetails,
    selectCartItems,
} from "@/app/store/slices/cartSlice";
import { AppDispatch, RootState } from "../store/store";
import SkeletonLoader from "@/app/components/loadingProduct";
import Image from "next/image";

interface Product {
    id: string;
    title: string;
    subTitle: string;
    images: string[];
    price: number;
    mrp: number;
    discountPercentage: string;
    averageRating: number;
    ratingCount: number;
    reviewCount: number;
    brand: string;
    highlights: string[];
}

interface ProductDetailsProps {
    product: Product | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
    product,
    status,
    error,
}) => {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [startIndex, setStartIndex] = useState(0);
    const [showAddedAnimation, setShowAddedAnimation] = useState(false);
    const visibleImagesCount = 5;
    const cartItems =
        useSelector((state: RootState) => selectCartItems(state)) || [];
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        if (product) {
            const productInCart = cartItems.find(
                (item) => item.productId === product.id,
            );
            setIsInCart(!!productInCart);
        }
    }, [cartItems, product?.id]);

    useEffect(() => {
        if (product?.images.length) {
            setSelectedImage(product.images[0]);
        }
    }, [product]);

    const handleNext = () => {
        if (product && startIndex + visibleImagesCount < product.images.length) {
            setStartIndex(startIndex + visibleImagesCount);
        }
    };

    const handlePrevious = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - visibleImagesCount);
        }
    };

    const handleAddToCart = async () => {
        if (product) {
            await dispatch(addProductToCart(product.id));
            dispatch(fetchCartDetails());
            setShowAddedAnimation(true);
            setTimeout(() => setShowAddedAnimation(false), 3000);
        }
    };

    const handleBuyNow = async () => {
        if (product) {
            await dispatch(addProductToCart(product.id));
            dispatch(fetchCartDetails());
            router.push("/cart");
        }
    };

    const handleViewCart = () => {
        router.push("/cart");
    };

    if (status === "loading") {
        return <SkeletonLoader />;
    }

    if (status === "failed") {
        return <p>Error loading product: {error}</p>;
    }

    if (!product) {
        return <p>Product not found</p>;
    }

    return (
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="px-3 col-span-1 lg:col-span-2">
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1 flex flex-col items-center">
                        <button
                            onClick={handlePrevious}
                            disabled={startIndex === 0}
                            className={`${startIndex === 0 ? "hidden" : ""}`}
                        >
                            <svg
                                width="24px"
                                height="24px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 15L10 9.84985C10.2563 9.57616 10.566 9.35814 10.9101 9.20898C11.2541 9.05983 11.625 8.98291 12 8.98291C12.375 8.98291 12.7459 9.05983 13.0899 9.20898C13.434 9.35814 13.7437 9.57616 14 9.84985L19 15"
                                    stroke="#000000"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                        </button>
                        <div className="flex flex-col items-center justify-between space-y-2">
                            {product?.images
                                .slice(startIndex, startIndex + visibleImagesCount)
                                .map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={product.title}
                                        loading="lazy"
                                        className={`px-1 py-1 h-20 w-20 cursor-pointer rounded-md object-cover transition-transform duration-300 ${selectedImage === image ? "border-2 border-blue-500" : ""}`}
                                        onClick={() => setSelectedImage(image)}
                                    />
                                ))}
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={
                                startIndex + visibleImagesCount >= product.images.length
                            }
                            className={` ${startIndex + visibleImagesCount >= product.images.length ? "hidden" : ""}`}
                        >
                            <svg
                                width="24px"
                                height="24px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                transform="rotate(180)"
                            >
                                <path
                                    d="M5 15L10 9.84985C10.2563 9.57616 10.566 9.35814 10.9101 9.20898C11.2541 9.05983 11.625 8.98291 12 8.98291C12.375 8.98291 12.7459 9.05983 13.0899 9.20898C13.434 9.35814 13.7437 9.57616 14 9.84985L19 15"
                                    stroke="#000000"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    {selectedImage && (
                        <div className="col-span-3">
                            <img
                                src={selectedImage}
                                alt={product.title}
                                loading="lazy"
                                className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-contain rounded-md"
                            />
                        </div>
                    )}
                </div>

                <div className="pl-0 pt-8 md:pt-12 md:pl-12 flex flex-col md:flex-row justify-end gap-4">
                    {isInCart ? (
                        <button
                            className={`h-14 w-full md:w-56 bg-[#ff9c04] text-white font-bold rounded-md ${showAddedAnimation ? "animate-pulse" : ""}`}
                            onClick={handleViewCart}
                        >
                            View Cart
                        </button>
                    ) : (
                        <button
                            className={`h-14 w-full md:w-56 bg-[#ff9c04] text-white font-bold rounded-md ${showAddedAnimation ? "animate-pulse" : ""}`}
                            onClick={handleAddToCart}
                        >
                            {showAddedAnimation ? "Added!" : "Add to Cart"}
                        </button>
                    )}
                    <button
                        className="h-14 w-full md:w-56 bg-[#ff641c] text-white font-bold rounded-md"
                        onClick={handleBuyNow}
                    >
                        Buy Now
                    </button>
                </div>
            </div>
            <div className="col-span-1 lg:col-span-3">
                <div className="text-2xl md:text-3xl py-3">
                    {product.title} | {product.subTitle}
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center">
                    <div className="flex items-center text-sm bg-[#408c3c] text-white font-bold w-12 h-5 pl-1 rounded-sm">
                        {product.averageRating}
                        <div className="pt-0.5 px-1">
                            <svg
                                fill="#ffffff"
                                width="15px"
                                height="15px"
                                viewBox="0 0 32 32"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                stroke="#ffffff"
                            >
                                <path d="M3.488 13.184l6.272 6.112-1.472 8.608 7.712-4.064 7.712 4.064-1.472-8.608 6.272-6.112-8.64-1.248-3.872-7.808-3.872 7.808z"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="px-2 text-md text-slate-500 font-bold">
                        {product.ratingCount} Ratings
                    </div>
                    <div className="text-md text-slate-500 font-bold">
                        {product.reviewCount} Reviews
                    </div>
                </div>
                <div className="text-[#408c3c] text-md">Special price</div>
                <div className="flex justify-start">
                    <div className="text-3xl font-semibold pr-2">₹ {product.price}</div>
                    {product.price !== product.mrp && (
                        <>
                            <div className="pt-2 text-lg text-slate-500 line-through">
                                ₹ {product.mrp}
                            </div>
                            <div className="pt-2 text-lg font-semibold text-[#408c3c] pl-2">
                                {product.discountPercentage}
                            </div>
                        </>
                    )}
                </div>
                <div className="pt-3">
                    <div className="text-xl md:text-2xl">Product Highlights:</div>
                    <ul className="list-disc pl-6">
                        {product.highlights.map((highlight, index) => (
                            <li key={index} className="py-1">
                                {highlight}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="pt-3">
                    <div className="text-md md:text-2xl text-[#595959]">
                        Brand: {product.brand}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
