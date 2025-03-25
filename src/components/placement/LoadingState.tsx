import { RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  evaluationMessages: string[];
}

const LoadingState = ({ evaluationMessages }: LoadingStateProps) => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative">
          <RefreshCw className="h-16 w-16 text-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="mt-4 text-blue-600 font-bold text-lg">Procesando...</div>
      </div>
      <h3 className="text-xl font-semibold mb-6">Evaluando tus respuestas</h3>
      
      <div className="space-y-4">
        {evaluationMessages.map((message, index) => (
          <div key={index} className="p-3 bg-blue-50 rounded-lg animate-pulse transition-all duration-300 border border-blue-100">
            {message}
          </div>
        ))}
        {evaluationMessages.length > 0 && evaluationMessages.length < 6 && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
            <div className="h-2 w-2 bg-blue-600 rounded-full mr-1 animate-bounce"></div>
            <div className="h-2 w-2 bg-blue-600 rounded-full mr-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingState;