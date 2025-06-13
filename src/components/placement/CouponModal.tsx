import { useState, useEffect } from 'react';
import { FaCopy, FaGift, FaCheckCircle } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { t } from 'i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function CouponModal({
  isOpen,
  code,
  onClose
}: {
  isOpen: boolean;
  code: string;
  onClose: () => void;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };
  // Efecto para la animación del código
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const codeElement = document.getElementById('coupon-code');
        if (codeElement) {
          codeElement.classList.add('animate-pulse');
          setTimeout(() => {
            codeElement.classList.remove('animate-pulse');
          }, 1500);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center"
          static
        >
          {/* Fondo con efecto de desenfoque similar al de la ruleta */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
          >
            <Dialog.Panel className="w-full max-w-md rounded-3xl bg-white/90 dark:bg-gray-800/90 p-8 relative shadow-2xl backdrop-blur-md border border-white/20 dark:border-gray-700/30">
              <div className="text-center">
                <motion.div 
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mb-4 text-5xl text-green-500 dark:text-green-400"
                >
                  <FaGift />
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-200"
                >
                  {t('couponModal.title', '¡Tu cupón de descuento!')}
                </motion.div>
                
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  id="coupon-code"
                  className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl border-2 border-dashed border-green-400 dark:border-green-600"
                >
                  <span className="text-3xl font-mono font-bold tracking-wider text-green-600 dark:text-green-400">
                    {code}
                  </span>
                </motion.div>
                
                {isCopied && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400"
                  >
                    <FaCheckCircle />
                    {t('couponModal.copied', '¡Copiado al portapapeles!')}
                  </motion.div>
                )}
                
                <div className="flex gap-4 justify-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 shadow-md"
                  >
                    <FaCopy />
                    {t('common.copyButton', 'Copiar')}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="rounded-lg bg-gray-600 px-6 py-3 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 shadow-md"
                  >
                    {t('common.closeButton', 'Cerrar')}
                  </motion.button>
                </div>
              </div>
            </Dialog.Panel>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}