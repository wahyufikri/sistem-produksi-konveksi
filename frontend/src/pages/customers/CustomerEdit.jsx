import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import CustomerForm from "./CustomerForm";
import customerService from "../../services/customerService";

export default function CustomerEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    const handleSubmit = async (form) => {
        try {
            setSaving(true);

            await customerService.updateCustomer(
                id,
                form
            );

            navigate("/customers");

        } finally {
            setSaving(false);
        }
    };

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

            <div className="mb-6">

                <Link
                    to="/customers"
                    className="text-blue-600"
                >
                    ← Kembali
                </Link>

                <h1 className="text-2xl font-bold mt-3">
                    Edit Customer
                </h1>

            </div>

            <CustomerForm
                initialData={{
                    name: customer.name ?? "",
                    phone: customer.phone ?? "",
                    address:
                        customer.address ?? "",
                }}
                onSubmit={handleSubmit}
                submitLabel="Update Customer"
                loading={saving}
            />

        </div>
    );
}