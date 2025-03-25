import { Fragment } from 'react';
import { RefreshCw } from 'lucide-react';
import { PlacementTestResult, schedules } from '../../types';

interface ResultsDisplayProps {
  result: PlacementTestResult;
  userName?: string;
  onReset: () => void;
  onGeneratePDF: () => void;
}

const ResultsDisplay = ({
  result,
  userName,
  onReset,
  onGeneratePDF
}: ResultsDisplayProps) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6">Resultados de tu Evaluación</h3>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <p className="text-center text-gray-700">
          {userName ? `¡Felicidades ${userName}! ` : '¡Felicidades! '}
          Has completado la evaluación de nivel.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl">Nivel:</span>
          <span className="text-2xl font-bold text-blue-600">{result.level}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-500" 
            style={{ width: `${result.score}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Principiante</span>
          <span>Intermedio</span>
          <span>Avanzado</span>
        </div>
      </div>
      
      {result.recommendedGroup && (
        <Fragment>
          <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-lg">
            <h4 className="font-semibold text-lg mb-2 text-green-800">Grupo recomendado</h4>
            <p className="text-gray-700">{result.recommendedGroup}</p>
            <div className="mt-2">
              <p>Horarios disponibles:</p>
              <ul className="list-disc pl-5 mt-2">
                {schedules.find(s => s.group === result.recommendedGroup)?.times.map((time, idx) => (
                  <li key={idx}>{time}</li>
                )) || <li>No hay horarios disponibles para este grupo</li>}
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-semibold text-lg mb-2">Fortalezas</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-2">Áreas de mejora</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.weaknesses.map((weakness, idx) => (
                  <li key={idx}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-semibold text-lg mb-2">Recomendación</h4>
            <p className="text-gray-700">{result.recommendation}</p>
          </div>
          
          <div className="mb-8">
            <h4 className="font-semibold text-lg mb-2">Próximos pasos</h4>
            <ol className="list-decimal pl-5 space-y-2">
              {result.nextSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </Fragment>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={onGeneratePDF}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Descargar resultados (PDF)
        </button>
        
        <button
          onClick={onReset}
          className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Comenzar nuevamente
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;