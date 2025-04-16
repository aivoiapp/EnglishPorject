import { Award, Star, GraduationCap, BookOpen } from 'lucide-react';
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

const ProfessorsSection = () => {
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
    <section id="profesores" className="py-16 bg-gradient-to-b from-[#e5e5d8] to-[#d8d8c8] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          {t('professorsSection.title')}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Foto y datos básicos */}
          <div className="bg-[#f0f0e8] dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-pink-500 p-6 flex items-center justify-center">
              <img 
                src={cyril.photo} 
                alt={`Foto de ${cyril.name}`} 
                className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{cyril.name}</h3>
              <p className="text-pink-500 font-semibold mb-4">{cyril.title}</p>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center justify-center mb-3">
                    <Award className="w-5 h-5 mr-2" /> {t('professorsSection.labels.certifications')}
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {Array.isArray(cyril.certifications) && cyril.certifications.map((cert: string, index: number) => (
                      <span key={index} className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 text-xs px-3 py-1 rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center justify-center mb-3">
                    <Star className="w-5 h-5 mr-2" /> {t('professorsSection.labels.specialties')}
                  </h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {Array.isArray(cyril.specialties) && cyril.specialties.map((specialty: string, index: number) => (
                      <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-3 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Columna central - Experiencia y metodología */}
          <div className="bg-[#f0f0e8] dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 flex flex-col border border-gray-200">
            <div className="mb-6 flex items-center">
              <GraduationCap className="w-8 h-8 text-pink-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('professorsSection.labels.experience')}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">{cyril.experience}</p>
            
            <div className="mt-auto">
              <div className="mb-4 flex items-center">
                <BookOpen className="w-8 h-8 text-pink-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t('professorsSection.labels.methodology')}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{cyril.methodology}</p>
            </div>
          </div>
          
          {/* Columna derecha - Visión y sobre la academia */}
          <div className="bg-[#f0f0e8] dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 flex flex-col border border-gray-200">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <Star className="w-6 h-6 text-pink-500 mr-2" />
                {t('professorsSection.labels.vision')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-8">{cyril.vision}</p>
            </div>
            
            <div className="mt-auto">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('professorsSection.aboutCyTalk.title')}</h3>
              <p className="text-pink-500 font-semibold mb-4">{t('professorsSection.aboutCyTalk.subtitle')}</p>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>{t('professorsSection.aboutCyTalk.description')}</p>
                <p className="font-medium italic">{t('professorsSection.aboutCyTalk.conclusion')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessorsSection;