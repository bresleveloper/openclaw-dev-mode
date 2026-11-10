import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { l as getOpenClawDatabaseMaintenanceScope, s as captureOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { j as readSqliteDatabaseWriteTokenForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { t as coerceRequiredSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { a as captureExternalSessionCommitGuard, c as prepareSessionSourceAuthority, d as runWithSessionSourceScope, f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion, t as acceptSessionSourceValidation, u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import { f as isGatewayRestartDrainError, l as getGatewayRestartDrainSignal, t as GatewayDrainingError } from "./gateway-work-admission-FWbk4b3p.mjs";
import { a as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { i as captureAgentDatabaseAdmission } from "./agent-database-admission-CeDA0ojh.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { c as runOpenClawAgentWriteTransaction, d as withOpenClawAgentDatabaseRuntime, i as getOpenClawAgentDatabaseIfOpen, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as OpenClawAgentDatabaseReadOnlyScope } from "./openclaw-agent-db-readonly-scope-DUxQ_9sC.mjs";
import { r as isInternalNonDeliveryChannel } from "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { n as getLoadedChannelPlugin } from "./registry-B91r5qN6.mjs";
import { t as resolveGroupSessionKey } from "./group-qLatmSbQ.mjs";
import { Q as projectSessionEntryPatch, Z as mergeSessionEntryPatch, dt as projectSessionMetaPatch, t as memorySessionActorOwners, ut as mergeSessionOrigin, vt as createFallbackSessionEntry } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import { r as assertAgentSessionWriteAdmission } from "./session-agent-work-admission-D63nonbM.mjs";
import "./plugins-CCVkYF8m.mjs";
import { i as toDatabaseOptions, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { d as withSessionEntryCreationPublication, u as runWithSessionEntryCreationPublication } from "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { u as readPreparedSessionEntryPublicationSource } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { i as prepareSessionIdentityPublication } from "./session-accessor.sqlite-identity-2UHa91m7.mjs";
import { c as buildInboundSessionCreationStamp } from "./session-entry-lineage-B7Mubzwj.mjs";
import { a as normalizeResolvedMaintenanceConfigInput, f as shouldRunSessionEntryMaintenance, u as shouldPreserveMaintenanceEntry } from "./store-maintenance-BqMt1Twc.mjs";
import { r as assertMaintenancePreservationCompatible } from "./transcript-event-media-C4aKs47S.mjs";
import { r as mergeSessionEntry } from "./types-BGDhC4_W.mjs";
import { n as assertCanonicalSessionKeyWrite } from "./session-canonical-key-B7chVWi3.mjs";
import { n as captureSessionActorStorageOwner, r as getSessionActorStorageBinding, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { a as resolveSqliteTranscriptReadScope, r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { l as runExclusiveSqliteSessionWrite, o as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { i as retainSessionEntryReadFacts, t as readRetainedSessionEntryFacts } from "./session-entry-read-facts-XUOtyCt0.mjs";
import { n as createAdmittedSessionEntryCohortReader } from "./session-entry-read-ordered-ygEz3W0N.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { t as createSessionWorkerExecutionSource } from "./session-worker-execution-source-CQwDQ8va.mjs";
import { t as assertCapturedSessionEntryReadSource } from "./session-entry-read-source-CtAlEtSu.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { n as withSessionStoreTarget } from "./session-store-target-runtime-D11id0W-.mjs";
import "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import { g as readSessionKeyBySessionIdInDatabase, p as readSessionEntryRow } from "./session-accessor.sqlite-entry-read-CLHpEbhT.mjs";
import { h as updateSessionEntryMaintenanceAgeFact, l as observeSessionEntryMaintenanceAgeChanges, o as capturePendingSessionMaintenanceAgeChanges, r as SESSION_ENTRY_MAINTENANCE_INTERVAL_MS } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { n as listSqliteSessionEntriesFromDatabase } from "./session-accessor.sqlite-entry-list.read-BLfvs7b2.mjs";
import { g as readSessionEntrySelectionSnapshot, h as readLifecycleTargetSnapshot } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { x as observeSessionWorkAdmissionReleases } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { t as normalizeInternalTurnContext } from "./internal-turn-source-sDcJfRAw.mjs";
import { t as runOpenClawAgentWriteWithYieldingAdmission } from "./openclaw-agent-db-transaction-gZY080Wq.mjs";
import { t as resolveConversationLabel } from "./conversation-label-DSOtC5aa.mjs";
import { i as readSessionEntryPatchPredicate, n as replaceSessionEntryInDatabase, t as applySessionEntryPatchInDatabase } from "./session-accessor.sqlite-entry-mutation-DzzqdA6S.mjs";
import { l as resolveSessionEntry } from "./session-accessor.sqlite-exact-read-UkIlVdR6.mjs";
import { c as resolveSessionReclamationDatabaseOptions } from "./session-accessor.sqlite-reclamation-CdzHU4X_.mjs";
import { t as SqliteReclamationInputsChangedError } from "./session-accessor.sqlite-reclamation-worker-diagnostics-DR5Udg-Z.mjs";
import { f as runSqliteSessionReclamation, i as kickSessionHistoryDiskBudgetMaintenance, o as finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort } from "./session-history-eviction-DcKJmUSb.mjs";
import { t as patchSessionEntryInWorker } from "./session-entry-patch-CSunl6ZV.mjs";
import { n as resolveMaintenanceConfig } from "./store-maintenance-runtime-Z7En5Q4b.mjs";
import { r as prepareSessionMaintenancePreservation } from "./store-maintenance-preserve-BGAXgKIR.mjs";
import "./session-accessor.sqlite-initial-entry-B00nO36i.mjs";
import "./session-retirement-read-BHIK-Jwj.mjs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
//#region src/config/sessions/metadata.ts
function deriveSessionOrigin(ctx, opts) {
	if (opts?.skipSystemEventOrigin && ctx.InternalTurnSource !== void 0) return;
	const providerRaw = typeof ctx.OriginatingChannel === "string" && ctx.OriginatingChannel || ctx.Surface || ctx.Provider;
	return mergeSessionOrigin(void 0, {
		label: normalizeOptionalString(resolveConversationLabel(ctx)),
		provider: normalizeMessageChannel(providerRaw),
		surface: normalizeOptionalLowercaseString(ctx.Surface),
		chatType: normalizeChatType(ctx.ChatType) ?? void 0,
		from: normalizeOptionalString(ctx.From),
		to: normalizeOptionalString(typeof ctx.OriginatingTo === "string" ? ctx.OriginatingTo : ctx.To),
		nativeChannelId: normalizeOptionalString(ctx.NativeChannelId),
		nativeDirectUserId: normalizeOptionalString(ctx.NativeDirectUserId),
		avatar: normalizeOptionalString(ctx.ConversationAvatar),
		accountId: normalizeOptionalString(ctx.AccountId),
		threadId: ctx.MessageThreadId ?? void 0
	});
}
function prepareGroupSessionPatch(params) {
	const resolution = params.groupResolution ?? resolveGroupSessionKey(params.ctx);
	if (!resolution?.channel) return null;
	const channel = resolution.channel;
	const subject = normalizeOptionalString(params.ctx.GroupSubject);
	const topicName = normalizeOptionalString(params.ctx.TopicName);
	const space = params.ctx.GroupSpace?.trim();
	const explicitChannel = params.ctx.GroupChannel?.trim();
	const subjectLooksChannel = Boolean(subject?.startsWith("#"));
	const normalizedChannel = subjectLooksChannel && resolution.chatType !== "channel" ? normalizeAnyChannelId(channel) : null;
	const isChannelProvider = Boolean(normalizedChannel && getLoadedChannelPlugin(normalizedChannel)?.capabilities.chatTypes.includes("channel"));
	const nextGroupChannel = explicitChannel ?? (subjectLooksChannel && subject && (resolution.chatType === "channel" || isChannelProvider) ? subject : void 0);
	return {
		resolution,
		nextSubject: nextGroupChannel ? void 0 : subject,
		nextGroupChannel,
		topicName,
		space
	};
}
function deriveSessionMetaPatch(params) {
	return projectSessionMetaPatch({
		...params,
		prepared: prepareSessionMetaPatch(params)
	});
}
/** Resolve plugin-owned ingress facts once, before handing pure metadata to the writer. */
function prepareSessionMetaPatch(params) {
	const sourceChannel = normalizeMessageChannel(params.ctx.Provider ?? params.ctx.Surface ?? params.ctx.OriginatingChannel);
	return {
		group: prepareGroupSessionPatch(params),
		clearAvatar: params.ctx.ConversationAvatar === "",
		origin: deriveSessionOrigin(params.ctx, { skipSystemEventOrigin: params.skipSystemEventOrigin }),
		internalTurn: params.ctx.InternalTurnSource !== void 0 || sourceChannel === "webchat" || sourceChannel != null && isInternalNonDeliveryChannel(sourceChannel)
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance-kick.ts
const maintenanceByStore = /* @__PURE__ */ new Map();
const MAINTENANCE_WRITE_QUIET_MS = 1e3;
const MAX_MAINTENANCE_REJECTIONS = 3;
/** Coalesce automatic logical maintenance outside ordinary entry-write latency. */
function kickSessionEntryMaintenanceAfterWrite(params) {
	const databasePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(params.scope));
	const owner = maintenanceByStore.get(databasePath);
	if (getGatewayRestartDrainSignal().aborted) {
		if (owner) retireMaintenanceOwner(databasePath, owner);
		return;
	}
	if (params.skipMaintenance) return;
	if (owner) {
		owner.activeSessionKeys.add(params.activeSessionKey);
		Object.assign(owner, params, {
			scope: owner.scope,
			generation: owner.generation + 1
		});
		const maintenance = resolveOwnerMaintenance(owner);
		const fact = owner.ageFact;
		if (!owner.running && fact?.entryCount !== void 0 && isDeepStrictEqual(fact.maintenance, maintenance) && Date.now() < Math.min(fact.next.at, fact.recheckAt) && (owner.noCandidates || !shouldRunSessionEntryMaintenance({
			entryCount: fact.entryCount,
			maxEntries: maintenance.maxEntries
		}))) {
			owner.activeSessionKeys.clear();
			const nextAt = Math.min(fact.next.at, fact.recheckAt);
			if (nextAt - Date.now() < (owner.timerDeadlineMonotonicMs ?? Infinity) - performance.now()) scheduleMaintenanceAt(databasePath, owner, nextAt);
			return;
		}
		if (!owner.running) {
			if (owner.retryDelayMs !== void 0) {
				if (owner.rejections >= MAX_MAINTENANCE_REJECTIONS) owner.rejections = 0;
				scheduleMaintenanceAfterWriteQuiet(databasePath, owner);
			} else scheduleImmediateMaintenance(databasePath, owner);
		}
		return;
	}
	const env = cloneEnvWithPlatformSemantics(params.scope.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const scope = {
		...params.scope,
		env,
		path: databasePath
	};
	const options = toDatabaseOptions(scope);
	const assertAdmitted = captureAgentDatabaseAdmission(options.agentId, { env });
	const identity = isIncognitoOpenClawAgentSqlitePath(databasePath, options) ? void 0 : readDatabasePathIdentitySync(databasePath);
	if (identity && !identity.key.startsWith("file:")) return;
	const captureExecution = () => supportsOpenClawAgentDatabaseExecution(options) && identity ? captureOpenClawAgentDatabaseExecution(options, { expectedIdentity: {
		kind: "file",
		physicalIdentity: identity.key.slice(5),
		birthtime: identity.birthtime,
		nativeLocation: identity.canonicalPath
	} }) : void 0;
	const created = {
		...params,
		scope,
		activeSessionKeys: /* @__PURE__ */ new Set([params.activeSessionKey]),
		ageChanges: /* @__PURE__ */ new Map(),
		captureExecution,
		execution: captureExecution(),
		assertCurrent: () => {
			assertAdmitted();
			created.execution?.assertCurrent();
			if (identity) assertExistingDatabaseIdentity(databasePath, identity.key, identity.birthtime);
		},
		generation: 1,
		running: false,
		rejections: 0
	};
	maintenanceByStore.set(databasePath, created);
	const maintenanceScope = getOpenClawDatabaseMaintenanceScope();
	const unregister = [];
	created.unregisterClose = () => unregister.forEach((release) => release());
	try {
		unregister.push(observeSessionWorkAdmissionReleases(created.storePath, () => {
			if (created.noCandidates || !created.running && created.ageFact?.entryCount !== void 0 && !shouldRunSessionEntryMaintenance({
				entryCount: created.ageFact.entryCount,
				maxEntries: resolveOwnerMaintenance(created).maxEntries
			})) return;
			if (!isMaintenanceOwnerCurrent(databasePath, created)) return;
			created.generation += 1;
			created.rejections = 0;
			if (!created.running) {
				if (created.retryDelayMs === void 0) {
					clearTimeout(created.timer);
					created.timer = void 0;
				}
				scheduleMaintenanceAfterWriteQuiet(databasePath, created);
			}
		}));
		if (identity) {
			unregister.push(observeSessionEntryMaintenanceAgeChanges(identity.key.slice(5), (change) => {
				const previousFact = created.ageFact;
				created.ageFact = updateSessionEntryMaintenanceAgeFact(created.ageFact, change);
				const invalidated = previousFact !== void 0 && created.ageFact === void 0;
				if (!created.ageFact) created.noCandidates = false;
				const previous = created.ageChanges.get(change.sessionKey);
				created.ageChanges.set(change.sessionKey, {
					...change,
					previousEntry: previous ? previous.previousEntry : change.previousEntry
				});
				if (!change.previousEntry || invalidated) {
					const preserved = change.entry.preserved ?? shouldPreserveMaintenanceEntry({
						key: change.sessionKey,
						entry: change.entry,
						preserveRecentMs: null
					});
					const fact = created.ageFact;
					const resume = !created.running && (invalidated || (created.noCandidates ? !preserved : fact?.entryCount !== void 0 && shouldRunSessionEntryMaintenance({
						entryCount: fact.entryCount,
						maxEntries: fact.maintenance.maxEntries
					})));
					if (!preserved) created.noCandidates = false;
					if (resume) {
						if (created.retryDelayMs !== void 0) {
							if (created.rejections >= MAX_MAINTENANCE_REJECTIONS) created.rejections = 0;
							scheduleMaintenanceAfterWriteQuiet(databasePath, created);
						} else scheduleImmediateMaintenance(databasePath, created);
					}
				}
			}));
			unregister.push(sessionChanges.subscribeFacts((change) => {
				if (change.factsInvalidated !== true && !("facts" in change && change.facts?.kind === "removed")) return;
				const source = readPreparedSessionEntryPublicationSource(change);
				const storePath = "all" in change ? typeof change.scope === "object" ? change.scope.storePath : void 0 : change.storePath;
				if (source.identity !== identity.key.slice(5) && storePath !== databasePath) return;
				created.ageFact = void 0;
				created.noCandidates = false;
				created.generation += 1;
				if (!created.running) scheduleImmediateMaintenance(databasePath, created);
			}));
		}
		for (const resourcePath of /* @__PURE__ */ new Set([databasePath, identity?.canonicalPath ?? databasePath])) {
			const unregisterResource = registerOpenClawAgentDatabaseAsyncResource({
				agentId: options.agentId,
				path: resourcePath,
				revoke: () => retireMaintenanceOwner(databasePath, created),
				close: async () => {
					retireMaintenanceOwner(databasePath, created);
					await created.retirement;
				}
			});
			unregister.push(unregisterResource);
			if (maintenanceScope) created.maintenanceResource ??= captureOpenClawDatabaseMaintenanceResource(unregisterResource, maintenanceScope);
		}
	} catch (error) {
		retireMaintenanceOwner(databasePath, created);
		throw error;
	}
	scheduleImmediateMaintenance(databasePath, created);
}
function resolveOwnerMaintenance(owner) {
	return owner.maintenanceConfig ? normalizeResolvedMaintenanceConfigInput(owner.maintenanceConfig) : resolveMaintenanceConfig();
}
function isMaintenanceOwnerCurrent(databasePath, owner) {
	if (getGatewayRestartDrainSignal().aborted || maintenanceByStore.get(databasePath) !== owner) return false;
	try {
		owner.maintenanceResource?.assertCurrent();
		owner.assertCurrent();
		return true;
	} catch {
		return false;
	}
}
function retireMaintenanceOwner(databasePath, owner) {
	if (owner.retirement) return;
	clearImmediate(owner.immediate);
	clearTimeout(owner.timer);
	if (maintenanceByStore.get(databasePath) === owner) maintenanceByStore.delete(databasePath);
	releaseMaintenanceExecution(databasePath, owner);
	owner.retirement = (async () => {
		await owner.active;
		await owner.release;
		owner.unregisterClose?.();
	})();
	owner.retirement.catch((error) => getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite automatic maintenance could not retire", {
		error,
		path: databasePath
	}));
}
function releaseMaintenanceExecution(databasePath, owner) {
	if (!owner.execution) return;
	const released = owner.execution.release();
	owner.release = owner.release ? Promise.all([owner.release, released]).then(() => void 0) : released;
	owner.execution = void 0;
	owner.release.catch((error) => getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite automatic maintenance could not release its executor", {
		error,
		path: databasePath
	}));
}
function scheduleImmediateMaintenance(databasePath, owner) {
	clearTimeout(owner.timer);
	owner.timer = void 0;
	owner.retryDelayMs = void 0;
	owner.timerDeadlineMonotonicMs = void 0;
	owner.running = true;
	owner.immediate = runInDetachedAsyncContext(() => setImmediate(() => {
		owner.immediate = void 0;
		startPendingMaintenance(databasePath, owner);
	}));
}
function scheduleMaintenanceAt(databasePath, owner, nextAt) {
	const delayMs = Math.max(1, Math.min(SESSION_ENTRY_MAINTENANCE_INTERVAL_MS, nextAt - Date.now()));
	clearTimeout(owner.timer);
	owner.retryDelayMs = void 0;
	owner.running = false;
	owner.timerDeadlineMonotonicMs = performance.now() + delayMs;
	owner.timer = runInDetachedAsyncContext(() => setTimeout(() => {
		owner.running = true;
		startPendingMaintenance(databasePath, owner);
	}, delayMs));
	owner.timer.unref();
}
function scheduleMaintenanceAfterWriteQuiet(databasePath, owner) {
	owner.running = false;
	if (owner.timer) return;
	owner.retryDelayMs = MAINTENANCE_WRITE_QUIET_MS * 2 ** Math.max(0, owner.rejections - 1);
	owner.timerDeadlineMonotonicMs = performance.now() + owner.retryDelayMs;
	owner.timer = runInDetachedAsyncContext(() => setTimeout(() => {
		owner.timer = void 0;
		owner.retryDelayMs = void 0;
		owner.running = true;
		startPendingMaintenance(databasePath, owner);
	}, owner.retryDelayMs));
	owner.timer.unref();
}
function startPendingMaintenance(databasePath, owner) {
	owner.timer = void 0;
	owner.timerDeadlineMonotonicMs = void 0;
	owner.active = Promise.resolve().then(async () => {
		if (!isMaintenanceOwnerCurrent(databasePath, owner)) {
			retireMaintenanceOwner(databasePath, owner);
			return;
		}
		const run = () => runPendingMaintenance(databasePath, owner);
		await (owner.maintenanceResource ? owner.maintenanceResource.runWorker(run) : run());
	});
}
async function runPendingMaintenance(databasePath, owner) {
	const isCurrent = () => isMaintenanceOwnerCurrent(databasePath, owner);
	const hasCurrentNoCandidates = () => owner.noCandidates === true && owner.ageFact?.entryCount !== void 0 && isDeepStrictEqual(owner.ageFact.maintenance, resolveOwnerMaintenance(owner));
	const installAgeFact = (fact) => {
		owner.ageFact = fact;
		for (const change of owner.ageChanges.values()) owner.ageFact = updateSessionEntryMaintenanceAgeFact(owner.ageFact, change);
	};
	if (!isCurrent()) {
		retireMaintenanceOwner(databasePath, owner);
		return;
	}
	const generation = owner.generation;
	let activeSessionKeys = [...owner.activeSessionKeys];
	owner.activeSessionKeys.clear();
	let nextMaintenanceAt = Infinity;
	let planningChanged = false;
	let finalized = false;
	let preservation;
	try {
		owner.execution ??= owner.captureExecution();
		const maintenance = resolveOwnerMaintenance(owner);
		if (maintenance.mode === "warn") {
			retireMaintenanceOwner(databasePath, owner);
			return;
		}
		const assertInputsCurrent = () => {
			if (!isCurrent()) {
				if (getGatewayRestartDrainSignal().aborted) throw new GatewayDrainingError();
				planningChanged = true;
				throw new SqliteReclamationInputsChangedError("SQLite automatic maintenance owner retired");
			}
		};
		const preparedPreservation = await prepareSessionMaintenancePreservation(owner.storePath);
		preservation = preparedPreservation;
		assertInputsCurrent();
		const capturePreservation = () => {
			try {
				return preparedPreservation.capture();
			} catch (error) {
				planningChanged = true;
				throw error;
			}
		};
		const operation = {
			databaseOptions: resolveSessionReclamationDatabaseOptions(toDatabaseOptions(owner.scope)),
			kind: "maintenance-plan",
			materializedPlans: [],
			input: {
				activeSessionKeys,
				archiveDirectory: owner.archiveDirectory,
				maintenance,
				preservation: capturePreservation(),
				storePath: owner.storePath
			}
		};
		const plannedChanges = capturePendingSessionMaintenanceAgeChanges(owner.ageChanges);
		operation.ageChanges = plannedChanges.changes;
		let planningConsumed = false;
		const consumePlanning = (completed) => {
			if (completed.kind !== "maintenance-plan") return;
			assertInputsCurrent();
			plannedChanges.acknowledge();
			installAgeFact(completed.ageFact);
			const plan = completed.value;
			owner.noCandidates = plan.archived === 0 && plan.entryRemovals.length === 0 && plan.stateDeletePlans.length === 0 && plan.durableNoCandidates === true && owner.generation === generation && owner.ageChanges.size === 0 && owner.ageFact?.entryCount !== void 0 && isDeepStrictEqual(owner.ageFact.maintenance, resolveOwnerMaintenance(owner));
			planningConsumed = true;
		};
		const result = await runSqliteSessionReclamation({
			diagnostics: { kind: "maintenance-plan" },
			assertCommitAllowed: assertInputsCurrent,
			onWorkerResult: consumePlanning,
			assertMaintenanceCommitAllowed(plans) {
				assertInputsCurrent();
				try {
					if ([...owner.activeSessionKeys].some((key) => !activeSessionKeys.includes(key))) throw new SqliteReclamationInputsChangedError("SQLite maintenance active keys changed");
					assertMaintenancePreservationCompatible(operation.input.preservation, capturePreservation(), plans);
				} catch (error) {
					planningChanged = true;
					throw error;
				}
			},
			refreshMaintenanceProtection: () => {
				assertInputsCurrent();
				activeSessionKeys = [.../* @__PURE__ */ new Set([...activeSessionKeys, ...owner.activeSessionKeys])];
				return {
					activeSessionKeys,
					preservation: capturePreservation(),
					preparedAgeFactCurrent: owner.generation === generation && plannedChanges.isCurrent() && isDeepStrictEqual(maintenance, resolveOwnerMaintenance(owner))
				};
			},
			plan: operation
		});
		if (!planningConsumed) consumePlanning(result);
		if (result.kind === "maintenance-plan-stale") {
			planningChanged = true;
			throw new SqliteReclamationInputsChangedError("SQLite maintenance snapshot changed before commit");
		}
		if (result.kind !== "maintenance-plan") throw new Error("SQLite automatic maintenance returned another operation's result");
		const plan = result.value;
		const readAge = async () => {
			assertInputsCurrent();
			const pending = capturePendingSessionMaintenanceAgeChanges(owner.ageChanges);
			const age = await runSqliteSessionReclamation({
				diagnostics: { kind: "maintenance-age" },
				assertCommitAllowed: assertInputsCurrent,
				plan: {
					kind: "maintenance-age",
					databaseOptions: operation.databaseOptions,
					materializedPlans: [],
					maintenance,
					ageChanges: pending.changes
				}
			});
			if (age.kind === "maintenance-age" || age.kind === "maintenance-plan-stale") pending.acknowledge();
			if (age.kind === "maintenance-plan-stale") {
				planningChanged = true;
				throw new SqliteReclamationInputsChangedError("SQLite automatic maintenance age fact changed after no-op planning");
			}
			if (age.kind !== "maintenance-age") throw new Error("SQLite automatic maintenance returned another age result");
			installAgeFact(age.ageFact);
			return age.nextAt;
		};
		const noChanges = plan.archived === 0 && plan.entryRemovals.length === 0;
		const noFinalization = noChanges && plan.stateDeletePlans.length === 0;
		const verifiedNextAt = noChanges ? result.nextAt : void 0;
		if (!noFinalization) await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(owner.scope, [plan], { isCurrent });
		finalized = true;
		activeSessionKeys = [];
		if (isCurrent() && owner.generation === generation) {
			assertInputsCurrent();
			nextMaintenanceAt = noFinalization ? verifiedNextAt : await readAge();
			if (owner.ageChanges.size > 0 && !hasCurrentNoCandidates()) {
				planningChanged = true;
				throw new SqliteReclamationInputsChangedError("SQLite automatic maintenance activity changed during age publication");
			}
		}
		owner.rejections = 0;
		if (noFinalization && !owner.ageFact && isCurrent()) {
			scheduleMaintenanceAfterWriteQuiet(databasePath, owner);
			return;
		}
		if (operation.input.activeSessionKeys.length > 0 && !hasCurrentNoCandidates() && (owner.ageFact?.entryCount === void 0 || shouldRunSessionEntryMaintenance({
			entryCount: owner.ageFact.entryCount,
			maxEntries: maintenance.maxEntries
		})) && isCurrent()) {
			scheduleMaintenanceAfterWriteQuiet(databasePath, owner);
			return;
		}
	} catch (error) {
		owner.noCandidates = false;
		preservation?.dispose();
		if (planningChanged && isCurrent()) {
			if (finalized && owner.generation !== generation) {
				owner.rejections = 0;
				scheduleMaintenanceAfterWriteQuiet(databasePath, owner);
				return;
			}
			activeSessionKeys.forEach((key) => owner.activeSessionKeys.add(key));
			owner.rejections += 1;
			owner.running = false;
			owner.retryDelayMs = MAINTENANCE_WRITE_QUIET_MS;
			if (owner.rejections >= MAX_MAINTENANCE_REJECTIONS) getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite automatic session maintenance paused after repeated input changes", {
				error,
				path: databasePath,
				rejections: owner.rejections
			});
			else scheduleMaintenanceAfterWriteQuiet(databasePath, owner);
			return;
		}
		if (!isGatewayRestartDrainError(error) && !(planningChanged && getGatewayRestartDrainSignal().aborted)) getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite automatic session maintenance failed", {
			error,
			path: databasePath
		});
	} finally {
		preservation?.dispose();
		releaseMaintenanceExecution(databasePath, owner);
	}
	if (!isCurrent()) {
		retireMaintenanceOwner(databasePath, owner);
		return;
	}
	const fact = owner.ageFact;
	if (fact && hasCurrentNoCandidates()) {
		owner.activeSessionKeys.clear();
		scheduleMaintenanceAt(databasePath, owner, Math.min(fact.next.at, fact.recheckAt));
		return;
	}
	if (owner.generation === generation && owner.ageChanges.size === 0) {
		if (nextMaintenanceAt === void 0) {
			retireMaintenanceOwner(databasePath, owner);
			return;
		}
		scheduleMaintenanceAt(databasePath, owner, nextMaintenanceAt);
		return;
	}
	scheduleMaintenanceAfterWriteQuiet(databasePath, owner);
}
//#endregion
//#region src/config/sessions/session-actor-entry-adapter.ts
/** Return undefined synchronously so durable callers capture their store before yielding. */
function patchSessionActorEntryInScope(scope, params) {
	const selected = getSessionActorStorageBinding(scope);
	if (selected) return patchSessionActorEntry(selected, params).then((entry) => ({ entry }));
	const authority = {
		assertCurrent() {},
		authorize() {}
	};
	if (!captureSessionActorStorageOwner(scope, authority)) return;
	return acquireSessionActorStorage(scope, {
		authority,
		lifetime: {
			assertCurrent() {},
			assertReadable() {}
		},
		create: Boolean(params.options.fallbackEntry)
	}).then(async (binding) => {
		if (!binding) return { entry: null };
		try {
			return { entry: await patchSessionActorEntry(binding, {
				...params,
				sessionKey: binding.actor.target.sessionKey
			}) };
		} finally {
			await binding.actor.release();
		}
	});
}
/** Async callbacks keep one compare-and-swap; closed reducers apply directly to current state. */
async function patchSessionActorEntry(binding, params) {
	const { actor, authority } = binding;
	const { options, update, sessionKey } = params;
	const source = await prepareSessionSourceAuthority(options.workerGuard?.source);
	const failures = [];
	let cancelled = false;
	let maintenancePreservation;
	try {
		const input = {
			operation: typeof update === "function" ? void 0 : update,
			fallbackEntry: options.fallbackEntry,
			preserveActivity: options.preserveActivity,
			replaceEntry: options.replaceEntry,
			consumePendingReset: options.consumePendingReset,
			providerReviewMutation: options.providerReviewMutation,
			prepareIf: options.prepareIf,
			guards: {
				shouldCommitIf: options.workerGuard?.shouldCommitIf,
				cliHistory: options.workerGuard?.cliHistory,
				conversation: options.workerGuard?.conversation,
				sources: source.checks.map(({ predicate }) => predicate)
			}
		};
		let expected;
		if (typeof update === "function") {
			const entry = await actor.storage.read({
				type: "session.entry.read",
				input: {}
			}, authority);
			if (options.prepareIf && !entry?.liveModelSwitchPending) return null;
			const writeBase = entry ?? options.fallbackEntry;
			if (!writeBase) return null;
			const patch = await update(structuredClone(writeBase), { existingEntry: structuredClone(entry) });
			const next = mergeSessionEntryPatch({
				...options,
				existing: entry,
				writeBase,
				patch,
				sessionKey
			});
			if (!next) return entry ?? null;
			expected = { entry };
			input.operation = {
				kind: "fields",
				patch: next
			};
			input.replaceEntry = true;
		}
		if (!input.operation) throw new Error("Session actor patch omitted its operation");
		const config = options.skipMaintenance ? void 0 : options.maintenanceConfig ?? resolveMaintenanceConfig();
		if (config && config.mode !== "warn") maintenancePreservation = await prepareSessionMaintenancePreservation(binding.path);
		const result = await actor.storage.mutate({
			type: "session.entry.patch",
			input: {
				...input,
				operation: input.operation,
				expected,
				...config && maintenancePreservation ? { maintenance: {
					config,
					preservation: maintenancePreservation.capture()
				} } : {}
			}
		}, {
			...authority,
			authorize(stage, facts, publication) {
				authority.authorize(stage, facts, publication);
				if (options.shouldCommit?.() === false) {
					cancelled = true;
					throw new Error("Session entry mutation was cancelled");
				}
				if (isRecord(publication) && publication.kind === "session.entry.sources") acceptSessionSourceValidation(source, publication.validation);
			},
			assertCurrent() {
				authority.assertCurrent();
				source.assertCurrent();
				options.workerGuard?.assertCurrent?.();
				options.workerGuard?.assertMutationAllowed?.();
				options.assertCommitAllowed?.();
			}
		}, { committed(outcome) {
			const change = outcome.changes.find((value) => value.sessionKey === sessionKey);
			if (!outcome.value || isDeepStrictEqual(change?.before?.entry, change?.after?.entry)) return;
			const predicate = options.workerGuard?.shouldCommitIf;
			options.onCommitted?.(outcome.value, predicate && change?.before?.entry?.sessionId === outcome.value.sessionId ? {
				sessionId: predicate.sessionId,
				watermark: change.before.transcript.watermark
			} : void 0);
			const database = actor.target.database;
			if (database.kind !== "memory") throw new Error("Memory patch lost its owner");
			options.onCommittedSource?.({
				agentId: binding.agentId,
				path: binding.path,
				databaseIdentity: database.incarnation
			}, outcome.value);
		} });
		return cancelled && result.kind === "rolled-back" ? null : readSessionActorStorageResult(result) ?? null;
	} catch (error) {
		failures.push(error);
		throw error;
	} finally {
		maintenancePreservation?.dispose();
		await releaseSessionSourceAuthorities([source], failures);
	}
}
/** Creation selects the memory namespace before any durable database preparation. */
async function createSessionActorEntryWithTranscriptInScope(scope, createEntry, options) {
	const signal = getAsyncWorkSignal();
	const assertCurrent = () => signal?.throwIfAborted();
	const binding = await acquireSessionActorStorage(scope, {
		authority: {
			assertCurrent,
			authorize: assertCurrent
		},
		lifetime: {
			assertCurrent,
			assertReadable: assertCurrent
		},
		create: true
	});
	if (!binding) return;
	try {
		return await createSessionActorEntryWithTranscript(binding, {
			...scope.env,
			OPENCLAW_STATE_DIR: path.resolve(binding.path, "../../../..")
		}, createEntry, options);
	} finally {
		await binding.actor.release();
	}
}
/** The entry, label claim, transcript and owner assignment install in one actor command. */
async function createSessionActorEntryWithTranscript(binding, env, createEntry, options) {
	const { actor, authority } = binding;
	const database = actor.target.database;
	if (database.kind !== "memory") throw new Error("Session creation requires a memory actor");
	const prepared = await actor.storage.read({
		type: "session.entry.creation",
		input: { label: options.label }
	}, authority);
	return withSessionEntryCreationPublication({
		agentId: binding.agentId,
		sessionKey: actor.target.sessionKey,
		bind: options.bindCreation,
		file: {
			kind: "actor",
			path: binding.path,
			agentId: binding.agentId,
			databaseIdentity: database.incarnation,
			assertCurrent: () => actor.assertCurrent()
		}
	}, async (publication) => {
		options.onPhase?.("entry");
		const created = await createEntry(prepared);
		if (!created.ok) return {
			ok: false,
			error: created.error,
			phase: "entry"
		};
		const commit = async (assertSourceCurrent) => {
			options.onPhase?.("commit");
			const entry = readSessionActorStorageResult(await actor.storage.mutate({
				type: "session.entry.create",
				input: {
					entry: created.entry,
					expected: prepared.targetEntry,
					label: options.label,
					cwd: options.cwd,
					transcriptEvents: created.transcriptEvents,
					owner: options.resolveOwnerAssignment?.()
				}
			}, {
				...authority,
				assertCurrent() {
					authority.assertCurrent();
					options.commitGuard?.();
					assertSourceCurrent?.();
				}
			}, { committed: ({ value }) => options.onLifecycleCommitted?.(value) }));
			if (options.afterCommitted) {
				const handle = await actor.storage.acquire(actor.target.sessionKey);
				try {
					await options.afterCommitted(entry, {
						env,
						assertCurrent() {
							handle.assertCurrent();
							authority.assertCurrent();
						}
					});
				} finally {
					await handle.release();
				}
			}
			return {
				ok: true,
				entry,
				sessionFile: actor.target.sessionKey
			};
		};
		return options.withCommit ? options.withCommit((assertSourceCurrent) => runWithSessionEntryCreationPublication(publication, () => commit(assertSourceCurrent))) : commit();
	});
}
//#endregion
//#region src/config/sessions/session-entry-patch-source.ts
/** Bind entry preparation and commit checks to the original physical store before yielding. */
function captureSessionEntryPatchSource(params) {
	const { resolved: scope, capturedSource: captured, options } = params;
	const { retainedExecution } = options;
	const resolved = {
		...scope,
		env: cloneEnvWithPlatformSemantics(scope.env ?? process.env)
	};
	resolved.env.OPENCLAW_STATE_DIR = resolveStateDir(resolved.env);
	const databaseOptions = toDatabaseOptions(resolved);
	assertAgentSessionWriteAdmission(databaseOptions, resolved.agentId);
	const databasePath = resolveOpenClawAgentSqlitePath(databaseOptions);
	const targetIdentity = readDatabasePathIdentitySync(databasePath);
	resolved.path = databasePath;
	databaseOptions.path = databasePath;
	const useWorker = isMainThread && supportsOpenClawAgentDatabaseExecution(databaseOptions);
	const ensure = options.workerGuard?.ensureIdentitySource;
	if (ensure && (!useWorker || typeof params.update === "function" || params.update.kind !== "ensure-identity" || ensure.agentId !== resolved.agentId)) throw new Error("Transaction-local entry authority requires a closed worker ensure");
	if (ensure && (targetIdentity.key !== `file:${ensure.source.databaseIdentity}` || targetIdentity.birthtime !== ensure.source.databaseBirthtime)) throw new Error("Transaction-local entry authority differs from its writer");
	const assertCapturedSource = (database) => {
		if (!captured) return;
		if (!database && typeof captured.databaseIdentity === "string") assertExistingDatabaseIdentity(captured.path, `file:${captured.databaseIdentity}`, captured.databaseBirthtime);
		assertCapturedSessionEntryReadSource(captured, database ?? getOpenClawAgentDatabaseIfOpen(databaseOptions));
	};
	const assertCurrent = () => {
		if (retainedExecution) {
			retainedExecution.assertCurrent();
			const identity = retainedExecution.fileIdentity;
			if (!captured || !identity || retainedExecution.agentId !== databaseOptions.agentId || captured.databaseIdentity !== identity.physicalIdentity || captured.databaseBirthtime !== identity.birthtime) throw new Error("Retained session writer differs from its acknowledged source");
		}
		if (targetIdentity.key.startsWith("file:")) assertExistingDatabaseIdentity(databasePath, targetIdentity.key, targetIdentity.birthtime);
		assertCapturedSource();
	};
	if (retainedExecution) assertCurrent();
	return {
		resolved,
		databaseOptions,
		databasePath,
		targetIdentity,
		useWorker,
		ensureIdentitySource: ensure ? {
			source: ensure.source,
			agentId: ensure.agentId,
			sessionKey: ensure.sessionKey
		} : void 0,
		assertCapturedSource,
		assertCurrent
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-admission.ts
/** Admission retains the exact owner that supplied its row across asynchronous policy work. */
async function loadSessionEntryForAdmission(input, preparation = {}) {
	const assertCurrent = () => {
		preparation.signal?.throwIfAborted();
		preparation.assertCurrent?.();
	};
	assertCurrent();
	const captured = captureSessionActorStorageOwner(input, {
		assertCurrent,
		authorize: assertCurrent
	});
	if (captured) {
		const owner = captured.owner ?? memorySessionActorOwners.get(captured);
		const sessionKey = resolveSqliteSessionKey(input.sessionKey, captured.agentId);
		const env = cloneEnvWithPlatformSemantics(input.env ?? process.env);
		env.OPENCLAW_STATE_DIR = path.resolve(captured.path, "../../../..");
		const createClaim = () => {
			let released = false;
			const assertClaimCurrent = () => {
				if (released) throw new Error("Memory session admission claim is released");
				owner.assertCurrent();
			};
			return {
				kind: "memory",
				identity: owner.identity.handle,
				incarnation: owner.identity.incarnation,
				target: {
					agentId: captured.agentId,
					env,
					storePath: captured.path,
					readSource: {
						agentId: captured.agentId,
						path: captured.path,
						databaseIdentity: owner.identity.incarnation
					},
					target: {
						canonicalKey: sessionKey,
						storeKeys: [sessionKey]
					}
				},
				acquireSessionActor(lifetime) {
					assertClaimCurrent();
					return owner.acquire({
						database: owner.identity,
						sessionKey
					}, lifetime);
				},
				assertCurrent: assertClaimCurrent,
				isCurrent() {
					try {
						assertClaimCurrent();
						return true;
					} catch {
						return false;
					}
				},
				async release() {
					released = true;
				},
				async afterTransition(_transition, assertOwnerCurrent) {
					assertClaimCurrent();
					assertOwnerCurrent();
					return createClaim();
				}
			};
		};
		return {
			entry: owner.readSession(sessionKey, captured.authority)?.entry,
			databaseClaim: createClaim()
		};
	}
	const env = cloneEnvWithPlatformSemantics(input.env ?? process.env);
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	const scope = {
		...input,
		env
	};
	const agentId = scope.agentId ? normalizeAgentId(scope.agentId) : parseAgentSessionKey(scope.sessionKey)?.agentId;
	let storePath;
	if (scope.storePath) storePath = path.resolve(scope.storePath);
	else {
		if (!agentId) throw new Error("Cannot resolve SQLite session scope without an agent id");
		storePath = resolveOpenClawAgentSqlitePath({
			agentId,
			env
		});
	}
	const candidates = captureSessionStoreReadCandidates(storePath);
	let claim;
	try {
		const result = await withSessionStoreTarget({
			agentId,
			defaultAgentId: scope.defaultAgentId,
			storePath,
			env,
			candidates
		}, async (target, owner) => {
			const options = {
				...target.database,
				path: target.sourcePath,
				env
			};
			const observed = readDatabasePathIdentitySync(options.path);
			return await runOpenClawAgentWorkerWrite(options, async () => {
				const execution = captureOpenClawAgentDatabaseExecution(options, observed.key.startsWith("file:") ? { expectedIdentity: {
					kind: "file",
					physicalIdentity: observed.key.slice(5),
					nativeLocation: observed.canonicalPath,
					birthtime: observed.birthtime
				} } : { expectedCreationIdentity: observed });
				const assertSourceCurrent = () => {
					assertCurrent();
					execution.assertCurrent();
					owner.assertCurrent();
				};
				const source = {
					...createSessionWorkerExecutionSource(assertSourceCurrent, "Session admission authority expired"),
					onRegistryChange(change) {
						owner.onRegistryChange(change);
						preparation.onRegistryChange?.(change);
					}
				};
				let transferred = false;
				try {
					await owner.refreshBeforeDispatch(() => execution.assertCurrent());
					assertSourceCurrent();
					await execution.prepare(source, preparation.signal);
					const sessionKey = resolveSqliteSessionKey(scope.sessionKey, target.logicalAgentId);
					assertSourceCurrent();
					const nativeOwner = execution.captureGenerationClaim();
					const request = { sessionKeys: [sessionKey] };
					const before = readSqliteDatabaseWriteTokenForPath(options.path);
					const cached = readRetainedSessionEntryFacts(options, request, nativeOwner);
					const initial = cached ?? await execution.runExisting(source, (worker) => worker.execute({
						type: "session.entry.read",
						input: request
					}, { signal: preparation.signal }));
					await owner.revalidateTarget();
					assertSourceCurrent();
					nativeOwner.assertCurrent();
					if (!initial) throw new Error("Session admission lost its selected database");
					if (!cached) retainSessionEntryReadFacts(options, request, initial, before);
					const entry = initial.entries.find((row) => row.sessionKey === sessionKey)?.entry;
					const nativeIncarnation = nativeOwner.incarnation;
					const createClaim = (borrowed, admittedEntry) => {
						const generation = borrowed.captureGenerationClaim();
						const identity = borrowed.fileIdentity;
						if (!identity) throw new Error("Session admission requires its captured physical identity");
						const admitted = admittedEntry && {
							sessionId: admittedEntry.sessionId,
							lifecycleRevision: admittedEntry.lifecycleRevision
						};
						return {
							kind: "worker",
							identity: generation.identity,
							incarnation: generation.incarnation,
							target: {
								agentId: target.logicalAgentId,
								env,
								storePath: options.path,
								readSource: {
									agentId: borrowed.agentId,
									path: options.path,
									databaseIdentity: identity.physicalIdentity,
									databaseBirthtime: identity.birthtime
								},
								target: {
									canonicalKey: sessionKey,
									storeKeys: [sessionKey]
								}
							},
							async acquireSessionActor(lifetime) {
								borrowed.assertCurrent();
								generation.assertCurrent();
								lifetime.assertCurrent();
								const { captureDurableSessionActor } = await import("./session-actor-durable-D5JBv-3r.mjs");
								borrowed.assertCurrent();
								generation.assertCurrent();
								lifetime.assertCurrent();
								return captureDurableSessionActor({
									database: {
										...options,
										path: borrowed.path
									},
									target: {
										database: identity,
										sessionKey
									},
									lifetime
								});
							},
							reader: admitted ? createAdmittedSessionEntryCohortReader({
								execution: borrowed,
								generation,
								database: {
									...target.database,
									env
								},
								sessionKey,
								logicalAgentId: target.logicalAgentId,
								storePaths: [storePath, target.sourcePath],
								expected: {
									incarnation: nativeIncarnation,
									sessions: [{
										sessionKey,
										...admitted
									}]
								}
							}) : void 0,
							assertCurrent: () => generation.assertCurrent(),
							isCurrent() {
								try {
									generation.assertCurrent();
									return true;
								} catch {
									return false;
								}
							},
							release: () => borrowed.release(),
							async afterTransition({ previous, current }, assertOwnerCurrent) {
								generation.assertCurrent();
								assertOwnerCurrent();
								if (previous?.sessionId !== admitted?.sessionId || previous?.lifecycleRevision !== admitted?.lifecycleRevision) throw new Error("Session transition changed its admitted predecessor");
								const expectedIdentity = borrowed.fileIdentity;
								if (!expectedIdentity) throw new Error("Session transition lost its admitted physical identity");
								const successor = captureOpenClawAgentDatabaseExecution({
									...options,
									path: borrowed.path
								}, {
									expectedIdentity,
									requestedPath: storePath
								});
								try {
									const next = successor.capturePreparedGenerationClaim();
									if (!next || next.identity !== generation.identity || next.incarnation !== generation.incarnation) throw new Error("Session transition changed its native generation");
									generation.assertCurrent();
									assertOwnerCurrent();
									return createClaim(successor, {
										sessionId: current.sessionId,
										lifecycleRevision: current.lifecycleRevision
									});
								} catch (error) {
									await successor.release();
									throw error;
								}
							}
						};
					};
					claim = createClaim(execution, entry);
					transferred = true;
					return {
						entry,
						databaseClaim: claim
					};
				} finally {
					if (!transferred) await execution.release();
				}
			}, void 0, preparation.signal);
		}, assertCurrent);
		assertCurrent();
		result.databaseClaim.assertCurrent();
		return result;
	} catch (error) {
		await claim?.release();
		throw error;
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry.ts
/** Loads one session entry from the additive SQLite session store. */
function loadSessionEntry(scope) {
	return resolveSessionEntry(scope).existing;
}
/** Loads one session entry without opening its agent database writable. */
function loadSessionEntryReadOnly(scope) {
	return resolveSessionEntry(scope, {
		readOnly: true,
		projection: scope.projection
	}).existing;
}
/** Resolves the persisted session key for a SQLite transcript session id. */
function resolveSessionKeyBySessionId(scope) {
	const memory = getSessionActorStorageBinding(scope);
	if (memory) return memory.actor.storage.readCurrent({
		type: "session.entry.readById",
		input: { sessionId: scope.sessionId }
	}, memory.authority)?.sessionKey;
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionKeyBySessionIdInDatabase(database, resolved.sessionId), toDatabaseOptions(resolved));
	return result.found ? result.value : void 0;
}
/** Lists session entries from the additive SQLite session store. */
function listSessionEntryRows(scope = {}) {
	const memory = getSessionActorStorageBinding(scope);
	if (memory) return memory.actor.storage.readCurrent({
		type: "session.entries.read",
		input: { projection: scope.projection }
	}, memory.authority);
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return listSqliteSessionEntriesFromDatabase(database, resolved, scope);
}
/** Reuse one reader during synchronous entry work; each read keeps its current admission. */
function withSessionEntryReadOnlyScope(scope, operation) {
	if (getSessionActorStorageBinding(scope)) return operation();
	const options = toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	}));
	const reader = new OpenClawAgentDatabaseReadOnlyScope();
	try {
		return reader.run({
			agentId: options.agentId,
			path: resolveOpenClawAgentSqlitePath(options)
		}, operation);
	} finally {
		reader.close();
	}
}
/** Reads a session activity timestamp from the additive SQLite session store. */
function readSessionUpdatedAtCore(scope) {
	const memory = getSessionActorStorageBinding(scope);
	if (memory) return memory.actor.storage.readCurrent({
		type: "session.entry.read",
		input: {}
	}, memory.authority)?.updatedAt;
	const resolved = resolveSqliteScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const row = readSessionEntryRow(database, resolved.sessionKey, "list")?.row;
	return row ? coerceRequiredSqliteNumber(row.updated_at) : void 0;
}
/** Applies a partial entry update to the additive SQLite session store. */
async function upsertSessionEntryCore(scope, patch, options = {}) {
	return await applySessionEntryOperation(scope, {
		kind: "fields",
		patch
	}, {
		...options,
		fallbackEntry: createFallbackSessionEntry(patch)
	});
}
/** Replaces one entry in the additive SQLite session store. */
async function replaceSessionEntry(scope, entry) {
	return await applySessionEntryOperation(scope, {
		kind: "fields",
		patch: entry
	}, {
		fallbackEntry: entry,
		replaceEntry: true
	});
}
/** Worker transcript commits use this synchronous replacement; other callers are fixtures. */
function replaceSessionEntrySync(scope, entry) {
	const resolved = resolveSqliteScope(scope);
	assertCanonicalSessionKeyWrite(resolved.sessionKey, resolved.agentId);
	runOpenClawAgentWriteTransaction((database) => {
		const { previous, current } = replaceSessionEntryInDatabase(database, resolved.sessionKey, entry);
		return prepareSessionIdentityPublication(database, resolved.agentId, previous, current);
	}, toDatabaseOptions(resolved), { operationLabel: "session-entry.replace" })();
}
/** Patches one entry in the additive SQLite session store. */
async function patchSessionEntryCore(scope, update, options = {}) {
	return await patchSessionEntryInScope(scope, update, options);
}
/** Internal fixed operations evaluate the authoritative row inside the writer command. */
async function applySessionEntryOperation(scope, operation, options = {}) {
	return await patchSessionEntryInScope(scope, structuredClone(operation), {
		workerGuard: {},
		...options
	});
}
async function patchSessionEntryInScope(scope, update, options, databaseAgentId) {
	const memory = patchSessionActorEntryInScope(scope, {
		update,
		options,
		sessionKey: scope.sessionKey
	});
	if (memory) return (await memory).entry;
	const resolved = resolveSqliteScope(scope);
	if (databaseAgentId) resolved.databaseAgentId = databaseAgentId;
	assertCanonicalSessionKeyWrite(resolved.sessionKey, resolved.agentId);
	return await patchSqliteSessionEntrySnapshot({
		operationLabel: "session-entry.patch",
		validateCanonicalKeys: options.replaceEntry !== true,
		options,
		selection: {
			kind: "entry",
			sessionKey: resolved.sessionKey,
			exact: options.replaceEntry === true
		},
		readSnapshot: (database, includeWindowFacts) => readSessionEntrySelectionSnapshot(database, resolved.sessionKey, options.replaceEntry === true, includeWindowFacts),
		resolved,
		sessionKey: resolved.sessionKey,
		storePath: resolveSessionStorePathForScope(scope),
		update
	});
}
/** Patches one logical entry after validating its canonical lifecycle target. */
async function patchSessionEntryTarget(scope, update, options = {}) {
	return await patchSessionEntryTargetInScope(scope, update, options);
}
async function applySessionEntryTargetOperation(scope, operation, options = {}) {
	return await patchSessionEntryTargetInScope(scope, structuredClone(operation), {
		workerGuard: {},
		...options
	});
}
async function patchSessionEntryTargetInScope(scope, update, options) {
	const memory = patchSessionActorEntryInScope({
		...scope,
		sessionKey: scope.target.canonicalKey
	}, {
		update,
		options,
		sessionKey: scope.target.canonicalKey
	});
	if (memory) return (await memory).entry;
	const source = scope.readSource;
	const resolved = source ? {
		agentId: scope.agentId ?? source.agentId,
		databaseAgentId: source.agentId,
		env: scope.env,
		path: source.path,
		ownerStorePath: source.path,
		sessionKey: ""
	} : resolveSqliteScope({
		agentId: scope.agentId,
		env: scope.env,
		sessionKey: scope.target.canonicalKey,
		storePath: scope.storePath
	});
	return await patchSqliteSessionEntrySnapshot({
		operationLabel: "session-entry-target.patch",
		capturedSource: source,
		validateCanonicalKeys: true,
		options,
		selection: {
			kind: "target",
			target: scope.target
		},
		readSnapshot: (database, includeWindowFacts) => readLifecycleTargetSnapshot(database, scope.target, { includeWindowFacts }),
		resolved,
		sessionKey: scope.target.canonicalKey,
		storePath: source?.path ?? resolveSessionStorePathForScope({
			agentId: scope.agentId,
			sessionKey: scope.target.canonicalKey,
			storePath: scope.storePath
		}),
		update
	});
}
/** Callback and fixed-operation patches share source custody, FIFO, and commit publication. */
async function patchSqliteSessionEntrySnapshot(params) {
	const { options, sessionKey } = params;
	const captured = params.capturedSource;
	const { resolved, databaseOptions, databasePath, targetIdentity, useWorker, ensureIdentitySource, assertCapturedSource, assertCurrent } = captureSessionEntryPatchSource(params);
	const prepare = async (prepared) => {
		const existing = prepared[0]?.entry;
		if (options.prepareIf?.kind === "live-model-switch-pending" && !existing?.liveModelSwitchPending) return;
		const writeBase = existing ?? options.fallbackEntry;
		if (!writeBase) return;
		let contextEntry = existing;
		let contextEntryBorrowed = true;
		const next = typeof params.update !== "function" ? projectSessionEntryPatch({
			...options,
			existing,
			writeBase,
			sessionKey,
			operation: params.update
		}) : mergeSessionEntryPatch({
			...options,
			existing,
			writeBase,
			sessionKey,
			patch: await params.update(structuredClone(writeBase), {
				get existingEntry() {
					if (contextEntryBorrowed) {
						contextEntry = contextEntry ? structuredClone(contextEntry) : void 0;
						contextEntryBorrowed = false;
					}
					return contextEntry;
				},
				set existingEntry(entry) {
					contextEntry = entry;
					contextEntryBorrowed = false;
				}
			})
		});
		return {
			selection: params.selection,
			prepared,
			sessionKey,
			writeBase,
			next,
			operationLabel: params.operationLabel,
			validateCanonicalKeys: params.validateCanonicalKeys,
			consumePendingReset: options.consumePendingReset,
			providerReviewMutation: options.providerReviewMutation,
			shouldCommitIf: options.workerGuard?.shouldCommitIf,
			cliHistory: options.workerGuard?.cliHistory,
			conversation: options.workerGuard?.conversation
		};
	};
	const withDatabase = (operation) => {
		assertCurrent?.();
		return !getOpenClawAgentDatabaseIfOpen(databaseOptions) ? withOpenClawAgentDatabaseRuntime(databaseOptions, operation, assertCurrent) : operation();
	};
	let wrote = false;
	const creatingExecution = useWorker && !options.retainedExecution && targetIdentity.key.startsWith("path:") ? captureOpenClawAgentDatabaseExecution(databaseOptions, { expectedCreationIdentity: targetIdentity }) : void 0;
	const workerPatch = (source, assertSource) => patchSessionEntryInWorker({
		database: {
			...databaseOptions,
			path: databasePath
		},
		expectedCreationIdentity: targetIdentity,
		databaseIdentity: typeof captured?.databaseIdentity === "string" ? captured.databaseIdentity : void 0,
		agentId: resolved.agentId,
		selection: params.selection,
		assertCurrent: () => assertCurrent?.(),
		guard: options.workerGuard,
		assertCommitAllowed: () => {
			options.assertCommitAllowed?.();
			assertSource?.();
		},
		shouldCommit: options.shouldCommit,
		preparedSource: source,
		retainedExecution: options.retainedExecution ?? creatingExecution,
		reduction: typeof params.update === "function" ? void 0 : {
			operation: params.update,
			selection: params.selection,
			sessionKey,
			operationLabel: params.operationLabel,
			validateCanonicalKeys: params.validateCanonicalKeys,
			fallbackEntry: options.fallbackEntry,
			replaceEntry: options.replaceEntry,
			preserveActivity: options.preserveActivity,
			consumePendingReset: options.consumePendingReset,
			providerReviewMutation: options.providerReviewMutation,
			shouldCommitIf: options.workerGuard?.shouldCommitIf,
			cliHistory: options.workerGuard?.cliHistory,
			conversation: options.workerGuard?.conversation,
			ensureIdentitySource
		},
		prepare,
		onCommitted: options.onCommitted,
		onCommittedSource: options.onCommittedSource
	}).then((result) => {
		wrote = result.wrote;
		return result.entry;
	});
	const sourceAssertion = options.workerGuard?.source;
	const pendingCommit = runExclusiveSqliteSessionWrite(resolved, async () => {
		if (useWorker) {
			const source = await prepareSessionSourceAuthority(sourceAssertion);
			const locality = !source.nativeSource && source.checks.every(({ predicate }) => targetIdentity.key === `file:${predicate.source.databaseIdentity}`) ? "same-store" : "cross-store";
			if (ensureIdentitySource && locality !== "same-store") {
				await source.release?.();
				throw new Error("Transaction-local entry authority differs from its writer");
			}
			if (locality === "same-store") return workerPatch(source);
			await source.release?.();
			return runWithSessionSourceScope(sourceAssertion, () => workerPatch({
				assertCurrent: () => sourceAssertion?.(),
				checks: []
			}, sourceAssertion), { checkAfter: false });
		}
		const patchNative = async () => withDatabase(async () => {
			const database = openOpenClawAgentDatabase(databaseOptions);
			assertCapturedSource(database);
			const prepared = params.readSnapshot(database);
			const input = await prepare(prepared);
			if (!input) return null;
			const { writeBase, next } = input;
			return withDatabase(async () => {
				let result = null;
				let committedSource;
				let transcriptPredicate;
				const publish = await runOpenClawAgentWriteWithYieldingAdmission((writeDatabase) => {
					assertCapturedSource(writeDatabase);
					options.workerGuard?.assertCurrent?.();
					if (options.shouldCommit?.() === false) return;
					const predicate = readSessionEntryPatchPredicate(writeDatabase, sessionKey, options.workerGuard?.shouldCommitIf);
					if (!predicate.matches) return;
					const mutation = applySessionEntryPatchInDatabase(writeDatabase, {
						operationLabel: params.operationLabel,
						validateCanonicalKeys: params.validateCanonicalKeys,
						readSnapshot: (current) => params.readSnapshot(current, true),
						prepared,
						sessionKey,
						writeBase,
						next,
						options: {
							...options,
							assertCommitAllowed: () => {
								options.assertCommitAllowed?.();
								options.workerGuard?.assertMutationAllowed?.();
								options.workerGuard?.source?.();
							}
						}
					});
					result = mutation.entry;
					transcriptPredicate = mutation.entry.sessionId === predicate.transcriptPredicate?.sessionId ? predicate.transcriptPredicate : void 0;
					if (!mutation.identity) return;
					if (options.onCommittedSource) {
						const identity = readOpenClawAgentDatabaseIdentity(writeDatabase);
						committedSource = {
							agentId: writeDatabase.agentId,
							path: writeDatabase.path,
							databaseIdentity: identity.identity,
							databaseBirthtime: identity.birthtime
						};
					}
					wrote = true;
					return prepareSessionIdentityPublication(writeDatabase, resolved.agentId, mutation.identity.previous, mutation.identity.current);
				}, databaseOptions, { operationLabel: params.operationLabel });
				try {
					if (next && result) {
						const entry = structuredClone(result);
						if (transcriptPredicate) options.onCommitted?.(entry, transcriptPredicate);
						else options.onCommitted?.(entry);
						if (committedSource) options.onCommittedSource?.(committedSource, structuredClone(result));
					}
				} finally {
					publish?.();
				}
				return result;
			});
		});
		return runWithSessionSourceScope(sourceAssertion, patchNative, { checkAfter: false });
	}, params.operationLabel, void 0, options.retainedExecution || useWorker && !sourceAssertion ? "foreground-reentrant" : "foreground");
	let committed;
	try {
		committed = await pendingCommit;
	} finally {
		await creatingExecution?.release();
	}
	if (wrote) kickSessionEntryMaintenanceAfterWrite({
		activeSessionKey: sessionKey,
		archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
		maintenanceConfig: options.maintenanceConfig,
		scope: resolved,
		skipMaintenance: options.skipMaintenance,
		storePath: params.storePath
	});
	kickSessionHistoryDiskBudgetMaintenance({
		...resolved.agentId ? { agentId: resolved.agentId } : {},
		env: resolved.env,
		storePath: params.storePath,
		...options.maintenanceConfig ? { maintenanceConfig: options.maintenanceConfig } : {}
	});
	return committed;
}
async function recordInboundSessionMeta(params) {
	normalizeInternalTurnContext(params.ctx);
	const createIfMissing = params.createIfMissing ?? true;
	return await applySessionEntryOperation({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, {
		kind: "inbound-metadata",
		sessionKey: params.sessionKey,
		metadata: prepareSessionMetaPatch(params),
		creation: buildInboundSessionCreationStamp(params.ctx)
	}, {
		preserveActivity: true,
		workerGuard: { assertMutationAllowed: params.assertCommitAllowed },
		...createIfMissing ? { fallbackEntry: mergeSessionEntry(void 0, {}) } : {}
	});
}
/** Updates last-route/delivery metadata without refreshing activity timestamps. */
async function updateSessionLastRoute(params) {
	return await updateSessionLastRouteInScope({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, {
		...params,
		assertCommitAllowed: captureExternalSessionCommitGuard(params.assertCommitAllowed)
	});
}
/** Internal callers retain their captured storage owner across route preparation. */
async function updateSessionLastRouteInScope(scope, params) {
	if (params.ctx) normalizeInternalTurnContext(params.ctx);
	const createIfMissing = params.createIfMissing ?? true;
	const { source, ...routeGuard } = params.workerGuard ?? {};
	const commitGuard = sessionEntryCommitGuardOptions(source ? composeSessionSourceAssertion([source, params.assertCommitAllowed]) : params.assertCommitAllowed);
	return await patchSessionEntryInScope(scope, {
		kind: "last-route",
		route: {
			channel: params.channel,
			to: params.to,
			accountId: params.accountId,
			threadId: params.threadId,
			route: params.route,
			deliveryContext: params.deliveryContext,
			sessionKey: scope.sessionKey,
			metadata: params.ctx ? prepareSessionMetaPatch({
				ctx: params.ctx,
				groupResolution: params.groupResolution
			}) : void 0
		},
		creation: buildInboundSessionCreationStamp(params.ctx)
	}, {
		preserveActivity: true,
		...commitGuard,
		workerGuard: {
			...routeGuard,
			...commitGuard.workerGuard
		},
		...createIfMissing ? { fallbackEntry: mergeSessionEntry(void 0, {}) } : {}
	}, scope.databaseAgentId);
}
//#endregion
export { prepareSessionMetaPatch as S, loadSessionEntryForAdmission as _, loadSessionEntryReadOnly as a, deriveSessionMetaPatch as b, readSessionUpdatedAtCore as c, replaceSessionEntrySync as d, resolveSessionKeyBySessionId as f, withSessionEntryReadOnlyScope as g, upsertSessionEntryCore as h, loadSessionEntry as i, recordInboundSessionMeta as l, updateSessionLastRouteInScope as m, applySessionEntryTargetOperation as n, patchSessionEntryCore as o, updateSessionLastRoute as p, listSessionEntryRows as r, patchSessionEntryTarget as s, applySessionEntryOperation as t, replaceSessionEntry as u, createSessionActorEntryWithTranscriptInScope as v, deriveSessionOrigin as x, kickSessionEntryMaintenanceAfterWrite as y };
