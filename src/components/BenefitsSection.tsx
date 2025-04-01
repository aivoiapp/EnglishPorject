import { Globe, Award, TrendingUp } from 'lucide-react';
import ReactPlayer from 'react-player/youtube';
import { useInView } from 'react-intersection-observer';

const BenefitsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3, // El video comenzará cuando el 30% del componente sea visible
    triggerOnce: false // Permitir que se active cada vez que entre en la vista
  });
  return (
    <section id="beneficios" className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda - Texto e iconos */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-blue-800 dark:text-blue-400">
                El inglés: la llave <br />
                para el éxito profesional
              </h2>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-500 p-2 rounded-full">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Acceso a oportunidades globales</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    El dominio del inglés te permite acceder a oportunidades laborales 
                    en empresas internacionales, sin importar tu profesión. Es el idioma 
                    universal de los negocios y la tecnología en todo el mundo.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-pink-500 p-2 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Mejores salarios y ascensos</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Los profesionales que dominan el inglés ganan en promedio un 30% más 
                    que sus colegas con el mismo nivel de experiencia. Es una habilidad 
                    que te diferencia y te posiciona para roles de mayor responsabilidad.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-pink-500 p-2 rounded-full">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Desarrollo profesional sin fronteras</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Con el inglés puedes acceder a formación internacional, certificaciones 
                    reconocidas globalmente y trabajar remotamente para empresas de cualquier 
                    parte del mundo, sin importar tu campo profesional.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Video */}
          <div ref={ref} className="hidden md:block relative rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            {/* Overlay para cuando el video no está en vista */}
            {!inView && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Desplázate para ver el video</p>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;