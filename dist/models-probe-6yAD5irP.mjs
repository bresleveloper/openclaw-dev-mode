import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { En as validateModelsProbeParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { a as runAuthProbes, i as redactAuthProbeError } from "./list.probe-DyqhAeN0.mjs";
import { t as formatForLog } from "./ws-log-Cxv8Uaao.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as resolveModelAuthAgentScope } from "./model-auth-agent-scope-0oXdPDH7.mjs";
//#region src/gateway/server-methods/models-probe.ts
const DEFAULT_TIMEOUT_MS = 2e4;
const MIN_TIMEOUT_MS = 5e3;
const MAX_TIMEOUT_MS = 6e4;
const PROBE_CONCURRENCY = 2;
const PROBE_MAX_TOKENS = 8;
const FAILURE_PRIORITY = [
	"auth",
	"billing",
	"rate_limit",
	"timeout",
	"format",
	"no_model",
	"unknown"
];
const PROBE_ERROR_MESSAGES = {
	auth: "Authentication failed.",
	rate_limit: "The provider rate limit was reached.",
	billing: "The provider reported a billing problem.",
	timeout: "The connection timed out.",
	format: "The provider rejected the model or request format.",
	unknown: "The connection probe failed.",
	no_model: "No model is available for this provider."
};
function safeProbeError(status) {
	return status === "ok" ? void 0 : PROBE_ERROR_MESSAGES[status];
}
const PROBE_REASON_MESSAGES = {
	excluded_by_auth_order: "This profile is excluded by the provider auth order. Update the order or choose another profile, then retry.",
	missing_credential: "This credential is missing. Add it or remove the stale configuration, then retry.",
	expired: "This credential has expired. Sign in again or replace it, then retry.",
	invalid_expires: "This credential has invalid expiry metadata. Sign in again or replace it, then retry.",
	unresolved_ref: "The configured credential could not be resolved. Update or remove it, then retry.",
	ineligible_profile: "This profile is not compatible with the provider configuration. Choose another profile, then retry.",
	no_model: "No model is available for this provider. Configure a model, then retry."
};
function safeProbeTargetLabel(result) {
	const owner = result.source === "profile" ? `Profile ${result.label}` : result.source === "models.json" ? result.label === "config" ? "Configured credential" : "Provider configuration" : `Environment credential (${result.label})`;
	return result.model ? `${owner} · ${result.model}` : owner;
}
function safeProbeTargetError(result) {
	if (result.status === "ok") return;
	return (result.reasonCode && PROBE_REASON_MESSAGES[result.reasonCode]) ?? safeProbeError(result.status);
}
function modelCandidatesFromConfig(cfg) {
	const configured = cfg.agents?.defaults?.model;
	return [
		typeof configured === "string" ? configured : configured?.primary,
		...typeof configured === "string" ? [] : configured?.fallbacks ?? [],
		cfg.agents?.defaults?.utilityModel
	].filter((value) => typeof value === "string").map((value) => value.trim()).filter(Boolean);
}
function selectRollupStatus(results) {
	if (results.some((result) => result.status === "ok")) return "ok";
	return FAILURE_PRIORITY.find((status) => results.some((result) => result.status === status)) ?? "unknown";
}
function mapProbeResult(provider, results) {
	const status = selectRollupStatus(results);
	const latencyMs = results.filter((result) => result.status === status).map((result) => result.latencyMs).filter((value) => typeof value === "number").toSorted((left, right) => left - right)[0];
	const error = safeProbeError(status);
	return {
		provider,
		status,
		...latencyMs !== void 0 ? { latencyMs } : {},
		...error ? { error } : {},
		results: results.map((result) => {
			const targetError = safeProbeTargetError(result);
			return {
				...result.profileId ? { profileId: result.profileId } : {},
				label: safeProbeTargetLabel(result),
				status: result.status,
				...result.latencyMs !== void 0 ? { latencyMs: result.latencyMs } : {},
				...targetError ? { error: targetError } : {}
			};
		})
	};
}
const modelsProbeHandlers = { "models.probe": async ({ params, respond, context }) => {
	if (!assertValidParams(params, validateModelsProbeParams, "models.probe", respond)) return;
	const provider = normalizeProviderId(params.provider);
	const profileId = params.profileId?.trim();
	if (!provider || params.profileId !== void 0 && !profileId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "provider and profileId must not be blank"));
		return;
	}
	const timeoutMs = Math.min(MAX_TIMEOUT_MS, Math.max(MIN_TIMEOUT_MS, params.timeoutMs ?? DEFAULT_TIMEOUT_MS));
	try {
		const cfg = context.getRuntimeConfig();
		const scope = resolveModelAuthAgentScope(cfg, params.agentId);
		if (!scope.ok) {
			respond(false, void 0, scope.error);
			return;
		}
		const workspaceDir = resolveAgentWorkspaceDir(cfg, scope.agentId);
		const result = mapProbeResult(provider, (await runAuthProbes({
			cfg,
			agentId: scope.agentId,
			agentDir: scope.agentDir,
			workspaceDir,
			providers: [provider],
			modelCandidates: modelCandidatesFromConfig(cfg),
			options: {
				provider,
				...profileId ? { profileIds: [profileId] } : {},
				...!profileId ? { includeDirectKeys: true } : {},
				timeoutMs,
				concurrency: PROBE_CONCURRENCY,
				maxTokens: PROBE_MAX_TOKENS
			}
		})).results);
		if (result.results.length === 0) result.error = "No probe targets are available for this provider.";
		respond(true, result, void 0);
	} catch (error) {
		context.logGateway.warn("Model connection probe failed.", {
			event: "models_probe_failed",
			provider,
			timeoutMs,
			error: redactAuthProbeError(formatForLog(error))
		});
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Connection probe failed."));
	}
} };
//#endregion
export { modelsProbeHandlers };
