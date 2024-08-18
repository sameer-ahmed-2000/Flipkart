import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/authContext";
export function useSignup() {
    const router = useRouter();
    const { login } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailError, setEmailerror] = useState("");
    const [passwordError, setPassworderror] = useState("");
    const [nameError, setNameerror] = useState("");

    const handleSignup = async () => {
        if (!name || !email || !password) {
            setError("Please fill in all fields");
            if (!name) {
                setNameerror("Please enter your name");
            }
            if (!email) {
                setEmailerror("Please enter your email");
            }
            if (!password) {
                setPassworderror("Please enter your password");
            }
            return null;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axios.post(
                "https://flipkart-d29x1.vercel.app/api/v1/user/signup",
                {
                    name,
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
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        loading,
        error,
        emailError,
        passwordError,
        nameError,
        handleSignup,
    };
}
