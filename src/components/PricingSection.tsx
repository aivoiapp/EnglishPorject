import { Sparkles, CheckCircle2 } from 'lucide-react';

const PricingSection = () => (
  <section id="precios" className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 flex items-center justify-center">
          <Sparkles className="mr-3 h-8 w-8" />
          ¡Oferta Especial!
        </h2>
        <div className="inline-block bg-yellow-400 text-blue-900 px-6 py-2 rounded-full text-lg font-bold animate-bounce">
          50% de Descuento
        </div>
      </div>
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <div className="relative">
          <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-lg">
            ¡LIMITADO!
          </div>
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="flex justify-center items-center gap-2 mb-4">
                <span className="text-4xl font-bold line-through text-gray-400 dark:text-gray-500">S/. 200</span>
                <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">S/. 100</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">/mes</span>
            </div>
            <ul className="space-y-4">
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                Clases virtuales en vivo
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                2 sesiones semanales
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                Material didáctico incluido
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                Profesores nativos
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                Grupos reducidos
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-8 hover:bg-blue-700 transition-colors flex items-center justify-center">
              <span className="mr-2">¡Reserva tu plaza!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PricingSection;