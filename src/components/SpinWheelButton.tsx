import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaRandom } from 'react-icons/fa';
import SpinWheel from './SpinWheel';
import { Tooltip } from './index';

const SpinWheelButton: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip content={t('spinWheel.tooltipText', 'Gira la ruleta y gana')} placement="bottom">
        <button
          onClick={openModal}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white transition-colors"
          aria-label={t('spinWheel.title', 'Gira la ruleta')}
        >
          <FaRandom className="w-5 h-5" />
        </button>
      </Tooltip>
      <SpinWheel isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default SpinWheelButton;