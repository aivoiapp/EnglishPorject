import { useState } from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Loader from './Loader';

interface UserFormProps {
  onSubmit: (userData: UserData) => void;
  isLoading: boolean;
}

export interface UserData {
  age: string;
  selfAssessedLevel: string;
  learningGoals: string;
  name: string;
  email: string;
}

const UserForm = ({ onSubmit, isLoading }: UserFormProps) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<UserData>({
    age: '',
    selfAssessedLevel: 'beginner',
    learningGoals: '',
    name: '',
    email: ''
  });

  const handleSubmit = () => {
    if (!userData.age) return;
    onSubmit(userData);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {isLoading && <Loader title={t('placementTest.generating')} />}
      <div className="md:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 dark:text-white">{t('placementTest.personalInfo')}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('placementTest.name')}</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData(prev => ({...prev, name: e.target.value}))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('placementTest.email')}</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({...prev, email: e.target.value}))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('placementTest.age')} <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={userData.age}
              onChange={(e) => setUserData(prev => ({...prev, age: e.target.value}))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('placementTest.currentLevel')}</label>
            <select
              value={userData.selfAssessedLevel}
              onChange={(e) => setUserData(prev => ({...prev, selfAssessedLevel: e.target.value}))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="beginner">{t('placementTest.levels.beginner')}</option>
              <option value="elementary">{t('placementTest.levels.elementary')}</option>
              <option value="intermediate">{t('placementTest.levels.intermediate')}</option>
              <option value="advanced">{t('placementTest.levels.advanced')}</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('placementTest.learningGoals')}</label>
            <textarea
              value={userData.learningGoals}
              onChange={(e) => setUserData(prev => ({...prev, learningGoals: e.target.value}))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32"
              placeholder={t('placementTest.learningGoalsPlaceholder')}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !userData.age}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
          >
            {isLoading ? t('placementTest.generating') : t('placementTest.startButton')}
          </button>
        </div>
      </div>
      
      <div className="md:w-1/2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex items-start mb-4">
          <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-1" />
          <h3 className="text-xl font-semibold dark:text-white">{t('placementTest.aboutTitle')}</h3>
        </div>
        
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            {t('placementTest.aboutDescription')}
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="font-semibold text-blue-800 dark:text-blue-400 mb-2">{t('placementTest.howItWorksTitle')}</p>
            <ul className="list-disc pl-5 space-y-1">
              {(t('placementTest.howItWorksList', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <p className="font-semibold dark:text-white">
            {t('placementTest.encouragement')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserForm;