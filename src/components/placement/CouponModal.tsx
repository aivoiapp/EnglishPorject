import { useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { t } from 'i18next';

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
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-8 dark:bg-gray-800">
        <div className="text-center">
          <div className="mb-6 text-4xl font-bold text-green-600 dark:text-green-400">
            🎉 {code}
          </div>
          {isCopied && (
            <div className="mb-4 text-sm text-green-600 dark:text-green-400">
              ¡Copiado al portapapeles!
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <FaCopy />
              {t('common.copyButton')}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800"
            >
              {t('common.closeButton')}
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}