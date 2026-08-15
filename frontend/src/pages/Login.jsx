import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await login(
                email,
                password
            );

            if (response.user.role === "admin") {
    navigate("/dashboard");
} else if (response.user.role === "production") {
    navigate("/production");
} else {
    navigate("/login");
}
        } catch (error) {
            if (error.response?.data?.message) {
                setError(
                    error.response.data.message
                );
            } else {
                setError(
                    "Email atau password salah."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Login</h1>

            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Loading..."
                        : "Login"}
                </button>
            </form>
        </div>
    );
}