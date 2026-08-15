import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { user } = useAuth();

    const isAdmin = user?.role === "admin";
    const isProduction = user?.role === "production";

    const linkClass = ({ isActive }) =>
        `block px-4 py-3 rounded-lg transition ${
            isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <aside className="w-64 min-h-screen bg-white border-r">

            <div className="p-5 border-b">
                <h1 className="text-xl font-bold">
                    Sistem Produksi
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Management System
                </p>
            </div>

            <nav className="p-4 space-y-2">

                {/* ADMIN */}
                {isAdmin && (
                    <>
                        <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase">
                            Main Menu
                        </p>

                        <NavLink
                            to="/dashboard"
                            className={linkClass}
                        >
                            Dashboard
                        </NavLink>

                        <p className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase">
                            Master Data
                        </p>

                        <NavLink
                            to="/customers"
                            className={linkClass}
                        >
                            Customer
                        </NavLink>

                        <NavLink
                            to="/products"
                            className={linkClass}
                        >
                            Produk
                        </NavLink>

                        <p className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase">
                            Transaksi
                        </p>

                        <NavLink
                            to="/orders"
                            className={linkClass}
                        >
                            Order Produksi
                        </NavLink>
                    </>
                )}

                {/* PRODUCTION */}
                {isProduction && (
                    <>
                        <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase">
                            Produksi
                        </p>

                        <NavLink
                            to="/production"
                            className={linkClass}
                        >
                            Order Berjalan
                        </NavLink>
                    </>
                )}

            </nav>
        </aside>
    );
}