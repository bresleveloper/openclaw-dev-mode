import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { l as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-UkIlVdR6.mjs";
import { o as withLegacySandboxRuntimeStatusReader, r as resolveSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
//#region src/agents/sandbox/runtime-status.legacy.ts
/** @deprecated Await resolveSandboxRuntimeStatusAsync. Removed in a later release after stable deprecation. */
function resolveSandboxRuntimeStatusLegacy(params) {
	warnPluginSdkDeprecation({
		family: "sandbox-runtime-status",
		method: "resolveSandboxRuntimeStatus",
		replacement: "resolveSandboxRuntimeStatusAsync"
	});
	return withLegacySandboxRuntimeStatusReader((scope) => resolveSessionEntry({
		...scope,
		clone: false
	}, { readOnly: true }).existing, () => resolveSandboxRuntimeStatus(params));
}
//#endregion
export { resolveSandboxRuntimeStatusLegacy as t };
