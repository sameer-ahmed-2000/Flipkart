import { useRouter } from "next/navigation";
import { useAuth } from "./authContext";

// Component to protect routes based on authentication status
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth(); // Retrieve authentication status from context
    const router = useRouter(); // Access the Next.js router for navigation
    // Redirect to sign-in page if the user is not authenticated
    if (!isAuthenticated) {
        router.push("/signin");
        return null;
    }
    return children;
};
