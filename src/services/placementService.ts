/**
 * Servicio para manejar la generación y evaluación de preguntas del test de nivel
 */

import { PlacementTestResult } from '../types';
import { isApiKeyConfigured, callDeepSeekApi, parseApiResponse } from './deepseekService';
import { TestQuestionWithAnswer } from '../types';

/**
 * Genera preguntas para el test de nivel basadas en los datos del usuario
 * @param age Edad del usuario
 * @param selfAssessedLevel Nivel auto-evaluado por el usuario
 * @param learningGoals Objetivos de aprendizaje del usuario
 * @returns Promise con un array de preguntas
 */
export const generateQuestions = async (
  age: string,
  selfAssessedLevel: string,
  learningGoals: string
): Promise<TestQuestionWithAnswer[]> => {
  try {
    if (!isApiKeyConfigured()) {
      throw new Error('API key no configurada');
    }
    
    const promptContent = `You are an English language assessment expert. Based on the following user profile:

- Age: ${age}
- Self-assessed level: ${selfAssessedLevel} (Beginner, Elementary, Intermediate, Advanced)
- Learning goals: ${learningGoals}

Generate an adaptive English placement test that evaluates the user’s actual level. Adjust:
- The **type of content** to be age-appropriate (e.g., use simpler vocabulary or oral-type instructions for very young users under 8).
- The **complexity and number of questions** based on both the age and self-assessed level. For example:
  - Very young learners (age < 8): 3–5 very basic questions focused on listening or simple recognition.
  - Children 8–12: 6–8 questions, mostly A1–A2, with short and clear wording.
  - Teens and adults: 8–12 questions, adjust difficulty from A1 to C1 as needed.

Important:
- Vary skills (grammar, vocabulary, reading, listening) proportionally to the user's profile.
- Make sure questions are pedagogically meaningful and suitable to identify the user’s actual level.
- Do not include questions that reference images unless they can be displayed.

Return ONLY a JSON array of questions, each with the following structure:

[
  {
    "question": "Your question text here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "The correct option (must match one of the options)",
    "difficulty": "A1/A2/B1/B2/C1",
    "skill": "grammar/vocabulary/reading/listening"
  },
  ...
]

DO NOT include any explanations or extra text—return ONLY the JSON array.`;
    
    const data = await callDeepSeekApi(promptContent);
    const parsedQuestions = parseApiResponse<TestQuestionWithAnswer[]>(data);
    return parsedQuestions;
  } catch (error) {
    console.error('API Error, usando preguntas mock en su lugar:', error);
    return getMockQuestions();
  }
};

/**
 * Evalúa las respuestas del usuario y genera un resultado
 * @param answersWithQuestions Respuestas del usuario con las preguntas correspondientes
 * @param userData Datos del usuario
 * @returns Promise con el resultado de la evaluación
 */
export const evaluateTest = async (
  answersWithQuestions: Array<{
    question: string;
    userAnswer: string;
    options: string[];
    difficulty: string;
    skill: string;
    correctAnswer: string;
  }>,
  userData: {
    name: string;
    age: string;
    selfAssessedLevel: string;
    learningGoals: string;
  }
): Promise<PlacementTestResult> => {
  try {
    if (!isApiKeyConfigured()) {
      throw new Error('API key no configurada');
    }
    
    const recommendedGroup = getRecommendedGroup(parseInt(userData.age));
    
    // Obtener el idioma actual de la aplicación
    const currentLanguage = localStorage.getItem('i18nextLng') || 'es';
    const languageForPrompt = currentLanguage.split('-')[0]; // Simplificar 'en-US' a 'en'
    
    // Determinar el idioma para la respuesta
    const responseLanguage = languageForPrompt === 'en' ? 'ENGLISH' : 'SPANISH';
    
    const promptContent = `Evaluate these English test answers and provide a detailed assessment IN ${responseLanguage}.\n\nUser profile:\n- Name: ${userData.name}\n- Age: ${userData.age}\n- Self-assessed level: ${userData.selfAssessedLevel}\n- Learning goals: ${userData.learningGoals}\n\nAnswers: ${JSON.stringify(answersWithQuestions)}\n\nReturn ONLY a JSON object with ALL TEXT VALUES IN ${responseLanguage}:\n{\n  "level": "A1/A2/B1/B2/C1/C2",\n  "score": 0-100,\n  "strengths": ["array of strengths in ${responseLanguage}"],\n  "weaknesses": ["array of weaknesses in ${responseLanguage}"],\n  "areasToImprove": ["array in ${responseLanguage}"],\n  "recommendation": "text in ${responseLanguage}",\n  "nextSteps": ["array of next steps in ${responseLanguage}"],\n  "recommendedGroup": "${recommendedGroup}"\n}`;
    
    const data = await callDeepSeekApi(promptContent);
    const evaluation = parseApiResponse<PlacementTestResult>(data);
    return evaluation;
  } catch (error) {
    console.error('API Error en evaluación, usando resultado mock en su lugar:', error);
    return getMockResult(parseInt(userData.age));
  }
};

// Importar funciones de mocks
import { getRecommendedGroup, getMockQuestions, getMockResult } from '../mocks/placementMocks';

// Las funciones getMockQuestions y getRecommendedGroup ahora se importan desde placementMocks.ts

// La función getMockResult ahora se importa desde placementMocks.ts