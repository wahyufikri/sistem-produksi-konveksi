import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import orderService from "../../services/orderService";

export default function OrderList() {
    const [orders, setOrders] = useState([]);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const fetchOrders = async (
        searchValue = "",
        statusValue = ""
    ) => {
        try {
            setLoading(true);
            setError("");

            const response =
                await orderService.getOrders({
                    search: searchValue,
                    status: statusValue,
                });

            setOrders(
                response.data ?? []
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ??
                    "Gagal mengambil data order."
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

        fetchOrders(search, status);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Apakah Anda yakin ingin menghapus order ini?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await orderService.deleteOrder(id);

            fetchOrders(search, status);
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ??
                    "Gagal menghapus order."
            );
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "draft":
                return "bg-gray-100 text-gray-700";

            case "in_progress":
                return "bg-blue-100 text-blue-700";

            case "completed":
                return "bg-green-100 text-green-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "draft":
                return "Draft";

            case "in_progress":
                return "Berjalan";

            case "completed":
                return "Selesai";

            case "cancelled":
                return "Dibatalkan";

            default:
                return status;
        }
    };

    return (
        <div>

            {/* HEADER */}

            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        Order Produksi
                    </h1>

                    <p className="text-gray-500">
                        Kelola pesanan produksi customer.
                    </p>
                </div>

                <Link
                    to="/orders/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Buat Order
                </Link>

            </div>

            {/* SEARCH & FILTER */}

            <div className="bg-white p-4 rounded-xl shadow-sm mb-5">

                <form
                    onSubmit={handleSearch}
                    className="flex flex-col md:flex-row gap-3"
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

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                        className="border rounded-lg px-4 py-2"
                    >
                        <option value="">
                            Semua Status
                        </option>

                        <option value="draft">
                            Draft
                        </option>

                        <option value="in_progress">
                            Berjalan
                        </option>

                        <option value="completed">
                            Selesai
                        </option>

                        <option value="cancelled">
                            Dibatalkan
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="px-5 py-2 bg-gray-800 text-white rounded-lg"
                    >
                        Cari
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setSearch("");
                            setStatus("");

                            fetchOrders("", "");
                        }}
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

            {/* TABLE */}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                {loading ? (

                    <div className="p-6 text-center">
                        Loading...
                    </div>

                ) : orders.length === 0 ? (

                    <div className="p-6 text-center text-gray-500">
                        Data order tidak ditemukan.
                    </div>

                ) : (

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left px-5 py-3">
                                    No. Order
                                </th>

                                <th className="text-left px-5 py-3">
                                    Customer
                                </th>

                                <th className="text-left px-5 py-3">
                                    Tanggal
                                </th>

                                <th className="text-left px-5 py-3">
                                    Deadline
                                </th>

                                <th className="text-left px-5 py-3">
                                    Status
                                </th>

                                <th className="text-right px-5 py-3">
                                    Aksi
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {orders.map((order) => (

                                <tr
                                    key={order.id}
                                    className="border-t"
                                >

                                    <td className="px-5 py-3 font-medium">
                                        {order.order_number}
                                    </td>

                                    <td className="px-5 py-3">
                                        {order.customer?.name ??
                                            "-"}
                                    </td>

                                    <td className="px-5 py-3">
                                        {order.order_date}
                                    </td>

                                    <td className="px-5 py-3">
                                        {order.deadline}
                                    </td>

                                    <td className="px-5 py-3">

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${getStatusClass(
                                                order.status
                                            )}`}
                                        >
                                            {getStatusLabel(
                                                order.status
                                            )}
                                        </span>

                                    </td>

                                    <td className="px-5 py-3">

                                        <div className="flex justify-end gap-2">

                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="px-3 py-1 bg-gray-100 rounded"
                                            >
                                                Detail
                                            </Link>

                                            <Link
                                                to={`/orders/${order.id}/edit`}
                                                className="px-3 py-1 bg-yellow-100 rounded"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        order.id
                                                    )
                                                }
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded"
                                            >
                                                Hapus
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}