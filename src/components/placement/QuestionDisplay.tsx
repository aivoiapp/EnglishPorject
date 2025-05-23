import { Volume2 } from 'lucide-react';
import { TestQuestion } from '../../types';
import { useEffect, useCallback, useState } from 'react';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useTranslation } from 'react-i18next';

// Ya no necesitamos declarar tipos para react-speech-kit
// Los tipos ahora vienen de nuestro hook personalizado

interface QuestionDisplayProps {
  question: TestQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  feedbackState: 'correct' | 'incorrect' | null;
  userAge?: string;
}

const QuestionDisplay = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onAnswer,
  feedbackState,
  userAge = '30'
}: QuestionDisplayProps) => {
  const { speak, cancel, speaking } = useSpeechSynthesis();
  const [hasReadAutomatically, setHasReadAutomatically] = useState(false); // Track if text has been read automatically

  const isYoungChild = parseInt(userAge) < 7;

  const readText = useCallback((text: string) => {
    if (speaking) {
      cancel();
    }
    speak({ 
      text,
      rate: isYoungChild ? 0.9 : 1.0,
      pitch: isYoungChild ? 1.2 : 1.0
    });
  }, [speak, cancel, speaking, isYoungChild]);

  useEffect(() => {
    if (isYoungChild && !hasReadAutomatically) { // Check if it hasn't been read automatically yet
      readText(question.question);
      setHasReadAutomatically(true); // Mark as read automatically
    }
  }, [question.question, isYoungChild, readText, hasReadAutomatically]);

  const { t } = useTranslation();
  
  const getSkillTranslation = (skill: string) => {
    switch (skill) {
      case 'grammar': return t('placementTest.skills.grammar', 'Gramática');
      case 'vocabulary': return t('placementTest.skills.vocabulary', 'Vocabulario');
      case 'reading': return t('placementTest.skills.reading', 'Comprensión lectora');
      case 'listening': return t('placementTest.skills.listening', 'Comprensión auditiva');
      default: return skill;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg dark:shadow-gray-800/20">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t('placementTest.results.question', { current: currentQuestionIndex + 1, total: totalQuestions })}
          </span>
          <span className="text-sm font-medium px-3 py-1 bg-blue-100 dark:bg-blue-800/40 text-blue-800 dark:text-blue-200 rounded-full">
            {getSkillTranslation(question.skill)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {question.image && ( // Display image if available
          <img src={question.image} alt="Question visual" className="mb-4 w-full h-auto rounded-lg" />
        )}

        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold flex-grow text-gray-900 dark:text-gray-100" translate="no">
              {question.question}
            </h3>
            <button 
              onClick={() => readText(question.question)}
              className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-full 
                        hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
              title={t('placementTest.listenQuestion', 'Escuchar pregunta')}
              type="button"
              aria-label={t('placementTest.listenQuestionAria', 'Escuchar pregunta en voz alta')}
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <button
              onClick={() => onAnswer(option)}
              disabled={feedbackState !== null}
              translate="no"
              className={`w-full text-left p-4 border rounded-lg transition-all duration-300 transform
                        ${
                          feedbackState !== null 
                            ? 'cursor-not-allowed'
                            : 'hover:bg-blue-50 dark:hover:bg-gray-800/50 hover:shadow-md hover:-translate-y-0.5'
                        }
                        ${
                          feedbackState === 'correct' && option === question.correctAnswer
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/40 dark:border-green-600 shadow-md shadow-green-100 dark:shadow-green-900/20'
                            : feedbackState === 'incorrect' 
                              ? option === question.correctAnswer
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/40 dark:border-green-600 shadow-md shadow-green-100 dark:shadow-green-900/20'
                                : 'border-red-300 bg-red-50 dark:bg-red-900/40 dark:border-red-500 shadow-md shadow-red-100 dark:shadow-red-900/20'
                              : 'border-gray-300 dark:border-gray-600'
                        }`}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mr-3 font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-grow" translate="no">{option}</span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;