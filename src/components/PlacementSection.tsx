import { useState, useEffect } from 'react';
import { BrainCircuit } from 'lucide-react';
import { PlacementTestResult, TestQuestionWithAnswer } from '../types'; // Correct path
import { UserForm, QuestionDisplay, ResultsDisplay } from './placement';
import Loader from './placement/Loader';
import { generateQuestions } from '../services/placementService'; // Correct path
import { evaluateUserTest } from '../services/evaluationService'; // Correct path
import { generatePlacementTestPDF } from '../services/pdfService'; // Correct path
import { UserData } from './placement/UserForm';

const PlacementSection = () => {
  // Estados para el flujo del test
  const [userData, setUserData] = useState<UserData>({
    age: '',
    selfAssessedLevel: 'beginner',
    learningGoals: '',
    name: '',
    email: ''
  });
  const [questions, setQuestions] = useState<TestQuestionWithAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<PlacementTestResult | null>(null);
  
  // Estados para UI y feedback
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationMessages, setEvaluationMessages] = useState<string[]>([]);
  const [feedbackState, setFeedbackState] = useState<'correct' | 'incorrect' | null>(null);
  const [messageInterval, setMessageInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

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
      // Generar preguntas adaptadas al perfil del usuario
      const generatedQuestions = await generateQuestions(
        formData.age,
        formData.selfAssessedLevel,
        formData.learningGoals
      );
      
      // Inicializar el test con las preguntas generadas
      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setAnswers([]);
      setResult(null);
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
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    setFeedbackState(isCorrect ? 'correct' : 'incorrect');
    
    // Después de un breve delay, avanzar a la siguiente pregunta o finalizar
    setTimeout(() => {
      setFeedbackState(null);
      if (currentQuestion < questions.length - 1) {
        // Avanzar a la siguiente pregunta
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Finalizar el test y evaluar resultados
        startEvaluation(newAnswers);
      }
    }, 1000);
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
    evaluateUserTest(questions, finalAnswers, userData)
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
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setFeedbackState(null);
    setEvaluationMessages([]);
  };
  
  /**
   * Genera un PDF con los resultados del test
   */
  const handleGeneratePDF = () => {
    if (!result) return;
    generatePlacementTestPDF(result, userData);
  };

  return (
    <section id="evaluacion" className="py-16 bg-blue-50 dark:bg-gray-900 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center dark:text-white">
          <BrainCircuit className="mr-2 h-8 w-8 dark:text-blue-400" />
          Evaluación de Nivel
        </h2>
        
        {!questions.length && !result ? (
          <UserForm onSubmit={handleUserFormSubmit} isLoading={isLoading} />
        ) : questions.length > 0 && currentQuestion < questions.length && !result ? (
          <QuestionDisplay 
            question={questions[currentQuestion]}
            currentQuestionIndex={currentQuestion}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            feedbackState={feedbackState}
            userAge={userData.age}
          />
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