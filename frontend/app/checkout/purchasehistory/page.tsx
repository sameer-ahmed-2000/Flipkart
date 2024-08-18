"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProtectedRoute } from "../../auth/protectedRoute";
import HistoryItem from "../../components/historyItem";
import { fetchUserHistory, fetchUsername } from "../../store/slices/userSlice";
import { AppDispatch, RootState } from "../../store/store";

const UserHistoryPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useSelector((state: RootState) => state.user.history);
    const username = useSelector((state: RootState) => state.user.username);
    const status = useSelector((state: RootState) => state.user.fetchStatus);
    const error = useSelector((state: RootState) => state.user.error);
    const router = useRouter();
    const handleClick = () => {
        router.push("/products");
    };
    useEffect(() => {
        dispatch(fetchUserHistory());
        dispatch(fetchUsername());
    }, [dispatch]);

    let content;

    if (status === "loading") {
        content = <p>Loading...</p>;
    } else if (status === "failed") {
        content = <p>Error: {error}</p>;
    } else if (status === "succeeded") {
        content = (
            <>
                <ProtectedRoute>
                    <div className="py-4 flex justify-between px-8">
                        <h1 className="text-3xl font-bold mb-8">
                            {username}&apos;s Purchase History
                        </h1>
                        <button
                            className="bg-blue-500 text-white h-12 px-2 rounded-lg"
                            onClick={handleClick}
                        >
                            Home
                        </button>
                    </div>
                    {history.map((record) => (
                        <HistoryItem key={record.id} record={record} />
                    ))}
                </ProtectedRoute>
            </>
        );
    }

    return <div className="container mx-auto">{content}</div>;
};

export default UserHistoryPage;
