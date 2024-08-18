import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
type Status = "idle" | "loading" | "succeeded" | "failed";
type CheckoutStatus = "idle" | "loading" | "succeeded" | "failed";
interface CartItem {
    productId: string;
    productName: string;
    productImage: string;
    productPrice: number;
    mrp: number;
    quantity: number;
    itemTotal: number;
    discountPercentage: string;
    status: Status;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    total: number;
    status: Status;
    error: string | null;
    checkoutStatus: CheckoutStatus;
}

const initialState: CartState = {
    items: [],
    totalItems: 0,
    subtotal: 0,
    total: 0,
    status: "idle",
    error: null,
    checkoutStatus: "idle",
};

const token = localStorage.getItem("token");
export const fetchCartDetails = createAsyncThunk(
    "cart/fetchCartDetails",
    async () => {
        if (!token) {
            throw new Error("No token found");
        }
        const response = await axios.get(
            "http://localhost:3000/api/v1/product/cart/details",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data;
    },
);

export const checkoutCart = createAsyncThunk(
    "cart/checkoutCart",
    async (_, { getState }) => {
        const state = getState() as RootState;

        if (!token) {
            throw new Error("No token found");
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/product/cart/checkout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || "Checkout failed");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    },
);

export const addProductToCart = createAsyncThunk(
    "cart/addProductToCart",
    async (productId: string) => {
        if (!token) {
            throw new Error("No token found");
        }
        const response = await axios.post(
            `http://localhost:3000/api/v1/product/cart/add/${productId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data;
    },
);

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem",
    async ({ productId, quantity }: { productId: string; quantity: number }) => {
        if (!token) {
            throw new Error("No token found");
        }
        const response = await axios.put(
            `http://localhost:3000/api/v1/product/cart/update/${productId}`,
            { quantity },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return { productId, quantity };
    },
);

export const removeProductFromCart = createAsyncThunk(
    "cart/removeProductFromCart",
    async (productId: string) => {
        if (!token) {
            throw new Error("No token found");
        }
        await axios.delete(
            `http://localhost:3000/api/v1/product/cart/remove/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return productId;
    },
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartDetails.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                fetchCartDetails.fulfilled,
                (state, action: PayloadAction<CartState>) => {
                    state.status = "succeeded";
                    state.items = action.payload.items;
                    state.totalItems = action.payload.totalItems;
                    state.subtotal = action.payload.subtotal;
                    state.total = action.payload.total;
                },
            )
            .addCase(fetchCartDetails.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message
                    ? String(action.error.message)
                    : "Failed to fetch cart details";
            })
            .addCase(addProductToCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addProductToCart.fulfilled, (state) => {
                state.status = "succeeded";
            })
            .addCase(addProductToCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message
                    ? String(action.error.message)
                    : "Failed to add product to cart";
            })
            .addCase(updateCartItem.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                updateCartItem.fulfilled,
                (
                    state,
                    action: PayloadAction<{ productId: string; quantity: number }>,
                ) => {
                    state.status = "succeeded";
                    const { productId, quantity } = action.payload;
                    const updatedItems = state.items.map((item) =>
                        item.productId === productId
                            ? { ...item, quantity, itemTotal: item.productPrice * quantity }
                            : item,
                    );

                    state.items = updatedItems;

                    state.subtotal = state.items.reduce(
                        (acc, item) => acc + item.itemTotal,
                        0,
                    );
                    state.total = state.subtotal;
                },
            )
            .addCase(updateCartItem.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message
                    ? String(action.error.message)
                    : "Failed to update cart item";
            })
            .addCase(removeProductFromCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(
                removeProductFromCart.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.status = "succeeded";
                    state.items = state.items.filter(
                        (item) => item.productId !== action.payload,
                    );
                },
            )
            .addCase(removeProductFromCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message
                    ? String(action.error.message)
                    : "Failed to remove product from cart";
            })
            .addCase(checkoutCart.pending, (state) => {
                state.checkoutStatus = "loading";
            })
            .addCase(checkoutCart.fulfilled, (state) => {
                state.checkoutStatus = "succeeded";
                state.items = [];
                state.totalItems = 0;
                state.subtotal = 0;
                state.total = 0;
            })
            .addCase(checkoutCart.rejected, (state, action) => {
                state.checkoutStatus = "failed";
                state.error = action.error.message
                    ? String(action.error.message)
                    : "Checkout failed";
            });
    },
});

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalItems = (state: RootState) => state.cart.totalItems;
export const selectCartSubtotal = (state: RootState) => state.cart.subtotal;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCheckoutStatus = (state: RootState) =>
    state.cart.checkoutStatus;
