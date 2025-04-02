import React from 'react';
import { Schedule, schedules } from '../../types';
import { usePaymentContext } from './paymentTypes';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/useLanguage';

const PaymentCourseInfo: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { formData, handleInputChange } = usePaymentContext();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">{t('payment.courseInfo.title', 'Datos del Curso')}</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="courseLevel" className="block text-gray-700 dark:text-gray-300 mb-2">{t('payment.courseInfo.level', 'Nivel')}</label>
            <select
              id="courseLevel"
              name="courseLevel"
              value={formData.courseLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="Principiantes">{t('payment.courseInfo.beginners', 'Principiantes (A0-A1-A2)')}</option>
              <option value="Intermedios">{t('payment.courseInfo.intermediate', 'Intermedios (B1-B2)')}</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="studentGroup" className="block text-gray-700 dark:text-gray-300 mb-2">{t('payment.courseInfo.group', 'Grupo de interés')}</label>
            <select
              id="studentGroup"
              name="studentGroup"
              value={formData.studentGroup}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            >
              <option value="">{t('payment.courseInfo.selectGroup', 'Selecciona un grupo')}</option>
              <option value="Niños (8-12 años)">{t('payment.courseInfo.children', 'Niños (8-12 años)')}</option>
              <option value="Adolescentes (13-17 años)">{t('payment.courseInfo.teenagers', 'Adolescentes (13-17 años)')}</option>
              <option value="Adultos (18+ años)">{t('payment.courseInfo.adults', 'Adultos (18+ años)')}</option>
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="courseSchedule" className="block text-gray-700 dark:text-gray-300 mb-2">{t('payment.courseInfo.schedule', 'Horario')}</label>
          <select
            id="courseSchedule"
            name="courseSchedule"
            value={formData.courseSchedule}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          >
            <option value="">{t('payment.courseInfo.selectSchedule', 'Seleccione un horario')}</option>
            {formData.studentGroup && schedules[language as keyof typeof schedules]
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