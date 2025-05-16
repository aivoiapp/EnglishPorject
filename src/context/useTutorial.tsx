import { useContext } from 'react';
import { TutorialContext } from './TutorialContext';

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial debe usarse dentro de un TutorialProvider');
  }
  return context;
};

export default useTutorial;