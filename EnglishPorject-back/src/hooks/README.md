# Hooks personalizados

## useSpeechSynthesis

Este hook personalizado reemplaza la biblioteca `react-speech-kit` utilizando directamente la Web Speech API nativa del navegador.

### Motivación

Se implementó este hook personalizado para:

1. Resolver problemas de compatibilidad con versiones recientes de React
2. Eliminar dependencias externas innecesarias
3. Tener mayor control sobre la implementación de la síntesis de voz
4. Facilitar el despliegue de la aplicación

### Uso

```tsx
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

function MyComponent() {
  const { speak, cancel, speaking, voices } = useSpeechSynthesis();
  
  const readText = (text) => {
    speak({ 
      text,
      rate: 1.0,
      pitch: 1.0,
      lang: 'es-ES' // Opcional: idioma para la síntesis
    });
  };
  
  return (
    <div>
      <button onClick={() => readText('Texto a leer')}>Leer texto</button>
      {speaking && <button onClick={cancel}>Detener</button>}
    </div>
  );
}
```

### Características

- Soporte completo para todas las opciones de la Web Speech API
- Manejo de estado de habla (speaking)
- Acceso a todas las voces disponibles en el navegador
- Control de volumen, tono y velocidad
- Soporte para diferentes idiomas