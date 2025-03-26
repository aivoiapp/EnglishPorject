import { Clock, Users, Calendar } from 'lucide-react';
import { schedules } from '../types';


const ScheduleSection = () => (
  <section id="horarios" className="py-16 bg-white dark:bg-gray-800">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center dark:text-white">
        <Clock className="mr-2" />
        Horarios Disponibles
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {schedules.map((schedule, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold mb-4 flex items-center dark:text-white">
              <Users className="mr-2" />
              {schedule.group}
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

export default ScheduleSection;