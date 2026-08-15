import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import ProductForm from "./ProductForm";
import productService from "../../services/productService";

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response =
                    await productService.getProduct(id);

                setProduct(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            setSaving(true);

            await productService.updateProduct(
                id,
                form
            );

            navigate("/products");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return (
            <div>
                Produk tidak ditemukan.
            </div>
        );
    }

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
                    Edit Produk
                </h1>
            </div>

            <ProductForm
                initialData={{
                    product_code:
                        product.product_code ?? "",
                    name: product.name ?? "",
                    type: product.type ?? "",
                    color: product.color ?? "",
                    size: product.size ?? "",
                }}
                onSubmit={handleSubmit}
                submitLabel="Update Produk"
                loading={saving}
            />
        </div>
    );
}