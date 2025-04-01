/**
 * Servicio para manejar la selección adaptativa de preguntas en el test de nivel
 */

import { TestQuestionWithAnswer } from '../types';

// Definición de niveles de dificultad en orden ascendente
const DIFFICULTY_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const;
type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];

/**
 * Organiza las preguntas por nivel de dificultad
 * @param questions Array de preguntas
 * @returns Objeto con preguntas organizadas por nivel de dificultad
 */
export const organizeQuestionsByDifficulty = (questions: TestQuestionWithAnswer[]): Record<DifficultyLevel, TestQuestionWithAnswer[]> => {
  return {
    'A1': questions.filter(q => q.difficulty === 'A1'),
    'A2': questions.filter(q => q.difficulty === 'A2'),
    'B1': questions.filter(q => q.difficulty === 'B1'),
    'B2': questions.filter(q => q.difficulty === 'B2'),
    'C1': questions.filter(q => q.difficulty === 'C1')
  };
};

/**
 * Selecciona un conjunto inicial de preguntas basado en el nivel auto-evaluado
 * @param allQuestions Todas las preguntas disponibles
 * @param selfAssessedLevel Nivel auto-evaluado por el usuario
 * @returns Array con preguntas seleccionadas para el test
 */
export const selectInitialQuestions = (
  allQuestions: TestQuestionWithAnswer[],
  selfAssessedLevel: string
): TestQuestionWithAnswer[] => {
  // Mapear el nivel auto-evaluado a un nivel CEFR
  let startingLevel: string;
  switch (selfAssessedLevel.toLowerCase()) {
    case 'beginner':
      startingLevel = 'A1';
      break;
    case 'elementary':
      startingLevel = 'A2';
      break;
    case 'intermediate':
      startingLevel = 'B1';
      break;
    case 'advanced':
      startingLevel = 'B2';
      break;
    default:
      startingLevel = 'A1';
  }
  
  // Organizar preguntas por dificultad
  const questionsByDifficulty = organizeQuestionsByDifficulty(allQuestions);
  
  // Seleccionar la primera pregunta del nivel inicial
  const initialQuestions: TestQuestionWithAnswer[] = [];
  
  // Añadir una pregunta del nivel inicial
  const typedStartingLevel = startingLevel as DifficultyLevel;
  if (questionsByDifficulty[typedStartingLevel]?.length > 0) {
    initialQuestions.push(questionsByDifficulty[typedStartingLevel][0]);
  } else {
    // Si no hay preguntas del nivel inicial, buscar en niveles adyacentes
    const levelIndex = DIFFICULTY_LEVELS.indexOf(typedStartingLevel);
    for (let i = 1; i <= 2; i++) {
      // Buscar en niveles inferiores
      if (levelIndex - i >= 0) {
        const lowerLevel = DIFFICULTY_LEVELS[levelIndex - i] as DifficultyLevel;
        if (questionsByDifficulty[lowerLevel]?.length > 0) {
          initialQuestions.push(questionsByDifficulty[lowerLevel][0]);
          break;
        }
      }
      // Buscar en niveles superiores
      if (levelIndex + i < DIFFICULTY_LEVELS.length) {
        const higherLevel = DIFFICULTY_LEVELS[levelIndex + i] as DifficultyLevel;
        if (questionsByDifficulty[higherLevel]?.length > 0) {
          initialQuestions.push(questionsByDifficulty[higherLevel][0]);
          break;
        }
      }
    }
  }
  
  return initialQuestions;
};

/**
 * Selecciona la siguiente pregunta basada en el rendimiento del usuario
 * @param allQuestions Todas las preguntas disponibles
 * @param currentQuestions Preguntas ya seleccionadas
 * @param answers Respuestas del usuario
 * @returns La siguiente pregunta a mostrar
 */
