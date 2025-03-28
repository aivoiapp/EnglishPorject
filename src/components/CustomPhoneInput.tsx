import React, { useState, useEffect } from 'react';
import PhoneInput, { Country } from 'react-phone-number-input';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import '../phone-input.css';

interface CustomPhoneInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  defaultCountry?: Country;
  className?: string;
  required?: boolean;
  label?: string;
  errorMessage?: string;
}

interface CountryPhoneFormat {
  [key: string]: {
    length: number;
    example: string;
  };
}

// Formatos de teléfono por país
const countryFormats: CountryPhoneFormat = {
  PE: { length: 9, example: '999 999 999' },
  US: { length: 10, example: '(555) 555-5555' },
  ES: { length: 9, example: '666 666 666' },
  MX: { length: 10, example: '55 5555 5555' },
  CO: { length: 10, example: '315 555 5555' },
  AR: { length: 10, example: '11 5555 5555' },
  CL: { length: 9, example: '9 5555 5555' },
  // Añadir más países según sea necesario
};

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  value,
  onChange,
  defaultCountry = 'PE',
  className = '',
  required = false,
  label = 'Teléfono',
  errorMessage = 'Número de teléfono inválido',
}) => {
  const [country, setCountry] = useState<Country | undefined>(defaultCountry);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Validar el número de teléfono cuando cambia el valor o el país
  useEffect(() => {
    if (value && touched) {
      validatePhoneNumber(value, country);
    } else if (!value && touched && required) {
      setError('Este campo es requerido');
    } else {
      setError(null);
    }
  }, [value, country, touched, required]);

  const validatePhoneNumber = (phoneValue: string, selectedCountry?: Country) => {
    // Si no hay valor, no validamos
    if (!phoneValue) {
      setError(required ? 'Este campo es requerido' : null);
      return;
    }

    // Validación básica con libphonenumber-js
    if (!isValidPhoneNumber(phoneValue)) {
      setError(errorMessage);
      return;
    }

    // Validación específica por país si tenemos el formato definido
    if (selectedCountry && countryFormats[selectedCountry]) {
      try {
        const parsedNumber = parsePhoneNumber(phoneValue);
        if (!parsedNumber) {
          setError(errorMessage);
          return;
        }

        // Obtener el número nacional sin espacios ni guiones
        const nationalNumber = parsedNumber.nationalNumber.toString();
        const format = countryFormats[selectedCountry];
        
        // Verificar longitud del número nacional
        if (nationalNumber.length !== format.length) {
          setError(`Debe tener ${format.length} dígitos. Ejemplo: ${format.example}`);
          return;
        }
      } catch (e) {
        console.error('Error al validar número de teléfono:', e);
        setError(errorMessage);
        return;
      }
    }

    // Si pasa todas las validaciones
    setError(null);
  };

  const handleChange = (newValue: string | undefined) => {
    onChange(newValue);
    if (newValue) {
      try {
        const parsedNumber = parsePhoneNumber(newValue);
        if (parsedNumber && parsedNumber.country) {
          setCountry(parsedNumber.country as Country);
        }
      } catch (e) {
        // Si no se puede parsear, mantenemos el país actual
        console.debug('No se pudo parsear el número:', e);
      }
    }
    // Marcar como tocado cuando el usuario cambia el valor
    if (!touched) setTouched(true);
  };

  return (
    <div className="phone-input-container">
      {label && (
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={`relative ${error && touched ? 'phone-input-error' : ''}`}>
        <PhoneInput
          international
          defaultCountry={defaultCountry}
          value={value}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          className={`w-full rounded-md ${className} ${error && touched ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'}`}
          required={required}
          countrySelectProps={{
            className: 'dark:bg-gray-700 dark:text-white'
          }}
        />
      </div>
      {error && touched && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CustomPhoneInput;