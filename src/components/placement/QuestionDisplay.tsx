import { CheckCircle, XCircle, Volume2 } from 'lucide-react';
import { TestQuestion } from '../../types';
import { useSpeechSynthesis } from 'react-speech-kit';
import { useEffect, useCallback } from 'react';

// Declaración de tipos para react-speech-kit si no existen
declare module 'react-speech-kit' {
  interface SpeechSynthesisVoice {
    voiceURI: string;
    name: string;
    lang: string;
    localService: boolean;
    default: boolean;
  }

  interface SpeechSynthesisUtterance {
    text: string;
    lang: string;
    voice: SpeechSynthesisVoice;
    volume: number;
    rate: number;
    pitch: number;
  }

  interface SpeechSynthesis {
    speak: (utterance: SpeechSynthesisUtterance) => void;
    cancel: () => void;
    speaking: boolean;
    voices: SpeechSynthesisVoice[];
  }

  export function useSpeechSynthesis(): {
    speak: (args: { text: string; rate?: number; pitch?: number; voice?: SpeechSynthesisVoice }) => void;
    cancel: () => void;
    speaking: boolean;
    voices: SpeechSynthesisVoice[];
  };
}

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
  
  // Función para leer un texto en voz alta con useCallback para evitar recreación en cada render
  const readText = useCallback((text: string) => {
    if (speaking) {
      cancel();
    }
    speak({ 
      text,
      rate: isYoungChild ? 0.9 : 1.0, // Velocidad más lenta para niños
      pitch: isYoungChild ? 1.2 : 1.0 // Tono más alto para niños
    });
  }, [speak, cancel, speaking, isYoungChild]);
  
  // Si es un niño pequeño, leer automáticamente la pregunta al cargar
  useEffect(() => {
    if (isYoungChild) {
      const timer = setTimeout(() => {
        readText(question.question);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [question.question, isYoungChild, readText]);

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
            aria-label="Escuchar pregunta en voz alta"
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
              className={`w-full text-left p-4 border rounded-lg hover:bg-blue-50 transition-colors relative ${
                feedbackState !== null ? 'cursor-not-allowed' : ''
              } ${
                feedbackState === 'correct' && option === question.correctAnswer ? 'border-green-500 bg-green-50' :
                feedbackState === 'incorrect' && option === question.correctAnswer ? 'border-green-500 bg-green-50' :
                feedbackState === 'incorrect' && option !== question.correctAnswer ? 'border-red-300 bg-red-50' :
                'border-gray-300'
              }`}
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
              aria-label="Escuchar opción en voz alta"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      
      {feedbackState && (
        <div className={`mt-4 p-3 rounded-lg flex items-center ${
          feedbackState === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {feedbackState === 'correct' ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>¡Respuesta correcta!</span>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 mr-2" />
              <span>Respuesta incorrecta. La respuesta correcta es: {question.correctAnswer}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;