export const selectNextQuestion = (
  allQuestions: TestQuestionWithAnswer[],
  currentQuestions: TestQuestionWithAnswer[],
  answers: string[]
): TestQuestionWithAnswer | null => {
  if (answers.length === 0) {
    return null; // No hay respuestas para evaluar
  }
  
  // Obtener la última pregunta respondida
  const lastQuestionIndex = answers.length - 1;
  const lastQuestion = currentQuestions[lastQuestionIndex];
  const lastAnswer = answers[lastQuestionIndex];
  
  // Verificar si la respuesta fue correcta
  const wasCorrect = lastAnswer === lastQuestion.correctAnswer;
  
  // Obtener el nivel de dificultad actual
  const currentDifficulty = lastQuestion.difficulty;
  const currentDifficultyIndex = DIFFICULTY_LEVELS.indexOf(currentDifficulty as DifficultyLevel);
  
  // Determinar el siguiente nivel de dificultad basado en la respuesta
  let nextDifficultyIndex: number;
  if (wasCorrect) {
    // Si fue correcta, aumentar la dificultad
    nextDifficultyIndex = Math.min(currentDifficultyIndex + 1, DIFFICULTY_LEVELS.length - 1);
  } else {
    // Si fue incorrecta, disminuir la dificultad
    nextDifficultyIndex = Math.max(currentDifficultyIndex - 1, 0);
  }
  
  const nextDifficulty = DIFFICULTY_LEVELS[nextDifficultyIndex] as DifficultyLevel;
  
  // Organizar todas las preguntas por dificultad
  const questionsByDifficulty = organizeQuestionsByDifficulty(allQuestions);
  
  // Filtrar preguntas que ya han sido seleccionadas
  const usedQuestionIds = new Set(currentQuestions.map(q => q.question));
  const availableQuestions = questionsByDifficulty[nextDifficulty]
    .filter(q => !usedQuestionIds.has(q.question));
  
  // Si no hay preguntas disponibles en el nivel deseado, buscar en niveles adyacentes
  if (availableQuestions.length === 0) {
    // Buscar en niveles adyacentes (primero más cercanos, luego más lejanos)
    for (let i = 1; i < DIFFICULTY_LEVELS.length; i++) {
      // Buscar en nivel inferior
      if (nextDifficultyIndex - i >= 0) {
        const lowerLevel = DIFFICULTY_LEVELS[nextDifficultyIndex - i] as DifficultyLevel;
        const lowerQuestions = questionsByDifficulty[lowerLevel]
          .filter(q => !usedQuestionIds.has(q.question));
        if (lowerQuestions.length > 0) {
          return lowerQuestions[0];
        }
      }
      
      // Buscar en nivel superior
      if (nextDifficultyIndex + i < DIFFICULTY_LEVELS.length) {
        const higherLevel = DIFFICULTY_LEVELS[nextDifficultyIndex + i] as DifficultyLevel;
        const higherQuestions = questionsByDifficulty[higherLevel]
          .filter(q => !usedQuestionIds.has(q.question));
        if (higherQuestions.length > 0) {
          return higherQuestions[0];
        }
      }
    }
    
    return null; // No hay más preguntas disponibles
  }
  
  // Seleccionar la primera pregunta disponible del nivel adecuado
  return availableQuestions[0];
};

/**
 * Calcula el rendimiento actual del usuario en el test
 * @param questions Preguntas respondidas
 * @param answers Respuestas del usuario
 * @returns Objeto con estadísticas de rendimiento
 */
export const calculatePerformance = (
  questions: TestQuestionWithAnswer[],
  answers: string[]
) => {
  if (questions.length === 0 || answers.length === 0) {
    return {
      correctCount: 0,
      totalAnswered: 0,
      percentageCorrect: 0,
      performanceByLevel: {}
    };
  }
  
  // Contar respuestas correctas
  let correctCount = 0;
  const answeredQuestions = questions.slice(0, answers.length);
  
  // Rendimiento por nivel
  const performanceByLevel: Record<string, { correct: number, total: number }> = {};
  
  // Inicializar contadores para cada nivel
  DIFFICULTY_LEVELS.forEach(level => {
    performanceByLevel[level] = { correct: 0, total: 0 };
  });
  
  // Calcular estadísticas
  answeredQuestions.forEach((question, index) => {
    const isCorrect = answers[index] === question.correctAnswer;
    const level = question.difficulty;
    
    if (isCorrect) {
      correctCount++;
      performanceByLevel[level].correct++;
    }
    
    performanceByLevel[level].total++;
  });
  
  return {
    correctCount,
    totalAnswered: answers.length,
    percentageCorrect: (correctCount / answers.length) * 100,
    performanceByLevel
  };
};