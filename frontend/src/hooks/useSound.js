import { useCallback } from "react";

export const useSound = () => {
  const playTone = useCallback((frequency, duration = 0.12) => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.value = 0.08;

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }, []);

  return {
    playMove: () => playTone(520),
    playQuantum: () => playTone(720),
    playCollapse: () => playTone(320, 0.2),
  };
};
