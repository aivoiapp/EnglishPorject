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
  { name: "Agente 1.", phone: "51926328988" },
  { name: "Agente 2", phone: "51906089930" }
];

export interface ScheduleTranslations {
  es: Schedule[];
  en: Schedule[];
}

export const schedules: ScheduleTranslations = {
  es: [
    {
      group: "Niños (8-12 años)",
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
  ],
  en: [
    {
      group: "Children (8-12 years)",
      times: [
        "Monday and Wednesday 4:00 PM - 5:00 PM (Intermediate: B1-B2)", 
        "Tuesday and Thursday 4:00 PM - 5:00 PM (Beginners: A0-A1-A2)"
      ]
    },
    {
      group: "Teenagers (13-17 years)",
      times: [
        "Monday and Wednesday 5:00 PM - 6:00 PM (Intermediate: B1-B2)", 
        "Tuesday and Thursday 5:00 PM - 6:00 PM (Beginners: A0-A1-A2)"
      ]
    },
    {
      group: "Adults (18+ years)",
      times: [
        "Monday and Wednesday 7:00 PM - 8:00 PM (Intermediate: B1-B2)", 
        "Tuesday and Thursday 7:00 PM - 8:00 PM (Beginners: A0-A1-A2)"
      ]
    }
  ]
};

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