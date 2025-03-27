import React, { useState } from 'react';
import { MapIcon as WhatsappIcon } from 'lucide-react';
import { Agent, agents } from '../types';
import { sendContactFormData } from '../services/makeService';

interface ContactSectionProps {
  onNameChange?: (name: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ onNameChange }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Enviar los datos al webhook de Make.com
      await sendContactFormData({
        name,
        phone,
        selectedGroup,
        selectedAgent
      });
      console.log('Datos de contacto enviados correctamente a Make.com');
    } catch (error) {
      console.error('Error al enviar datos de contacto a Make.com:', error);
      // Continuamos con el flujo normal incluso si hay error
    }
    
    // Redirigir a WhatsApp como estaba originalmente
    const whatsappMessage = encodeURIComponent(
      `Hola ${selectedAgent.name}, me interesa tomar clases de inglés. Mi nombre es ${name} y me gustaría más información sobre el grupo de ${selectedGroup}.`
    );
    window.open(`https://wa.me/${selectedAgent.phone}?text=${whatsappMessage}`, '_blank');
  };

  return (
    <section id="contacto" className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Contáctanos</h2>
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (onNameChange) {
                    onNameChange(e.target.value);
                  }
                }}
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
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Grupo de interés</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                <option value="">Selecciona un grupo</option>
                <option value="niños">Niños (7-12 años)</option>
                <option value="adolescentes">Adolescentes (13-17 años)</option>
                <option value="adultos">Adultos (18+ años)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Consultar con</label>
              <select
                value={selectedAgent.phone}
                onChange={(e) => setSelectedAgent(agents.find(agent => agent.phone === e.target.value) || agents[0])}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                {agents.map((agent, index) => (
                  <option key={index} value={agent.phone}>{agent.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg flex items-center justify-center hover:bg-green-600"
            >
              <WhatsappIcon className="mr-2" />
              Contactar por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;