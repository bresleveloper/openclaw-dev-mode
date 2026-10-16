import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { d as sleepWithAbort } from "./src-D1BHGNTj.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as assertExistingDatabaseIdentity, u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { g as publishSqliteWalCheckpointObservation } from "./sqlite-wal-DUSYRhyv.mjs";
import { l as getOpenClawDatabaseMaintenanceScope, m as runOutsideOpenClawDatabaseMaintenanceScope, p as observeOpenClawDatabaseMaintenanceResource } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import "./backoff-BrzXG7iD.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, m as publishOpenClawStateDatabaseWorkerAdmission } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { a as getOpenClawAgentDatabaseValidationForTransfer, n as captureOpenClawAgentDatabaseValidationTransfer } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { c as SqliteWorkerError, d as retainSqliteWorkerErrorCode } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext, t as captureOpenClawStateReadContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath, n as assertIncognitoAgentDatabasePathAvailable, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { a as isSqliteWorkerStoreAvailable, f as runSqliteWorkerStoreOperation, o as openAgentDatabaseSqliteWorkerStore, s as openEphemeralAgentDatabaseSqliteWorkerStore, t as closeUnclaimedSharedStateSqliteWorkers } from "./sqlite-worker-store-CsIRv3py.mjs";
import "./openclaw-state-lease-heartbeat-shared-BczGehzh.mjs";
import { b as getAgentDeletionDatabaseCleanup } from "./agent-deletion-journal-CDljXcnp.mjs";
import { i as captureAgentDatabaseAdmission, o as captureAgentDatabasePreparationJournal } from "./agent-database-admission-dWNS6Rcs.mjs";
import { l as hasAgentDatabaseMaintenanceAuthority } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
import { n as captureOpenClawAgentDatabaseRegistration } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { t as cache } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { t as requestOpenClawAgentDatabaseQuickCheck } from "./openclaw-database-verify-C7BZMETe.mjs";
import { s as getGatewayRestartDrainSignal } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { n as forkCliSessionBindings } from "./cli-session-binding-CMk8AbZT.mjs";
import { t as cleanupRetiredAgentDatabaseLease } from "./openclaw-agent-execution-cleanup-BCHe5J1Y.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
import { MessagePort } from "node:worker_threads";
import { addAbortListener } from "node:events";
//#region src/config/sessions/session-incognito-compute-contract.ts
function isIncognitoComputeCommand(command) {
	return command.type.startsWith("session.compute.");
}
function isIncognitoComputeWrite(type) {
	return type.startsWith("session.compute.projection.") || type === "session.compute.source.release" || type === "session.compute.usage.writeRollup" || type === "session.compute.usage.prune" || type === "session.compute.usage.acquireLock" || type === "session.compute.usage.releaseLock";
}
//#endregion
//#region src/config/sessions/session-incognito-compute.ts
/** Cleanup owns only resources captured before dispatch; it never grants data access. */
async function withIncognitoCompute(params) {
	const target = structuredClone(params.target);
	const sources = /* @__PURE__ */ new Map();
	const locks = /* @__PURE__ */ new Set();
	const pending = /* @__PURE__ */ new Set();
	let active = true;
	const assertCurrent = () => {
		if (!active) throw new Error("Incognito compute scope is closed");
		params.assertCurrent();
	};
	const ownResources = (captured) => {
		if (captured.type === "session.compute.source.release" || captured.type === "session.compute.usage.releaseLock") throw new Error("Incognito compute cleanup belongs to its scope");
		if ("sourceId" in captured.input) {
			const key = captured.input.sourceId;
			if (captured.type === "session.compute.source.open" && !sources.has(key)) sources.set(key, randomUUID());
			const owned = sources.get(key);
			if (!owned) throw new Error("Incognito compute source is not owned by this scope");
			captured.input.sourceId = owned;
		}
		if (captured.type === "session.compute.usage.acquireLock") {
			const request = captured.input.request;
			request.lockJson = JSON.stringify({
				pid: process.pid,
				startedAt: request.startedAt,
				ownerNonce: randomUUID()
			});
			locks.add(request.lockJson);
		}
	};
	try {
		assertCurrent();
		const result = await params.operation({
			assertCurrent,
			execute(command, signal) {
				assertCurrent();
				signal?.throwIfAborted();
				const captured = structuredClone(command);
				const input = captured.input;
				if (input.sessionKey !== target.sessionKey || input.sessionId !== target.sessionId || input.lifecycleRevision !== target.lifecycleRevision) throw new Error("Incognito compute request belongs to another session generation");
				if (isIncognitoComputeCommand(captured)) ownResources(captured);
				const work = params.execute(captured, signal).then((value) => {
					assertCurrent();
					params.disclose();
					assertCurrent();
					return value;
				});
				pending.add(work);
				work.finally(() => pending.delete(work)).catch(() => void 0);
				return work;
			}
		});
		assertCurrent();
		params.disclose();
		assertCurrent();
		return result;
	} finally {
		active = false;
		await Promise.allSettled(pending);
		for (const sourceId of sources.values()) while (await params.cleanup({
			type: "session.compute.source.release",
			input: {
				...target,
				sourceId
			}
		}));
		for (const lockJson of locks) await params.cleanup({
			type: "session.compute.usage.releaseLock",
			input: {
				...target,
				request: lockJson
			}
		});
	}
}
//#endregion
//#region src/config/sessions/session-incognito-lifecycle-contract.ts
function isIncognitoLifecycleCommand(command) {
	return command.type.startsWith("session.lifecycle.");
}
function isIncognitoLifecycleWrite(type) {
	return type !== "session.lifecycle.reclaim.prepare" && type !== "session.lifecycle.fork.prepare";
}
function incognitoLifecycleKeys(command, identity) {
	switch (command.type) {
		case "session.lifecycle.delete": return [command.input.target.sessionKey];
		case "session.lifecycle.reclaim": return command.input.plan.entries.map(({ sessionKey }) => sessionKey);
		case "session.lifecycle.reclaim.prepare": return [];
		case "session.lifecycle.fork.prepare": return [command.input.parent.sessionKey];
		case "session.lifecycle.fork": return command.input.parent.identity.handle === identity.handle && command.input.parent.identity.incarnation === identity.incarnation ? [command.input.parent.sessionKey, command.input.child.sessionKey] : [command.input.child.sessionKey];
	}
	throw new Error("Unsupported incognito lifecycle operation");
}
//#endregion
//#region src/config/sessions/session-incognito-side-data-contract.ts
function isIncognitoSideDataWrite(type) {
	return type === "session.category.apply" || type === "session.reaction.set" || type.startsWith("session.sharing.") || type.startsWith("session.heartbeat.");
}
function incognitoSideDataKeys(command) {
	if (command.type === "session.heartbeat.persist") return [command.input.session_key];
	if (command.type === "session.catalog.read") return command.input.sessionKeys ?? [];
	return "sessionKey" in command.input ? [command.input.sessionKey] : [];
}
//#endregion
//#region src/config/sessions/session-incognito-transcript-contract.ts
function isIncognitoTranscriptCommand(command) {
	return command.type.startsWith("session.report.") || command.type === "session.message.append" || command.type === "session.turn.read";
}
function isIncognitoTranscriptWrite(type) {
	return type !== "session.report.prepare" && type !== "session.report.latestCustomReport" && type !== "session.turn.read";
}
//#endregion
//#region src/config/sessions/session-incognito-actor.ts
function authorizeSessionFacts(authority, stage, facts) {
	const authorization = authority.authorize?.(stage, structuredClone(facts));
	if (isPromiseLike(authorization)) {
		Promise.resolve(authorization).catch(() => void 0);
		throw new Error("Incognito session grants must remain synchronous");
	}
}
/** Actor-local projection owned by its lifetime, never a roster or full-entry cache. */
function createIncognitoSessionFacts(identity, assertActorCurrent, withGrant) {
	const entries = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Set();
	const unavailable = /* @__PURE__ */ new Set();
	let topologyRevision = 0;
	const current = (sessionKey) => {
		assertActorCurrent();
		if (pending.has(sessionKey) || unavailable.has(sessionKey)) throw new Error("Incognito session facts are pending or unavailable");
		return entries.get(sessionKey);
	};
	const install = (facts) => {
		assertActorCurrent();
		if (!isDeepStrictEqual(facts.identity, identity)) throw new Error("Incognito publication belongs to another actor");
		const previous = entries.get(facts.sessionKey);
		if (previous && previous.revision > facts.revision) throw new Error("Incognito publication is older than committed facts");
		const next = structuredClone(facts);
		if (previous?.sharing?.entry?.sessionId === next.sharing?.entry?.sessionId && previous) next.expiresAt = previous.expiresAt;
		if (previous?.sharing?.entry?.sessionId !== next.sharing?.entry?.sessionId || previous?.sharing?.entry?.lifecycleRevision !== next.sharing?.entry?.lifecycleRevision) topologyRevision += 1;
		if (next.sharing?.entry) entries.set(next.sessionKey, next);
		else entries.delete(next.sessionKey);
		unavailable.delete(facts.sessionKey);
	};
	const claim = (sessionKey, assertBorrowed) => {
		const observed = current(sessionKey)?.sharing?.entry;
		const capturedRevision = topologyRevision;
		const assertCurrent = () => {
			assertBorrowed();
			const entry = current(sessionKey)?.sharing?.entry;
			if (entry?.sessionId !== observed?.sessionId || entry?.lifecycleRevision !== observed?.lifecycleRevision || !observed && capturedRevision !== topologyRevision) throw new Error("Incognito session generation is no longer current");
		};
		return {
			identity,
			sessionKey,
			assertCurrent,
			authorize(authority, stage) {
				withGrant(() => {
					authority.assertCurrent();
					assertCurrent();
					const facts = current(sessionKey);
					if (!facts) throw new Error("Incognito session facts are unavailable");
					authorizeSessionFacts(authority, stage, facts);
					authority.assertCurrent();
					assertCurrent();
				});
			}
		};
	};
	return {
		clear() {
			entries.clear();
			pending.clear();
			unavailable.clear();
			topologyRevision += 1;
		},
		bind(run, assertBorrowed, retain) {
			const perform = (authority, command, changing, receive, signal, companion, cleanup = false) => {
				const captured = structuredClone(command);
				const targets = /* @__PURE__ */ new Set();
				let native;
				let postimage;
				let commitGranted = false;
				function unknownOutcome(message) {
					for (const key of targets) unavailable.add(key);
					throw new SqliteWorkerError(message, "outcome-unknown");
				}
				return run(authority, async (scope) => {
					assertActorCurrent();
					let outcome;
					try {
						outcome = {
							ok: true,
							value: await scope.execute(captured)
						};
					} catch (error) {
						outcome = {
							ok: false,
							error
						};
					}
					try {
						if (native) {
							const settlement = await native.retained.settled;
							const receipt = native.admission.committed?.facts;
							const companionOutcome = receipt !== void 0 && postimage !== void 0 && isDeepStrictEqual(receipt, postimage) ? "committed" : receipt === void 0 && (settlement.kind === "not-entered" || native.admission.settlement?.kind === "completed" && !commitGranted && !outcome.ok) ? "rolled-back" : "unknown";
							try {
								if (receipt !== void 0) {
									if (!postimage || !isDeepStrictEqual(receipt, postimage)) unknownOutcome("Incognito commit receipt differs from its grant");
									postimage.forEach(install);
								} else if (changing && (commitGranted || outcome.ok)) unknownOutcome("Incognito mutation has no confirmed commit receipt");
								if (settlement.kind !== "not-entered" && native.admission.settlement?.kind !== "completed") unknownOutcome("Incognito session native settlement is unknown");
							} finally {
								companion?.settle(companionOutcome);
							}
						}
						if (!outcome.ok) throw outcome.error;
						if (!changing) {
							withGrant(() => {
								authority.assertCurrent();
								assertActorCurrent();
								for (const facts of outcome.value.facts) authorizeSessionFacts(authority, "commit", facts);
								authority.assertCurrent();
								assertActorCurrent();
							});
							outcome.value.facts.forEach(install);
						}
						for (const key of targets) pending.delete(key);
						authority.assertCurrent();
						assertActorCurrent();
						return receive(outcome.value);
					} finally {
						for (const key of targets) pending.delete(key);
					}
				}, signal, (retained) => {
					let phase = "prepare";
					const admission = createSqliteWorkerOperationAdmission((request, grant) => withGrant(() => {
						authority.assertCurrent();
						assertActorCurrent();
						signal?.throwIfAborted();
						if (request.stage === "open" || !isRecord(request.facts) || !isDeepStrictEqual(request.facts.identity, identity)) throw new Error("Incognito session operation belongs to another actor");
						if (request.stage !== "prepare" || !changing && request.facts.sessions !== void 0) {
							if (changing ? !(phase === "prepare" && request.stage === "transaction" || phase === "transaction" && request.stage === "commit") : request.stage !== "prepare") throw new Error("Incognito session authority requested out of order");
							const received = request.facts.sessions;
							if (!Array.isArray(received) || received.some((facts) => !isRecord(facts) || !isDeepStrictEqual(facts.identity, identity) || typeof facts.sessionKey !== "string" || !Number.isSafeInteger(facts.revision))) throw new Error("Incognito session grant differs from its captured target");
							const facts = received;
							const keys = facts.map((entry) => entry.sessionKey);
							const lifecycleKeys = isIncognitoLifecycleCommand(captured) ? incognitoLifecycleKeys(captured, identity) : void 0;
							if (new Set(keys).size !== keys.length || lifecycleKeys && !isDeepStrictEqual(keys, lifecycleKeys) || "sessionKey" in captured.input && (keys.length !== 1 || keys[0] !== captured.input.sessionKey) || request.stage === "commit" && !isDeepStrictEqual(keys, [...targets])) throw new Error("Incognito session grant changed its target set");
							for (const entry of facts) {
								targets.add(entry.sessionKey);
								if (changing) pending.add(entry.sessionKey);
							}
							for (const entry of facts) authorizeSessionFacts(authority, request.stage === "prepare" ? "transaction" : request.stage, entry);
							if (request.stage === "commit") {
								postimage = facts;
								companion?.beforeCommit();
							}
							phase = request.stage;
						}
						authority.assertCurrent();
						assertActorCurrent();
						signal?.throwIfAborted();
						if (!grant()) throw new Error("Incognito session authority expired");
						commitGranted ||= request.stage === "commit";
					}));
					native = {
						retained,
						admission
					};
					return {
						nativeLocations: [],
						admission
					};
				}, cleanup);
			};
			return {
				withCompute: (authority, target, operation, signal) => {
					const held = claim(target.sessionKey, assertBorrowed);
					return retain(withIncognitoCompute({
						target,
						assertCurrent() {
							authority.assertCurrent();
							held.assertCurrent();
						},
						disclose: () => held.authorize(authority, "commit"),
						operation,
						execute: (command, requestSignal) => perform(authority, command, isIncognitoComputeWrite(command.type), (result) => result.value, signal && requestSignal ? AbortSignal.any([signal, requestSignal]) : requestSignal ?? signal),
						cleanup: (command) => perform({ assertCurrent: assertActorCurrent }, command, isIncognitoComputeWrite(command.type), (result) => result.value, void 0, void 0, true)
					}));
				},
				read: (authority, input, signal) => {
					const sessionKey = input.sessionKey;
					return perform(authority, {
						type: "session.entry.read",
						input
					}, false, (value) => ({
						entry: value.entry,
						claim: claim(sessionKey, assertBorrowed)
					}), signal);
				},
				create: (authority, input, signal) => {
					const sessionKey = input.sessionKey;
					return perform(authority, {
						type: "session.entry.create",
						input
					}, true, (value) => ({
						entry: value.entry,
						claim: claim(sessionKey, assertBorrowed)
					}), signal);
				},
				sideData: (authority, command, signal) => perform(authority, command, isIncognitoSideDataWrite(command.type), (result) => result.value, signal),
				history: (authority, command, signal) => perform(authority, command, false, (result) => result.value, signal),
				transcript: (authority, command, signal) => perform(authority, command, isIncognitoTranscriptWrite(command.type), (result) => result.value, signal),
				outbox: (authority, command, signal) => perform(authority, command, true, (result) => result.value, signal),
				lifecycle: (authority, command, signal, captureLifecycle) => {
					assertBorrowed();
					authority.assertCurrent();
					const captured = structuredClone(command);
					const input = captured.input;
					const removedEntries = "target" in input ? [input.target] : "plan" in input ? input.plan.entries.flatMap(({ sessionKey, expectedEntry }) => expectedEntry ? [{
						sessionKey,
						entry: expectedEntry
					}] : []) : void 0;
					if (removedEntries && !captureLifecycle) throw new Error("Incognito deletion requires its prepared lifecycle owner");
					return perform(authority, captured, isIncognitoLifecycleWrite(command.type), (result) => result.value, signal, removedEntries ? captureLifecycle?.(removedEntries) : void 0);
				},
				captureCurrent(sessionKey) {
					assertBorrowed();
					return claim(sessionKey, assertBorrowed);
				},
				readSharing(sessionKey) {
					assertBorrowed();
					return structuredClone(current(sessionKey)?.sharing);
				},
				deadlines() {
					assertBorrowed();
					return [...entries].flatMap(([sessionKey, facts]) => {
						const entry = facts.sharing?.entry;
						return entry && facts.expiresAt !== void 0 ? [{
							sessionKey,
							sessionId: entry.sessionId,
							expiresAt: facts.expiresAt,
							source: {
								identity: identity.incarnation,
								assertCurrent() {
									assertActorCurrent();
									if (entries.get(sessionKey)?.sharing?.entry?.sessionId !== entry.sessionId) throw new Error("Incognito deadline no longer owns this session");
								}
							}
						}] : [];
					});
				}
			};
		}
	};
}
//#endregion
//#region src/config/sessions/session-incognito-lifecycle.ts
/** Source preparation settles before reserving the destination actor, including cross-agent forks. */
async function forkIncognitoSessionFromParent(params) {
	const { source, destination, sourceAuthority, destinationAuthority, signal } = params;
	source.assertCurrent();
	destination.assertCurrent();
	sourceAuthority.assertCurrent();
	destinationAuthority.assertCurrent();
	const parent = structuredClone(params.parent);
	const childSessionKey = params.childSessionKey;
	const sourceClaim = source.sessions.captureCurrent(parent.sessionKey);
	const sameActor = source.identity.handle === destination.identity.handle && source.identity.incarnation === destination.identity.incarnation;
	const prepared = await source.sessions.lifecycle(sourceAuthority, {
		type: "session.lifecycle.fork.prepare",
		input: {
			parent,
			forkFrom: params.forkFrom
		}
	}, signal);
	sourceClaim.assertCurrent();
	destination.assertCurrent();
	if (!prepared) return;
	const child = await destination.sessions.read(destinationAuthority, { sessionKey: childSessionKey }, signal);
	sourceClaim.assertCurrent();
	const entry = await params.buildEntry(structuredClone(parent.entry), structuredClone(child.entry));
	const cliSessionBindings = forkCliSessionBindings(parent.entry, params.supportsCliSessionFork);
	sourceClaim.assertCurrent();
	child.claim.assertCurrent();
	return destination.sessions.lifecycle({
		assertCurrent() {
			source.assertCurrent();
			destination.assertCurrent();
			sourceAuthority.assertCurrent();
			destinationAuthority.assertCurrent();
			if (!sameActor) sourceClaim.assertCurrent();
		},
		authorize(stage, facts) {
			if (!sameActor) sourceClaim.authorize(sourceAuthority, stage);
			if (sameActor && facts.sessionKey === parent.sessionKey) return sourceAuthority.authorize?.(stage, facts);
			return destinationAuthority.authorize?.(stage, facts);
		}
	}, {
		type: "session.lifecycle.fork",
		input: {
			parent: prepared,
			child: {
				sessionKey: childSessionKey,
				entry,
				expectedEntry: child.entry
			},
			cliSessionBindings
		}
	}, signal);
}
//#endregion
//#region src/state/openclaw-agent-execution-contract.ts
var IncognitoSessionEndedError = class extends Error {
	constructor(options) {
		super("Incognito session ended. Create a new incognito session to continue.", options);
		this.code = "INCOGNITO_SESSION_ENDED";
		this.name = "IncognitoSessionEndedError";
	}
};
//#endregion
//#region src/state/openclaw-agent-execution-incognito.ts
/** Lifetime implementation for the existing executor's namespace map, never a second registry. */
function createIncognitoAgentExecutionOwner(options, authority, lifecycle, signal) {
	const context = captureOpenClawStateReadWorkerContext({ env: options.env });
	const assertAgent = captureAgentDatabaseAdmission(options.agentId, { env: context.environment });
	const identity = Object.freeze({
		kind: "ephemeral",
		handle: randomUUID(),
		incarnation: randomUUID()
	});
	const input = {
		kind: "ephemeral",
		identity,
		agentId: options.agentId,
		databasePath: options.path,
		environment: context.environment
	};
	let state = "opening";
	let published = false;
	let pendingBorrows = 0;
	let loss;
	let store;
	let opening;
	let openingFailed = false;
	let closing;
	let nativeStopped;
	let unregisterShared;
	const pending = /* @__PURE__ */ new Set();
	const assertCurrent = () => {
		if (loss || state === "closed" || state === "closing") throw loss ?? new IncognitoSessionEndedError();
		lifecycle.assertOwned();
		context.admission.assertCurrent();
		assertAgent();
		if (cache.databases.has(options.path) || cache.pending.has(options.path)) throw new Error("Incognito namespace already belongs to the native owner");
		if (store && !isSqliteWorkerStoreAvailable(store)) throw new IncognitoSessionEndedError();
	};
	let granting = false;
	const withGrant = (operation) => {
		granting = true;
		try {
			return operation();
		} finally {
			granting = false;
		}
	};
	const sessionFacts = createIncognitoSessionFacts(identity, assertCurrent, withGrant);
	const admission = (source) => () => ({
		nativeLocations: [],
		admission: createSqliteWorkerOperationAdmission((request, grant) => withGrant(() => {
			source.assertCurrent();
			assertCurrent();
			const expected = request.stage === "open" ? input : { identity };
			if (!isDeepStrictEqual(request.facts, expected) || request.stage !== "open" && request.stage !== "prepare") throw new Error("Incognito operation differs from its admitted actor");
			if (!grant()) throw new Error("Incognito actor admission was refused");
		}))
	});
	const track = (work, collection = pending) => {
		collection.add(work);
		work.finally(() => collection.delete(work)).catch(() => void 0);
		return work;
	};
	const open = () => {
		opening ??= Promise.resolve().then(async () => {
			authority.assertCurrent();
			assertCurrent();
			signal?.throwIfAborted();
			assertIncognitoAgentDatabasePathAvailable(options.path);
			const opened = await openEphemeralAgentDatabaseSqliteWorkerStore({
				moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.agentDatabaseExecution),
				databasePath: options.path,
				target: identity,
				input
			}, {
				assertCurrent() {
					authority.assertCurrent();
					assertCurrent();
					signal?.throwIfAborted();
				},
				createAdmission: admission(authority),
				signal,
				onNativeLost(error) {
					loss ??= new IncognitoSessionEndedError({ cause: error });
					state = "lost";
					sessionFacts.clear();
				},
				onNativeStopped(stopped) {
					nativeStopped = stopped;
				}
			});
			if (!opened) throw new Error("Incognito actor was not created");
			store = opened;
			authority.assertCurrent();
			assertCurrent();
			signal?.throwIfAborted();
			return opened;
		}).catch((error) => {
			openingFailed = true;
			throw error;
		});
		return opening;
	};
	const owner = {
		kind: "ephemeral",
		agentId: options.agentId,
		identity,
		assertCurrent,
		get state() {
			return state;
		},
		canRetryOpening() {
			if (!openingFailed || state !== "closed") return false;
			let sourceRefused = signal?.aborted === true;
			if (!sourceRefused) try {
				authority.assertCurrent();
			} catch {
				sourceRefused = true;
			}
			if (!sourceRefused) return false;
			context.admission.assertCurrent();
			assertAgent();
			return true;
		},
		async borrow(source, borrowSignal) {
			pendingBorrows += 1;
			let opened;
			try {
				source.assertCurrent();
				borrowSignal?.throwIfAborted();
				opened = await open();
				source.assertCurrent();
				assertCurrent();
				borrowSignal?.throwIfAborted();
			} catch (error) {
				pendingBorrows -= 1;
				if (!published && (openingFailed || pendingBorrows === 0)) try {
					await owner.close();
				} catch (cleanupError) {
					throw createSqliteLifecycleAggregateError([error, cleanupError], "Incognito admission and cleanup failed", error);
				}
				throw error;
			}
			pendingBorrows -= 1;
			published = true;
			state = "live";
			let released = false;
			let releasing;
			const borrowedWork = /* @__PURE__ */ new Set();
			const assertBorrowed = () => {
				assertCurrent();
				if (released) throw new Error("Incognito execution reference is released");
			};
			const run = (currentAuthority, operation, operationSignal, createAdmission, cleanup = false) => {
				if (granting) throw new Error("Incognito authority callbacks cannot call their actor");
				currentAuthority.assertCurrent();
				if (cleanup) assertCurrent();
				else assertBorrowed();
				const assertOperation = () => {
					currentAuthority.assertCurrent();
					assertCurrent();
					operationSignal?.throwIfAborted();
				};
				const work = runOpenClawAgentWorkerWrite({
					target: identity,
					assertCurrent: assertOperation
				}, async () => {
					try {
						const result = await runSqliteWorkerStoreOperation(opened, (scope) => {
							return operation({ execute: (command, requestOptions) => scope.execute(command, { signal: requestOptions?.signal && operationSignal ? AbortSignal.any([requestOptions.signal, operationSignal]) : requestOptions?.signal ?? operationSignal }) });
						}, void 0, assertOperation, createAdmission ?? admission(currentAuthority));
						assertOperation();
						return result;
					} catch (error) {
						if (loss || !isSqliteWorkerStoreAvailable(opened)) {
							await nativeStopped;
							throw loss ?? new IncognitoSessionEndedError({ cause: error });
						}
						throw error;
					}
				}, void 0, operationSignal);
				return track(track(work), borrowedWork);
			};
			return {
				agentId: options.agentId,
				path: options.path,
				identity,
				sessions: sessionFacts.bind(run, assertBorrowed, (work) => track(track(work), borrowedWork)),
				assertCurrent: assertBorrowed,
				run: (currentAuthority, operation, operationSignal) => run(currentAuthority, operation, operationSignal),
				release() {
					released = true;
					releasing ??= Promise.allSettled(borrowedWork).then(() => void 0);
					return releasing;
				},
				close: () => owner.close()
			};
		},
		close() {
			if (state === "closed") return Promise.resolve();
			if (!loss) state = "closing";
			sessionFacts.clear();
			closing ??= (async () => {
				await Promise.allSettled(pending);
				await opening?.catch(() => void 0);
				await store?.close();
				await nativeStopped;
				state = "closed";
				unregister();
				unregisterShared?.();
				lifecycle.retired();
			})().catch((error) => {
				closing = void 0;
				throw error;
			});
			return closing;
		}
	};
	const unregister = registerOpenClawAgentDatabaseAsyncResource({
		agentId: options.agentId,
		path: options.path,
		revoke() {
			if (!loss) state = "closing";
			sessionFacts.clear();
		},
		close: () => owner.close()
	});
	try {
		unregisterShared = registerOpenClawStateDatabaseAsyncResource({ close: async (sharedIdentity) => {
			if (!sharedIdentity || sharedIdentity.key === context.admission.identity.key) await owner.close();
		} });
	} catch (error) {
		unregister();
		throw error;
	}
	return owner;
}
/** Bind ephemeral lifetime to the canonical execution owner map, without a parallel registry. */
function createAgentDatabaseExecutionCapture(executions, captureFile) {
	/** Inactive actor entry point. Production incognito routing stays native until P7. */
	async function openIncognitoAgentDatabaseExecution(options, authority, request = {}) {
		authority.assertCurrent();
		const { existingOnly, signal } = request;
		signal?.throwIfAborted();
		const capturedOptions = {
			...options,
			env: {
				...options.env ?? process.env,
				OPENCLAW_STATE_DIR: resolveStateDir(options.env ?? process.env)
			}
		};
		const agentId = normalizeAgentId(capturedOptions.agentId);
		const pathname = resolveIncognitoOpenClawAgentSqlitePath({
			...capturedOptions,
			agentId
		});
		let owner = executions.get(pathname);
		if (owner && owner.kind !== "ephemeral") throw new Error("Incognito namespace belongs to a file execution owner");
		if (existingOnly && (!owner || owner.state === "opening")) return;
		if (owner && (owner.state === "lost" || owner.state === "closed") && !existingOnly) {
			await owner.close();
			authority.assertCurrent();
			signal?.throwIfAborted();
			return openIncognitoAgentDatabaseExecution(capturedOptions, authority, {
				existingOnly,
				signal
			});
		}
		const joinedOpening = owner?.state === "opening";
		if (!owner) {
			const created = createIncognitoAgentExecutionOwner({
				...capturedOptions,
				agentId,
				path: pathname
			}, authority, {
				assertOwned() {
					if (executions.get(pathname) !== created) throw new Error("Incognito execution no longer owns its namespace");
				},
				retired() {
					if (executions.get(pathname) === created) executions.delete(pathname);
				}
			}, signal);
			executions.set(pathname, created);
			owner = created;
		}
		try {
			return await owner.borrow(authority, signal);
		} catch (error) {
			if (!joinedOpening) throw error;
			authority.assertCurrent();
			signal?.throwIfAborted();
			if (!owner.canRetryOpening()) throw error;
			return openIncognitoAgentDatabaseExecution(capturedOptions, authority, request);
		}
	}
	function capture(target, constraints) {
		if (target.kind === "ephemeral") return openIncognitoAgentDatabaseExecution({
			agentId: target.agentId,
			env: target.env
		}, target.authority, {
			existingOnly: target.existingOnly,
			signal: target.signal
		});
		return captureFile(target, constraints);
	}
	return Object.assign(capture, {
		forkIncognitoSessionFromParent,
		/** Inactive topology view; production discovery continues to use the native owner. */
		listIncognito(env = process.env) {
			const capturedEnv = {
				...env,
				OPENCLAW_STATE_DIR: resolveStateDir(env)
			};
			return [...executions.entries()].flatMap(([pathname, owner]) => {
				if (owner.kind !== "ephemeral" || owner.state !== "live" || pathname !== resolveIncognitoOpenClawAgentSqlitePath({
					agentId: owner.agentId,
					env: capturedEnv
				})) return [];
				owner.assertCurrent();
				return [{
					agentId: owner.agentId,
					storePath: pathname,
					identity: owner.identity,
					assertCurrent: owner.assertCurrent
				}];
			});
		}
	});
}
//#endregion
//#region src/state/openclaw-agent-execution-native.ts
function supportsAgentDatabaseExecutionScope(options) {
	return getOpenClawDatabaseMaintenanceScope()?.ownsSchemaMaintenance !== true && !hasAgentDatabaseMaintenanceAuthority() && !getAgentDeletionDatabaseCleanup(options);
}
/** These native-only scopes still need their complete owning caller cutover. */
function supportsOpenClawAgentDatabaseExecution(options) {
	return !isIncognitoOpenClawAgentSqlitePath(resolveOpenClawAgentSqlitePath(options), options) && supportsAgentDatabaseExecutionScope(options);
}
async function settleAgentRegistration(registration, operation) {
	let result;
	try {
		result = {
			ok: true,
			value: await operation()
		};
	} catch (error) {
		result = {
			ok: false,
			error
		};
	}
	try {
		registration.finish(await registration.nativeSettlement);
	} catch (error) {
		if (!result.ok) throw createSqliteLifecycleAggregateError([result.error, error], "Agent open and registration publication failed", result.error);
		throw error;
	}
	if (!result.ok) throw result.error;
	return result.value;
}
/** Bind a native claim to the same borrower and logical generation that captured it. */
function captureBorrowedAgentDatabaseGenerationClaim(assertBorrowed, readGeneration) {
	assertBorrowed();
	const captured = readGeneration();
	if (!captured) throw new Error("Agent database execution has no admitted generation");
	const claim = captured.captureClaim();
	return {
		identity: claim.identity,
		incarnation: claim.incarnation,
		assertCurrent() {
			assertBorrowed();
			if (readGeneration() !== captured) throw new Error("Agent database execution generation was replaced");
			claim.assertCurrent();
		}
	};
}
/** A logical execution owner can replace this generation only after its native close settles. */
function createAgentDatabaseNativeGeneration(agentId, pathname, context, assertLogicalCurrent, assertCleanupOwned, expectedIdentity, acceptFileIdentity, creatingIdentity) {
	const input = {
		leaseId: randomUUID(),
		agentId,
		databasePath: pathname,
		stateDatabasePath: context.admission.databasePath,
		environment: context.environment,
		...expectedIdentity ? { expectedIdentity } : {},
		...creatingIdentity ? { creatingIdentity } : {}
	};
	let retiring = false;
	let opening;
	let openedStore;
	let openingFailure;
	let openingAdmission;
	let closing;
	let nativeIdentity;
	let nativeStopped;
	let readCloseReceipt;
	let lease;
	let quickCheckPending = false;
	let preparationPublished = false;
	let receiveValidation;
	const assertCurrent = () => {
		assertLogicalCurrent();
		if (retiring) throw new Error("Agent native generation is retiring");
		if (openedStore && !isSqliteWorkerStoreAvailable(openedStore)) throw new Error("Agent database execution lost its native owner");
	};
	const admission = (source, registration, assertCallerCurrent) => (operation) => {
		if (registration) registration.nativeSettlement = operation.settled;
		const assertPreparationJournal = captureAgentDatabasePreparationJournal(agentId, { env: context.environment });
		const nativeLocations = [
			pathname,
			...nativeIdentity ? [nativeIdentity.nativeLocation] : [],
			context.admission.databasePath,
			context.admission.identity.canonicalPath
		];
		const assertSourceCurrent = (identity) => {
			source.assertCurrent();
			assertCurrent();
			assertCallerCurrent?.(identity);
			if (identity) assertExistingDatabaseIdentity(pathname, `file:${identity.physicalIdentity}`, identity.birthtime);
		};
		const observeNative = (request) => {
			const facts = request.facts;
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "agent-registration-committed") {
				const received = facts.registration;
				if (!registration || !lease || !isRecord(received) || received.agentId !== input.agentId || received.agentPath !== pathname || received.stateDatabasePath !== lease.sharedStatePath || received.stateDatabaseIdentity !== lease.sharedStateIdentity) throw new Error("Agent registration commit differs from its admitted native owner");
				registration.recordCommitted({
					agentId: input.agentId,
					agentPath: pathname,
					stateDatabasePath: lease.sharedStatePath,
					stateDatabaseIdentity: lease.sharedStateIdentity
				});
			}
		};
		const authorizeNative = (request) => {
			const facts = request.facts;
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "agent-registration-committed") return;
			assertCurrent();
			if (!nativeIdentity || creatingIdentity) assertCallerCurrent?.();
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "agent-registration-start") {
				assertSourceCurrent();
				if (!registration || !lease || !isDeepStrictEqual(facts.lease, lease)) throw new Error("Agent registration start differs from its admitted native owner");
				registration.begin();
				return;
			}
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "shared-owner") {
				if (!(facts.validationPort instanceof MessagePort)) throw new Error("Agent worker lost its validation handoff port");
				try {
					assertSourceCurrent();
					publishOpenClawStateDatabaseWorkerAdmission(context.admission);
					const received = facts.lease;
					if (!isDeepStrictEqual(facts.identity, context.admission.identity) || !isRecord(received) || received.leaseId !== input.leaseId || received.agentId !== input.agentId || received.path !== pathname || received.ownerPid !== process.pid || received.ownerStartTime !== null && typeof received.ownerStartTime !== "number" || received.sharedStatePath !== context.admission.databasePath || received.sharedStateIdentity !== context.admission.identity.key) throw new Error("Agent worker lease differs from its captured native owner");
					lease = {
						leaseId: input.leaseId,
						agentId: input.agentId,
						path: pathname,
						ownerPid: process.pid,
						ownerStartTime: received.ownerStartTime,
						sharedStatePath: context.admission.databasePath,
						sharedStateIdentity: context.admission.identity.key
					};
					receiveValidation = captureOpenClawAgentDatabaseValidationTransfer({
						agentId,
						path: pathname
					});
					facts.validationPort.postMessage(getOpenClawAgentDatabaseValidationForTransfer({
						agentId,
						path: pathname
					}), []);
				} finally {
					facts.validationPort.close();
				}
				return;
			}
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "agent-integrity-cached") {
				assertSourceCurrent();
				if (!lease || !isDeepStrictEqual(facts.lease, lease)) throw new Error("Agent integrity notice differs from its captured native lease");
				quickCheckPending = true;
				return;
			}
			if (request.stage === "prepare" && isRecord(facts) && facts.kind === "agent-open-resume") {
				assertSourceCurrent();
				if (!lease || !isDeepStrictEqual(facts.lease, lease)) throw new Error("Agent open resume differs from its captured native lease");
				return;
			}
			if (request.stage === "open") {
				if (!isDeepStrictEqual(facts, input)) throw new Error("Agent database open differs from its captured owner");
			} else {
				const received = isRecord(facts) ? facts.identity : void 0;
				if (!isRecord(received) || received.kind !== "file" || typeof received.physicalIdentity !== "string" || typeof received.birthtime !== "string" || typeof received.incarnation !== "string" || typeof received.nativeLocation !== "string" || nativeIdentity && !isDeepStrictEqual(received, nativeIdentity)) throw new Error("Agent database operation belongs to another native owner");
				const receivedIdentity = nativeIdentity ?? Object.freeze({
					kind: "file",
					physicalIdentity: received.physicalIdentity,
					birthtime: received.birthtime,
					incarnation: received.incarnation,
					nativeLocation: received.nativeLocation
				});
				if (expectedIdentity && (receivedIdentity.physicalIdentity !== expectedIdentity.physicalIdentity || expectedIdentity.birthtime !== void 0 && receivedIdentity.birthtime !== expectedIdentity.birthtime)) throw new Error("Agent database operation differs from its expected physical file");
				if (!nativeIdentity) assertExistingDatabaseIdentity(pathname, `file:${receivedIdentity.physicalIdentity}`, receivedIdentity.birthtime);
				acceptFileIdentity({
					kind: "file",
					physicalIdentity: receivedIdentity.physicalIdentity,
					birthtime: receivedIdentity.birthtime,
					nativeLocation: receivedIdentity.nativeLocation
				});
				assertPreparationJournal?.(isRecord(facts) ? facts.agentDeletionJournalPresent : void 0);
				nativeIdentity ??= receivedIdentity;
				return nativeIdentity;
			}
		};
		const captured = source.createAdmission({
			attachment: {
				kind: "agent-execution",
				startupJournal: assertPreparationJournal !== void 0
			},
			nativeLocations,
			assertCurrent,
			authorize(request) {
				const identity = authorizeNative(request);
				if (request.stage === "open" && registration) {
					assertSourceCurrent();
					if (creatingIdentity ? creatingIdentity.key.startsWith("path:") : !nativeIdentity && !expectedIdentity && readDatabasePathIdentitySync(pathname).key.startsWith("path:")) registration.begin();
				}
				if (request.stage === "prepare" && identity && receiveValidation && isRecord(request.facts)) {
					assertSourceCurrent(identity);
					receiveValidation(identity.physicalIdentity, request.facts.validation);
					receiveValidation = void 0;
				}
				assertSourceCurrent(identity);
			}
		})(operation);
		captured.admission.observeRequests(observeNative);
		return captured;
	};
	const open = (source, assertCallerCurrent, createIfMissing = false, signal) => {
		assertCurrent();
		source.assertCurrent();
		assertCallerCurrent?.();
		opening ??= (async () => {
			const registration = createIfMissing ? captureOpenClawAgentDatabaseRegistration({
				agentId,
				agentPath: pathname,
				admission: context.admission,
				assertPublicationCurrent: context.assertPublicationCurrent,
				onRegistryChange: source.onRegistryChange
			}) : void 0;
			const openStore = async () => {
				const assertOpening = () => {
					assertCurrent();
					source.assertCurrent();
					assertCallerCurrent?.();
					signal?.throwIfAborted();
				};
				const createAdmission = admission(source, registration, assertCallerCurrent);
				const store = await openAgentDatabaseSqliteWorkerStore({
					moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.agentDatabaseExecution),
					databasePath: pathname,
					input,
					existingOnly: !createIfMissing
				}, {
					stateContext: context,
					stateDatabasePath: context.admission.databasePath,
					assertCurrent: assertOpening,
					signal,
					createAdmission: (operation) => {
						const captured = createAdmission(operation);
						openingAdmission = {
							admission: captured.admission,
							settled: operation.settled
						};
						return captured;
					},
					onNativeStopped: (stopped, readReceipt) => {
						nativeStopped = stopped;
						readCloseReceipt = readReceipt;
					}
				});
				openedStore = store;
				return store;
			};
			const store = registration ? await settleAgentRegistration(registration, openStore) : await openStore();
			if (!store) return;
			try {
				assertCurrent();
				if (nativeIdentity) preparationPublished = true;
				return store;
			} catch (error) {
				try {
					await store.close();
				} catch (cleanupError) {
					throw new AggregateError([error, cleanupError], "Agent open and cleanup failed", { cause: cleanupError });
				}
				throw error;
			}
		})().catch(async (error) => {
			openingFailure = "native";
			if (openingAdmission) {
				const { admission: captured, settled } = openingAdmission;
				const outcome = await settled;
				if (captured.failure !== void 0 && captured.failureSource !== "protocol" && error === captured.failure && outcome.kind !== "unknown" && !captured.committed && captured.cleanupFailures.length === 0) openingFailure = "open-refused";
			}
			throw error;
		}).finally(() => {
			openingAdmission = void 0;
		});
		const attempt = opening;
		return attempt.then((store) => {
			if (!store && opening === attempt) opening = void 0;
			if (!store && createIfMissing) return open(source, assertCallerCurrent, true, signal);
			return store;
		});
	};
	async function run(source, operation, assertCallerCurrent, createIfMissing = false, signal) {
		const assertOperationCurrent = () => {
			assertCurrent();
			source.assertCurrent();
			assertCallerCurrent?.();
			signal?.throwIfAborted();
		};
		const store = openedStore ?? await open(source, assertCallerCurrent, createIfMissing, signal);
		assertOperationCurrent();
		if (!store) return;
		if (!nativeIdentity) {
			const registration = captureOpenClawAgentDatabaseRegistration({
				agentId,
				agentPath: pathname,
				admission: context.admission,
				assertPublicationCurrent: context.assertPublicationCurrent,
				onRegistryChange: source.onRegistryChange
			});
			await settleAgentRegistration(registration, async () => {
				const createAdmission = admission(source, registration, assertCallerCurrent);
				await runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
					type: "database.prepareWrite",
					input: void 0
				}, { signal }), void 0, assertOperationCurrent, createAdmission);
				assertCurrent();
				source.assertCurrent();
			});
			preparationPublished = true;
		}
		if (quickCheckPending) {
			quickCheckPending = false;
			requestOpenClawAgentDatabaseQuickCheck({
				path: pathname,
				env: input.environment
			});
		}
		return runSqliteWorkerStoreOperation(store, operation, void 0, assertOperationCurrent, admission(source, void 0, assertCallerCurrent));
	}
	const readConfirmedClose = () => {
		const receipt = readCloseReceipt?.();
		if (!receipt || !nativeIdentity || !lease || receipt.incarnation !== nativeIdentity.incarnation || receipt.identity.key !== `file:${nativeIdentity.physicalIdentity}` || receipt.identity.canonicalPath !== nativeIdentity.nativeLocation) return;
		return {
			receipt,
			identity: nativeIdentity,
			lease
		};
	};
	const publishCloseCheckpoint = () => {
		const closed = readConfirmedClose();
		if (!closed) return;
		const { receipt, identity, lease: closedLease } = closed;
		try {
			assertCleanupOwned();
			assertExistingDatabaseIdentity(pathname, receipt.identity.key);
			assertExistingDatabaseIdentity(identity.nativeLocation, receipt.identity.key);
			assertExistingDatabaseIdentity(closedLease.sharedStatePath, closedLease.sharedStateIdentity);
			publishSqliteWalCheckpointObservation(pathname, receipt.checkpoint);
		} catch {}
	};
	return {
		failure: () => openingFailure ?? (openedStore && !isSqliteWorkerStoreAvailable(openedStore) ? "native" : void 0),
		isPrepared() {
			assertCurrent();
			return preparationPublished;
		},
		captureClaim() {
			assertCurrent();
			const captured = nativeIdentity;
			if (!captured) throw new Error("Agent database generation has not been admitted");
			return {
				identity: captured.physicalIdentity,
				incarnation: captured.incarnation,
				assertCurrent() {
					assertCurrent();
					if (nativeIdentity !== captured) throw new Error("Agent database generation changed");
				}
			};
		},
		run,
		close() {
			retiring = true;
			closing ??= (async () => {
				const errors = [];
				let storeClosed = false;
				if (opening) try {
					await opening.then(async (store) => {
						await store?.close();
						storeClosed = store !== void 0;
					}, () => openedStore ? openedStore.close() : closeUnclaimedSharedStateSqliteWorkers(pathname));
				} catch (error) {
					errors.push(error);
				}
				if (nativeStopped && lease) try {
					await nativeStopped;
					assertCleanupOwned();
					if (storeClosed && readConfirmedClose()) assertExistingDatabaseIdentity(lease.sharedStatePath, lease.sharedStateIdentity);
					else await cleanupRetiredAgentDatabaseLease({
						context,
						stopped: nativeStopped,
						assertOwned: assertCleanupOwned,
						lease
					});
				} catch (error) {
					errors.push(error);
				}
				throwSqliteLifecycleErrors(errors, "Agent native close and lease cleanup failed");
				publishCloseCheckpoint();
			})().catch((error) => {
				closing = void 0;
				throw error;
			});
			return closing;
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-execution.ts
const log = createSubsystemLogger("state/agent-db");
const executionState = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseExecutionOwners"), () => ({ owners: /* @__PURE__ */ new Map() }));
const executions = executionState.owners;
const runInExecutionOwnerContext = AsyncLocalStorage.snapshot();
/** File captures stay synchronous; explicit ephemeral targets await their pinned actor. */
const captureOpenClawAgentDatabaseExecution = createAgentDatabaseExecutionCapture(executions, captureFileAgentDatabaseExecution);
/** Borrow before callers yield; native opening stays lazy and release joins owned work. */
function captureFileAgentDatabaseExecution(options, constraints = {}) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath(options);
	if (!supportsOpenClawAgentDatabaseExecution(options)) throw new Error("This agent database scope still requires its existing native owner");
	let existing = executions.get(pathname);
	const expectedCreationIdentity = constraints.expectedCreationIdentity ? Object.freeze({ ...constraints.expectedCreationIdentity }) : void 0;
	if (!existing || expectedCreationIdentity) {
		const identity = readDatabasePathIdentitySync(pathname);
		existing ??= executions.get(identity.canonicalPath);
		if (expectedCreationIdentity) {
			const capturesAbsence = expectedCreationIdentity.key.startsWith("path:");
			const observed = capturesAbsence && existing?.kind === "file" ? existing.creationIdentity : identity;
			if (constraints.expectedIdentity || capturesAbsence && (cache.databases.has(pathname) || cache.pending.has(pathname)) || !capturesAbsence && (!expectedCreationIdentity.key.startsWith("file:") || typeof expectedCreationIdentity.birthtime !== "string") || observed?.key !== expectedCreationIdentity.key || observed.canonicalPath !== expectedCreationIdentity.canonicalPath || observed.birthtime !== expectedCreationIdentity.birthtime) throw new Error("Agent creation no longer owns its originally observed target");
		}
		if (!existing) return createAgentDatabaseExecution(options, {
			agentId,
			pathname,
			identity,
			initialIdentity: constraints.expectedIdentity,
			expectedCreationIdentity,
			requestedPath: constraints.requestedPath
		});
	}
	if (existing.kind !== "file") throw new Error("Agent namespace belongs to an incognito execution owner");
	if (existing.agentId !== agentId) throw new Error(`OpenClaw agent database ${pathname} is already open for agent ${existing.agentId}; requested agent ${agentId}.`);
	const env = process.platform === "win32" ? cloneEnvWithPlatformSemantics(options.env ?? process.env) : options.env;
	const state = captureOpenClawStateReadContext(resolveOpenClawStateSqlitePath(env));
	if (existing.sharedDatabaseKey !== state.admission.identity.key) throw new Error("Agent database execution belongs to another shared-state database; drain its existing resources before changing the state directory.");
	return existing.borrow(pathname, constraints.expectedIdentity, expectedCreationIdentity, constraints.requestedPath);
}
function createAgentDatabaseExecution(options, prepared) {
	const { agentId, pathname, identity, initialIdentity, expectedCreationIdentity } = prepared;
	const context = captureOpenClawStateWorkerContext({ env: options.env });
	const executionOptions = {
		agentId,
		path: pathname,
		env: context.environment
	};
	const aliases = /* @__PURE__ */ new Map();
	const assertAgentAdmitted = captureAgentDatabaseAdmission(agentId, { env: context.environment });
	let retired = false;
	let revoked = false;
	let borrowers = 0;
	let creationIdentity = expectedCreationIdentity;
	let creationBorrowers = 0;
	let generation;
	let fileIdentity;
	let nativeClosing;
	let cleanupFailure;
	let closing;
	let unregisterShared;
	let idleTimer;
	let idleDrainListener;
	const clearIdleTimer = () => {
		idleDrainListener?.[Symbol.dispose]();
		idleDrainListener = void 0;
		clearTimeout(idleTimer);
		idleTimer = void 0;
	};
	const reportCleanupFailure = (error) => {
		try {
			log.warn(`Agent database idle cleanup failed: ${formatErrorMessage(error)}`);
		} catch {}
	};
	const finishRetirement = () => {
		retired = true;
		if (executions.get(pathname) !== owner) return;
		unregisterAgent();
		unregisterShared?.();
	};
	const assertCurrent = () => {
		if (retired || executions.get(pathname) !== owner || !supportsAgentDatabaseExecutionScope(executionOptions)) throw new Error("Agent database execution admission is closed");
		context.admission.assertCurrent();
		assertAgentAdmitted();
	};
	const closeNative = (expected) => {
		if (expected && generation !== expected) return Promise.resolve();
		clearIdleTimer();
		if (nativeClosing) return nativeClosing;
		const captured = generation;
		if (!captured) return Promise.resolve();
		const result = captured.close().then(() => {
			if (generation === captured) {
				generation = void 0;
				cleanupFailure = void 0;
				if (executionState.idle === owner) executionState.idle = void 0;
			}
		}, (error) => {
			cleanupFailure = { error };
			throw error;
		});
		nativeClosing = result;
		result.finally(() => {
			if (nativeClosing === result) nativeClosing = void 0;
		}).catch(() => void 0);
		return result;
	};
	async function run(source, operation, assertCallerCurrent, expectedIdentity, retireNativeOnFailure = false, createIfMissing = false, creatingTarget, signal, contentionDeadline) {
		const pending = cache.pending.get(pathname);
		if (pending) {
			if (creatingTarget && !fileIdentity) throw new Error("Agent creation cannot adopt another pending opener");
			if (pending.agentId !== agentId) throw new Error(`Agent database ${pathname} is opening for ${pending.agentId}`);
			await pending.promise;
			pending.controller.signal.throwIfAborted();
			assertCallerCurrent();
		}
		if (nativeClosing) {
			await nativeClosing;
			assertCallerCurrent();
		}
		if (cleanupFailure || generation?.failure()) {
			await closeNative();
			assertCurrent();
			source.assertCurrent();
			assertCallerCurrent();
			signal?.throwIfAborted();
		}
		if (!generation) {
			for (let idle = executionState.idle; idle && idle !== owner; idle = executionState.idle) {
				await idle.closeIdle();
				assertCurrent();
				source.assertCurrent();
				assertCallerCurrent();
			}
			if (!generation) {
				const created = createAgentDatabaseNativeGeneration(agentId, identity.canonicalPath, context, assertCurrent, () => {
					if (executions.get(pathname) !== owner || generation !== created || !nativeClosing) throw new Error("Agent cleanup no longer owns its original execution reference");
				}, expectedIdentity ?? fileIdentity, (received) => {
					if (fileIdentity && (fileIdentity.physicalIdentity !== received.physicalIdentity || fileIdentity.birthtime !== received.birthtime)) throw new Error("Agent database execution belongs to another physical file");
					fileIdentity ??= Object.freeze({ ...received });
				}, fileIdentity ? void 0 : creationIdentity ?? creatingTarget);
				generation = created;
			}
		}
		const current = generation;
		let entered = false;
		try {
			const result = await current.run(source, (scope) => {
				entered = true;
				return operation(scope);
			}, assertCallerCurrent, createIfMissing, signal);
			if (generation === current && current.failure()) try {
				await owner.close();
			} catch (error) {
				reportCleanupFailure(error);
			}
			return result;
		} catch (error) {
			const nativeFailure = current.failure();
			const contended = !entered && isSqliteLockError(error);
			if (generation === current && (nativeFailure || retireNativeOnFailure)) try {
				if (nativeFailure === "native" && !contended) await owner.close();
				else await closeNative(current);
			} catch (cleanupError) {
				throw retainSqliteWorkerErrorCode(new AggregateError([error, cleanupError], "Agent operation and cleanup failed", { cause: error }), error);
			}
			if (contended) {
				const deadline = contentionDeadline ?? performance.now() + 2e3;
				if (contentionDeadline === void 0) log.warn("Agent database execution admission delayed by SQLite lock contention; retrying before execution.");
				const remaining = deadline - performance.now();
				if (remaining > 0) {
					await sleepWithAbort(Math.min(25, remaining), signal);
					assertCurrent();
					source.assertCurrent();
					assertCallerCurrent();
					if (performance.now() >= deadline) throw error;
					return run(source, operation, assertCallerCurrent, expectedIdentity, retireNativeOnFailure, createIfMissing, creatingTarget, signal, deadline);
				}
			}
			throw error;
		}
	}
	const owner = {
		kind: "file",
		agentId,
		get sharedDatabaseKey() {
			return context.admission.identity.key;
		},
		get creationIdentity() {
			return creationIdentity;
		},
		borrow(borrowedPath, expected, creating, requestedPath) {
			const expectedIdentity = expected ? Object.freeze({ ...expected }) : void 0;
			const creatingTarget = creating ? Object.freeze({ ...creating }) : void 0;
			const assertReferenceCurrent = (nativeIdentity) => {
				assertCurrent();
				if (!fileIdentity || creatingTarget) {
					const current = readDatabasePathIdentitySync(borrowedPath);
					if (current.canonicalPath !== identity.canonicalPath || creatingTarget?.key.startsWith("file:") && (current.key !== creatingTarget.key || current.birthtime !== creatingTarget.birthtime)) throw new Error("Agent database borrower changed its originally observed target");
				}
				if (fileIdentity && expectedIdentity && (fileIdentity.physicalIdentity !== expectedIdentity.physicalIdentity || fileIdentity.birthtime !== void 0 && expectedIdentity.birthtime !== void 0 && fileIdentity.birthtime !== expectedIdentity.birthtime)) throw new Error("Agent database borrower belongs to another physical file");
				const file = fileIdentity ?? expectedIdentity;
				const birthtime = fileIdentity?.birthtime ?? expectedIdentity?.birthtime;
				if (file) {
					if (nativeIdentity && (nativeIdentity.physicalIdentity !== file.physicalIdentity || birthtime !== void 0 && nativeIdentity.birthtime !== birthtime)) throw new Error("Agent database borrower belongs to another physical file");
					if (!nativeIdentity || borrowedPath !== nativeIdentity.nativeLocation) assertExistingDatabaseIdentity(borrowedPath, `file:${file.physicalIdentity}`, birthtime);
				}
			};
			assertReferenceCurrent();
			if (creatingTarget && !creationIdentity && !fileIdentity && generation) throw new Error("Agent creation cannot capture another pending native opener");
			retainAlias(borrowedPath);
			if (requestedPath !== void 0) retainAlias(path.resolve(requestedPath));
			observeOpenClawDatabaseMaintenanceResource(aliases.get(pathname));
			borrowers += 1;
			clearIdleTimer();
			if (executionState.idle === owner && !nativeClosing && !cleanupFailure) executionState.idle = void 0;
			if (creatingTarget) {
				creationIdentity ??= creatingTarget;
				creationBorrowers += 1;
			}
			const assertCreationReference = (create) => {
				if (creatingTarget && !fileIdentity && !create) throw new Error("Originally observed agent target requires creating admission first");
				if (creationBorrowers && !fileIdentity && (!create || !creatingTarget)) throw new Error("Originally observed agent target requires its captured creating reference");
			};
			let released = false;
			let release;
			const pending = /* @__PURE__ */ new Set();
			const assertBorrowed = () => {
				if (released) throw new Error("Agent database execution reference is released");
				assertReferenceCurrent();
			};
			const captureGenerationClaim = () => captureBorrowedAgentDatabaseGenerationClaim(assertBorrowed, () => generation);
			return {
				agentId,
				path: borrowedPath,
				get fileIdentity() {
					assertBorrowed();
					return fileIdentity;
				},
				assertCurrent: assertBorrowed,
				captureGenerationClaim,
				capturePreparedGenerationClaim() {
					assertBorrowed();
					if (cache.pending.has(pathname) || nativeClosing || cleanupFailure || generation?.failure() || !generation?.isPrepared()) return;
					return captureGenerationClaim();
				},
				async prepare(source, signal) {
					assertBorrowed();
					assertCreationReference(true);
					const result = run(source, async () => void 0, (nativeIdentity) => {
						assertReferenceCurrent(nativeIdentity);
						assertCreationReference(true);
					}, expectedIdentity, false, true, creatingTarget, signal);
					pending.add(result);
					result.finally(() => pending.delete(result)).catch(() => void 0);
					await result;
				},
				async runExisting(source, operation, runOptions) {
					const capturedGeneration = generation;
					const completion = createDeferredCore();
					pending.add(completion.promise);
					const result = (async () => {
						try {
							assertBorrowed();
							assertCreationReference(false);
							return await run(source, operation, (nativeIdentity) => {
								assertReferenceCurrent(nativeIdentity);
								assertCreationReference(false);
							}, expectedIdentity, runOptions?.retireNativeOnFailure);
						} catch (error) {
							if (runOptions?.retireNativeOnFailure && capturedGeneration) try {
								await closeNative(capturedGeneration);
							} catch (cleanupError) {
								throw retainSqliteWorkerErrorCode(new AggregateError([error, cleanupError], "Agent execution refusal and native cleanup failed", { cause: error }), error);
							}
							throw error;
						}
					})();
					result.finally(() => {
						pending.delete(completion.promise);
						completion.resolve();
					}).catch(() => void 0);
					return result;
				},
				release() {
					released = true;
					release ??= (async () => {
						await Promise.allSettled(pending);
						if (creatingTarget && --creationBorrowers === 0 && !fileIdentity && !nativeClosing && !cleanupFailure) {
							if (generation) try {
								await closeNative(generation);
							} catch (error) {
								reportCleanupFailure(error);
							}
							if (!creationBorrowers && !generation && !nativeClosing && !cleanupFailure) creationIdentity = void 0;
						}
						borrowers -= 1;
						if (borrowers !== 0 || retired || cleanupFailure) return;
						const drainSignal = getGatewayRestartDrainSignal();
						if (generation && !nativeClosing && !executionState.idle && !drainSignal.aborted) {
							executionState.idle = owner;
							const timer = runInExecutionOwnerContext(() => setTimeout(() => {
								if (idleTimer !== timer || executionState.idle !== owner) return;
								owner.closeIdle().catch(reportCleanupFailure);
							}, SQLITE_IDLE_HANDLE_TTL_MS));
							idleTimer = timer;
							timer.unref();
							idleDrainListener = addAbortListener(drainSignal, () => {
								runInExecutionOwnerContext(() => {
									owner.closeIdle().catch(reportCleanupFailure);
								});
							});
							return;
						}
						try {
							await owner.closeIdle();
						} catch (error) {
							reportCleanupFailure(error);
						}
					})();
					return release;
				}
			};
		},
		async closeIdle() {
			await closeNative();
			if (borrowers === 0 && !generation) finishRetirement();
		},
		close() {
			retired = true;
			closing ??= (async () => {
				await closeNative();
				finishRetirement();
			})().catch((error) => {
				closing = void 0;
				if (!revoked) retired = false;
				throw error;
			});
			return closing;
		}
	};
	const unregisterAgent = () => {
		for (const [alias, unregister] of aliases) {
			if (executions.get(alias) === owner) executions.delete(alias);
			unregister();
		}
		aliases.clear();
	};
	const retainAlias = (alias) => {
		if (aliases.has(alias)) return;
		const register = () => registerOpenClawAgentDatabaseAsyncResource({
			agentId,
			path: alias,
			revoke() {
				revoked = true;
				retired = true;
				clearIdleTimer();
			},
			close: () => owner.close()
		});
		const unregister = aliases.size === 0 ? register() : runOutsideOpenClawDatabaseMaintenanceScope(register);
		aliases.set(alias, unregister);
		executions.set(alias, owner);
	};
	try {
		retainAlias(pathname);
		retainAlias(identity.canonicalPath);
		unregisterShared = registerOpenClawStateDatabaseAsyncResource({ close: async (sharedIdentity) => {
			if (!sharedIdentity || sharedIdentity.key === context.admission.identity.key) await owner.close();
		} });
		return owner.borrow(pathname, initialIdentity, expectedCreationIdentity, prepared.requestedPath);
	} catch (error) {
		unregisterAgent();
		unregisterShared?.();
		throw error;
	}
}
//#endregion
export { incognitoSideDataKeys as a, isIncognitoLifecycleCommand as c, isIncognitoComputeWrite as d, isIncognitoTranscriptWrite as i, isIncognitoLifecycleWrite as l, supportsOpenClawAgentDatabaseExecution as n, isIncognitoSideDataWrite as o, isIncognitoTranscriptCommand as r, incognitoLifecycleKeys as s, captureOpenClawAgentDatabaseExecution as t, isIncognitoComputeCommand as u };
