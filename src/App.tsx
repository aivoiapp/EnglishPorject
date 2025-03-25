import { useState } from 'react';
import { Book } from 'lucide-react';
import { ScheduleSection, HeroSection, ContactSection, PaymentSection, FAQSection, PlacementSection } from './components';

function App() {
  const [name, setName] = useState('');

  // Función para actualizar el nombre desde ContactSection
  const handleNameChange = (newName: string) => {
    setName(newName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Book className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-800">English Academy</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#horarios" className="text-gray-600 hover:text-blue-600">Horarios</a>
              <a href="#precios" className="text-gray-600 hover:text-blue-600">Precios</a>
              <a href="#faq" className="text-gray-600 hover:text-blue-600">FAQ</a>
              <a href="#placement-test" className="text-gray-600 hover:text-blue-600">Placement Test</a>
              <a href="#contacto" className="text-gray-600 hover:text-blue-600">Contacto</a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <HeroSection />
        <ScheduleSection />
        <FAQSection />
        <PlacementSection />
        <ContactSection onNameChange={handleNameChange} />
        <PaymentSection name={name} />
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 English Academy. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;