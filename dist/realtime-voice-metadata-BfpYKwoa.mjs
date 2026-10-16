import { t as GOOGLE_PREBUILT_VOICES } from "./voice-catalog-D5KYybOO.mjs";
//#region extensions/google/realtime-voice-metadata.ts
const GOOGLE_REALTIME_DEFAULT_MODEL = "gemini-3.1-flash-live-preview";
const GOOGLE_REALTIME_VOICE_METADATA = {
	id: "google",
	label: "Google Live Voice",
	defaultModel: GOOGLE_REALTIME_DEFAULT_MODEL,
	voices: GOOGLE_PREBUILT_VOICES,
	autoSelectOrder: 20
};
//#endregion
export { GOOGLE_REALTIME_VOICE_METADATA as n, GOOGLE_REALTIME_DEFAULT_MODEL as t };
