import React from 'react';
import { t } from 'i18next';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  // Eliminado: const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">{t('privacyPolicy.title')}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="prose dark:prose-invert max-w-none">
            <h3>{t('privacyPolicy.objectiveTitle')}</h3>
            <p>{t('privacyPolicy.objectiveDescription')}</p>

            <h3>{t('privacyPolicy.scopeTitle')}</h3>
            <p>{t('privacyPolicy.scopeDescription')}</p>

            <h3>{t('privacyPolicy.keyTermsTitle')}</h3>
            <p>{t('privacyPolicy.keyTermsDescription')}</p>

            <h3>{t('privacyPolicy.policyDetailTitle')}</h3>
            <p>{t('privacyPolicy.policyDetailDescription')}</p>
            <ul>
              <li>{t('privacyPolicy.policyDetailItem1')}</li>
              <li>{t('privacyPolicy.policyDetailItem2')}</li>
              <li>{t('privacyPolicy.policyDetailItem3')}</li>
            </ul>
            <p>{t('privacyPolicy.policyDetailConclusion')}</p>

            <h3>{t('privacyPolicy.complianceResponsibilitiesTitle')}</h3>
            <p>{t('privacyPolicy.complianceResponsibilitiesDescription')}</p>

            <h3>{t('privacyPolicy.confidentialityTitle')}</h3>
            <p>{t('privacyPolicy.confidentialityDescription')}</p>

            <h3>{t('privacyPolicy.principlesTitle')}</h3>
            <p>{t('privacyPolicy.principlesDescription')}</p>
            <ul>
              <li>{t('privacyPolicy.principleLegality')}</li>
              <li>{t('privacyPolicy.principleConsent')}</li>
              <li>{t('privacyPolicy.principlePurpose')}</li>
              <li>{t('privacyPolicy.principleProportionality')}</li>
              <li>{t('privacyPolicy.principleQuality')}</li>
              <li>{t('privacyPolicy.principleSecurity')}</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('privacyPolicy.closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;