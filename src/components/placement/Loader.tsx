import { RefreshCw } from 'lucide-react';

interface LoaderProps {
  // Propiedades para personalizar el loader
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
  evaluationMessages?: string[];
}

const Loader = ({
  title = "Procesando...",
  subtitle = "Por favor espera unos segundos",
  fullScreen = true,
  evaluationMessages = []
}: LoaderProps) => {
  // Si es fullScreen, mostramos un loader que ocupa toda la pantalla
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent dark:border-t-transparent mb-4"></div>
        <p className="text-xl text-gray-700 dark:text-gray-200 font-medium">{title}</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
        
        {/* Si hay mensajes de evaluación, los mostramos */}
        {evaluationMessages.length > 0 && (
          <div className="max-w-2xl mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold mb-6 dark:text-white">Evaluando tus respuestas</h3>
            <div className="space-y-4">
              {evaluationMessages.map((message, index) => (
                <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse transition-all duration-300 border border-blue-100 dark:border-blue-800 dark:text-gray-300">
                  {message}
                </div>
              ))}
              {evaluationMessages.length > 0 && evaluationMessages.length < 6 && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 flex items-center justify-center">
                  <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Si no es fullScreen, mostramos un loader en un contenedor
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative">
          <RefreshCw className="h-16 w-16 text-blue-600 dark:text-blue-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 bg-white dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
        <div className="mt-4 text-blue-600 dark:text-blue-400 font-bold text-lg">{title}</div>
      </div>
      <h3 className="text-xl font-semibold mb-6 dark:text-white">Evaluando tus respuestas</h3>
      
      <div className="space-y-4">
        {evaluationMessages.map((message, index) => (
          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse transition-all duration-300 border border-blue-100 dark:border-blue-800 dark:text-gray-300">
            {message}
          </div>
        ))}
        {evaluationMessages.length > 0 && evaluationMessages.length < 6 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 dark:border-blue-400 border-t-transparent dark:border-t-transparent mb-4"></div>
            <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;