import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FAQSection = () => {
  const { t } = useTranslation();
  
  return (
  <section id="faq" className="py-16 bg-gray-50 dark:bg-gray-900">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center dark:text-white">
        <HelpCircle className="mr-2 h-8 w-8" />
        {t('faqSection.title')}
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Existing questions improved */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('faqSection.cost.question')}</h3>
          <p className="text-gray-600 dark:text-gray-300">{t('faqSection.cost.answer')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('faqSection.duration.question')}</h3>
          <p className="text-gray-600 dark:text-gray-300">{t('faqSection.duration.answer')}</p>
        </div>

        {/* New questions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('faqSection.registration.question')}</h3>
          <p className="text-gray-600 dark:text-gray-300">{t('faqSection.registration.answer')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('faqSection.requirements.question')}</h3>
          <p className="text-gray-600 dark:text-gray-300">{t('faqSection.requirements.answer')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('faqSection.courseIncludes.question')}</h3>
          <p className="text-gray-600 dark:text-gray-300">{t('faqSection.courseIncludes.answer')}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2 dark:text-white">{t('faqSection.level.question')}</h3>
          <p className="text-gray-600 dark:text-gray-300">{t('faqSection.level.answer')}</p>
        </div>
        
      </div>
    </div>
  </section>
);
};

export default FAQSection;