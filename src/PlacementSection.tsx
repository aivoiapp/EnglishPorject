import { useState, useEffect } from 'react';
import { BrainCircuit } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { PlacementTestResult } from './types';
import { UserForm, QuestionDisplay, LoadingState, ResultsDisplay } from './components/placement';
import { generateQuestions, evaluateTest, TestQuestionWithAnswer } from './services/placementService';
import { UserData } from './components/placement/UserForm';

const PlacementSection = () => {
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

  const handleUserFormSubmit = async (formData: UserData) => {
    setUserData(formData);
    setIsLoading(true);
    
    try {
      const generatedQuestions = await generateQuestions(
        formData.age,
        formData.selfAssessedLevel,
        formData.learningGoals
      );
      
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

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
    
    // Determinar si la respuesta es correcta basado en la respuesta correcta definida
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    setFeedbackState(isCorrect ? 'correct' : 'incorrect');
    
    setTimeout(() => {
      setFeedbackState(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        startEvaluation(newAnswers);
      }
    }, 1000);
  };

  const startEvaluation = (finalAnswers: string[]) => {
    setIsLoading(true);
    setIsEvaluating(true);
    setEvaluationMessages([]);
    
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
    
    // Preparar los datos para la evaluación
    const answersWithQuestions = questions.map((q, i) => ({
      question: q.question,
      userAnswer: finalAnswers[i] || '',
      options: q.options,
      difficulty: q.difficulty,
      skill: q.skill,
      correctAnswer: q.correctAnswer
    }));

    // Evaluar el test
    evaluateTest(answersWithQuestions, userData)
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

  const resetTest = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setFeedbackState(null);
    setEvaluationMessages([]);
  };
  
  const generatePDF = () => {
    if (!result) return;

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
    
    doc.save(`english-assessment-${userData.name || 'user'}.pdf`);
  };

  return (
    <section id="evaluacion" className="py-16 bg-blue-50 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
          <BrainCircuit className="mr-2 h-8 w-8" />
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
        ) : isLoading && !result ? (
          <LoadingState evaluationMessages={evaluationMessages} />
        ) : result ? (
          <ResultsDisplay 
            result={result}
            userName={userData.name}
            onReset={resetTest}
            onGeneratePDF={generatePDF}
          />
        ) : null}
      </div>

      {/* Loading Overlay para evaluación */}
      {isEvaluating && (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Generando tu informe...</p>
          <p className="text-gray-500 mt-2">Por favor espera unos segundos</p>
        </div>
      )}
    </section>
  );
};

export default PlacementSection;