/**
 * Servicio para manejar la evaluación del test de nivel
 */

import { TestQuestionWithAnswer } from '../types';
import { PlacementTestResult } from '../types';
import { UserData } from '../components/placement/UserForm';
import { evaluateTest } from './placementService';

/**
 * Mensajes de evaluación que se muestran durante el proceso
 */
export const evaluationMessages = [
  "Analizando tus respuestas...",
  "Evaluando tu nivel de gramática...",
  "Calculando tu nivel de vocabulario...",
  "Determinando tus fortalezas y debilidades...",
  "Preparando recomendaciones personalizadas...",
  "Generando tu informe detallado..."
];

/**
 * Prepara los datos para la evaluación del test
 * @param questions Preguntas del test
 * @param answers Respuestas del usuario
 * @returns Datos preparados para la evaluación
 */
export const prepareEvaluationData = (questions: TestQuestionWithAnswer[], answers: string[]) => {
  return questions.map((q, i) => ({
    question: q.question,
    userAnswer: answers[i] || '',
    options: q.options,
    difficulty: q.difficulty,
    skill: q.skill,
    correctAnswer: q.correctAnswer
  }));
};

/**
 * Evalúa el test y retorna el resultado
 * @param questions Preguntas del test
 * @param answers Respuestas del usuario
 * @param userData Datos del usuario
 * @returns Promise con el resultado de la evaluación
 */
export const evaluateUserTest = async (
  questions: TestQuestionWithAnswer[],
  answers: string[],
  userData: UserData
): Promise<PlacementTestResult> => {
  const answersWithQuestions = prepareEvaluationData(questions, answers);
  return await evaluateTest(answersWithQuestions, userData);
};