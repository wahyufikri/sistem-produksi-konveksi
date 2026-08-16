import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import productionService from "../../services/productionService";

const stages = [
    {
        key: "cutting",
        label: "Cutting",
    },
    {
        key: "sewing",
        label: "Sewing",
    },
    {
        key: "qc",
        label: "QC",
    },
    {
        key: "finishing",
        label: "Finishing",
    },
    {
        key: "packing",
        label: "Packing",
    },
];

export default function ProductionDetail() {
    const { orderItemId } = useParams();

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);
    const [history, setHistory] = useState([]);
const [loadingHistory, setLoadingHistory] = useState(false);
const [showHistory, setShowHistory] = useState(false);
const [showRework, setShowRework] = useState(false);
const [savingRework, setSavingRework] = useState(false);

const [reworkForm, setReworkForm] = useState({
    from_stage: "",
    to_stage: "",
    quantity: "",
    notes: "",
});
const [processReworkForm, setProcessReworkForm] = useState({
    quantity: "",
    good_quantity: "",
    reject_quantity: "",
});

const [savingProcessRework, setSavingProcessRework] =
    useState(false);

    const [form, setForm] = useState({
        stage: "",
        quantity: "",
        good_quantity: "",
        reject_quantity: "",
    });

    const fetchProduction = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await productionService.getProductionDetail(
                    orderItemId
                );

            setData(response.data);
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
    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);

            const response =
                await productionService.getProductionHistory(
                    orderItemId
                );

            setHistory(response.data ?? []);
            setShowHistory(true);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ??
                    "Gagal mengambil riwayat produksi."
            );

        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
    fetchProduction();
    fetchHistory();
}, [orderItemId]);

    /*
    |--------------------------------------------------------------------------
    | Form Handler
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleReworkChange = (e) => {
    const { name, value } = e.target;

    setReworkForm((prev) => ({
        ...prev,
        [name]: value,
    }));
};
const handleProcessReworkChange = (e) => {
    const { name, value } = e.target;

    setProcessReworkForm((prev) => ({
        ...prev,
        [name]: value,
    }));
};

const handleProcessReworkSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
        setSavingProcessRework(true);

        const quantity = Number(
            processReworkForm.quantity
        );

        const good_quantity = Number(
            processReworkForm.good_quantity
        );

        const reject_quantity = Number(
            processReworkForm.reject_quantity
        );

        await productionService.processRework(
    orderItemId,
    {
        quantity,
        good_quantity,
        reject_quantity,
    }
);

        setProcessReworkForm({
            quantity: "",
            good_quantity: "",
            reject_quantity: "",
        });

        await fetchProduction();

        if (showHistory) {
            await fetchHistory();
        }

        alert(
            "Proses rework di Sewing berhasil dicatat."
        );

    } catch (error) {
        console.error(error);

        setError(
            error.response?.data?.message ??
                "Gagal memproses rework."
        );
    } finally {
        setSavingProcessRework(false);
    }
};

    /*
    |--------------------------------------------------------------------------
    | Update Progress
    |--------------------------------------------------------------------------
    */
const handleReworkSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
        setSavingRework(true);

        await productionService.reworkProduction(
            orderItemId,
            {
                from_stage: reworkForm.from_stage,
                to_stage: reworkForm.to_stage,
                quantity: Number(reworkForm.quantity),
                notes: reworkForm.notes,
            }
        );

        setReworkForm({
            from_stage: "",
            to_stage: "",
            quantity: "",
            notes: "",
        });

        setShowRework(false);

        await fetchProduction();

        if (showHistory) {
            await fetchHistory();
        }

        alert("Rework berhasil dicatat.");

    } catch (error) {
        console.error(error);

        setError(
            error.response?.data?.message ??
                "Gagal mencatat rework."
        );
    } finally {
        setSavingRework(false);
    }
};
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            setSaving(true);

            await productionService.updateProductionProgress(
                orderItemId,
                {
                    stage: form.stage,
                    quantity: Number(form.quantity),
                    good_quantity: Number(
                        form.good_quantity
                    ),
                    reject_quantity: Number(
                        form.reject_quantity
                    ),
                }
            );

            setForm({
                stage: "",
                quantity: "",
                good_quantity: "",
                reject_quantity: "",
            });

            await fetchProduction();

            alert("Progress produksi berhasil diperbarui.");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ??
                    "Gagal memperbarui progress produksi."
            );
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="p-6">
                Loading data produksi...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-6">
                Data produksi tidak ditemukan.
            </div>
        );
    }

    const orderItem = data.order_item;

    const progress = data.progress ?? [];
    const getProgress = (stage) => {
    return progress.find(
        (item) => item.stage === stage
    );
};

