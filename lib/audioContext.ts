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

const GAIN_VALUES: [string, number][] = [
  ["normal", 1.00],
  ["suppressed", 0.25],
];

const AUDIO_BUFFERS: [string, string][] = [
  ["tick", "/stepcharts/cursor12.mp3"],
  ["stop", "/stepcharts/cursor4.mp3"],
  ["bpm", "/stepcharts/cancel1.mp3"],
  ["shock", "/stepcharts/cursor7.mp3"],
  ["beat", "/stepcharts/cursor6.mp3"],
];

export const prepareAudioContext = async () => {
  if (!audioContext) {
    const context = new AudioContext();
    audioContext = context;
    GAIN_VALUES.forEach(([field, gain]) => {
      const gainNode = new GainNode(context);
      gainNode.gain.value = gain;
      gainNode.connect(context.destination);
      destinations[field] = gainNode;
    });
    await Promise.all(AUDIO_BUFFERS.map(async ([field, file]) => {
      const data =  await fetch(file);
      const arr = await data.arrayBuffer();
      audioBuffers[field] = await context.decodeAudioData(arr);
    }));
  }
  return audioContext;
};
