import { Award, Star } from 'lucide-react';

const CyrilProfile = () => {
  const cyril = {
    name: 'Cyril O.',
    title: 'Tutora certificada por Cambridge',
    photo: '/images/cyril.jpg',
    certifications: ['CAE (Certificate in Advanced English)', 'CELTA (Certificate in Teaching English to Speakers of Other Languages)'],
    experience: 'Con 9 años de experiencia enseñando inglés como lengua extranjera. Sus clases son dinámicas, con materiales relevantes y un ambiente ameno. Utiliza un método comunicativo y herramientas digitales interactivas, con planes de aprendizaje personalizados según intereses y objetivos del estudiante. Habla Español (nativo), Inglés (C1), Francés (B1) e Italiano (A1).',
    specialties: ['Inglés General', 'Inglés Académico', 'Conversación', 'Preparación para Exámenes'],
    vision: 'Como la imagen de cytalk.online, mi misión es inspirar y guiar a estudiantes de todo el mundo a alcanzar sus metas lingüísticas con confianza y éxito.',
    methodology: 'Mi enfoque se centra en la comunicación efectiva, utilizando métodos interactivos y personalizados para cada estudiante. Creo en el aprendizaje a través de la práctica constante y el uso de recursos digitales innovadores.'
  };

  return (
    <section id="cytalk-brand" className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">
          Expertos que te ayudan a hablar inglés con confianza
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
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Visión</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{cyril.vision}</p>
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Metodología</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{cyril.methodology}</p>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center mb-2">
                <Award className="w-5 h-5 mr-2" /> Certificaciones
              </h4>
              <div className="flex flex-wrap gap-2">
                {cyril.certifications.map((cert, index) => (
                  <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center mb-2">
                <Star className="w-5 h-5 mr-2" /> Especialidades
              </h4>
              <div className="flex flex-wrap gap-2">
                {cyril.specialties.map((specialty, index) => (
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