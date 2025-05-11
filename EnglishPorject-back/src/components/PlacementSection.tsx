import { useState, useEffect } from 'react';
import { BrainCircuit, TrendingUp } from 'lucide-react';
import { PlacementTestResult, TestQuestionWithAnswer } from '../types';
import { UserForm, QuestionDisplay, ResultsDisplay } from './placement';
import Loader from './placement/Loader';
import { generateQuestions } from '../services/placementService';
import { evaluateUserTest } from '../services/evaluationService'; 
import { generatePlacementTestPDF } from '../services/pdfService'; 
import { sendPlacementTestData } from '../services/makeServicePlacement';
import { UserData } from './placement/UserForm';
import { jsPDF } from 'jspdf';
import { selectInitialQuestions, selectNextQuestion, calculatePerformance } from '../services/adaptiveTestService'; // Importar el servicio adaptativo
import { useTranslation } from 'react-i18next'; // Importar useTranslation para las traducciones

const PlacementSection = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<UserData>({
    age: '',
    selfAssessedLevel: 'beginner',
    learningGoals: '',
    name: '',
    email: ''
  });
  const [allQuestions, setAllQuestions] = useState<TestQuestionWithAnswer[]>([]); // Banco completo de preguntas
  const [selectedQuestions, setSelectedQuestions] = useState<TestQuestionWithAnswer[]>([]); // Preguntas seleccionadas para mostrar
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<PlacementTestResult | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationMessages, setEvaluationMessages] = useState<string[]>([]);
  const [feedbackState, setFeedbackState] = useState<'correct' | 'incorrect' | null>(null);
  const [messageInterval, setMessageInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [performance, setPerformance] = useState<{
    correctCount: number;
    totalAnswered: number;
    percentageCorrect: number;
    performanceByLevel: Record<string, { correct: number, total: number }>;
  }>({ 
    correctCount: 0, 
    totalAnswered: 0, 
    percentageCorrect: 0, 
    performanceByLevel: {} 
  });
  const [testProgress, setTestProgress] = useState<number>(0); // Progreso del test (0-100)

  useEffect(() => {
    return () => {
      if (messageInterval) {
        clearInterval(messageInterval);
      }
    };
  }, [messageInterval]);

  /**
   * Maneja el envío del formulario de usuario e inicia el test
   * @param formData Datos del usuario
   */
  const handleUserFormSubmit = async (formData: UserData) => {
    setUserData(formData);
    setIsLoading(true);
    
    try {
      const generatedQuestions = await generateQuestions(
        formData.age,
        formData.selfAssessedLevel,
        formData.learningGoals
      );
      
      setAllQuestions(generatedQuestions);
      
      const initialQuestions = selectInitialQuestions(generatedQuestions, formData.selfAssessedLevel);
      
      setSelectedQuestions(initialQuestions);
      setCurrentQuestion(0);
      setAnswers([]);
      setResult(null);
      setTestProgress(0);
      setPerformance({
        correctCount: 0,
        totalAnswered: 0,
        percentageCorrect: 0,
        performanceByLevel: {}
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      alert(t('placementTest.errors.generatingQuestions', 'Error generating questions. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja la respuesta del usuario a una pregunta
   * @param answer Respuesta seleccionada por el usuario
   */
  const handleAnswer = (answer: string) => {
    // Guardar la respuesta del usuario
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
    
    const isCorrect = answer === selectedQuestions[currentQuestion].correctAnswer;
    setFeedbackState(isCorrect ? 'correct' : 'incorrect');
        
    const newPerformance = calculatePerformance(selectedQuestions, newAnswers);
    setPerformance(newPerformance);
    
      setTimeout(() => {
      setFeedbackState(null);      
      
      const isChild = parseInt(userData.age) < 13;
      const maxQuestions = isChild ? 10 : 15; // Máximo número de preguntas según edad
      
      // Verificar si el rendimiento es consistente (para posible finalización temprana)
      
      if (newAnswers.length < maxQuestions) {
        selectAndAddNextQuestion(newAnswers);
      } else {
        startEvaluation(newAnswers); // solo termina si llega al máximo
      }
      
      // Actualizar el progreso del test
      setTestProgress((newAnswers.length / maxQuestions) * 100);
    }, 1000);
  };
  
  
  /**
   * Selecciona y añade la siguiente pregunta basada en el rendimiento
   * @param currentAnswers Respuestas actuales del usuario
   */
  const selectAndAddNextQuestion = (currentAnswers: string[]) => {
    const nextQuestion = selectNextQuestion(allQuestions, selectedQuestions, currentAnswers);
    
    if (nextQuestion) {
      setSelectedQuestions(prev => [...prev, nextQuestion]);
      setCurrentQuestion(prev => prev + 1);
    } else {
      startEvaluation(currentAnswers);
    }
  };

  const startEvaluation = (finalAnswers: string[]) => {
    setIsLoading(true);
    setIsEvaluating(true);
    setEvaluationMessages([]);
    
    const messages = [
      t('evaluation.analyzing'),
      t('evaluation.evaluatingGrammar'),
      t('evaluation.calculatingVocabulary'),
      t('evaluation.determiningStrengths'),
      t('evaluation.preparingRecommendations'),
      t('evaluation.generatingReport')
    ];
    
    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < messages.length) {
        setEvaluationMessages(prev => [...prev, messages[messageIndex]]);
        messageIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
    
    setMessageInterval(interval);

    evaluateUserTest(selectedQuestions.slice(0, finalAnswers.length), finalAnswers, userData)
      .then(async evaluation => {
        setResult(evaluation);
        // Enviar datos al webhook de Make.com inmediatamente después de obtener el resultado
        try {
          // Preparar los datos para enviar a Make.com
          const userDataToSend = {
            name: userData.name || '',
            email: userData.email || '',
            age: userData.age || '',
            selfAssessedLevel: userData.selfAssessedLevel || 'beginner',
            learningGoals: userData.learningGoals || ''
          };
          
          const testResult = {
            level: evaluation.level,
            score: evaluation.score,
            recommendedGroup: evaluation.recommendedGroup,
            strengths: evaluation.strengths,
            weaknesses: evaluation.weaknesses,
            recommendation: evaluation.recommendation,
            nextSteps: evaluation.nextSteps
          };
          
          console.log('Enviando datos a Make.com con formType=placement');
          await sendPlacementTestData(userDataToSend, testResult);
          console.log('Datos del test de nivel enviados correctamente a Make.com');
        } catch (error) {
          console.error('Error al enviar datos del test de nivel a Make.com:', error);
        }
      })
      .catch(error => {
        console.error('Error evaluating test:', error);
        alert(t('placementTest.errors.evaluatingTest', 'Error evaluating your test. Please try again.'));
      })
      .finally(() => {
        if (messageInterval) {
          clearInterval(messageInterval);
          setMessageInterval(null);
        }
        setIsLoading(false);
        setIsEvaluating(false);
        setEvaluationMessages([]);
      });
  };

  const resetTest = () => {
    setAllQuestions([]);
    setSelectedQuestions([]);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setFeedbackState(null);
    setEvaluationMessages([]);
    setPerformance({
      correctCount: 0,
      totalAnswered: 0,
      percentageCorrect: 0,
      performanceByLevel: {}
    });
    setTestProgress(0);
  };
  
  const handleGeneratePDF = async () => {
    if (!result) return;
    
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text(t('placementTest.title'), 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`${t('placementTest.name')}: ${userData.name || t('placementTest.results.noSchedules')}`, 20, 30);
      doc.text(`${t('placementTest.email')}: ${userData.email || t('placementTest.results.noSchedules')}`, 20, 37);
      doc.text(`${t('placementTest.age')}: ${userData.age}`, 20, 44);
      
      doc.setFontSize(16);
      doc.text(`${t('placementTest.results.level')}: ${result.level}`, 20, 55);
      doc.text(`${t('placementTest.results.score')}: ${result.score}/100`, 20, 65);
      
      if (result.recommendedGroup) {
        doc.text(`${t('placementTest.results.recommendedGroup')}: ${result.recommendedGroup}`, 20, 75);
      }
      
      doc.setFontSize(14);
      doc.text(`${t('placementTest.results.strengths')}:`, 20, 90);
      result.strengths.forEach((strength, i) => {
        doc.text(`- ${strength}`, 30, 100 + (i * 7));
      });
      
      const weaknessesStartY = 100 + (result.strengths.length * 7) + 10;
      doc.text(`${t('placementTest.results.weaknesses')}:`, 20, weaknessesStartY);
      result.weaknesses.forEach((weakness, i) => {
        doc.text(`- ${weakness}`, 30, weaknessesStartY + 10 + (i * 7));
      });
      
      const recStartY = weaknessesStartY + 10 + (result.weaknesses.length * 7) + 10;
      doc.text(`${t('placementTest.results.recommendation')}:`, 20, recStartY);
      const splitRecommendation = doc.splitTextToSize(result.recommendation, 170);
      doc.text(splitRecommendation, 20, recStartY + 10);
      
      const nextStepsY = recStartY + 10 + (splitRecommendation.length * 7) + 10;
      doc.text(`${t('placementTest.results.nextSteps')}:`, 20, nextStepsY);
      result.nextSteps.forEach((step, i) => {
        const splitStep = doc.splitTextToSize(`${i+1}. ${step}`, 170);
        doc.text(splitStep, 20, nextStepsY + 10 + (i * 14));
      });
      
      const pageCount = doc.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`${t('header.title')} - ${t('placementTest.title')}`, 105, 285, { align: 'center' });
      }
      
      const fileName = `${t('placementTest.results.filePrefix', 'english-assessment')}-${userData.name || t('placementTest.results.defaultUser', 'user')}.pdf`;
      doc.save(fileName);
      
      // Ya no se envía el PDF al webhook
      // const pdfBlob = doc.output('blob');
      //await sendPlacementTestData(userData, result);
      // console.log('Datos y PDF del test de nivel enviados correctamente a Make.com');
    } catch (error) {
      console.error('Error al generar el PDF del test de nivel:', error);
      generatePlacementTestPDF(result, userData, t);
    }
  };

  return (
    <section id="evaluacion" className="py-16 bg-gradient-to-b from-[#5B0E88] to-[#C5156E] dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white relative">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center text-white dark:text-white">
          <BrainCircuit className="mr-2 h-8 w-8 dark:text-blue-400" />
          {t('placementTest.title')}
        </h2>
        
        {!selectedQuestions.length && !result ? (
          <div className="max-w-7xl w-full mx-auto">
            <div className="bg-[#f6e6fa]/90 dark:bg-gray-900/90 p-8 rounded-2xl shadow-2xl ring-2 ring-blue-100 dark:ring-blue-900/40 transition-all duration-300">
              <UserForm onSubmit={handleUserFormSubmit} isLoading={isLoading} />
            </div>
          </div>
        ) : selectedQuestions.length > 0 && currentQuestion < selectedQuestions.length && !result ? (
          <div className="space-y-6">
            {/* Progress Bar Mejorado */}
            <div className="bg-[#f6e6fa]/90 dark:bg-gray-800/90 p-5 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {t('placementTest.results.question', { current: currentQuestion + 1, total: Math.max(parseInt(userData.age) < 13 ? 10 : 15, selectedQuestions.length) })}
                  </span>
                </div>
                <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {t('placementTest.results.performance')}: {performance.percentageCorrect.toFixed(0)}%
                  </span>
                </div>
              </div>
              
              {/* Barra de progreso principal con animación */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-5 overflow-hidden">
                <div 
                  className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-700 ease-out relative" 
                  style={{ width: `${testProgress}%` }}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="h-full w-full bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Indicadores de rendimiento por nivel con etiquetas mejoradas */}
              <div className="mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('placementTest.results.performanceByLevel')}:</h4>
                <div className="grid grid-cols-5 gap-2">
                  {['A1', 'A2', 'B1', 'B2', 'C1'].map((level) => {
                    const levelPerformance = performance.performanceByLevel[level] || { correct: 0, total: 0 };
                    const percentage = levelPerformance.total > 0 
                      ? (levelPerformance.correct / levelPerformance.total) * 100 
                      : 0;
                    
                    // Determinar el color basado en el rendimiento
                    let colorClass = 'bg-gray-300 dark:bg-gray-600';
                    if (levelPerformance.total > 0) {
                      if (percentage >= 70) {
                        colorClass = 'bg-green-500 dark:bg-green-400';
                      } else if (percentage >= 40) {
                        colorClass = 'bg-yellow-500 dark:bg-yellow-400';
                      } else {
                        colorClass = 'bg-red-500 dark:bg-red-400';
                      }
                    }
                    
                    return (
                      <div key={level} className="flex flex-col items-center">
                        <div className="flex justify-between w-full mb-1">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{level}</span>
                          {levelPerformance.total > 0 && (
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {levelPerformance.correct}/{levelPerformance.total}
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${colorClass}`} 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Componente de Pregunta */}
            <div className="max-w-3xl w-full mx-auto">
              <div className="bg-[#f6e6fa]/90 dark:bg-gray-900/90 p-8 rounded-2xl shadow-2xl ring-2 ring-blue-100 dark:ring-blue-900/40 transition-all duration-300">
                <QuestionDisplay 
                  question={selectedQuestions[currentQuestion]}
                  currentQuestionIndex={currentQuestion}
                  totalQuestions={Math.max(parseInt(userData.age) < 13 ? 10 : 15, selectedQuestions.length)}
                  onAnswer={handleAnswer}
                  feedbackState={feedbackState}
                  userAge={userData.age}
                />
              </div>
            </div>
          </div>
        ) : isLoading && !result ? (
          <Loader fullScreen={false} evaluationMessages={evaluationMessages} title={t('loader.processing')} />
        ) : result ? (
          <ResultsDisplay 
            result={result}
            userName={userData.name}
            onReset={resetTest}
            onGeneratePDF={handleGeneratePDF}
          />
        ) : null}
      </div>
      {/* Loading Overlay para evaluación */}
      {isEvaluating && (
        <Loader 
          fullScreen={true} 
          title={t('evaluation.generatingReport')} 
          subtitle={t('loader.pleaseWait')} 
          evaluationMessages={evaluationMessages} 
        />
      )}
    </section>
  );
};

export default PlacementSection;
