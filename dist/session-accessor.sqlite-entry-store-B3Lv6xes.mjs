import { l as normalizeOptionalString, s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { l as withPluginRuntimeGatewayRequestScope, o as getPluginRuntimeGatewayRequestScope, r as getInProcessGatewayRequestContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { c as resolveOpenClawStateSqlitePath, r as resolveDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { G as sqliteSessionIdWriteScope, L as retireSqliteDatabaseWriteScopes, U as withSqliteDatabaseWriteScope, W as withoutSqliteDatabaseWriteScope } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, l as prepareSqliteQuerySync, n as createSqliteQueryCache, o as getNodeSqliteKysely, p as sql, s as iterateSqliteQuerySync } from "./kysely-sync-9fPQaMlh.mjs";
import { c as resolveOpenClawAgentSqlitePath, o as resolveExplicitIncognitoAgentSqliteTarget, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { a as tableExists } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { i as createSqliteWorkerOperationAdmission, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-CjTFYNkp.mjs";
import { t as getPluginRuntimeGenerationRegistry } from "./generation-state-BWMrcMOM.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { N as ensureSessionInputCompletionsSchema, P as ensureSessionPendingInputsSchema } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { i as ensureOpenClawAgentProgressCardSchemaInTransaction } from "./openclaw-agent-progress-card-schema-CCXTSC64.mjs";
import { u as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { v as ensureSessionParticipantsSchema } from "./openclaw-agent-db-schema-helpers-DZw0ltGv.mjs";
import { n as normalizeSessionEntryTimestamp, t as hasValidSessionEntryIdentity } from "./session-entry-json-iiByG7LE.mjs";
import { c as runOpenClawAgentWriteTransaction, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as writeSessionEntrySnapshots, r as splitSessionEntrySnapshots } from "./session-entry-snapshots-CwvH1YlE.mjs";
import { i as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./generation-scope-CwTBwQp1.mjs";
import { pt as resolveSessionWindowCreatedAt, yt as normalizeSessionRowChatType } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { n as assertSessionEntryCurrentAdmission } from "./session-entry-current-admission-DvCCyjlG.mjs";
import { r as assertAgentSessionWriteAdmission } from "./session-agent-work-admission-D63nonbM.mjs";
import { n as sessionDeliveryChannel, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-B6hhdgLR.mjs";
import { a as normalizeStoreSessionKey, o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as isFinalInputCompletion } from "./session-pending-input-value-CPY0B7Hg.mjs";
import { p as communicationEntryBinding } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { M as sessionSharingEntriesEqual, g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as participantIdentityNamespace } from "./session-participant-identity-Btc25HNW.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-76OxWRqj.mjs";
import { p as preserveCreationStamp } from "./session-entry-lineage-B7Mubzwj.mjs";
import { t as hasSqliteSessionOwnerColumns } from "./session-accessor.sqlite-owner-projection-BFkJufPp.mjs";
import { a as stripRuntimeOnlySessionSkillsFields, i as projectCanonicalSessionEntryShape } from "./store-entry-shape-sjH_uIYB.mjs";
import { n as parseSessionEntryJson, t as normalizeStatus } from "./session-accessor.sqlite-status-B58ALiNV.mjs";
import { c as collectSessionStateIdsForEntry } from "./transcript-event-media-C4aKs47S.mjs";
import { c as markCanonicalSessionValidationPending, g as validateCanonicalSessionRow, h as canonicalSessionKeyMigrationRequiredError, n as assertCanonicalSessionKeyWrite, t as assertCanonicalSessionEntryLineageWrite } from "./session-canonical-key-B7chVWi3.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { t as readSessionActivitySummary } from "./activity-summary-CfqWjwl5.mjs";
import { c as readStagedSessionTranscriptUpdatedAt, s as readStagedSessionTranscriptAuthority } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { i as replaceSessionActorStoredEntry, r as readSessionActorTransactionState } from "./session-actor-transaction-BIR0_goz.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import "./session-accessor.sqlite-entry-inventory-Cl0fNMK8.mjs";
import { a as readParticipantRecord, d as prepareSessionActorParticipantUpdate, f as readSessionActorParticipants, r as projectSqliteSessionParticipants } from "./session-accessor.sqlite-participant-projection-B8eNZYGT.mjs";
import { c as projectSessionEntryCacheUpdate, r as publishSessionEntryCacheInvalidation, s as trackSessionEntryCacheWrite } from "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { h as readSessionEntryTargetRow, m as readSessionEntryRowScan, o as readExactSessionEntryRow, p as readSessionEntryRow, v as bindSessionEntryProvenance, y as prepareSessionEntryWindowRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { i as advanceSessionEntryMaintenanceAgeFact } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { n as prepareLegacyAcpMigrationSourcesForEntryWrite, o as hasLegacyAcpMigrationProvenanceColumn, t as copyLegacyAcpMigrationSourcesForRepair } from "./session-accessor.sqlite-acp-provenance-Bl2TV_Gc.mjs";
import { i as upsertConversationIdentities, n as prepareConversationIdentities, r as prepareSessionConversationForWrite, t as linkSessionConversation } from "./session-accessor.sqlite-conversation-Bq6zyKxU.mjs";
import { t as warnSessionPersistenceDeprecation } from "./session-persistence-deprecation-BRA1CvXF.mjs";
import { i as projectSessionEntryCapabilityFacts } from "./session-entry-current-admission.worker-DSV3cklJ.mjs";
import { t as SessionRowProjectionBinding } from "./session-row-projection-binding-_jtkstu1.mjs";
import { S as runExclusiveSessionLifecycleMutation, v as isCompetingSessionWorkAdmissionActive } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { n as preparePersonalGitHubSessionReceiptDeletion } from "./github-personal-publication-lifecycle-D-79X9Ce.mjs";
import { n as repositoryWorkspacePublication, t as isRepositoryWorkspace } from "./session-repository-workspaces.receipts-CKIZXgWP.mjs";
import { t as deriveSessionPredicateColumns } from "./session-predicate-columns-DCy-hoSP.mjs";
import { a as deleteSessionPendingInputs, l as readSessionPendingInputByKey } from "./session-accessor.sqlite-pending-inputs-dFWJwbQM.mjs";
import { n as readSessionTranscriptWatermarkInDatabase } from "./session-accessor.sqlite-transcript-watermark-CfdOKFaq.mjs";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/harness/native-session/deletion-participant.ts
const participants = resolveGlobalSingleton(Symbol.for("openclaw.nativeSessionDeletionParticipants"), () => /* @__PURE__ */ new WeakMap());
function bindNativeSessionDeletionParticipant(mutation, participant) {
	participants.set(mutation, participant);
	return mutation;
}
function getNativeSessionDeletionParticipant(mutation) {
	return participants.get(mutation);
}
/** Preserve the audited participant when a harness adds live authority and commit-only facts. */
function wrapNativeSessionDeletionMutation(mutation, hooks) {
	const wrap = (original) => ({
		commit() {
			hooks.assertCurrent();
			original.commit();
			hooks.committed();
		},
		rollback() {
			hooks.assertCurrent();
			original.rollback();
			hooks.rolledBack();
		}
	});
	const wrapped = wrap(mutation);
	const participant = participants.get(mutation);
	if (participant) {
		const nativeMutation = participant.nativeMutation;
		participant.retain(hooks);
		participants.set(wrapped, {
			...participant,
			...nativeMutation ? { nativeMutation: {
				...wrap(nativeMutation),
				prepare: () => nativeMutation.prepare()
			} } : {},
			assertCurrent() {
				participant.assertCurrent();
				hooks.assertCurrent();
			},
			settle(outcome, error) {
				participant.settle(outcome, error);
				if (outcome === "committed") hooks.committed();
				if (outcome === "rolled-back") hooks.rolledBack();
			},
			get unknown() {
				return participant.unknown;
			}
		});
	}
	return wrapped;
}
/** ACP has no reversible storage effect; its finalizer becomes eligible only after A COMMIT. */
function createNativeSessionCommitFinalizer(mutation) {
	const custody = /* @__PURE__ */ new Set();
	return bindNativeSessionDeletionParticipant(mutation, {
		assertCurrent() {},
		renewalPending: () => false,
		async joinRenewal() {},
		quiesce() {},
		retain: (owner) => {
			custody.add(owner);
		},
		unknown: false,
		settle(outcome) {
			this.unknown = outcome === "unknown";
			if (outcome === "committed") mutation.commit();
			if (outcome === "rolled-back") mutation.rollback();
		}
	});
}
function isNativeSessionDeletionUnresolved(mutation) {
	return participants.get(mutation)?.unknown === true;
}
//#endregion
//#region src/agents/harness/session-deletion.ts
/** Reuse the registered harness owner; deletion is not a second plugin registration surface. */
function captureAgentHarnessSessionDeletions() {
	return captureAgentHarnessSessionMutations("withSessionDeletion");
}
function captureAgentHarnessSessionContextResets() {
	return captureAgentHarnessSessionMutations("withSessionContextReset");
}
function captureAgentHarnessSessionMutations(hook) {
	const scopedRegistry = () => getPluginRuntimeGenerationRegistry() ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const scoped = scopedRegistry();
	const registry = scoped ?? getPluginRegistryState()?.activeRegistry;
	const owners = registry?.agentHarnesses.flatMap((registration) => {
		const prepare = registration.harness[hook];
		if (!prepare) return [];
		const record = registry.plugins.find((plugin) => plugin.id === registration.pluginId);
		return [{
			registration,
			prepare,
			current: record || registration.pluginId === "core" ? capturePluginLifecycleAuthority(registry, record, { scopedRuntime: scoped === registry }) : void 0
		}];
	}) ?? [];
	return owners.length === 0 ? void 0 : async (targets, run, assertSourceCurrent) => {
		const pending = targets.flatMap((target) => owners.filter(({ registration }) => hook === "withSessionContextReset" || !target.agentHarnessId || target.agentHarnessId === registration.harness.id).map((owner) => ({
			owner,
			target
		})));
		const prepared = /* @__PURE__ */ new Map();
		const prepareNext = async (index) => {
			const candidate = pending[index];
			if (!candidate) return await run(prepared);
			const { owner, target } = candidate;
			let active = true;
			let preparing = true;
			const assertCurrent = () => {
				if (!active || !owner.current?.() || scoped && scopedRegistry() !== scoped || !registry?.agentHarnesses.includes(owner.registration) || owner.registration.harness[hook] !== owner.prepare) throw new Error(`Session mutation harness owner changed: ${owner.registration.harness.id}`);
			};
			const assertEffectCurrent = () => {
				assertCurrent();
				if (preparing) assertSourceCurrent?.();
			};
			try {
				assertEffectCurrent();
				const result = await owner.prepare({
					...target,
					assertCurrent: assertEffectCurrent
				}, async (mutation) => {
					assertCurrent();
					if (!getNativeSessionDeletionParticipant(mutation)) warnSessionPersistenceDeprecation(`AgentHarness.${hook} unbound commit/rollback callbacks`, "createNativeSessionBindingLifecycleV2 or createNativeSessionCommitFinalizer", {
						pluginId: owner.registration.pluginId,
						family: "native-session-deletion"
					});
					preparing = false;
					const mutations = prepared.get(target.sessionKey) ?? [];
					mutations.push(Object.assign(wrapNativeSessionDeletionMutation(mutation, {
						assertCurrent,
						committed() {},
						rolledBack() {}
					}), { assertCurrent }));
					prepared.set(target.sessionKey, mutations);
					return await prepareNext(index + 1);
				});
				assertCurrent();
				return result;
			} finally {
				active = false;
			}
		};
		return await prepareNext(0);
	};
}
//#endregion
//#region src/agents/subagents/spawn/subagent-session-store.ts
/** Capture the memory namespace while reading its current policy at each effect. */
function createMemorySessionCapabilityStore(memory = getSessionActorStorageBinding({})) {
	if (!memory) return;
	const captured = "actor" in memory ? captureSessionActorStorageOwner({ sessionActor: memory }, memory.authority) : memory;
	if (!captured) return;
	const owners = /* @__PURE__ */ new Map([[captured.agentId, captured]]);
	const assertCurrent = () => {
		captured.authority.assertCurrent();
		captured.owner?.assertCurrent();
		captured.binding?.actor.assertReadable();
	};
	return {
		authoritative: true,
		get(sessionKey) {
			assertCurrent();
			const agentId = parseAgentSessionKey(sessionKey)?.agentId;
			if (!agentId || agentId !== captured.agentId && !isIncognitoSessionKey(sessionKey)) throw new Error("Completion lineage requires its captured session actor owner");
			if (!owners.has(agentId)) owners.set(agentId, captureSessionActorStorageOwner({
				agentId,
				sessionActor: captured.binding,
				storePath: resolveIncognitoOpenClawAgentSqlitePath({
					agentId,
					env: { OPENCLAW_STATE_DIR: path.resolve(captured.path, "../../../..") }
				})
			}, captured.authority));
			const owner = owners.get(agentId);
			const entry = owner && readCapturedSessionActorEntry(owner, sessionKey);
			return entry && projectSessionEntryCapabilityFacts(entry);
		},
		getById(sessionId) {
			assertCurrent();
			const binding = captured.binding;
			const row = captured.owner ? captured.owner.readSessionById(sessionId, captured.authority, { currentOnly: true }) : binding?.agentId === captured.agentId && path.resolve(binding.path) === path.resolve(captured.path) ? binding.actor.storage?.readCurrent({
				type: "session.entry.readById",
				input: {
					sessionId,
					projection: "list",
					currentOnly: true
				}
			}, captured.authority) : void 0;
			return row && projectSessionEntryCapabilityFacts(row.entry);
		}
	};
}
function isSessionCapabilityLookup(store) {
	return typeof store?.get === "function" && typeof store.getById === "function";
}
function asSessionCapabilityLookup(store) {
	if (isSessionCapabilityLookup(store)) return store;
	return {
		get: (key) => store[key],
		getById: (id) => {
			const normalizedId = normalizeOptionalString(id);
			return normalizedId ? Object.values(store).find((entry) => normalizeOptionalString(entry?.sessionId) === normalizedId) : void 0;
		}
	};
}
var SessionCapabilityReadRequired = class extends Error {
	constructor(query) {
		super("Session capability metadata requires worker preparation");
		this.query = query;
	}
};
var SessionCapabilityRefreshRequired = class extends SessionCapabilityReadRequired {
	constructor(query, cause) {
		super(query);
		this.name = "SessionCapabilityMetadataChangedError";
		this.message = "Session capability metadata changed";
		this.cause = cause;
	}
};
var SessionCapabilityMetadataChangedError = class extends Error {
	constructor(message, cause) {
		super(message, { cause });
		this.name = "SessionCapabilityMetadataChangedError";
	}
};
const preparedReads = new AsyncLocalStorage();
const legacyReader = new AsyncLocalStorage();
const readKey = (query) => JSON.stringify(query);
/** Only deprecated synchronous SDK adapters may install their compatibility reader. */
function withLegacySessionCapabilityReader(reader, read) {
	return legacyReader.run(reader, read);
}
/** Prepare only the metadata a synchronous capability policy actually consumes. */
async function withPreparedSessionCapabilityRead(read, options) {
	const prepared = await prepareCapabilityReads(read, options?.retain === true);
	try {
		return await prepared.value;
	} finally {
		prepared.release();
	}
}
/** Retain worker-prepared policy until its existing writer receipt invalidates the facts. */
async function prepareSessionCapabilityRead(read) {
	const prepared = await prepareCapabilityReads(read, true);
	return {
		read: prepared.read,
		release: prepared.release
	};
}
async function prepareCapabilityReads(read, retain) {
	const inherited = preparedReads.getStore();
	const entries = new Map(!retain || inherited?.retain ? inherited?.entries : void 0);
	const scope = {
		entries,
		retain
	};
	const releases = [];
	const refreshed = /* @__PURE__ */ new Set();
	let active = true;
	const release = () => {
		active = false;
		for (const cleanup of releases.splice(0)) cleanup();
	};
	const replay = () => {
		if (!active) throw new Error("Session capability read is no longer active");
		try {
			return preparedReads.run(scope, read);
		} catch (error) {
			if (error instanceof SessionCapabilityReadRequired) throw new SessionCapabilityMetadataChangedError("Session capability metadata changed; prepare it again", error);
			throw error;
		}
	};
	try {
		for (;;) try {
			return {
				value: preparedReads.run(scope, read),
				read: replay,
				release
			};
		} catch (error) {
			if (!(error instanceof SessionCapabilityReadRequired)) throw error;
			const { withSessionEntriesFromStoreInWorker } = await import("./session-entry-read-runtime-BS7SNC06.mjs");
			const query = error.query;
			if (error instanceof SessionCapabilityRefreshRequired) {
				const key = readKey(query);
				if (refreshed.has(key)) throw error;
				refreshed.add(key);
			}
			let missingCurrent = true;
			if (retain) releases.push(sessionChanges.subscribeFacts((change) => {
				if ("all" in change || change.scope !== "automation" && (!change.agentId || change.agentId === query.agentId)) missingCurrent = false;
			}));
			let capturedIdentity;
			const reader = await withSessionEntriesFromStoreInWorker({
				storePath: query.storePath,
				agentId: query.agentId,
				...query.sessionKey !== void 0 ? {
					projection: "full",
					snapshotFields: [],
					sessionKeys: [query.sessionKey]
				} : {
					projection: "sharing",
					selection: {
						kind: "session-id",
						sessionId: query.sessionId
					}
				}
			}, async ({ result, database }) => {
				const selected = result.entries[0];
				const entry = selected?.entry;
				if (!retain) return () => entry;
				const databaseIdentity = result.source?.databaseIdentity ?? capturedIdentity;
				if (!databaseIdentity) return () => {
					assertAgentSessionWriteAdmission(database, query.agentId);
					if (!missingCurrent) throw new SessionCapabilityRefreshRequired(query, error);
				};
				const predicate = retainPreparedSessionEntryPredicate({
					databaseIdentity: `file:${databaseIdentity}`,
					sessionKey: selected?.sessionKey ?? query.sessionKey ?? "",
					entry,
					matches: (before, after) => JSON.stringify(before && projectSessionEntryCapabilityFacts(before)) === JSON.stringify(after && projectSessionEntryCapabilityFacts(after))
				});
				releases.push(predicate.release);
				let idCurrent = true;
				if (query.sessionId !== void 0) releases.push(onSessionIdentityMutation((change) => {
					if (change.databaseIdentity === databaseIdentity && [change.previous.sessionId, change.kind === "delete" ? void 0 : change.current.sessionId].some((id) => id?.trim() === query.sessionId)) idCurrent = false;
				}));
				return () => {
					assertAgentSessionWriteAdmission(database, query.agentId);
					if (!predicate.isCurrent() || !idCurrent) throw new SessionCapabilityRefreshRequired(query, error);
					return entry;
				};
			}, false, retain ? (_database, identity) => {
				capturedIdentity = identity.key.startsWith("file:") ? identity.key.slice(5) : void 0;
			} : void 0);
			entries.set(readKey(query), reader);
		}
	} catch (error) {
		release();
		throw error;
	}
}
/** Read the existing owner projection; standalone policy resolution prepares worker facts first. */
function createSubagentSessionStore(storePath, agentId, prepared) {
	const readScope = {
		storePath,
		agentId
	};
	const selected = getSessionActorStorageBinding({});
	const explicit = resolveExplicitIncognitoAgentSqliteTarget(storePath, { agentId });
	const memory = /* @__PURE__ */ new Map();
	const authority = {
		assertCurrent() {},
		authorize() {}
	};
	const memoryOwner = (requestedAgentId) => {
		if (!memory.has(requestedAgentId)) memory.set(requestedAgentId, captureSessionActorStorageOwner({
			agentId: requestedAgentId,
			sessionActor: selected,
			storePath: explicit?.agentId === requestedAgentId ? explicit.path : selected ? void 0 : resolveIncognitoOpenClawAgentSqlitePath({
				agentId: requestedAgentId,
				env: explicit?.env
			})
		}, authority));
		const captured = memory.get(requestedAgentId);
		captured?.binding?.actor.assertReadable();
		return captured;
	};
	const readActorEntry = (sessionKey) => {
		const captured = memoryOwner(resolveAgentIdFromSessionKey(sessionKey));
		const query = {
			type: "session.entry.read",
			input: {
				sessionKey,
				projection: "list"
			}
		};
		return captured?.owner ? captured.owner.readStorage(sessionKey, query, captured.authority) : captured?.binding?.agentId === captured?.agentId ? captured?.binding?.actor.storage?.readCurrent(query, captured.authority) : void 0;
	};
	const readActorEntryById = (sessionId) => {
		const captured = memoryOwner(isIncognitoSessionKey(sessionId) ? resolveAgentIdFromSessionKey(sessionId) : agentId);
		return captured?.owner ? captured.owner.readSessionById(sessionId, captured.authority, { currentOnly: true }) : captured?.binding?.agentId === captured?.agentId ? captured?.binding?.actor.storage?.readCurrent({
			type: "session.entry.readById",
			input: {
				sessionId,
				projection: "list",
				currentOnly: true
			}
		}, captured.authority) : void 0;
	};
	const entries = /* @__PURE__ */ new Map();
	if (prepared && !isInternalSessionEffectsKey(prepared.sessionKey)) entries.set(prepared.sessionKey, prepared.entry);
	let preparedEntries = preparedReads.getStore();
	const readDurable = (query) => {
		const preparedScope = preparedReads.getStore() ?? preparedEntries;
		preparedEntries = preparedScope;
		const owner = getInProcessGatewayRequestContext()?.sessionRowProjectionOwner;
		const current = !preparedScope?.retain && owner instanceof SessionRowProjectionBinding ? owner.readCommittedEntry({
			agentId: query.agentId,
			storePath: query.storePath,
			...query.sessionKey !== void 0 ? { key: query.sessionKey } : { sessionId: query.sessionId }
		}) : void 0;
		if (current) return current.entry;
		const preparedRead = preparedScope?.entries.get(readKey(query));
		if (preparedRead) return preparedRead();
		const legacy = legacyReader.getStore();
		if (legacy) return legacy(query);
		throw new SessionCapabilityReadRequired(query);
	};
	return {
		scope: {
			storePath,
			agentId
		},
		get: (sessionKey) => {
			if (isIncognitoSessionKey(sessionKey)) return readActorEntry(sessionKey);
			if (explicit || isInternalSessionEffectsKey(sessionKey)) return;
			return entries.has(sessionKey) ? entries.get(sessionKey) : readDurable({
				...readScope,
				sessionKey
			});
		},
		getById: (requestedSessionId) => {
			const id = normalizeOptionalString(requestedSessionId);
			if (!id) return;
			const actorEntry = readActorEntryById(id);
			if (actorEntry || explicit || isIncognitoSessionKey(id)) return actorEntry?.entry;
			if (isInternalSessionEffectsKey(id)) return;
			return readDurable({
				...readScope,
				sessionId: id
			});
		}
	};
}
//#endregion
//#region src/sessions/session-initialization.ts
const { rollbackOwner, sources, upstreamLinks } = resolveGlobalSingleton(Symbol.for("openclaw.sessionInitialization"), () => ({
	rollbackOwner: new AsyncLocalStorage(),
	sources: new AsyncLocalStorage(),
	upstreamLinks: /* @__PURE__ */ new WeakMap()
}));
/** The message-cut owner supplies its exact source incarnation, never plugin-provided fields. */
async function withSessionInitializationSource(source, run) {
	let active = true;
	try {
		const assertActive = (assert) => {
			if (!active) throw new Error("Session initialization source is closed");
			assert();
		};
		const current = Object.freeze({
			assertCurrent: composeSessionSourceAssertion([source.assertCurrent], (assertSources) => assertActive(assertSources)),
			assertRollbackCurrent: () => assertActive(source.assertRollbackCurrent),
			upstreamLinkCurrent: source.upstreamLinkCurrent
		});
		return await sources.run(current, () => run(current.assertCurrent));
	} finally {
		active = false;
	}
}
function captureSessionInitializationOwner(_harnessId) {
	const source = sources.getStore();
	return {
		upstreamLinkCurrent: source?.upstreamLinkCurrent,
		assertCurrent: composeSessionSourceAssertion([source?.assertCurrent]),
		assertRollbackCurrent: () => source?.assertRollbackCurrent()
	};
}
function createSessionInitialization(target, assertOwner, preparation, source) {
	const registry = getPluginRuntimeGenerationRegistry() ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getPluginRegistryState()?.activeRegistry ?? void 0;
	let active = true;
	let deleted = false;
	const assertLive = (phase) => {
		if (!active) throw new Error("Session initialization is closed");
		assertOwner(phase, deleted);
	};
	const owner = {
		target,
		handle: Object.freeze({
			assertCurrent() {
				assertLive("forward");
				if (deleted || rollbackOwner.getStore() === owner) throw new Error("Session initialization is rolling back");
			},
			assertRollbackCurrent() {
				assertLive("rollback");
				if (rollbackOwner.getStore() !== owner) throw new Error("Session initialization rollback is not active");
			},
			prepareNativeToolPolicy: async (model) => {
				owner.handle.assertCurrent();
				const { provider, runtimeProvider = provider, id } = model;
				if ([
					provider,
					runtimeProvider,
					id
				].some((value) => typeof value !== "string" || !value.trim() || Buffer.byteLength(value) > 256)) throw new Error("Session policy preparation requires a bounded native model selection");
				const [{ resolvePluginHarnessToolPolicies }, { resolveSandboxRuntimeStatus }, { resolveWebSearchToolPolicy }] = await Promise.all([
					import("./execution-environment-s7dFUM7g.mjs"),
					import("./runtime-status-CuzTKdep.mjs"),
					import("./web-search-tool-policy-B995fzvM.mjs")
				]);
				owner.handle.assertCurrent();
				const child = {
					config: preparation.config,
					agentId: preparation.agentId,
					sessionKey: target.sessionKey,
					sessionId: target.sessionId
				};
				if (preparation.entry.execNode || resolveSandboxRuntimeStatus({
					cfg: child.config,
					agentId: child.agentId,
					sessionKey: child.sessionKey,
					preparedSessionEntry: preparation.entry
				}).sandboxed) throw new Error("Session creation cannot prepare an execution environment; fork from the original source instead.");
				const result = await withPreparedSessionCapabilityRead(() => withPluginRuntimeGatewayRequestScope({
					isWebchatConnect: () => false,
					pluginRegistry: registry
				}, () => {
					if (resolvePluginHarnessToolPolicies({
						...child,
						preparedSessionEntry: preparation.entry,
						provider: runtimeProvider,
						modelId: id
					}).toolPolicyRestricted) throw new Error("The child's native tool policy requires run-owned preparation. Fork an original imported message instead.");
					return { webSearchAllowed: resolveWebSearchToolPolicy({
						...child,
						modelProvider: provider,
						modelId: id,
						webSearchEnabled: child.config.tools?.web?.search?.enabled
					}).persistentAllowed };
				}));
				owner.handle.assertCurrent();
				return result;
			}
		}),
		committed: () => {
			deleted = true;
		}
	};
	if (source?.upstreamLinkCurrent) upstreamLinks.set(owner.handle, source.upstreamLinkCurrent);
	return {
		handle: owner.handle,
		rollback: (run) => rollbackOwner.run(owner, run),
		close: () => {
			active = false;
			upstreamLinks.delete(owner.handle);
		}
	};
}
/** Only the host creation owner can bind a source predicate to an initializer. */
function getSessionInitializationUpstreamLinkCurrent(handle) {
	return upstreamLinks.get(handle);
}
function getSessionInitializationRollback(target) {
	const owner = rollbackOwner.getStore();
	if (!owner || owner.target.storePath !== target.storePath || owner.target.sessionKey !== target.sessionKey || owner.target.sessionId !== target.sessionId || owner.target.lifecycleRevision !== target.lifecycleRevision) return;
	owner.handle.assertRollbackCurrent();
	return owner.handle;
}
/** Called by the first deletion publication, only for a removal that crossed COMMIT. */
function commitSessionInitializationRollback(handle) {
	const owner = rollbackOwner.getStore();
	if (owner?.handle === handle) owner.committed();
}
//#endregion
//#region src/state/session-repository-workspaces.publication.ts
const stores = resolveGlobalMap(Symbol.for("openclaw.repositoryWorkspacePublications"), "close-and-restart");
repositoryWorkspacePublication.subscribeFacts((change) => {
	if (change.kind !== "committed" && change.kind !== "unknown") return;
	if (change.kind === "committed" && change.receipt.facts.size === 0) return;
	const identity = change.kind === "committed" ? change.receipt.source.identity : change.identity;
	for (const store of stores.values()) {
		if (store.identity !== identity) continue;
		if (change.kind === "unknown") {
			for (const row of store.rows.values()) {
				row.revision = {};
				row.uncertain = true;
			}
			continue;
		}
		for (const [key, fact] of change.receipt.facts) {
			const row = store.rows.get(key);
			if (!row || fact.kind === "unchanged") continue;
			row.revision = {};
			row.uncertain = fact.kind === "unknown";
			if (fact.kind === "postimage") row.value = copy(fact.value);
			if (fact.kind === "absent") {
				row.value = void 0;
				store.rows.delete(key);
			}
		}
	}
});
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") {
		for (const [key, store] of stores) if (store.path === (event.identity?.canonicalPath ?? event.path)) stores.delete(key);
	}
});
function owner(admission) {
	admission.assertCurrent();
	let store = stores.get(admission.coordinationKey);
	if (!store) {
		store = {
			path: admission.identity.canonicalPath,
			identity: admission.identity.key,
			rows: /* @__PURE__ */ new Map()
		};
		stores.set(admission.coordinationKey, store);
	}
	return store;
}
function rowFor(store, workspaceId) {
	let row = store.rows.get(workspaceId);
	if (!row) {
		row = {
			revision: {},
			value: void 0,
			pending: /* @__PURE__ */ new Set(),
			uncertain: false
		};
		store.rows.set(workspaceId, row);
	}
	return row;
}
function copy(workspace) {
	return workspace ? Object.freeze({ ...workspace }) : void 0;
}
/** Fence current-fact consumers before COMMIT and reopen them only after native settlement. */
function stageRepositoryWorkspacePublication(admission, result) {
	const store = owner(admission);
	const row = rowFor(store, result.workspaceId);
	const pending = createDeferredCore();
	const revision = {};
	row.revision = revision;
	row.pending.add(pending.promise);
	let settled = false;
	return { settle(committed, known) {
		if (settled) return;
		settled = true;
		if (stores.get(admission.coordinationKey) === store && row.revision === revision) {
			if (committed) row.value = copy(result.workspace);
			row.uncertain = !known;
		}
		row.pending.delete(pending.promise);
		if (!row.value && row.pending.size === 0 && store.rows.get(result.workspaceId) === row) store.rows.delete(result.workspaceId);
		pending.resolve();
	} };
}
async function prepareRepositoryWorkspaceRead(admission, workspaceId, read) {
	const store = owner(admission);
	let row = rowFor(store, workspaceId);
	const assertSource = () => {
		admission.assertCurrent();
		if (stores.get(admission.coordinationKey) !== store) throw new Error("Repository workspace database owner changed");
	};
	for (;;) {
		if (row.pending.size) await Promise.all(row.pending);
		assertSource();
		if (store.rows.get(workspaceId) !== row) {
			row = rowFor(store, workspaceId);
			continue;
		}
		const revision = row.revision;
		const workspace = await read();
		assertSource();
		if (revision !== row.revision || row.pending.size || store.rows.get(workspaceId) !== row) continue;
		row.value = copy(workspace);
		row.uncertain = false;
		if (!workspace) store.rows.delete(workspaceId);
		return {
			workspace: row.value,
			assertSourceCurrent: assertSource,
			current() {
				assertSource();
				if (row.pending.size || store.rows.get(workspaceId)?.pending.size || row.uncertain) throw new Error("Repository workspace mutation has not settled; refresh this session");
				return row.value;
			}
		};
	}
}
//#endregion
//#region src/state/session-repository-workspaces.ts
function committedResult(facts) {
	return isRecord(facts) ? facts.result : void 0;
}
function isMutationResult(value) {
	return isRecord(value) && typeof value.workspaceId === "string" && typeof value.changed === "boolean" && (value.workspace === void 0 || isRepositoryWorkspace(value.workspace)) && (value.owner === void 0 || isRecord(value.owner) && typeof value.owner.agentId === "string" && typeof value.owner.sessionKey === "string");
}
/** Deletion preparation must not reopen the shared database on the caller thread. */
async function findSessionRepositoryWorkspaces(owners, options) {
	const reply = await executeExistingOpenClawStateRead(options, {
		type: "sessionRepositoryWorkspaces.find",
		owners: owners.map(({ agentId, sessionKey }) => ({
			agentId,
			sessionKey
		}))
	});
	if (!reply) return [];
	return reply.workspaces;
}
function createSessionRepositoryWorkspaceStore(options = {}) {
	const env = options.env && cloneEnvWithPlatformSemantics(options.env);
	const databasePath = resolveDatabasePath({
		path: options.path,
		env
	});
	const now = options.now;
	const context = () => captureOpenClawStateWorkerContext({
		path: databasePath,
		env
	});
	async function mutate(command, assertCurrent, control = {}) {
		const { afterCommit, sessionEntryCurrent } = control;
		const captured = context();
		let admission;
		let prepared;
		let publication;
		let publicationSettled;
		let granted = false;
		let cleanupSourceIdentity;
		let finalized = afterCommit === void 0;
		const check = () => {
			captured.admission.assertCurrent();
			assertCurrent();
		};
		try {
			return await runOpenClawStateWorkerOperation(captured, async (scope) => {
				let result;
				try {
					result = await scope.execute(command);
				} catch (error) {
					await publicationSettled;
					if (!prepared || !admission?.committed || !isDeepStrictEqual(committedResult(admission.committed.facts), prepared)) throw error;
					result = prepared;
				}
				await publicationSettled;
				if (afterCommit) {
					if (!granted || !cleanupSourceIdentity || !prepared || !admission?.committed || !isDeepStrictEqual(committedResult(admission.committed.facts), prepared)) throw new Error("Repository workspace cleanup has no committed source");
					assertExistingDatabaseIdentity(databasePath, cleanupSourceIdentity);
					await afterCommit();
					finalized = true;
				}
				return result;
			}, {
				assertCurrent: check,
				createAdmission: (operation) => {
					const domainPublication = repositoryWorkspacePublication.begin({
						get identity() {
							return captured.admission.identity.key;
						},
						assertCurrent: captured.assertPublicationCurrent ?? captured.admission.assertCurrent
					});
					admission = createSqliteWorkerOperationAdmission((request, grant) => {
						check();
						const admitted = assertSessionEntryCurrentAdmission(request, sessionEntryCurrent);
						if (admitted.stage === "transaction") {
							grant();
							return;
						}
						if (admitted.stage !== "commit" || !isMutationResult(admitted.facts)) throw new Error("Repository workspace mutation has no admitted commit result");
						prepared = admitted.facts;
						if (afterCommit) {
							const identity = captured.admission.identity;
							assertExistingDatabaseIdentity(databasePath, identity.key);
							cleanupSourceIdentity = identity.key;
						}
						publication = stageRepositoryWorkspacePublication(captured.admission, prepared);
						granted = grant();
					});
					observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
						if (!isRecord(facts)) throw new Error("Repository workspace has no committed receipt");
						domainPublication.committed(facts.receipt);
					});
					const acceptedAdmission = admission;
					publicationSettled = operation.settled.then((settlement) => {
						let committed = false;
						let known = false;
						try {
							const receipt = acceptedAdmission.committed;
							if (receipt) {
								if (!prepared || !isDeepStrictEqual(committedResult(receipt.facts), prepared)) throw new Error("Repository workspace commit result changed during settlement");
								committed = true;
							}
							known = !granted || committed || settlement.kind === "completed";
						} finally {
							publication?.settle(committed, known);
							domainPublication.finish(settlement.kind === "completed", settlement.kind === "completed" && !granted && !acceptedAdmission.committed);
						}
						if (committed && prepared?.changed && prepared.owner) {
							try {
								captured.admission.assertCurrent();
							} catch {
								return;
							}
							sessionChanges.emit(prepared.owner);
						}
					});
					publicationSettled.catch(() => void 0);
					return {
						admission,
						nativeLocations: [databasePath]
					};
				}
			});
		} catch (error) {
			if (finalized && prepared && admission?.committed && isDeepStrictEqual(committedResult(admission.committed.facts), prepared)) return prepared;
			throw error;
		} finally {
			await publicationSettled;
		}
	}
	const requireWorkspace = (result) => {
		if (!result.workspace) throw new Error("Repository workspace mutation returned no workspace");
		return result.workspace;
	};
	const artifactPath = (workspaceId) => {
		if (!/^[a-f0-9-]{36}$/u.test(workspaceId)) throw new Error("Repository workspace id is invalid");
		return path.join(path.dirname(databasePath), "repository-workspaces", `${workspaceId}.git`);
	};
	return {
		path: databasePath,
		artifactPath,
		get(workspaceId) {
			return executeOpenClawStateWorker(context(), {
				type: "repositoryWorkspaces.get",
				input: { workspaceId }
			});
		},
		find(owner) {
			return executeOpenClawStateWorker(context(), {
				type: "repositoryWorkspaces.find",
				input: {
					agentId: owner.agentId,
					sessionKey: owner.sessionKey
				}
			});
		},
		prepare(workspaceId) {
			const captured = context();
			return prepareRepositoryWorkspaceRead(captured.admission, workspaceId, () => executeOpenClawStateWorker(captured, {
				type: "repositoryWorkspaces.get",
				input: { workspaceId }
			}));
		},
		async create(input) {
			return requireWorkspace(await mutate({
				type: "repositoryWorkspaces.create",
				input: {
					agentId: input.agentId,
					sessionKey: input.sessionKey,
					url: input.url,
					requestedRef: input.requestedRef,
					runSetupScript: input.runSetupScript,
					branch: input.branch,
					nowMs: now?.()
				}
			}, input.assertCurrent));
		},
		async bindBase(input) {
			return requireWorkspace(await mutate({
				type: "repositoryWorkspaces.bindBase",
				input: {
					workspaceId: input.workspaceId,
					expectedRevision: input.expectedRevision,
					baseCommit: input.baseCommit,
					baseManifestHash: input.baseManifestHash,
					nowMs: now?.()
				}
			}, input.assertCurrent));
		},
		async acceptCheckpoint(input) {
			return requireWorkspace(await mutate({
				type: "repositoryWorkspaces.acceptCheckpoint",
				input: {
					workspaceId: input.workspaceId,
					expectedRevision: input.expectedRevision,
					checkpointRef: input.checkpointRef,
					manifestHash: input.manifestHash,
					nowMs: now?.()
				}
			}, input.assertCurrent));
		},
		async delete(input) {
			const root = artifactPath(input.workspaceId);
			await mutate({
				type: "repositoryWorkspaces.delete",
				input: {
					workspaceId: input.workspaceId,
					sessionEntryCurrentSource: input.sessionEntryCurrent?.source
				}
			}, input.assertCurrent, {
				sessionEntryCurrent: input.sessionEntryCurrent,
				afterCommit: () => fs.rm(root, {
					recursive: true,
					force: true
				})
			});
		}
	};
}
/** Resolve on use so loading admission code does not open shared state. */
function getSessionRepositoryWorkspaceStore() {
	return createSessionRepositoryWorkspaceStore();
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-deletion-receipts.ts
function pinSqliteSessionReceiptDeletionDatabase(databaseOptions, memory) {
	if (memory) return { memory };
	if (!supportsOpenClawAgentDatabaseExecution(databaseOptions)) return;
	return {
		databaseOptions,
		database: readDatabasePathIdentitySync(resolveOpenClawAgentSqlitePath(databaseOptions))
	};
}
async function prepareSqliteSessionReceiptDeletions(source, targets, options) {
	const { env, assertCurrent, assertRepositoryCurrent } = options;
	const receiptOnlyTargets = source ? targets.filter((target) => !options.repositorySessionKeys.includes(target.sessionKey)) : [];
	const receiptDeletions = [];
	const generations = options.receiptsOnCommit?.generations ?? (source ? receiptOnlyTargets.map((target) => ({
		agentId: target.agentId,
		sessionKey: target.sessionKey,
		sessionId: target.sessionId,
		lifecycleRevision: target.lifecycleRevision ?? null
	})) : []);
	const generationsByAgent = /* @__PURE__ */ new Map();
	for (const generation of generations) {
		const grouped = generationsByAgent.get(generation.agentId) ?? /* @__PURE__ */ new Map();
		const key = JSON.stringify([generation.sessionKey, generation.sessionId]);
		if (!grouped.has(key)) grouped.set(key, generation);
		generationsByAgent.set(generation.agentId, grouped);
	}
	for (const [agentId, grouped] of generationsByAgent) receiptDeletions.push(await preparePersonalGitHubSessionReceiptDeletion({
		agentId,
		env,
		generations: [...grouped.values()],
		assertCurrent
	}));
	let settled = false;
	return {
		settleReceipts: async (assertCommittedCurrent) => {
			if (!options.receiptsOnCommit) throw new Error("Receipt settlement requires a receiptsOnCommit declaration");
			if (settled) throw new Error("Session receipts already settled");
			settled = true;
			for (const settle of receiptDeletions) await settle({ assertCurrent: assertCommittedCurrent });
		},
		async settlePresence() {
			if (!source || receiptOnlyTargets.length === 0) return;
			const assertSourceCurrent = () => {
				assertRepositoryCurrent();
				if ("memory" in source) source.memory.assertCurrent();
				else {
					const { database } = source;
					assertExistingDatabaseIdentity(database.canonicalPath, database.key, database.birthtime);
				}
			};
			const sessionKeys = receiptOnlyTargets.map((target) => target.sessionKey);
			const readPresentKeys = async () => {
				if ("memory" in source) return new Set(sessionKeys.filter((sessionKey) => source.memory.readSession(sessionKey, {
					assertCurrent: assertSourceCurrent,
					authorize() {}
				})?.entry));
				const { databaseOptions, database } = source;
				const { withSessionStoreReaderInWorker } = await import("./session-entry-read-runtime-BS7SNC06.mjs");
				return await withSessionStoreReaderInWorker({
					agentId: databaseOptions.agentId,
					defaultAgentId: databaseOptions.agentId,
					storePath: database.canonicalPath,
					env
				}, async (owner) => {
					if (owner.selectedStore.physicalPath !== database.canonicalPath || owner.database.agentId !== databaseOptions.agentId) throw new Error("Receipt cleanup lost its pinned session database");
					owner.assertCurrent();
					const read = await owner.reader.readExactEntries({
						env: owner.database.env,
						sessionKeys,
						projection: "exact",
						snapshotFields: [],
						continuation: owner.continuation
					});
					owner.assertCurrent();
					return new Set(read.entries.map((entry) => entry.sessionKey));
				}, {
					logical: { assertCurrent: assertSourceCurrent },
					dataOnly: true
				});
			};
			assertSourceCurrent();
			const present = await readPresentKeys();
			for (const settle of receiptDeletions) await settle({
				assertCurrent: assertSourceCurrent,
				retainedSessionKeys: present
			});
		}
	};
}
//#endregion
//#region src/config/sessions/session-deletion-worker-participant.ts
/** Preserve typed participants; adapt legacy cleanup to the acknowledged worker commit. */
function resolveSessionDeletionWorkerParticipant(mutation, sessionKey) {
	const participant = getNativeSessionDeletionParticipant(mutation);
	if (participant) return participant;
	warnPluginSdkDeprecation({
		family: "session-deletion-transaction-callback",
		method: "opaque AgentHarnessSessionDeletionMutation",
		replacement: "createNativeSessionCommitFinalizer or a native binding participant",
		compatibility: "The callback runs only after a successful session commit; its rollback callback is not used."
	});
	return getNativeSessionDeletionParticipant(createNativeSessionCommitFinalizer({
		commit() {
			try {
				mutation.commit();
			} catch (error) {
				getChildLogger({ subsystem: "session-sqlite" }).warn("Session deletion committed, but legacy harness cleanup failed", {
					sessionKey,
					error
				});
			}
		},
		rollback() {}
	}));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-deletion.ts
const deletions = new AsyncLocalStorage();
const workerParticipant = new AsyncLocalStorage();
/** The executing owner supplies the typed precommit participant at the existing deletion edge. */
function withSqliteSessionDeletionWorkerParticipant(commit, run) {
	return workerParticipant.run(commit, run);
}
const transactionMutations = new AsyncLocalStorage();
/** Includes worker-owned participants and host-only post-commit finalizers. */
function hasPreparedNativeSessionDeletion() {
	const prepared = deletions.getStore();
	return prepared !== void 0 && [...prepared.values()].some((entry) => entry.mutations.length > 0 || entry.target.initialization !== void 0);
}
/** Capture native participants and host-only finalizers for the same worker commit. */
function captureNativeSessionWorkerDeletion(entries) {
	const captured = entries.map(({ sessionKey, entry }) => ({
		sessionKey,
		entry,
		prepared: deletions.getStore()?.get(sessionKey)
	}));
	const participants = [];
	for (const { sessionKey, entry, prepared } of captured) {
		if (!prepared) continue;
		for (const mutation of prepared.mutations) {
			const participant = resolveSessionDeletionWorkerParticipant(mutation, sessionKey);
			participants.push({
				sessionKey,
				entry,
				participant
			});
		}
		const initialization = prepared.target.initialization;
		if (initialization) {
			const finalizer = createNativeSessionCommitFinalizer({
				commit: () => commitSessionInitializationRollback(initialization),
				rollback() {}
			});
			participants.push({
				sessionKey,
				entry,
				participant: getNativeSessionDeletionParticipant(finalizer)
			});
		}
	}
	if (participants.length === 0) return;
	return {
		participants,
		assertCurrent() {
			for (const { prepared } of captured) prepared?.assertIdle();
		}
	};
}
/** Prepare owner leases before entering a physical writer or changing any transcript state. */
async function withSqliteSessionDeletions(scope, entries, run, options = {}) {
	return withSqliteSessionMutations(scope, entries, run, options);
}
/** A context cut retires the native generation without deleting the session or its artifacts. */
async function withSqliteSessionContextReset(scope, entry, run, assertSourceCurrent, memory) {
	return withSqliteSessionMutations(scope, [entry], run, {
		contextReset: true,
		assertSourceCurrent,
		memory
	});
}
async function withSqliteSessionMutations(scope, entries, run, options) {
	const memory = options.memory;
	if (memory) {
		memory.assertCurrent();
		if (memory.agentId !== scope.agentId || memory.path !== scope.path) throw new Error("Session deletion differs from its captured memory owner");
	}
	const targets = [...new Map(entries.filter(({ entry }) => entry.sessionId).map(({ sessionKey, entry }) => [sessionKey, {
		agentId: parseAgentSessionKey(sessionKey)?.agentId ?? scope.agentId,
		sessionKey,
		sessionId: entry.sessionId,
		...entry.lifecycleRevision ? { lifecycleRevision: entry.lifecycleRevision } : {},
		...entry.agentHarnessId ? { agentHarnessId: entry.agentHarnessId } : {},
		...options.contextReset && entry.previousSessionId ? { previousSessionId: entry.previousSessionId } : {}
	}])).values()].toSorted((a, b) => a.sessionKey.localeCompare(b.sessionKey));
	const ownerStorePath = scope.ownerStorePath ?? resolveSessionStorePathCore(void 0, {
		agentId: scope.agentId,
		env: scope.env
	});
	if (!options.contextReset) for (const target of targets) target.initialization = getSessionInitializationRollback({
		...target,
		storePath: ownerStorePath
	});
	const assertTargetIdle = (target) => {
		if (isCompetingSessionWorkAdmissionActive(ownerStorePath, [target.sessionKey, target.sessionId])) throw new Error(`Cannot mutate session while competing work is in flight for ${target.sessionKey}; retry after the run completes`);
	};
	targets.forEach(assertTargetIdle);
	const prepare = options.contextReset ? captureAgentHarnessSessionContextResets() : captureAgentHarnessSessionDeletions();
	const repositories = options.contextReset ? void 0 : createSessionRepositoryWorkspaceStore({
		path: resolveOpenClawStateSqlitePath(scope.env),
		env: scope.env
	});
	const repositorySource = repositories ? captureOpenClawStateWorkerContext({
		path: repositories.path,
		env: scope.env
	}) : void 0;
	const databaseOptions = toDatabaseOptions(scope);
	const receiptSource = !options.contextReset && !options.receiptsOnCommit && targets.length > 0 ? pinSqliteSessionReceiptDeletionDatabase(databaseOptions, memory) : void 0;
	const execution = repositories && !memory && supportsOpenClawAgentDatabaseExecution(databaseOptions) ? captureOpenClawAgentDatabaseExecution(databaseOptions) : void 0;
	try {
		const repositoryWorkspaces = repositories ? await findSessionRepositoryWorkspaces(targets, {
			path: repositories.path,
			env: scope.env
		}) : [];
		const invoke = async (prepared) => {
			const currentReads = /* @__PURE__ */ new Map();
			const assertCurrent = () => {
				memory?.assertCurrent();
				if (repositoryWorkspaces.length > 0) {
					repositorySource?.admission.assertCurrent();
					execution?.assertCurrent();
				}
				for (const read of currentReads.values()) read.assertSourceCurrent();
				targets.forEach(assertTargetIdle);
				for (const mutations of prepared.values()) mutations.forEach((mutation) => mutation.assertCurrent());
			};
			assertCurrent();
			if (execution && repositoryWorkspaces.length > 0) {
				const [{ captureSessionEntryCurrentRead }, { withSessionEntryReadOnlyInWorker }] = await Promise.all([import("./session-entry-current-runtime-Ctn0abZe.mjs"), import("./session-entry-read-runtime-BS7SNC06.mjs")]);
				assertCurrent();
				for (const workspace of repositoryWorkspaces) {
					const readScope = {
						agentId: workspace.agentId,
						defaultAgentId: databaseOptions.agentId,
						storePath: scope.ownerStorePath ?? scope.path ?? ownerStorePath,
						sessionKey: workspace.sessionKey,
						env: scope.env
					};
					const current = await withSessionEntryReadOnlyInWorker(readScope, assertCurrent, async (read, owner) => {
						if (!read.ok) throw read.error;
						const captured = captureSessionEntryCurrentRead(readScope, owner);
						execution.assertCurrent();
						if (captured.kind !== "file" || captured.source.agentId !== execution.agentId || !owner.scope) throw new Error("Repository cleanup lost its original file-backed session owner");
						assertExistingDatabaseIdentity(execution.path, `file:${captured.source.databaseIdentity}`, captured.source.databaseBirthtime);
						return captured;
					});
					currentReads.set(workspace.workspaceId, current);
				}
			}
			const receiptDeletions = /* @__PURE__ */ new Map();
			for (const workspace of repositoryWorkspaces) {
				const target = targets.find((candidate) => candidate.sessionKey === workspace.sessionKey);
				if (!target) throw new Error("Repository workspace deletion omitted its session target");
				receiptDeletions.set(workspace.workspaceId, await preparePersonalGitHubSessionReceiptDeletion({
					agentId: workspace.agentId,
					env: scope.env,
					generations: [{
						sessionKey: workspace.sessionKey,
						sessionId: target.sessionId,
						lifecycleRevision: target.lifecycleRevision ?? null
					}],
					assertCurrent
				}));
			}
			const receipts = await prepareSqliteSessionReceiptDeletions(receiptSource, targets, {
				receiptsOnCommit: options.receiptsOnCommit,
				repositorySessionKeys: repositoryWorkspaces.map((workspace) => workspace.sessionKey),
				env: scope.env,
				assertCurrent,
				assertRepositoryCurrent: () => repositorySource?.admission.assertCurrent()
			});
			return await deletions.run(new Map(targets.map((target) => [target.sessionKey, {
				target,
				mutations: prepared.get(target.sessionKey) ?? [],
				assertIdle: () => assertTargetIdle(target),
				contextReset: options.contextReset
			}])), async () => {
				if (memory) {
					for (const mutations of prepared.values()) for (const mutation of mutations) await getNativeSessionDeletionParticipant(mutation)?.nativeMutation?.prepare();
					assertCurrent();
				}
				let active = true;
				const assertActive = () => {
					if (!active) throw new Error("Session mutation preparation is no longer active");
					assertCurrent();
				};
				try {
					return await run(assertCurrent, (checkedEntries) => {
						assertActive();
						return captureSqliteSessionDeletionSettlement(checkedEntries, assertActive);
					}, receipts.settleReceipts);
				} finally {
					active = false;
					for (const workspace of repositoryWorkspaces) {
						const currentRead = currentReads.get(workspace.workspaceId);
						const assertSourceCurrent = () => {
							if (execution && !currentRead) throw new Error("Repository cleanup omitted its prepared session source");
							repositorySource?.admission.assertCurrent();
							execution?.assertCurrent();
							currentRead?.assertSourceCurrent();
							memory?.assertCurrent();
						};
						const currentEntry = () => memory ? memory.readSession(workspace.sessionKey, {
							assertCurrent: assertSourceCurrent,
							authorize() {}
						})?.entry : readSessionEntryRow(openOpenClawAgentDatabase(toDatabaseOptions(scope)), workspace.sessionKey)?.entry;
						assertSourceCurrent();
						if (currentRead ? await currentRead.readCurrent() !== void 0 : currentEntry() !== void 0) continue;
						const sessionEntryCurrent = currentRead ? {
							source: currentRead.source,
							assertCurrent: (entry) => {
								assertSourceCurrent();
								if (entry !== void 0) throw new Error("Repository workspace session changed before deletion");
							}
						} : void 0;
						const assertSessionAbsent = () => {
							assertSourceCurrent();
							if (!currentRead && currentEntry()) throw new Error("Repository workspace session changed before deletion");
						};
						await receiptDeletions.get(workspace.workspaceId)({
							assertCurrent: assertSessionAbsent,
							sessionEntryCurrent
						});
						await repositories?.delete({
							workspaceId: workspace.workspaceId,
							sessionEntryCurrent,
							assertCurrent: assertSessionAbsent
						});
					}
					await receipts.settlePresence();
				}
			});
		};
		return await runExclusiveSessionLifecycleMutation("delete-prepare", {
			scope: ownerStorePath,
			identities: [...targets.flatMap((target) => [target.sessionKey, target.sessionId]), ...options.additionalIdentities ?? []],
			run: async () => prepare ? await prepare(targets, invoke, options.assertSourceCurrent) : await invoke(/* @__PURE__ */ new Map())
		});
	} finally {
		await execution?.release();
	}
}
/** Called only at the synchronous SQL edge, after the operation revalidates its row snapshot. */
function commitSqliteSessionDeletion(sessionKey, entry) {
	const workerCommit = workerParticipant.getStore();
	if (workerCommit) {
		workerCommit(sessionKey, entry);
		return;
	}
	const prepared = deletions.getStore()?.get(sessionKey);
	if (!prepared) {
		if (captureAgentHarnessSessionDeletions()) throw new Error(`Session deletion requires prepared harness ownership: ${sessionKey}`);
		return;
	}
	if (prepared.target.sessionId !== entry.sessionId || prepared.target.lifecycleRevision !== entry.lifecycleRevision || prepared.contextReset && prepared.target.previousSessionId !== entry.previousSessionId) throw new Error(`Session changed before deletion: ${sessionKey}`);
	prepared.assertIdle();
	const transaction = transactionMutations.getStore();
	if (!transaction) throw new Error(`Session deletion requires its synchronous transaction: ${sessionKey}`);
	for (const mutation of prepared.mutations) {
		transaction.rollback.push(mutation);
		(getNativeSessionDeletionParticipant(mutation)?.nativeMutation ?? mutation).commit();
	}
	if (prepared.target.initialization) transaction.initializations.add(prepared.target.initialization);
}
/** Retain host companions while their checked deletion commits in the worker. */
function captureSqliteSessionDeletionSettlement(entries, assertCurrent) {
	const captured = structuredClone(entries);
	for (const { sessionKey } of captured) if (!deletions.getStore()?.has(sessionKey)) throw new Error(`Session mutation target was not prepared: ${sessionKey}`);
	const runInOwner = AsyncLocalStorage.snapshot();
	const rollback = [];
	const initializations = /* @__PURE__ */ new Set();
	let entered = false;
	let settled = false;
	return {
		beforeCommit() {
			assertCurrent();
			if (entered || settled) throw new Error("Session deletion companions already entered settlement");
			entered = true;
			runInOwner(() => transactionMutations.run({
				rollback,
				initializations
			}, () => {
				for (const { sessionKey, entry } of captured) commitSqliteSessionDeletion(sessionKey, entry);
			}));
		},
		settle(outcome) {
			if (settled) throw new Error("Session deletion companions already settled");
			settled = true;
			runInOwner(() => {
				if (outcome === "committed") initializations.forEach(commitSessionInitializationRollback);
				else if (outcome === "rolled-back") {
					const failures = rollbackSessionDeletionCompanions(rollback);
					if (failures.length > 0) throw createSqliteLifecycleAggregateError(failures, "Session deletion rollback failed", failures[0]);
				}
			});
		}
	};
}
function rollbackSessionDeletionCompanions(mutations) {
	const failures = [];
	for (const mutation of mutations.toReversed()) try {
		(getNativeSessionDeletionParticipant(mutation)?.nativeMutation ?? mutation).rollback();
	} catch (error) {
		failures.push(error);
	}
	return failures;
}
/** Roll back companion state only if SQLite failed before COMMIT, never after publication. */
function runSqliteSessionDeletionTransaction(operation, options, transactionOptions) {
	if (!deletions.getStore() || transactionMutations.getStore()) return runOpenClawAgentWriteTransaction(operation, options, transactionOptions);
	const rollback = [];
	const initializations = /* @__PURE__ */ new Set();
	let committed = false;
	try {
		return transactionMutations.run({
			rollback,
			initializations
		}, () => runOpenClawAgentWriteTransaction((database) => {
			deferOpenClawAgentPostCommitPublication(database, () => {
				committed = true;
				initializations.forEach(commitSessionInitializationRollback);
			});
			return operation(database);
		}, options, transactionOptions));
	} catch (error) {
		const failures = [error];
		if (!committed) failures.push(...rollbackSessionDeletionCompanions(rollback));
		if (failures.length > 1) throw createSqliteLifecycleAggregateError(failures, "Session deletion rollback failed", error);
		throw error;
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-clear.ts
/** Remove the logical entry while retaining its node-owned transcript windows. */
function clearSqliteSessionEntryPreservingWindows(database, params) {
	writeSessionEntrySnapshots(database, params.sessionKey, []);
	const db = getSessionKysely(database.db);
	const cleared = {
		current_session_id: params.sessionId,
		entry_json: "{}",
		...deriveSessionPredicateColumns("{}"),
		session_started_at: null,
		entry_valid: -1,
		updated_at: params.updatedAt,
		status: null,
		created_at: null,
		created_via: null,
		created_actor_type: null,
		created_actor_id: null,
		project_id: null,
		parent_session_key: null,
		spawned_by: null,
		fork_source_session_key: null,
		fork_source_session_id: null,
		fork_source_entry_id: null,
		label: null,
		display_name: null,
		category: null,
		icon: null,
		pinned_at: null,
		archived_at: null,
		last_read_at: null,
		last_interaction_at: null,
		last_activity_at: null,
		...hasLegacyAcpMigrationProvenanceColumn(database.db) ? { legacy_acp_migration_json: null } : {},
		...hasSqliteSessionOwnerColumns(database.db) ? {
			owner_actor_type: null,
			owner_actor_id: null,
			owner_assigned_by_type: null,
			owner_assigned_by_id: null,
			owner_assigned_at: null
		} : {}
	};
	executeSqliteQuerySync(database.db, db.insertInto("session_nodes").values({
		session_key: params.sessionKey,
		...cleared
	}).onConflict((conflict) => conflict.column("session_key").doUpdateSet(cleared)));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-snapshot.ts
function resolveLifecyclePrimaryEntry(database, target, options = {}) {
	const row = readSessionEntryTargetRow(database, target, options);
	return row?.entry ? captureSessionEntrySnapshot({
		entry: row.entry,
		row: row.row
	}) : void 0;
}
function readLifecycleTargetSnapshot(database, target, options = {}) {
	const row = resolveLifecyclePrimaryEntry(database, normalizeLifecycleTarget(target), options);
	return row ? [row] : [];
}
function normalizeLifecycleTarget(target) {
	const canonicalKey = normalizeStoreSessionKey(target.canonicalKey);
	return {
		canonicalKey,
		storeKeys: uniqueStrings([canonicalKey, ...target.storeKeys.map(normalizeStoreSessionKey)])
	};
}
/** Exact reads already own nested values; retain them through identity publication. */
function readSessionIdentitySnapshot(database, sessionKeys) {
	const snapshot = /* @__PURE__ */ new Map();
	for (const sessionKey of uniqueStrings([...sessionKeys].map((key) => key.trim()))) {
		const row = readExactSessionEntryRow(database, sessionKey);
		if (row) snapshot.set(sessionKey, row.entry);
	}
	return snapshot;
}
function readSessionEntrySelectionSnapshot(database, sessionKey, exact, includeWindowFacts) {
	const scanned = exact ? void 0 : readSessionEntryRowScan(database, sessionKey, includeWindowFacts);
	const selected = exact ? readExactSessionEntryRow(database, sessionKey, "full", void 0, includeWindowFacts) : scanned?.selected;
	return selected ? [captureSessionEntrySnapshot(selected)] : [];
}
function captureSessionEntrySnapshot(selected) {
	let window;
	if (selected.row.window !== void 0) window = {
		sessionId: selected.row.current_session_id,
		row: selected.row.window
	};
	return {
		entry: selected.entry,
		sessionKey: selected.row.session_key,
		...window ? { row: selected.row } : {},
		...window ? { window } : {},
		...selected.row.member_ids_json !== void 0 && selected.row.board_present !== void 0 ? { sideTables: {
			memberIdsJson: selected.row.member_ids_json,
			hasBoard: selected.row.board_present === 1
		} } : {}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-write-queries.ts
const getSessionEntryWriteQueries = createSqliteQueryCache((database) => {
	const db = getSessionKysely(database);
	const window = (retainOwner) => prepareSqliteQuerySync(database, (parameter) => db.insertInto("session_windows").values({
		session_id: parameter((row) => row.session_id),
		session_key: parameter((row) => row.session_key),
		reason: parameter((row) => row.reason),
		created_at: parameter((row) => row.created_at),
		updated_at: parameter((row) => row.updated_at),
		session_entry_provenance: parameter((row) => row.session_entry_provenance),
		acp_owned: parameter((row) => row.acp_owned),
		plugin_owner_id: parameter((row) => row.plugin_owner_id),
		hook_external_content_source: parameter((row) => row.hook_external_content_source),
		previous_session_id: parameter((row) => row.previous_session_id),
		session_scope: parameter((row) => row.session_scope),
		started_at: parameter((row) => row.started_at),
		ended_at: parameter((row) => row.ended_at),
		status: parameter((row) => row.status),
		chat_type: parameter((row) => row.chat_type),
		channel: parameter((row) => row.channel),
		account_id: parameter((row) => row.account_id),
		model_provider: parameter((row) => row.model_provider),
		model: parameter((row) => row.model),
		agent_harness_id: parameter((row) => row.agent_harness_id),
		parent_session_key: parameter((row) => row.parent_session_key),
		spawned_by: parameter((row) => row.spawned_by),
		display_name: parameter((row) => row.display_name),
		primary_conversation_id: parameter((row) => row.primary_conversation_id),
		transcript_observed_at: parameter((row) => row.transcript_observed_at)
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet((eb) => ({
		...retainOwner ? {} : { session_key: eb.ref("excluded.session_key") },
		previous_session_id: eb.ref("excluded.previous_session_id"),
		reason: eb.ref("excluded.reason"),
		session_scope: eb.ref("excluded.session_scope"),
		transcript_observed_at: eb.ref("excluded.transcript_observed_at"),
		session_entry_provenance: eb.ref("excluded.session_entry_provenance"),
		acp_owned: eb.ref("excluded.acp_owned"),
		plugin_owner_id: eb.ref("excluded.plugin_owner_id"),
		hook_external_content_source: eb.ref("excluded.hook_external_content_source"),
		updated_at: eb.ref("excluded.updated_at"),
		started_at: eb.ref("excluded.started_at"),
		ended_at: eb.ref("excluded.ended_at"),
		status: eb.ref("excluded.status"),
		chat_type: eb.ref("excluded.chat_type"),
		channel: eb.ref("excluded.channel"),
		account_id: eb.ref("excluded.account_id"),
		primary_conversation_id: eb.ref("excluded.primary_conversation_id"),
		model_provider: eb.ref("excluded.model_provider"),
		model: eb.ref("excluded.model"),
		agent_harness_id: eb.ref("excluded.agent_harness_id"),
		parent_session_key: eb.ref("excluded.parent_session_key"),
		spawned_by: eb.ref("excluded.spawned_by"),
		display_name: eb.ref("excluded.display_name")
	}))));
	const node = (withLegacySources) => prepareSqliteQuerySync(database, (parameter) => db.insertInto("session_nodes").values({
		session_key: parameter((row) => row.session_key),
		current_session_id: parameter((row) => row.current_session_id),
		entry_json: parameter((row) => row.entry_json),
		session_started_at: sql`${parameter((row) => row.session_started_at)}`,
		has_optional_references: parameter((row) => row.has_optional_references),
		entry_valid: parameter((row) => row.entry_valid),
		updated_at: parameter((row) => row.updated_at),
		status: parameter((row) => row.status),
		created_at: parameter((row) => row.created_at),
		created_via: parameter((row) => row.created_via),
		created_actor_type: parameter((row) => row.created_actor_type),
		created_actor_id: parameter((row) => row.created_actor_id),
		project_id: parameter((row) => row.project_id),
		parent_session_key: parameter((row) => row.parent_session_key),
		spawned_by: parameter((row) => row.spawned_by),
		fork_source_session_key: parameter((row) => row.fork_source_session_key),
		fork_source_session_id: parameter((row) => row.fork_source_session_id),
		fork_source_entry_id: parameter((row) => row.fork_source_entry_id),
		label: parameter((row) => row.label),
		display_name: parameter((row) => row.display_name),
		category: parameter((row) => row.category),
		icon: parameter((row) => row.icon),
		pinned_at: parameter((row) => row.pinned_at),
		archived_at: parameter((row) => row.archived_at),
		last_read_at: parameter((row) => row.last_read_at),
		last_interaction_at: parameter((row) => row.last_interaction_at),
		last_activity_at: parameter((row) => row.last_activity_at),
		...withLegacySources ? { legacy_acp_migration_json: parameter((row) => row.legacy_acp_migration_json ?? null) } : {}
	}).onConflict((conflict) => conflict.column("session_key").doUpdateSet((eb) => ({
		current_session_id: eb.ref("excluded.current_session_id"),
		entry_json: eb.ref("excluded.entry_json"),
		session_started_at: eb.ref("excluded.session_started_at"),
		has_optional_references: eb.ref("excluded.has_optional_references"),
		entry_valid: eb.ref("excluded.entry_valid"),
		updated_at: eb.ref("excluded.updated_at"),
		status: eb.ref("excluded.status"),
		created_at: eb.ref("excluded.created_at"),
		created_via: eb.ref("excluded.created_via"),
		created_actor_type: eb.ref("excluded.created_actor_type"),
		created_actor_id: eb.ref("excluded.created_actor_id"),
		project_id: eb.ref("excluded.project_id"),
		parent_session_key: eb.ref("excluded.parent_session_key"),
		spawned_by: eb.ref("excluded.spawned_by"),
		fork_source_session_key: eb.ref("excluded.fork_source_session_key"),
		fork_source_session_id: eb.ref("excluded.fork_source_session_id"),
		fork_source_entry_id: eb.ref("excluded.fork_source_entry_id"),
		label: eb.ref("excluded.label"),
		display_name: eb.ref("excluded.display_name"),
		category: eb.ref("excluded.category"),
		icon: eb.ref("excluded.icon"),
		pinned_at: eb.ref("excluded.pinned_at"),
		archived_at: eb.ref("excluded.archived_at"),
		last_read_at: eb.ref("excluded.last_read_at"),
		last_interaction_at: eb.ref("excluded.last_interaction_at"),
		last_activity_at: eb.ref("excluded.last_activity_at"),
		...withLegacySources ? { legacy_acp_migration_json: eb.ref("excluded.legacy_acp_migration_json") } : {}
	}))));
	return {
		node: node(false),
		nodeWithLegacySources: node(true),
		claimWindow: window(false),
		retainWindow: window(true)
	};
});
//#endregion
//#region src/config/sessions/session-accessor.sqlite-pending-inputs-repair.ts
/** Canonical repair preserves accepted text without transferring its old execution authority. */
function copySessionPendingInputsForRepair(source, destination, sourceKeys, canonicalKey) {
	if (!sourceKeys.length || !tableExists(source.db, "session_pending_inputs")) return;
	const db = getSessionKysely(destination.db);
	if (source.db === destination.db) {
		executeSqliteQuerySync(destination.db, db.updateTable("session_pending_inputs").set((eb) => ({
			session_key: canonicalKey,
			state: eb.case().when("state", "=", "cancelled").then("cancelled").else("interrupted").end()
		})).where("session_key", "in", sourceKeys));
		return;
	}
	const rows = iterateSqliteQuerySync(source.db, getSessionKysely(source.db).selectFrom("session_pending_inputs").selectAll().where("session_key", "in", sourceKeys).orderBy("seq", "asc"));
	let initialized = false;
	for (const row of rows) {
		if (!initialized) {
			ensureSessionPendingInputsSchema(destination.db);
			initialized = true;
		}
		const existing = readSessionPendingInputByKey(destination, {
			sessionKey: canonicalKey,
			sessionId: row.session_id
		}, row.idempotency_key);
		if (existing) {
			if (existing.request_hash !== row.request_hash || existing.message_json !== row.message_json || existing.run_id !== row.run_id || existing.consumed_event_id != null && row.consumed_event_id != null && existing.consumed_event_id !== row.consumed_event_id) throw new Error("Canonical repair found conflicting accepted inputs");
			executeSqliteQuerySync(destination.db, db.updateTable("session_pending_inputs").set({
				consumed_event_id: existing.consumed_event_id ?? row.consumed_event_id ?? null,
				state: existing.state === "cancelled" || row.state === "cancelled" ? "cancelled" : "interrupted"
			}).where("input_id", "=", existing.input_id));
			continue;
		}
		const { seq: _seq, ...record } = row;
		executeSqliteQuerySync(destination.db, db.insertInto("session_pending_inputs").values({
			...record,
			session_key: canonicalKey,
			state: row.state === "cancelled" ? "cancelled" : "interrupted"
		}));
	}
}
/** Transfer terminal facts without transferring the old admission's execution authority. */
function copySessionInputCompletionsForRepair(source, destination, sourceKeys, canonicalKey) {
	if (!sourceKeys.length || !tableExists(source.db, "session_input_completions")) return;
	const db = getSessionKysely(destination.db);
	if (source.db === destination.db) {
		executeSqliteQuerySync(destination.db, db.updateTable("session_input_completions").set({ session_key: canonicalKey }).where("session_key", "in", sourceKeys));
		return;
	}
	const rows = iterateSqliteQuerySync(source.db, getSessionKysely(source.db).selectFrom("session_input_completions").selectAll().where("session_key", "in", sourceKeys));
	let initialized = false;
	for (const row of rows) {
		if (!initialized) {
			ensureSessionInputCompletionsSchema(destination.db);
			initialized = true;
		}
		const existing = executeSqliteQueryTakeFirstSync(destination.db, db.selectFrom("session_input_completions").selectAll().where("session_id", "=", row.session_id).where("idempotency_key", "=", row.idempotency_key));
		if (existing) {
			if (existing.session_key !== canonicalKey || existing.run_id !== row.run_id || existing.request_hash !== row.request_hash) throw new Error("Canonical repair found conflicting input completions");
			const existingOutcome = JSON.parse(existing.outcome_json);
			if (isFinalInputCompletion(existingOutcome)) continue;
			const outcome = JSON.parse(row.outcome_json);
			if (!isFinalInputCompletion(outcome) && existing.completed_at >= row.completed_at) continue;
		}
		const canonical = {
			...row,
			session_key: canonicalKey
		};
		executeSqliteQuerySync(destination.db, db.insertInto("session_input_completions").values(canonical).onConflict((conflict) => conflict.columns(["session_id", "idempotency_key"]).doUpdateSet(canonical)));
	}
}
function readSessionInputArtifactRows(database, sessionId) {
	const db = getSessionKysely(database.db);
	return {
		pendingInputs: tableExists(database.db, "session_pending_inputs") ? iterateSqliteQuerySync(database.db, db.selectFrom("session_pending_inputs").selectAll().where("session_id", "=", sessionId).orderBy("seq")) : [],
		inputCompletions: tableExists(database.db, "session_input_completions") ? iterateSqliteQuerySync(database.db, db.selectFrom("session_input_completions").selectAll().where("session_id", "=", sessionId).orderBy("idempotency_key")) : []
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-node-artifacts.ts
/** Logical-node facts survive history cleanup and are fenced at final entry deletion. */
function readSessionNodeArtifactFingerprint(database, sessionKey) {
	const db = getSessionKysely(database.db);
	const present = readSessionNodeArtifactTables(database);
	const fingerprint = createHash("sha256");
	const inventories = {
		board_tabs: db.selectFrom("board_tabs").selectAll().where("session_key", "=", sessionKey).orderBy("tab_id"),
		heartbeat_outcomes: db.selectFrom("heartbeat_outcomes").selectAll().where("session_key", "=", sessionKey),
		session_members: db.selectFrom("session_members").selectAll().where("session_key", "=", sessionKey).orderBy("identity_id"),
		session_participants: db.selectFrom("session_participants").selectAll().where("session_key", "=", sessionKey).orderBy("identity_namespace").orderBy("actor_id"),
		session_progress_cards: db.selectFrom("session_progress_cards").selectAll().where("session_key", "=", sessionKey),
		session_suggestions: db.selectFrom("session_suggestions").selectAll().where("session_key", "=", sessionKey).orderBy("state").orderBy("created_at").orderBy("id"),
		session_reactions: db.selectFrom("session_reactions").selectAll().where("session_key", "=", sessionKey).orderBy("session_id").orderBy("message_id").orderBy("emoji").orderBy("identity_id")
	};
	for (const [table, query] of Object.entries(inventories)) {
		fingerprint.update(table).update("\n");
		if (present.has(table)) for (const row of iterateSqliteQuerySync(database.db, query)) fingerprint.update(JSON.stringify(row)).update("\n");
	}
	fingerprint.update("board_widgets\n");
	if (present.has("board_widgets")) for (const { html, ...metadata } of iterateSqliteQuerySync(database.db, db.selectFrom("board_widgets").selectAll().where("session_key", "=", sessionKey).orderBy("name"))) {
		fingerprint.update(JSON.stringify(metadata)).update("\n");
		fingerprint.update(html === null ? "null\n" : `bytes:${html.byteLength}\n`);
		if (html !== null) fingerprint.update(html).update("\n");
	}
	const provenance = hasLegacyAcpMigrationProvenanceColumn(database.db) ? executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select("legacy_acp_migration_json").where("session_key", "=", sessionKey))?.legacy_acp_migration_json : void 0;
	return fingerprint.update("legacy_acp_migration_json\n").update(JSON.stringify(provenance ?? null)).digest("hex");
}
function clearSessionCollaborationForKey(database, sessionKey, options = {}) {
	return withSqliteDatabaseWriteScope(database.db, [sessionKey], () => {
		const presentTables = readSessionNodeArtifactTables(database);
		const db = getSessionKysely(database.db);
		const tables = options.clearSuggestions === false ? ["session_members"] : [
			"session_members",
			"session_suggestions",
			"session_reactions"
		];
		for (const table of tables) if (presentTables.has(table)) executeSqliteQuerySync(database.db, db.deleteFrom(table).where("session_key", "=", sessionKey));
	});
}
/** Copy logical-session artifacts into their canonical node within one agent store or across two. */
function copySessionNodeArtifactsForRepair(source, destination, sourceKeys, canonicalKey, options = {}) {
	return withSqliteDatabaseWriteScope(destination.db, source.db === destination.db ? [canonicalKey, ...sourceKeys] : [canonicalKey], () => {
		const keys = [...new Set(sourceKeys)];
		if (keys.length === 0) return;
		copySessionPendingInputsForRepair(source, destination, keys, canonicalKey);
		copySessionInputCompletionsForRepair(source, destination, keys, canonicalKey);
		copyLegacyAcpMigrationSourcesForRepair(source, destination, keys, canonicalKey);
		const sourceDb = getSessionKysely(source.db);
		const destinationDb = getSessionKysely(destination.db);
		const sourceKeyReferences = new Set(keys.flatMap((key) => [key, key.trim()]));
		const sourceTables = readSessionNodeArtifactTables(source);
		const postimage = options.postimages?.get(canonicalKey);
		let destinationTables = readSessionNodeArtifactTables(destination);
		if (options.includeParticipants !== false && sourceTables.has("session_participants") && !destinationTables.has("session_participants")) {
			ensureSessionParticipantsSchema(destination.db);
			destinationTables = readSessionNodeArtifactTables(destination);
		}
		if (sourceTables.has("session_progress_cards")) {
			const progressCards = executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_progress_cards").selectAll().where("session_key", "in", keys)).rows;
			if (progressCards.length > 0 && !destinationTables.has("session_progress_cards")) {
				ensureOpenClawAgentProgressCardSchemaInTransaction(destination.db);
				destinationTables = readSessionNodeArtifactTables(destination);
			}
			for (const progressCard of progressCards) {
				const canonicalProgressCard = {
					...progressCard,
					session_key: canonicalKey
				};
				executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_progress_cards").values(canonicalProgressCard).onConflict((conflict) => conflict.column("session_key").doUpdateSet(canonicalProgressCard).where((eb) => eb.or([eb("revision", "<", progressCard.revision), eb.and([eb("revision", "=", progressCard.revision), eb("updated_at", "<", progressCard.updated_at)])]))));
			}
		}
		if (sourceTables.has("board_tabs") && sourceTables.has("board_widgets") && destinationTables.has("board_tabs") && destinationTables.has("board_widgets")) {
			for (const tab of executeSqliteQuerySync(source.db, sourceDb.selectFrom("board_tabs").selectAll().where("session_key", "in", keys)).rows) {
				if (postimage) {
					postimage.sideTables.hasBoard = true;
					postimage.changed = true;
				}
				executeSqliteQuerySync(destination.db, destinationDb.insertInto("board_tabs").values({
					...tab,
					session_key: canonicalKey
				}).onConflict((conflict) => conflict.columns(["session_key", "tab_id"]).doUpdateSet({
					title: tab.title,
					position: tab.position,
					chat_dock: tab.chat_dock,
					created_by: tab.created_by,
					revision: tab.revision
				}).where("revision", "<", tab.revision)));
			}
			for (const widget of executeSqliteQuerySync(source.db, sourceDb.selectFrom("board_widgets").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("board_widgets").values({
				...widget,
				session_key: canonicalKey
			}).onConflict((conflict) => conflict.columns(["session_key", "name"]).doUpdateSet({
				...widget,
				session_key: canonicalKey
			}).where((eb) => eb.or([eb("revision", "<", widget.revision), eb.and([eb("revision", "=", widget.revision), eb("updated_at", "<", widget.updated_at)])]))));
		}
		if (options.includeMembers !== false && sourceTables.has("session_members") && destinationTables.has("session_members")) {
			const memberIds = postimage ? new Set(JSON.parse(postimage.sideTables.memberIdsJson)) : void 0;
			for (const member of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_members").selectAll().where("session_key", "in", keys)).rows) {
				memberIds?.add(member.identity_id);
				if (postimage) postimage.changed = true;
				executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_members").values({
					...member,
					session_key: canonicalKey
				}).onConflict((conflict) => conflict.columns(["session_key", "identity_id"]).doNothing()));
			}
			if (postimage && memberIds) postimage.sideTables.memberIdsJson = JSON.stringify([...memberIds].toSorted((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right))));
		}
		if (sourceTables.has("session_suggestions") && destinationTables.has("session_suggestions")) {
			if (source.db === destination.db) executeSqliteQuerySync(destination.db, destinationDb.updateTable("session_suggestions").set({ session_key: canonicalKey }).where("session_key", "in", keys));
			else for (const suggestion of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_suggestions").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_suggestions").values({
				...suggestion,
				session_key: canonicalKey
			}).onConflict((conflict) => conflict.column("id").doNothing()));
		}
		if (sourceTables.has("session_reactions") && destinationTables.has("session_reactions")) for (const reaction of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_reactions").selectAll().where("session_key", "in", keys)).rows) executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_reactions").values({
			...reaction,
			session_key: canonicalKey
		}).onConflict((conflict) => conflict.columns([
			"session_key",
			"session_id",
			"message_id",
			"emoji",
			"identity_id"
		]).doNothing()));
		if (sourceTables.has("heartbeat_outcomes") && destinationTables.has("heartbeat_outcomes")) for (const heartbeat of executeSqliteQuerySync(source.db, sourceDb.selectFrom("heartbeat_outcomes").selectAll().where("session_key", "in", keys)).rows) {
			const canonicalHeartbeat = {
				...heartbeat,
				session_key: canonicalKey,
				run_session_key: sourceKeyReferences.has(heartbeat.run_session_key) ? canonicalKey : heartbeat.run_session_key
			};
			executeSqliteQuerySync(destination.db, destinationDb.insertInto("heartbeat_outcomes").values(canonicalHeartbeat).onConflict((conflict) => conflict.column("session_key").doUpdateSet(canonicalHeartbeat).where((eb) => eb.or([eb("updated_at", "<", heartbeat.updated_at), eb.and([eb("updated_at", "=", heartbeat.updated_at), eb("occurred_at", "<", heartbeat.occurred_at)])]))));
		}
		if (options.includeParticipants !== false && sourceTables.has("session_participants") && destinationTables.has("session_participants")) {
			const participants = readSessionActorParticipants(destination, canonicalKey);
			const publishParticipants = prepareSessionActorParticipantUpdate(destination, canonicalKey);
			let copiedParticipant = false;
			for (const participant of executeSqliteQuerySync(source.db, sourceDb.selectFrom("session_participants").selectAll().where("session_key", "in", keys)).rows) {
				if (source.db === destination.db && participant.session_key === canonicalKey) continue;
				const merged = executeSqliteQuerySync(destination.db, destinationDb.insertInto("session_participants").values({
					...participant,
					session_key: canonicalKey
				}).onConflict((conflict) => conflict.columns([
					"session_key",
					"identity_namespace",
					"actor_id"
				]).doUpdateSet((eb) => ({
					contribution_count: source.db === destination.db ? eb("session_participants.contribution_count", "+", participant.contribution_count) : eb.case().when("session_participants.contribution_count", ">", participant.contribution_count).then(eb.ref("session_participants.contribution_count")).else(participant.contribution_count).end(),
					first_prompted_at: participant.first_prompted_at === null ? null : eb.case().when("session_participants.first_prompted_at", "is", null).then(null).when("session_participants.first_prompted_at", "<", participant.first_prompted_at).then(eb.ref("session_participants.first_prompted_at")).else(participant.first_prompted_at).end(),
					last_prompted_at: participant.last_prompted_at === null ? eb.ref("session_participants.last_prompted_at") : eb.case().when("session_participants.last_prompted_at", ">", participant.last_prompted_at).then(eb.ref("session_participants.last_prompted_at")).else(participant.last_prompted_at).end()
				}))).returningAll()).rows;
				if (participants) for (const row of merged) {
					const index = participants.findIndex(({ identity }) => identity.id === row.actor_id && participantIdentityNamespace(identity) === row.identity_namespace);
					const record = readParticipantRecord(row);
					if (index === -1) participants.push(record);
					else participants[index] = record;
				}
				copiedParticipant = true;
			}
			if (copiedParticipant) {
				if (participants) publishParticipants?.publish(participants);
				if (postimage) {
					postimage.entry = projectSqliteSessionParticipants(destination.db, canonicalKey, postimage.entry);
					postimage.changed = true;
				}
			}
		}
	});
}
/** Membership is authorization state; canonical repair replaces it from the selected winner. */
function deleteSessionMembersForRepair(database, sessionKey) {
	return withSqliteDatabaseWriteScope(database.db, [sessionKey], () => {
		if (!readSessionNodeArtifactTables(database).has("session_members")) return;
		const db = getSessionKysely(database.db);
		executeSqliteQuerySync(database.db, db.deleteFrom("session_members").where("session_key", "=", sessionKey));
	});
}
function deleteSessionDeliveryArtifacts(database, sessionKey, additionalKeys = []) {
	const db = getSessionKysely(database.db);
	const trimmedKey = sessionKey.trim();
	const lookupKeys = uniqueStrings([
		sessionKey,
		trimmedKey,
		normalizeStoreSessionKey(trimmedKey),
		...additionalKeys
	]);
	let sessionKeys = lookupKeys;
	if (lookupKeys.some((key) => key !== sessionKey)) {
		const competingIdentities = new Set(executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("session_key")).rows.flatMap((row) => row.session_key === sessionKey ? [] : [normalizeStoreSessionKey(row.session_key)]));
		sessionKeys = lookupKeys.filter((key) => key === sessionKey || !competingIdentities.has(normalizeStoreSessionKey(key)));
	}
	return withSqliteDatabaseWriteScope(database.db, sessionKeys, () => {
		const cache = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, cache.deleteFrom("cache_entries").where("scope", "=", "conversation-progress").where("key", "in", db.selectFrom("conversation_deliveries").select("operation_id").where("source_session_key", "in", sessionKeys)));
		executeSqliteQuerySync(database.db, db.deleteFrom("conversation_deliveries").where("source_session_key", "in", sessionKeys));
	});
}
function deleteSessionNodeArtifacts(database, sessionKey) {
	return withSqliteDatabaseWriteScope(database.db, [sessionKey], () => {
		deleteSessionPendingInputs(database, sessionKey);
		const db = getSessionKysely(database.db);
		const presentTables = readSessionNodeArtifactTables(database);
		if (presentTables.has("board_tabs") && presentTables.has("board_widgets")) {
			executeSqliteQuerySync(database.db, db.deleteFrom("board_widgets").where("session_key", "=", sessionKey));
			executeSqliteQuerySync(database.db, db.deleteFrom("board_tabs").where("session_key", "=", sessionKey));
		}
		for (const table of [
			"heartbeat_outcomes",
			"session_participants",
			"session_progress_cards",
			"session_members",
			"session_suggestions",
			"session_reactions"
		]) {
			if (!presentTables.has(table)) continue;
			executeSqliteQuerySync(database.db, db.deleteFrom(table).where("session_key", "=", sessionKey));
		}
	});
}
function readSessionNodeArtifactTables(database) {
	const schema = getAdmittedSqliteSchemaFacts(database.db);
	if (schema) return schema.tables;
	const db = getSessionKysely(database.db);
	return new Set(executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "in", [
		"board_tabs",
		"board_widgets",
		"heartbeat_outcomes",
		"session_members",
		"session_participants",
		"session_progress_cards",
		"session_suggestions",
		"session_reactions"
	])).rows.flatMap((row) => row.name ? [row.name] : []));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-session-row.ts
function bindSessionRoot(params) {
	const updatedAt = Number.isFinite(params.entry.updatedAt) ? params.entry.updatedAt : params.updatedAt;
	return {
		session_id: params.entry.sessionId,
		session_key: params.sessionKey,
		reason: null,
		created_at: resolveSessionWindowCreatedAt(params.entry, updatedAt),
		updated_at: updatedAt,
		...bindSessionEntryProvenance(params.entry),
		...bindSessionWindowEntryProjection(params),
		primary_conversation_id: null
	};
}
function bindSessionWindowEntryProjection(params) {
	return {
		previous_session_id: normalizeNullableString(params.entry.previousSessionId),
		session_scope: resolveSqliteSessionScope(params.entry, params.sessionKey),
		started_at: finiteSqliteNumber(params.entry.startedAt),
		ended_at: finiteSqliteNumber(params.entry.endedAt),
		status: normalizeStatus(params.entry.status),
		chat_type: normalizeSessionRowChatType(params.entry.chatType),
		channel: normalizeNullableString(sessionDeliveryChannel(params.entry)),
		account_id: normalizeNullableString(deliveryContextFromSession(params.entry)?.accountId),
		model_provider: normalizeNullableString(params.entry.modelProvider),
		model: normalizeNullableString(params.entry.model),
		agent_harness_id: normalizeNullableString(params.entry.agentHarnessId),
		parent_session_key: normalizeNullableString(params.entry.parentSessionKey),
		spawned_by: normalizeNullableString(params.entry.spawnedBy),
		display_name: resolveSqliteSessionDisplayName(params.entry)
	};
}
/** Project canonical hot facts into the logical-node query columns. */
function bindSessionNode(params) {
	const actor = params.entry.createdActor;
	return {
		session_key: params.sessionKey,
		current_session_id: params.entry.sessionId,
		entry_json: params.entryJson,
		...deriveSessionPredicateColumns(params.entryJson),
		entry_valid: 1,
		updated_at: params.updatedAt,
		status: normalizeStatus(params.entry.status),
		created_at: finiteSqliteNumber(params.entry.createdAt),
		created_via: normalizeSqliteCreatedVia(params.entry.createdVia),
		created_actor_type: normalizeSqliteCreatedActorType(actor?.type),
		created_actor_id: normalizeNullableString(actor?.id),
		project_id: normalizeNullableString(params.entry.projectId),
		parent_session_key: normalizeNullableString(params.entry.parentSessionKey) ?? normalizeNullableString(params.entry.spawnedBy),
		spawned_by: normalizeNullableString(params.entry.spawnedBy),
		fork_source_session_key: normalizeNullableString(params.entry.forkSource?.sessionKey),
		fork_source_session_id: normalizeNullableString(params.entry.forkSource?.sessionId),
		fork_source_entry_id: normalizeNullableString(params.entry.forkSource?.entryId),
		label: normalizeNullableString(params.entry.label),
		display_name: normalizeNullableString(params.entry.displayName),
		category: normalizeNullableString(params.entry.category),
		icon: normalizeNullableString(params.entry.icon),
		pinned_at: finiteSqliteNumber(params.entry.pinnedAt),
		archived_at: finiteSqliteNumber(params.entry.archivedAt),
		last_read_at: finiteSqliteNumber(params.entry.lastReadAt),
		last_interaction_at: finiteSqliteNumber(params.entry.lastInteractionAt),
		last_activity_at: finiteSqliteNumber(params.entry.lastActivityAt)
	};
}
function normalizeSqliteCreatedVia(value) {
	return value === "operator" || value === "spawn" || value === "channel" || value === "cron" || value === "talk" || value === "run" || value === "plugin" || value === "internal" ? value : null;
}
function normalizeSqliteCreatedActorType(value) {
	return value === "human" || value === "agent" || value === "system" ? value : null;
}
function resolveSqliteSessionScope(entry, sessionKey) {
	const chatType = normalizeSessionRowChatType(entry.chatType);
	const normalizedKey = sessionKey.trim().toLowerCase();
	if (chatType === "direct" && (normalizedKey === "main" || normalizedKey.endsWith(":main"))) return "shared-main";
	if (chatType === "group" || chatType === "channel") return chatType;
	return "conversation";
}
function finiteSqliteNumber(value) {
	return asFiniteNumber(value) ?? null;
}
function resolveSqliteSessionDisplayName(entry) {
	return normalizeNullableString(entry.displayName) ?? normalizeNullableString(entry.label) ?? normalizeNullableString(entry.subject) ?? normalizeNullableString(entry.groupId);
}
//#endregion
//#region src/config/sessions/session-entry-write-postimage.ts
function createSessionEntryWriteRow(params) {
	const snapshotJson = new Map(params.snapshots.map(({ field, valueJson }) => [field, valueJson]));
	return {
		...params.previous,
		...params.node,
		...params.snapshotsChanged ? {
			session_diff_baseline_json: snapshotJson.get("sessionDiffBaseline") ?? null,
			skills_snapshot_json: snapshotJson.get("skillsSnapshot") ?? null,
			system_prompt_report_json: snapshotJson.get("systemPromptReport") ?? null
		} : {},
		window: params.window
	};
}
//#endregion
//#region src/config/sessions/session-public-share.ts
/** Publication is valid only for its exact current generation, including copied metadata. */
function resolveSessionPublicShare(entry) {
	const share = entry?.publicShare;
	if (!entry || entry.incognito === true || !isRecord(share) || share.sessionId !== entry.sessionId || typeof share.id !== "string" || !/^[a-f0-9]{48}$/.test(share.id) || !Number.isSafeInteger(share.createdAt) || share.createdAt < 0) return;
	return {
		id: share.id,
		sessionId: share.sessionId,
		createdAt: share.createdAt
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-store.ts
function deleteSessionEntryRows(database, sessionKey, options = {}) {
	const previousEntry = options.validatedEntry ?? readExactSessionEntryRow(database, sessionKey)?.entry;
	if (previousEntry) commitSqliteSessionDeletion(sessionKey, previousEntry);
	const db = getSessionKysely(database.db);
	const windows = executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").where("session_key", "=", sessionKey)).rows;
	const survivingNodes = windows.length > 0 ? executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"current_session_id",
		"entry_json",
		"session_key"
	]).where("session_key", "!=", sessionKey).orderBy("session_key", "asc")).rows : [];
	const ownedSessionIds = [];
	for (const window of windows) {
		const survivingNode = survivingNodes.find((node) => {
			if (node.current_session_id === window.session_id) return true;
			const entry = parseSessionEntryJson(node);
			return entry ? collectSessionStateIdsForEntry(entry).includes(window.session_id) : false;
		});
		if (survivingNode) {
			withSqliteDatabaseWriteScope(database.db, [
				sessionKey,
				survivingNode.session_key,
				sqliteSessionIdWriteScope(window.session_id)
			], () => executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ session_key: survivingNode.session_key }).where("session_id", "=", window.session_id)));
			for (const postimage of options.postimages?.values() ?? []) if (postimage.window.session_id === window.session_id) postimage.window = {
				...postimage.window,
				session_key: survivingNode.session_key
			};
		} else ownedSessionIds.push(window.session_id);
	}
	const remainingWindow = options.deleteOwnedWindows ? void 0 : executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select(["session_id", "updated_at"]).where("session_key", "=", sessionKey).orderBy("updated_at", "desc").orderBy("session_id", "asc").limit(1));
	withSqliteDatabaseWriteScope(database.db, [sessionKey, ...windows.map((window) => sqliteSessionIdWriteScope(window.session_id))], () => {
		if (options.deleteOwnedWindows) deleteSessionDeliveryArtifacts(database, sessionKey, options.deliveryCleanupKeys);
		if (options.deleteOwnedWindows || remainingWindow) deleteSessionNodeArtifacts(database, sessionKey);
		if (remainingWindow) clearSqliteSessionEntryPreservingWindows(database, {
			sessionId: remainingWindow.session_id,
			sessionKey,
			updatedAt: remainingWindow.updated_at
		});
		else {
			executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", sessionKey));
			retireSqliteDatabaseWriteScopes(database.db, [sessionKey, ...ownedSessionIds.map(sqliteSessionIdWriteScope)]);
		}
	});
	options.postimages?.delete(sessionKey);
	publishSessionEntryCacheInvalidation(database, {
		sessionKey,
		facts: { kind: "removed" }
	});
}
function deleteLifecycleTargetRows(database, target) {
	for (const sessionKey of uniqueStrings([target.canonicalKey, ...target.storeKeys])) {
		const trimmed = sessionKey.trim();
		if (trimmed) deleteSessionEntryRows(database, trimmed);
	}
}
function deleteLegacySessionEntryRows(database, legacyKeys, sessionKey, options = {}) {
	if (legacyKeys.length === 0) return;
	const db = getSessionKysely(database.db);
	for (const legacyKey of legacyKeys) {
		if (legacyKey === sessionKey) continue;
		const previousEntry = options.validatedEntries?.get(legacyKey) ?? readExactSessionEntryRow(database, legacyKey)?.entry;
		if (previousEntry) commitSqliteSessionDeletion(legacyKey, previousEntry);
		rehomeSessionWindows(database, sessionKey, [legacyKey], options.postimages);
		copySessionNodeArtifactsForRepair(database, database, [legacyKey], sessionKey, {
			includeMembers: options.rehomeMembers,
			postimages: options.postimages
		});
		withSqliteDatabaseWriteScope(database.db, [legacyKey], () => executeSqliteQuerySync(database.db, db.deleteFrom("session_nodes").where("session_key", "=", legacyKey)));
		retireSqliteDatabaseWriteScopes(database.db, [legacyKey]);
		options.postimages?.delete(legacyKey);
		const canonicalPostimage = options.postimages?.get(sessionKey);
		if (canonicalPostimage) canonicalPostimage.changed = true;
		publishSessionEntryCacheInvalidation(database, { sessionKey: legacyKey });
	}
	publishSessionEntryCacheInvalidation(database, { sessionKey });
}
/** Move retained generations to the canonical node before removing key aliases. */
function rehomeSessionWindows(database, canonicalKey, previousKeys, postimages) {
	const legacyKeys = uniqueStrings([...previousKeys].map((key) => key.trim())).filter((key) => key && key !== canonicalKey);
	if (legacyKeys.length === 0) return;
	const db = getSessionKysely(database.db);
	withoutSqliteDatabaseWriteScope(database.db, () => executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({ session_key: canonicalKey }).where("session_key", "in", legacyKeys)));
	for (const postimage of postimages?.values() ?? []) if (legacyKeys.includes(postimage.window.session_key)) postimage.window = {
		...postimage.window,
		session_key: canonicalKey
	};
}
function writeSessionEntry(database, sessionKey, entry, options = {}) {
	const actor = readSessionActorTransactionState(database, { sessionKey });
	if (actor && sessionKey !== actor.hot.target.sessionKey) throw new Error("Session actor cannot write a lookup sibling");
	if (!options.allowStoredAliases) {
		assertCanonicalSessionKeyWrite(sessionKey);
		assertCanonicalSessionEntryLineageWrite(entry);
		if (resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry) !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`refusing non-canonical session key write ${sessionKey}`);
	}
	let normalizedEntry = normalizeSessionEntryTimestamp(entry);
	if (!hasValidSessionEntryIdentity(normalizedEntry)) throw new Error("Refusing invalid SQLite session entry identity");
	const canonicalRead = options.canonicalPreviousEntry !== void 0 || options.allowStoredAliases && options.previousEntry !== void 0 ? void 0 : readExactSessionEntryRow(database, sessionKey, "full", void 0, options.postimages ? true : void 0);
	const canonicalPreviousEntry = options.canonicalPreviousEntry !== void 0 ? options.canonicalPreviousEntry ?? void 0 : options.allowStoredAliases && options.previousEntry !== void 0 ? options.previousEntry ?? void 0 : canonicalRead?.entry;
	const canonicalPreviousRow = options.canonicalPreviousRow ?? actor?.entryRows.get(sessionKey)?.row ?? canonicalRead?.row;
	const canonicalFacts = canonicalRead && captureSessionEntrySnapshot(canonicalRead);
	const canonicalPreviousSideTables = options.canonicalPreviousSideTables ?? canonicalFacts?.sideTables ?? (actor ? {
		memberIdsJson: JSON.stringify(actor.hot.members.map((member) => member.identityId)),
		hasBoard: actor.hasBoard
	} : canonicalPreviousEntry === void 0 ? {
		memberIdsJson: "[]",
		hasBoard: false
	} : void 0);
	if (options.postimages && !canonicalPreviousSideTables) throw new Error("Session entry postimage requires prepared side-table facts");
	if (canonicalPreviousEntry?.sessionId === normalizedEntry.sessionId && canonicalPreviousEntry.lifecycleRevision === normalizedEntry.lifecycleRevision && canonicalPreviousEntry.compactionQualityDegraded) normalizedEntry = {
		...normalizedEntry,
		compactionQualityDegraded: true
	};
	if (!options.providerReviewMutation && !options.allowStoredAliases) normalizedEntry = {
		...normalizedEntry,
		providerReview: canonicalPreviousEntry?.sessionId === normalizedEntry.sessionId && canonicalPreviousEntry.lifecycleRevision === normalizedEntry.lifecycleRevision ? canonicalPreviousEntry.providerReview : void 0
	};
	if (normalizedEntry.providerReview?.sessionId !== normalizedEntry.sessionId) delete normalizedEntry.providerReview;
	if (canonicalPreviousEntry?.sandbox === "required") {
		if (normalizedEntry.sandbox !== "required" || normalizedEntry.createdVia !== canonicalPreviousEntry.createdVia || normalizedEntry.createdAt !== canonicalPreviousEntry.createdAt || !isDeepStrictEqual(normalizedEntry.createdActor, canonicalPreviousEntry.createdActor)) getChildLogger({ subsystem: "session-sqlite" }).warn("blocked role-required session creation provenance downgrade", {
			agentId: database.agentId,
			sessionKey
		});
	}
	if (!options.allowStoredAliases || canonicalPreviousEntry?.sandbox === "required") normalizedEntry = preserveCreationStamp(normalizedEntry, canonicalPreviousEntry);
	if (isIncognitoSessionKey(sessionKey) && normalizedEntry.createdAt === void 0) normalizedEntry = {
		...normalizedEntry,
		createdAt: canonicalPreviousEntry?.updatedAt ?? Date.now()
	};
	const involvement = options.profileInvolvement ?? canonicalPreviousEntry?.profileInvolvement ?? (entry.profileInvolvement?.key === sessionKey || options.allowStoredAliases ? entry.profileInvolvement : void 0);
	if (involvement) normalizedEntry = {
		...normalizedEntry,
		profileInvolvement: {
			...involvement,
			key: sessionKey
		}
	};
	else if (normalizedEntry.profileInvolvement) {
		const { profileInvolvement: _sourceInvolvement, ...forkEntry } = normalizedEntry;
		normalizedEntry = forkEntry;
	}
	const previousEntry = options.previousEntry === void 0 ? canonicalPreviousEntry : options.previousEntry ?? void 0;
	if (options.consumePendingReset !== true && previousEntry?.updatedAt === 0 && previousEntry.sessionId === normalizedEntry.sessionId && previousEntry.lifecycleRevision === normalizedEntry.lifecycleRevision) normalizedEntry.updatedAt = 0;
	const updatedAt = normalizedEntry.updatedAt;
	if (!Object.hasOwn(normalizedEntry, "publicShare") && canonicalPreviousEntry?.sessionId === normalizedEntry.sessionId) normalizedEntry.publicShare = resolveSessionPublicShare(canonicalPreviousEntry);
	if (normalizedEntry.incognito === true || normalizedEntry.publicShare?.sessionId !== normalizedEntry.sessionId) delete normalizedEntry.publicShare;
	if (previousEntry && previousEntry.sessionId !== normalizedEntry.sessionId) delete normalizedEntry.visibility;
	const canonicalEntry = stripRuntimeOnlySessionSkillsFields(projectCanonicalSessionEntryShape({ ...normalizedEntry }));
	const persisted = splitSessionEntrySnapshots(canonicalEntry, { previousEntry: canonicalPreviousEntry });
	const legacySources = prepareLegacyAcpMigrationSourcesForEntryWrite(database, sessionKey, normalizedEntry, canonicalPreviousEntry, canonicalPreviousRow);
	const sessionNode = {
		...bindSessionNode({
			entry: canonicalEntry,
			entryJson: persisted.entryJson,
			sessionKey,
			updatedAt
		}),
		...legacySources
	};
	const previousColumns = new Map(Object.entries(canonicalPreviousRow ?? {}));
	const nodeChanged = options.allowStoredAliases === true || canonicalPreviousRow === void 0 || Object.entries(sessionNode).some(([key, value]) => previousColumns.get(key) !== value);
	if (!options.allowStoredAliases) validateCanonicalSessionRow({
		...sessionNode,
		session_key: sessionNode.session_key.toWellFormed(),
		current_session_id: sessionNode.current_session_id.toWellFormed(),
		entry_json: sessionNode.entry_json.toWellFormed(),
		parent_session_key: sessionNode.parent_session_key?.toWellFormed() ?? null,
		spawned_by: sessionNode.spawned_by?.toWellFormed() ?? null,
		fork_source_session_key: sessionNode.fork_source_session_key?.toWellFormed() ?? null,
		retained_window_id: null
	});
	else markCanonicalSessionValidationPending(database, [sessionKey]);
	const written = withSqliteDatabaseWriteScope(database.db, [sessionKey, sqliteSessionIdWriteScope(normalizedEntry.sessionId)], () => {
		if (canonicalPreviousEntry && canonicalPreviousEntry.sessionId !== normalizedEntry.sessionId) clearSessionCollaborationForKey(database, sessionKey, { clearSuggestions: options.preserveNodeSuggestions !== true });
		const boundSessionRoot = bindSessionRoot({
			entry: normalizedEntry,
			sessionKey,
			updatedAt
		});
		const preparedWindow = options.canonicalPreviousWindow ?? canonicalFacts?.window;
		const { conversation, primaryConversationId } = prepareSessionConversationForWrite({
			database,
			entry: normalizedEntry,
			previousEntry,
			canonicalPreviousEntry,
			previousWindow: actor?.window ?? preparedWindow?.row,
			observeConversation: options.observeConversation || options.allowStoredAliases,
			...options.routeContext !== void 0 ? { routeContext: options.routeContext } : {},
			sessionScope: boundSessionRoot.session_scope
		});
		const retainWindowOwner = canonicalPreviousEntry?.sessionId === normalizedEntry.sessionId;
		const window = prepareSessionEntryWindowRow({
			boundSessionRow: {
				...boundSessionRoot,
				primary_conversation_id: primaryConversationId
			},
			database,
			entry: normalizedEntry,
			previousEntry,
			retainOwner: retainWindowOwner,
			prepared: preparedWindow,
			stagedTranscriptUpdatedAt: actor ? void 0 : readStagedSessionTranscriptUpdatedAt(database, normalizedEntry.sessionId)
		});
		const queries = getSessionEntryWriteQueries(database.db);
		const writeGeneration = nodeChanged || persisted.snapshotsChanged || window.changed || conversation !== null ? trackSessionEntryCacheWrite(database, () => {
			if (conversation) upsertConversationIdentities(database, prepareConversationIdentities([conversation.identity]), updatedAt);
			if (nodeChanged) ("legacy_acp_migration_json" in legacySources ? queries.nodeWithLegacySources : queries.node)(sessionNode);
			if (persisted.snapshotsChanged) writeSessionEntrySnapshots(database, sessionKey, persisted.snapshots, persisted);
			if (window.changed) (retainWindowOwner ? queries.retainWindow : queries.claimWindow)(window.row);
			if (conversation) linkSessionConversation({
				database,
				...previousEntry?.sessionId ? { previousSessionId: previousEntry.sessionId } : {},
				sessionId: window.row.session_id,
				conversation,
				updatedAt
			});
		}) : void 0;
		if (nodeChanged) advanceSessionEntryMaintenanceAgeFact(database.db, {
			sessionKey,
			entry: normalizedEntry,
			previousEntry: canonicalPreviousEntry
		});
		return {
			writeGeneration,
			window,
			conversationWritten: conversation !== null
		};
	});
	const changed = nodeChanged || persisted.snapshotsChanged || written.window.changed || written.conversationWritten;
	const sideMetadata = changed || actor || options.postimages ? structuredClone({
		owner: canonicalPreviousEntry?.owner,
		participants: canonicalPreviousEntry?.participants,
		participantCount: canonicalPreviousEntry?.participantCount
	}) : {};
	const snapshots = persisted.snapshotsChanged ? persisted.snapshots : void 0;
	if (changed) publishSessionEntryCacheInvalidation(database, {
		sessionKey,
		entry: normalizedEntry,
		sharingUnchanged: !options.allowStoredAliases && sessionSharingEntriesEqual(canonicalPreviousEntry, {
			...normalizedEntry,
			owner: canonicalPreviousEntry?.owner
		}),
		entryJson: persisted.entryJson,
		snapshotEntry: canonicalEntry,
		snapshots,
		sideMetadata,
		previousEntry: canonicalPreviousEntry,
		...!options.allowStoredAliases ? { facts: {
			kind: "entry",
			previousSessionId: canonicalPreviousEntry?.sessionId,
			sessionId: normalizedEntry.sessionId,
			category: normalizedEntry.category?.trim() || null,
			communicationBinding: communicationEntryBinding(normalizedEntry),
			clearMembers: canonicalPreviousEntry !== void 0 && canonicalPreviousEntry.sessionId !== normalizedEntry.sessionId,
			lifecycleChanged: canonicalPreviousEntry?.sessionId !== normalizedEntry.sessionId || canonicalPreviousEntry?.lifecycleRevision !== normalizedEntry.lifecycleRevision
		} } : {}
	}, written.writeGeneration);
	const persistedEntry = actor || options.postimages ? projectSessionEntryCacheUpdate(persisted.entryJson, sideMetadata, canonicalEntry, snapshots) : void 0;
	const row = persistedEntry ? createSessionEntryWriteRow({
		previous: canonicalPreviousRow,
		node: sessionNode,
		snapshots: persisted.snapshots,
		snapshotsChanged: persisted.snapshotsChanged,
		window: written.window.postimage
	}) : void 0;
	if (actor && persistedEntry && row) replaceSessionActorStoredEntry(actor, sessionKey, {
		entry: persistedEntry,
		row,
		window: written.window.postimage
	});
	if (options.postimages && persistedEntry && row && canonicalPreviousSideTables) {
		const stagedTranscript = readStagedSessionTranscriptAuthority(database)?.flatMap((receipt) => Array.from(receipt.facts.values())).find((fact) => fact.kind === "postimage" && fact.value.sessionId === persistedEntry.sessionId);
		const preparedWatermark = canonicalPreviousRow?.transcriptWatermark;
		const transcriptWatermark = !readSessionActivitySummary(persistedEntry) ? void 0 : stagedTranscript?.kind === "postimage" ? {
			generation: stagedTranscript.value.generation,
			maxSeq: stagedTranscript.value.rawSeq
		} : preparedWatermark?.sessionId === persistedEntry.sessionId ? {
			generation: preparedWatermark.generation,
			maxSeq: preparedWatermark.maxSeq
		} : readSessionTranscriptWatermarkInDatabase(database, persistedEntry.sessionId);
		options.postimages.set(sessionKey, {
			changed,
			entry: persistedEntry,
			row,
			window: written.window.postimage,
			transcriptWatermark,
			sideTables: {
				...canonicalPreviousSideTables,
				...canonicalPreviousEntry && canonicalPreviousEntry.sessionId !== normalizedEntry.sessionId ? { memberIdsJson: "[]" } : {}
			}
		});
	}
	return persistedEntry ? structuredClone(persistedEntry) : normalizedEntry;
}
//#endregion
export { getSessionInitializationUpstreamLinkCurrent as A, createNativeSessionCommitFinalizer as B, withSqliteSessionContextReset as C, getSessionRepositoryWorkspaceStore as D, findSessionRepositoryWorkspaces as E, isSessionCapabilityLookup as F, wrapNativeSessionDeletionMutation as H, prepareSessionCapabilityRead as I, withLegacySessionCapabilityReader as L, asSessionCapabilityLookup as M, createMemorySessionCapabilityStore as N, captureSessionInitializationOwner as O, createSubagentSessionStore as P, withPreparedSessionCapabilityRead as R, runSqliteSessionDeletionTransaction as S, withSqliteSessionDeletions as T, isNativeSessionDeletionUnresolved as V, readSessionIdentitySnapshot as _, writeSessionEntry as a, commitSqliteSessionDeletion as b, copySessionNodeArtifactsForRepair as c, readSessionNodeArtifactFingerprint as d, readSessionInputArtifactRows as f, readSessionEntrySelectionSnapshot as g, readLifecycleTargetSnapshot as h, rehomeSessionWindows as i, withSessionInitializationSource as j, createSessionInitialization as k, deleteSessionDeliveryArtifacts as l, normalizeLifecycleTarget as m, deleteLifecycleTargetRows as n, resolveSessionPublicShare as o, captureSessionEntrySnapshot as p, deleteSessionEntryRows as r, bindSessionWindowEntryProjection as s, deleteLegacySessionEntryRows as t, deleteSessionMembersForRepair as u, resolveLifecyclePrimaryEntry as v, withSqliteSessionDeletionWorkerParticipant as w, hasPreparedNativeSessionDeletion as x, captureNativeSessionWorkerDeletion as y, bindNativeSessionDeletionParticipant as z };
