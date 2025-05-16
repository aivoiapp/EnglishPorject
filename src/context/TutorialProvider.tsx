import { useState, FC, ReactNode } from 'react';
import { TutorialContext } from './TutorialContext';

export const TutorialProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <TutorialContext.Provider value={{ showTutorial, setShowTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
};

export default TutorialProvider;