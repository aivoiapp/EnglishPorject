import { CheckCircle, XCircle, Volume2 } from 'lucide-react';
import { TestQuestion } from '../../types';
import { useSpeechSynthesis } from 'react-speech-kit';
import { useEffect } from 'react';

interface QuestionDisplayProps {
  question: TestQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  feedbackState: 'correct' | 'incorrect' | null;
  userAge?: string; // Añadido para determinar si se debe usar TTS automáticamente
}

const QuestionDisplay = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onAnswer,
  feedbackState,
  userAge = '30' // Valor por defecto para adultos
}: QuestionDisplayProps) => {
  const { speak, cancel, speaking } = useSpeechSynthesis();
  
  // Determinar si el usuario es un niño pequeño (menor de 7 años)
  const isYoungChild = parseInt(userAge) < 7;
  
  // Función para leer un texto en voz alta
  const readText = (text: string) => {
    if (speaking) {
      cancel();
    }
    speak({ text });
  };
  
  // Si es un niño pequeño, leer automáticamente la pregunta al cargar
  useEffect(() => {
    if (isYoungChild) {
      const timer = setTimeout(() => {
        readText(question.question);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [question.question, isYoungChild]);
  const getSkillTranslation = (skill: string) => {
    switch (skill) {
      case 'grammar': return 'Gramática';
      case 'vocabulary': return 'Vocabulario';
      case 'reading': return 'Comprensión lectora';
      case 'listening': return 'Comprensión auditiva';
      default: return skill;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Pregunta {currentQuestionIndex + 1} de {totalQuestions}</span>
          <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {getSkillTranslation(question.skill)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
        <div className="flex items-center">
          <h3 className="text-xl font-semibold mt-1 flex-grow">{question.question}</h3>
          <button 
            onClick={() => readText(question.question)}
            className="ml-2 p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-colors"
            title="Escuchar pregunta"
            type="button"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center">
            <button
              onClick={() => onAnswer(option)}
              disabled={feedbackState !== null}
              className={`w-full text-left p-4 border rounded-lg hover:bg-blue-50 transition-colors relative ${feedbackState !== null ? 'cursor-not-allowed' : ''}`}
            >
              {option}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                readText(option);
              }}
              className="ml-2 p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-colors"
              title="Escuchar opción"
              type="button"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      
      {feedbackState && (
        <div className={`mt-4 p-3 rounded-lg flex items-center ${feedbackState === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedbackState === 'correct' ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>¡Respuesta correcta!</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 mr-2" />
              <span>Respuesta incorrecta</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;