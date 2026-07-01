/** Resample little-endian signed 16-bit PCM to another integer sample rate. */
export declare function resamplePcm(input: Buffer, inputSampleRate: number, outputSampleRate: number): Buffer;
/** Resample little-endian signed 16-bit PCM to the telephony 8 kHz rate. */
export declare function resamplePcmTo8k(input: Buffer, inputSampleRate: number): Buffer;
/** Convert little-endian signed 16-bit PCM samples to G.711 mu-law bytes. */
export declare function pcmToMulaw(pcm: Buffer): Buffer;
/** Expand G.711 mu-law bytes into little-endian signed 16-bit PCM samples. */
export declare function mulawToPcm(mulaw: Buffer): Buffer;
/** Resample signed 16-bit PCM to 8 kHz and encode it as G.711 mu-law. */
export declare function convertPcmToMulaw8k(pcm: Buffer, inputSampleRate: number): Buffer;
