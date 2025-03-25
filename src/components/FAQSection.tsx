import { HelpCircle } from 'lucide-react';

const FAQSection = () => (
  <section id="faq" className="py-16 bg-gray-50">
    <div className="container mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
        <HelpCircle className="mr-2 h-8 w-8" />
        Preguntas Frecuentes
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Existing questions improved */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">¿Cuánto cuesta el curso?</h3>
          <p className="text-gray-600">
            ¡Aprovecha nuestra oferta especial! <span className="text-blue-600 font-bold">50% de descuento</span>, 
            las clases quedan en solo <span className="line-through">S/. 200</span> <strong>S/. 100</strong> por mes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">¿Puedo tomar solo un mes?</h3>
          <p className="text-gray-600">
            Sí, ofrecemos modalidad mensual. Sin embargo recomendamos un mínimo de 
            <strong> 3 meses</strong> para lograr un progreso significativo en tu inglés.
          </p>
        </div>

        {/* New questions */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">¿Cómo es el proceso de inscripción?</h3>
          <p className="text-gray-600">
            1. Completa el formulario de contacto<br/>
            2. Elige tu horario preferido<br/>
            3. Realiza el pago mediante Yape o tarjeta Visa<br/>
            4. ¡Listo para comenzar!
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">¿Qué requisitos técnicos necesito?</h3>
          <p className="text-gray-600">
            - Computador o laptop con cámara web<br/>
            - Conexión a internet estable<br/>
            - Micrófono funcional<br/>
            - Zoom instalado (te enviaremos el link de acceso)
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">¿Hay certificación?</h3>
          <p className="text-gray-600">
            Al completar cada nivel recibirás un certificado digital con validez internacional 
            que acredita tus horas de estudio y nivel alcanzado.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-semibold mb-2">¿Qué métodos de pago aceptan?</h3>
          <p className="text-gray-600">
            - Yape: +51 926 328 988<br/>
            - Tarjetas Visa/Mastercard<br/>
            - Transferencia bancaria<br/>
            - Pago en efectivo (coordinación previa)
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default FAQSection;