import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import customerService from "../../services/customerService";
import productService from "../../services/productService";
import orderService from "../../services/orderService";

export default function OrderCreate() {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [loadingData, setLoadingData] = useState(true);
    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        customer_id: "",
        order_date: "",
        deadline: "",
        status: "draft",
        items: [
            {
                product_id: "",
                quantity: 1,
            },
        ],
    });

    /*
    |--------------------------------------------------------------------------
    | Load Customer & Product
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);

                const [
                    customerResponse,
                    productResponse,
                ] = await Promise.all([
                    customerService.getCustomers(),
                    productService.getProducts(),
                ]);

                setCustomers(
                    customerResponse.data?.data ?? []
                );

                setProducts(
                    productResponse.data?.data ?? []
                );
            } catch (error) {
                console.error(error);

                alert(
                    error.response?.data?.message ??
                        "Gagal mengambil data customer dan produk."
                );
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, []);

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

    /*
    |--------------------------------------------------------------------------
    | Item Product
    |--------------------------------------------------------------------------
    */

    const handleItemChange = (
        index,
        field,
        value
    ) => {
        setForm((prev) => {
            const items = [...prev.items];

            items[index] = {
                ...items[index],
                [field]: value,
            };

            return {
                ...prev,
                items,
            };
        });
    };

    const addItem = () => {
        setForm((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    product_id: "",
                    quantity: 1,
                },
            ],
        }));
    };

    const removeItem = (index) => {
        if (form.items.length === 1) {
            return;
        }

        setForm((prev) => ({
            ...prev,
            items: prev.items.filter(
                (_, i) => i !== index
            ),
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        try {
            setSaving(true);

            await orderService.createOrder(form);

            navigate("/orders");
        } catch (error) {
            console.error(error);

            if (error.response?.data?.errors) {
                setErrors(
                    error.response.data.errors
                );
            } else {
                setErrors({
                    general:
                        error.response?.data?.message ??
                        "Gagal membuat order.",
                });
            }
        } finally {
            setSaving(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loadingData) {
        return (
            <div className="p-6">
                Loading data customer dan produk...
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

                <h1 className="text-2xl font-bold mt-3">
                    Buat Order Produksi
                </h1>

                <p className="text-gray-500 mt-1">
                    Masukkan informasi order dan produk
                    yang akan diproduksi.
                </p>

            </div>

            {/* GENERAL ERROR */}

            {errors.general && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* INFORMASI ORDER */}

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                    <h2 className="text-lg font-semibold mb-5">
                        Informasi Order
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* CUSTOMER */}

                        <div>
                            <label className="block mb-2 font-medium">
                                Customer
                            </label>

                            <select
                                name="customer_id"
                                value={form.customer_id}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            >
                                <option value="">
                                    Pilih Customer
                                </option>

                                {customers.map(
                                    (customer) => (
                                        <option
                                            key={
                                                customer.id
                                            }
                                            value={
                                                customer.id
                                            }
                                        >
                                            {customer.name}
                                        </option>
                                    )
                                )}
                            </select>

                            {errors.customer_id && (
                                <p className="text-red-600 text-sm mt-1">
                                    {
                                        errors
                                            .customer_id[0]
                                    }
                                </p>
                            )}
                        </div>

                        {/* STATUS */}

                        <div>
                            <label className="block mb-2 font-medium">
                                Status Order
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            >
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
                        </div>

                        {/* ORDER DATE */}

                        <div>
                            <label className="block mb-2 font-medium">
                                Tanggal Order
                            </label>

                            <input
                                type="date"
                                name="order_date"
                                value={form.order_date}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />

                            {errors.order_date && (
                                <p className="text-red-600 text-sm mt-1">
                                    {
                                        errors
                                            .order_date[0]
                                    }
                                </p>
                            )}
                        </div>

                        {/* DEADLINE */}

                        <div>
                            <label className="block mb-2 font-medium">
                                Deadline
                            </label>

                            <input
                                type="date"
                                name="deadline"
                                value={form.deadline}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />

                            {errors.deadline && (
                                <p className="text-red-600 text-sm mt-1">
                                    {
                                        errors
                                            .deadline[0]
                                    }
                                </p>
                            )}
                        </div>

                    </div>

                </div>

                {/* ORDER ITEMS */}

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                    <div className="flex items-center justify-between mb-5">

                        <div>
                            <h2 className="text-lg font-semibold">
                                Produk Order
                            </h2>

                            <p className="text-sm text-gray-500">
                                Tambahkan satu atau beberapa
                                produk.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={addItem}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            + Tambah Produk
                        </button>

                    </div>

                    {/* HEADER TABLE */}

                    <div className="hidden md:grid grid-cols-12 gap-4 mb-2 text-sm font-medium text-gray-500">

                        <div className="col-span-7">
                            Produk
                        </div>

                        <div className="col-span-3">
                            Quantity
                        </div>

                        <div className="col-span-2">
                            Aksi
                        </div>

                    </div>

                    {/* ITEMS */}

                    <div className="space-y-4">

                        {form.items.map(
                            (item, index) => (

                                <div
                                    key={index}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start border rounded-lg p-4 md:border-0 md:p-0"
                                >

                                    {/* PRODUCT */}

                                    <div className="md:col-span-7">

                                        <label className="md:hidden block mb-2 font-medium">
                                            Produk
                                        </label>

                                        <select
                                            value={
                                                item.product_id
                                            }
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "product_id",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-lg px-4 py-2"
                                        >
                                            <option value="">
                                                Pilih Produk
                                            </option>

                                            {products.map(
                                                (
                                                    product
                                                ) => (
                                                    <option
                                                        key={
                                                            product.id
                                                        }
                                                        value={
                                                            product.id
                                                        }
                                                    >
                                                        {
                                                            product.product_code
                                                        }{" "}
                                                        -
                                                        {
                                                            product.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        {errors[
                                            `items.${index}.product_id`
                                        ] && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {
                                                    errors[
                                                        `items.${index}.product_id`
                                                    ][0]
                                                }
                                            </p>
                                        )}

                                    </div>

                                    {/* QUANTITY */}

                                    <div className="md:col-span-3">

                                        <label className="md:hidden block mb-2 font-medium">
                                            Quantity
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            value={
                                                item.quantity
                                            }
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "quantity",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-lg px-4 py-2"
                                        />

                                        {errors[
                                            `items.${index}.quantity`
                                        ] && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {
                                                    errors[
                                                        `items.${index}.quantity`
                                                    ][0]
                                                }
                                            </p>
                                        )}

                                    </div>

                                    {/* DELETE */}

                                    <div className="md:col-span-2">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeItem(
                                                    index
                                                )
                                            }
                                            disabled={
                                                form.items
                                                    .length ===
                                                1
                                            }
                                            className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg disabled:opacity-40"
                                        >
                                            Hapus
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

                {/* SUBMIT */}

                <div className="flex justify-end gap-3">

                    <Link
                        to="/orders"
                        className="px-5 py-2 border rounded-lg"
                    >
                        Batal
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving
                            ? "Menyimpan..."
                            : "Simpan Order"}
                    </button>

                </div>

            </form>

        </div>
    );
}