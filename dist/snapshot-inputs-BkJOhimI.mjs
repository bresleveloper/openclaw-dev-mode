import { m as serializeConfigResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/config/snapshot-inputs.ts
/** Compare authored revisions and env-resolved inputs, never runtime defaults. */
function describeConfigSnapshotInputChange(before, after, options = {}) {
	if (!options.allowPathChange && before.path !== after.path) return "config file path changed";
	if (before.exists !== after.exists) return "config file was created or removed";
	if ((before.hash ?? before.raw) !== (after.hash ?? after.raw)) return before.raw !== after.raw ? "authored config file contents changed" : "included config contents or targets changed";
	if (options.compareResolvedConfig !== false) {
		if (!isDeepStrictEqual(before.sourceConfig, after.sourceConfig)) return "resolved config values changed";
		if (!isDeepStrictEqual(serializeConfigResolutionFacts(before.sourceConfig), serializeConfigResolutionFacts(after.sourceConfig))) return "resolved config provenance changed";
	}
}
//#endregion
export { describeConfigSnapshotInputChange as t };
