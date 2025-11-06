<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ValidIPv4 implements Rule
{
    /**
     * Determinar si el valor pasa la regla de validación.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // Verificar formato básico
        if (!is_string($value)) {
            return false;
        }

        // Dividir en partes
        $parts = explode('.', $value);

        // Debe tener exactamente 4 partes
        if (count($parts) !== 4) {
            return false;
        }

        // Validar cada octeto
        foreach ($parts as $part) {
            // No debe estar vacío
            if ($part === '') {
                return false;
            }

            // No debe tener ceros a la izquierda (excepto el 0 solo)
            if ($part !== '0' && str_starts_with($part, '0')) {
                return false;
            }

            // Debe ser un número
            if (!ctype_digit($part)) {
                return false;
            }

            // Convertir a entero y verificar rango
            $num = intval($part);
            if ($num < 0 || $num > 255) {
                return false;
            }
        }

        return true;
    }

    /**
     * Obtener el mensaje de error de validación.
     *
     * @return string
     */
    public function message()
    {
        return 'El campo :attribute debe ser una dirección IPv4 válida (cada octeto entre 0-255).';
    }
}