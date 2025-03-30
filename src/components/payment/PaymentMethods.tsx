import React from 'react';
import { FaUniversity, FaQrcode, FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { PaymentMethodType, usePaymentContext } from './paymentTypes';


const PaymentMethods: React.FC = () => {
  const { formData, handleInputChange, handlePaymentMethodChange } = usePaymentContext();
  
  const renderPaymentOptions = () => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">Selecciona tu método de pago</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md ${formData.paymentMethod === 'transferencia' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}`}
          onClick={() => handlePaymentMethodChange('transferencia' as PaymentMethodType)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4 relative">
              <FaUniversity className="text-blue-600 dark:text-blue-400 text-3xl" />
              {formData.paymentMethod === 'transferencia' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                >
                  <FaCheckCircle className="text-white text-lg" />
                </motion.div>
              )}
            </div>
            <h4 className="font-medium text-lg mb-2 dark:text-white">Transferencia Bancaria</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Transfiere desde tu app bancaria</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md ${formData.paymentMethod === 'yape-qr' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'}`}
          onClick={() => handlePaymentMethodChange('yape-qr' as PaymentMethodType)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full mb-4 relative">
              <FaQrcode className="text-purple-600 dark:text-purple-400 text-3xl" />
              {formData.paymentMethod === 'yape-qr' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                >
                  <FaCheckCircle className="text-white text-lg" />
                </motion.div>
              )}
            </div>
            <h4 className="font-medium text-lg mb-2 dark:text-white">Yape con QR</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Escanea el código QR con tu app</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md ${formData.paymentMethod === 'tarjeta' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'}`}
          onClick={() => handlePaymentMethodChange('tarjeta' as PaymentMethodType)}
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4 relative">
              <FaCreditCard className="text-green-600 dark:text-green-400 text-3xl" />
              {formData.paymentMethod === 'tarjeta' && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                >
                  <FaCheckCircle className="text-white text-lg" />
                </motion.div>
              )}
            </div>
            <h4 className="font-medium text-lg mb-2 dark:text-white">Tarjeta de Crédito/Débito</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Paga con tu tarjeta bancaria</p>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderPaymentInstructions = () => {
    if (!formData.paymentMethod) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-4 text-center"
        >
          <p className="text-blue-800 dark:text-blue-300">Selecciona un método de pago para continuar</p>
        </motion.div>
      );
    }
    
    switch (formData.paymentMethod) {
      case 'transferencia':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg mb-4 shadow-sm"
          >
            <h4 className="font-medium text-lg mb-3 text-blue-800 dark:text-blue-300">Instrucciones para Transferencia Bancaria</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Realiza una transferencia a la cuenta del banco BCP: 
              <span className="font-bold block mt-2 text-blue-700 dark:text-blue-400 text-lg"> Cuenta soles:  25503448520089</span>
              <span className="font-bold block mt-2 text-blue-700 dark:text-blue-400 text-lg"> Cuenta interbacaria soles: 00225510344852008981
              </span>
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Realiza una transferencia a la cuenta del banco BBVA: 
              <span className="font-bold block mt-2 text-blue-700 dark:text-blue-400 text-lg"> Cuenta sole: 0011-0831-0200350764</span>
              <span className="font-bold block mt-2 text-blue-700 dark:text-blue-400 text-lg"> Cuenta interbacaria soles: 011-831-000200350764-53
              </span>
            </p>
            <div className="mt-4">

              <label htmlFor="operationNumber" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Código de Operación
              </label>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
              Una vez completada la transferencia, regrese a este espacio e ingrese el número de transacción o código de operación en el campo correspondiente
              </p>
              <input
                type="text"
                id="operationNumber"
                name="operationNumber"
                value={formData.operationNumber}
                onChange={handleInputChange}
                placeholder="Ingresa el código de operación"
                className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                required
              />
            </div>
          </motion.div>
        );

      case 'yape-qr':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-6 rounded-lg mb-4 shadow-sm"
          >
            <h4 className="font-medium text-lg mb-3 text-purple-800 dark:text-purple-300">Instrucciones para Yape con QR</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Escanea el siguiente código QR con la app de Yape:
            </p>
            <div className="flex justify-center my-5">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-56 h-56 bg-white flex items-center justify-center border-2 border-purple-200 dark:border-purple-700 rounded-lg shadow-md overflow-hidden"
              >
                <img src="/images/QR.jpg" alt="Código QR de Yape" className="w-full h-full object-cover" />
              </motion.div>
            </div>
            <div className="mt-4">
              <label htmlFor="operationNumber" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Número de Operación
              </label>
              <input
                type="text"
                id="operationNumber"
                name="operationNumber"
                value={formData.operationNumber}
                onChange={handleInputChange}
                placeholder="Ingresa el número de operación de Yape"
                className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                required
              />
            </div>
          </motion.div>
        );

      case 'tarjeta':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-lg mb-4 shadow-sm"
          >
            <h4 className="font-medium text-lg mb-3 text-green-800 dark:text-green-300">Instrucciones para Pago con Tarjeta</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Completa los datos de tu tarjeta de crédito o débito:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div className="md:col-span-2">
                <label htmlFor="bank" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Banco Emisor
                </label>
                <select
                  id="bank"
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                  required
                >
                  <option value="">Selecciona tu banco</option>
                  <option value="BCP">BCP</option>
                  <option value="Interbank">Interbank</option>
                  <option value="BBVA">BBVA</option>
                  <option value="Scotiabank">Scotiabank</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="operationNumber" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Número de Operación
                </label>
                <input
                  type="text"
                  id="operationNumber"
                  name="operationNumber"
                  value={formData.operationNumber}
                  onChange={handleInputChange}
                  placeholder="Ingresa el número de operación de tu tarjeta"
                  className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                  required
                />
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {renderPaymentOptions()}
      {renderPaymentInstructions()}
    </motion.div>
  );
};

export default PaymentMethods;