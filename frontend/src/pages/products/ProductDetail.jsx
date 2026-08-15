import { useEffect, useState } from "react";
import {
    Link,
    useParams,
} from "react-router-dom";

import productService from "../../services/productService";

export default function ProductDetail() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

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
            <Link
                to="/products"
                className="text-blue-600"
            >
                ← Kembali
            </Link>

            <h1 className="text-2xl font-bold mt-3 mb-6">
                Detail Produk
            </h1>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <p className="text-sm text-gray-500">
                            ID Produk
                        </p>

                        <p className="font-medium mt-1">
                            {product.id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Kode Produk
                        </p>

                        <p className="font-medium mt-1">
                            {product.product_code}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Nama Produk
                        </p>

                        <p className="font-medium mt-1">
                            {product.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Jenis Produk
                        </p>

                        <p className="font-medium mt-1">
                            {product.type}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Warna
                        </p>

                        <p className="font-medium mt-1">
                            {product.color}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Ukuran
                        </p>

                        <p className="font-medium mt-1">
                            {product.size}
                        </p>
                    </div>

                </div>

                <div className="mt-6">
                    <Link
                        to={`/products/${product.id}/edit`}
                        className="inline-block px-5 py-2 bg-yellow-500 text-white rounded-lg"
                    >
                        Edit Produk
                    </Link>
                </div>
            </div>
        </div>
    );
}