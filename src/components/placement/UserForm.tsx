import { useState } from 'react';
import { Info } from 'lucide-react';

interface UserFormProps {
  onSubmit: (userData: UserData) => void;
  isLoading: boolean;
}

export interface UserData {
  age: string;
  selfAssessedLevel: string;
  learningGoals: string;
  name: string;
  email: string;
}

const UserForm = ({ onSubmit, isLoading }: UserFormProps) => {
  const [userData, setUserData] = useState<UserData>({
    age: '',
    selfAssessedLevel: 'beginner',
    learningGoals: '',
    name: '',
    email: ''
  });

  const handleSubmit = () => {
    if (!userData.age) return;
    onSubmit(userData);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Información Personal</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Nombre (opcional)</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData(prev => ({...prev, name: e.target.value}))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email (opcional)</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({...prev, email: e.target.value}))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Edad <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={userData.age}
              onChange={(e) => setUserData(prev => ({...prev, age: e.target.value}))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Nivel de inglés actual</label>
            <select
              value={userData.selfAssessedLevel}
              onChange={(e) => setUserData(prev => ({...prev, selfAssessedLevel: e.target.value}))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Principiante</option>
              <option value="elementary">Elemental</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Objetivos de aprendizaje</label>
            <textarea
              value={userData.learningGoals}
              onChange={(e) => setUserData(prev => ({...prev, learningGoals: e.target.value}))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="¿Para qué quieres aprender inglés? (trabajo, viajes, estudios, etc.)"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !userData.age}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Generando...' : 'Comenzar Evaluación'}
          </button>
        </div>
      </div>
      
      <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-start mb-4">
          <Info className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0 mt-1" />
          <h3 className="text-xl font-semibold">Sobre nuestra Evaluación de Nivel</h3>
        </div>
        
        <div className="space-y-4 text-gray-700">
          <p>
            Nuestra evaluación sigue los estándares del Marco Común Europeo de Referencia para las Lenguas (MCER).
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="font-semibold text-blue-800 mb-2">¿Cómo funciona?</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Evaluación <span className="font-semibold">gratuita</span> de 10 minutos</li>
              <li>Preguntas adaptativas según tus respuestas</li>
              <li>Análisis personalizado con IA</li>
              <li>Descarga de resultados en PDF</li>
            </ul>
          </div>
          
          <p className="font-semibold">
            ¡Descubre tu verdadero nivel de inglés!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserForm;