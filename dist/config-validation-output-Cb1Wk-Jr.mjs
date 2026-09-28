import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { i as normalizeConfigIssues } from "./issue-format-BQNShMey.mjs";
import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
//#region src/cli/config-validation-output.ts
/** Render one failure document; the caller retains its existing exit and recovery policy. */
function writeInvalidConfigCliJson(runtime, snapshot) {
	writeRuntimeJson(runtime, {
		...formatCliJsonFailure(`OpenClaw config is invalid: ${shortenHomePath(snapshot.path)}`),
		issues: normalizeConfigIssues(snapshot.issues)
	});
}
//#endregion
export { writeInvalidConfigCliJson };
