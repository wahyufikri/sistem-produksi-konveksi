<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcessReworkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'quantity' => [
                'required',
                'integer',
                'min:1',
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

        ];
    }
}
