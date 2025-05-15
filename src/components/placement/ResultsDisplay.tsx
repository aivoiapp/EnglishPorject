import { Fragment, useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import CouponModal from './CouponModal';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PlacementTestResult, schedules, Schedule } from '../../types';
import { useLanguage } from '../../context/useLanguage';
import { generatePdfFromHtml } from '../../services/htmlToPdf';

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
  onGeneratePDF: originalOnGeneratePDF
}: ResultsDisplayProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  // Debugging logs
  console.log('Result:', result);
  console.log('Schedules:', schedules);
  const [couponCode, setCouponCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponGenerated, setCouponGenerated] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    setCouponGenerated(false);
    setCouponCode('');
  }, [result]);
  const handleGenerateCoupon = async () => {
    try {
      const response = await fetch('https://cytalk-backend.onrender.com/coupons/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ discountPercentage: 50 })
      });
      
      if (response.ok) {
        const { code } = await response.json();
        setCouponCode(code);
        setIsModalOpen(true);
        setCouponGenerated(true);
      }
    } catch (error) {
      console.error('Error generating coupon:', error);
    }
  };

  // Función para generar PDF utilizando el nuevo servicio htmlToPdf
  const handleGeneratePDF = async () => {
    if (!result || !resultsRef.current) return;
    try {
      setIsGeneratingPDF(true);
      // Oculta botones y pie de página antes de generar el PDF
      if (resultsRef.current) {
        resultsRef.current.classList.add('pdf-export');
      }
      await generatePdfFromHtml(resultsRef.current, {
        fileName: `english-assessment-${userName || 'user'}`,
        //title: t('placementTest.title'),
        orientation: 'portrait',
        scale: 1.5,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
        onDocumentReady: () => {
          // No agregar pie de página
        },
        onSaveSuccess: (fileName) => {
          setIsGeneratingPDF(false);
          if (resultsRef.current) {
            resultsRef.current.classList.remove('pdf-export');
          }
          console.log(`PDF guardado como: ${fileName}`);
        },
        onError: (error) => {
          setIsGeneratingPDF(false);
          if (resultsRef.current) {
            resultsRef.current.classList.remove('pdf-export');
          }
          console.error('Error al generar el PDF:', error);
        }
      });
    } catch (error) {
      if (resultsRef.current) {
        resultsRef.current.classList.remove('pdf-export');
      }
      console.error('Error al generar el PDF del test de nivel:', error);
      if (originalOnGeneratePDF && typeof originalOnGeneratePDF === 'function') {
        originalOnGeneratePDF();
      }
    }
  };
  
  return (
    <>
      <div ref={resultsRef} className={`max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md pdf:!shadow-none pdf:!rounded-none pdf:!max-w-none pdf:!mx-0 pdf:!p-0 ${isGeneratingPDF ? 'hide-actions-for-pdf !p-0 !m-0 !rounded-none !shadow-none' : ''}`}>
        <h3 className="text-2xl font-bold mb-6 dark:text-white">{t('placementTest.results.title')}</h3>
        {/* Contenido principal del resultado */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6 pdf:!p-0 pdf:!rounded-none pdf:!border-0 pdf:!mb-0">
          <p className="text-center text-gray-700 dark:text-gray-300">
            {userName ? `${t('placementTest.results.congratulations')} ${userName}! ` : `${t('placementTest.results.congratulations')}! `}
            {t('placementTest.results.completionMessage')}
          </p>
        </div>
        <div className="mb-8 pdf:!mb-0">
          <div className="flex items-center justify-between mb-4 pdf:!mb-0">
            <span className="text-xl dark:text-white">{t('placementTest.results.level')}:</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.level}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2 pdf:!mb-0">
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
            <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg pdf:!mb-0 pdf:!p-0 pdf:!rounded-none pdf:!border-0">
              <h4 className="font-semibold text-lg mb-2 text-green-800 dark:text-green-400">{t('placementTest.results.recommendedGroup')}</h4>
              <p className="text-gray-700 dark:text-gray-300">{result.recommendedGroup}</p>
              <div className="mt-2 pdf:!mt-0">
                <p className="dark:text-gray-300">{t('placementTest.results.availableSchedules')}:</p>
                <ul className="list-disc pl-5 mt-2 dark:text-gray-300 pdf:!pl-0 pdf:!mt-0">
                  {schedules[language as keyof typeof schedules].find((s: Schedule) => s.group === result.recommendedGroup)?.times.map((time: string, idx: number) => (
                    <li key={idx}>{time}</li>
                  )) || <li>{t('placementTest.results.noSchedules')}</li>}
                </ul>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-8 pdf:!mb-0 pdf:!gap-0">
              <div>
                <h4 className="font-semibold text-lg mb-2 dark:text-white">{t('placementTest.results.strengths')}</h4>
                <ul className="list-disc pl-5 space-y-1 dark:text-gray-300 pdf:!pl-0 pdf:!space-y-0">
                  {result.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 dark:text-white">{t('placementTest.results.weaknesses')}</h4>
                <ul className="list-disc pl-5 space-y-1 dark:text-gray-300 pdf:!pl-0 pdf:!space-y-0">
                  {result.weaknesses.map((weakness, idx) => (
                    <li key={idx}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mb-8 pdf:!mb-0">
              <h4 className="font-semibold text-lg mb-2 dark:text-white">{t('placementTest.results.recommendation')}</h4>
              <p className="text-gray-700 dark:text-gray-300">{result.recommendation}</p>
            </div>
            <div className="mb-8 pdf:!mb-0">
              <h4 className="font-semibold text-lg mb-2 dark:text-white">{t('placementTest.results.nextSteps')}</h4>
              <ol className="list-decimal pl-5 space-y-2 dark:text-gray-300 pdf:!pl-0 pdf:!space-y-0">
                {result.nextSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </Fragment>
        )}
        {/* Confetti y Modal solo si es necesario, nunca en PDF */}
        {!isGeneratingPDF && isModalOpen && <Confetti recycle={false} numberOfPieces={200} />}
        {!isGeneratingPDF && (
          <CouponModal
            isOpen={isModalOpen}
            code={couponCode}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
      {/* Botones fuera del contenedor referenciado para el PDF */}
      <div className={`flex flex-col md:flex-row gap-4 print:hidden mt-4 ${isGeneratingPDF ? 'hidden' : ''} pdf:hidden`}>
        <button
          onClick={handleGeneratePDF}
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
        {!couponGenerated && (
          <button
            onClick={handleGenerateCoupon}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center justify-center"
          >
            🎉 {t('placementTest.results.generateCoupon')}
          </button>
        )}
      </div>
    </>
  );
};

export default ResultsDisplay;