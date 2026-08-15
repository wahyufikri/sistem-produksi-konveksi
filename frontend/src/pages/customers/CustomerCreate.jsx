import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CustomerForm from "./CustomerForm";
import customerService from "../../services/customerService";

export default function CustomerCreate() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (form) => {
        try {
            setLoading(true);

            await customerService.createCustomer(
                form
            );

            navigate("/customers");

        } finally {
            setLoading(false);
        }
    };

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
                    Tambah Customer
                </h1>

            </div>

            <CustomerForm
                onSubmit={handleSubmit}
                submitLabel="Simpan Customer"
                loading={loading}
            />

        </div>
    );
}