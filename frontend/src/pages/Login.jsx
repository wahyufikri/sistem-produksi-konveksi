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
            const response = await login(email, password);

            if (response.user.role === "admin") {
                navigate("/dashboard");
            } else if (response.user.role === "production") {
                navigate("/production");
            } else {
                navigate("/login");
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Email atau password salah.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* CARD */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* HEADER */}
                    <div className="bg-blue-600 px-8 py-8 text-center">

                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-9 h-9 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-white">
                            Sistem Produksi
                        </h1>

                        <p className="text-blue-100 text-sm mt-2">
                            Manajemen Produksi Konveksi
                        </p>

                    </div>

                    {/* FORM */}
                    <div className="px-8 py-8">

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Selamat Datang
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Silakan masuk ke akun Anda untuk melanjutkan.
                            </p>
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                                    />
                                </svg>

                                <p className="text-sm text-red-700">
                                    {error}
                                </p>

                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* EMAIL */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>

                                <div className="relative">

                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Masukkan email"
                                        required
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                            </div>

                            {/* PASSWORD */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-11V7a4 4 0 00-8 0v1h8z"
                                            />
                                        </svg>
                                    </div>

                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Masukkan password"
                                        required
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">

                                        <svg
                                            className="animate-spin w-5 h-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />

                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />
                                        </svg>

                                        Memproses...

                                    </span>
                                ) : (
                                    "Masuk"
                                )}
                            </button>

                        </form>

                    </div>

                </div>

                {/* FOOTER */}
                <p className="text-center text-xs text-gray-500 mt-6">
                    © 2026 Sistem Produksi Konveksi
                </p>

            </div>

        </div>
    );
}