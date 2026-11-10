import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { c as resolveOpenClawAgentSqlitePath, n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { i as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { t as memorySessionActorOwners } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { u as withSessionStoreReaderInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { r as withConversationPublication } from "./session-accessor.sqlite-conversation-publication-BbZ3cmHn.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { n as selectConversationRowsFromDatabase } from "./session-accessor.sqlite-conversation-read-C_ZuagCK.mjs";
import path from "node:path";
//#region src/config/sessions/conversation-registry.ts
const conversationAuthority = {
	assertCurrent() {},
	authorize() {}
};
async function prepareConversationRegistryScope(params) {
	const input = {
		agentId: params.agentId,
		storePath: resolveSessionStorePathCore(params.config.session?.store, { agentId: params.agentId })
	};
	const memory = captureSessionActorStorageOwner(input, conversationAuthority);
	if (memory) return {
		agentId: memory.agentId,
		databaseAgentId: memory.agentId,
		storePath: memory.path,
		env: captureSessionTranscriptStorageEnvironment(process.env)
	};
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
function readConversationsAsync(scope, query) {
	const capturedQuery = structuredClone(query);
	const selected = captureSessionActorStorageOwner({
		agentId: scope.databaseAgentId ?? scope.agentId,
		storePath: scope.storePath,
		env: scope.env
	}, conversationAuthority);
	if (selected) {
		if (selected.binding && selected.agentId === selected.binding.agentId && selected.path === selected.binding.path) return selected.binding.actor.storage.read({
			type: "session.conversation.read",
			input: capturedQuery
		}, selected.authority);
		return selected.owner?.readConversationAfterWrites({
			type: "session.conversation.read",
			input: capturedQuery
		}, selected.authority) ?? Promise.resolve([]);
	}
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
function selectConversationRows(scope, options = {}) {
	const selected = captureSessionActorStorageOwner({
		agentId: scope.databaseAgentId ?? scope.agentId,
		storePath: scope.storePath,
		env: scope.env
	}, conversationAuthority);
	if (selected) {
		if (selected.binding && selected.agentId === selected.binding.agentId && selected.path === selected.binding.path) return selected.binding.actor.storage.readCurrent({
			type: "session.conversation.read",
			input: options
		}, selected.authority);
		return selected.owner?.readConversations(options, selected.authority) ?? [];
	}
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
/** Catalogs routable addresses in the existing agent writer without creating sessions. */
async function registerConversationAddresses(scope, identities, discoveredAt = Date.now(), selectEligible = (values) => values.map(() => true), query) {
	if (identities.length === 0) return;
	const memory = captureSessionActorStorageOwner({
		agentId: scope.databaseAgentId ?? scope.agentId,
		storePath: scope.storePath,
		env: scope.env
	}, conversationAuthority);
	if (memory) {
		const binding = memory.binding && memory.binding.agentId === memory.agentId && memory.binding.path === memory.path ? memory.binding : void 0;
		if (!binding) return (memory.owner ?? memorySessionActorOwners.get({
			agentId: memory.agentId,
			path: memory.path
		})).mutateConversation({
			type: "session.conversation.register",
			input: {
				identities,
				discoveredAt,
				query
			}
		}, memory.authority, selectEligible);
		return readSessionActorStorageResult(await binding.actor.storage.mutate({
			type: "session.conversation.register",
			input: {
				identities: structuredClone(identities),
				discoveredAt,
				query: query && structuredClone(query)
			}
		}, {
			...memory.authority,
			authorize(stage, facts, publication) {
				memory.authority.authorize(stage, facts, publication);
				if (isRecord(publication) && publication.kind === "session.conversation.registration") {
					const registration = publication;
					registration.eligible = selectEligible(structuredClone(registration.identities));
				}
			}
		}));
	}
	const { options } = pinConversationDatabaseScope(scope);
	const input = {
		identities: structuredClone(identities),
		discoveredAt,
		query: query && structuredClone(query)
	};
	const selectCurrent = () => {
		const selected = selectEligible(input.identities);
		if (selected.length !== input.identities.length) throw new Error("Conversation route owner returned an incomplete eligibility selection");
		return selected;
	};
	const assertCurrent = () => {
		if (!selectCurrent().every(Boolean)) throw new Error("Conversation route ownership changed during discovery");
	};
	const source = {
		assertCurrent() {},
		createAdmission(binding) {
			return withConversationPublication(() => ({
				nativeLocations: binding.nativeLocations,
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					binding.authorize(request);
					if (request.stage === "transaction" || request.stage === "commit") assertCurrent();
					if (!grant()) throw new Error("Conversation registration authority expired");
				}, binding.attachment)
			}), () => binding.assertCurrent(), () => execution.captureGenerationClaim(), () => [...new Set(input.identities.map((identity) => JSON.stringify(["catalogue", identity.conversationRef])))]);
		}
	};
	const execution = captureOpenClawAgentDatabaseExecution(options);
	try {
		return await runOpenClawAgentWorkerWrite(options, async () => {
			const eligible = selectCurrent();
			input.identities = input.identities.filter((_, index) => eligible[index]);
			if (input.identities.length === 0) return;
			if (!execution.capturePreparedGenerationClaim()) await execution.prepare(source);
			return await execution.runExisting(source, (worker) => worker.execute({
				type: "conversation.register",
				input
			}));
		});
	} finally {
		await execution.release();
	}
}
/** Initiate under the writer grant; settle network work after releasing its transaction and FIFO. */
async function withConversationAuthority(scope, query, select) {
	const memory = captureSessionActorStorageOwner({
		agentId: scope.databaseAgentId ?? scope.agentId,
		storePath: scope.storePath,
		env: scope.env
	}, conversationAuthority);
	if (memory) {
		const binding = memory.binding && memory.binding.agentId === memory.agentId && memory.binding.path === memory.path ? memory.binding : void 0;
		const request = {
			type: "session.conversation.authority",
			input: structuredClone(query)
		};
		return await select(binding ? binding.actor.storage.readCurrent(request, memory.authority) : memory.owner?.readConversation(request, memory.authority) ?? {
			operation: void 0,
			conversation: void 0
		})();
	}
	const { options } = pinConversationDatabaseScope(scope);
	const input = structuredClone(query);
	const execution = captureOpenClawAgentDatabaseExecution(options);
	let consumed;
	try {
		try {
			await runOpenClawAgentWorkerWrite(options, async () => {
				const settled = await execution.runExisting({
					assertCurrent() {},
					createAdmission(binding) {
						return () => ({
							nativeLocations: binding.nativeLocations,
							admission: createSqliteWorkerOperationAdmission((request, grant) => {
								binding.authorize(request);
								let consume;
								if (request.stage === "commit") {
									const publication = isRecord(request.facts) && request.facts.publication;
									if (consumed || !isRecord(publication) || publication.kind !== "conversation-authority" || !isRecord(publication.facts)) throw new Error("Conversation authority omitted its transaction facts");
									const facts = publication.facts;
									const initiate = select(facts);
									consume = () => {
										consumed = new Promise((resolve) => {
											resolve(initiate());
										}).then((value) => ({
											ok: true,
											value
										}), (error) => ({
											ok: false,
											error
										}));
									};
								}
								if (!grant(consume)) throw new Error("Conversation read authority expired");
							}, binding.attachment)
						});
					}
				}, (worker) => worker.execute({
					type: "conversation.authority",
					input
				}));
				if (!consumed && settled !== void 0) throw new Error("Conversation authority omitted its transaction grant");
			});
		} finally {
			await execution.release();
		}
	} catch (cause) {
		if (!consumed) throw cause;
		await consumed;
		const error = new SqliteWorkerError("Conversation authority settlement failed after dispatch initiation", "outcome-unknown");
		error.cause = cause;
		throw error;
	}
	if (!consumed) return await select({
		operation: void 0,
		conversation: void 0
	})();
	const outcome = await consumed;
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}
/** Lists stable external addresses for one agent, newest activity first. */
function listConversations(scope, options = {}) {
	return readConversationsAsync(scope, options);
}
async function readConversation(scope, conversationRef) {
	return (await readConversationsAsync(scope, {
		conversationRef,
		limit: 1
	}))[0];
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
/** Reads an address's current binding through the existing session reader worker. */
async function resolveCurrentConversationSessionAsync(scope, conversationRef) {
	const [conversation] = await readConversationsAsync(scope, {
		conversationRef,
		currentBindingOnly: true,
		limit: 1
	});
	return conversation?.sessionKey && conversation.sessionId ? {
		sessionKey: conversation.sessionKey,
		sessionId: conversation.sessionId
	} : void 0;
}
/** Reads only the primary address bound to this exact current session window. */
async function resolveCurrentSessionPrimaryConversation(scope) {
	const [conversation] = await readConversationsAsync(scope, { primarySession: {
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey
	} });
	return conversation?.sessionId === scope.sessionId && conversation.sessionKey === scope.sessionKey ? conversation : void 0;
}
//#endregion
export { registerConversationAddresses as a, resolveCurrentSessionPrimaryConversation as c, readConversation as i, withConversationAuthority as l, pinConversationDatabaseScope as n, resolveCurrentConversationSession as o, prepareConversationRegistryScope as r, resolveCurrentConversationSessionAsync as s, listConversations as t };
