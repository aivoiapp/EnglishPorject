import React, { useState } from 'react';
import { Sparkles, CheckCircle2, BookOpen, Clock, Award } from 'lucide-react';
import { sendHeroFormData } from '../services/makeService';


interface HeroSectionProps {
  onFormSubmit: (name: string, email: string, phone: string, documentType: string, documentNumber: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onFormSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [documentType, setDocumentType] = useState('dni');
  const [documentNumber, setDocumentNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando datos del formulario:', { name, email, phone, documentType, documentNumber });
    
    try {
      await sendHeroFormData({
        name,
        email,
        phone,
        documentType,
        documentNumber
      });
      console.log('Datos enviados correctamente a Make.com');
      
      onFormSubmit(name, email, phone, documentType, documentNumber);
    } catch (error) {
      console.error('Error al enviar datos a Make.com:', error);
      onFormSubmit(name, email, phone, documentType, documentNumber);
    }
  };

  return (
    <section id="hero" className="py-12 md:py-20 bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-900 dark:to-blue-950 text-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda - Contenido */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Domina el inglés para <span className="text-yellow-400">tu crecimiento personal y profesional</span>
              </h1>
              <p className="text-xl md:text-2xl mb-6">
                Aprende con profesores calificados y con metodología internacionales
              </p>
              <div className="inline-block bg-yellow-400 text-blue-900 px-6 py-2 rounded-full text-lg font-bold animate-bounce mb-6">
                50% de Descuento - Hasta el 24 de marzo
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">¿Por qué elegirnos?</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                  <span>Clases virtuales en vivo con profesores expertos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                  <span>2 sesiones semanales de 60 minutos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                  <span>Aprendizaje centrado en el estudiante</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                  <span>Clases participativas y dinámicas</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 text-yellow-400 mr-2" />
                <span>Todos los niveles</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-yellow-400 mr-2" />
                <span>6 meses por nivel</span>
              </div>
              <div className="flex items-center">
                <Award className="w-6 h-6 text-yellow-400 mr-2" />
                <span>Enfoque alineado y diseñado a certificaciones internacionales</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-4xl font-bold line-through text-gray-400">S/. 200</span>
                <span className="text-5xl font-bold text-yellow-400">S/. 100</span>
                <span className="text-gray-300">/mes</span>
              </div>
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                ¡OFERTA LIMITADA!
              </div>
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl shadow-2xl overflow-hidden p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">Inscríbete al curso</h2>
              <p className="text-gray-600 dark:text-gray-400">Inicio: 01 de Mayo | Cupos: limitados</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Tipo de Documento</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="dni">DNI</option>
                  <option value="ce">Carnet de Extranjería</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Número de Documento</label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mt-6"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                ¡Continuar al pago!
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;