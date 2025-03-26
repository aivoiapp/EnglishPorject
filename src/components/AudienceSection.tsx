import { Users, Palette, Briefcase } from 'lucide-react';

const AudienceSection = () => {
  return (
    <section id="audiencia" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
          ¿A quién va dirigido este curso?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Tarjeta 1: Principiantes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-pink-500 p-3 rounded-full mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
                Principiantes en inglés
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Personas sin experiencia previa, interesadas en aprender inglés desde cero. 
              Ideal para quienes buscan desarrollar una base sólida en el idioma y 
              quieren evolucionar profesionalmente.
            </p>
          </div>

          {/* Tarjeta 2: Profesionales */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-pink-500 p-3 rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
                Profesionales y Creativos
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Para profesionales con experiencia, que buscan renovar sus conocimientos, 
              cambiar de área o crecer en la misma empresa. Aprenderás en profundidad 
              las variantes del inglés y estarás preparado para colaborar en equipos 
              de trabajo internacionales.
            </p>
          </div>

          {/* Tarjeta 3: Emprendedores */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition duration-300">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-pink-500 p-3 rounded-full mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
                Emprendedores y Microempresarios
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Empresarios con intención de crear productos exitosos para potenciar su marca. 
              Dominarás las habilidades para ofrecer las mejores experiencias centradas en el usuario. 
              Conseguirás ser un líder en la coordinación de proyectos internacionales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;