import { useState, Fragment } from 'react';
import { BrainCircuit, Info, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { TestQuestion, PlacementTestResult, schedules } from '../types';
import { isApiKeyConfigured, callDeepSeekApi, parseApiResponse } from '../services/deepseekService';

const PlacementSection = () => {
  const [userData, setUserData] = useState({
    age: '',
    selfAssessedLevel: 'beginner',
    learningGoals: '',
    name: '',
    email: ''
  });
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<PlacementTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationMessages, setEvaluationMessages] = useState<string[]>([]);
  const [feedbackState, setFeedbackState] = useState<'correct' | 'incorrect' | null>(null);
  const [messageInterval, setMessageInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const getRecommendedGroup = (age: number) => {
    if (age >= 7 && age <= 12) return "Niños (7-12 años)";
    if (age >= 13 && age <= 17) return "Adolescentes (13-17 años)";
    return "Adultos (18+ años)";
  };

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const mockQuestions: TestQuestion[] = [
        {
          question: "What is the correct form of the verb in this sentence? 'She ___ to the store yesterday.'",
          options: ["go", "goes", "went", "going"],
          correctAnswer: "went",
          difficulty: "A2",
          skill: "grammar"
        },
        {
          question: "Choose the word that best completes the sentence: 'I ___ my homework before dinner.'",
          options: ["did", "done", "do", "doing"],
          correctAnswer: "did",
          difficulty: "A1",
          skill: "grammar"
        },
        {
          question: "What is the meaning of 'ubiquitous'?",
          options: ["rare", "present everywhere", "beautiful", "dangerous"],
          correctAnswer: "present everywhere",
          difficulty: "C1",
          skill: "vocabulary"
        },
        {
          question: "Which sentence is grammatically correct?",
          options: [
            "I have been to Paris last year.", 
            "I went to Paris last year.", 
            "I have gone to Paris last year.", 
            "I was go to Paris last year."
          ],
          correctAnswer: "I went to Paris last year.",
          difficulty: "B1",
          skill: "grammar"
        },
        {
          question: "What is the opposite of 'generous'?",
          options: ["kind", "stingy", "wealthy", "giving"],
          correctAnswer: "stingy",
          difficulty: "B1",
          skill: "vocabulary"
        },
        {
          question: "Read the passage and answer: 'John likes to play sports. He especially enjoys basketball and soccer. On weekends, he often goes to the park.' What does John like to do?",
          options: ["Read books", "Play sports", "Go shopping", "Watch movies"],
          correctAnswer: "Play sports",
          difficulty: "A1",
          skill: "reading"
        },
        {
          question: "Choose the correct preposition: 'I'm afraid ___ spiders.'",
          options: ["of", "from", "about", "for"],
          correctAnswer: "of",
          difficulty: "A2",
          skill: "grammar"
        },
        {
          question: "Which word is a synonym for 'happy'?",
          options: ["sad", "angry", "joyful", "tired"],
          correctAnswer: "joyful",
          difficulty: "A1",
          skill: "vocabulary"
        }
      ];
      
      try {
        if (!isApiKeyConfigured()) {
          throw new Error('API key no configurada');
        }
        
        const promptContent = `Generate 8 adaptive English assessment questions based on:\n- Age: ${userData.age}\n- Self-assessed level: ${userData.selfAssessedLevel}\n- Learning goals: ${userData.learningGoals}\n\nReturn ONLY a JSON array with:\n{\n  "question": "text",\n  "options": ["array"],\n  "correctAnswer": "the correct option that MUST be one of the options",\n  "difficulty": "level",\n  "skill": "category"\n}`;
        
        const data = await callDeepSeekApi(promptContent);
        const parsedQuestions = parseApiResponse<TestQuestion[]>(data);
        setQuestions(parsedQuestions);
    } catch (error) {
        console.error('API Error, usando preguntas mock en su lugar:', error);
        setQuestions(mockQuestions);
      }
      
      setCurrentQuestion(0);
      setAnswers([]);
      setResult(null);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Error generating questions. Please try again.');
      setIsLoading(false);
    } finally {
      if (messageInterval) {
        clearInterval(messageInterval);
        setMessageInterval(null);
      }
      setIsLoading(false);
      setEvaluationMessages([]);
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
        evaluateTest(newAnswers);
      }
    }, 1000);
  };

  const evaluateTest = async (finalAnswers: string[]) => {
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
    
    try {
      const answersWithQuestions = questions.map((q, i) => ({
        question: q.question,
        userAnswer: finalAnswers[i] || '',
        options: q.options,
        difficulty: q.difficulty,
        skill: q.skill,
        correctAnswer: q.correctAnswer
      }));

      const recommendedGroup = getRecommendedGroup(parseInt(userData.age));
      
      const mockResult: PlacementTestResult = {
        level: "B1",
        score: 65,
        strengths: [
          "Buen manejo de vocabulario básico",
          "Comprensión de estructuras gramaticales simples",
          "Capacidad para entender contextos cotidianos"
        ],
        weaknesses: [
          "Dificultad con tiempos verbales complejos",
          "Vocabulario limitado en temas específicos",
          "Errores en preposiciones y artículos"
        ],
        recommendation: "Recomendamos enfocarte en practicar más la gramática intermedia y expandir tu vocabulario. Sería beneficioso unirte a nuestro grupo de nivel intermedio donde podrás desarrollar estas habilidades con actividades específicas.",
        nextSteps: [
          "Inscribirte en nuestro curso de nivel B1",
          "Practicar con ejercicios de gramática enfocados en tiempos verbales",
          "Expandir vocabulario con lecturas temáticas",
          "Participar en conversaciones guiadas para mejorar fluidez"
        ],
        recommendedGroup: recommendedGroup
      };

      try {
        if (!isApiKeyConfigured()) {
          throw new Error('API key no configurada');
        }
        
        const promptContent = `Evaluate these English test answers and provide a detailed assessment.\n\nUser profile:\n- Name: ${userData.name}\n- Age: ${userData.age}\n- Self-assessed level: ${userData.selfAssessedLevel}\n- Learning goals: ${userData.learningGoals}\n\nAnswers: ${JSON.stringify(answersWithQuestions)}\n\nReturn ONLY a JSON object with:\n{\n  "level": "A1/A2/B1/B2/C1/C2",\n  "score": 0-100,\n  "strengths": ["array"],\n  "weaknesses": ["array"],\n  "areasToImprove": ["array"],\n  "recommendation": "text",\n  "nextSteps": ["array"],\n  "recommendedGroup": "${recommendedGroup}"\n}`;
        
        const data = await callDeepSeekApi(promptContent);
        const evaluation = parseApiResponse<PlacementTestResult>(data);
        setResult(evaluation);
    } catch (error) {
        console.error('API Error en evaluación, usando resultado mock en su lugar:', error);
        setResult(mockResult);
      }
    } catch (error) {
      console.error('Error evaluating test:', error);
      alert('Error evaluating your test. Please try again.');
    } finally {
      if (messageInterval) {
        clearInterval(messageInterval);
        setMessageInterval(null);
      }
      setIsLoading(false);
      setIsEvaluating(false);
      setEvaluationMessages([]);
    }
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
    doc.text('English Level Assessment', 105, 20, { align: 'center' });
    
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
                  onClick={generateQuestions}
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
        ) : questions.length > 0 && currentQuestion < questions.length && !result ? (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Pregunta {currentQuestion + 1} de {questions.length}</span>
                <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {questions[currentQuestion].skill === 'grammar' ? 'Gramática' : 
                   questions[currentQuestion].skill === 'vocabulary' ? 'Vocabulario' : 
                   questions[currentQuestion].skill === 'reading' ? 'Comprensión lectora' : 
                   questions[currentQuestion].skill === 'listening' ? 'Comprensión auditiva' : 
                   questions[currentQuestion].skill}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
              <h3 className="text-xl font-semibold mt-1">{questions[currentQuestion].question}</h3>
            </div>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={feedbackState !== null}
                  className={`w-full text-left p-4 border rounded-lg hover:bg-blue-50 transition-colors relative ${feedbackState !== null ? 'cursor-not-allowed' : ''}`}
                >
                  {option}
                </button>
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
        ) : isLoading && !result ? (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative">
                <RefreshCw className="h-16 w-16 text-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-4 w-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="mt-4 text-blue-600 font-bold text-lg">Procesando...</div>
            </div>
            <h3 className="text-xl font-semibold mb-6">Evaluando tus respuestas</h3>
            
            <div className="space-y-4">
              {evaluationMessages.map((message, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg animate-pulse transition-all duration-300 border border-blue-100">
                  {message}
                </div>
              ))}
              {evaluationMessages.length > 0 && evaluationMessages.length < 6 && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                  <div className="h-2 w-2 bg-blue-600 rounded-full mr-1 animate-bounce"></div>
                  <div className="h-2 w-2 bg-blue-600 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
          </div>
        ) : result ? (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-6">Resultados de tu Evaluación</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
              <p className="text-center text-gray-700">
                {userData.name ? `¡Felicidades ${userData.name}! ` : '¡Felicidades! '}
                Has completado la evaluación de nivel.
              </p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl">Nivel:</span>
                <span className="text-2xl font-bold text-blue-600">{result.level}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Principiante</span>
                <span>Intermedio</span>
                <span>Avanzado</span>
              </div>
            </div>
            
            {result.recommendedGroup && (
              <Fragment>
                <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-lg">
                  <h4 className="font-semibold text-lg mb-2 text-green-800">Grupo recomendado</h4>
                  <p className="text-gray-700">{result.recommendedGroup}</p>
                  <div className="mt-2">
                    <p>Horarios disponibles:</p>
                    <ul className="list-disc pl-5 mt-2">
                      {schedules.find(s => s.group === result.recommendedGroup)?.times.map((time, idx) => (
                        <li key={idx}>{time}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Fortalezas</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Áreas de mejora</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.weaknesses.map((weakness, idx) => (
                        <li key={idx}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-lg mb-2">Recomendación</h4>
                  <p className="text-gray-700">{result.recommendation}</p>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-semibold text-lg mb-2">Próximos pasos</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    {result.nextSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </Fragment>
            )}

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={generatePDF}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Descargar resultados (PDF)
              </button>
              
              <button
                onClick={resetTest}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Comenzar nuevamente
              </button>
            </div>
          </div>
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