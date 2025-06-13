import React, { useState } from 'react';
import { Sparkles, BookOpen, Clock, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import { sendHeroFormData } from '../services/makeServiceHero';
import CustomPhoneInput from './CustomPhoneInput';
import { useLanguage } from '../context/useLanguage';
import { useCurrency } from '../context/useCurrency';
import '../phone-input.css';
import { motion } from 'framer-motion';



interface HeroSectionProps {
  onFormSubmit: (name: string, email: string, phone: string) => void; // Update the function signature
}

const HeroSection: React.FC<HeroSectionProps> = ({ onFormSubmit }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  // Agregar nuevo estado para el modal de contacto
  //const [] = useState(false);
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
    <section id="hero" className="relative py-16 md:py-24 bg-gradient-to-br from-[#5B0E88] to-[#C5156E] dark:from-blue-900 dark:to-blue-950 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Contenido Principal */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 space-y-6 text-white"
          >
            <div className="mb-8">
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-yellow-400/20 backdrop-blur-sm inline-block px-4 py-1 rounded-full mb-4"
              >
                <span className="text-lg font-bold text-yellow-400">🎓 {t('hero.discount')}</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                {t('hero.title')}{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                  {t('hero.titleHighlight')}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 dark:text-blue-200 mb-6">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* Beneficios en Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Clock, text: t('hero.benefits.liveClasses') },
                { icon: Award, text: t('hero.benefits.certifications') },
                { icon: Sparkles, text: t('hero.benefits.dynamicClasses') },
                { icon: BookOpen, text: t('hero.benefits.studentCentered') }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.2 }}
                  className="flex items-center p-4 bg-white/10 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm"
                >
                  <item.icon className="w-8 h-8 text-yellow-400 mr-3 flex-shrink-0" />
                  <span className="text-lg font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Precios y Oferta */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 2.3 }}
              className="bg-white/10 dark:bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm"
            >
              <div className="flex items-end gap-4 mb-2">
                <div>
                  <span className="text-2xl line-through text-gray-300">
                    {currencySymbol} {price}
                  </span>
                  <span className="block text-4xl font-bold text-yellow-400">
                    {currencySymbol} {discountedPrice*0.5}
                  </span>
                </div>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {t('hero.pricing.limitedOffer')}
                </span>
              </div>
              <p className="text-blue-100 text-sm">
                {t('hero.pricing.perMonth')} | {t('hero.pricing.fullLevelOffer')}
              </p>
            </motion.div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: 150, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ 
                delay: 0.3,
                type: 'spring',
                stiffness: 120,
                damping: 20,
                mass: 1,
                velocity: 0.1
            }}
            className="relative z-10 bg-[#f6e6fa]/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl ring-2 ring-blue-100 dark:ring-blue-900/40 p-6 md:p-8 backdrop-blur-md"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                {t('hero.form.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {t('hero.form.startDate')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campos del formulario existentes se mantienen igual */}
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
                  {t('hero.form.privacyPolicy')}
                  
                  <button 
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
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out text-lg font-semibold transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                {t('hero.form.buttonText')}
              </button>

              <button
                type="button"
                onClick={() => document.getElementById('placement')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out text-lg font-semibold mt-4 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 dark:focus:ring-yellow-800"
              >
                ¡Descubre tu nivel GRATIS!
              </button>
            </form>

            <PrivacyPolicyModal
              isOpen={isPrivacyModalOpen}
              onClose={() => setIsPrivacyModalOpen(false)}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
