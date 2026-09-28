import { c as readErrorName } from "./error-coercion-C787aVxk.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import "./errors-DnjwnOju.mjs";
import { a as isFailoverError } from "./error-ON38hPhx.mjs";
import { r as normalizeCliSessionReseedReceipt } from "./cli-session-binding-BhV_HbVa.mjs";
import "./failover-error-BwAkMLuL.mjs";
import crypto from "node:crypto";
//#region src/agents/cli-session.ts
/**
* CLI session persistence helpers.
* Keeps provider-keyed session bindings and reuse fingerprints in one
* normalized session-store contract.
*/
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
/** Whether a failover proves the provider-side conversation can no longer be resumed. */
function isCliSessionInvalidatingFailoverReason(reason) {
	return reason === "session_expired";
}
/** Hash CLI session-sensitive text so reuse checks can compare stable fingerprints. */
function hashCliSessionText(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return crypto.createHash("sha256").update(trimmed).digest("hex");
}
/** Projects explicit native continuity; diagnostic sessionId can name the local session. */
function applyCliSessionBindingResult(entry, provider, meta) {
	if (meta?.clearCliSessionBinding === true) clearCliSession(entry, provider);
	else if (meta?.cliSessionBinding?.sessionId.trim()) setCliSessionBinding(entry, provider, meta.cliSessionBinding);
	else return false;
	return true;
}
/** Revalidates the exact turn owner at native continuity's synchronous commit edge. */
function assertCliSessionBindingResultCommitAllowed(meta, assertSettlementCurrent, abortSignal) {
	assertSettlementCurrent();
	if (meta?.clearCliSessionBinding !== true) abortSignal?.throwIfAborted();
}
/** Store a CLI session binding and mirror it to the provider-keyed session-id map. */
function setCliSessionBinding(entry, provider, binding) {
	const normalized = normalizeProviderId(provider);
	const trimmed = binding.sessionId.trim();
	if (!trimmed) return;
	const previousBinding = entry.cliSessionBindings?.[normalized];
	const previousReceipt = normalizeOptionalString(previousBinding?.sessionId) === trimmed ? normalizeCliSessionReseedReceipt(previousBinding?.reseedReceipt) : void 0;
	const reseedReceipt = normalizeCliSessionReseedReceipt(binding.reseedReceipt) ?? previousReceipt;
	entry.cliSessionBindings = {
		...entry.cliSessionBindings,
		[normalized]: {
			sessionId: trimmed,
			...normalizeOptionalString(binding.resumeCheckpointId) ? { resumeCheckpointId: normalizeOptionalString(binding.resumeCheckpointId) } : {},
			...binding.forceReuse === true ? { forceReuse: true } : {},
			...binding.forkNextResume === true ? { forkNextResume: true } : {},
			...normalizeOptionalString(binding.authProfileId) ? { authProfileId: normalizeOptionalString(binding.authProfileId) } : {},
			...normalizeOptionalString(binding.authEpoch) ? { authEpoch: normalizeOptionalString(binding.authEpoch) } : {},
			...typeof binding.authEpochVersion === "number" && Number.isFinite(binding.authEpochVersion) ? { authEpochVersion: binding.authEpochVersion } : {},
			...normalizeOptionalString(binding.extraSystemPromptHash) ? { extraSystemPromptHash: normalizeOptionalString(binding.extraSystemPromptHash) } : {},
			...normalizeOptionalString(binding.messageToolPolicyHash) ? { messageToolPolicyHash: normalizeOptionalString(binding.messageToolPolicyHash) } : {},
			...normalizeOptionalString(binding.promptToolNamesHash) ? { promptToolNamesHash: normalizeOptionalString(binding.promptToolNamesHash) } : {},
			...normalizeOptionalString(binding.cwdHash) ? { cwdHash: normalizeOptionalString(binding.cwdHash) } : {},
			...normalizeOptionalString(binding.mcpConfigHash) ? { mcpConfigHash: normalizeOptionalString(binding.mcpConfigHash) } : {},
			...normalizeOptionalString(binding.mcpResumeHash) ? { mcpResumeHash: normalizeOptionalString(binding.mcpResumeHash) } : {},
			...reseedReceipt ? { reseedReceipt } : {}
		}
	};
	entry.cliSessionIds = {
		...entry.cliSessionIds,
		[normalized]: trimmed
	};
}
/** Remove the stored CLI session binding for one provider. */
function clearCliSession(entry, provider) {
	const normalized = normalizeProviderId(provider);
	if (entry.cliSessionBindings?.[normalized] !== void 0) {
		const next = { ...entry.cliSessionBindings };
		delete next[normalized];
		entry.cliSessionBindings = Object.keys(next).length > 0 ? next : void 0;
	}
	if (entry.cliSessionIds?.[normalized] !== void 0) {
		const next = { ...entry.cliSessionIds };
		delete next[normalized];
		entry.cliSessionIds = Object.keys(next).length > 0 ? next : void 0;
	}
	if (normalized === CLAUDE_CLI_BACKEND_ID) entry.claudeCliSessionId = void 0;
}
/** Cancellation invalidates an unfinished replacement, not established continuity. */
function shouldClearInterruptedCliSessionBinding(params) {
	return params.interrupted && params.bindingReplacedDuringRun;
}
/** Decide whether a failed CLI turn invalidates the binding it tried to resume. */
function shouldClearFailedCliSessionBinding(params) {
	if (!normalizeOptionalString(params.binding?.sessionId)) return false;
	if (params.hasNewGeneratedMediaTask === true) return false;
	if (isFailoverError(params.error)) return isCliSessionInvalidatingFailoverReason(params.error.reason);
	return shouldClearInterruptedCliSessionBinding({
		interrupted: readErrorName(params.error) === "AbortError",
		bindingReplacedDuringRun: params.bindingReplacedDuringRun === true
	});
}
/** Stable reason used when recording why a failed reused CLI session was cleared. */
function resolveCliSessionClearReason(error) {
	return isFailoverError(error) ? error.reason : readErrorName(error) ?? "error";
}
const CLI_SESSION_DRIFT_NOTE_PREFIX = "OpenClaw resumed this CLI session after prompt content changed.";
/** User-turn note telling a resumed CLI session that its prompt content drifted. */
function buildCliSessionDriftNote(reasons) {
	return `${CLI_SESSION_DRIFT_NOTE_PREFIX} Follow the current turn's instructions; changed=${reasons.join(",")}.`;
}
const CLI_SESSION_DRIFT_NOTE_PREFIXES = [
	buildCliSessionDriftNote(["system-prompt"]),
	buildCliSessionDriftNote(["prompt-tools"]),
	buildCliSessionDriftNote(["system-prompt", "prompt-tools"])
].map((note) => `${note}\n\n`);
function stripCliSessionDriftNote(text) {
	for (const prefix of CLI_SESSION_DRIFT_NOTE_PREFIXES) if (text.startsWith(prefix)) return text.slice(prefix.length);
	return text;
}
/** Decide whether a stored CLI session can be reused for the current auth/prompt/cwd/MCP state. */
function resolveCliSessionReuse(params) {
	const binding = params.binding;
	const sessionId = normalizeOptionalString(binding?.sessionId);
	if (!sessionId) return { mode: "none" };
	if (binding?.forceReuse === true) return {
		mode: "reuse",
		sessionId
	};
	const currentAuthProfileId = normalizeOptionalString(params.authProfileId);
	const currentAuthEpoch = normalizeOptionalString(params.authEpoch);
	const currentExtraSystemPromptHash = normalizeOptionalString(params.extraSystemPromptHash);
	const currentMessageToolPolicyHash = normalizeOptionalString(params.messageToolPolicyHash);
	const currentPromptToolNamesHash = normalizeOptionalString(params.promptToolNamesHash);
	const currentCwdHash = normalizeOptionalString(params.cwdHash);
	const currentMcpConfigHash = normalizeOptionalString(params.mcpConfigHash);
	const currentMcpResumeHash = normalizeOptionalString(params.mcpResumeHash);
	const storedAuthProfileId = normalizeOptionalString(binding?.authProfileId);
	const storedAuthEpoch = normalizeOptionalString(binding?.authEpoch);
	const hasMatchingVersionedAuthEpoch = binding?.authEpochVersion === params.authEpochVersion && storedAuthEpoch !== void 0 && currentAuthEpoch !== void 0 && storedAuthEpoch === currentAuthEpoch;
	if (storedAuthProfileId !== currentAuthProfileId) {
		if (!hasMatchingVersionedAuthEpoch) return {
			mode: "invalidate",
			invalidatedReason: "auth-profile"
		};
	}
	if (binding?.authEpochVersion === params.authEpochVersion && storedAuthEpoch !== currentAuthEpoch) return {
		mode: "invalidate",
		invalidatedReason: "auth-epoch"
	};
	if (normalizeOptionalString(binding?.messageToolPolicyHash) !== currentMessageToolPolicyHash) return {
		mode: "invalidate",
		invalidatedReason: "message-policy"
	};
	const storedCwdHash = normalizeOptionalString(binding?.cwdHash);
	if (storedCwdHash !== void 0 && storedCwdHash !== currentCwdHash) return {
		mode: "invalidate",
		invalidatedReason: "cwd"
	};
	const storedMcpResumeHash = normalizeOptionalString(binding?.mcpResumeHash);
	if (storedMcpResumeHash && currentMcpResumeHash) {
		if (storedMcpResumeHash !== currentMcpResumeHash) return {
			mode: "invalidate",
			invalidatedReason: "mcp"
		};
	} else if (normalizeOptionalString(binding?.mcpConfigHash) !== currentMcpConfigHash) return {
		mode: "invalidate",
		invalidatedReason: "mcp"
	};
	const driftReasons = [];
	if (normalizeOptionalString(binding?.extraSystemPromptHash) !== currentExtraSystemPromptHash) driftReasons.push("system-prompt");
	if (normalizeOptionalString(binding?.promptToolNamesHash) !== currentPromptToolNamesHash) driftReasons.push("prompt-tools");
	if (driftReasons.length > 0) return {
		mode: "reuse-with-drift",
		sessionId,
		drift: { reasons: driftReasons }
	};
	return {
		mode: "reuse",
		sessionId
	};
}
//#endregion
export { hashCliSessionText as a, resolveCliSessionReuse as c, shouldClearInterruptedCliSessionBinding as d, stripCliSessionDriftNote as f, clearCliSession as i, setCliSessionBinding as l, assertCliSessionBindingResultCommitAllowed as n, isCliSessionInvalidatingFailoverReason as o, buildCliSessionDriftNote as r, resolveCliSessionClearReason as s, applyCliSessionBindingResult as t, shouldClearFailedCliSessionBinding as u };
