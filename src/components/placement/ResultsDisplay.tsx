import { Fragment } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PlacementTestResult, schedules, Schedule } from '../../types';
import { useLanguage } from '../../context/useLanguage';

interface ResultsDisplayProps {
  result: PlacementTestResult;
  userName?: string;
  onReset: () => void;
  onGeneratePDF: () => void;
}

const ResultsDisplay = ({
  result,
  userName,
  onReset,
  onGeneratePDF
}: ResultsDisplayProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  // Debugging logs
  console.log('Result:', result);
  console.log('Schedules:', schedules);

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 dark:text-white">{t('placementTest.results.title')}</h3>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
        <p className="text-center text-gray-700 dark:text-gray-300">
          {userName ? `${t('placementTest.results.congratulations')} ${userName}! ` : `${t('placementTest.results.congratulations')}! `}
          {t('placementTest.results.completionMessage')}
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl dark:text-white">{t('placementTest.results.level')}:</span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.level}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-4 rounded-full transition-all duration-500" 
            style={{ width: `${result.score}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{t('placementTest.results.beginnerLevels')}</span>
          <span>{t('placementTest.results.intermediateLevels')}</span>
        </div>
      </div>
      
      {result.recommendedGroup && (
        <Fragment>
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg">
            <h4 className="font-semibold text-lg mb-2 text-green-800 dark:text-green-400">{t('placementTest.results.recommendedGroup')}</h4>
            <p className="text-gray-700 dark:text-gray-300">{result.recommendedGroup}</p>
            <div className="mt-2">
              <p className="dark:text-gray-300">{t('placementTest.results.availableSchedules')}:</p>
              <ul className="list-disc pl-5 mt-2 dark:text-gray-300">
                {schedules[language as keyof typeof schedules].find((s: Schedule) => s.group === result.recommendedGroup)?.times.map((time: string, idx: number) => (
                  <li key={idx}>{time}</li>
                )) || <li>{t('placementTest.results.noSchedules')}</li>}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-semibold text-lg mb-2 dark:text-white">{t('placementTest.results.strengths')}</h4>
              <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
                {result.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-2 dark:text-white">{t('placementTest.results.weaknesses')}</h4>
              <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
                {result.weaknesses.map((weakness, idx) => (
                  <li key={idx}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-semibold text-lg mb-2 dark:text-white">{t('placementTest.results.recommendation')}</h4>
            <p className="text-gray-700 dark:text-gray-300">{result.recommendation}</p>
          </div>
          
          <div className="mb-8">
            <h4 className="font-semibold text-lg mb-2 dark:text-white">{t('placementTest.results.nextSteps')}</h4>
            <ol className="list-decimal pl-5 space-y-2 dark:text-gray-300">
              {result.nextSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </Fragment>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={onGeneratePDF}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {t('placementTest.results.downloadPDF')}
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          {t('placementTest.results.takeAnother')}
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;