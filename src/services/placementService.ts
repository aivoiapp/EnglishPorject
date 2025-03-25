/**
 * Servicio para manejar la generación y evaluación de preguntas del test de nivel
 */

import { TestQuestion, PlacementTestResult } from '../types';
import { isApiKeyConfigured, callDeepSeekApi, parseApiResponse } from './deepseekService';

// Interfaz extendida para incluir respuestas correctas
export interface TestQuestionWithAnswer extends TestQuestion {
  correctAnswer: string;
}

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
- The **type of content** to be age-appropriate (e.g., use images, simpler vocabulary, or oral-type instructions for very young users under 8).
- The **complexity and number of questions** based on both the age and self-assessed level. For example:
  - Very young learners (age < 8): 3–5 very basic questions focused on listening or simple recognition.
  - Children 8–12: 6–8 questions, mostly A1–A2, with short and clear wording.
  - Teens and adults: 8–12 questions, adjust difficulty from A1 to C1 as needed.

Important:
- Vary skills (grammar, vocabulary, reading, listening) proportionally to the user's profile.
- Make sure questions are pedagogically meaningful and suitable to identify the user’s actual level.

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
    
    const promptContent = `Evaluate these English test answers and provide a detailed assessment IN SPANISH.\n\nUser profile:\n- Name: ${userData.name}\n- Age: ${userData.age}\n- Self-assessed level: ${userData.selfAssessedLevel}\n- Learning goals: ${userData.learningGoals}\n\nAnswers: ${JSON.stringify(answersWithQuestions)}\n\nReturn ONLY a JSON object with ALL TEXT VALUES IN SPANISH:\n{\n  "level": "A1/A2/B1/B2/C1/C2",\n  "score": 0-100,\n  "strengths": ["array of strengths in Spanish"],\n  "weaknesses": ["array of weaknesses in Spanish"],\n  "areasToImprove": ["array in Spanish"],\n  "recommendation": "text in Spanish",\n  "nextSteps": ["array of next steps in Spanish"],\n  "recommendedGroup": "${recommendedGroup}"\n}`;
    
    const data = await callDeepSeekApi(promptContent);
    const evaluation = parseApiResponse<PlacementTestResult>(data);
    return evaluation;
  } catch (error) {
    console.error('API Error en evaluación, usando resultado mock en su lugar:', error);
    return getMockResult(parseInt(userData.age));
  }
};

/**
 * Determina el grupo recomendado basado en la edad
 * @param age Edad del usuario
 * @returns Grupo recomendado
 */
export const getRecommendedGroup = (age: number): string => {
  if (age >= 7 && age <= 12) return "Niños (7-12 años)";
  if (age >= 13 && age <= 17) return "Adolescentes (13-17 años)";
  return "Adultos (18+ años)";
};

/**
 * Obtiene preguntas mock para el test
 * @returns Array de preguntas mock
 */
export const getMockQuestions = (): TestQuestionWithAnswer[] => {
  return [
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
};

/**
 * Obtiene un resultado mock para el test
 * @param age Edad del usuario
 * @returns Resultado mock
 */
export const getMockResult = (age: number): PlacementTestResult => {
  const recommendedGroup = getRecommendedGroup(age);
  
  return {
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
};