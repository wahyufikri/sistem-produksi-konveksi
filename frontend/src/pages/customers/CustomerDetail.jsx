import { useEffect, useState } from "react";
import {
    Link,
    useParams,
} from "react-router-dom";

import customerService from "../../services/customerService";

export default function CustomerDetail() {
    const { id } = useParams();

    const [customer, setCustomer] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response =
                    await customerService.getCustomer(
                        id
                    );

                setCustomer(
                    response.data
                );
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!customer) {
        return (
            <div>
                Customer tidak ditemukan.
            </div>
        );
    }

    return (
        <div>

            <Link
                to="/customers"
                className="text-blue-600"
            >
                ← Kembali
            </Link>

            <h1 className="text-2xl font-bold mt-3 mb-6">
                Detail Customer
            </h1>

            <div className="bg-white rounded-xl shadow-sm p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <p className="text-sm text-gray-500">
                            ID Customer
                        </p>

                        <p className="font-medium mt-1">
                            {customer.id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Nama
                        </p>

                        <p className="font-medium mt-1">
                            {customer.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Nomor Telepon
                        </p>

                        <p className="font-medium mt-1">
                            {customer.phone}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Alamat
                        </p>

                        <p className="font-medium mt-1">
                            {customer.address ??
                                "-"}
                        </p>
                    </div>

                </div>

                <div className="mt-6">

                    <Link
                        to={`/customers/${customer.id}/edit`}
                        className="inline-block px-5 py-2 bg-yellow-500 text-white rounded-lg"
                    >
                        Edit Customer
                    </Link>

                </div>

            </div>

        </div>
    );
}