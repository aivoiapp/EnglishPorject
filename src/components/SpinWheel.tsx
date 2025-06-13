import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import CouponModal from './placement/CouponModal';
import { wheelService } from '../services/wheelService';
import { WheelSegment } from '../types/wheelTypes';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { FaSpinner } from 'react-icons/fa';
import { FaRedo } from 'react-icons/fa';

interface SpinWheelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Modificar los segmentos para incluir más opciones de "Inténtalo de nuevo"
const wheelSegments: WheelSegment[] = [
  { color: '#FF6384', label: '5%', value: 5 },
  { color: '#36A2EB', label: '10%', value: 10 },
  { color: '#C9CBCF', label: '↻', value: 0 }, // Reemplazado por un icono
  { color: '#4BC0C0', label: '20%', value: 20 },
  { color: '#9966FF', label: '25%', value: 25 },
  { color: '#C9CBCF', label: '↻', value: 0 }, // Reemplazado por un icono
  { color: '#FF9F40', label: '30%', value: 30 },
  { color: '#C9CBCF', label: '↻', value: 0 }, // Reemplazado por un icono
  { color: '#8BC34A', label: '40%', value: 40 },
  { color: '#C9CBCF', label: '↻', value: 0 }, // Reemplazado por un icono
];

const SpinWheel: React.FC<SpinWheelProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<WheelSegment | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [spinAnim, setSpinAnim] = useState({});
  const [isGeneratingCoupon, setIsGeneratingCoupon] = useState(false);
  const [couponGenerated, setCouponGenerated] = useState(false);
  const wheelRef = useRef<SVGSVGElement>(null);
  const { width, height } = useWindowSize();

  // Reiniciar el estado cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setIsSpinning(false);
      setSelectedSegment(null);
      setShowCouponModal(false);
      setCouponCode('');
      setError(null);
      setSpinAnim({});
      setIsGeneratingCoupon(false);
      setCouponGenerated(false);
    }
  }, [isOpen]);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedSegment(null);
    setError(null);
    setCouponGenerated(false);
    
    // Mejorar la aleatoriedad con más giros y variación en la velocidad
    const spinCount = 8 + Math.random() * 8; // Más giros para una experiencia más emocionante
    const baseRotation = spinCount * 360;
    const randomAngle = Math.floor(Math.random() * 360);
    const totalRotation = baseRotation + randomAngle;
    
    // Duración variable para hacer cada giro único
    const duration = 5 + Math.random() * 2;
    
    setSpinAnim({
      rotate: totalRotation,
      transition: {
        duration: duration,
        ease: [
          0.2, // Inicio más rápido
          0.0, // Aceleración rápida
          0.22, // Mantiene velocidad
          0.99  // Desaceleración gradual al final
        ],
        type: "spring", // Añade un efecto de rebote al final
        stiffness: 25,
        damping: 15
      },
    });
    
    setTimeout(() => {
      try {
        const segmentAngle = 360 / wheelSegments.length;
        const finalAngle = totalRotation % 360;
        
        // Calcular el ángulo apuntado considerando la posición del indicador (arriba)
        const anglePointedAt = (360 - finalAngle + 270) % 360; // Compensar 270° para alinear coordenadas SVG
        const segmentIndex = Math.floor(anglePointedAt / segmentAngle) % wheelSegments.length;
        const winningSegment = wheelSegments[segmentIndex];
                      
        setSelectedSegment(winningSegment);
        setIsSpinning(false);
        // NO generar cupón automáticamente - solo mostrar el resultado
      } catch {
        setIsSpinning(false);
        setError('Ocurrió un error al girar la ruleta. Por favor, inténtalo de nuevo.');
      }
    }, duration * 1000); // Ajustar el tiempo de espera según la duración de la animación
  };

  // Función para generar un cupón cuando se presiona el botón
  const generateCoupon = async (discountPercentage: number) => {
    try {
      setIsGeneratingCoupon(true);
      setError(null);
      
      // Llamar al servicio para generar el cupón
      const result = await wheelService.generateCoupon(discountPercentage);
      
      if (result.success && result.code) {
        setCouponCode(result.code);
        setShowCouponModal(true);
        setCouponGenerated(true);
      } else {
        // Si hay un error en la API, usar el cupón de respaldo
        const fallbackResult = wheelService.generateFallbackCoupon(discountPercentage);
        setCouponCode(fallbackResult.code || '');
        setShowCouponModal(true);
        setCouponGenerated(true);
      }
    } catch (err) {
      console.error('Error al generar el cupón:', err);
      setError(t('spinWheel.error', 'Ocurrió un error al girar la ruleta. Por favor, inténtalo de nuevo.'));
      
      // Usar el cupón de respaldo en caso de error
      const fallbackResult = wheelService.generateFallbackCoupon(discountPercentage);
      setCouponCode(fallbackResult.code || '');
      setShowCouponModal(true);
      setCouponGenerated(true);
    } finally {
      setIsGeneratingCoupon(false);
    }
  };

  const handleCloseCouponModal = () => {
    setShowCouponModal(false);
  };

  const handleButtonClick = () => {
    if (selectedSegment && selectedSegment.value > 0) {
      generateCoupon(selectedSegment.value);
    } else {
      spinWheel();
    }
  };

  const radius = 120;
  const center = 140;
  const segmentAngle = 360 / wheelSegments.length;

  // Estilos CSS para el triángulo indicador
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .clip-triangle {
        clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
      }
      .clip-triangle-inner {
        clip-path: polygon(50% 90%, 10% 10%, 90% 10%);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const renderWheel = () => (
    <svg ref={wheelRef} width={300} height={300} viewBox="0 0 280 280" className="drop-shadow-2xl">
      {/* Borde exterior brillante */}
      <circle cx={center} cy={center} r={radius + 5} fill="url(#outerRingGradient)" />
      
      {wheelSegments.map((segment, i) => {
        const startAngle = i * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        const largeArc = segmentAngle > 180 ? 1 : 0;
        const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
        const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
        const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
        const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);
        const pathData = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
        
        // Calcular ángulo para el texto y ajustar para que sea legible
        const textAngle = startAngle + segmentAngle / 2;
        const textRadius = radius * 0.7;
        const textX = center + textRadius * Math.cos((Math.PI * textAngle) / 180);
        const textY = center + textRadius * Math.sin((Math.PI * textAngle) / 180);
        
        // Determinar si el texto debe rotarse para mejor legibilidad
        let textRotation = textAngle;
        if (textAngle > 90 && textAngle < 270) {
          textRotation = textAngle + 180;
        }
        
        return (
          <g key={i}>
            {/* Segmento con gradiente y brillo */}
            <defs>
              <linearGradient id={`segmentGradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={segment.color} stopOpacity="1" />
                <stop offset="100%" stopColor={segment.color} stopOpacity="0.7" />
              </linearGradient>
              <filter id={`glow${i}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <path 
              d={pathData} 
              fill={`url(#segmentGradient${i})`} 
              stroke="#fff" 
              strokeWidth={2} 
              filter={`url(#glow${i})`}
            />
            
            {/* Texto del segmento con mejor legibilidad */}
            <text
              x={textX}
              y={textY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={segment.value === 0 ? "24" : "18"}
              fontWeight="bold"
              fill="#fff"
              transform={`rotate(${textRotation},${textX},${textY})`}
              style={{ filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.6))' }}
            >
              {segment.label}
            </text>
          </g>
        );
      })}
      
      {/* Centro de la ruleta con efecto de cristal mejorado */}
      <circle cx={center} cy={center} r={60} fill="url(#glassGradient)" />
      <circle cx={center} cy={center} r={55} fill="url(#innerGlassGradient)" />
      
      {/* Reflejo en el centro */}
      <ellipse 
        cx={center-10} 
        cy={center-15} 
        rx={25} 
        ry={15} 
        fill="#ffffff" 
        opacity="0.3" 
        transform="rotate(-30,${center},${center})"
      />
      
      <defs>
        {/* Gradiente para el borde exterior */}
        <radialGradient id="outerRingGradient" cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="#f0f0f0" />
          <stop offset="100%" stopColor="#c0c0c0" />
        </radialGradient>
        
        {/* Gradiente para el efecto de cristal */}
        <radialGradient id="glassGradient" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e0e7ef" stopOpacity="0.4" />
        </radialGradient>
        
        {/* Gradiente interior para efecto de profundidad */}
        <radialGradient id="innerGlassGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f8f8f8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d0d8e8" stopOpacity="0.2" />
        </radialGradient>
      </defs>
    </svg>
  );

  return (
    <>
      <Dialog 
        open={isOpen} 
        onClose={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Fondo con efecto de desenfoque para un aspecto más moderno - ahora transparente */}
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        
        <Dialog.Panel className="w-full max-w-md rounded-3xl bg-transparent p-8 relative shadow-2xl backdrop-blur-md border border-white/20">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-100 hover:text-white bg-gray-800/30 rounded-full p-1.5 backdrop-blur-sm"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white bg-clip-text">
              {t('spinWheel.title', '¡Gira la Ruleta!')}
            </h2>
            <p className="text-white/90 mt-2">
              {t('spinWheel.subtitle', 'Prueba tu suerte y gana un descuento para tu curso de inglés en Cytalk')}
            </p>
          </div>
          <div className="relative w-80 h-80 mx-auto my-8 flex items-center justify-center">
            {/* Indicador (flecha) mejorado - ahora apunta hacia abajo */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10 select-none">
              <div className="w-8 h-10 bg-gradient-to-b from-red-500 to-red-700 clip-triangle shadow-lg flex items-center justify-center">
                <div className="w-6 h-8 bg-gradient-to-b from-red-400 to-red-600 clip-triangle-inner"></div>
              </div>
            </div>
            {/* Ruleta SVG animada con sombra mejorada */}
            <motion.div
              className="w-80 h-80 rounded-full flex items-center justify-center shadow-[0_10px_50px_rgba(0,0,0,0.3)]"
              animate={spinAnim}
              style={{ originX: 0.5, originY: 0.5 }}
            >
              {renderWheel()}
            </motion.div>
          </div>
          <div className="text-center mt-6">
            {error && (
              <p className="text-red-400 mb-4">
                {t('spinWheel.error', 'Ocurrió un error al girar la ruleta. Por favor, inténtalo de nuevo.')}
              </p>
            )}
            {selectedSegment ? (
              selectedSegment.value > 0 ? (
                <p className="text-xl font-bold text-green-400 mb-4">
                  {t('spinWheel.congratulations', 'Congratulations! You won a {{value}}% discount', { value: selectedSegment.value })}
                </p>
              ) : (
                <p className="text-lg font-bold text-white mb-4 px-2">
                  {t('spinWheel.tryAgain', 'Try again!')}
                </p>
              )
            ) : null}
            <div className="flex justify-center space-x-4">
              {selectedSegment && selectedSegment.value > 0 && !couponGenerated ? (
                <button
                  onClick={handleButtonClick}
                  disabled={isGeneratingCoupon}
                  className={`px-6 py-3 rounded-full font-bold text-white transition-colors ${isGeneratingCoupon ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isGeneratingCoupon ? 
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      {t('spinWheel.generatingCoupon', 'Generando cupón...')}
                    </span> : 
                    t('spinWheel.getCouponButton', 'Obtener mi cupón')
                  }
                </button>
              ) : selectedSegment && selectedSegment.value > 0 && couponGenerated ? (
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full font-bold text-white bg-gray-600 hover:bg-gray-700 transition-colors"
                >
                  {t('common.closeButton', 'Cerrar')}
                </button>
              ) : (
                <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className={`px-6 py-3 rounded-full font-bold text-white transition-colors ${isSpinning ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isSpinning ? 
                    t('spinWheel.spinning', 'Girando...') : 
                    (selectedSegment && selectedSegment.value === 0 ? 
                      <span className="flex items-center justify-center">
                        <FaRedo className="mr-2" />
                        {t('spinWheel.spinButton', '¡Girar de nuevo!')}
                      </span> : 
                      t('spinWheel.spinButton', '¡Girar!')
                    )
                  }
                </button>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
      {selectedSegment && selectedSegment.value > 0 && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={800}
          gravity={0.3}
          colors={['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0', '#ff9800']}
          confettiSource={{
            x: width / 2,
            y: height / 3,
            w: 0,
            h: 0
          }}
        />
      )}
      <CouponModal 
        isOpen={showCouponModal} 
        code={couponCode} 
        onClose={handleCloseCouponModal} 
      />
    </>
  );
};

export default SpinWheel;