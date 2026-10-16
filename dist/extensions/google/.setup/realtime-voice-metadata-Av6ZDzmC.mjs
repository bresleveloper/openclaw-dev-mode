//#region extensions/google/voice-catalog.ts
const GOOGLE_PREBUILT_VOICES = [
	"Zephyr",
	"Puck",
	"Charon",
	"Kore",
	"Fenrir",
	"Leda",
	"Orus",
	"Aoede",
	"Callirrhoe",
	"Autonoe",
	"Enceladus",
	"Iapetus",
	"Umbriel",
	"Algieba",
	"Despina",
	"Erinome",
	"Algenib",
	"Rasalgethi",
	"Laomedeia",
	"Achernar",
	"Alnilam",
	"Schedar",
	"Gacrux",
	"Pulcherrima",
	"Achird",
	"Zubenelgenubi",
	"Vindemiatrix",
	"Sadachbia",
	"Sadaltager",
	"Sulafat"
];
//#endregion
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
export { GOOGLE_REALTIME_VOICE_METADATA as n, GOOGLE_PREBUILT_VOICES as r, GOOGLE_REALTIME_DEFAULT_MODEL as t };
