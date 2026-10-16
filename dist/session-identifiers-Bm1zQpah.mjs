import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { o as isSessionIdentityPending, u as resolveSessionIdentityFromMeta } from "./session-identity-C841eE6a.mjs";
//#region packages/acp-core/src/runtime/session-identifiers.ts
const ACP_SESSION_IDENTITY_RENDERER_VERSION = "v1";
const ACP_AGENT_RESUME_COMMAND_BY_KEY = /* @__PURE__ */ new Map([
	["codex", "codex"],
	["openai", "codex"],
	["codex-cli", "codex"],
	["kimi", "kimi"],
	["moonshot-kimi", "kimi"]
]);
function normalizeAgentHintKey(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	return normalizeLowercaseStringOrEmpty(normalized).replace(/[\s_]+/g, "-");
}
function resolveAcpAgentResumeHintLine(params) {
	const agentSessionId = normalizeOptionalString(params.agentSessionId);
	const agentKey = normalizeAgentHintKey(params.agentId);
	if (!agentSessionId || !agentKey) return;
	const command = ACP_AGENT_RESUME_COMMAND_BY_KEY.get(agentKey);
	if (!command) return;
	return `resume in ${command === "codex" ? "Codex" : "Kimi"} CLI: \`${command} resume ${agentSessionId}\` (continues this conversation).`;
}
/** Renders resolved ACP backend/agent ids, hiding pending ids from thread intros. */
function resolveAcpSessionIdentifierLinesFromIdentity(params) {
	const backend = normalizeOptionalString(params.backend) ?? "backend";
	const mode = params.mode ?? "status";
	const identity = params.identity;
	const agentSessionId = normalizeOptionalString(identity?.agentSessionId);
	const acpxSessionId = normalizeOptionalString(identity?.acpxSessionId);
	const acpxRecordId = normalizeOptionalString(identity?.acpxRecordId);
	const hasIdentifier = Boolean(agentSessionId || acpxSessionId || acpxRecordId);
	if (isSessionIdentityPending(identity) && hasIdentifier) {
		if (mode === "status") return ["session ids: pending (available after the first reply)"];
		return [];
	}
	const lines = [];
	if (agentSessionId) lines.push(`agent session id: ${agentSessionId}`);
	if (acpxSessionId) lines.push(`${backend} session id: ${acpxSessionId}`);
	if (acpxRecordId) lines.push(`${backend} record id: ${acpxRecordId}`);
	return lines;
}
/** Resolves the runtime cwd, preferring modern runtimeOptions over legacy metadata. */
function resolveAcpSessionCwd(meta) {
	return normalizeOptionalString(meta?.runtimeOptions?.cwd) ?? normalizeOptionalString(meta?.cwd);
}
/** Renders thread-detail identifier lines plus a backend-specific resume hint when stable. */
function resolveAcpThreadSessionDetailLines(params) {
	const meta = params.meta;
	const identity = resolveSessionIdentityFromMeta(meta);
	const lines = resolveAcpSessionIdentifierLinesFromIdentity({
		backend: normalizeOptionalString(meta?.backend) ?? "backend",
		identity,
		mode: "thread"
	});
	if (lines.length === 0) return lines;
	const hint = resolveAcpAgentResumeHintLine({
		agentId: meta?.agent,
		agentSessionId: identity?.agentSessionId
	});
	if (hint) lines.push(hint);
	return lines;
}
//#endregion
export { resolveAcpThreadSessionDetailLines as i, resolveAcpSessionCwd as n, resolveAcpSessionIdentifierLinesFromIdentity as r, ACP_SESSION_IDENTITY_RENDERER_VERSION as t };
