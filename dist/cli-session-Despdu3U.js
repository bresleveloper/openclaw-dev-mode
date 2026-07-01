import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { o as normalizeProviderId } from "./model-selection-normalize-Df7baLev.js";
import "./model-selection-i8V2iTdL.js";
import crypto from "node:crypto";
//#region src/agents/cli-session.ts
/**
* CLI session persistence helpers.
* Keeps provider-keyed session bindings, reuse fingerprints, and legacy
* Claude CLI state in one normalized session-store contract.
*/
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
/** Hash CLI session-sensitive text so reuse checks can compare stable fingerprints. */
function hashCliSessionText(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return crypto.createHash("sha256").update(trimmed).digest("hex");
}
/** Read the stored CLI session binding for a provider, including legacy Claude state. */
function getCliSessionBinding(entry, provider) {
	if (!entry) return;
	const normalized = normalizeProviderId(provider);
	const fromBindings = entry.cliSessionBindings?.[normalized];
	const bindingSessionId = normalizeOptionalString(fromBindings?.sessionId);
	if (bindingSessionId) return {
		sessionId: bindingSessionId,
		...fromBindings?.forceReuse === true ? { forceReuse: true } : {},
		authProfileId: normalizeOptionalString(fromBindings?.authProfileId),
		authEpoch: normalizeOptionalString(fromBindings?.authEpoch),
		authEpochVersion: fromBindings?.authEpochVersion,
		extraSystemPromptHash: normalizeOptionalString(fromBindings?.extraSystemPromptHash),
		messageToolPolicyHash: normalizeOptionalString(fromBindings?.messageToolPolicyHash),
		promptToolNamesHash: normalizeOptionalString(fromBindings?.promptToolNamesHash),
		cwdHash: normalizeOptionalString(fromBindings?.cwdHash),
		mcpConfigHash: normalizeOptionalString(fromBindings?.mcpConfigHash),
		mcpResumeHash: normalizeOptionalString(fromBindings?.mcpResumeHash)
	};
	const fromMap = entry.cliSessionIds?.[normalized];
	const normalizedFromMap = normalizeOptionalString(fromMap);
	if (normalizedFromMap) return { sessionId: normalizedFromMap };
	if (normalized === CLAUDE_CLI_BACKEND_ID) {
		const legacy = normalizeOptionalString(entry.claudeCliSessionId);
		if (legacy) return { sessionId: legacy };
	}
}
/** Read just the reusable CLI session ID for a provider. */
function getCliSessionId(entry, provider) {
	return getCliSessionBinding(entry, provider)?.sessionId;
}
/** Store a reusable CLI session ID without extra reuse guards. */
function setCliSessionId(entry, provider, sessionId) {
	setCliSessionBinding(entry, provider, { sessionId });
}
/** Store a CLI session binding and mirror it to legacy/simple session-id fields. */
function setCliSessionBinding(entry, provider, binding) {
	const normalized = normalizeProviderId(provider);
	const trimmed = binding.sessionId.trim();
	if (!trimmed) return;
	entry.cliSessionBindings = {
		...entry.cliSessionBindings,
		[normalized]: {
			sessionId: trimmed,
			...binding.forceReuse === true ? { forceReuse: true } : {},
			...normalizeOptionalString(binding.authProfileId) ? { authProfileId: normalizeOptionalString(binding.authProfileId) } : {},
			...normalizeOptionalString(binding.authEpoch) ? { authEpoch: normalizeOptionalString(binding.authEpoch) } : {},
			...typeof binding.authEpochVersion === "number" && Number.isFinite(binding.authEpochVersion) ? { authEpochVersion: binding.authEpochVersion } : {},
			...normalizeOptionalString(binding.extraSystemPromptHash) ? { extraSystemPromptHash: normalizeOptionalString(binding.extraSystemPromptHash) } : {},
			...normalizeOptionalString(binding.messageToolPolicyHash) ? { messageToolPolicyHash: normalizeOptionalString(binding.messageToolPolicyHash) } : {},
			...normalizeOptionalString(binding.promptToolNamesHash) ? { promptToolNamesHash: normalizeOptionalString(binding.promptToolNamesHash) } : {},
			...normalizeOptionalString(binding.cwdHash) ? { cwdHash: normalizeOptionalString(binding.cwdHash) } : {},
			...normalizeOptionalString(binding.mcpConfigHash) ? { mcpConfigHash: normalizeOptionalString(binding.mcpConfigHash) } : {},
			...normalizeOptionalString(binding.mcpResumeHash) ? { mcpResumeHash: normalizeOptionalString(binding.mcpResumeHash) } : {}
		}
	};
	entry.cliSessionIds = {
		...entry.cliSessionIds,
		[normalized]: trimmed
	};
	if (normalized === CLAUDE_CLI_BACKEND_ID) entry.claudeCliSessionId = trimmed;
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
/** Remove every CLI session binding from a session entry. */
function clearAllCliSessions(entry) {
	entry.cliSessionBindings = void 0;
	entry.cliSessionIds = void 0;
	entry.claudeCliSessionId = void 0;
}
/** Decide whether a stored CLI session can be reused for the current auth/prompt/cwd/MCP state. */
function resolveCliSessionReuse(params) {
	const binding = params.binding;
	const sessionId = normalizeOptionalString(binding?.sessionId);
	if (!sessionId) return {};
	if (binding?.forceReuse === true) return { sessionId };
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
		if (!hasMatchingVersionedAuthEpoch) return { invalidatedReason: "auth-profile" };
	}
	if (binding?.authEpochVersion === params.authEpochVersion && storedAuthEpoch !== currentAuthEpoch) return { invalidatedReason: "auth-epoch" };
	if (normalizeOptionalString(binding?.extraSystemPromptHash) !== currentExtraSystemPromptHash) return { invalidatedReason: "system-prompt" };
	if (normalizeOptionalString(binding?.messageToolPolicyHash) !== currentMessageToolPolicyHash) return { invalidatedReason: "system-prompt" };
	if (normalizeOptionalString(binding?.promptToolNamesHash) !== currentPromptToolNamesHash) return { invalidatedReason: "system-prompt" };
	const storedCwdHash = normalizeOptionalString(binding?.cwdHash);
	if (storedCwdHash !== void 0 && storedCwdHash !== currentCwdHash) return { invalidatedReason: "cwd" };
	const storedMcpResumeHash = normalizeOptionalString(binding?.mcpResumeHash);
	if (storedMcpResumeHash && currentMcpResumeHash) {
		if (storedMcpResumeHash !== currentMcpResumeHash) return { invalidatedReason: "mcp" };
		return { sessionId };
	}
	if (normalizeOptionalString(binding?.mcpConfigHash) !== currentMcpConfigHash) return { invalidatedReason: "mcp" };
	return { sessionId };
}
//#endregion
export { hashCliSessionText as a, setCliSessionId as c, getCliSessionId as i, clearCliSession as n, resolveCliSessionReuse as o, getCliSessionBinding as r, setCliSessionBinding as s, clearAllCliSessions as t };
