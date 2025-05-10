/**
 * Mocks para el test de nivel de inglés
 * Este archivo contiene datos mock para preguntas y resultados del test de nivel
 */

import { TestQuestionWithAnswer, PlacementTestResult } from '../types';

/**
 * Determina el grupo recomendado basado en la edad
 * @param age Edad del usuario
 * @returns Grupo recomendado
 */
export const getRecommendedGroup = (age: number): string => {
  if (age >= 7 && age <= 12) return "Niños (8-12 años)";
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
      question: "¿Qué le gusta hacer a John?",
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
  ]; // Removed the filter for 'image' property
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
    recommendedGroup,
    strengths: [
      "Buen manejo de vocabulario básico",
      "Comprensión de estructuras gramaticales simples",
      "Capacidad para entender textos cortos"
    ],
    weaknesses: [
      "Dificultad con tiempos verbales complejos",
      "Vocabulario limitado en temas específicos",
      "Errores en preposiciones y artículos"
    ],
    recommendation: "Recomendamos enfocarte en practicar más la gramática, especialmente los tiempos verbales del pasado y condicionales. También sería beneficioso expandir tu vocabulario en contextos profesionales y académicos.",
    nextSteps: [
      "Inscríbete en nuestro curso de nivel intermedio para fortalecer tus habilidades",
      "Practica con ejercicios de gramática enfocados en tiempos verbales",
      "Lee artículos en inglés sobre temas que te interesen para mejorar tu vocabulario",
      "Utiliza aplicaciones de aprendizaje para practicar 15 minutos diarios"
    ]
  };
};