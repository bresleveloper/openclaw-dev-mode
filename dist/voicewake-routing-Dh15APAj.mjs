import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
//#region src/infra/voicewake-routing.ts
const VOICEWAKE_ROUTING_STATE_KEY = "voicewake.routing";
const DEFAULT_ROUTING = {
	version: 1,
	defaultTarget: { mode: "current" },
	routes: [],
	updatedAtMs: 0
};
/** Normalize a voice wake trigger phrase for matching and duplicate checks. */
function normalizeVoiceWakeTriggerWord(value) {
	return value.toLowerCase().split(/\s+/).map((token) => token.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "")).filter(Boolean).join(" ");
}
function normalizeRouteTarget(value) {
	if (!value || typeof value !== "object") return null;
	const rec = value;
	if (normalizeOptionalString(rec.mode) === "current") return { mode: "current" };
	const agentId = normalizeOptionalString(rec.agentId);
	const sessionKey = normalizeOptionalString(rec.sessionKey);
	if (agentId && !sessionKey) return { agentId: normalizeAgentId(agentId) };
	if (sessionKey && !agentId) return { sessionKey };
	return null;
}
function normalizeRouteRule(value) {
	if (!value || typeof value !== "object") return null;
	const rec = value;
	const triggerRaw = normalizeOptionalString(rec.trigger);
	if (!triggerRaw) return null;
	const trigger = normalizeVoiceWakeTriggerWord(triggerRaw);
	if (!trigger) return null;
	const target = normalizeRouteTarget(rec.target);
	if (!target) return null;
	return {
		trigger,
		target
	};
}
/** Normalize persisted or user-provided voice wake routing config. */
function normalizeVoiceWakeRoutingConfig(input) {
	if (!input || typeof input !== "object") return { ...DEFAULT_ROUTING };
	const rec = input;
	return {
		version: 1,
		defaultTarget: normalizeRouteTarget(rec.defaultTarget) ?? { mode: "current" },
		routes: Array.isArray(rec.routes) ? rec.routes.map((entry) => normalizeRouteRule(entry)).filter((entry) => Boolean(entry)) : [],
		updatedAtMs: typeof rec.updatedAtMs === "number" && Number.isFinite(rec.updatedAtMs) && rec.updatedAtMs > 0 ? Math.floor(rec.updatedAtMs) : 0
	};
}
/** Load persisted voice wake routing config from state. */
async function loadVoiceWakeRoutingConfig(baseDir) {
	const config = readConfigMachineState(VOICEWAKE_ROUTING_STATE_KEY, baseDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: baseDir
	} } : {});
	return config ? normalizeVoiceWakeRoutingConfig(config) : { ...DEFAULT_ROUTING };
}
function resolveVoiceWakeRouteTarget(routeTarget) {
	if (!routeTarget || "mode" in routeTarget && routeTarget.mode === "current") return { mode: "current" };
	if ("agentId" in routeTarget && routeTarget.agentId) return { agentId: routeTarget.agentId };
	if ("sessionKey" in routeTarget && routeTarget.sessionKey) return { sessionKey: routeTarget.sessionKey };
	return { mode: "current" };
}
/** Resolve the route target for a normalized wake trigger. */
function resolveVoiceWakeRouteByTrigger(params) {
	const normalizedTrigger = normalizeOptionalString(params.trigger) ? normalizeVoiceWakeTriggerWord(params.trigger) : "";
	if (normalizedTrigger) {
		const matched = params.config.routes.find((route) => route.trigger === normalizedTrigger);
		if (matched) return resolveVoiceWakeRouteTarget(matched.target);
	}
	return resolveVoiceWakeRouteTarget(params.config.defaultTarget);
}
//#endregion
export { normalizeVoiceWakeRoutingConfig as n, resolveVoiceWakeRouteByTrigger as r, loadVoiceWakeRoutingConfig as t };
