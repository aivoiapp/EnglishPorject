import { useState } from 'react';
import { Book } from 'lucide-react';
import { ScheduleSection, HeroSection, ContactSection, PaymentSection, FAQSection, PlacementSection, BenefitsSection } from './components';

function App() {
  const [name, setName] = useState('');

  // Function to update the name from ContactSection
  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">English Academy</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#horarios" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Horarios</a>
              {/* Remove the "Precios" link */}
              {/* <a href="#precios" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Precios</a> */}
              <a href="#faq" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">FAQ</a>
              <a href="#evaluacion" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Placement Test</a> {/* Ensure correct ID */}
              <a href="#contacto" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Contacto</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <HeroSection />
        <BenefitsSection />
        <ScheduleSection />
        <FAQSection />
        <PlacementSection /> 
        <ContactSection onNameChange={handleNameChange} />
        <PaymentSection name={name} />
      </main>

      <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 English Academy. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;