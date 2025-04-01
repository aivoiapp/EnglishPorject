import { useState, useEffect } from 'react';
import { BrainCircuit, TrendingUp } from 'lucide-react';
import { PlacementTestResult, TestQuestionWithAnswer } from '../types'; // Correct path
import { UserForm, QuestionDisplay, ResultsDisplay } from './placement';
import Loader from './placement/Loader';
import { generateQuestions } from '../services/placementService'; // Correct path
import { evaluateUserTest } from '../services/evaluationService'; // Correct path
import { generatePlacementTestPDF } from '../services/pdfService'; // Correct path
import { sendPlacementTestData } from '../services/makeService'; // Importar el servicio de Make.com
import { UserData } from './placement/UserForm';
import { jsPDF } from 'jspdf';
import { selectInitialQuestions, selectNextQuestion, calculatePerformance } from '../services/adaptiveTestService'; // Importar el servicio adaptativo

const PlacementSection = () => {
  // Estados para el flujo del test
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
  
  // Estados para UI y feedback
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

  // Limpiar el intervalo cuando el componente se desmonta
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
    // Guardar datos del usuario y mostrar estado de carga
    setUserData(formData);
    setIsLoading(true);
    
    try {
      // Generar un banco grande de preguntas adaptadas al perfil del usuario
      const generatedQuestions = await generateQuestions(
        formData.age,
        formData.selfAssessedLevel,
        formData.learningGoals
      );
      
      // Guardar todas las preguntas generadas
      setAllQuestions(generatedQuestions);
      
      // Seleccionar la primera pregunta basada en el nivel auto-evaluado
      const initialQuestions = selectInitialQuestions(generatedQuestions, formData.selfAssessedLevel);
      
      // Inicializar el test con las preguntas seleccionadas
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
      alert('Error generating questions. Please try again.');
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
    
    // Mostrar feedback visual (correcto/incorrecto)
    const isCorrect = answer === selectedQuestions[currentQuestion].correctAnswer;
    setFeedbackState(isCorrect ? 'correct' : 'incorrect');
    
    // Actualizar el rendimiento del usuario
    const newPerformance = calculatePerformance(selectedQuestions, newAnswers);
    setPerformance(newPerformance);
    
    // Después de un breve delay, avanzar a la siguiente pregunta o finalizar
    setTimeout(() => {
      setFeedbackState(null);
      
      // Determinar si debemos continuar o finalizar el test
      // El test finaliza después de un número máximo de preguntas o cuando se han respondido suficientes preguntas
      // para determinar el nivel con confianza
      // Ajustar el número máximo de preguntas según la edad del usuario: 10 para niños, 15 para adolescentes y adultos
      const isChild = parseInt(userData.age) < 13;
      const maxQuestions = isChild ? 10 : 15; // Máximo número de preguntas según edad
      const minQuestions = isChild ? 5 : 7;  // Mínimo número de preguntas antes de considerar finalizar
      
      // Verificar si el rendimiento es consistente (para posible finalización temprana)
      const isPerformanceConsistent = checkPerformanceConsistency(newPerformance);
      
      if (newAnswers.length < minQuestions) {
        // Siempre hacer al menos el mínimo de preguntas
        selectAndAddNextQuestion(newAnswers);
      } else if (newAnswers.length >= maxQuestions) {
        // No exceder el máximo de preguntas
        startEvaluation(newAnswers);
      } else if (isPerformanceConsistent && newAnswers.length >= minQuestions) {
        // Si el rendimiento es consistente y ya hemos hecho el mínimo de preguntas, podemos finalizar
        startEvaluation(newAnswers);
      } else {
        // Entre el mínimo y el máximo, seleccionar la siguiente pregunta
        selectAndAddNextQuestion(newAnswers);
      }
      
      // Actualizar el progreso del test
      setTestProgress((newAnswers.length / maxQuestions) * 100);
    }, 1000);
  };
  
  /**
   * Verifica si el rendimiento del usuario es consistente en un nivel específico
   * @param performance Rendimiento actual del usuario
   * @returns Verdadero si el rendimiento es consistente
   */
  const checkPerformanceConsistency = (performance: {
    performanceByLevel: Record<string, { correct: number, total: number }>
  }) => {
    // Verificar si hay al menos 3 preguntas en un nivel específico con un rendimiento consistente
    for (const level in performance.performanceByLevel) {
      const levelData = performance.performanceByLevel[level];
      
      // Si hay al menos 3 preguntas en este nivel
      if (levelData.total >= 3) {
        const percentage = (levelData.correct / levelData.total) * 100;
        
        // Si el rendimiento es muy bueno (>80%) o muy malo (<30%), podemos considerar que es consistente
        if (percentage > 80 || percentage < 30) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  /**
   * Selecciona y añade la siguiente pregunta basada en el rendimiento
   * @param currentAnswers Respuestas actuales del usuario
   */
  const selectAndAddNextQuestion = (currentAnswers: string[]) => {
    // Seleccionar la siguiente pregunta basada en el rendimiento
    const nextQuestion = selectNextQuestion(allQuestions, selectedQuestions, currentAnswers);
    
    if (nextQuestion) {
      // Añadir la nueva pregunta a las seleccionadas
      setSelectedQuestions(prev => [...prev, nextQuestion]);
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Si no hay más preguntas disponibles, finalizar el test
      startEvaluation(currentAnswers);
    }
  };

  const startEvaluation = (finalAnswers: string[]) => {
    setIsLoading(true);
    setIsEvaluating(true);
    setEvaluationMessages([]);
    
    // Use the imported messages array from the service
    const messages = [
      "Analizando tus respuestas...",
      "Evaluando tu nivel de gramática...",
      "Calculando tu nivel de vocabulario...",
      "Determinando tus fortalezas y debilidades...",
      "Preparando recomendaciones personalizadas...",
      "Generando tu informe detallado..."
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

    // Evaluar el test usando el servicio dedicado
    // Usamos las preguntas seleccionadas para la evaluación
    evaluateUserTest(selectedQuestions.slice(0, finalAnswers.length), finalAnswers, userData)
      .then(evaluation => {
        setResult(evaluation);
      })
      .catch(error => {
        console.error('Error evaluating test:', error);
        alert('Error evaluating your test. Please try again.');
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

  /**
   * Reinicia el test para comenzar de nuevo
   */
  const resetTest = () => {
    // Reiniciar todos los estados a sus valores iniciales
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
  
  /**
   * Genera un PDF con los resultados del test y lo envía a Make.com
   */
  const handleGeneratePDF = async () => {
    if (!result) return;
    
    try {
      // Generar el PDF y obtener el blob
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text('Evaluación de Nivel de Inglés', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Nombre: ${userData.name || 'No proporcionado'}`, 20, 30);
      doc.text(`Email: ${userData.email || 'No proporcionado'}`, 20, 37);
      doc.text(`Edad: ${userData.age}`, 20, 44);
      
      doc.setFontSize(16);
      doc.text(`Nivel: ${result.level}`, 20, 55);
      doc.text(`Puntuación: ${result.score}/100`, 20, 65);
      
      if (result.recommendedGroup) {
        doc.text(`Grupo recomendado: ${result.recommendedGroup}`, 20, 75);
      }
      
      doc.setFontSize(14);
      doc.text('Fortalezas:', 20, 90);
      result.strengths.forEach((strength, i) => {
        doc.text(`- ${strength}`, 30, 100 + (i * 7));
      });
      
      const weaknessesStartY = 100 + (result.strengths.length * 7) + 10;
      doc.text('Áreas de mejora:', 20, weaknessesStartY);
      result.weaknesses.forEach((weakness, i) => {
        doc.text(`- ${weakness}`, 30, weaknessesStartY + 10 + (i * 7));
      });
      
      const recStartY = weaknessesStartY + 10 + (result.weaknesses.length * 7) + 10;
      doc.text('Recomendación:', 20, recStartY);
      const splitRecommendation = doc.splitTextToSize(result.recommendation, 170);
      doc.text(splitRecommendation, 20, recStartY + 10);
      
      const nextStepsY = recStartY + 10 + (splitRecommendation.length * 7) + 10;
      doc.text('Próximos pasos:', 20, nextStepsY);
      result.nextSteps.forEach((step, i) => {
        const splitStep = doc.splitTextToSize(`${i+1}. ${step}`, 170);
        doc.text(splitStep, 20, nextStepsY + 10 + (i * 14));
      });
      
      const pageCount = doc.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text('English Academy - Evaluación de Nivel', 105, 285, { align: 'center' });
      }
      
      // Guardar el PDF localmente
      const fileName = `english-assessment-${userData.name || 'user'}.pdf`;
      doc.save(fileName);
      
      // Obtener el blob del PDF para enviarlo a Make.com
      const pdfBlob = doc.output('blob');
      
      // Enviar los datos y el PDF a Make.com
      await sendPlacementTestData(userData, result, pdfBlob);
      console.log('Datos y PDF del test de nivel enviados correctamente a Make.com');
    } catch (error) {
      console.error('Error al enviar datos del test de nivel a Make.com:', error);
      // Generar el PDF localmente de todos modos para no interrumpir la experiencia del usuario
      generatePlacementTestPDF(result, userData);
    }
  };

  return (
    <section id="evaluacion" className="py-16 bg-blue-50 dark:bg-gray-900 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center dark:text-white">
          <BrainCircuit className="mr-2 h-8 w-8 dark:text-blue-400" />
          Evaluación de Nivel
        </h2>
        
        {!selectedQuestions.length && !result ? (
          <UserForm onSubmit={handleUserFormSubmit} isLoading={isLoading} />
        ) : selectedQuestions.length > 0 && currentQuestion < selectedQuestions.length && !result ? (
          <div className="space-y-6">
            {/* Progress Bar Mejorado */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Pregunta {currentQuestion + 1} de {Math.max(parseInt(userData.age) < 13 ? 10 : 15, selectedQuestions.length)}
                  </span>
                </div>
                <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Rendimiento: {performance.percentageCorrect.toFixed(0)}%
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
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rendimiento por nivel:</h4>
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
            <QuestionDisplay 
              question={selectedQuestions[currentQuestion]}
              currentQuestionIndex={currentQuestion}
              totalQuestions={Math.max(parseInt(userData.age) < 13 ? 10 : 15, selectedQuestions.length)}
              onAnswer={handleAnswer}
              feedbackState={feedbackState}
              userAge={userData.age}
            />
          </div>
        ) : isLoading && !result ? (
          <Loader fullScreen={false} evaluationMessages={evaluationMessages} title="Procesando..." />
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
          title="Generando tu informe..." 
          subtitle="Por favor espera unos segundos" 
          evaluationMessages={evaluationMessages} 
        />
      )}
    </section>
  );
};

export default PlacementSection;