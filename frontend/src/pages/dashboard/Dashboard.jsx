import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get("/dashboard");

                setData(response.data.data);
            } catch (error) {
                console.error(
                    "Gagal mengambil dashboard:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div>
                Loading dashboard...
            </div>
        );
    }

    if (!data) {
        return (
            <div>
                Gagal memuat dashboard.
            </div>
        );
    }

    const summary = data.summary;

    const cards = [
        {
            title: "Total Customer",
            value: summary.total_customer,
        },
        {
            title: "Total Order",
            value: summary.total_order,
        },
        {
            title: "Order Berjalan",
            value: summary.order_berjalan,
        },
        {
            title: "Order Selesai",
            value: summary.order_selesai,
        },
        {
            title: "Order Terlambat",
            value: summary.order_terlambat,
        },
    ];

    return (
        <div>

            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Dashboard
                </h1>

                <p className="text-gray-500">
                    Ringkasan sistem produksi.
                </p>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white rounded-xl p-5 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">
                            {card.title}
                        </p>

                        <p className="text-3xl font-bold mt-2">
                            {card.value}
                        </p>
                    </div>
                ))}

            </div>

            {/* PRODUCTION */}
            <div className="mt-8">

                <h2 className="text-xl font-semibold mb-4">
                    Produksi Berdasarkan Tahapan
                </h2>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-5 py-3">
                                    Tahap
                                </th>

                                <th className="text-left px-5 py-3">
                                    Quantity
                                </th>

                                <th className="text-left px-5 py-3">
                                    Good
                                </th>

                                <th className="text-left px-5 py-3">
                                    Reject
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {Object.entries(
                                data.production
                            ).map(
                                ([stage, value]) => (
                                    <tr
                                        key={stage}
                                        className="border-t"
                                    >
                                        <td className="px-5 py-3 capitalize">
                                            {stage}
                                        </td>

                                        <td className="px-5 py-3">
                                            {value.quantity}
                                        </td>

                                        <td className="px-5 py-3">
                                            {value.good_quantity}
                                        </td>

                                        <td className="px-5 py-3">
                                            {value.reject_quantity}
                                        </td>
                                    </tr>
                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}