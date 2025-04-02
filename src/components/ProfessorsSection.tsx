import { Award, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Professor {
  name: string;
  title: string;
  photo: string;
  certifications: string[];
  experience: string;
  specialties: string[];
  vision: string;
  methodology: string;
}

const CyrilProfile = () => {
  const { t } = useTranslation();
  const cyril: Professor = {
    name: t('professorsSection.cyril.name'),
    title: t('professorsSection.cyril.title'),
    photo: '/images/cyril.jpg',
    certifications: t('professorsSection.cyril.certifications', { returnObjects: true }) as string[],
    experience: t('professorsSection.cyril.experience'),
    specialties: t('professorsSection.cyril.specialties', { returnObjects: true }) as string[],
    vision: t('professorsSection.cyril.vision'),
    methodology: t('professorsSection.cyril.methodology')
  };

  return (
    <section id="cytalk-brand" className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">
          {t('professorsSection.title')}
        </h2>
        <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="md:w-1/3 flex items-center justify-center p-8 bg-pink-500">
            <img 
              src={cyril.photo} 
              alt={`Foto de ${cyril.name}`} 
              className="w-48 h-48 rounded-full object-cover shadow-md"
            />
          </div>
          <div className="md:w-2/3 p-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{cyril.name}</h3>
            <p className="text-pink-500 font-semibold mb-6">{cyril.title}</p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{cyril.experience}</p>
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{t('professorsSection.labels.vision')}</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{cyril.vision}</p>
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{t('professorsSection.labels.methodology')}</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{cyril.methodology}</p>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center mb-2">
                <Award className="w-5 h-5 mr-2" /> {t('professorsSection.labels.certifications')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(cyril.certifications) && cyril.certifications.map((cert: string, index: number) => (
                  <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center mb-2">
                <Star className="w-5 h-5 mr-2" /> {t('professorsSection.labels.specialties')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(cyril.specialties) && cyril.specialties.map((specialty: string, index: number) => (
                  <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CyrilProfile;