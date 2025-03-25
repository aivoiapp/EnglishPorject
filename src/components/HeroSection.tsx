import React, { useState } from 'react';
import { Sparkles, CheckCircle2, BookOpen, Clock, Award } from 'lucide-react';
import { Agent, agents } from '../types';

const HeroSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `Hola ${selectedAgent.name}, me interesa tomar clases de inglés. Mi nombre es ${name} y me gustaría más información sobre el grupo de ${selectedGroup}.`
    );
    window.open(`https://wa.me/${selectedAgent.phone}?text=${whatsappMessage}`, '_blank');
  };

  return (
    <section id="hero" className="py-12 md:py-20 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
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
          <div className="bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-800">Inscríbete al curso</h2>
              <p className="text-gray-600">Inicio: 01 de Mayo | Cupos: limitados</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Grupo de interés</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un grupo</option>
                  <option value="niños">Niños (7-12 años)</option>
                  <option value="adolescentes">Adolescentes (13-17 años)</option>
                  <option value="adultos">Adultos (18+ años)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Consultar con</label>
                <select
                  value={selectedAgent.phone}
                  onChange={(e) => setSelectedAgent(agents.find(agent => agent.phone === e.target.value) || agents[0])}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {agents.map((agent, index) => (
                    <option key={index} value={agent.phone}>{agent.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mt-6"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                ¡Reserva tu plaza ahora!
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;