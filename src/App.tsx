import { useState } from 'react';
import { Book } from 'lucide-react';
import { ScheduleSection, HeroSection, PaymentSection, FAQSection, PlacementSection, BenefitsSection, AudienceSection, CurriculumSection, ProfessorsSection, FloatingContactButton, AdContainer } from './components';
import ThemeToggle from './components/ThemeToggle';
import LanguageSelector from './components/LanguageSelector';
import { AdsProvider, LanguageProvider } from './context';

function App() {
  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    group: '',
    documentType: 'dni',
    documentNumber: ''
  });

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
      <AdsProvider>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow-lg fixed w-full z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">English Academy</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#audiencia" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Audiencia</a>
              <a href="#curriculum" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Curriculum</a>
              <a href="#profesores" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Profesores</a>
              <a href="#horarios" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Horarios</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">FAQ</a>
              <a href="#evaluacion" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Placement Test</a>
            </nav>

            <div className="flex items-center gap-4">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </div>
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
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 English Academy. Todos los derechos reservados.</p>
        </div>
      </footer>
      </div>
    </AdsProvider>
  </LanguageProvider>
  );
}

export default App;