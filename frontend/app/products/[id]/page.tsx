"use client";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProductById,
    selectProductById,
    selectProductStatus,
    selectProductError,
} from "../../store/slices/productSlice";
import { AppDispatch, RootState } from "../../store/store";
import SkeletonLoader from "@/app/components/loadingProduct";
import {
    addProductToCart,
    fetchCartDetails,
    selectCartItems,
} from "@/app/store/slices/cartSlice";
import { useState, useEffect } from "react";
import ProductDetails from "@/app/components/productDetails";
import { ProtectedRoute } from "@/app/auth/protectedRoute";

const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch: AppDispatch = useDispatch();
    const product = useSelector((state: RootState) =>
        id ? selectProductById(state, id) : null,
    );
    const status = useSelector((state: RootState) => selectProductStatus(state));
    const error = useSelector((state: RootState) => selectProductError(state));
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const router = useRouter();
    const cartItems = useSelector(selectCartItems) || [];
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (product) {
            const productInCart = cartItems.find(
                (item) => item.productId === product.id,
            );
            setIsInCart(!!productInCart);
        }
    }, [cartItems, product]);

    useEffect(() => {
        if (product?.images.length) {
            setSelectedImage(product.images[0]);
        }
    }, [product]);

    if (status === "loading") {
        return <SkeletonLoader />;
    }

    if (status === "failed") {
        return <p>Error loading product: {error}</p>;
    }

    return (
        <>
            <ProtectedRoute>
                <ProductDetails
                    product={product || null}
                    status={status}
                    error={error}
                />
            </ProtectedRoute>
        </>
    );
};

export default ProductPage;
