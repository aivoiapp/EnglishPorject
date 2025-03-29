import React, { useState, useEffect, useMemo } from 'react';
import { Schedule, schedules } from '../../types';
import DatePicker from 'react-datepicker';
import { format, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import CustomPhoneInput from '../CustomPhoneInput';
import '../../phone-input.css';
import { FaUniversity, FaCreditCard, FaQrcode, FaMobileAlt } from 'react-icons/fa';
import IzipayPaymentPopup from './IzipayPaymentPopup';

export interface PaymentFormData {
  fullName: string;
  email: string;
  phone: string;
  courseLevel: string;
  courseSchedule: string;
  studentGroup: string;
  paymentType: 'monthly' | 'fullLevel';
  monthsCount: number;
  startDate: Date;
  endDate: Date;
  amount: number;
  paymentMethod: string;
  operationNumber: string;
  bank: string;
  generateReceipt: boolean;
  ruc: string;
}

interface PaymentFormProps {
  onFormSubmit: (data: PaymentFormData) => void;
  initialData?: Partial<PaymentFormData>;
}

type PaymentMethodType = 'transferencia' | 'yape-qr' | 'tarjeta' | 'yape-izipay' | '';

const PaymentForm: React.FC<PaymentFormProps> = ({ onFormSubmit, initialData = {} }) => {
  const initialFormState = useMemo<PaymentFormData>(() => ({
    fullName: '',
    email: '',
    phone: '',
    courseLevel: 'Básico',
    courseSchedule: '',
    studentGroup: '',
    paymentType: 'monthly',
    monthsCount: 1,
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    amount: 100,
    paymentMethod: '',
    operationNumber: '',
    bank: '',
    generateReceipt: false,
    ruc: '',
  }), []);

  const [formData, setFormData] = useState<PaymentFormData>({ 
    ...initialFormState,
    ...initialData,
    paymentType: initialData.paymentType === 'fullLevel' ? 'fullLevel' : 'monthly',
    startDate: initialData.startDate || new Date(),
    endDate: initialData.startDate 
      ? addMonths(
          initialData.startDate, 
          initialData.paymentType === 'fullLevel' ? 6 : initialData.monthsCount || 1
        )
      : addMonths(new Date(), 1),
    amount: initialData.paymentType === 'fullLevel' 
      ? 100 * 6 * 0.9 
      : 100 * (initialData.monthsCount || 1)
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => {
        const newPaymentType = initialData.paymentType === 'fullLevel' ? 'fullLevel' : prev.paymentType;
        const newMonths = newPaymentType === 'fullLevel' ? 6 : initialData.monthsCount || prev.monthsCount;
        
        return {
          ...initialFormState,
          ...prev,
          ...initialData,
          paymentType: newPaymentType,
          monthsCount: newMonths,
          startDate: initialData.startDate || prev.startDate,
          endDate: addMonths(
            initialData.startDate || prev.startDate,
            newPaymentType === 'fullLevel' ? 6 : newMonths
          ),
          amount: newPaymentType === 'monthly' 
            ? 100 * newMonths 
            : 100 * 6 * 0.9
        };
      });
    }
  }, [initialData, initialFormState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (name === 'paymentType') {
        const paymentType = value as 'monthly' | 'fullLevel';
        const monthsCount = paymentType === 'fullLevel' ? 6 : prev.monthsCount;
        
        return {
          ...prev,
          paymentType,
          monthsCount,
          amount: paymentType === 'monthly' ? 100 * monthsCount : 100 * 6 * 0.9,
          endDate: addMonths(prev.startDate, monthsCount)
        };
      }
      
      if (name === 'monthsCount') {
        const monthsCount = Math.min(Math.max(parseInt(value) || 1, 1), 12);
        return {
          ...prev,
          monthsCount,
          amount: prev.paymentType === 'monthly' ? 100 * monthsCount : prev.amount,
          endDate: addMonths(prev.startDate, monthsCount)
        };
      }
      
      return { ...prev, [name]: value };
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        startDate: date,
        endDate: addMonths(date, prev.paymentType === 'monthly' ? prev.monthsCount : 6)
      }));
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethodType) => {
    setFormData(prev => ({ ...prev, paymentMethod: method }));
  };

  const renderPaymentOptions = () => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">Selecciona tu método de pago</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'transferencia' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}`}
          onClick={() => handlePaymentMethodChange('transferencia')}
        >
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
              <FaUniversity className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <h4 className="font-medium dark:text-white">Transferencia Bancaria</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transfiere desde tu app bancaria</p>
            </div>
          </div>
        </div>

        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'yape-qr' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'}`}
          onClick={() => handlePaymentMethodChange('yape-qr')}
        >
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-4">
              <FaQrcode className="text-purple-600 dark:text-purple-400 text-xl" />
            </div>
            <div>
              <h4 className="font-medium dark:text-white">Yape con QR</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Escanea el código QR con tu app</p>
            </div>
          </div>
        </div>

        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'tarjeta' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'}`}
          onClick={() => handlePaymentMethodChange('tarjeta')}
        >
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
              <FaCreditCard className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <div>
              <h4 className="font-medium dark:text-white">Tarjeta de Crédito/Débito</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Paga con Izipay de forma segura</p>
            </div>
          </div>
        </div>

        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'yape-izipay' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'}`}
          onClick={() => handlePaymentMethodChange('yape-izipay')}
        >
          <div className="flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full mr-4">
              <FaMobileAlt className="text-orange-600 dark:text-orange-400 text-xl" />
            </div>
            <div>
              <h4 className="font-medium dark:text-white">Yape via Izipay</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pago instantáneo con Yape</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentInstructions = () => {
    switch (formData.paymentMethod) {
      case 'transferencia':
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2 dark:text-white">Instrucciones para Transferencia Bancaria</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Realiza una transferencia a la cuenta: 
              <span className="font-bold"> 000-000000000000000000</span>
            </p>
            <div className="mt-3">
              <label htmlFor="operationNumber" className="block text-gray-700 dark:text-gray-300 mb-2">
                Código de Operación
              </label>
              <input
                type="text"
                id="operationNumber"
                name="operationNumber"
                value={formData.operationNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
        );

      case 'yape-qr':
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <h4 className="font-medium mb-2 dark:text-white">Instrucciones para Yape con QR</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Escanea el siguiente código QR con la app de Yape:
            </p>
            <div className="flex justify-center my-4">
              <div className="w-48 h-48 bg-white flex items-center justify-center border">
                <p className="text-center text-gray-500">Código QR de Yape</p>
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="operationNumber" className="block text-gray-700 dark:text-gray-300 mb-2">
                Número de Operación
              </label>
              <input
                type="text"
                id="operationNumber"
                name="operationNumber"
                value={formData.operationNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
          </div>
        );

      case 'tarjeta':
      case 'yape-izipay':
        return (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <IzipayPaymentPopup
  amount={Math.round(formData.amount * 100)}
  currency="PEN"
  orderId={`ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`}
  customerEmail={formData.email || ''}
  paymentMethod={formData.paymentMethod}
  onSuccess={(response) => {
    console.log('Pago exitoso:', response);
    setFormData(prev => ({
      ...prev,
      operationNumber: response.transactionId || '',
      bank: response.paymentMethod?.type || '' // Ensure bank is a string
    }));
    onFormSubmit(formData);
  }}
  onError={(error) => {
    console.error('Error en el pago:', error);
    alert(`Error en el pago: ${error.message}`);
  }}
/>

          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onFormSubmit(formData); }}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Datos Personales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
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

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Datos del Curso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="courseLevel" className="block text-gray-700 dark:text-gray-300 mb-2">Nivel</label>
            <select
              id="courseLevel"
              name="courseLevel"
              value={formData.courseLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="Básico">Básico (A1-A2)</option>
              <option value="Intermedio">Intermedio (B1-B2)</option>
              <option value="Avanzado">Avanzado (C1-C2)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="studentGroup" className="block text-gray-700 dark:text-gray-300 mb-2">Grupo de interés</label>
            <select
              id="studentGroup"
              name="studentGroup"
              value={formData.studentGroup}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Selecciona un grupo</option>
              <option value="Niños (7-12 años)">Niños (7-12 años)</option>
              <option value="Adolescentes (13-17 años)">Adolescentes (13-17 años)</option>
              <option value="Adultos (18+ años)">Adultos (18+ años)</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="courseSchedule" className="block text-gray-700 dark:text-gray-300 mb-2">Horario</label>
            <select
              id="courseSchedule"
              name="courseSchedule"
              value={formData.courseSchedule}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Seleccione un horario</option>
              {formData.studentGroup && schedules
                .filter((schedule: Schedule) => schedule.group === formData.studentGroup)
                .flatMap((schedule: Schedule) => 
                  schedule.times.map((time: string, index: number) => (
                    <option key={`${schedule.group}-${index}`} value={`${schedule.group} - ${time}`}>
                      {time}
                    </option>
                  ))
                )}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Datos del Pago</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="paymentType" className="block text-gray-700 dark:text-gray-300 mb-2">Tipo de Pago</label>
            <select
              id="paymentType"
              name="paymentType"
              value={formData.paymentType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="monthly">Mensual</option>
              <option value="fullLevel">Nivel Completo (6 meses con 10% descuento)</option>
            </select>
          </div>

          {formData.paymentType === 'monthly' && (
            <>
              <div>
                <label htmlFor="monthsCount" className="block text-gray-700 dark:text-gray-300 mb-2">Cantidad de Meses</label>
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
                <label htmlFor="startDate" className="block text-gray-700 dark:text-gray-300 mb-2">Mes de inicio</label>
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
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Período de pago</label>
                <div className="text-gray-700 dark:text-gray-300 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p>Desde: <strong>{format(formData.startDate, 'MMMM yyyy', { locale: es })}</strong></p>
                  <p>Hasta: <strong>{format(formData.endDate, 'MMMM yyyy', { locale: es })}</strong></p>
                </div>
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <p className="text-lg font-semibold dark:text-white">
              Monto a pagar: S/. {formData.amount.toFixed(2)}
            </p>
            {formData.paymentType === 'fullLevel' && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Incluye descuento del 10% por pago de nivel completo
              </p>
            )}
          </div>

          {renderPaymentOptions()}
          {renderPaymentInstructions()}

          <div className="md:col-span-2 mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="generateReceipt"
                name="generateReceipt"
                checked={formData.generateReceipt}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    generateReceipt: e.target.checked,
                    ruc: e.target.checked ? prev.ruc : ''
                  }));
                }}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="generateReceipt" className="ml-2 text-gray-700 dark:text-gray-300">
                Deseo que se genere un recibo por honorarios
              </label>
            </div>

            {formData.generateReceipt && (
              <div className="mt-4">
                <label htmlFor="ruc" className="block text-gray-700 dark:text-gray-300 mb-2">Ingrese su RUC para emitir el recibo</label>
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

      {formData.paymentMethod !== 'tarjeta' && formData.paymentMethod !== 'yape-izipay' && (
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            Enviar y generar comprobante
          </button>
        </div>
      )}
    </form>
  );
};

export default PaymentForm;