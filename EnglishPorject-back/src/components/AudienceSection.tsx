import { Users, Palette, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AudienceSection = () => {
  const { t } = useTranslation();

  return (
    <section id="audiencia" className="py-16 bg-gradient-to-b from-[#5B0E88] to-[#C5156E] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-white dark:text-white">
          {t('audienceSection.title')}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Tarjeta 1: Principiantes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-pink-500 p-3 rounded-full mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
                {t('audienceSection.beginners.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {t('audienceSection.beginners.description')}
            </p>
          </div>

          {/* Tarjeta 2: Profesionales */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-pink-500 p-3 rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
                {t('audienceSection.professionals.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {t('audienceSection.professionals.description')}
            </p>
          </div>

          {/* Tarjeta 3: Emprendedores */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-pink-500 p-3 rounded-full mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
                {t('audienceSection.entrepreneurs.title')}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              {t('audienceSection.entrepreneurs.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
