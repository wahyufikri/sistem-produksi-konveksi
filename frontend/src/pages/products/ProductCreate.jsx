import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ProductForm from "./ProductForm";
import productService from "../../services/productService";

export default function ProductCreate() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (form) => {
        try {
            setLoading(true);

            await productService.createProduct(form);

            navigate("/products");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <Link
                    to="/products"
                    className="text-blue-600"
                >
                    ← Kembali
                </Link>

                <h1 className="text-2xl font-bold mt-3">
                    Tambah Produk
                </h1>
            </div>

            <ProductForm
                onSubmit={handleSubmit}
                submitLabel="Simpan Produk"
                loading={loading}
            />
        </div>
    );
}