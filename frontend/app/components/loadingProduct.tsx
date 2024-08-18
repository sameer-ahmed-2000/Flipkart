"use client";
import React from "react";

const SkeletonLoader: React.FC = () => {
    return (
        <>
            <div className="py-6 h-14 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="py-8 grid grid-cols-5 gap-10">
                <div className="px-3 col-span-2">
                    <div className="grid grid-cols-4">
                        <div className="col-span-1 flex flex-col items-center">
                            <div className="h-20 w-20 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                            <div className="h-20 w-20 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                            <div className="h-20 w-20 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                            <div className="h-20 w-20 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                            <div className="h-20 w-20 bg-gray-200 rounded-md animate-pulse mb-2"></div>
                        </div>
                        <div className="col-span-3">
                            <div className="h-full bg-gray-200 rounded-md animate-pulse"></div>
                        </div>
                    </div>

                    <div className="pl-12 pt-12 flex justify-end gap-4">
                        <div className="h-14 w-56 bg-gray-300 rounded-md animate-pulse"></div>
                        <div className="h-14 w-56 bg-gray-300 rounded-md animate-pulse"></div>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="text-3xl bg-gray-200 h-8 w-full rounded-md animate-pulse mb-4"></div>
                    <div className="flex mb-4">
                        <div className="h-5 w-12 bg-gray-200 rounded-md animate-pulse mr-2"></div>
                        <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse mr-2"></div>
                        <div className="h-5 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    <div className="text-lg bg-gray-200 h-6 w-1/4 rounded-md animate-pulse mb-4"></div>
                    <div className="flex mb-4">
                        <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse mr-4"></div>
                        <div className="h-10 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    <div className="py-2">
                        <div className="font-bold text-md bg-gray-200 h-6 w-1/4 rounded-md animate-pulse mb-2"></div>
                        <div className="text-sm bg-gray-200 h-44 w-1/2 rounded-md animate-pulse"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SkeletonLoader;
