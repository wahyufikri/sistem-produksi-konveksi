<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductionProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isProduction() ?? false;
    }

    public function rules(): array
    {
        return [
            'stage' => [
                'required',
                'in:cutting,sewing,qc,finishing,packing,completed',
            ],

            'quantity' => [
                'required',
                'integer',
                'min:0',
            ],

            'good_quantity' => [
                'required',
                'integer',
                'min:0',
            ],

            'reject_quantity' => [
                'required',
                'integer',
                'min:0',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

            $quantity = (int) $this->quantity;
            $good = (int) $this->good_quantity;
            $reject = (int) $this->reject_quantity;

            if (($good + $reject) !== $quantity) {
                $validator->errors()->add(
                    'quantity',
                    'Good quantity + reject quantity harus sama dengan quantity.'
                );
            }
        });
    }
}
