import React from 'react';
import { Schedule, schedules } from '../../types';
import { usePaymentContext } from './paymentTypes';

const PaymentCourseInfo: React.FC = () => {
  const { formData, handleInputChange } = usePaymentContext();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">Datos del Curso</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
        
        <div>
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
  );
};

export default PaymentCourseInfo;