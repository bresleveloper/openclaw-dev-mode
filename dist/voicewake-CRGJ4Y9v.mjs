import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as readVoiceWakeMachineState, r as writeConfigMachineStateAsync } from "./config-machine-state-async-Ck1ARyFy.mjs";
//#region src/infra/voicewake.ts
const DEFAULT_TRIGGERS = [
	"openclaw",
	"claude",
	"computer"
];
const VOICEWAKE_TRIGGERS_STATE_KEY = "voicewake.triggers";
function sanitizeTriggers(triggers) {
	const cleaned = (Array.isArray(triggers) ? triggers : []).map((w) => normalizeOptionalString(w) ?? "").filter((w) => w.length > 0);
	return cleaned.length > 0 ? cleaned : DEFAULT_TRIGGERS;
}
function stateDatabaseOptions(stateDir) {
	return stateDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} } : {};
}
function defaultVoiceWakeTriggers() {
	return [...DEFAULT_TRIGGERS];
}
/** Load persisted voice wake triggers, falling back to defaults. */
async function loadVoiceWakeConfig(baseDir) {
	const state = await readVoiceWakeMachineState(VOICEWAKE_TRIGGERS_STATE_KEY, stateDatabaseOptions(baseDir));
	if (!state) return {
		triggers: defaultVoiceWakeTriggers(),
		updatedAtMs: 0
	};
	return {
		triggers: sanitizeTriggers(state.value),
		updatedAtMs: Math.max(0, state.updatedAtMs)
	};
}
async function setVoiceWakeTriggers(triggers, baseDir) {
	const sanitized = sanitizeTriggers(triggers);
	return {
		triggers: sanitized,
		updatedAtMs: await writeConfigMachineStateAsync(VOICEWAKE_TRIGGERS_STATE_KEY, sanitized, stateDatabaseOptions(baseDir))
	};
}
//#endregion
export { loadVoiceWakeConfig as n, setVoiceWakeTriggers as r, defaultVoiceWakeTriggers as t };
