import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">

            <div>
                <h2 className="font-semibold text-gray-800">
                    Sistem Produksi Konveksi
                </h2>
            </div>

            <div className="flex items-center gap-4">

                <div className="text-right">
                    <p className="text-sm font-medium">
                        {user?.name}
                    </p>

                    <p className="text-xs text-gray-500 capitalize">
                        {user?.role}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                    Logout
                </button>

            </div>

        </header>
    );
}