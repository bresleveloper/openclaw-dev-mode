import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { S as isCronSessionKey, b as isAcpSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { t as intersectOperatorScopes } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { a as isAgentHarnessSessionKey } from "./agent-harness-session-key-zbrcLVpT.mjs";
//#region src/agents/operator-run-recovery-source.ts
/** Admission writes this with its source claim, never by reconstructing session attribution. */
function createRestartRecoveryOperatorSource(params) {
	const { authority, entry, sessionKey } = params;
	if (!authority) return;
	assertAdmittedRunOperatorAuthority(authority);
	authority.assertCurrent();
	const snapshot = authority.recoverySnapshot;
	const requesterSettle = params.inputProvenance?.kind === "inter_session" && params.inputProvenance.sourceTool === "subagent_settle" && params.inputProvenance.sourceChannel === "internal" && params.sourceRunId.startsWith("announce:requester-settle:") && Boolean(params.inputProvenance.sourceSessionKey?.trim());
	if (!snapshot || entry.incognito || entry.spawnedBy || entry.subagentRole || (entry.spawnDepth ?? 0) > 0 || entry.completionOwnerSessionKey || entry.acp || entry.pluginOwnerId || entry.cronRunContinuation || params.inputProvenance && params.inputProvenance.kind !== "external_user" && !requesterSettle || isCronSessionKey(sessionKey) || isSubagentSessionKey(sessionKey) || isAcpSessionKey(sessionKey) || isAgentHarnessSessionKey(sessionKey)) return;
	const source = {
		version: 1,
		agentId: params.agentId,
		sessionKey,
		sessionId: entry.sessionId,
		...entry.lifecycleRevision !== void 0 ? { lifecycleRevision: entry.lifecycleRevision } : {},
		sourceRunId: params.sourceRunId,
		snapshot: {
			...structuredClone(snapshot),
			scopes: intersectOperatorScopes(snapshot.scopes, authority.scopes)
		}
	};
	return Buffer.byteLength(JSON.stringify(source), "utf8") <= 65536 ? freezeJsonSnapshot(source) : void 0;
}
//#endregion
export { createRestartRecoveryOperatorSource as t };
