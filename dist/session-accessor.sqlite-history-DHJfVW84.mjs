import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { c as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { c as normalizeVisibleMessageLimit, i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, n as DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, r as MAX_VISIBLE_MESSAGE_MAX_BYTES, t as DEFAULT_VISIBLE_MESSAGE_MAX_BYTES } from "./session-accessor.sqlite-visible-cursor-CwElG0zY.mjs";
import { r as assertCanonicalSqliteSessionKeysCurrent } from "./session-canonical-key-B7chVWi3.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { i as prepareSqliteScope } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { v as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { i as prepareExactSessionEntryRowReads, s as readExactSessionEntryRowValidated } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { t as listTranscriptArchivesFromDatabase } from "./session-accessor.sqlite-archive-read-BF_Zh6lU.mjs";
import { c as runSqliteTranscriptArchiveReadWorker, o as runSqliteTranscriptArchivePageWorker, p as withSqliteTranscriptArchiveSession } from "./session-accessor.sqlite-archive-C60vk-we.mjs";
//#region src/config/sessions/session-accessor.sqlite-history.ts
async function readSessionTaskArchivePageReadOnly(scope, options) {
	return readTaskArchivePage(scope, options);
}
/** Revalidate retained bytes and unique run membership before disclosing a prepared page. */
async function verifySessionTranscriptArchivePageBindingReadOnly(scope, runId, binding) {
	if (!await readTaskArchivePage(scope, { runId }, binding)) throw new Error("Archived transcript is no longer available.");
}
async function readTaskArchivePage(scope, options, verifyBinding) {
	const resolved = resolveSqliteReadScope(scope);
	const databaseOptions = toDatabaseOptions(resolved);
	const limit = normalizeVisibleMessageLimit(options.limit, DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, MAX_VISIBLE_MESSAGE_MAX_MESSAGES, "limit");
	const maxBytes = normalizeVisibleMessageLimit(options.maxBytes, DEFAULT_VISIBLE_MESSAGE_MAX_BYTES, MAX_VISIBLE_MESSAGE_MAX_BYTES, "maxBytes");
	const contextMaxMessages = options.contextMaxMessages === void 0 ? 0 : normalizeVisibleMessageLimit(options.contextMaxMessages, 0, MAX_VISIBLE_MESSAGE_MAX_MESSAGES, "contextMaxMessages");
	return withSqliteTranscriptArchiveSession(databaseOptions, async () => {
		const [result] = await runSqliteTranscriptArchivePageWorker([{
			agentId: databaseOptions.agentId,
			databasePath: resolveOpenClawAgentSqlitePath(databaseOptions),
			logicalAgentId: resolved.agentId,
			sessionKey: scope.sessionKey,
			runId: options.runId,
			cursor: options.cursor,
			limit,
			maxBytes,
			contextMaxMessages,
			verifyBinding,
			projectionSources: options.projectionSources
		}]);
		return result;
	});
}
function prepareTranscriptInstanceEntries(database, sessionKeys, projection = "full") {
	if (sessionKeys.length === 0) return /* @__PURE__ */ new Map();
	const readRow = prepareExactSessionEntryRowReads(database, sessionKeys, projection, "canonical");
	return { get: (sessionKey) => readRow(sessionKey)?.entry };
}
function listTranscriptInstancesFromDatabase(params) {
	if (!params.currentEntries && params.options.sessionIds !== void 0) assertCanonicalSqliteSessionKeysCurrent(params.database);
	let query = getSessionKysely(params.database.db).selectFrom("session_windows").select([
		"session_id",
		"session_key",
		"created_at",
		"updated_at",
		"channel",
		"account_id",
		"transcript_updated_at",
		"session_entry_provenance",
		"acp_owned",
		"plugin_owner_id",
		"hook_external_content_source",
		"parent_session_key",
		"spawned_by",
		"chat_type"
	]);
	if (!params.options.includeAllWindows) query = query.where("transcript_updated_at", "is not", null);
	if (params.options.sessionId !== void 0) query = query.where("session_id", "=", params.options.sessionId);
	if (params.options.sessionIds !== void 0) query = query.where("session_id", "in", sqliteStringSet(params.options.sessionIds));
	const rows = executeSqliteQuerySync(params.database.db, query.orderBy("transcript_updated_at", "desc").orderBy("session_id", "asc")).rows;
	const currentEntries = params.currentEntries ?? (params.options.sessionIds !== void 0 ? prepareTranscriptInstanceEntries(params.database, [...new Set(rows.map((row) => row.session_key))], params.entryProjection) : { get: (sessionKey) => readExactSessionEntryRowValidated(params.database, sessionKey, params.entryProjection)?.entry });
	return rows.map((row) => {
		if (!params.options.includeAllWindows && isInternalSessionEffectsKey(row.session_key)) return;
		const updatedAtMs = row.transcript_updated_at ?? row.updated_at;
		const current = currentEntries.get(row.session_key);
		const currentIsExact = current?.sessionId === row.session_id;
		const provenanceKnown = row.session_entry_provenance === 1;
		const hookExternalContentSource = row.hook_external_content_source === "gmail" || row.hook_external_content_source === "webhook" ? row.hook_external_content_source : void 0;
		const chatType = row.chat_type === "direct" || row.chat_type === "group" || row.chat_type === "channel" ? row.chat_type : void 0;
		const exactHookSource = (currentIsExact ? current?.hookExternalContentSource : void 0) ?? (provenanceKnown && hookExternalContentSource === "gmail" ? "gmail" : null);
		const entry = {
			...currentIsExact && current ? structuredClone(current) : {},
			sessionId: row.session_id,
			updatedAt: updatedAtMs,
			...row.parent_session_key ? { parentSessionKey: row.parent_session_key } : {},
			...row.spawned_by ? {
				spawnedBy: row.spawned_by,
				spawnDepth: 1
			} : {},
			...chatType ? { chatType } : {},
			...provenanceKnown && row.plugin_owner_id ? { pluginOwnerId: row.plugin_owner_id } : {},
			...provenanceKnown && hookExternalContentSource ? { hookExternalContentSource } : {}
		};
		return {
			agentId: resolveAgentIdFromSessionKey(row.session_key, params.database.agentId),
			acpOwned: row.acp_owned === 1 || Boolean(currentIsExact && current?.acp),
			entry,
			provenanceKnown,
			sessionId: row.session_id,
			sessionKey: row.session_key,
			updatedAtMs,
			sourceMetadata: {
				createdAt: row.created_at,
				channel: row.channel,
				accountId: row.account_id,
				chatType: chatType ?? null,
				hookExternalContentSource: exactHookSource
			}
		};
	}).filter((entry) => entry !== void 0);
}
/** @deprecated Main-thread callers must await listSessionTranscriptArchivesInWorker. */
function listSessionTranscriptArchivesReadOnly(scope) {
	const selectors = [...new Set(scope.sessionIds ?? [])];
	const archiveNames = [...new Set(scope.archiveNames ?? [])];
	if (selectors.length === 0 && archiveNames.length === 0) return [];
	const resolved = resolveSqliteReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => listTranscriptArchivesFromDatabase(database, scope.includeAllAgents ? void 0 : resolved.agentId, selectors, archiveNames), toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
/** Reads committed archive content before its optional filesystem export is published. */
async function findSessionTranscriptArchiveEventReadOnly(scope, runId) {
	const captured = {
		...scope,
		env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
	};
	if (isIncognitoSessionKey(captured.sessionKey) || Boolean(captured.storePath && isIncognitoOpenClawAgentSqlitePath(captured.storePath, {
		agentId: captured.agentId ?? resolveAgentIdFromSessionKey(captured.sessionKey),
		env: captured.env
	}))) return;
	const context = captureOpenClawStateWorkerContext({ env: captured.env });
	const assertStateCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	};
	const candidates = captureSessionStoreReadCandidates(captured.storePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolveSqliteReadScope(captured))));
	const identities = new Map(candidates.map((candidate) => [candidate.physicalPath, readDatabasePathIdentitySync(candidate.path)]));
	const read = async (assertCurrent) => {
		const resolved = await prepareSqliteScope(captured);
		assertCurrent();
		const options = toDatabaseOptions(resolved);
		const databasePath = resolveOpenClawAgentSqlitePath(options);
		const expectedIdentity = identities.get(assertSessionStoreReadCandidate(databasePath, candidates));
		if (!expectedIdentity) throw new Error("SQLite archive database identity changed during discovery");
		const current = readDatabasePathIdentitySync(databasePath);
		if (current.key !== expectedIdentity.key || current.birthtime !== expectedIdentity.birthtime) throw new Error("SQLite archive database identity changed during discovery");
		if (!expectedIdentity.key.startsWith("file:")) return;
		const target = {
			logicalAgentId: resolved.agentId,
			sessionId: captured.sessionId,
			sessionKey: captured.sessionKey
		};
		return withSqliteTranscriptArchiveSession(options, async () => {
			const readArchive = async () => {
				const [result] = await runSqliteTranscriptArchiveReadWorker([{
					agentId: options.agentId,
					databasePath,
					...target,
					runId,
					expectedIdentity
				}]);
				assertCurrent();
				assertExistingDatabaseIdentity(databasePath, expectedIdentity.key, expectedIdentity.birthtime);
				return result?.event === void 0 ? void 0 : { event: result.event };
			};
			assertCurrent();
			return withSessionHistoryWorkerDatabase(options, async (reader) => {
				const registered = await reader.readArchivePresence({
					...target,
					env: captured.env,
					expectedIdentity
				});
				assertCurrent();
				reader.assertCurrent();
				assertExistingDatabaseIdentity(databasePath, expectedIdentity.key, expectedIdentity.birthtime);
				return registered ? readArchive() : void 0;
			});
		});
	};
	return withSessionHistoryWorkerReadCandidates(candidates, (owner) => read(() => {
		assertStateCurrent();
		owner.assertCurrent();
	}));
}
//#endregion
export { verifySessionTranscriptArchivePageBindingReadOnly as a, readSessionTaskArchivePageReadOnly as i, listSessionTranscriptArchivesReadOnly as n, listTranscriptInstancesFromDatabase as r, findSessionTranscriptArchiveEventReadOnly as t };
