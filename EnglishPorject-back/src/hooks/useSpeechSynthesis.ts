import { useState, useEffect, useCallback, useRef } from 'react';

// Tipos para la Web Speech API
export interface SpeechSynthesisVoice {
  voiceURI: string;
  name: string;
  lang: string;
  localService: boolean;
  default: boolean;
}

export interface SpeechOptions {
  text: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
  lang?: string;
}

/**
 * Hook personalizado que utiliza la Web Speech API nativa para síntesis de voz
 * Reemplaza la dependencia de react-speech-kit
 */
export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cargar voces disponibles
  useEffect(() => {
    const synth = window.speechSynthesis;
    
    // Función para obtener y establecer las voces disponibles
    const updateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };

    // Intentar obtener voces inmediatamente (para navegadores que ya las tienen cargadas)
    updateVoices();

    // Escuchar el evento voiceschanged para navegadores que cargan las voces de forma asíncrona
    synth.addEventListener('voiceschanged', updateVoices);

    return () => {
      synth.removeEventListener('voiceschanged', updateVoices);
    };
  }, []);

  // Función para cancelar la síntesis de voz actual
  const cancel = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setSpeaking(false);
  }, []);

  // Función para hablar texto
  const speak = useCallback(({ text, rate = 1, pitch = 1, volume = 1, voice, lang = 'en-US' }: SpeechOptions) => {
    const synth = window.speechSynthesis;
    
    // Cancelar cualquier síntesis en curso
    cancel();
    
    // Crear nueva utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Configurar opciones
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = lang;
    
    // Intentar seleccionar una voz en inglés si no se proporciona una específica
    if (voice) {
      utterance.voice = voice;
    } else {
      // Obtener todas las voces disponibles
      const availableVoices = synth.getVoices();
      
      // Intentar encontrar una voz en inglés (preferiblemente en-US)
      const englishVoice = availableVoices.find(v => 
        v.lang.includes('en-US') && v.localService === true
      ) || availableVoices.find(v => 
        v.lang.includes('en-US')
      ) || availableVoices.find(v => 
        v.lang.includes('en')
      );
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }
    
    // Manejar eventos
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    // Iniciar síntesis
    synth.speak(utterance);
  }, [cancel]);

  return {
    speak,
    cancel,
    speaking,
    voices
  };
}