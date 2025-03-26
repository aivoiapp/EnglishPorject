import { BookOpen, Users, Layout, Volume2, Lightbulb, Headphones, MessageCircle, Users2 } from 'lucide-react';

const CurriculumSection = () => {
  return (
    <section id="curriculum" className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-800 dark:text-blue-400">
          ¿Qué aprenderás?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" /> {/* Grammar icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Mejora tu gramática</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Domina las reglas gramaticales del inglés para comunicarte con precisión y claridad en cualquier situación.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Users className="w-6 h-6 text-white" /> {/* Vocabulary icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Ampliar tu vocabulario</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Aprende nuevas palabras y expresiones para enriquecer tu comunicación y comprensión del inglés.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Layout className="w-6 h-6 text-white" /> {/* Reading icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Desarrollar habilidades de lectura</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Mejora tu capacidad para leer y comprender textos en inglés, desde artículos hasta literatura.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Volume2 className="w-6 h-6 text-white" /> {/* Pronunciation icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Practicar la pronunciación</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Perfecciona tu pronunciación para hablar inglés con confianza y ser entendido por hablantes nativos.
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Headphones className="w-6 h-6 text-white" /> {/* Listening icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Mejorar la comprensión auditiva</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Desarrolla la habilidad de entender el inglés hablado en diferentes acentos y contextos.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" /> {/* Conversation icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Participar en conversaciones</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Aprende a participar activamente en conversaciones en inglés, mejorando tu fluidez y confianza.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Users2 className="w-6 h-6 text-white" /> {/* Exam preparation icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Preparación para exámenes</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Prepárate para exámenes de inglés reconocidos internacionalmente, como TOEFL y IELTS.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" /> {/* Culture and context icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Cultura y contexto</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Aprende sobre la cultura y el contexto de los países de habla inglesa para una comunicación más efectiva.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Certificación Internacional</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Aquellos estudiantes que completen exitosamente un nivel estarán preparados para presentar 
              las pruebas oficiales de Cambridge de reconocimiento internacional, abriendo puertas 
              a oportunidades académicas y profesionales en todo el mundo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;