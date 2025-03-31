// Interfaces y datos compartidos para toda la aplicación

export interface Schedule {
  group: string;
  times: string[];
}

export interface Agent {
  name: string;
  phone: string;
}

export const agents: Agent[] = [
  { name: "Cyril O.", phone: "51926328988" },
  { name: "Maricielo C.", phone: "51955402309" }
];

export const schedules: Schedule[] = [
  {
    group: "Niños (7-12 años)",
    times: [
      "Lunes y Miércoles 4:00 PM - 5:00 PM (Intermedios: B1-B2)", 
      "Martes y Jueves 4:00 PM - 5:00 PM (Principiantes: A0-A1-A2)"
    ]
  },
  {
    group: "Adolescentes (13-17 años)",
    times: [
      "Lunes y Miércoles 5:00 PM - 6:00 PM (Intermedios: B1-B2)", 
      "Martes y Jueves 5:00 PM - 6:00 PM (Principiantes: A0-A1-A2)"
    ]
  },
  {
    group: "Adultos (18+ años)",
    times: [
      "Lunes y Miércoles 7:00 PM - 8:00 PM (Intermedios: B1-B2)", 
      "Martes y Jueves 7:00 PM - 8:00 PM (Principiantes: A0-A1-A2)"
    ]
  }
];

// Add to existing types
export interface PlacementTestResult {
  level: string;
  recommendedGroup?: string;
  strengths: string[];
  areasToImprove?: string[];
  weaknesses: string[];
  recommendation: string;
  nextSteps: string[];
  score: number;
}

export interface TestQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  skill: 'grammar' | 'vocabulary' | 'listening' | 'reading';
  image?: string; // Add this line to include the image property
}

// Interfaz extendida para incluir respuestas correctas
export interface TestQuestionWithAnswer extends TestQuestion {
  correctAnswer: string;
}