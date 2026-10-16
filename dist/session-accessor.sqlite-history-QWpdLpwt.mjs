import { r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { s as assertSessionStoreReadCandidate } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { i as prepareSqliteScope, o as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { d as withSessionHistoryWorkerReadCandidates, s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { n as listTranscriptArchivesFromDatabase, t as hasTranscriptArchiveInDatabase } from "./session-accessor.sqlite-archive-read-DmOOepS9.mjs";
import { i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, n as DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, r as MAX_VISIBLE_MESSAGE_MAX_BYTES, s as normalizeVisibleMessageLimit, t as DEFAULT_VISIBLE_MESSAGE_MAX_BYTES } from "./session-accessor.sqlite-visible-cursor-CJh4GhW9.mjs";
import { a as runSqliteTranscriptArchivePageWorker, f as withSqliteTranscriptArchiveSession, s as runSqliteTranscriptArchiveReadWorker } from "./session-accessor.sqlite-archive-bhCzy9TC.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
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
function listTranscriptInstancesFromDatabase(params) {
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
	return executeSqliteQuerySync(params.database.db, query.orderBy("transcript_updated_at", "desc").orderBy("session_id", "asc")).rows.map((row) => {
		if (!params.options.includeAllWindows && isInternalSessionEffectsKey(row.session_key)) return;
		const updatedAtMs = row.transcript_updated_at ?? row.updated_at;
		const current = params.currentEntries.get(row.session_key);
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
/** Read retained archive identities through the same physical and logical session owner. */
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
	const context = captureOpenClawStateWorkerContext({ env: captured.env });
	const assertStateCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
	};
	const native = isIncognitoSessionKey(captured.sessionKey) || Boolean(captured.storePath && isIncognitoOpenClawAgentSqlitePath(captured.storePath, {
		agentId: captured.agentId ?? resolveAgentIdFromSessionKey(captured.sessionKey),
		env: captured.env
	}));
	const candidates = native ? void 0 : captureSessionStoreReadCandidates(captured.storePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolveSqliteReadScope(captured))));
	const identities = new Map(candidates?.map((candidate) => [candidate.physicalPath, readDatabasePathIdentitySync(candidate.path)]));
	const read = async (assertCurrent) => {
		const resolved = native ? resolveSqliteReadScope(captured) : await prepareSqliteScope(captured);
		assertCurrent();
		const options = toDatabaseOptions(resolved);
		const databasePath = resolveOpenClawAgentSqlitePath(options);
		const expectedIdentity = candidates ? identities.get(assertSessionStoreReadCandidate(databasePath, candidates)) : void 0;
		if (candidates && !expectedIdentity) throw new Error("SQLite archive database identity changed during discovery");
		if (expectedIdentity) {
			const current = readDatabasePathIdentitySync(databasePath);
			if (current.key !== expectedIdentity.key || current.birthtime !== expectedIdentity.birthtime) throw new Error("SQLite archive database identity changed during discovery");
			if (!expectedIdentity.key.startsWith("file:")) return;
		}
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
				if (expectedIdentity) assertExistingDatabaseIdentity(databasePath, expectedIdentity.key, expectedIdentity.birthtime);
				return result?.event === void 0 ? void 0 : { event: result.event };
			};
			if (!expectedIdentity) {
				const registered = withOpenClawAgentDatabaseReadOnly((database) => hasTranscriptArchiveInDatabase(database, target), options);
				return registered.found && registered.value ? readArchive() : void 0;
			}
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
	return candidates ? withSessionHistoryWorkerReadCandidates(candidates, (owner) => read(() => {
		assertStateCurrent();
		owner.assertCurrent();
	})) : read(assertStateCurrent);
}
//#endregion
export { verifySessionTranscriptArchivePageBindingReadOnly as a, readSessionTaskArchivePageReadOnly as i, listSessionTranscriptArchivesReadOnly as n, listTranscriptInstancesFromDatabase as r, findSessionTranscriptArchiveEventReadOnly as t };
