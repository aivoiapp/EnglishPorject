import React from 'react';
import CustomPhoneInput from '../CustomPhoneInput';
import { usePaymentContext } from './paymentTypes';

const PaymentPersonalInfo: React.FC = () => {
  const { formData, handleInputChange, setFormData } = usePaymentContext();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">Datos Personales</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="fullName" className="block text-gray-700 dark:text-gray-300 mb-2">Nombre Completo</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          
          <div>
            <CustomPhoneInput
              label="Teléfono"
              defaultCountry="PE"
              value={formData.phone}
              onChange={(value) => setFormData(prev => ({ ...prev, phone: value || '' }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPersonalInfo;