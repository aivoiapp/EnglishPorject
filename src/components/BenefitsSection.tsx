import { Globe, Award, TrendingUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { t } from 'i18next';

const BenefitsSection = () => {
  const { ref } = useInView({
    threshold: 0.3, // El video comenzará cuando el 30% del componente sea visible
    triggerOnce: false // Permitir que se active cada vez que entre en la vista
  });
  // Eliminado: const { language } = useLanguage();
  return (
    <section id="beneficios" className="py-16 bg-gradient-to-b from-[#e5e5d8] to-[#d8d8c8] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda - Texto e iconos */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-blue-800 dark:text-blue-400">
                {t('benefitsSection.title')}
              </h2>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-500 p-2 rounded-full">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{t('benefitsSection.globalOpportunitiesTitle')}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('benefitsSection.globalOpportunitiesDescription')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-pink-500 p-2 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{t('benefitsSection.betterSalariesTitle')}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('benefitsSection.betterSalariesDescription')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-pink-500 p-2 rounded-full">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{t('benefitsSection.professionalDevelopmentTitle')}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('benefitsSection.professionalDevelopmentDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Imagen (reemplazando video) */}
          <div ref={ref} className="hidden md:block relative rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <img 
              src="/images/imagen01.jpg" 
              alt="Beneficios de aprender inglés" 
              className="w-full h-full object-cover"
            />
            
            {/* Código del video comentado para mantener la funcionalidad intacta para futuras referencias
            {!inView && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">{t('benefitsSection.scrollToViewVideo')}</p>
              </div>
            )}
            
            <ReactPlayer
              url="https://www.youtube.com/watch?v=2q1AcNNYHkE"
              playing={inView}
              muted={true}
              controls={true}
              width="100%"
              height="100%"
              config={{
                playerVars: {
                  autoplay: 1,
                  modestbranding: 1,
                  rel: 0
                }
              }}
              onReady={() => console.log('Video listo para reproducirse')}
              onError={(e) => console.error('Error al cargar el video:', e)}
            />
            */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;