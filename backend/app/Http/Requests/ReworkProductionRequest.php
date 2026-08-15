<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReworkProductionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isProduction() ?? false;
    }

    public function rules(): array
    {
        return [
            'from_stage' => [
                'required',
                'in:qc,finishing,packing',
            ],

            'to_stage' => [
                'required',
                'in:cutting,sewing,finishing',
            ],

            'quantity' => [
                'required',
                'integer',
                'min:1',
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
            if ($this->from_stage === $this->to_stage) {
                $validator->errors()->add(
                    'to_stage',
                    'Tahap tujuan tidak boleh sama dengan tahap asal.'
                );
            }
        });
    }
}
