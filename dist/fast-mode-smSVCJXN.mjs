import { t as modelKey } from "./model-key-5zORvMDY.mjs";
function normalizeFastModeAutoOnSeconds(value) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : void 0;
}
function resolveFastModeModelAutoOnSeconds(params) {
	const sources = params.modelParamSources ?? [params.cfg?.agents?.defaults?.models?.[modelKey(params.provider ?? "", params.model ?? "")]?.params];
	for (const modelParams of sources) {
		const seconds = normalizeFastModeAutoOnSeconds(modelParams?.fastAutoOnSeconds) ?? normalizeFastModeAutoOnSeconds(modelParams?.fast_auto_on_seconds) ?? normalizeFastModeAutoOnSeconds(modelParams?.fastSeconds) ?? normalizeFastModeAutoOnSeconds(modelParams?.fast_seconds);
		if (seconds !== void 0) return seconds;
	}
	return 60;
}
function resolveFastModeForElapsed(params) {
	const nowMs = params.nowMs ?? Date.now();
	const elapsedMs = Math.max(0, nowMs - params.startedAtMs);
	const fastAutoOnSeconds = normalizeFastModeAutoOnSeconds(params.fastAutoOnSeconds) ?? 60;
	const thresholdMs = fastAutoOnSeconds * 1e3;
	const enabled = params.mode === "auto" ? elapsedMs <= thresholdMs : params.mode === true || params.mode === "ultrafast";
	const elapsedSeconds = Math.floor(elapsedMs / 1e3);
	return {
		mode: params.mode,
		enabled,
		elapsedSeconds,
		fastAutoOnSeconds
	};
}
function formatFastModeAutoProgressText(params) {
	if (params.enabled) return "💨Fast: auto-on";
	const fastAutoOnSeconds = normalizeFastModeAutoOnSeconds(params.fastAutoOnSeconds) ?? 60;
	return `💨Fast: auto-off(${params.elapsedSeconds}s>=${fastAutoOnSeconds}s)`;
}
function formatFastModeValue(mode) {
	return mode === "auto" || mode === "ultrafast" ? mode : mode === true ? "on" : "off";
}
function formatFastModeConfirmation(mode) {
	if (mode === "ultrafast") return "Ultrafast mode enabled.";
	return mode === "auto" ? "Fast mode set to auto." : `Fast mode ${mode ? "enabled" : "disabled"}.`;
}
function formatFastModeAutoLabel(params) {
	return `auto (${normalizeFastModeAutoOnSeconds(params?.fastAutoOnSeconds) ?? 60} sec)`;
}
function formatFastModeStatusValue(params) {
	if (params.mode === "auto") return formatFastModeAutoLabel({ fastAutoOnSeconds: params.fastAutoOnSeconds });
	return formatFastModeValue(params.mode);
}
function formatFastModeCommandOptions(params) {
	return `on, off, ultrafast, ${formatFastModeAutoLabel({ fastAutoOnSeconds: params?.fastAutoOnSeconds })}, default, status`;
}
function formatFastModeSourceSuffix(source) {
	switch (source) {
		case "session": return " (session)";
		case "agent": return " (default: agent)";
		case "config": return " (default: model)";
		case "default": return " (default)";
		default: return "";
	}
}
function formatFastModeCurrentStatus(params) {
	return `${params.label ?? "Current fast mode"}: ${formatFastModeStatusValue({
		mode: params.mode,
		fastAutoOnSeconds: params.fastAutoOnSeconds
	})}${formatFastModeSourceSuffix(params.source)}.`;
}
//#endregion
export { formatFastModeCurrentStatus as a, formatFastModeValue as c, formatFastModeConfirmation as i, resolveFastModeForElapsed as l, formatFastModeAutoProgressText as n, formatFastModeSourceSuffix as o, formatFastModeCommandOptions as r, formatFastModeStatusValue as s, formatFastModeAutoLabel as t, resolveFastModeModelAutoOnSeconds as u };
