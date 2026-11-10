import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { p as shortenHomePath } from "./utils-gjJ-tD2q.mjs";
import { i as normalizeConfigIssues } from "./issue-format-Cu1pIc3h.mjs";
import { t as configFailureHeading } from "./io.invalid-config-CsqYoW4w.mjs";
import { r as formatCliJsonFailure } from "./failure-output-CpIKhMiV.mjs";
//#region src/cli/config-validation-output.ts
/** Render one failure document; the caller retains its existing exit and recovery policy. */
function writeInvalidConfigCliJson(runtime, snapshot) {
	writeRuntimeJson(runtime, {
		...formatCliJsonFailure(`${configFailureHeading(snapshot)}: ${shortenHomePath(snapshot.path)}`),
		issues: normalizeConfigIssues(snapshot.issues)
	});
}
//#endregion
export { writeInvalidConfigCliJson as t };
