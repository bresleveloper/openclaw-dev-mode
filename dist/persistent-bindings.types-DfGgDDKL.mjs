import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { l as resolveAgentIdFromSessionKey, p as sanitizeAgentId } from "./session-key-C09ow4h0.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
//#region src/acp/persistent-bindings.types.ts
function normalizeMode(value) {
	return normalizeOptionalLowercaseString(value) === "oneshot" ? "oneshot" : "persistent";
}
function normalizeBindingConfig(raw) {
	if (!raw || typeof raw !== "object") return {};
	const shape = raw;
	const mode = normalizeOptionalString(shape.mode);
	return {
		mode: mode ? normalizeMode(mode) : void 0,
		cwd: normalizeOptionalString(shape.cwd),
		backend: normalizeOptionalString(shape.backend),
		label: normalizeOptionalString(shape.label)
	};
}
function buildConfiguredAcpSessionKey(spec) {
	const hash = sha256HexPrefixCore(`${spec.channel}:${spec.accountId}:${spec.conversationId}`, 16);
	return `agent:${sanitizeAgentId(spec.agentId)}:acp:binding:${spec.channel}:${spec.accountId}:${hash}`;
}
function toConfiguredAcpBindingRecord(spec) {
	return {
		bindingId: `config:acp:${spec.channel}:${spec.accountId}:${spec.conversationId}`,
		targetSessionKey: buildConfiguredAcpSessionKey(spec),
		targetKind: "session",
		conversation: {
			channel: spec.channel,
			accountId: spec.accountId,
			conversationId: spec.conversationId,
			parentConversationId: spec.parentConversationId
		},
		status: "active",
		boundAt: 0,
		metadata: {
			source: "config",
			mode: spec.mode,
			agentId: spec.agentId,
			...spec.acpAgentId ? { acpAgentId: spec.acpAgentId } : {},
			label: spec.label,
			...spec.model ? { model: spec.model } : {},
			...spec.thinking ? { thinking: spec.thinking } : {},
			...spec.backend ? { backend: spec.backend } : {},
			...spec.cwd ? { cwd: spec.cwd } : {}
		}
	};
}
function parseConfiguredAcpSessionKey(sessionKey) {
	const trimmed = sessionKey.trim();
	if (!trimmed.startsWith("agent:")) return null;
	const rest = trimmed.slice(trimmed.indexOf(":") + 1);
	const nextSeparator = rest.indexOf(":");
	if (nextSeparator === -1) return null;
	const tokens = rest.slice(nextSeparator + 1).split(":");
	if (tokens.length !== 5 || tokens[0] !== "acp" || tokens[1] !== "binding") return null;
	const channel = normalizeOptionalLowercaseString(tokens[2]);
	if (!channel) return null;
	return {
		channel,
		accountId: normalizeAccountId(tokens[3] ?? "default")
	};
}
function resolveConfiguredAcpBindingSpecFromRecord(record) {
	if (record.targetKind !== "session") return null;
	const conversationId = record.conversation.conversationId.trim();
	if (!conversationId) return null;
	const agentId = normalizeOptionalString(record.metadata?.agentId) ?? resolveAgentIdFromSessionKey(record.targetSessionKey);
	if (!agentId) return null;
	return {
		channel: record.conversation.channel,
		accountId: normalizeAccountId(record.conversation.accountId),
		conversationId,
		parentConversationId: normalizeOptionalString(record.conversation.parentConversationId),
		agentId,
		acpAgentId: normalizeOptionalString(record.metadata?.acpAgentId),
		mode: normalizeMode(record.metadata?.mode),
		model: normalizeOptionalString(record.metadata?.model),
		thinking: normalizeOptionalString(record.metadata?.thinking),
		cwd: normalizeOptionalString(record.metadata?.cwd),
		backend: normalizeOptionalString(record.metadata?.backend),
		label: normalizeOptionalString(record.metadata?.label)
	};
}
//#endregion
export { resolveConfiguredAcpBindingSpecFromRecord as a, parseConfiguredAcpSessionKey as i, normalizeBindingConfig as n, toConfiguredAcpBindingRecord as o, normalizeMode as r, buildConfiguredAcpSessionKey as t };
