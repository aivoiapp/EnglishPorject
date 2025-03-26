import React, { useState } from 'react';
import { Schedule, schedules } from '../../types';

export interface PaymentFormData {
  // Datos personales
  firstName: string;
  lastName: string;
  documentType: 'dni' | 'ce';
  documentNumber: string;
  email: string;
  phone: string;
  
  // Datos del curso
  courseLevel: string;
  courseSchedule: string;
  studentGroup: string; // Nuevo campo para el grupo de interés
  
  // Datos del pago
  paymentType: 'monthly' | 'fullLevel';
  monthsCount: number;
  amount: number;
}

interface PaymentFormProps {
  onFormSubmit: (data: PaymentFormData) => void;
  initialData?: Partial<PaymentFormData>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onFormSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    documentType: initialData.documentType || 'dni',
    documentNumber: initialData.documentNumber || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    courseLevel: initialData.courseLevel || 'Básico',
    courseSchedule: initialData.courseSchedule || '',
    studentGroup: initialData.studentGroup || '',
    paymentType: initialData.paymentType || 'monthly',
    monthsCount: initialData.monthsCount || 1,
    amount: initialData.amount || 100, // Monto por defecto para un mes
  });

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
        } else {
          // Descuento del 10% para pago de nivel completo (6 meses)
          updatedData.amount = 100 * 6 * 0.9;
          updatedData.monthsCount = 6;
        }
      }
      
      return updatedData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">Datos Personales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 mb-2">Nombres</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="documentType" className="block text-gray-700 dark:text-gray-300 mb-2">Tipo de Documento</label>
            <select
              id="documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="dni">DNI</option>
              <option value="ce">Carnet de Extranjería</option>
            </select>
          </div>
          <div>
            <label htmlFor="documentNumber" className="block text-gray-700 dark:text-gray-300 mb-2">Número de Documento</label>
            <input
              type="text"
              id="documentNumber"
              name="documentNumber"
              value={formData.documentNumber}
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
            <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
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
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-6 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          Continuar con el Pago
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;