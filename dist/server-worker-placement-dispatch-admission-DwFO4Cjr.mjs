import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { a as captureExternalSessionCommitGuard, c as prepareSessionSourceAuthority, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { o as resolveSessionStorePathForScope } from "./session-store-path-BQkYPc4_.mjs";
import "./session-accessor.sqlite-entry-cache-publication-BpzZnZxY.mjs";
import { g as retainPreparedSessionEntryPredicate, l as readPreparedSessionEntryChange, x as projectSessionEntryPredicateChange } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as captureSessionActorStorageOwner, o as runWithSessionActorStorage, t as acquireSessionActorStorage } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { g as sessionChangeAffectsStoredRow, h as prepareSessionRowPublicationScope } from "./session-actor-replica-D_j2y4I5.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-BihxXo5j.mjs";
import "./config-B3oiWDlr.mjs";
import { f as retainGatewayDeviceRevocation } from "./device-revocation-DpGQRUdo.mjs";
import { n as captureSessionEntryCurrentRead } from "./session-entry-current-runtime-Dwzq8LTI.mjs";
import { a as resolveWorkerPlacementSessionStoreTarget, i as loadWorkerPlacementSessionRuntimeModule } from "./server-worker-placement-session-target-CLJyKcFG.mjs";
import { t as WorkerPlacementAdmissionTargetError } from "./service-contract-BIUGNku3.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-worker-placement-dispatch-admission.ts
/** Session custody lasts through the consumer, including unsettled placement effects. */
async function withGatewayWorkerSessionAdmission(params, run) {
	const getConfig = params.getConfig ?? readRuntimeConfig;
	const scope = params.identity;
	const assertCallerCurrent = () => {
		params.signal?.throwIfAborted();
		params.authorize?.();
	};
	const authority = {
		assertCurrent: assertCallerCurrent,
		authorize: assertCallerCurrent
	};
	const namespace = captureSessionActorStorageOwner(scope, authority);
	const memory = namespace && await acquireSessionActorStorage(scope, {
		authority,
		lifetime: {
			assertCurrent: assertCallerCurrent,
			assertReadable: assertCallerCurrent
		}
	});
	if (namespace && !memory) throw new WorkerPlacementAdmissionTargetError("Worker session source is unavailable; retry.");
	if (memory) try {
		const entry = memory.actor.snapshot(memory.authority)?.entry;
		if (!entry || entry.sessionId !== scope.sessionId || entry.archivedAt !== void 0 || params.expectedEntry && entry.lifecycleRevision !== params.expectedEntry.lifecycleRevision) throw new WorkerPlacementAdmissionTargetError("Worker session source is unavailable; retry.");
		const fields = [.../* @__PURE__ */ new Set([
			"sessionId",
			"lifecycleRevision",
			"archivedAt",
			...params.retainEntryFields ?? []
		])];
		const controller = new AbortController();
		const signal = params.signal ? AbortSignal.any([params.signal, controller.signal]) : controller.signal;
		let active = true;
		const assertCurrent = () => {
			if (!active) throw new WorkerPlacementAdmissionTargetError("Worker session admission scope was released.");
			params.signal?.throwIfAborted();
			params.authorize?.();
			const current = memory.actor.snapshot(memory.authority)?.entry;
			if (!current || fields.some((field) => !isDeepStrictEqual(current[field], entry[field]))) throw new WorkerPlacementAdmissionTargetError("Session changed during worker admission; retry.");
			return current;
		};
		let admission;
		try {
			admission = await beginSessionWorkAdmission({
				scope: memory.path,
				identities: [
					scope.sessionKey,
					scope.sessionId,
					...params.target?.storeKeys ?? []
				],
				onInterrupt: (reason) => controller.abort(reason),
				signal,
				assertAllowed: () => {
					assertCurrent();
				}
			});
			return await admission.run(() => runWithSessionActorStorage(memory, () => run({
				target: {
					agentId: memory.agentId,
					canonicalKey: scope.sessionKey,
					storePath: memory.path,
					storeKeys: params.target?.storeKeys ?? [scope.sessionKey]
				},
				entry,
				assertCurrent,
				signal,
				onCommitted: () => {}
			})));
		} finally {
			active = false;
			admission?.release();
		}
	} finally {
		await memory.actor.release();
	}
	const configuredRoute = resolveSessionStorePathForScope(scope, getConfig());
	const configuredPath = params.target?.storePath ?? configuredRoute;
	const binding = captureSessionTranscriptTargetBinding({
		...scope,
		storePath: configuredPath
	});
	const publication = prepareSessionRowPublicationScope([configuredPath]);
	let retained;
	const controller = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, controller.signal]) : controller.signal;
	let changed = false;
	const acquiringChanges = [];
	let acceptOwnPublication = false;
	const stopPublication = sessionChanges.subscribeFacts((change) => {
		if (sessionChangeAffectsStoredRow(change, {
			...publication,
			agentId: scope.agentId,
			sessionKeys: [scope.sessionKey],
			ignoreStoreTopology: true
		})) {
			const facts = "facts" in change ? change.facts : void 0;
			if ("sessionKey" in change && change.scope === "transcript" && facts?.kind === "unchanged") return;
			if (retained) {
				if (!retained.isCurrent()) controller.abort(new WorkerPlacementAdmissionTargetError("Session changed during worker admission; retry."));
			} else if (acceptOwnPublication) acceptOwnPublication = false;
			else {
				changed = true;
				const prepared = readPreparedSessionEntryChange(change, scope.sessionKey);
				const lifecycleChanged = (facts?.kind === "replacement" || facts?.kind === "entry") && facts.lifecycleChanged;
				acquiringChanges.push(lifecycleChanged ? {} : {
					entry: prepared?.entry,
					facts: prepared ? void 0 : facts
				});
			}
		}
	});
	const assertRouteCurrent = () => {
		if (resolveSessionStorePathForScope(scope, getConfig()) !== configuredRoute) throw new WorkerPlacementAdmissionTargetError("Session source changed during worker admission; retry.");
	};
	const assertRoutingCurrent = () => {
		params.signal?.throwIfAborted();
		params.authorize?.();
		assertRouteCurrent();
	};
	let admission;
	const acquiring = new AbortController();
	const abortAcquisition = () => acquiring.abort(signal.reason);
	signal.addEventListener("abort", abortAcquisition, { once: true });
	try {
		admission = await beginSessionWorkAdmission({
			agentId: scope.agentId,
			scope: configuredPath,
			identities: [
				scope.sessionKey,
				scope.sessionId,
				...params.target?.storeKeys ?? []
			],
			onInterrupt: (reason) => controller.abort(reason),
			signal,
			assertAllowed: assertRoutingCurrent
		});
		return await admission.run(() => racePromiseWithAbortSignal(withSessionEntryReadOnlyInWorker(binding, () => {
			acquiring.signal.throwIfAborted();
			params.signal?.throwIfAborted();
			assertRouteCurrent();
		}, async (read, owner) => {
			signal.throwIfAborted();
			assertRoutingCurrent();
			signal.removeEventListener("abort", abortAcquisition);
			if (!read.ok) throw read.error;
			const entry = read.value;
			if (!entry || entry.sessionId !== scope.sessionId || entry.archivedAt !== void 0 || params.expectedEntry && (entry.sessionId !== params.expectedEntry.sessionId || entry.lifecycleRevision !== params.expectedEntry.lifecycleRevision)) throw new WorkerPlacementAdmissionTargetError("Worker session source is unavailable or changed during admission; retry.");
			const source = captureSessionEntryCurrentRead(binding, owner);
			const fields = [.../* @__PURE__ */ new Set([
				"sessionId",
				"lifecycleRevision",
				"archivedAt",
				...params.retainEntryFields ?? []
			])];
			const selected = {};
			const captureField = (field, value) => {
				selected[field] = structuredClone(value);
			};
			fields.forEach((field) => captureField(field, entry[field]));
			const expected = freezeJsonSnapshot(selected);
			const matches = (current) => current !== void 0 && fields.every((field) => isDeepStrictEqual(current[field], expected[field]));
			if (acquiringChanges.some((change) => !matches(change.entry ?? (change.facts ? projectSessionEntryPredicateChange({ entry }, change.facts) : void 0)))) throw new WorkerPlacementAdmissionTargetError("Worker session source is unavailable or changed during admission; retry.");
			changed = false;
			acquiringChanges.length = 0;
			retained = source.kind === "file" ? retainPreparedSessionEntryPredicate({
				databaseIdentity: `file:${source.source.databaseIdentity}`,
				sessionKey: scope.sessionKey,
				entry,
				matches: (_before, after) => matches(after)
			}) : void 0;
			if (source.kind === "file") publication.databaseIdentities.add(source.source.databaseIdentity);
			const completed = createDeferredCore();
			const unregister = registerOpenClawAgentDatabaseAsyncResource({
				agentId: owner.scope?.databaseAgentId ?? scope.agentId,
				path: owner.scope?.storePath ?? configuredPath,
				revoke: () => controller.abort(/* @__PURE__ */ new Error("Worker session source was revoked")),
				close: () => completed.promise
			});
			let active = true;
			const assertActive = () => {
				if (!active) throw new WorkerPlacementAdmissionTargetError("Worker session admission scope was released.");
			};
			const assertLocalCurrent = () => {
				assertActive();
				assertRouteCurrent();
				owner.assertCurrent();
				source.assertSourceCurrent();
				if (retained ? !retained.isCurrent() : changed) throw new WorkerPlacementAdmissionTargetError("Session changed during worker admission; retry.");
			};
			const rowAuthority = Object.assign(assertLocalCurrent, {
				nativeSource: source.kind === "native" || source.kind === "missing",
				async prepareSessionSource() {
					assertLocalCurrent();
					return {
						nativeSource: source.kind === "native" || source.kind === "missing",
						assertCurrent: assertLocalCurrent,
						checks: source.kind === "file" ? [{
							predicate: {
								source: source.source,
								sessionKey: source.source.sessionKey,
								fields: [...fields],
								expected
							},
							refuse: () => {
								throw new WorkerPlacementAdmissionTargetError("Session changed during worker admission; retry.");
							}
						}] : []
					};
				}
			});
			const assertion = composeSessionSourceAssertion([params.authorize, rowAuthority], (assertSources) => {
				assertActive();
				params.signal?.throwIfAborted();
				assertSources();
			});
			const assertCurrent = Object.defineProperty(Object.assign(() => {
				assertion();
				return entry;
			}, { prepareSessionSource: async () => {
				assertActive();
				params.signal?.throwIfAborted();
				return await prepareSessionSourceAuthority(assertion);
			} }), "nativeSource", {
				enumerable: true,
				get: () => assertion.nativeSource
			});
			const target = {
				agentId: scope.agentId,
				canonicalKey: scope.sessionKey,
				storePath: owner.scope?.storePath ?? configuredPath,
				storeKeys: params.target?.storeKeys ?? [scope.sessionKey]
			};
			try {
				const result = await run({
					target,
					entry,
					assertCurrent,
					signal,
					onCommitted: () => {
						acceptOwnPublication = true;
					}
				});
				assertRoutingCurrent();
				return result;
			} finally {
				active = false;
				retained?.release();
				unregister();
				completed.resolve();
			}
		}), acquiring.signal));
	} finally {
		signal.removeEventListener("abort", abortAcquisition);
		admission?.release();
		stopPublication();
	}
}
function createGatewayWorkerDispatchAdmission(loadSessionRuntime = loadWorkerPlacementSessionRuntimeModule) {
	return async (identity, run, authorize, signal) => {
		const releaseCaller = retainGatewayDeviceRevocation(authorize);
		try {
			try {
				var _usingCtx$1 = _usingCtx();
				const sourceRetention = _usingCtx$1.u(new DisposableStack());
				const releaseSource = authorize?.retain?.();
				if (releaseSource) sourceRetention.defer(releaseSource);
				const admit = async () => {
					const sourceAuthorize = captureExternalSessionCommitGuard(authorize);
					signal?.throwIfAborted();
					sourceAuthorize?.();
					const runtime = await loadSessionRuntime();
					const target = await resolveWorkerPlacementSessionStoreTarget(runtime, readRuntimeConfig(), identity);
					const entry = runtime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
					if (!entry || target.agentId !== identity.agentId || target.canonicalKey !== identity.sessionKey) throw new WorkerPlacementAdmissionTargetError("Worker dispatch lost its canonical session target; retry.");
					return await withGatewayWorkerSessionAdmission({
						identity,
						target,
						expectedEntry: {
							sessionId: entry.sessionId,
							lifecycleRevision: entry.lifecycleRevision
						},
						authorize: sourceAuthorize,
						signal,
						retainEntryFields: ["agentRuntimeOverride", "execNode"]
					}, (source) => run(source.signal, source.assertCurrent));
				};
				return await admit();
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
		} finally {
			releaseCaller?.();
		}
	};
}
//#endregion
export { withGatewayWorkerSessionAdmission as n, createGatewayWorkerDispatchAdmission as t };