const sewingProgress = getProgress("sewing");
const qcProgress = getProgress("qc");

// Total barang yang dikirim dari QC ke Sewing untuk rework
const totalSentToRework = history
    .filter(
        (item) =>
            item.type === "rework" &&
            item.action === "send_to_rework" &&
            item.from_stage === "qc" &&
            item.to_stage === "sewing"
    )
    .reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

// Total barang reject yang sudah diproses kembali di Sewing
const totalProcessedRework = history
    .filter(
        (item) =>
            item.type === "rework" &&
            item.action === "process_rework" &&
            item.stage === "sewing"
    )
    .reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

// Barang yang masih menunggu dikerjakan kembali
const pendingRework = Math.max(
    0,
    totalSentToRework - totalProcessedRework
);

    return (
        <div>

            {/* HEADER */}

            <div className="mb-6">

                <Link
                    to="/production"
                    className="text-blue-600 hover:underline"
                >
                    ← Kembali ke Produksi
                </Link>

                <h1 className="text-2xl font-bold mt-3">
                    Progress Produksi
                </h1>

                <p className="text-gray-500 mt-1">
                    {orderItem.order_number} -{" "}
                    {orderItem.product?.name}
                </p>

            </div>

            {/* ERROR */}

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* INFO */}

<div className="bg-white rounded-xl shadow-sm p-6 mb-6">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div>
            <p className="text-sm text-gray-500">
                Order
            </p>

            <p className="font-semibold mt-1">
                {orderItem.order_number}
            </p>
        </div>

        <div>
            <p className="text-sm text-gray-500">
                Produk
            </p>

            <p className="font-semibold mt-1">
                {orderItem.product?.code} -{" "}
                {orderItem.product?.name}
            </p>
        </div>

        <div>
            <p className="text-sm text-gray-500">
                Quantity Order
            </p>

            <p className="font-semibold mt-1">
                {orderItem.order_quantity} pcs
            </p>
        </div>

    </div>

</div>


