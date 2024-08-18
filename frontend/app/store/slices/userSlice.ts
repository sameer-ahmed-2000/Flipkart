import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface HistoryItem {
    id: string;
    productId: string;
    productTitle: string;
    quantity: number;
    priceAtPurchase: number;
    historyId: string;
}

interface UserHistory {
    id: string;
    userId: string;
    cartId: string;
    totalAmount: number;
    processedAt: string;
    items: HistoryItem[];
}

interface UserState {
    history: UserHistory[];
    username: string | null;
    status: Status;
    error: string | null;
    fetchStatus: Status;
}

const initialState: UserState = {
    history: [],
    username: null,
    status: "idle",
    error: null,
    fetchStatus: "idle",
};

// Async Thunks
const token = localStorage.getItem("token");

export const fetchUserHistory = createAsyncThunk<UserHistory[]>(
    "user/fetchUserHistory",
    async () => {
        if (!token) {
            throw new Error("No token found");
        }
        const response = await axios.get(
            "https://flipkart-d29x1.vercel.app/api/v1/user/history",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data;
    },
);

export const fetchUsername = createAsyncThunk<string>(
    "user/fetchUsername",
    async () => {
        if (!token) {
            throw new Error("No token found");
        }
        const response = await axios.get(
            "https://flipkart-d29x1.vercel.app/api/v1/user/username",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data.username;
    },
);

// User Slice
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserData: (state) => {
            state.history = [];
            state.username = null;
            state.status = "idle";
            state.fetchStatus = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserHistory.pending, (state) => {
                state.fetchStatus = "loading";
                state.error = null;
            })
            .addCase(
                fetchUserHistory.fulfilled,
                (state, action: PayloadAction<UserHistory[]>) => {
                    state.fetchStatus = "succeeded";
                    state.history = action.payload;
                },
            )
            .addCase(fetchUserHistory.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.error = action.error.message
                    ? String(action.error.message)
                    : "Failed to fetch user history";
            })
            .addCase(fetchUsername.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(
                fetchUsername.fulfilled,
                (state, action: PayloadAction<string>) => {
                    state.status = "succeeded";
                    state.username = action.payload;
                },
            )
            .addCase(fetchUsername.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message
                    ? String(action.error.message)
                    : "Failed to fetch username";
            });
    },
});
export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectUserHistory = (state: RootState) => state.user.history;
export const selectUsername = (state: RootState) => state.user.username;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectFetchStatus = (state: RootState) => state.user.fetchStatus;
export const selectUserError = (state: RootState) => state.user.error;
