import React, { useState, useEffect } from 'react';
import { Schedule, schedules } from '../../types';
import DatePicker from 'react-datepicker';
import { format, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import CustomPhoneInput from '../CustomPhoneInput';
import '../../phone-input.css';

export interface PaymentFormData {
  // Datos personales
  fullName: string;
  email: string;
  phone: string;
  
  // Datos del curso
  courseLevel: string;
  courseSchedule: string;
  studentGroup: string; // Nuevo campo para el grupo de interés
  
  // Datos del pago
  paymentType: 'monthly' | 'fullLevel';
  monthsCount: number;
  startDate: Date; // Fecha de inicio del pago
  endDate: Date; // Fecha de fin del pago
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

const PaymentForm: React.FC<PaymentFormProps> = ({ onFormSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    courseLevel: initialData.courseLevel || 'Básico',
    courseSchedule: initialData.courseSchedule || '',
    studentGroup: initialData.studentGroup || '',
    paymentType: initialData.paymentType || 'monthly',
    monthsCount: initialData.monthsCount || 1,
    startDate: initialData.startDate || new Date(),
    endDate: initialData.endDate || addMonths(new Date(), 1),
    amount: initialData.amount || 100, // Monto por defecto para un mes
    paymentMethod: initialData.paymentMethod || '',
    operationNumber: initialData.operationNumber || '',
    bank: initialData.bank || '',
    generateReceipt: initialData.generateReceipt || false,
    ruc: initialData.ruc || '',
  });
  
  // Actualizar el formulario cuando cambien los datos iniciales
  useEffect(() => {
    console.log('PaymentForm initialData changed:', initialData);
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        fullName: initialData.fullName || prev.fullName,
        email: initialData.email || prev.email,
        phone: initialData.phone || prev.phone,
        courseLevel: initialData.courseLevel || prev.courseLevel,
        studentGroup: initialData.studentGroup || prev.studentGroup,
        courseSchedule: initialData.courseSchedule || prev.courseSchedule,
        paymentType: initialData.paymentType || prev.paymentType,
        monthsCount: initialData.monthsCount || prev.monthsCount,
        startDate: initialData.startDate || prev.startDate,
        endDate: initialData.endDate || prev.endDate,
        amount: initialData.amount || prev.amount,
        paymentMethod: initialData.paymentMethod || prev.paymentMethod,
        operationNumber: initialData.operationNumber || prev.operationNumber,
        bank: initialData.bank || prev.bank,
        generateReceipt: initialData.generateReceipt || prev.generateReceipt,
        ruc: initialData.ruc || prev.ruc
      }));
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: value };
      
      // Actualizar el monto basado en el tipo de pago y cantidad de meses
      if (name === 'paymentType' || name === 'monthsCount') {
        const monthsCount = name === 'monthsCount' ? parseInt(value) : prev.monthsCount;
        const paymentType = name === 'paymentType' ? value as 'monthly' | 'fullLevel' : prev.paymentType;
        
        // Calcular el monto
        if (paymentType === 'monthly') {
          updatedData.amount = 100 * monthsCount;
          // Actualizar la fecha de fin basada en la fecha de inicio y la cantidad de meses
          updatedData.endDate = addMonths(prev.startDate, monthsCount);
        } else {
          // Descuento del 10% para pago de nivel completo (6 meses)
          updatedData.amount = 100 * 6 * 0.9;
          updatedData.monthsCount = 6;
          // Actualizar la fecha de fin para nivel completo (6 meses)
          updatedData.endDate = addMonths(prev.startDate, 6);
        }
      }
      
      return updatedData;
    });
  };
  // Manejar cambios en la fecha de inicio
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => {
        const monthsCount = prev.paymentType === 'monthly' ? prev.monthsCount : 6;
        return {
          ...prev,
          startDate: date,
          endDate: addMonths(date, monthsCount)
        };
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData); // Add this line for debugging
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
                .map((schedule: Schedule) => (
                  schedule.times.map((time: string, index: number) => (
                    <option key={`${schedule.group}-${index}`} value={`${schedule.group} - ${time}`}>
                      {time}
                    </option>
                  ))
              ))}
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

          <div className="md:col-span-2 mt-4">
            <label htmlFor="paymentMethod" className="block text-gray-700 dark:text-gray-300 mb-2">Método de Pago</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">Selecciona tu método de pago</option>
              <option value="yape">Yape</option>
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="ligo">Tarjeta de Crédito/Débito (Ligo)</option>
            </select>
          </div>

          {formData.paymentMethod === 'yape' && (
            <div className="md:col-span-2 mt-2">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Realiza el pago vía Yape al número <span className="font-bold">926328988</span> a nombre de <span className="font-bold">Cyril Y. Ordoñez M.</span>
                </p>
              </div>
              <div>
                <label htmlFor="operationNumber" className="block text-gray-700 dark:text-gray-300 mb-2">Número de Operación</label>
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
          )}

          {formData.paymentMethod === 'transferencia' && (
            <div className="md:col-span-2 mt-2">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Realiza una transferencia a la cuenta: <span className="font-bold">000-000000000000000000</span> (cuenta referencial).
                </p>
              </div>
              <div>
                <label htmlFor="operationNumber" className="block text-gray-700 dark:text-gray-300 mb-2">Código de Operación</label>
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
          )}

          {formData.paymentMethod === 'ligo' && (
            <div className="md:col-span-2 mt-2">
              <div>
                <label htmlFor="bank" className="block text-gray-700 dark:text-gray-300 mb-2">Selecciona tu Banco</label>
                <select
                  id="bank"
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Selecciona un banco</option>
                  <option value="BCP">BCP</option>
                  <option value="BBVA">BBVA</option>
                  <option value="Interbank">Interbank</option>
                  <option value="Scotiabank">Scotiabank</option>
                </select>
              </div>

              {formData.bank && (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg my-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {formData.bank === 'BCP' && 'Instrucciones para pago con BCP: Ingresa a tu app BCP, selecciona "Pagar servicios" > "Empresas diversas" > "Ligo" y completa el pago.'}
                    {formData.bank === 'BBVA' && 'Instrucciones para pago con BBVA: Ingresa a tu app BBVA, selecciona "Pagos" > "Servicios" > "Ligo" y completa el pago.'}
                    {formData.bank === 'Interbank' && 'Instrucciones para pago con Interbank: Ingresa a tu app Interbank, selecciona "Pagar" > "Servicios" > "Ligo" y completa el pago.'}
                    {formData.bank === 'Scotiabank' && 'Instrucciones para pago con Scotiabank: Ingresa a tu app Scotiabank, selecciona "Pagos" > "Servicios" > "Ligo" y completa el pago.'}
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="operationNumber" className="block text-gray-700 dark:text-gray-300 mb-2">Número de Operación</label>
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
          )}

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

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-6 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          Enviar y generar comprobante
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;