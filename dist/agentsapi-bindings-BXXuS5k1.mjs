import { H as wrapNativeSessionDeletionMutation, V as isNativeSessionDeletionUnresolved } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { g as createNativeSessionBindingLifecycleV2 } from "./agent-harness-session-runtime-795mx7Xd.mjs";
import { n as readRecord, t as bindingSchema } from "./agentsapi-binding-record-CO7NOYrI.mjs";
//#region extensions/agentsapi/agentsapi-bindings.ts
/** Native identity is plugin-owned; shared runtime owns mutation and lease coordination. */
function createAgentsApiBindings(runtime, nativeCleanup) {
	const invalidRow = (key) => /* @__PURE__ */ new Error(`Invalid Agents API binding row: ${key}; original state retained. Back up OpenClaw state and restore this binding from a valid pre-upgrade backup before retrying.`);
	const stateOptions = {
		namespace: "agentsapi-sessions",
		maxEntries: 1e5,
		overflowPolicy: "reject-new"
	};
	const state = runtime.state.openKeyedStoreV2(stateOptions);
	const lifecycle = createNativeSessionBindingLifecycleV2({
		lookup: state.lookup.bind(state),
		withCurrent(authority) {
			return runtime.state.openKeyedStoreV2(stateOptions, authority);
		}
	}, {
		workerCodec: "agentsapi",
		readRecord,
		lease: {
			staleMs: 65e3,
			waitMs: 7e4,
			retryIntervalMs: 1e3,
			renewIntervalMs: 21e3
		},
		releaseTtlMs: (_key, current) => current.sessionId ? void 0 : 1,
		errors: {
			atomicUpdatesRequired: "Agents API bindings require atomic plugin-state updates",
			invalidRow,
			lostLease: (key, cause) => new Error(`Agents API binding lease lost: ${key}`, { cause }),
			leaseTimeout: (key) => /* @__PURE__ */ new Error(`Timed out waiting for Agents API binding lease: ${key}`),
			acquisitionRejected: (key) => /* @__PURE__ */ new Error(`Agents API binding acquisition rejected: ${key}`),
			mutationBlocked: "Agents API binding mutation blocked during an exclusive operation",
			conditionalDeletionRequired: "Agents API deletion requires conditional plugin-state deletion",
			deletionChanged: "Agents API binding changed before session deletion",
			rollbackChanged: "Agents API binding changed before session deletion rollback"
		}
	});
	const acquisition = (assertCurrent) => ({
		assertCurrent,
		prepareLease: (current, lease) => ({
			...current,
			lease
		})
	});
	return {
		withExclusiveMutationFence: lifecycle.withExclusiveMutationFence,
		async withSession(localSessionId, assertCurrent, run, migrate) {
			return await lifecycle.withMutation(() => lifecycle.withLease(localSessionId, async () => {
				assertCurrent();
				const assertLeaseCurrent = lifecycle.captureLeaseAssertion(localSessionId);
				let active = true;
				const bind = async (binding, legacy) => {
					assertCurrent();
					if (!active) throw new Error("Agents API binding operation is no longer active");
					assertLeaseCurrent();
					const validated = bindingSchema.parse(binding);
					await lifecycle.transact(localSessionId, (current) => {
						if (legacy && (current?.sessionId !== legacy.sessionId || current.authFingerprint !== legacy.authFingerprint)) throw new Error("Agents API legacy binding changed during migration; retry with the retained binding");
						return {
							next: {
								...validated,
								...current?.lease ? { lease: current.lease } : {}
							},
							result: void 0
						};
					}, void 0, assertCurrent);
					assertCurrent();
				};
				try {
					const stored = readRecord(await state.lookup(localSessionId));
					assertCurrent();
					assertLeaseCurrent();
					let binding;
					if (stored?.sessionId && stored.authFingerprint) {
						const assertMigrationCurrent = () => {
							assertCurrent();
							assertLeaseCurrent();
						};
						binding = await migrate({
							sessionId: stored.sessionId,
							authFingerprint: stored.authFingerprint
						}, assertMigrationCurrent);
						assertMigrationCurrent();
						if (binding.sessionId !== stored.sessionId) throw new Error("Agents API migration cannot replace the saved native session");
						await bind(binding, {
							sessionId: stored.sessionId,
							authFingerprint: stored.authFingerprint
						});
						assertMigrationCurrent();
					} else if (stored?.sessionId && stored.configFingerprint) binding = bindingSchema.parse(stored);
					return await run(binding, bind, assertLeaseCurrent);
				} finally {
					active = false;
				}
			}, acquisition(assertCurrent)));
		},
		async reset(localSessionId, assertCurrent, agentId) {
			await lifecycle.withMutation(() => lifecycle.withLease(localSessionId, async () => {
				const assertLeaseCurrent = lifecycle.captureLeaseAssertion(localSessionId);
				const assertResetCurrent = () => {
					assertCurrent();
					assertLeaseCurrent();
				};
				const binding = nativeBinding(readRecord(await state.lookup(localSessionId)));
				assertResetCurrent();
				if (binding) {
					if (!nativeCleanup) throw new Error("Agents API native session cleanup is unavailable");
					await nativeCleanup.settle(localSessionId, binding, assertResetCurrent, agentId);
					assertResetCurrent();
					if (binding.executor) {
						await nativeCleanup.retire(localSessionId, binding, assertResetCurrent);
						assertResetCurrent();
					}
				}
				await lifecycle.transact(localSessionId, (current) => ({
					next: current?.lease ? { lease: current.lease } : {},
					result: void 0
				}), void 0, assertCurrent);
			}, acquisition(assertCurrent)));
		},
		async resolveContextResetSessionId(sessionId, previousSessionId) {
			const raw = await state.lookup(sessionId);
			const current = readRecord(raw);
			if (raw !== void 0 && !current) throw invalidRow(sessionId);
			return current?.sessionId || !previousSessionId ? sessionId : previousSessionId;
		},
		async withSessionDeletion(params, run, retireAfterCommit = false) {
			return await lifecycle.withDeletion(params.sessionId, {
				...acquisition(params.assertCurrent),
				assertRecordCurrent: () => params.assertCurrent()
			}, async (stored, mutation) => {
				const binding = nativeBinding(stored);
				if (binding) {
					const assertLeaseCurrent = lifecycle.captureLeaseAssertion(params.sessionId);
					const assertDeletionCurrent = () => {
						params.assertCurrent();
						assertLeaseCurrent();
					};
					const cleanup = nativeCleanup;
					if (!cleanup) throw new Error("Agents API native session cleanup is unavailable");
					await cleanup.settle(params.sessionId, binding, assertDeletionCurrent, params.agentId);
					assertDeletionCurrent();
					if (binding.executor && !retireAfterCommit) {
						await cleanup.retire(params.sessionId, binding, assertDeletionCurrent);
						assertDeletionCurrent();
					}
				}
				if (!retireAfterCommit || !binding?.executor) return await run(mutation);
				let committed = false;
				try {
					return await run(wrapNativeSessionDeletionMutation(mutation, {
						assertCurrent: params.assertCurrent,
						committed: () => {
							committed = true;
						},
						rolledBack: () => {
							committed = false;
						}
					}));
				} finally {
					if (committed && !isNativeSessionDeletionUnresolved(mutation)) {
						params.assertCurrent();
						await nativeCleanup.retire(params.sessionId, binding, params.assertCurrent);
						params.assertCurrent();
					}
				}
			});
		}
	};
}
function nativeBinding(row) {
	return row?.sessionId ? {
		sessionId: row.sessionId,
		configFingerprint: row.configFingerprint,
		executorControllerPluginId: row.executorControllerPluginId,
		executor: row.executor
	} : void 0;
}
//#endregion
export { createAgentsApiBindings as t };
