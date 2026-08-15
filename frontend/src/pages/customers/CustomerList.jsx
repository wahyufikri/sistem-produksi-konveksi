import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import customerService from "../../services/customerService";

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const fetchCustomers = async (searchValue = "") => {
        try {
            setLoading(true);
            setError("");

            const response =
                await customerService.getCustomers({
                    search: searchValue,
                });

            /*
             * Laravel pagination biasanya:
             * response.data.data
             */
            setCustomers(
                response.data?.data ?? []
            );

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ??
                "Gagal mengambil data customer."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        fetchCustomers(search);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Apakah Anda yakin ingin menghapus customer ini?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await customerService.deleteCustomer(id);

            fetchCustomers(search);

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ??
                "Gagal menghapus customer."
            );
        }
    };

    return (
        <div>

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        Customer
                    </h1>

                    <p className="text-gray-500">
                        Kelola data customer.
                    </p>
                </div>

                <Link
                    to="/customers/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Tambah Customer
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
                        placeholder="Cari nama customer..."
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
                            fetchCustomers("");
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
                ) : customers.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        Data customer tidak ditemukan.
                    </div>
                ) : (
                    <table className="w-full">

                        <thead className="bg-gray-50">
                            <tr>

                                <th className="text-left px-5 py-3">
                                    ID
                                </th>

                                <th className="text-left px-5 py-3">
                                    Nama
                                </th>

                                <th className="text-left px-5 py-3">
                                    Telepon
                                </th>

                                <th className="text-left px-5 py-3">
                                    Alamat
                                </th>

                                <th className="text-right px-5 py-3">
                                    Aksi
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {customers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="border-t"
                                >

                                    <td className="px-5 py-3">
                                        {customer.id}
                                    </td>

                                    <td className="px-5 py-3 font-medium">
                                        {customer.name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {customer.phone}
                                    </td>

                                    <td className="px-5 py-3">
                                        {customer.address ?? "-"}
                                    </td>

                                    <td className="px-5 py-3">
                                        <div className="flex justify-end gap-2">

                                            <Link
                                                to={`/customers/${customer.id}`}
                                                className="px-3 py-1 bg-gray-100 rounded"
                                            >
                                                Detail
                                            </Link>

                                            <Link
                                                to={`/customers/${customer.id}/edit`}
                                                className="px-3 py-1 bg-yellow-100 rounded"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        customer.id
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