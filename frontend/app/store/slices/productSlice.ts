import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

interface Product {
    id: string;
    category: string;
    brand: string;
    title: string;
    subTitle: string;
    highlights: string[];
    mrp: number;
    price: number;
    averageRating: number;
    ratingCount: number;
    reviewCount: number;
    images: string[];
    discountPercentage: string;
}

interface ProductsState {
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    totalPages: 0,
    currentPage: 1,
    totalItems: 0,
    status: "idle",
    error: null,
};

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (page: number) => {
        const response = await axios.get(
            `http://localhost:3000/api/v1/product/items?page=${page}`,
        );
        return response.data;
    },
);

export const fetchProductById = createAsyncThunk(
    "products/fetchProductById",
    async (productId: string) => {
        const response = await axios.get(
            `http://localhost:3000/api/v1/product/item/${productId}`,
        );
        return response.data;
    },
);

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "succeeded";
                state.products = action.payload.products;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalItems = action.payload.totalItems;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Something went wrong";
            })
            .addCase(
                fetchProductById.fulfilled,
                (state, action: PayloadAction<Product>) => {
                    const product = action.payload;
                    const existingProduct = state.products.find(
                        (p) => p.id === product.id,
                    );
                    if (existingProduct) {
                        Object.assign(existingProduct, product);
                    } else {
                        state.products.push(product);
                    }
                },
            );
    },
});

export default productsSlice.reducer;

export const selectAllProducts = (state: RootState) => state.products.products;
export const selectProductStatus = (state: RootState) => state.products.status;
export const selectProductError = (state: RootState) => state.products.error;
export const selectTotalPages = (state: RootState) => state.products.totalPages;
export const selectCurrentPage = (state: RootState) =>
    state.products.currentPage;
export const selectProductById = (state: RootState, productId: string) =>
    state.products.products.find((product) => product.id === productId);
