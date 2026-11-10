import { t as matchesAcpSessionControlBinding } from "./session-control-owner-CbeH1iSF.mjs";
//#region src/acp/runtime/session-meta-entry.kernel.ts
function captureAcpSessionEntryBinding({ sessionId, lifecycleRevision, sessionStartedAt }) {
	return {
		sessionId,
		lifecycleRevision,
		sessionStartedAt
	};
}
/** A fresh row may change metadata, but cannot replace the lifecycle or cleanup target. */
function assertAcpSessionMutationEntry(entry, expected, control, phase) {
	if (!(expected === null ? entry === void 0 : entry !== void 0 && entry.sessionId === expected.sessionId && entry.lifecycleRevision === expected.lifecycleRevision && (expected.lifecycleRevision !== void 0 || entry.sessionStartedAt === expected.sessionStartedAt)) || control && !matchesAcpSessionControlBinding(entry, control)) throw new Error(`Canonical ACP session changed before ${phase}.`);
}
//#endregion
export { captureAcpSessionEntryBinding as n, assertAcpSessionMutationEntry as t };
