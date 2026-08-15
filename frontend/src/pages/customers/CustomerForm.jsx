import { useEffect, useState } from "react";

const initialForm = {
    name: "",
    phone: "",
    address: "",
};

export default function CustomerForm({
    initialData = initialForm,
    onSubmit,
    submitLabel = "Simpan",
    loading = false,
}) {
    const [form, setForm] = useState(
        initialData
    );

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

            {/* NAMA */}
            <div className="mb-5">

                <label className="block mb-2 font-medium">
                    Nama Customer
                </label>

                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Masukkan nama customer"
                />

                {showError("name") && (
                    <p className="text-red-600 text-sm mt-1">
                        {showError("name")}
                    </p>
                )}

            </div>

            {/* TELEPON */}
            <div className="mb-5">

                <label className="block mb-2 font-medium">
                    Nomor Telepon
                </label>

                <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="08xxxxxxxxxx"
                />

                {showError("phone") && (
                    <p className="text-red-600 text-sm mt-1">
                        {showError("phone")}
                    </p>
                )}

            </div>

            {/* ALAMAT */}
            <div className="mb-5">

                <label className="block mb-2 font-medium">
                    Alamat
                </label>

                <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Masukkan alamat customer"
                />

                {showError("address") && (
                    <p className="text-red-600 text-sm mt-1">
                        {showError("address")}
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