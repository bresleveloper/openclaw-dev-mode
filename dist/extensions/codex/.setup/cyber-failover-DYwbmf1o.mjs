import { d as readCodexPluginConfig } from "./config-parsing-CcB9iPoq.mjs";
import { t as attemptTerminal } from "./attempt-terminal-gZrxQ35N.mjs";
//#region extensions/codex/src/app-server/cyber-failover.ts
/**
* Automatic Daybreak escalation for OpenAI cyber-policy refusals.
*
* OpenAI refuses some defensive-cyber work on its general models and directs
* approved workspaces to a Daybreak model instead. When a turn is refused, the
* harness retries it once on the configured Daybreak model so the refused work
* reaches the tier allowed to answer it. Only a refused turn is ever routed
* there, and the retry never changes the session's stored model selection.
*
* Authorization stays server-owned. `model/list` advertises Daybreak to every
* client, but an unentitled workspace still gets 401/403 on use, and each such
* attempt costs the transport's full five-try reconnect ladder. Entitlement is
* therefore only ever observed from an actual attempt, and a failure is
* remembered per workspace so siblings do not each pay for it.
*/
const DEFAULT_CYBER_FAILOVER = {
	mode: "auto",
	model: "gpt-daybreak-blue-latest",
	cooloffMs: 6e5
};
function resolveCodexCyberFailoverConfig(pluginConfig) {
	const configured = readCodexPluginConfig(pluginConfig).appServer?.cyberFailover;
	if (!configured) return DEFAULT_CYBER_FAILOVER;
	return {
		mode: configured.mode ?? DEFAULT_CYBER_FAILOVER.mode,
		model: configured.model ?? DEFAULT_CYBER_FAILOVER.model,
		cooloffMs: configured.cooloffMs ?? DEFAULT_CYBER_FAILOVER.cooloffMs
	};
}
const unavailableTargets = /* @__PURE__ */ new Map();
const MAX_UNAVAILABLE_TARGETS = 256;
const inFlightProbes = /* @__PURE__ */ new Set();
function targetKey(model, workspace) {
	const normalized = model.trim().toLowerCase();
	const slashIndex = normalized.lastIndexOf("/");
	return [
		workspace?.agentId?.trim().toLowerCase() ?? "",
		workspace?.authProfileId?.trim().toLowerCase() ?? "",
		slashIndex >= 0 ? normalized.slice(slashIndex + 1) : normalized
	].join("\0");
}
/** Marks a workspace/target probe in flight; the returned handle releases it. */
function reserveCodexCyberProbe(params) {
	const key = targetKey(params.model, params.workspace);
	inFlightProbes.add(key);
	return () => {
		inFlightProbes.delete(key);
	};
}
/** Remembers that this workspace cannot use the target for `cooloffMs`. */
function recordCodexCyberTargetUnavailable(params) {
	if (params.cooloffMs <= 0) return;
	const now = params.now ?? Date.now();
	for (const [key, expiresAt] of unavailableTargets) if (expiresAt <= now) unavailableTargets.delete(key);
	while (unavailableTargets.size >= MAX_UNAVAILABLE_TARGETS) {
		const oldest = unavailableTargets.keys().next();
		if (oldest.done) break;
		unavailableTargets.delete(oldest.value);
	}
	unavailableTargets.set(targetKey(params.model, params.workspace), now + params.cooloffMs);
}
/** Decides whether a refused turn may be retried on Daybreak. */
function planCodexCyberEscalation(params) {
	const { config } = params;
	if (config.mode !== "auto") return {
		kind: "skip",
		reason: "disabled"
	};
	if (!params.replaySafe) return {
		kind: "skip",
		reason: "not_replay_safe"
	};
	if (!config.model.trim()) return {
		kind: "skip",
		reason: "no_target"
	};
	const key = targetKey(config.model, params.workspace);
	if (params.currentModel && targetKey(params.currentModel, params.workspace) === key) return {
		kind: "skip",
		reason: "already_daybreak"
	};
	const now = params.now ?? Date.now();
	const expiresAt = unavailableTargets.get(key);
	if (expiresAt !== void 0 && expiresAt <= now) unavailableTargets.delete(key);
	else if (expiresAt !== void 0) return {
		kind: "skip",
		reason: "target_unavailable"
	};
	if (inFlightProbes.has(key)) return {
		kind: "skip",
		reason: "probe_in_flight"
	};
	return {
		kind: "escalate",
		model: config.model
	};
}
const AUTHORIZATION_FAILURE_RE = /\b(401|403)\b|unauthorized|not authorized|forbidden/i;
/** Everything the escalation decision needs from one attempt outcome. */
function readCodexCyberAttemptVerdict(result) {
	const message = result?.currentAttemptAssistant;
	const refusals = message?.role === "assistant" ? message.diagnostics ?? [] : [];
	const cyberRefused = result?.terminal.kind === "ok" && refusals.some((d) => d.type === "provider_refusal" && d.details?.category === "cyber" && d.details?.provider === "openai");
	const promptError = result ? attemptTerminal.project(result.terminal).promptError : void 0;
	const answered = !(promptError !== void 0 && promptError !== null) && message?.role === "assistant" && !refusals.some((d) => d.type === "provider_refusal") && message.stopReason !== "error" && message.stopReason !== "aborted";
	const errorTexts = [
		typeof promptError === "string" ? promptError : void 0,
		promptError instanceof Error ? promptError.message : void 0,
		result?.lastAssistant?.errorMessage,
		message?.errorMessage
	];
	return {
		cyberRefused,
		replaySafe: result?.replayMetadata?.replaySafe === true && result.runtimeContinuationStarted !== true,
		answered,
		unavailable: errorTexts.some((t) => t !== void 0 && AUTHORIZATION_FAILURE_RE.test(t))
	};
}
//#endregion
export { planCodexCyberEscalation, readCodexCyberAttemptVerdict, recordCodexCyberTargetUnavailable, reserveCodexCyberProbe, resolveCodexCyberFailoverConfig };
