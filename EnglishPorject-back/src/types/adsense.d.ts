/**
 * Definición de tipos para Google AdSense
 */

interface Window {
  adsbygoogle: {
    push: (params: Record<string, unknown>) => void;
  }[] & {
    push: (params: Record<string, unknown>) => void;
  };
}

// Extender HTMLElementTagNameMap para incluir el elemento ins de AdSense
interface HTMLElementTagNameMap {
  ins: HTMLModElement;
}