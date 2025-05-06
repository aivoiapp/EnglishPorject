import React, { useState } from 'react';
import { Sparkles, CheckCircle2, BookOpen, Clock, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import { sendHeroFormData } from '../services/makeService';
import CustomPhoneInput from './CustomPhoneInput';
import { useLanguage } from '../context/useLanguage';
import { useCurrency } from '../context/useCurrency';
import '../phone-input.css';

interface HeroSectionProps {
  onFormSubmit: (name: string, email: string, phone: string) => void; // Update the function signature
}

const HeroSection: React.FC<HeroSectionProps> = ({ onFormSubmit }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { currencySymbol, price, discountedPrice } = useCurrency();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) {
      const message = language === 'es' ? 'Debes aceptar el aviso de privacidad para continuar' : 'You must accept the privacy policy to continue';
      alert(message);
      return;
    }
    console.log('Enviando datos del formulario:', { name, email, phone, privacyAccepted });
    
    try {
      await sendHeroFormData({
        name,
        email,
        phone
      });
      console.log('Datos enviados correctamente a Make.com');
      
      onFormSubmit(name, email, phone); // Remove extra arguments
    } catch (error) {
      console.error('Error al enviar datos a Make.com:', error);
      onFormSubmit(name, email, phone); // Remove extra arguments
    }
  };

  return (
    <section id="hero" className="py-12 md:py-20 bg-gradient-to-br from-blue-700 to-blue-900 dark:from-blue-900 dark:to-blue-950 text-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Columna izquierda - Contenido */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('hero.title')} <span className="text-yellow-400">{t('hero.titleHighlight')}</span>
              </h1>
              <p className="text-xl md:text-2xl mb-6">
                {t('hero.subtitle')}
              </p>
              <div className="inline-block bg-yellow-400 text-blue-900 px-6 py-2 rounded-full text-lg font-bold animate-bounce mb-6">
                {t('hero.discount')}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">{t('hero.whyChooseUs')}</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                  <span>{t('hero.benefits.liveClasses')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                  <span>{t('hero.benefits.sessions')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                  <span>{t('hero.benefits.studentCentered')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
                  <span>{t('hero.benefits.dynamicClasses')}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <BookOpen className="w-6 h-6 text-yellow-400 mr-2" />
                <span>{t('hero.features.allLevels')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-yellow-400 mr-2" />
                <span>{t('hero.features.duration')}</span>
              </div>
              <div className="flex items-center">
                <Award className="w-6 h-6 text-yellow-400 mr-2" />
                <span>{t('hero.features.certifications')}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold line-through text-gray-400">{currencySymbol} {price*0.5}</span>
                <span className="text-5xl font-bold text-yellow-400">{currencySymbol} {discountedPrice*0.5}</span>
                <span className="text-gray-300">{t('hero.pricing.perMonth')}</span>
              </div>
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                {t('hero.pricing.limitedOffer')}
              </div>
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl shadow-2xl overflow-hidden p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">{t('hero.form.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('hero.form.startDate')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('hero.form.fullName')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('hero.form.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <CustomPhoneInput
                  label={t('hero.form.whatsapp')}
                  defaultCountry="PE"
                  value={phone}
                  onChange={(value) => setPhone(value || '')}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="privacy-policy"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="privacy-policy" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {t('hero.form.privacyPolicy')} <button 
                    type="button"
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    {t('hero.form.privacyPolicyLink')}
                  </button>
                </label>
              </div>

              <button
                type="submit"
                disabled={!privacyAccepted}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {t('hero.form.submitButton')}
              </button>
              
              <PrivacyPolicyModal 
                isOpen={isPrivacyModalOpen} 
                onClose={() => setIsPrivacyModalOpen(false)} 
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;