import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ScheduleSection, HeroSection, PaymentSection, FAQSection, PlacementSection, BenefitsSection, AudienceSection, CurriculumSection, ProfessorsSection, FloatingContactButton, AdContainer } from './components';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import CountrySelector from './components/CountrySelector';
import { AdsProvider, LanguageProvider, CurrencyProvider } from './context';
import { useTranslation } from 'react-i18next';
import GuidedTour from './components/GuidedTour';

function App() {
  const { t } = useTranslation();
  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    group: '',
    documentType: 'dni',
    documentNumber: ''
  });
  
  // Estado para controlar el menú móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Cerrar el menú móvil cuando se cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manejador para actualizar el nombre desde el componente ContactSection
  const handleNameChange = (newName: string) => {
    setUserData(prev => ({ ...prev, name: newName }));
  };

  // Manejador para recibir los datos del formulario de HeroSection
  const handleHeroFormSubmit = (name: string, email: string, phone: string) => {
    console.log('Datos recibidos del formulario Hero:', { name, email, phone });

    const sanitizedData = {
      name: name || '',
      email: email || '',
      phone: phone || '',
      group: '',
      documentType: 'dni', // Default value
      documentNumber: '' // Default value
    };

    setUserData(sanitizedData);
    console.log('Estado actualizado con:', sanitizedData);

    const paymentSection = document.getElementById('payment');
    if (paymentSection) {
      setTimeout(() => {
        paymentSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AdsProvider>
          <GuidedTour />
          <div className="min-h-screen bg-gradient-to-b from-[#f5f5f0] to-[#f0f0e8] dark:from-gray-900 dark:to-gray-800 dark:text-white">
            <header className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-[100]"> 
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src="/images/Cytalk_logo.png" alt="CyTalk Logo" className="h-10 w-10" />
                    <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">Cytalk English Academy</span>
                  </div>
                  
                  <nav className="hidden md:flex space-x-8">
                    <a href="#audiencia" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">{t('header.audience', 'Audiencia')}</a>
                    <a href="#curriculum" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">{t('header.curriculum', 'Curriculum')}</a>
                    <a href="#profesores" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">{t('header.professors', 'Profesores')}</a>
                    <a href="#horarios" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">{t('header.schedule', 'Horarios')}</a>
                    <a href="#faq" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">{t('header.faq', 'FAQ')}</a>
                    <a href="#evaluacion" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">{t('header.placementTest', 'Placement Test')}</a>
                  </nav>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                      <CountrySelector compact={true} />
                      <LanguageSelector />
                      <ThemeToggle />
                    </div>
                    
                    {/* Botón de menú móvil */}
                    <button 
                      className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      aria-label="Toggle menu"
                    >
                      {mobileMenuOpen ? (
                        <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                      ) : (
                        <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Menú móvil desplegable */}
              {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-20 border-t border-gray-200 dark:border-gray-700">
                  <div className="container mx-auto px-6 py-4">
                    <nav className="flex flex-col space-y-4 mb-6">
                      <a 
                        href="#audiencia" 
                        className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('header.audience', 'Audiencia')}
                      </a>
                      <a 
                        href="#curriculum" 
                        className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('header.curriculum', 'Curriculum')}
                      </a>
                      <a 
                        href="#profesores" 
                        className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('header.professors', 'Profesores')}
                      </a>
                      <a 
                        href="#horarios" 
                        className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('header.schedule', 'Horarios')}
                      </a>
                      <a 
                        href="#faq" 
                        className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('header.faq', 'FAQ')}
                      </a>
                      <a 
                        href="#evaluacion" 
                        className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('header.placementTest', 'Placement Test')}
                      </a>
                    </nav>
                    
                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                      <CountrySelector compact={true} />
                      <LanguageSelector />
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              )}
            </header>

            <main className="pt-20"> {/* Add padding to prevent content from being hidden behind the fixed header */}
              <HeroSection onFormSubmit={handleHeroFormSubmit} />
              <BenefitsSection />
              
              {/* Anuncio entre secciones (después de Benefits) */}
              <AdContainer 
                position="between-sections" 
                adClient="ca-pub-XXXXXXXXXXXXXXXX" 
                adSlot="XXXXXXXXXX" 
                className="container mx-auto px-6" 
              />
              
              <AudienceSection />
              <CurriculumSection />
              
              {/* Anuncio entre secciones (después de Curriculum) */}
              <AdContainer 
                position="between-sections" 
                adClient="ca-pub-XXXXXXXXXXXXXXXX" 
                adSlot="XXXXXXXXXX" 
                className="container mx-auto px-6" 
              />
              
              <ProfessorsSection />
              <ScheduleSection />
              <FAQSection />
              <PlacementSection />
              <FloatingContactButton onNameChange={handleNameChange} />
              
              {/* Anuncio antes de la sección de pago */}
              <AdContainer 
                position="footer" 
                adClient="ca-pub-XXXXXXXXXXXXXXXX" 
                adSlot="XXXXXXXXXX" 
                className="container mx-auto px-6" 
              />
              
              <PaymentSection 
                name={userData.name} 
                email={userData.email} 
                phone={userData.phone} 
                documentType={userData.documentType} 
                documentNumber={userData.documentNumber} 
              />
            </main>

            <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
              <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <p>&copy; 2024 Cytalk English Academy. {t('footer.copyright', 'Todos los derechos reservados.')}</p>
                  </div>
                  <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
                    <a 
                      href="/privacy-policy.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {t('footer.privacyPolicy', 'Política de Privacidad')}
                    </a>
                    <a 
                      href="/terms.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {t('footer.terms', 'Términos y Condiciones')}
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </AdsProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;