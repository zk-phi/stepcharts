export let audioContext: AudioContext | null = null;

export const audioBuffers: Record<string, AudioBuffer | null> = {
  tick: null,
  stop: null,
  bpm: null,
  shock: null,
  beat: null,
};

export const destinations: Record<string, GainNode | null> = {
  normal: null,
  suppressed: null,
};

export const prepareAudioContext = async () => {
  if (!audioContext) {
    audioContext = new AudioContext();
    [["normal", 1.00], ["suppressed", 0.25]].forEach(([field, gain]) => {
      const gainNode = new GainNode(audioContext);
      gainNode.gain.value = gain;
      gainNode.connect(audioContext.destination);
      destinations[field] = gainNode;
    });
    await Promise.all([
      ["tick", "/stepcharts/cursor12.mp3"],
      ["stop", "/stepcharts/cursor4.mp3"],
      ["bpm", "/stepcharts/cancel1.mp3"],
      ["shock", "/stepcharts/cursor7.mp3"],
      ["beat", "/stepcharts/cursor6.mp3"],
    ].map(async ([field, file]) => {
      const data =  await fetch(file);
      const arr = await data.arrayBuffer();
      audioBuffers[field] = await audioContext.decodeAudioData(arr);
    }));
  }
  return audioContext;
};
