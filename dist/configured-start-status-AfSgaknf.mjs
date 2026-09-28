import { f as hashRuntimeConfigValue } from "./runtime-snapshot-DbgWcCyV.mjs";
import "./transcripts-DlCB8MI2.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/transcripts/config-reload.ts
function withoutTitles(config) {
	return config && {
		...config,
		...config.autoStart && { autoStart: config.autoStart.map(({ title: _title, ...source }) => source) }
	};
}
/** Compare full source intent before reading titles, without borrowing new routing authority. */
function hasSameTranscriptCaptureIntent(previous, candidate) {
	return isDeepStrictEqual(withoutTitles(previous), withoutTitles(candidate));
}
/** Bounded process diagnostic correlation only, never admission or resume authority. */
function transcriptCaptureConfigHash(config) {
	return hashRuntimeConfigValue({ transcripts: withoutTitles(config) });
}
//#endregion
//#region src/transcripts/configured-start-status.ts
let current;
function beginConfiguredTranscriptStarts(config) {
	const owner = {
		configHash: transcriptCaptureConfigHash(config),
		entries: /* @__PURE__ */ new Map()
	};
	current = owner;
	return {
		record(index, lifecycleToken, diagnostic) {
			if (current === owner && index < 100) owner.entries.set(index, {
				lifecycleToken,
				diagnostic
			});
		},
		clear() {
			if (current === owner) current = void 0;
		}
	};
}
function readConfiguredTranscriptStarts(config) {
	return current && current.configHash === transcriptCaptureConfigHash(config) ? new Map(current.entries) : void 0;
}
//#endregion
export { readConfiguredTranscriptStarts as n, hasSameTranscriptCaptureIntent as r, beginConfiguredTranscriptStarts as t };
