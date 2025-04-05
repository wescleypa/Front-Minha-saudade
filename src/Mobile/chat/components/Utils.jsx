const calculateTypingTimeout = (textLength) => {
  // Constantes realistas:
  const CHARS_PER_SECOND = 6.0;  // ~360 chars/min (ritmo natural)
  const MIN_TIMEOUT = 1500;      // 1.5s mínimo (para "Oi", "Ok")
  const BASE_TIMEOUT = 8000;     // Tempo base para textos médios
  const LONG_TEXT_THRESHOLD = 500; // A partir de 500 chars, aplica escalonamento

  if (textLength <= LONG_TEXT_THRESHOLD) {
    // Cálculo normal para textos curtos/médios
    const baseTimeMs = (textLength / CHARS_PER_SECOND) * 1000;
    return Math.round(Math.max(baseTimeMs, MIN_TIMEOUT));
  } else {
    // Escalonamento para textos MUITO longos (ex.: seu Lorem Ipsum)
    const excessChars = textLength - LONG_TEXT_THRESHOLD;
    const extraTime = (excessChars / (CHARS_PER_SECOND * 2)) * 1000; // Diminui a velocidade
    return Math.round(BASE_TIMEOUT + extraTime);
  }
};

module.exports = {
  calculateTypingTimeout
}