import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath, r as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { o as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { L as upsertConversationIdentity } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { f as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { t as withOpenClawAgentDatabaseWrite } from "./openclaw-agent-db-write-CVe9DulI.mjs";
import { n as selectConversationRowsFromDatabase } from "./session-accessor.sqlite-conversation-read-N9UYrpaO.mjs";
import path from "node:path";
//#region src/config/sessions/conversation-registry.ts
function resolveConversationRegistryScope(params) {
	return pinConversationDatabaseScope({
		agentId: params.agentId,
		storePath: resolveSessionStorePathCore(params.config.session?.store, { agentId: params.agentId })
	}).scope;
}
async function prepareConversationRegistryScope(params) {
	const input = {
		agentId: params.agentId,
		storePath: resolveSessionStorePathCore(params.config.session?.store, { agentId: params.agentId })
	};
	if (isIncognitoOpenClawAgentSqlitePath(input.storePath, input)) return pinConversationDatabaseScope(input).scope;
	return withConversationRead(input, async ({ database, logicalAgentId }) => ({
		agentId: logicalAgentId,
		databaseAgentId: database.agentId,
		storePath: database.path,
		env: database.env
	}));
}
function withConversationRead(input, read) {
	const env = captureSessionTranscriptStorageEnvironment(input.env ?? process.env);
	const storePath = path.resolve(input.storePath ?? resolveSessionStorePathCore(void 0, {
		agentId: input.agentId,
		env
	}));
	const context = captureOpenClawStateReadWorkerContext({ env });
	const source = createOpenClawAgentDatabasePathMatcher();
	for (const candidate of captureSessionStoreReadCandidates(storePath)) source(candidate.path, candidate.path);
	return withSessionStoreReaderInWorker({
		agentId: input.agentId,
		storePath,
		env
	}, async (owner) => {
		if (input.databaseAgentId && owner.database.agentId !== input.databaseAgentId) throw new Error("Conversation database owner changed. Retry the request.");
		const result = await read(owner);
		owner.assertCurrent();
		return result;
	}, {
		dataOnly: true,
		logical: { assertCurrent() {
			context.maintenanceScope?.assertAdmission();
			context.admission.assertCurrent();
			if (!source.isCurrent()) throw new Error("Session store changed while reading conversations. Retry the request.");
		} }
	});
}
function selectConversationRowsInWorker(scope, query) {
	const capturedQuery = structuredClone(query);
	if (scope.storePath && isIncognitoOpenClawAgentSqlitePath(scope.storePath, scope)) return Promise.resolve(selectConversationRows(scope, capturedQuery));
	return withConversationRead(scope, ({ reader, database }) => reader.readConversations({
		query: capturedQuery,
		env: database.env
	}));
}
function pinConversationDatabaseScope(input) {
	const env = { ...input.env ?? process.env };
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const options = input.databaseAgentId && input.storePath ? {
		agentId: input.databaseAgentId,
		path: input.storePath,
		env
	} : toDatabaseOptions(resolveSqliteReadScope({
		...input,
		env
	}));
	const storePath = resolveOpenClawAgentSqlitePath(options);
	return {
		options: {
			...options,
			path: storePath
		},
		scope: {
			...input,
			databaseAgentId: options.agentId,
			storePath,
			env
		}
	};
}
/** Keep the logical agent and physical store fixed while its synchronous write waits. */
function runConversationDatabaseWrite(input, operation) {
	const { options, scope } = pinConversationDatabaseScope(input);
	return withOpenClawAgentDatabaseWrite(options, () => operation(scope));
}
function selectConversationRows(scope, options = {}) {
	const resolved = resolveSqliteReadScope({
		agentId: scope.agentId,
		...scope.env ? { env: scope.env } : {},
		...scope.storePath ? { storePath: scope.storePath } : {}
	});
	const databaseOptions = toDatabaseOptions(resolved);
	const readRows = (database) => selectConversationRowsFromDatabase(database, options);
	const held = getOpenClawAgentDatabaseIfOpen(databaseOptions);
	if (held?.db.isTransaction) return readRows(held);
	const read = withOpenClawAgentDatabaseReadOnly(readRows, databaseOptions);
	return read.found ? read.value : [];
}
/** Catalogs routable addresses without creating model-context sessions. */
function registerConversationAddresses(scope, identities, discoveredAt = Date.now()) {
	if (identities.length === 0) return;
	const resolved = resolveSqliteReadScope({
		agentId: scope.agentId,
		...scope.env ? { env: scope.env } : {},
		...scope.storePath ? { storePath: scope.storePath } : {}
	});
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	for (const identity of identities) upsertConversationIdentity(database, identity, discoveredAt);
}
/** Lists stable external addresses for one agent, newest activity first. */
function listConversations(scope, options = {}) {
	return selectConversationRowsInWorker(scope, options);
}
async function readConversation(scope, conversationRef) {
	return (await selectConversationRowsInWorker(scope, {
		conversationRef,
		limit: 1
	}))[0];
}
/** Resolves an opaque address to one exact channel target and its context binding, when present. */
function resolveConversation(scope, conversationRef) {
	return selectConversationRows(scope, {
		conversationRef,
		limit: 1
	})[0];
}
/** Reads only an authoritative association on an address's current session window. */
function resolveCurrentConversationSession(scope, conversationRef, currentSession) {
	const [conversation] = selectConversationRows(scope, {
		conversationRef,
		currentBindingOnly: true,
		currentSession,
		limit: 1
	});
	return conversation?.sessionKey && conversation.sessionId ? {
		sessionKey: conversation.sessionKey,
		sessionId: conversation.sessionId
	} : void 0;
}
/** Reads only the primary address bound to this exact current session window. */
async function resolveCurrentSessionPrimaryConversation(scope) {
	const [conversation] = await selectConversationRowsInWorker(scope, { primarySession: {
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey
	} });
	return conversation?.sessionId === scope.sessionId && conversation.sessionKey === scope.sessionKey ? conversation : void 0;
}
//#endregion
export { registerConversationAddresses as a, resolveCurrentConversationSession as c, readConversation as i, resolveCurrentSessionPrimaryConversation as l, pinConversationDatabaseScope as n, resolveConversation as o, prepareConversationRegistryScope as r, resolveConversationRegistryScope as s, listConversations as t, runConversationDatabaseWrite as u };
