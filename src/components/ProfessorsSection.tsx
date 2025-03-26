import { GraduationCap, Award, Star } from 'lucide-react';

// Datos de las profesoras
const professors = [
  {
    id: 1,
    name: 'Cyril Ordoñez',
    title: 'Especialista en Inglés Académico',
    photo: '/images/professor-placeholder-1.svg', // Placeholder hasta tener fotos reales
    certifications: ['TEFL Certificada', 'Máster en Educación'],
    experience: 'Con más de 8 años de experiencia enseñando inglés en entornos académicos y empresariales. Especializada en preparación para exámenes internacionales como TOEFL y Cambridge. Su enfoque comunicativo y dinámico hace que sus clases sean altamente efectivas y entretenidas.',
    specialties: ['Inglés Académico', 'Preparación para Exámenes', 'Business English']
  },
  {
    id: 2,
    name: 'Maricielo Caceres',
    title: 'Experta en Conversación y Pronunciación',
    photo: '/images/professor-placeholder-2.svg', // Placeholder hasta tener fotos reales
    certifications: ['CELTA Certificada', 'Especialista en Fonética Inglesa'],
    experience: 'Profesora apasionada con 6 años de experiencia en la enseñanza del inglés con enfoque conversacional. Ha vivido en Estados Unidos y Reino Unido, lo que le ha permitido dominar diferentes acentos y expresiones coloquiales. Su metodología se centra en la práctica constante y la corrección fonética personalizada.',
    specialties: ['Conversación Avanzada', 'Pronunciación', 'Inglés Cotidiano']
  }
];

const ProfessorsSection = () => {
  return (
    <section id="profesores" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">
          Nuestro Equipo Docente
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
          Contamos con profesionales altamente calificados y apasionados por la enseñanza del inglés,
          comprometidos con tu aprendizaje y desarrollo personal.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {professors.map((professor) => (
            <div key={professor.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Área de foto */}
                <div className="md:w-1/3 bg-pink-500 flex items-center justify-center p-6">
                  <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                    <GraduationCap className="w-16 h-16 text-pink-500" />
                  </div>
                </div>
                
                {/* Área de información */}
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {professor.name}
                  </h3>
                  <p className="text-pink-500 font-semibold mb-4">{professor.title}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center mb-2">
                      <Award className="w-4 h-4 mr-2" /> Certificaciones
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {professor.certifications.map((cert, index) => (
                        <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {professor.experience}
                  </p>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center mb-2">
                      <Star className="w-4 h-4 mr-2" /> Especialidades
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {professor.specialties.map((specialty, index) => (
                        <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessorsSection;