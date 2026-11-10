import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { c as readExecApprovalsSnapshot, r as loadExecApprovals } from "./exec-approvals-store-BhzM_h1C.mjs";
import "./exec-approvals-ByI8H66l.mjs";
//#region src/plugin-sdk/exec-approvals-runtime.ts
/** @deprecated Await loadExecApprovalsReadOnlyAsync; final compatibility day: 2026-12-31. */
function loadExecApprovalsDeprecated() {
	warnPluginSdkDeprecation({
		family: "exec-approvals-sync-read",
		method: "loadExecApprovals",
		replacement: "loadExecApprovalsReadOnlyAsync"
	});
	return loadExecApprovals();
}
/** @deprecated Await readExecApprovalsSnapshotAsync; final compatibility day: 2026-12-31. */
function readExecApprovalsSnapshotDeprecated() {
	warnPluginSdkDeprecation({
		family: "exec-approvals-sync-read",
		method: "readExecApprovalsSnapshot",
		replacement: "readExecApprovalsSnapshotAsync"
	});
	return readExecApprovalsSnapshot();
}
//#endregion
export { readExecApprovalsSnapshotDeprecated as n, loadExecApprovalsDeprecated as t };
