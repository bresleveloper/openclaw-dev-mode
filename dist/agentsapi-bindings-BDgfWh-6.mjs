import { c as createNativeSessionBindingLifecycle } from "./agent-harness-session-runtime-JG8Xal7e.mjs";
import { n as readRecord, t as bindingSchema } from "./agentsapi-binding-record-2MHPmTI_.mjs";
//#region extensions/agentsapi/agentsapi-bindings.ts
/** Native identity is plugin-owned; shared runtime owns mutation and lease coordination. */
function createAgentsApiBindings(runtime) {
	const stateOptions = {
		namespace: "agentsapi-sessions",
		maxEntries: 1e5,
		overflowPolicy: "reject-new"
	};
	const state = runtime.state.openSyncKeyedStore(stateOptions);
	const mutationState = runtime.state.openKeyedStore(stateOptions);
	const lifecycle = createNativeSessionBindingLifecycle({
		lookup: state.lookup.bind(state),
		deleteIf: state.deleteIf?.bind(state),
		registerIfAbsent: state.registerIfAbsent.bind(state),
		withCurrent(authority) {
			if (!mutationState.withCurrent) throw new Error("Agents API bindings require action-bound plugin-state mutations");
			return mutationState.withCurrent(authority);
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
			invalidRow: (key) => /* @__PURE__ */ new Error(`Invalid Agents API binding row: ${key}`),
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
		async withSession(localSessionId, assertCurrent, run) {
			return await lifecycle.withMutation(() => lifecycle.withLease(localSessionId, async () => {
				assertCurrent();
				const assertLeaseCurrent = lifecycle.captureLeaseAssertion(localSessionId);
				let active = true;
				const bind = async (binding) => {
					assertCurrent();
					if (!active) throw new Error("Agents API binding operation is no longer active");
					assertLeaseCurrent();
					const validated = bindingSchema.parse(binding);
					await lifecycle.transact(localSessionId, (current) => ({
						next: {
							...validated,
							...current?.lease ? { lease: current.lease } : {}
						},
						result: void 0
					}), void 0, assertCurrent);
					assertCurrent();
				};
				try {
					return await run(nativeBinding(readRecord(state.lookup(localSessionId))), bind, assertLeaseCurrent);
				} finally {
					active = false;
				}
			}, acquisition(assertCurrent)));
		},
		async reset(localSessionId, assertCurrent) {
			await lifecycle.withMutation(() => lifecycle.withLease(localSessionId, async () => {
				await lifecycle.transact(localSessionId, (current) => ({
					next: current?.lease ? { lease: current.lease } : {},
					result: void 0
				}), void 0, assertCurrent);
			}, acquisition(assertCurrent)));
		},
		async withSessionDeletion(params, run) {
			return await lifecycle.withDeletion(params.sessionId, {
				...acquisition(params.assertCurrent),
				assertRecordCurrent: () => params.assertCurrent()
			}, (_binding, mutation) => run(mutation));
		}
	};
}
function nativeBinding(row) {
	return row?.sessionId && row.configFingerprint ? {
		sessionId: row.sessionId,
		configFingerprint: row.configFingerprint
	} : void 0;
}
//#endregion
export { createAgentsApiBindings as t };
