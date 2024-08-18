"use client";

import React from "react";
import { InputBox } from "../components/inputBox";
import { PasswordBox } from "../components/passwordBox";
import { FunctionButton } from "../components/functionButton";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
    const {
        setName,
        setEmail,
        setPassword,
        loading,
        error,
        nameError,
        emailError,
        passwordError,
        handleSignup,
    } = useSignup();
    return (
        <div
            className="h-screen flex justify-center items-center"
            style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #3074f4 100%)",
            }}
        >
            <div className="bg-white w-[528px] p-12 rounded-lg mb-[120px] pt-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Welcome to FlipKart
                    </h1>
                </div>

                <div className="space-y-6">
                    <InputBox
                        placeholder="Enter your Name"
                        onChange={(e) => setName(e.target.value)}
                    ></InputBox>
                    {emailError && <div className="text-red-500 ">{nameError}</div>}
                    <InputBox
                        placeholder="Enter your Email"
                        onChange={(e) => setEmail(e.target.value)}
                    ></InputBox>
                    {emailError && <div className="text-red-500 ">{emailError}</div>}
                    <PasswordBox
                        placeholder="Please enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    ></PasswordBox>
                    {passwordError && (
                        <div className="text-red-500 ">{passwordError}</div>
                    )}
                </div>
                <FunctionButton
                    onClick={handleSignup}
                    label={loading ? "Signing in..." : "Sign in"}
                    disabled={loading}
                />
                {error && <div className="text-red-500 mt-2">{error}</div>}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/signin" className="text-blue-600 hover:underline">
                            Sign in.
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
