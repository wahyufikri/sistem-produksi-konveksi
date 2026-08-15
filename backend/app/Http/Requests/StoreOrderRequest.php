<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'customer_id' => [
                'required',
                'integer',
                'exists:customers,id',
            ],

            'order_date' => [
                'required',
                'date',
            ],

            'deadline' => [
                'required',
                'date',
                'after_or_equal:order_date',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.product_id' => [
                'required',
                'integer',
                'exists:products,id',
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required' => 'Customer wajib dipilih.',
            'customer_id.exists' => 'Customer tidak ditemukan.',

            'order_date.required' => 'Tanggal order wajib diisi.',

            'deadline.required' => 'Deadline wajib diisi.',
            'deadline.after_or_equal' =>
                'Deadline harus sama atau setelah tanggal order.',

            'items.required' => 'Minimal satu produk harus ditambahkan.',
            'items.min' => 'Minimal satu produk harus ditambahkan.',

            'items.*.product_id.required' =>
                'Produk wajib dipilih.',
            'items.*.product_id.exists' =>
                'Produk tidak ditemukan.',

            'items.*.quantity.required' =>
                'Quantity wajib diisi.',
            'items.*.quantity.min' =>
                'Quantity minimal 1.',
        ];
    }
}
