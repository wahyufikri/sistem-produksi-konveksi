import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import productionService from "../../services/productionService";

export default function ProductionList() {
    const [orders, setOrders] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const fetchOrders = async (searchValue = "") => {
        try {
            setLoading(true);
            setError("");

            const response =
                await productionService.getProductionOrders({
                    search: searchValue,
                });

            setOrders(
                response.data ?? []
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ??
                    "Gagal mengambil data produksi."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        fetchOrders(search);
    };

    const handleReset = () => {
        setSearch("");

        fetchOrders("");
    };

    return (
        <div>

            {/* HEADER */}

            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Produksi
                </h1>

                <p className="text-gray-500 mt-1">
                    Pantau dan perbarui proses produksi.
                </p>
            </div>

            {/* SEARCH */}

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">

                <form
                    onSubmit={handleSearch}
                    className="flex gap-3"
                >
                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Cari nomor order..."
                        className="flex-1 border rounded-lg px-4 py-2"
                    />

                    <button
                        type="submit"
                        className="px-5 py-2 bg-gray-800 text-white rounded-lg"
                    >
                        Cari
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-2 border rounded-lg"
                    >
                        Reset
                    </button>
                </form>

            </div>

            {/* ERROR */}

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
                    {error}
                </div>
            )}

            {/* CONTENT */}

            {loading ? (
                <div className="bg-white rounded-xl p-6 text-center">
                    Loading data produksi...
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-center text-gray-500">
                    Tidak ada order produksi.
                </div>
            ) : (
                <div className="space-y-5">

                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden"
                        >

                            {/* ORDER HEADER */}

                            <div className="p-6 border-b">

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    <div>
                                        <div className="flex items-center gap-3">

                                            <h2 className="text-lg font-bold text-gray-800">
                                                {order.order_number}
                                            </h2>

                                            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
                                                {order.status ===
                                                "in_progress"
                                                    ? "Berjalan"
                                                    : order.status}
                                            </span>

                                        </div>

                                        <p className="text-gray-600 mt-1">
                                            {
                                                order.customer
                                                    ?.name
                                            }
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Deadline:{" "}
                                            {order.deadline}
                                        </p>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        {order.items?.length ??
                                            0}{" "}
                                        produk
                                    </div>

                                </div>

                            </div>

                            {/* ITEMS */}

                            <div className="p-6">

                                <div className="space-y-3">

                                    {order.items?.map(
                                        (item) => (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="border rounded-lg p-4"
                                            >

                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                                    <div>

                                                        <p className="font-semibold">
                                                            {
                                                                item
                                                                    .product
                                                                    ?.product_code
                                                            }{" "}
                                                            -{" "}
                                                            {
                                                                item
                                                                    .product
                                                                    ?.name
                                                            }
                                                        </p>

                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Quantity
                                                            Order:{" "}
                                                            {
                                                                item.quantity
                                                            }{" "}
                                                            pcs
                                                        </p>

                                                    </div>

                                                    <Link
                                                        to={`/production/order-items/${item.id}`}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                                                    >
                                                        Lihat
                                                        Progress
                                                    </Link>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}