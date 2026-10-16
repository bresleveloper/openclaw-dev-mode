//#region packages/media-understanding-common/src/defaults.ts
const MB = 1048576;
/** Default max response characters by capability. */
const DEFAULT_MAX_CHARS_BY_CAPABILITY = {
	image: 500,
	audio: void 0,
	video: 500
};
/** Default input byte limits by capability. */
const DEFAULT_MAX_BYTES = {
	image: 10 * MB,
	audio: 20 * MB,
	video: 50 * MB
};
/** Default request timeout by capability. */
const DEFAULT_TIMEOUT_SECONDS = {
	image: 60,
	audio: 60,
	video: 120
};
/** Default prompts by capability. */
const DEFAULT_PROMPT = {
	image: "Describe the image.",
	audio: "Transcribe the audio.",
	video: "Describe the video."
};
/** Upper bound for base64-expanded video payloads. */
const DEFAULT_VIDEO_MAX_BASE64_BYTES = 70 * MB;
/** CLI output buffer used by provider child processes. */
const CLI_OUTPUT_MAX_BUFFER = 5 * MB;
/** Minimum bytes for audio files before transcription is attempted. */
const MIN_AUDIO_FILE_BYTES = 1024;
//#endregion
export { DEFAULT_TIMEOUT_SECONDS as a, DEFAULT_PROMPT as i, DEFAULT_MAX_BYTES as n, DEFAULT_VIDEO_MAX_BASE64_BYTES as o, DEFAULT_MAX_CHARS_BY_CAPABILITY as r, MIN_AUDIO_FILE_BYTES as s, CLI_OUTPUT_MAX_BUFFER as t };
