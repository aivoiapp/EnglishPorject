import { useState, useEffect, useRef, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Sparkles } from 'lucide-react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const GuidedTour = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setIsOpen(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  const steps = useMemo(() => [
    {
      title: t('guidedTour.welcome', '¡Bienvenido a CyTalk!'),
      content: t('guidedTour.welcome.content', 'Te guiaremos para obtener tu cupón y matricularte'),
      target: "#hero",
    },
    {
      title: t('guidedTour.step1', 'Paso 1: Realiza tu prueba de nivel'),
      content: t('guidedTour.step1.content', 'Haz clic aquí para comenzar tu evaluación gratuita'),
      target: "#evaluacion",
    },
    {
      title: t('guidedTour.step2', 'Paso 2: Genera tu cupón'),
      content: t('guidedTour.step2.content', 'Al completar la prueba, obtendrás un código de descuento'),
      target: "#evaluacion",
    },
    {
      title: t('guidedTour.step3', 'Paso 3: Completa tu matrícula'),
      content: t('guidedTour.step3.content', 'Usa tu cupón en la sección de pagos para finalizar'),
      target: "#payment",
    }
  ], [t]); // Only re-create when t function changes

  // Efecto para resaltar el elemento objetivo cuando cambia el paso
  useEffect(() => {
    if (!isOpen) return;

    const targetSelector = steps[currentStep].target;
    const element = document.querySelector(targetSelector) as HTMLElement;
    
    if (element) {
      setTargetElement(element);
      
      // Desplazarse al elemento con un pequeño retraso
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      
      // Actualizar la posición del resaltado
      updateHighlightPosition(element);
    }
  }, [currentStep, isOpen, steps]);

  // Actualizar la posición del resaltado cuando se desplaza la página
  useEffect(() => {
    if (!isOpen || !targetElement) return;
    
    const handleScroll = () => {
      if (targetElement) {
        updateHighlightPosition(targetElement);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isOpen, targetElement]);

  const updateHighlightPosition = (element: HTMLElement) => {
    if (!highlightRef.current) return;
    
    const rect = element.getBoundingClientRect();
    const highlight = highlightRef.current;
    
    highlight.style.top = `${rect.top + window.scrollY - 10}px`;
    highlight.style.left = `${rect.left + window.scrollX - 10}px`;
    highlight.style.width = `${rect.width + 20}px`;
    highlight.style.height = `${rect.height + 20}px`;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTargetElement(null);
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Eliminada la capa de superposición para fondo opaco */}
      
      {/* Resaltado del elemento objetivo con efecto mejorado */}
      <motion.div 
        ref={highlightRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          boxShadow: ['0 0 0 rgba(59, 130, 246, 0.5)', '0 0 20px rgba(59, 130, 246, 0.7)', '0 0 0 rgba(59, 130, 246, 0.5)'],
        }}
        transition={{ 
          boxShadow: { 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut" 
          },
          duration: 0.5 
        }}
        className="fixed z-[1001] border-2 border-blue-400 rounded-lg pointer-events-none bg-gradient-to-r from-blue-400/20 to-purple-400/20 backdrop-blur-sm transition-all duration-300"
      />
      
      {/* Partículas decorativas */}
      <div className="fixed inset-0 z-[1001] pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{ 
              y: [null, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
              opacity: [0, 0.7, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 10, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            className="absolute w-2 h-2 rounded-full bg-blue-400/30 backdrop-blur-sm"
          />
        ))}
      </div>
      
      {/* Diálogo del tour con animación */}
      <Dialog open={isOpen} onClose={handleClose} className="relative z-[1002]">
        <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <Dialog.Panel className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 shadow-2xl pointer-events-auto dark:text-white border border-white/20 dark:border-gray-700/30 overflow-visible">
                {/* Efecto de gradiente en el fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 z-0" />
                
                {/* Efecto de brillo en la esquina */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-2xl z-0" />
                
                <div className="relative z-10">
                  <div className="absolute top-0 right-0 p-2">
                    <motion.button 
                      onClick={handleClose} 
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white/30 dark:bg-gray-700/30 backdrop-blur-sm p-2 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="mr-3 text-blue-500 dark:text-blue-400"
                    >
                      <Sparkles className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {steps[currentStep].title}
                    </h3>
                  </div>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 text-gray-600 dark:text-gray-300 text-lg"
                  >
                    {steps[currentStep].content}
                  </motion.p>
                  
                  <div className="flex flex-col space-y-6">
                    <div className="flex justify-center space-x-4">
                      {steps.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setCurrentStep(index)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentStep 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30 dark:shadow-blue-400/30' 
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-3">
                      {currentStep > 0 && (
                        <motion.button 
                          onClick={handlePrevious}
                          whileHover={{ scale: 1.05, x: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg flex items-center border border-gray-200/50 dark:border-gray-600/30 shadow-sm hover:shadow transition-all duration-300"
                        >
                          <FaArrowLeft className="mr-2 h-3 w-3" />
                          {t('guidedTour.previous', 'Anterior')}
                        </motion.button>
                      )}
                      
                      <motion.button 
                        onClick={handleSkip}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-600/30 shadow-sm hover:shadow transition-all duration-300"
                      >
                        {t('guidedTour.skip', 'Omitir')}
                      </motion.button>
                      
                      <motion.button 
                        onClick={handleNext}
                        whileHover={{ scale: 1.05, x: 2 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-lg flex items-center shadow-lg shadow-blue-500/30 dark:shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-blue-600/40 transition-all duration-300"
                      >
                        {currentStep < steps.length - 1 
                          ? t('guidedTour.next', 'Siguiente') 
                          : t('guidedTour.finish', 'Finalizar')} 
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <FaArrowRight className="ml-2 h-3 w-3" />
                        </motion.div>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </motion.div>
          </AnimatePresence>
        </div>
      </Dialog>
    </>
  );
};

export default GuidedTour;