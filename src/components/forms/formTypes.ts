export interface HeroFormData {
  nombre: string;
  email: string;
  telefono: string;
  interes?: string;
}

export interface ContactFormData {
  nombre: string;
  email: string;
  mensaje: string;
}

export interface PlacementTestData {
  userName: string;
  userEmail: string;
  userAge: string;
  selfAssessedLevel: string;
  learningGoals: string;
  testLevel: string;
  testScore: number;
  recommendedGroup: string;
  strengths: string;
  weaknesses: string;
  recommendation: string;
  nextSteps: string;
  nivelActual: string;
  disponibilidad: string;
  objetivos: string[];
  generatedCouponCode: string; // Código de cupón generado para el usuario
}