import { BookOpen, Users, Layout, Volume2, Lightbulb, Headphones, MessageCircle, Users2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CurriculumSection = () => {
  const { t } = useTranslation();
  return (
    <section id="curriculum" className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-800 dark:text-blue-400">
          {t('curriculumSection.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-white" /> {/* Conversation icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{t('curriculumSection.conversation.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('curriculumSection.conversation.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Volume2 className="w-6 h-6 text-white" /> {/* Pronunciation icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{t('curriculumSection.pronunciation.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('curriculumSection.pronunciation.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" /> {/* Grammar icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{t('curriculumSection.grammar.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('curriculumSection.grammar.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Users className="w-6 h-6 text-white" /> {/* Vocabulary icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{t('curriculumSection.vocabulary.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('curriculumSection.vocabulary.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Layout className="w-6 h-6 text-white" /> {/* Reading icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{t('curriculumSection.reading.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('curriculumSection.reading.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Headphones className="w-6 h-6 text-white" /> {/* Listening icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{t('curriculumSection.listening.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('curriculumSection.listening.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Users2 className="w-6 h-6 text-white" /> {/* Exam preparation icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{t('curriculumSection.examPrep.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('curriculumSection.examPrep.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-500 p-2 rounded-full flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" /> {/* Culture and context icon */}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{t('curriculumSection.culture.title')}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('curriculumSection.culture.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{t('curriculumSection.certification.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {t('curriculumSection.certification.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;