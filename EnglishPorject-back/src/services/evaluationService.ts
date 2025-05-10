/**
 * Servicio para manejar la evaluación del test de nivel
 */

import { TestQuestionWithAnswer } from '../types';
import { PlacementTestResult } from '../types';
import { UserData } from '../components/placement/UserForm';
import { evaluateTest } from './placementService';
import i18n from 'i18next';

export const getEvaluationMessages = () => [
  i18n.t('evaluation.analyzing'),
  i18n.t('evaluation.evaluatingGrammar'),
  i18n.t('evaluation.calculatingVocabulary'),
  i18n.t('evaluation.determiningStrengths'),
  i18n.t('evaluation.preparingRecommendations'),
  i18n.t('evaluation.generatingReport')
];

// Obtenemos los mensajes de evaluación dinámicamente para que se actualicen con el idioma
export const evaluationMessages = getEvaluationMessages();

// Función para actualizar los mensajes cuando cambia el idioma
i18n.on('languageChanged', () => {
  // Actualizamos los mensajes de evaluación cuando cambia el idioma
  const updatedMessages = getEvaluationMessages();
  evaluationMessages.splice(0, evaluationMessages.length, ...updatedMessages);
});

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