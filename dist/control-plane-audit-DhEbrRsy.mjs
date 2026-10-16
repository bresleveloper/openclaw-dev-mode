import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/gateway/control-plane-audit.ts
/** Extracts audit identity from a possibly missing or partially connected client. */
function resolveControlPlaneActor(client) {
	return {
		actor: normalizeOptionalString(client?.connect?.client?.id) ?? "unknown-actor",
		deviceId: normalizeOptionalString(client?.connect?.device?.id) ?? "unknown-device",
		clientIp: normalizeOptionalString(client?.clientIp) ?? "unknown-ip",
		connId: normalizeOptionalString(client?.connId) ?? "unknown-conn"
	};
}
/** Formats actor identity as compact key/value text for structured gateway logs. */
function formatControlPlaneActor(actor) {
	return `actor=${actor.actor} device=${actor.deviceId} ip=${actor.clientIp} conn=${actor.connId}`;
}
/** Run abort diagnostics record only the stop reason; this names who requested the stop. */
function formatStopRequest(method, client, params) {
	const flags = ["discardPendingInput", "clearQueued"].filter((flag) => params[flag] === true);
	return `${method} requested: ${formatControlPlaneActor(resolveControlPlaneActor(client))} session=${readStringValue(params.sessionKey ?? params.key) ?? "none"} runId=${readStringValue(params.runId) ?? "none"}` + flags.map((flag) => ` ${flag}`).join("");
}
/** Summarizes changed config/state paths without letting audit logs grow unbounded. */
function summarizeChangedPaths(paths, maxPaths = 8) {
	if (paths.length === 0) return "<none>";
	if (paths.length <= maxPaths) return paths.join(",");
	return `${paths.slice(0, maxPaths).join(",")},+${paths.length - maxPaths} more`;
}
//#endregion
export { summarizeChangedPaths as i, formatStopRequest as n, resolveControlPlaneActor as r, formatControlPlaneActor as t };
