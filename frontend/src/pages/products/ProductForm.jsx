import { useEffect, useState } from "react";

const defaultForm = {
    product_code: "",
    name: "",
    type: "",
    color: "",
    size: "",
};

export default function ProductForm({
    initialData = defaultForm,
    onSubmit,
    submitLabel = "Simpan",
    loading = false,
}) {
    const [form, setForm] = useState(initialData);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        setForm(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        try {
            await onSubmit(form);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(
                    error.response.data.errors
                );
            } else {
                setErrors({
                    general:
                        error.response?.data?.message ??
                        "Terjadi kesalahan.",
                });
            }
        }
    };

    const showError = (field) => {
        return errors[field]?.[0];
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm p-6"
        >
            {errors.general && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
                    {errors.general}
                </div>
            )}

            {/* KODE PRODUK */}
            <div className="mb-5">
                <label className="block mb-2 font-medium">
                    Kode Produk
                </label>

                <input
                    type="text"
                    name="product_code"
                    value={form.product_code}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Contoh: PRD-001"
                />

                {showError("product_code") && (
                    <p className="text-red-600 text-sm mt-1">
                        {showError("product_code")}
                    </p>
                )}
            </div>

            {/* NAMA */}
            <div className="mb-5">
                <label className="block mb-2 font-medium">
                    Nama Produk
                </label>

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Contoh: Kaos Oversize"
                />

                {showError("name") && (
                    <p className="text-red-600 text-sm mt-1">
                        {showError("name")}
                    </p>
                )}
            </div>

            {/* JENIS */}
            <div className="mb-5">
                <label className="block mb-2 font-medium">
                    Jenis Produk
                </label>

                <input
                    type="text"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Contoh: Kaos"
                />

                {showError("type") && (
                    <p className="text-red-600 text-sm mt-1">
                        {showError("type")}
                    </p>
                )}
            </div>

            {/* WARNA */}
            <div className="mb-5">
                <label className="block mb-2 font-medium">
                    Warna
                </label>

                <input
                    type="text"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Contoh: Hitam"
                />

                {showError("color") && (
                    <p className="text-red-600 text-sm mt-1">
                        {showError("color")}
                    </p>
                )}
            </div>

            {/* UKURAN */}
            <div className="mb-5">
                <label className="block mb-2 font-medium">
                    Ukuran
                </label>

                <input
                    type="text"
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Contoh: XL"
                />

                {showError("size") && (
                    <p className="text-red-600 text-sm mt-1">
                        {showError("size")}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {loading
                    ? "Menyimpan..."
                    : submitLabel}
            </button>
        </form>
    );
}