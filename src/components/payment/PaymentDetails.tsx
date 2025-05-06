import React from 'react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { usePaymentContext } from './paymentTypes';
import { useCurrency } from '../../context/useCurrency';
import PaymentCoupons from './PaymentCoupons';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';

const PaymentDetails: React.FC = () => {
  const { t } = useTranslation();
  const { formData, handleInputChange, handleStartDateChange } = usePaymentContext();
  const { currencySymbol } = useCurrency();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">{t('payment.paymentDetails.title', 'Datos del Pago')}</h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="paymentType" className="block text-gray-700 dark:text-gray-300 mb-2">{t('payment.paymentDetails.paymentType', 'Tipo de Pago')}</label>
          <select
            id="paymentType"
            name="paymentType"
            value={formData.paymentType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="monthly">{t('payment.paymentDetails.monthly', 'Mensual')}</option>
            <option value="fullLevel">{t('payment.paymentDetails.fullLevel', 'Nivel Completo (6 meses con 10% descuento)')}</option>
          </select>
        </div>

        {formData.paymentType === 'monthly' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="monthsCount" className="block text-gray-700 dark:text-gray-300 mb-2">{t('payment.paymentDetails.monthsCount', 'Cantidad de Meses')}</label>
              <input
                type="number"
                id="monthsCount"
                name="monthsCount"
                min="1"
                max="12"
                value={formData.monthsCount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-gray-700 dark:text-gray-300 mb-2">{t('payment.paymentDetails.startMonth', 'Mes de inicio')}</label>
              <DatePicker
                id="startDate"
                selected={formData.startDate}
                onChange={handleStartDateChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                locale={es}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('payment.paymentDetails.paymentPeriod', 'Período de pago')}</label>
              <div className="text-gray-700 dark:text-gray-300 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p>{t('payment.paymentDetails.from', 'Desde')}: <strong>{format(formData.startDate, 'MMMM yyyy', { locale: es })}</strong></p>
                <p>{t('payment.paymentDetails.to', 'Hasta')}: <strong>{format(formData.endDate, 'MMMM yyyy', { locale: es })}</strong></p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4">
          {formData.appliedCoupons.length > 0 ? (
            <div>
              <p className="text-lg font-semibold dark:text-white">
                <span className="line-through text-gray-500 mr-2">
                  {t('payment.paymentDetails.originalAmount', 'Precio original')}: {currencySymbol} {formData.originalAmount.toFixed(2)}
                </span>
              </p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {t('payment.paymentDetails.amountToPay', 'Monto a pagar')}: {currencySymbol} {formData.amount.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-lg font-semibold dark:text-white">
              {t('payment.paymentDetails.amountToPay', 'Monto a pagar')}: {currencySymbol} {formData.amount.toFixed(2)}
            </p>
          )}
          {formData.paymentType === 'fullLevel' && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {t('payment.paymentDetails.discountIncluded', 'Incluye descuento del 10% por pago de nivel completo')}
            </p>
          )}
        </div>

        {/* Componente de cupones */}
        <PaymentCoupons />
        
        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="generateReceipt"
              name="generateReceipt"
              checked={formData.generateReceipt}
              onChange={(e) => {
                const customEvent = {
                  target: {
                    name: 'generateReceipt',
                    value: e.target.checked,
                    type: 'checkbox',
                    checked: e.target.checked
                  }
                };
                handleInputChange(customEvent as unknown as React.ChangeEvent<HTMLInputElement>);
                
                if (!e.target.checked) {
                  const rucEvent = {
                    target: {
                      name: 'ruc',
                      value: '',
                      type: 'text'
                    }
                  };
                  handleInputChange(rucEvent as unknown as React.ChangeEvent<HTMLInputElement>);
                }
              }}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="generateReceipt" className="ml-2 text-gray-700 dark:text-gray-300">
              {t('payment.paymentDetails.generateReceipt', 'Deseo que se genere un recibo por honorarios')}
            </label>
          </div>

          {formData.generateReceipt && (
            <div className="mt-4">
              <label htmlFor="ruc" className="block text-gray-700 dark:text-gray-300 mb-2">{t('payment.paymentDetails.enterRuc', 'Ingrese su RUC para emitir el recibo')}</label>
              <input
                type="text"
                id="ruc"
                name="ruc"
                value={formData.ruc}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required={formData.generateReceipt}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;