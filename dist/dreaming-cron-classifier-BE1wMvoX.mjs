import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
//#region extensions/memory-core/src/dreaming-cron-contract.ts
/** Stable declaration shared by runtime convergence and explicit Doctor adoption. */
const MANAGED_DREAMING_DECLARATION_KEY = "memory-core:memory-dreaming-promotion";
//#endregion
//#region extensions/memory-core/src/migration/dreaming-cron-classifier.ts
/** Doctor owns historical recognition; runtime may use the result only for diagnosis. */
function classifyDreamingCronJob(raw, constants) {
	if (raw.declarationKey === "memory-core:memory-dreaming-promotion") return "declared";
	if (raw.declarationKey !== void 0 && raw.declarationKey !== null) return;
	const name = normalizeOptionalString(raw.name);
	const description = normalizeOptionalString(raw.description);
	const payload = isRecord(raw.payload) ? raw.payload : {};
	const kind = normalizeOptionalString(payload.kind)?.toLowerCase();
	const token = normalizeOptionalString(kind === "systemevent" ? payload.text : kind === "agentturn" ? payload.message : void 0);
	let phase;
	for (const [phaseName, tag, event] of [[
		constants.LEGACY_MEMORY_LIGHT_DREAMING_CRON_NAME,
		constants.LEGACY_MEMORY_LIGHT_DREAMING_CRON_TAG,
		constants.LEGACY_MEMORY_LIGHT_DREAMING_EVENT_TEXT
	], [
		constants.LEGACY_MEMORY_REM_DREAMING_CRON_NAME,
		constants.LEGACY_MEMORY_REM_DREAMING_CRON_TAG,
		constants.LEGACY_MEMORY_REM_DREAMING_EVENT_TEXT
	]]) {
		if (description?.includes(tag)) {
			if (token !== event && token !== constants.MEMORY_DREAMING_SYSTEM_EVENT_TEXT) return "ambiguous";
			phase = "phase";
		}
		if (name === phaseName && kind === "systemevent" && token === event) phase = "phase";
	}
	if (description?.includes(constants.MANAGED_MEMORY_DREAMING_CRON_TAG)) {
		if (token === constants.MEMORY_DREAMING_SYSTEM_EVENT_TEXT) return "legacy";
		return phase ?? "ambiguous";
	}
	if (name === constants.MANAGED_MEMORY_DREAMING_CRON_NAME && token === constants.MEMORY_DREAMING_SYSTEM_EVENT_TEXT) return "legacy";
	return phase;
}
//#endregion
export { MANAGED_DREAMING_DECLARATION_KEY as n, classifyDreamingCronJob as t };
