import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Agent, agents } from '../types';
import { sendContactFormData } from '../services/makeService';
import CustomPhoneInput from './CustomPhoneInput';
import '../phone-input.css';

interface FloatingContactButtonProps {
  onNameChange?: (name: string) => void;
}

const FloatingContactButton: React.FC<FloatingContactButtonProps> = ({ onNameChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

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
    
    // Cerrar el modal después de enviar
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 px-4 rounded-lg shadow-lg hover:bg-orange-600 transition-all duration-300"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Contáctanos</span>
      </button>

      {/* Modal de contacto */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 relative overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center">
                <MessageCircle className="w-6 h-6 text-orange-500 mr-2" />
                <h3 className="text-xl font-semibold dark:text-white">Contáctanos</h3>
              </div>
              <button 
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
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
                  <CustomPhoneInput
                    label="WhatsApp"
                    defaultCountry="PE"
                    value={phone}
                    onChange={(value) => setPhone(value || '')}
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
                    <option value="niños">Niños (8-12 años)</option>
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
                  <MessageCircle className="mr-2" />
                  Contactar por WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingContactButton;