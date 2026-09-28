import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as resolveSessionIdMatchSelection } from "./session-id-resolution-CJjzDrhT.mjs";
import { o as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-CVR56ULk.mjs";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-Bb3P3TzM.mjs";
import { s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-DqGvpsY3.mjs";
import "./session-utils-AxixtEyo.mjs";
//#region src/gateway/worker-environments/session-target.ts
function resolveWorkerSessionTarget(cfg, sessionId) {
	const { store, targetsBySessionKey } = loadCombinedSessionStoreForGatewayCore(cfg);
	const matches = Object.entries(store).filter(([, entry]) => entry.sessionId === sessionId);
	const selection = resolveSessionIdMatchSelection(matches, sessionId);
	if (selection.kind !== "selected") return;
	const agentId = expectDefined(targetsBySessionKey.get(selection.sessionKey), "worker session owner").agentId;
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg,
		key: selection.sessionKey,
		agentId,
		clone: false,
		exactRead: true
	});
	const entry = resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
	if (!entry || entry.sessionId !== sessionId) return;
	return {
		agentId: target.agentId,
		sessionEntry: entry,
		sessionId,
		sessionKey: target.canonicalKey,
		sessionStore: target.store,
		storePath: target.storePath
	};
}
//#endregion
export { resolveWorkerSessionTarget as t };
