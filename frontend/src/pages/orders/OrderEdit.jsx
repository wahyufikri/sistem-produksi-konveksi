import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import customerService from "../../services/customerService";
import productService from "../../services/productService";
import orderService from "../../services/orderService";

export default function OrderEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        customer_id: "",
        order_date: "",
        deadline: "",
        status: "draft",
        items: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    customerResponse,
                    productResponse,
                    orderResponse,
                ] = await Promise.all([
                    customerService.getCustomers(),
                    productService.getProducts(),
                    orderService.getOrder(id),
                ]);

                setCustomers(
                    customerResponse.data?.data ?? []
                );

                setProducts(
                    productResponse.data?.data ?? []
                );

                const orderData =
                    orderResponse.data;

                setOrder(orderData);

                setForm({
                    customer_id:
                        orderData.customer_id ?? "",
                    order_date:
                        orderData.order_date ?? "",
                    deadline:
                        orderData.deadline ?? "",
                    status:
                        orderData.status ?? "draft",
                    items:
                        orderData.items?.map(
                            (item) => ({
                                id: item.id,
                                product_id:
                                    item.product_id ??
                                    item.product?.id ??
                                    "",
                                quantity:
                                    item.quantity,
                            })
                        ) ?? [],
                });
            } catch (error) {
                console.error(error);

                alert(
                    error.response?.data?.message ??
                        "Gagal mengambil data order."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        try {
            setSaving(true);

            await orderService.updateOrder(
                id,
                form
            );

            navigate(`/orders/${id}`);
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
                        "Gagal mengubah order.",
                });
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                Loading...
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

            <div className="mb-6">

                <Link
                    to={`/orders/${id}`}
                    className="text-blue-600"
                >
                    ← Kembali
                </Link>

                <h1 className="text-2xl font-bold mt-3">
                    Edit Order {order.order_number}
                </h1>

            </div>

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
                                        errors.customer_id[0]
                                    }
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">
                                Status
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
                        </div>

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
                        </div>

                    </div>

                </div>

                {/* ITEMS */}

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

                    <div className="flex justify-between items-center mb-5">

                        <div>
                            <h2 className="text-lg font-semibold">
                                Produk Order
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={addItem}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg"
                        >
                            + Tambah Produk
                        </button>

                    </div>

                    <div className="space-y-4">

                        {form.items.map(
                            (item, index) => (

                                <div
                                    key={
                                        item.id ??
                                        `new-${index}`
                                    }
                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
                                >

                                    <div className="md:col-span-7">

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

                                    </div>

                                    <div className="md:col-span-3">

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

                                    </div>

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

                <div className="flex justify-end gap-3">

                    <Link
                        to={`/orders/${id}`}
                        className="px-5 py-2 border rounded-lg"
                    >
                        Batal
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                        {saving
                            ? "Menyimpan..."
                            : "Update Order"}
                    </button>

                </div>

            </form>

        </div>
    );
}