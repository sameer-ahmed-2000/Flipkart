import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/authContext";

export function useSignin() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailError, setEmailerror] = useState("");
    const [passwordError, setPassworderror] = useState("");
    const handleSignin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            if (!email) {
                setEmailerror("Please enter a valid email");
            }
            if (!password) {
                setPassworderror("Please enter a valid password");
            }
            return null;
        }
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/user/signin",
                {
                    email,
                    password,
                },
            );
            login(response.data.token);
            router.push("/products");
        } catch (err) {
            setError("Sign in failed. Please check your credentials and try again.");
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        setError,
        emailError,
        setEmailerror,
        passwordError,
        setPassworderror,
        handleSignin,
    };
}
