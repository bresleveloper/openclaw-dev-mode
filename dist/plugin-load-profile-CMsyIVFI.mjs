import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-NlcA0RRK.mjs";
//#region src/plugins/plugin-load-profile.ts
function shouldProfilePluginLoader() {
	return isDiagnosticFlagEnabled("plugin.load-profile");
}
function formatPluginLoadProfileLine(params) {
	const extras = (params.extras ?? []).map(([k, v]) => `${k}=${typeof v === "number" ? v.toFixed(1) : v}`).join(" ");
	const extrasFragment = extras ? ` ${extras}` : "";
	return `[plugin-load-profile] phase=${params.phase} plugin=${params.pluginId ?? "(core)"} elapsedMs=${params.elapsedMs.toFixed(1)}${extrasFragment} source=${params.source}`;
}
/** Profile only when enabled, including failed calls. */
function withProfile(scope, phase, run, extras) {
	if (!shouldProfilePluginLoader()) return run();
	const startMs = performance.now();
	try {
		return run();
	} finally {
		const elapsedMs = performance.now() - startMs;
		console.error(formatPluginLoadProfileLine({
			phase,
			pluginId: scope.pluginId,
			source: scope.source,
			elapsedMs,
			extras
		}));
	}
}
function createProfiler(scope) {
	return (phase, run, extras) => withProfile(scope, phase, run, extras);
}
//#endregion
export { withProfile as i, formatPluginLoadProfileLine as n, shouldProfilePluginLoader as r, createProfiler as t };
