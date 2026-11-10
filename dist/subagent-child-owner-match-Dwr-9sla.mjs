import { r as normalizeAgentIdStrict, t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { o as parseAgentSessionKeyParts } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
//#region src/agents/subagents/registry/subagent-child-owner-match.ts
function resolveSubagentChildAgentId(entry) {
	const key = entry.childSessionKey?.trim();
	if (!key) return;
	const qualified = /^agent:/i.test(key);
	const parsed = parseAgentSessionKeyParts(key);
	if (qualified && (!parsed || !isValidAgentId(parsed.agentId))) return;
	const keyOwner = parsed?.agentId.toLowerCase();
	if (entry.childAgentId === void 0) return keyOwner;
	if (typeof entry.childAgentId !== "string" || !isValidAgentId(entry.childAgentId)) return;
	const owner = normalizeAgentIdStrict(entry.childAgentId);
	return owner.ok && (!keyOwner || keyOwner === owner.value) ? owner.value : void 0;
}
function resolveRecordedRequester(entry) {
	return resolveSubagentChildAgentId({
		childSessionKey: entry.requesterSessionKey,
		childAgentId: entry.requesterAgentId
	});
}
function resolveSubagentChildAuthority(entry, currentSession) {
	const refusal = (reason) => `Cannot operate on this subagent because its ${reason}. No child work was changed. Inspect the retained record and original execution evidence before retrying.`;
	const childAgentId = resolveSubagentChildAgentId(entry);
	if (!childAgentId) return {
		status: "mismatch",
		error: refusal("owning agent is unresolved")
	};
	const original = entry.childSessionIdentity;
	const sessionId = original?.sessionId?.trim();
	const lifecycleRevision = original?.lifecycleRevision?.trim();
	if (currentSession !== void 0 && (original?.sessionId && original.sessionId !== currentSession?.sessionId || original?.lifecycleRevision && original.lifecycleRevision !== currentSession?.lifecycleRevision)) return {
		status: "mismatch",
		error: refusal("original session incarnation changed")
	};
	const requesterAgentId = resolveSubagentChildAgentId({
		childSessionKey: entry.requesterSessionKey,
		childAgentId: entry.requesterAgentId
	});
	if (!sessionId || !lifecycleRevision) return requesterAgentId ? {
		status: "legacy-unverified",
		childAgentId,
		requesterAgentId,
		error: refusal("original session incarnation is unresolved")
	} : {
		status: "mismatch",
		error: refusal("requester ownership is unresolved")
	};
	return {
		status: "verified",
		childAgentId,
		requesterAgentId,
		sessionIdentity: {
			sessionId,
			lifecycleRevision
		}
	};
}
let warnedLegacyAuthority = false;
function warnLegacySubagentAuthority(entries, warn) {
	if (warnedLegacyAuthority) return;
	const runIds = /* @__PURE__ */ new Set();
	const sampleRunIds = [];
	for (const entry of entries) if (!runIds.has(entry.runId) && resolveSubagentChildAuthority(entry).status === "legacy-unverified") {
		runIds.add(entry.runId);
		if (sampleRunIds.length < 3) sampleRunIds.push(entry.runId);
	}
	if (runIds.size === 0) return;
	warnedLegacyAuthority = true;
	warn("Subagent original session identity or lifecycle revision is unavailable; requester work continues with child-session effects suppressed.", {
		count: runIds.size,
		sampleRunIds
	});
}
function matchesSubagentChildSessionOwner(entry, childSessionKey, childAgentId) {
	if (entry.childSessionKey !== childSessionKey) return false;
	const owner = resolveSubagentChildAgentId(entry);
	return owner !== void 0 && owner === resolveSubagentChildAgentId({
		childSessionKey,
		childAgentId
	});
}
//#endregion
export { warnLegacySubagentAuthority as a, resolveSubagentChildAuthority as i, resolveRecordedRequester as n, resolveSubagentChildAgentId as r, matchesSubagentChildSessionOwner as t };
