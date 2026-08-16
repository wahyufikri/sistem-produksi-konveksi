import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";

export default function ProductList() {
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const fetchProducts = async (searchValue = "") => {
        try {
            setLoading(true);
            setError("");

            const response =
                await productService.getProducts({
                    search: searchValue,
                });

            setProducts(
                response.data ?? []
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ??
                    "Gagal mengambil data produk."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        fetchProducts(search);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Apakah Anda yakin ingin menghapus produk ini?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await productService.deleteProduct(id);

            fetchProducts(search);
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ??
                    "Gagal menghapus produk."
            );
        }
    };

    return (
        <div>
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Produk
                    </h1>

                    <p className="text-gray-500">
                        Kelola data produk.
                    </p>
                </div>

                <Link
                    to="/products/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Tambah Produk
                </Link>
            </div>

            {/* SEARCH */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-5">
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
                        placeholder="Cari kode atau nama produk..."
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
                        onClick={() => {
                            setSearch("");
                            fetchProducts("");
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
                ) : products.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        Data produk tidak ditemukan.
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-5 py-3">
                                    ID
                                </th>

                                <th className="text-left px-5 py-3">
                                    Kode
                                </th>

                                <th className="text-left px-5 py-3">
                                    Nama Produk
                                </th>

                                <th className="text-left px-5 py-3">
                                    Jenis
                                </th>

                                <th className="text-left px-5 py-3">
                                    Warna
                                </th>

                                <th className="text-left px-5 py-3">
                                    Ukuran
                                </th>

                                <th className="text-right px-5 py-3">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-t"
                                >
                                    <td className="px-5 py-3">
                                        {product.id}
                                    </td>

                                    <td className="px-5 py-3 font-medium">
                                        {product.product_code}
                                    </td>

                                    <td className="px-5 py-3">
                                        {product.name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {product.type}
                                    </td>

                                    <td className="px-5 py-3">
                                        {product.color}
                                    </td>

                                    <td className="px-5 py-3">
                                        {product.size}
                                    </td>

                                    <td className="px-5 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/products/${product.id}`}
                                                className="px-3 py-1 bg-gray-100 rounded"
                                            >
                                                Detail
                                            </Link>

                                            <Link
                                                to={`/products/${product.id}/edit`}
                                                className="px-3 py-1 bg-yellow-100 rounded"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        product.id
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