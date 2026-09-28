import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./errors-DnjwnOju.mjs";
import { i as readConfigMachineStateWithMetadata } from "./config-machine-state-BfMkd608.mjs";
import { a as writeConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
//#region src/infra/voicewake.ts
const DEFAULT_TRIGGERS = [
	"openclaw",
	"claude",
	"computer"
];
const VOICEWAKE_TRIGGERS_STATE_KEY = "voicewake.triggers";
function sanitizeTriggers(triggers) {
	const cleaned = (triggers ?? []).map((w) => normalizeOptionalString(w) ?? "").filter((w) => w.length > 0);
	return cleaned.length > 0 ? cleaned : DEFAULT_TRIGGERS;
}
function stateDatabaseOptions(stateDir) {
	return stateDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} } : {};
}
/** Return the built-in voice wake trigger list. */
function defaultVoiceWakeTriggers() {
	return [...DEFAULT_TRIGGERS];
}
/** Load persisted voice wake triggers, falling back to defaults. */
async function loadVoiceWakeConfig(baseDir) {
	const state = readConfigMachineStateWithMetadata(VOICEWAKE_TRIGGERS_STATE_KEY, stateDatabaseOptions(baseDir));
	if (!state) return {
		triggers: defaultVoiceWakeTriggers(),
		updatedAtMs: 0
	};
	return {
		triggers: sanitizeTriggers(state.value),
		updatedAtMs: Math.max(0, state.updatedAtMs)
	};
}
/** Persist the configured voice wake trigger list. */
async function setVoiceWakeTriggers(triggers, baseDir) {
	const sanitized = sanitizeTriggers(triggers);
	writeConfigMachineState(VOICEWAKE_TRIGGERS_STATE_KEY, sanitized, stateDatabaseOptions(baseDir));
	return loadVoiceWakeConfig(baseDir);
}
//#endregion
//#region src/gateway/server-utils.ts
/** Normalizes voice-wake trigger config with bounded count/length and defaults. */
function normalizeVoiceWakeTriggers(input) {
	const cleaned = normalizeTrimmedStringList(input).slice(0, 32).map((value) => truncateUtf16Safe(value, 64));
	return cleaned.length > 0 ? cleaned : defaultVoiceWakeTriggers();
}
//#endregion
export { loadVoiceWakeConfig as n, setVoiceWakeTriggers as r, normalizeVoiceWakeTriggers as t };
