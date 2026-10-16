import { a as writeRuntimeJson } from "./runtime-DlO3PTAd.mjs";
import { i as normalizeConfigIssues } from "./issue-format-L1jxHK43.mjs";
import { t as configFailureHeading } from "./io.invalid-config-BzeD3bi5.mjs";
import { p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as formatCliJsonFailure } from "./failure-output-gtb9zaTk.mjs";
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
