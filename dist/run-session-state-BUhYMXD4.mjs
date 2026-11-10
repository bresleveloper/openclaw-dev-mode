import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import "./errors-DPfGDWk1.mjs";
import { S as isCronSessionKey } from "./session-key-CSDERtm3.mjs";
import { i as resolveSessionAuthProfileOverrideSource } from "./auth-profile-override-provenance-Jztnei-C.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { a as normalizeCronToolsAllowExecTarget, i as normalizeCronScheduledToolPolicy, o as normalizeCronToolsAllowExecTargetRequirement, r as normalizeCronScheduledToolCallerOrigin, u as stripCronPinnedExecGrant } from "./scheduled-tool-policy-Bjq61U8o.mjs";
import { a as preserveSqliteSameKeySessionRolloverLineage, l as buildSessionCreationStamp, u as inheritSessionCreationPolicy } from "./session-entry-lineage-B7Mubzwj.mjs";
import { u as setSessionRuntimeModel } from "./types-BGDhC4_W.mjs";
import { b as isSessionWorkAdmissionActive, f as getCompetingSessionWorkAdmissionRelease, n as beginSessionWorkAdmission, p as getSessionWorkAdmissionOwnerRelease } from "./session-lifecycle-admission-BihxXo5j.mjs";
import "./lifecycle-CKc8qk3B.mjs";
import { n as clearBootstrapSnapshotOnSessionBoundary } from "./bootstrap-cache-DPiLx4Sp.mjs";
import { i as enqueueCommandInLane } from "./command-queue-Dvag6gVL.mjs";
import { n as resolveSessionLane } from "./lanes-DQO4OUmF.mjs";
import { t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-8QOLmJ6L.mjs";
import { r as mergeSessionSnapshotChanges } from "./session-snapshot-merge-Dh-eJoIb.mjs";
import { t as CronSessionLifecycleClaimError } from "./run-authority-Cj0McdfG.mjs";
import "./run.runtime.js";
import { n as readSessionTranscriptWatermarkAsync } from "./session-transcript-watermark-gXttdn2N.mjs";
import { t as loadCronSessionEntryLatest } from "./session-MNiALRV_.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/isolated-agent/run-session-state.ts
/** Owns admission and persistence for isolated cron sessions. */
const CRON_SESSION_PREPARATION_OWNER = Symbol.for("openclaw.cronSessionPreparation");
/** Preserve cron FIFO while waiting for full session settlement outside the execution lane. */
async function withCronSessionPreparation(params, prepare) {
	const target = {
		scope: params.storePath,
		identities: [params.sessionKey],
		owner: CRON_SESSION_PREPARATION_OWNER
	};
	if (getSessionWorkAdmissionOwnerRelease(target)) params.onLaneWait?.({
		waiting: true,
		stage: "session-preparation"
	});
	const admission = await beginSessionWorkAdmission({
		agentId: params.agentId,
		...target,
		serializeOwner: true,
		signal: params.signal,
		onInterrupt: params.onInterrupt,
		assertAllowed: (signal) => signal.throwIfAborted()
	});
	try {
		return await admission.run(async () => {
			for (;;) {
				const result = await enqueueCommandInLane(resolveSessionLane(params.sessionKey), async () => {
					const release = getCompetingSessionWorkAdmissionRelease({
						scope: params.storePath,
						identities: [params.sessionKey],
						excludePendingOwner: CRON_SESSION_PREPARATION_OWNER
					});
					if (release) return {
						kind: "waiting",
						release
					};
					params.onLaneWait?.({
						waiting: false,
						stage: "session-preparation"
					});
					return {
						kind: "prepared",
						value: await prepare()
					};
				}, {
					abortSignal: params.signal,
					priority: "background",
					taskIdentity: {
						taskKind: "cron",
						sessionKey: params.sessionKey
					},
					onQueued: () => params.onLaneWait?.({
						waiting: true,
						stage: "session-preparation"
					})
				});
				if (result.kind === "prepared") return result.value;
				params.onLaneWait?.({
					waiting: true,
					stage: "session-preparation"
				});
				await racePromiseWithAbortSignal(result.release, params.signal, (signal) => toErrorObject(signal.reason, "Queued command aborted"));
			}
		});
	} finally {
		admission.release();
	}
}
function clearCronContextOwnerState(entry) {
	delete entry.contextTokens;
	delete entry.contextTokensSource;
	delete entry.contextBudgetStatus;
}
function resolveCronLifecycleRevisionIdentity(lifecycleRevision) {
	return `cron-lifecycle-revision:${lifecycleRevision}`;
}
/** Claim the captured session generation before asynchronous run preparation. */
async function beginCronSessionWorkAdmission(params) {
	const { cronSession, agentSessionKey, runSessionKey } = params;
	const initialSessionEntry = cronSession.initialSessionEntry;
	return await beginSessionWorkAdmission({
		agentId: params.agentId,
		scope: cronSession.storePath,
		identities: [
			agentSessionKey,
			initialSessionEntry?.sessionId,
			cronSession.sessionEntry.sessionId,
			resolveCronLifecycleRevisionIdentity(cronSession.lifecycleRevision),
			runSessionKey
		],
		signal: params.signal,
		onInterrupt: params.onInterrupt,
		assertAllowed: async (signal) => {
			const currentEntry = await loadCronSessionEntryLatest(cronSession.storePath, agentSessionKey);
			signal.throwIfAborted();
			if (initialSessionEntry ? !currentEntry || !isDeepStrictEqual(projectCronOwnershipFields(currentEntry), projectCronOwnershipFields(initialSessionEntry)) : Boolean(currentEntry)) throw new CronSessionLifecycleClaimError(agentSessionKey);
			const archivedSessionError = resolveSessionWorkStartError(agentSessionKey, currentEntry);
			if (archivedSessionError) throw new CronSessionLifecycleClaimError(agentSessionKey, archivedSessionError);
		}
	});
}
async function cronTranscriptExists(params) {
	const sessionId = params.entry.sessionId?.trim();
	if (!sessionId) return false;
	try {
		return (await readSessionTranscriptWatermarkAsync({
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		})).maxSeq !== null;
	} catch {
		return false;
	}
}
function projectCronOwnershipFields(entry) {
	const projected = Object.fromEntries(Object.entries(entry).filter(([, value]) => value !== void 0));
	delete projected.label;
	delete projected.pinnedAt;
	delete projected.updatedAt;
	return projected;
}
function toNonResumableCronSessionEntry(entry) {
	const next = { ...entry };
	delete next.sessionStartedAt;
	delete next.lastInteractionAt;
	delete next.cliSessionIds;
	delete next.cliSessionBindings;
	delete next.claudeCliSessionId;
	return next;
}
/** Creates the persistence callback that stores cron session metadata after a run. */
function createPersistCronSessionEntry(params) {
	return async (assertCommitAllowed, liveEntry = params.cronSession.sessionEntry) => {
		const resetBoundaryPending = params.cronSession.resetBoundaryPending !== void 0;
		if (assertCommitAllowed && resetBoundaryPending) throw new CronSessionLifecycleClaimError(params.agentSessionKey);
		const persistedEntry = isCronSessionKey(params.agentSessionKey) && liveEntry.sessionId && (liveEntry.sessionStartedAt !== void 0 || liveEntry.lastInteractionAt !== void 0 || liveEntry.cliSessionIds !== void 0 || liveEntry.cliSessionBindings !== void 0 || liveEntry.claudeCliSessionId !== void 0) && !await cronTranscriptExists({
			entry: liveEntry,
			sessionKey: params.agentSessionKey,
			storePath: params.cronSession.storePath
		}) ? toNonResumableCronSessionEntry(liveEntry) : liveEntry;
		let committedEntry = persistedEntry;
		let mergedLiveEntry = liveEntry;
		await params.persistSessionEntry({
			storePath: params.cronSession.storePath,
			sessionKey: params.agentSessionKey,
			fallbackEntry: persistedEntry,
			assertCommitAllowed,
			...resetBoundaryPending ? { resetBoundary: {
				context: "preserve-tail",
				reason: "cron-stale",
				cwd: params.workspaceDir
			} } : {},
			update: (currentEntry) => {
				if (!currentEntry) {
					const creationStamp = buildSessionCreationStamp({
						via: "cron",
						actor: params.createdActor ?? { type: "system" },
						sandbox: params.sandbox
					});
					committedEntry = {
						...persistedEntry,
						...creationStamp
					};
					mergedLiveEntry = {
						...liveEntry,
						...creationStamp
					};
				}
				const ownsCurrentRevision = currentEntry?.lifecycleRevision === params.cronSession.lifecycleRevision && (params.cronSession.initialSessionEntry === void 0 || currentEntry?.sessionId === params.cronSession.initialSessionEntry.sessionId);
				const currentRevisionActive = Boolean(currentEntry?.lifecycleRevision && isSessionWorkAdmissionActive(params.cronSession.storePath, [resolveCronLifecycleRevisionIdentity(currentEntry.lifecycleRevision)]));
				const initialEntryMatchesOwnershipFields = currentEntry !== void 0 && params.cronSession.initialSessionEntry !== void 0 && isDeepStrictEqual(projectCronOwnershipFields(currentEntry), projectCronOwnershipFields(params.cronSession.initialSessionEntry));
				const initialEntry = params.cronSession.initialSessionEntry;
				const initialLifecycleRevision = initialEntry?.lifecycleRevision;
				const currentContinuesInitialGeneration = currentEntry !== void 0 && initialEntry !== void 0 && initialLifecycleRevision !== void 0 && currentEntry.lifecycleRevision === initialLifecycleRevision && currentEntry.sessionId === initialEntry.sessionId;
				const canClaimInitialRevision = params.cronSession.initialSessionEntry ? !currentRevisionActive && (initialEntryMatchesOwnershipFields || currentContinuesInitialGeneration) : currentEntry === void 0;
				if (!ownsCurrentRevision && !canClaimInitialRevision) throw new CronSessionLifecycleClaimError(params.agentSessionKey);
				if (currentEntry && params.cronSession.initialSessionEntry) {
					committedEntry = mergeSessionSnapshotChanges({
						initial: params.cronSession.initialSessionEntry,
						next: persistedEntry,
						current: currentEntry
					});
					mergedLiveEntry = mergeSessionSnapshotChanges({
						initial: params.cronSession.initialSessionEntry,
						next: liveEntry,
						current: currentEntry
					});
				}
				return committedEntry;
			}
		});
		clearBootstrapSnapshotOnSessionBoundary({
			boundaryAppended: resetBoundaryPending,
			sessionKey: params.agentSessionKey
		});
		params.cronSession.resetBoundaryPending = void 0;
		params.cronSession.sessionEntry = mergedLiveEntry;
		params.cronSession.initialSessionEntry = structuredClone(committedEntry);
		params.cronSession.store[params.agentSessionKey] = committedEntry;
	};
}
/** Creates the hidden exact-run session owner used by detached media wakes. */
function createCronRunContinuationSession(params) {
	const scheduledToolPolicy = params.toolsAllow === void 0 ? void 0 : normalizeCronScheduledToolPolicy(params.scheduledToolPolicy);
	const scheduledToolCallerOrigin = normalizeCronScheduledToolCallerOrigin(params.scheduledToolCallerOrigin);
	const toolsAllowExecTarget = params.toolsAllow === void 0 ? void 0 : normalizeCronToolsAllowExecTarget(params.toolsAllowExecTarget);
	const toolsAllowExecTargetRequirement = params.toolsAllow === void 0 ? void 0 : normalizeCronToolsAllowExecTargetRequirement(params.toolsAllowExecTargetRequirement);
	const storedToolsAllow = stripCronPinnedExecGrant({
		toolsAllow: params.toolsAllow,
		requirement: toolsAllowExecTargetRequirement
	});
	const continuation = {
		lifecycleRevision: params.cronSession.lifecycleRevision,
		phase: "running",
		...storedToolsAllow !== void 0 ? { toolsAllow: storedToolsAllow } : {},
		...params.toolsAllowIsDefault === true ? { toolsAllowIsDefault: true } : {},
		...scheduledToolPolicy ? { scheduledToolPolicy } : {},
		...scheduledToolPolicy?.mode === "account" ? { scheduledToolCallerOrigin } : {},
		...toolsAllowExecTarget ? { toolsAllowExecTarget } : {},
		...toolsAllowExecTargetRequirement ? { toolsAllowExecTargetRequirement } : {},
		...params.cliSessionBindingFacts ? { cliSessionBindingFacts: { ...params.cliSessionBindingFacts } } : {}
	};
	const owns = (entry) => entry?.cronRunContinuation?.lifecycleRevision === continuation.lifecycleRevision;
	let sealed = false;
	let persistedSnapshot;
	const persist = async (create, phase, basePersisted = false, assertCommitAllowed) => {
		if (sealed) {
			if (phase === "ready") return;
			throw new CronSessionLifecycleClaimError(params.runSessionKey);
		}
		const source = structuredClone(params.cronSession.sessionEntry);
		delete source.createdVia;
		delete source.createdActor;
		delete source.createdAt;
		delete source.previousSessionId;
		delete source.forkSource;
		delete source.usageFamilySessionIds;
		const snapshot = {
			source,
			continuation: structuredClone(continuation)
		};
		if (phase === "running" && isDeepStrictEqual(snapshot, persistedSnapshot)) return;
		let persisted = false;
		let alreadySealed = false;
		await params.persistSessionEntry({
			storePath: params.cronSession.storePath,
			sessionKey: params.runSessionKey,
			fallbackEntry: source,
			assertCommitAllowed,
			update: (current) => {
				if (current && !owns(current) || !current && !create) throw new CronSessionLifecycleClaimError(params.runSessionKey);
				if (current && current.cronRunContinuation?.phase !== "running") {
					alreadySealed = phase === "ready" && current.cronRunContinuation?.phase === "ready";
					if (alreadySealed) return current;
					throw new CronSessionLifecycleClaimError(params.runSessionKey);
				}
				persisted = true;
				return {
					...current,
					...current ? preserveSqliteSameKeySessionRolloverLineage({
						next: source,
						previous: current,
						sessionKey: params.runSessionKey
					}) : source,
					cliSessionBindings: source.cliSessionBindings,
					cliSessionIds: source.cliSessionIds,
					claudeCliSessionId: source.claudeCliSessionId,
					...!current ? buildSessionCreationStamp({
						via: "cron",
						...inheritSessionCreationPolicy(params.cronSession.sessionEntry, params.createdActor ?? { type: "system" }),
						sandbox: params.cronSession.sessionEntry.sandbox ?? params.sandbox
					}) : {},
					...params.thinkingLevel ? { thinkingLevel: params.thinkingLevel } : {},
					cronRunContinuation: {
						...continuation,
						phase,
						...phase === "ready" ? { basePersisted } : {}
					}
				};
			}
		});
		if (!persisted && !alreadySealed) throw new CronSessionLifecycleClaimError(params.runSessionKey);
		persistedSnapshot = snapshot;
		sealed = phase === "ready";
	};
	return {
		initialize: async () => await persist(true, "running"),
		sync: async (assertCommitAllowed, execution) => {
			if (execution) {
				const provider = execution.cliExecutionProvider?.trim();
				if (provider) continuation.cliExecutionProvider = provider;
				else delete continuation.cliExecutionProvider;
			}
			await persist(false, "running", false, assertCommitAllowed);
		},
		seal: async (options) => await persist(false, "ready", options?.basePersisted === true)
	};
}
/** Adopts the session id produced by a run and preserves usage-family lineage. */
function adoptCronRunSessionMetadata(params) {
	const nextSessionId = params.runMeta?.sessionId?.trim();
	const previousSessionId = params.entry.sessionId;
	if (!nextSessionId || nextSessionId === previousSessionId) return false;
	params.entry.sessionId = nextSessionId;
	params.entry.usageFamilyKey = params.entry.usageFamilyKey ?? params.sessionKey;
	params.entry.usageFamilySessionIds = Array.from(/* @__PURE__ */ new Set([
		...params.entry.usageFamilySessionIds ?? [],
		...previousSessionId ? [previousSessionId] : [],
		nextSessionId
	]));
	return true;
}
/**
* Updates the cron selection and drops facts produced by the previous model.
* Keeping those facts after the owner tuple changes lets a later run relabel stale telemetry.
*/
function setCronSessionRuntimeModel(params) {
	const provider = params.provider.trim();
	const model = params.model.trim();
	if (!provider || !model) return false;
	const selectionChanged = params.entry.modelProvider?.trim() !== provider || params.entry.model?.trim() !== model;
	if (selectionChanged) clearCronContextOwnerState(params.entry);
	setSessionRuntimeModel(params.entry, {
		provider,
		model
	});
	return selectionChanged;
}
/** Updates the producing harness and drops context facts owned by the previous runtime. */
function setCronSessionAgentHarnessId(params) {
	const previousRuntime = normalizeOptionalAgentRuntimeId(params.entry.agentHarnessId);
	const nextRuntime = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	if (previousRuntime !== nextRuntime) clearCronContextOwnerState(params.entry);
	params.entry.agentHarnessId = params.agentHarnessId;
	return previousRuntime !== nextRuntime;
}
/** Syncs live model/auth-profile changes from a running cron session back to storage. */
function syncCronSessionLiveSelection(params) {
	const previousRuntime = normalizeOptionalAgentRuntimeId(params.entry.agentRuntimeOverride);
	const nextRuntime = normalizeOptionalAgentRuntimeId(params.liveSelection.agentRuntimeOverride);
	setCronSessionRuntimeModel({
		entry: params.entry,
		provider: params.liveSelection.provider,
		model: params.liveSelection.model
	});
	if (previousRuntime !== nextRuntime) clearCronContextOwnerState(params.entry);
	applyModelRuntimeDirective(params.entry, params.liveSelection.agentRuntimeOverride ? {
		kind: "set",
		runtime: params.liveSelection.agentRuntimeOverride
	} : { kind: "clear" });
	if (params.liveSelection.authProfileId) {
		const source = params.liveSelection.authProfileIdSource ?? (params.entry.authProfileOverride?.trim() === params.liveSelection.authProfileId.trim() ? resolveSessionAuthProfileOverrideSource(params.entry) : "user");
		params.entry.authProfileOverride = params.liveSelection.authProfileId;
		params.entry.authProfileOverrideSource = source;
		if (source === "auto") params.entry.authProfileOverrideCompactionCount = params.entry.compactionCount ?? 0;
		else delete params.entry.authProfileOverrideCompactionCount;
		return;
	}
	delete params.entry.authProfileOverride;
	delete params.entry.authProfileOverrideSource;
	delete params.entry.authProfileOverrideCompactionCount;
}
//#endregion
export { setCronSessionAgentHarnessId as a, withCronSessionPreparation as c, createPersistCronSessionEntry as i, beginCronSessionWorkAdmission as n, setCronSessionRuntimeModel as o, createCronRunContinuationSession as r, syncCronSessionLiveSelection as s, adoptCronRunSessionMetadata as t };
