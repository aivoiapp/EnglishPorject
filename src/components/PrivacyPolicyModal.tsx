import React from 'react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">Política de Privacidad</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="prose dark:prose-invert max-w-none">
            <h3>1. OBJETIVO DE LA POLÍTICA</h3>
            <p>
              El presente documento tiene como objetivo establecer principios, prácticas uniformes y responsabilidades 
              referidas al tratamiento de datos personales realizado por nuestra Academia de Inglés.
            </p>

            <h3>2. ALCANCE</h3>
            <p>
              La presente política es aplicable a todos los bancos de datos personales o datos personales destinados 
              a estar contenidos en bancos de datos y al tratamiento de éstos que realice nuestra Academia de Inglés 
              de manera directa y/o a través de terceros. Esta política deberá ser conocida y cumplida por todos los 
              empleados de la organización.
            </p>

            <h3>3. TÉRMINOS CLAVE</h3>
            <p>
              <strong>Academia de Inglés:</strong> Se refiere a todos los profesores, personal administrativo y usuarios 
              que forman parte de nuestra institución educativa.
            </p>

            <h3>4. DETALLE DE LA POLÍTICA</h3>
            <p>
              Nuestra Academia de Inglés se encuentra obligada a cumplir con las legislaciones que correspondan en materia 
              de protección de datos personales. Dichas normativas obligan a nuestra institución, fundamentalmente a:
            </p>
            <ul>
              <li>La recopilación y el uso de la información personal.</li>
              <li>La calidad y la seguridad de la información.</li>
              <li>Los derechos de las personas con respecto a la información sobre sí mismos.</li>
            </ul>
            <p>
              Nuestra Academia de Inglés se encuentra comprometida con la protección, el manejo y tratamiento adecuado 
              de los datos personales a los que tiene acceso en la operación de sus servicios educativos.
            </p>
            <p>
              La presente política de protección de datos personales recoge las prácticas desarrolladas por nuestra 
              institución para la recolección y tratamiento de datos personales a fin de asegurar el respeto por los 
              derechos de sus titulares y así como el cumplimiento del marco normativo vigente.
            </p>

            <h3>4.1. Responsabilidades del Cumplimiento</h3>
            <p>
              El comité de Seguridad de la Información junto con sus miembros vigentes, serán responsables de revisar 
              anualmente esta Política y efectuar los ajustes respectivos. El departamento de Seguridad de la Información 
              será el encargado de absolver cualquier consulta relacionada con la aplicación y alcances de la presente Política.
            </p>
            <p>
              Todos los usuarios de nuestra Academia de Inglés, así como todos los terceros con quienes la institución 
              se vincule en el ejercicio regular de su actividad educativa y tenga acceso o realice tratamiento de datos 
              personales, se encuentran sujetos al cumplimiento de la Política.
            </p>

            <h3>4.2. Confidencialidad</h3>
            <p>
              Los datos personales a los que tanto los usuarios de nuestra Academia de Inglés como terceros tengan acceso 
              o participen de su tratamiento no podrán ser divulgados sin el previo consentimiento del titular de los datos 
              personales, salvo las excepciones reguladas en Ley.
            </p>
            <p>
              Las personas que intervengan en el tratamiento de datos personales están obligadas a guardar el secreto 
              profesional y a mantener la confidencialidad respecto de los mismos. Dicha obligación se mantendrá aún 
              luego de finalizada su relación con nuestra institución.
            </p>

            <h3>4.3. Principios</h3>
            <p>
              Todos los empleados de nuestra Academia de Inglés deberán cumplir de forma permanente en el ejercicio de 
              sus funciones siguiendo los principios establecidos en la Ley que detallamos a continuación:
            </p>
            <ul>
              <li>
                <strong>Legalidad.</strong> El tratamiento de datos personales realizado por nuestra institución se hará 
                conforme a lo dispuesto en la Ley. Se encuentra prohibida la recopilación de datos personales por medios 
                fraudulentos, desleales o ilícitos.
              </li>
              <li>
                <strong>Consentimiento.</strong> Nuestra Academia de Inglés no podrá tratar datos personales que no cuenten 
                con el consentimiento previo, expreso, inequívoco y libre de su titular según sea necesario, salvo las 
                excepciones previstas por la Ley.
              </li>
              <li>
                <strong>Finalidad.</strong> Nuestra institución recopilará datos personales señalando claramente la finalidad 
                para la cual realiza dicha recopilación, la misma que deberá ser determinada, explícita y lícita. Los datos 
                personales objeto de tratamiento no podrán ser utilizados para fines distintos o incompatibles con aquellos 
                que motivaron su obtención, salvo consentimiento de su titular.
              </li>
              <li>
                <strong>Proporcionalidad.</strong> Todo tratamiento de datos personales realizado por nuestra Academia de Inglés 
                deberá ser adecuado, relevante y no excesivo a la finalidad para la que estos hubiesen sido recopilados.
              </li>
              <li>
                <strong>Calidad.</strong> Los datos personales que vayan a ser tratados por nuestra institución deben ser veraces, 
                exactos, actualizados, necesarios, pertinentes y adecuados respecto la finalidad para la que fueron recopilados. 
                Deben conservarse de forma tal que se garantice su seguridad y solo por el tiempo necesario para cumplir con la 
                finalidad del tratamiento.
              </li>
              <li>
                <strong>Seguridad.</strong> Nuestra Academia de Inglés y los terceros a los que encargue el tratamiento de datos 
                personales deben adoptar las medidas técnicas, organizativas y legales necesarias y apropiadas para garantizar 
                la seguridad de los datos personales.
              </li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;