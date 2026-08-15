<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $product = $this->route('product');

        // Pastikan kita mendapatkan ID produk
        $productId = $product instanceof Product
            ? $product->id
            : $product;

        return [
            'product_code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('products', 'product_code')
                    ->ignore($productId),
            ],

            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'type' => [
                'required',
                'string',
                'max:100',
            ],

            'color' => [
                'required',
                'string',
                'max:100',
            ],

            'size' => [
                'required',
                'string',
                'max:50',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'product_code.required' => 'Kode produk wajib diisi.',
            'product_code.unique' => 'Kode produk sudah digunakan.',
            'name.required' => 'Nama produk wajib diisi.',
            'type.required' => 'Jenis produk wajib diisi.',
            'color.required' => 'Warna wajib diisi.',
            'size.required' => 'Ukuran wajib diisi.',
        ];
    }
}
