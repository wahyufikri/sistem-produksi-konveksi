import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import orderService from "../../services/orderService";

export default function OrderDetail() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await orderService.getOrder(id);

                setOrder(response.data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ??
                        "Gagal mengambil detail order."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

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

    if (loading) {
        return (
            <div className="p-6">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Link
                    to="/orders"
                    className="text-blue-600"
                >
                    ← Kembali
                </Link>

                <div className="bg-red-100 text-red-700 p-4 rounded-lg mt-5">
                    {error}
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div>
                Order tidak ditemukan.
            </div>
        );
    }

    return (
        <div>

            {/* HEADER */}

            <div className="mb-6">

                <Link
                    to="/orders"
                    className="text-blue-600"
                >
                    ← Kembali
                </Link>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-3">

                    <div>
                        <h1 className="text-2xl font-bold">
                            {order.order_number}
                        </h1>

                        <p className="text-gray-500">
                            Detail order produksi
                        </p>
                    </div>

                    <div className="flex gap-2">

                        <Link
                            to={`/orders/${order.id}/edit`}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                        >
                            Edit
                        </Link>

                    </div>

                </div>

            </div>

            {/* INFORMASI ORDER */}

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                <h2 className="text-lg font-semibold mb-5">
                    Informasi Order
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                    <div>
                        <p className="text-sm text-gray-500">
                            Nomor Order
                        </p>

                        <p className="font-semibold mt-1">
                            {order.order_number}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Customer
                        </p>

                        <p className="font-semibold mt-1">
                            {order.customer?.name ??
                                "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Tanggal Order
                        </p>

                        <p className="font-semibold mt-1">
                            {order.order_date}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Deadline
                        </p>

                        <p className="font-semibold mt-1">
                            {order.deadline}
                        </p>
                    </div>

                </div>

                <div className="mt-5">

                    <p className="text-sm text-gray-500">
                        Status
                    </p>

                    <span
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-sm ${getStatusClass(
                            order.status
                        )}`}
                    >
                        {getStatusLabel(
                            order.status
                        )}
                    </span>

                </div>

            </div>

            {/* ORDER ITEMS */}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                <div className="p-6 border-b">

                    <h2 className="text-lg font-semibold">
                        Produk Order
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Daftar produk yang harus diproduksi.
                    </p>

                </div>

                {order.items?.length === 0 ? (

                    <div className="p-6 text-center text-gray-500">
                        Tidak ada item produk.
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="text-left px-6 py-3">
                                        #
                                    </th>

                                    <th className="text-left px-6 py-3">
                                        Kode Produk
                                    </th>

                                    <th className="text-left px-6 py-3">
                                        Produk
                                    </th>

                                    <th className="text-left px-6 py-3">
                                        Jenis
                                    </th>

                                    <th className="text-left px-6 py-3">
                                        Warna
                                    </th>

                                    <th className="text-left px-6 py-3">
                                        Ukuran
                                    </th>

                                    <th className="text-right px-6 py-3">
                                        Quantity
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {order.items.map(
                                    (item, index) => (

                                        <tr
                                            key={item.id}
                                            className="border-t"
                                        >

                                            <td className="px-6 py-4">
                                                {index + 1}
                                            </td>

                                            <td className="px-6 py-4 font-medium">
                                                {
                                                    item.product
                                                        ?.product_code
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                {
                                                    item.product
                                                        ?.name
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                {
                                                    item.product
                                                        ?.type
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                {
                                                    item.product
                                                        ?.color
                                                }
                                            </td>

                                            <td className="px-6 py-4">
                                                {
                                                    item.product
                                                        ?.size
                                                }
                                            </td>

                                            <td className="px-6 py-4 text-right font-semibold">
                                                {
                                                    item.quantity
                                                }{" "}
                                                pcs
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}