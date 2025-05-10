import axios from 'axios';
import { UNIFIED_WEBHOOK, verifyMakeConnection } from './verifyMakeConnection';
import { toast } from 'react-toastify';

export const sendPlacementTestData = async (
  userData: {
    name: string;
    email: string;
    age: string;
    selfAssessedLevel: string;
    learningGoals: string;
  },
  testResult: {
    level: string;
    score: number;
    recommendedGroup?: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    nextSteps: string[];
  }
) => {
  await verifyMakeConnection();

  const makePayload = {
    userName: userData.name,
    userEmail: userData.email,
    userAge: userData.age,
    selfAssessedLevel: userData.selfAssessedLevel,
    learningGoals: userData.learningGoals,
    testLevel: testResult.level,
    testScore: testResult.score,
    recommendedGroup: testResult.recommendedGroup || 'N/A',
    strengths: testResult.strengths.join('; '),
    weaknesses: testResult.weaknesses.join('; '),
    recommendation: testResult.recommendation,
    nextSteps: testResult.nextSteps.join(' | '),
    formType: 'placement',
    source: 'web',
    connectionName: 'Cytalk Web App',
    timestamp: new Date().toISOString(),
    appVersion: '1.0.1'
  };

  const backendPayload = {
    ...makePayload,
    generatedCouponCode: 'CYTALK50-B1X7'
  };

  const results = { make: null, backend: null };

  try {
    const makeRes = await axios.post(UNIFIED_WEBHOOK, makePayload);
    results.make = makeRes.data;
  } catch (err) {
    console.error('❌ Error Make.com (Placement):', err);
    toast.error('Error enviando a Make.com');
  }

  try {
    const backendRes = await axios.post('https://cytalk-backend.onrender.com/api/forms/placement', backendPayload);
    results.backend = backendRes.data;
  } catch (err) {
    console.error('❌ Error Backend (Placement):', err);
    toast.error('Error enviando a Cytalk');
  }

  return results;
};