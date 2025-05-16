import { createContext } from 'react';

export interface TutorialContextType {
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
}

export const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export default TutorialContext;