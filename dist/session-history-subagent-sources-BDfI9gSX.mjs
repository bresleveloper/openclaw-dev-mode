import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as withScopedOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-scope-DUxQ_9sC.mjs";
import { d as readWithCanonicalSessionAdmission } from "./session-canonical-key-B7chVWi3.mjs";
import { o as readExactSessionEntryRow, s as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { i as resolveGatewaySessionStoreReadResults } from "./session-utils-store-selection-DIMLgaMc.mjs";
import { n as readAcpSessionMetaForEntry } from "./session-meta-readonly-CHaonIQO.mjs";
import { n as isSubagentSessionFromEntry } from "./subagent-depth-policy-eTFubFiU.mjs";
//#region src/gateway/session-history-subagent-sources.ts
/** Auxiliary metadata never chooses one of several matching canonical source rows. */
function readGatewaySessionEntryFromSources(sessionKey, sources, current) {
	if (sources.length === 0) return;
	const selected = resolveGatewaySessionStoreReadResults({
		canonicalKey: sessionKey,
		scanTargets: [sessionKey],
		deferCanonicalValidation: true,
		reads: sources.map((source) => ({
			storePath: source.path,
			readSource: source
		})),
		readStore: ({ readSource }) => {
			if (current && readSource.path === current.source.path && readSource.agentId === current.source.agentId) return current.entry ? { [sessionKey]: current.entry } : {};
			try {
				const result = withScopedOpenClawAgentDatabaseReadOnly((database) => readWithCanonicalSessionAdmission(database, () => readExactSessionEntryRowValidated(database, sessionKey, "list")?.entry), readSource);
				return result.found && result.value ? { [sessionKey]: result.value } : {};
			} catch {
				return {};
			}
		}
	});
	return selected.canonicalValidationError ? void 0 : selected.match?.entry;
}
/** Source lineage is independent of which live or archived transcript is being displayed. */
function createBoundSessionHistorySubagentSource(readSnapshot, stateDatabase, readSourceDatabases, sources = /* @__PURE__ */ new Map()) {
	const readSource = (projection, sessionKey) => {
		const cached = sources.get(sessionKey);
		if (cached !== void 0) return cached;
		if (isSubagentSessionFromEntry(sessionKey, void 0)) {
			sources.set(sessionKey, true);
			return true;
		}
		const sourceAgentId = parseAgentSessionKey(sessionKey)?.agentId;
		const sourceDatabases = readSourceDatabases();
		const ownSource = {
			agentId: projection.database.agentId,
			path: projection.database.path
		};
		const hasPreparedSource = Boolean(sourceAgentId && sourceDatabases && Object.hasOwn(sourceDatabases, sourceAgentId));
		const candidates = sourceAgentId && sourceDatabases && hasPreparedSource ? [...sourceDatabases[sourceAgentId] ?? []] : [];
		if (!sourceAgentId || sourceAgentId === projection.resolved.agentId || !hasPreparedSource) {
			if (!candidates.some((source) => source.agentId === ownSource.agentId && source.path === ownSource.path)) candidates.unshift(ownSource);
		}
		const ownCandidate = candidates.find((source) => source.agentId === ownSource.agentId && source.path === ownSource.path);
		const ownEntry = ownCandidate ? readExactSessionEntryRow(projection.database, sessionKey, "list")?.entry : void 0;
		const entry = readGatewaySessionEntryFromSources(sessionKey, candidates, {
			source: ownCandidate ?? ownSource,
			entry: ownEntry
		});
		let child = isSubagentSessionFromEntry(sessionKey, entry);
		if (!child && entry && (entry.parentSessionKey || entry.spawnedBy) && stateDatabase) {
			const acp = readAcpSessionMetaForEntry({
				sessionKey,
				agentId: parseAgentSessionKey(sessionKey)?.agentId,
				entry,
				databasePath: stateDatabase.path,
				env: stateDatabase.environment
			});
			child = isSubagentSessionFromEntry(sessionKey, entry, acp);
		}
		sources.set(sessionKey, child);
		return child;
	};
	return (sessionKey) => sources.get(sessionKey) ?? readSnapshot((projection) => readSource(projection, sessionKey));
}
//#endregion
export { createBoundSessionHistorySubagentSource as t };
