import { RefreshCw, Clock, Brain, Zap, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  // Estados para el contador y la barra de progreso
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  
  // Consejos y mensajes para mostrar durante la carga
  const tips = [
    "¿Sabías que el inglés es el idioma más estudiado del mundo?",
    "Aprender inglés mejora tus oportunidades laborales en un 50%",
    "Estudiar 20 minutos diarios es mejor que 2 horas una vez por semana",
    "El inglés tiene más de 170,000 palabras en uso",
    "Escuchar música en inglés mejora tu comprensión auditiva"
  ];

  // Efecto para actualizar el contador cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Efecto para actualizar la barra de progreso
  useEffect(() => {
    // Simulamos un progreso que llega al 90% en 25 segundos
    // y luego avanza más lento hasta completar
    const interval = setInterval(() => {
      setProgressPercentage(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Progreso más rápido al inicio, más lento al final
        if (prev < 90) {
          return prev + (90 - prev) / 25;
        } else {
          return prev + 0.5;
        }
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Efecto para cambiar el consejo cada 5 segundos
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 5000);

    return () => clearInterval(tipInterval);
  }, [tips.length]);

  // Función para formatear el tiempo transcurrido
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Si es fullScreen, mostramos un loader que ocupa toda la pantalla
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full px-6">
          {/* Cabecera con título y tiempo transcurrido */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <Brain className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-400" />
              {title}
            </h2>
            <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>
          
          {/* Barra de progreso animada */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progreso estimado</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-400 rounded-full transition-all duration-300 relative"
                style={{ width: `${progressPercentage}%` }}
              >
                {/* Efecto de brillo que se mueve a través de la barra */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="h-full w-1/4 bg-white/30 skew-x-30 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mensajes de evaluación con animaciones */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-6 dark:text-white flex items-center">
              <Zap className="mr-2 h-5 w-5 text-yellow-500" />
              Evaluando tus respuestas
            </h3>
            
            <div className="space-y-4">
              {/* Mensajes de evaluación con indicadores de estado */}
              {evaluationMessages.map((message, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border transition-all duration-500 flex items-center
                    ${index === evaluationMessages.length - 1 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 animate-pulse' 
                      : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}
                >
                  {index < evaluationMessages.length - 1 ? (
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 flex-shrink-0" />
                  ) : (
                    <div className="h-5 w-5 mr-3 flex-shrink-0 relative">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent"></div>
                    </div>
                  )}
                  <span className="dark:text-gray-300">{message}</span>
                </div>
              ))}
              
              {/* Indicador de actividad cuando hay mensajes pero no están completos */}
              {evaluationMessages.length > 0 && evaluationMessages.length < 6 && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center">
                  <div className="flex space-x-1 mr-3">
                    <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Procesando...</span>
                </div>
              )}
            </div>
            
            {/* Consejos que cambian automáticamente */}
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-300 italic">
                <span className="font-semibold">Mientras esperas:</span> {tips[currentTip]}
              </p>
            </div>
          </div>
          
          {/* Mensaje de pie */}
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
            {subtitle}
          </p>
        </div>
      </div>
    );
  }
  
  // Si no es fullScreen, mostramos un loader en un contenedor
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="relative mr-3">
            <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <div className="text-blue-600 dark:text-blue-400 font-bold">{title}</div>
        </div>
        <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>
      
      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>Progreso estimado</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Evaluando tus respuestas</h3>
      
      <div className="space-y-3">
        {evaluationMessages.map((message, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg border transition-all duration-500
              ${index === evaluationMessages.length - 1 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 animate-pulse' 
                : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'}`}
          >
            <span className="dark:text-gray-300 text-sm">{message}</span>
          </div>
        ))}
        
        {evaluationMessages.length > 0 && evaluationMessages.length < 6 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Consejo que cambia automáticamente */}
      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800 rounded-lg">
        <p className="text-xs text-yellow-800 dark:text-yellow-300 italic">
          {tips[currentTip]}
        </p>
      </div>
    </div>
  );
};

export default Loader;