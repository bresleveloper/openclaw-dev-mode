import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import { r as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-DLTnzTd_.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import { t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { o as readExactSessionEntryRow } from "./session-accessor.sqlite-entry-read-yAa3_SVY.mjs";
import { i as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-BBylVEaq.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
//#region src/config/sessions/session-accessor.sqlite-entry-read-lifetime.ts
/** Retain canonical target facts independently of the listing cache's invalidation lifecycle. */
function captureSessionEntryRead(database, sessionKey) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	const capture = () => runSqliteDeferredTransactionSync(database.db, () => {
		const selected = readExactSessionEntryRow(database, sessionKey, "list");
		return selected ? {
			entry: selected.entry,
			agentId: database.agentId,
			sessionKey: selected.row.session_key,
			rowid: selected.row.rowid,
			sessionId: selected.row.current_session_id,
			updatedAt: selected.row.updated_at,
			lifecycleRevision: selected.entry.lifecycleRevision,
			digest: sha256Hex(JSON.stringify({
				...selected.entry,
				lastReadAt: void 0
			}))
		} : void 0;
	});
	const selected = capture();
	let released = false;
	return {
		entry: selected?.entry,
		isCurrent: () => {
			if (released || !database.db.isOpen) return false;
			const current = capture();
			if (!selected || !current) return selected === current;
			return current.agentId === selected.agentId && current.sessionKey === selected.sessionKey && current.sessionId === selected.sessionId && current.updatedAt === selected.updatedAt && current.lifecycleRevision === selected.lifecycleRevision && current.digest === selected.digest;
		},
		release: () => {
			released = true;
		}
	};
}
//#endregion
//#region src/gateway/session-utils-read-lifetime.ts
/** Retain the selected row and physical owner through asynchronous metadata preparation. */
function retainGatewaySessionEntryReadOnly(sessionKey, agentId) {
	const options = {
		agentId,
		projection: "list"
	};
	const selected = loadGatewaySessionEntryReadOnly(sessionKey, options);
	let released = false;
	const sameRoute = () => {
		const current = loadGatewaySessionEntryReadOnly(sessionKey, options);
		return current.agentId === selected.agentId && current.canonicalKey === selected.canonicalKey && current.legacyKey === selected.legacyKey && current.storePath === selected.storePath && current.readSource?.agentId === selected.readSource?.agentId && current.readSource?.path === selected.readSource?.path;
	};
	if (!selected.readSource) return {
		...selected,
		isCurrent: () => !released,
		isCurrentAtResponse: () => !released && sameRoute() && loadGatewaySessionEntryReadOnly(sessionKey, options).entry === void 0,
		release: () => {
			released = true;
		}
	};
	const retained = retainOpenClawAgentDatabaseReadOnly(selected.readSource);
	if (!retained.found) throw new Error("Session store changed while preparing its metadata. Retry the request.");
	const { database, claim } = retained;
	let entryRead;
	let unregister = () => {};
	const release = () => {
		if (released) return;
		released = true;
		unregister();
		entryRead?.release();
		claim.release();
	};
	try {
		entryRead = captureSessionEntryRead(database, selected.legacyKey ?? selected.canonicalKey);
		const read = entryRead;
		unregister = registerOpenClawAgentDatabaseAsyncResource({
			agentId: database.agentId,
			path: database.path,
			revoke: release,
			close: () => Promise.resolve()
		});
		return {
			...selected,
			entry: read.entry,
			isCurrent: () => !released && claim.isCurrent(),
			isCurrentAtResponse: () => !released && claim.isCurrent() && read.isCurrent() && isOpenClawAgentDatabasePathCurrent(database) && sameRoute(),
			release
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
export { retainGatewaySessionEntryReadOnly as t };
