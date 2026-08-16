import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import productionService from "../../services/productionService";

export default function ProductionHistory() {
    const { orderItemId } = useParams();

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [orderItem, setOrderItem] = useState(null);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await productionService.getProductionHistory(
                    orderItemId
                );

            setHistory(response.data ?? []);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ??
                    "Gagal mengambil riwayat produksi."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchProduction = async () => {
        try {
            const response =
                await productionService.getProductionOrderItem(
                    orderItemId
                );

            setOrderItem(response.data?.order_item);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHistory();
        fetchProduction();
    }, [orderItemId]);

    const formatStage = (stage) => {
        const stages = {
            cutting: "Cutting",
            sewing: "Sewing",
            qc: "QC",
            finishing: "Finishing",
            packing: "Packing",
        };

        return stages[stage] ?? stage;
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString("id-ID");
    };

    if (loading) {
        return (
            <div className="p-6">
                Loading riwayat produksi...
            </div>
        );
    }

    return (
        <div>

            {/* HEADER */}

            <div className="mb-6">

                <Link
                    to={`/production/order-items/${orderItemId}`}
                    className="text-blue-600"
                >
                    ← Kembali ke Detail Produksi
                </Link>

                <h1 className="text-2xl font-bold mt-4">
                    Riwayat Produksi
                </h1>

                {orderItem && (
                    <p className="text-gray-500 mt-1">
                        {orderItem.order_number} -{" "}
                        {orderItem.product?.name}
                    </p>
                )}

            </div>

            {/* ERROR */}

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
                    {error}
                </div>
            )}

            {/* EMPTY */}

            {!error && history.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                    Belum ada riwayat produksi.
                </div>
            )}

            {/* HISTORY */}

            {history.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="text-left px-5 py-3">
                                        Waktu
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Tipe
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Tahap
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Dari
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Ke
                                    </th>

                                    <th className="text-right px-5 py-3">
                                        Quantity
                                    </th>

                                    <th className="text-right px-5 py-3">
                                        Good
                                    </th>

                                    <th className="text-right px-5 py-3">
                                        Reject
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Catatan
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {history.map((item) => (

                                    <tr
                                        key={item.id}
                                        className="border-t"
                                    >

                                        <td className="px-5 py-4 whitespace-nowrap text-sm">
                                            {formatDate(
                                                item.created_at
                                            )}
                                        </td>

                                        <td className="px-5 py-4">

                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    item.type ===
                                                    "rework"
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {item.type ===
                                                "rework"
                                                    ? "Rework"
                                                    : "Production"}
                                            </span>

                                        </td>

                                        <td className="px-5 py-4 font-medium">
                                            {formatStage(
                                                item.stage
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            {item.from_stage
                                                ? formatStage(
                                                      item.from_stage
                                                  )
                                                : "-"}
                                        </td>

                                        <td className="px-5 py-4">
                                            {item.to_stage
                                                ? formatStage(
                                                      item.to_stage
                                                  )
                                                : "-"}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            {item.quantity}
                                        </td>

                                        <td className="px-5 py-4 text-right text-green-600">
                                            {item.good_quantity}
                                        </td>

                                        <td className="px-5 py-4 text-right text-red-600">
                                            {item.reject_quantity}
                                        </td>

                                        <td className="px-5 py-4 min-w-[250px]">
                                            {item.notes ?? "-"}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}

        </div>
    );
}