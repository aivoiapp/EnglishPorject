import { Clock, Users, Calendar } from 'lucide-react';
import { schedules, Schedule } from '../types';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/useLanguage';


const ScheduleSection = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  return (
  <section id="horarios" className="py-16 bg-gradient-to-b from-[#e5e5d8] to-[#d8d8c8] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center dark:text-white">
        <Clock className="mr-2" />
        {t('scheduleSection.title')}
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {schedules[language as keyof typeof schedules].map((schedule: Schedule, index: number) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
              <Users className="mr-2" />
              {t('scheduleSection.group')} {schedule.group}
            </h3>
            <ul className="space-y-2">
              {schedule.times.map((time, timeIndex) => (
                <li key={timeIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  {time}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default ScheduleSection;