{/* SUMMARY REWORK */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

    <div className="bg-white rounded-lg p-4 border">
        <p className="text-sm text-gray-500">
            Reject QC
        </p>

        <p className="text-xl font-bold text-red-600 mt-1">
            {qcProgress?.reject_quantity ?? 0} pcs
        </p>
    </div>

    <div className="bg-white rounded-lg p-4 border">
        <p className="text-sm text-gray-500">
            Sudah Diproses Rework
        </p>

        <p className="text-xl font-bold text-green-600 mt-1">
            {totalProcessedRework} pcs
        </p>
    </div>

    <div className="bg-white rounded-lg p-4 border">
        <p className="text-sm text-gray-500">
            Menunggu Rework
        </p>

        <p className="text-xl font-bold text-yellow-600 mt-1">
            {pendingRework} pcs
        </p>
    </div>

</div>


{/* BUTTON */}

<div className="flex justify-end gap-3 mb-6">

    <button
        type="button"
        onClick={() => setShowRework(!showRework)}
        className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
    >
        {showRework
            ? "Tutup Rework"
            : "Rework Barang Reject"}
    </button>

    <button
        type="button"
        onClick={() => fetchHistory(true)}
        disabled={loadingHistory}
        className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
    >
        {loadingHistory
            ? "Memuat..."
            : "Lihat Riwayat Produksi"}
    </button>

</div>
{showRework && (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

        <h2 className="text-lg font-semibold mb-2">
            Rework Barang Reject
        </h2>

        <p className="text-sm text-gray-500 mb-6">
            Kembalikan barang reject ke tahap produksi
            untuk diperbaiki.
        </p>

        <form onSubmit={handleReworkSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* FROM STAGE */}

                <div>
                    <label className="block mb-2 font-medium">
                        Dari Tahap
                    </label>

                    <select
                        name="from_stage"
                        value={reworkForm.from_stage}
                        onChange={handleReworkChange}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        <option value="">
                            Pilih Tahap
                        </option>

                        {stages.map((stage) => (
                            <option
                                key={stage.key}
                                value={stage.key}
                            >
                                {stage.label}
                            </option>
                        ))}
                    </select>
                </div>


                {/* TO STAGE */}

                <div>
                    <label className="block mb-2 font-medium">
                        Kembali Ke Tahap
                    </label>

                    <select
                        name="to_stage"
                        value={reworkForm.to_stage}
                        onChange={handleReworkChange}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                    >
                        <option value="">
                            Pilih Tahap
                        </option>

                        {stages.map((stage) => (
                            <option
                                key={stage.key}
                                value={stage.key}
                            >
                                {stage.label}
                            </option>
                        ))}
                    </select>
                </div>


                {/* QUANTITY */}

                <div>
                    <label className="block mb-2 font-medium">
                        Quantity Rework
                    </label>

                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={reworkForm.quantity}
                        onChange={handleReworkChange}
                        required
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder="Contoh: 40"
                    />
                </div>

            </div>


            {/* NOTES */}

            <div className="mt-5">

                <label className="block mb-2 font-medium">
                    Catatan
                </label>

                <textarea
                    name="notes"
                    value={reworkForm.notes}
                    onChange={handleReworkChange}
                    rows="3"
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Contoh: 40 pcs reject QC dikembalikan ke sewing."
                />

            </div>


            {/* BUTTON */}

            <div className="flex justify-end gap-3 mt-6">

                <button
                    type="button"
                    onClick={() => setShowRework(false)}
                    className="px-5 py-2 border rounded-lg"
                >
                    Batal
                </button>

                <button
                    type="submit"
                    disabled={savingRework}
                    className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                >
                    {savingRework
                        ? "Menyimpan..."
                        : "Simpan Rework"}
                </button>

            </div>

        </form>

    </div>
)}
{/* REWORK QUEUE */}

{pendingRework > 0 && (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            
                <h2 className="text-lg font-semibold text-yellow-800">
                    Barang Reject Menunggu Rework
                </h2>

                <p className="text-sm text-yellow-700 mt-1">
                    Terdapat{" "}
                    <strong>{pendingRework} pcs</strong>{" "}
                    reject dari QC yang perlu diperbaiki
                    kembali di Sewing.
                </p>
            
        </div>

        {pendingRework > 0 &&(
            <form
                onSubmit={
                    handleProcessReworkSubmit
                }
                className="mt-6 pt-6 border-t border-yellow-200"
            >

                <h3 className="font-semibold mb-4">
                    Proses Rework di Sewing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* QUANTITY */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Quantity Rework
                        </label>

                        <input
                            type="number"
                            name="quantity"
                            min="1"
                            max={pendingRework}
                            value={
                                processReworkForm.quantity
                            }
                            onChange={
                                handleProcessReworkChange
                            }
                            required
                            className="w-full border rounded-lg px-4 py-2"
                        />

                        <p className="text-xs text-gray-500 mt-1">
                            Maksimal {pendingRework} pcs
                        </p>

                    </div>

                    {/* GOOD */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Good Setelah Rework
                        </label>

                        <input
                            type="number"
                            name="good_quantity"
                            min="0"
                            value={
                                processReworkForm.good_quantity
                            }
                            onChange={
                                handleProcessReworkChange
                            }
                            required
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Contoh: 35"
                        />

                    </div>

                    {/* REJECT */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Reject Setelah Rework
                        </label>

                        <input
                            type="number"
                            name="reject_quantity"
                            min="0"
                            value={
                                processReworkForm.reject_quantity
                            }
                            onChange={
                                handleProcessReworkChange
                            }
                            required
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Contoh: 5"
                        />

                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        type="button"
                        onClick={() =>
                            setProcessReworkForm({
                                quantity: "",
                                good_quantity: "",
                                reject_quantity: "",
                            })
                        }
                        className="px-5 py-2 border rounded-lg"
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        disabled={savingProcessRework}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {savingProcessRework
                            ? "Menyimpan..."
                            : "Simpan Proses Sewing"}
                    </button>

                </div>

            </form>
        )}

    </div>
)}

{showHistory && (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

        <div className="flex items-center justify-between mb-6">

            <div>
                <h2 className="text-lg font-semibold">
                    Riwayat Produksi
                </h2>

                <p className="text-sm text-gray-500">
                    Riwayat seluruh proses produksi dan rework.
                </p>
            </div>

            <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700"
            >
                Tutup
            </button>

        </div>

        {history.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
                Belum ada riwayat produksi.
            </div>
        ) : (
            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="text-left px-4 py-3">
                                #
                            </th>

                            <th className="text-left px-4 py-3">
                                Tipe
                            </th>

                            <th className="text-left px-4 py-3">
                                Tahap
                            </th>

                            <th className="text-left px-4 py-3">
                                Quantity
                            </th>

                            <th className="text-left px-4 py-3">
                                Good
                            </th>

                            <th className="text-left px-4 py-3">
                                Reject
                            </th>

                            <th className="text-left px-4 py-3">
                                Keterangan
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {history.map((item) => (

                            <tr
                                key={item.id}
                                className="border-t"
                            >

                                <td className="px-4 py-3">
                                    {item.id}
                                </td>

                                <td className="px-4 py-3">

                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                            item.type === "rework"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                    >
                                        {item.type === "rework"
                                            ? "Rework"
                                            : "Production"}
                                    </span>

                                </td>

                                <td className="px-4 py-3">

                                    {item.type === "rework"
                                        ? `${item.from_stage ?? "-"} → ${item.to_stage ?? "-"}`
                                        : item.stage}

                                </td>

                                <td className="px-4 py-3">
                                    {item.quantity} pcs
                                </td>

                                <td className="px-4 py-3 text-green-600">
                                    {item.good_quantity} pcs
                                </td>

                                <td className="px-4 py-3 text-red-600">
                                    {item.reject_quantity} pcs
                                </td>

                                <td className="px-4 py-3">
                                    {item.notes ?? "-"}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>
        )}

    </div>
)}

            {/* PROGRESS */}

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                <h2 className="text-lg font-semibold mb-6 text-gray-500 ">
                    Progress Produksi
                </h2>

                <div className="space-y-4">

                    {stages.map((stage) => {
                        const item =
                            getProgress(stage.key);

                        return (
                            <div
                                key={stage.key}
                                className="border rounded-xl p-4"
                            >

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    <div className="flex items-center gap-3">

                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                                item?.status ===
                                                "completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            {item?.status ===
                                            "completed"
                                                ? "✓"
                                                : "○"}
                                        </div>

                                        <div>

                                            <p className="font-semibold">
                                                {stage.label}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {item
                                                    ? item.status ===
                                                      "completed"
                                                        ? "Selesai"
                                                        : "Sedang berjalan"
                                                    : "Belum diproses"}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="grid grid-cols-3 gap-5 text-sm">

                                        <div>
                                            <p className="text-gray-500">
                                                Quantity
                                            </p>

                                            <p className="font-semibold">
                                                {item?.quantity ??
                                                    0}{" "}
                                                pcs
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">
                                                Good
                                            </p>

                                            <p className="font-semibold text-green-600">
                                                {item?.good_quantity ??
                                                    0}{" "}
                                                pcs
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">
                                                Reject
                                            </p>

                                            <p className="font-semibold text-red-600">
                                                {item?.reject_quantity ??
                                                    0}{" "}
                                                pcs
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>

            {/* UPDATE FORM */}

            <div className="bg-white rounded-xl shadow-sm p-6">

                <h2 className="text-lg font-semibold mb-2 text-gray-500 ">
                    Update Progress
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                    Masukkan jumlah produksi pada tahap
                    yang sedang dikerjakan.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                        {/* STAGE */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Tahap
                            </label>

                            <select
                                name="stage"
                                value={form.stage}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg px-4 py-2"
                            >
                                <option value="">
                                    Pilih Tahap
                                </option>

                                {stages.map(
                                    (stage) => (
                                        <option
                                            key={
                                                stage.key
                                            }
                                            value={
                                                stage.key
                                            }
                                        >
                                            {
                                                stage.label
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                        </div>

                        {/* QUANTITY */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Quantity
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                min="0"
                                value={
                                    form.quantity
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full border rounded-lg px-4 py-2"
                            />

                        </div>

                        {/* GOOD */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Good
                            </label>

                            <input
                                type="number"
                                name="good_quantity"
                                min="0"
                                value={
                                    form.good_quantity
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full border rounded-lg px-4 py-2"
                            />

                        </div>

                        {/* REJECT */}

                        <div>

                            <label className="block mb-2 font-medium">
                                Reject
                            </label>

                            <input
                                type="number"
                                name="reject_quantity"
                                min="0"
                                value={
                                    form.reject_quantity
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                className="w-full border rounded-lg px-4 py-2"
                            />

                        </div>

                    </div>

                    <div className="flex justify-end mt-6">

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving
                                ? "Menyimpan..."
                                : "Update Progress"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}