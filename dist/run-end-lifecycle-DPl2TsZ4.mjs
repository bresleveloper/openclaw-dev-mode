import { s as trackAsyncWork, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { c as SqliteWorkerError, u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { isNativeError } from "node:util/types";
//#region src/agents/worktrees/run-end-lifecycle.ts
const current = new AsyncLocalStorage();
const lifetimes = /* @__PURE__ */ new Map();
function worktreeOwnerSelectionKey(ownerKind, ownerId) {
	return JSON.stringify([
		"worktree-owner",
		ownerKind,
		ownerId
	]);
}
const WORKTREE_UNKNOWN_OWNER_SELECTION = "worktree-owner:*";
const mutationAuthority = new AsyncLocalStorage();
function createLifetime({ admission }) {
	let work = new AsyncWorkScope();
	const scopes = /* @__PURE__ */ new Set([work]);
	let gateways = 0;
	let closing = false;
	let retired = false;
	let uncertain = false;
	const cleanupFailures = /* @__PURE__ */ new Map();
	const revisions = /* @__PURE__ */ new Map();
	const selectRevisions = (changes) => {
		const selected = /* @__PURE__ */ new Set();
		for (const { id, fields } of changes) {
			let row = revisions.get(id);
			if (!row) {
				row = /* @__PURE__ */ new Map();
				revisions.set(id, row);
			}
			for (const field of fields) {
				let revision = row.get(field);
				if (!revision) {
					revision = {
						version: 0,
						pending: /* @__PURE__ */ new Set()
					};
					row.set(field, revision);
				}
				selected.add(revision);
			}
		}
		return [...selected];
	};
	const drain = (scope) => AsyncWorkScope.runWhenAllIdle(() => [scope], async () => {
		await scope.drain();
		if (cleanupFailures.size > 0) throw new AggregateError([...cleanupFailures.values()], "Managed worktree cleanup remains unsettled");
		scopes.delete(scope);
	});
	const owner = {
		assertRegistryAdmission(settlement = false) {
			const operation = current.getStore();
			if (closing && !settlement && (!operation?.active || operation.context.admission.coordinationKey !== admission.coordinationKey)) throw new Error("Managed worktree run-end admission is closed");
			if (uncertain) throw new SqliteWorkerError("Managed worktree registry settlement is unknown", "outcome-unknown");
		},
		captureRegistry(changes) {
			owner.assertRegistryAdmission();
			const selected = selectRevisions(changes).map((revision) => ({
				revision,
				version: revision.version
			}));
			return () => {
				owner.assertRegistryAdmission();
				if (retired) throw new Error("Managed worktree registry owner is closed");
				const activeMutation = mutationAuthority.getStore();
				const ownMutation = activeMutation?.validating ? activeMutation : void 0;
				for (const { revision, version } of selected) {
					const ownChange = ownMutation !== void 0 && revision.lastMutation === ownMutation && revision.version === version + 1;
					if (revision.version !== version && !ownChange || [...revision.pending].some((pending) => pending !== ownMutation)) throw new Error("Managed worktree registry authority changed; prepare the operation again");
				}
			};
		},
		setCleanupFailure(key, failure) {
			if (failure) cleanupFailures.set(key, failure.error);
			else cleanupFailures.delete(key);
		},
		registryMutation(changes, settlement = false) {
			owner.assertRegistryAdmission(settlement);
			const selected = selectRevisions([...changes, {
				id: "*",
				fields: changes.flatMap((change) => change.fields)
			}]);
			const token = { validating: false };
			let started = false;
			let finished = false;
			return {
				observeTransaction() {
					if (started) return;
					if (retired || finished) throw new Error("Managed worktree registry mutation is closed");
					started = true;
					for (const revision of selected) {
						revision.version += 1;
						revision.lastMutation = token;
						revision.pending.add(token);
					}
				},
				assertAuthority(assertCurrent) {
					if (finished) throw new Error("Managed worktree registry mutation has settled");
					const validating = token.validating;
					token.validating = true;
					try {
						mutationAuthority.run(token, assertCurrent);
					} finally {
						token.validating = validating;
					}
				},
				settle(unknown) {
					finished = true;
					uncertain ||= unknown;
					if (!unknown) for (const revision of selected) revision.pending.delete(token);
				}
			};
		},
		retainGateway() {
			if (closing) {
				work = new AsyncWorkScope();
				scopes.add(work);
				closing = false;
			}
			gateways += 1;
			let released = false;
			let pending;
			const beginClose = () => {
				if (!released) {
					released = true;
					if (--gateways === 0) {
						closing = true;
						pending = drain(work);
						pending.catch(() => {});
					}
				}
			};
			return {
				beginClose,
				drain: () => {
					beginClose();
					return pending ?? Promise.resolve();
				}
			};
		},
		run(run, acceptedParent = false) {
			if (closing && !acceptedParent) return Promise.reject(/* @__PURE__ */ new Error("Managed worktree run-end admission is closed"));
			return work.track(run);
		}
	};
	const unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
		if (!identity || identity.key === admission.identity.key || identity.canonicalPath === admission.identity.canonicalPath) {
			closing = true;
			await Promise.all([...scopes].map(drain));
			retired = true;
			lifetimes.delete(admission.coordinationKey);
			unregister();
		}
	} });
	return owner;
}
/** These generations describe owner mutations, never cached database rows. */
function captureWorktreeRegistryAuthority(context, changes) {
	return lifetime(context).captureRegistry(changes);
}
function captureWorktreeRegistryMutation(context, changes, options = {}) {
	return lifetime(context).registryMutation(changes, options.settlement);
}
/** Failed exact-token cleanup retains the existing owner until its retry is acknowledged. */
function setWorktreeRunEndCleanupFailure(context, key, failure) {
	lifetimes.get(context.admission.coordinationKey)?.setCleanupFailure(key, failure);
}
function lifetime(context) {
	let owner = lifetimes.get(context.admission.coordinationKey);
	if (!owner) {
		owner = createLifetime(context);
		lifetimes.set(context.admission.coordinationKey, owner);
	}
	return owner;
}
function captureWorktreeRunEndContext(env) {
	const captured = captureOpenClawStateWorkerContext({ env });
	const operation = current.getStore();
	if (!operation) return captured;
	if (!operation.active) throw new Error("Worktree settlement scope is closed");
	if (operation.uncertain) throw operation.uncertain;
	if (operation.context.admission.coordinationKey !== captured.admission.coordinationKey) throw new Error("Worktree settlement database changed");
	operation.context.admission.assertCurrent();
	return {
		...captured,
		admission: {
			...captured.admission,
			get identity() {
				return captured.admission.identity;
			},
			assertCurrent() {
				operation.context.admission.assertCurrent();
				captured.admission.assertCurrent();
			}
		}
	};
}
function withWorktreeRunEnd(env, run, options = {}) {
	const context = captureWorktreeRunEndContext(env);
	const acceptedParent = current.getStore() !== void 0;
	if (acceptedParent && !options.independent) return trackAsyncWork(run);
	const operation = {
		context,
		active: true
	};
	return lifetime(context).run(() => current.run(operation, async () => {
		try {
			return await run();
		} finally {
			operation.active = false;
		}
	}), acceptedParent);
}
function retainWorktreeRunEndFailure(error) {
	const operation = current.getStore();
	if (operation && hasSqliteWorkerOutcomeUnknown(error) && isNativeError(error)) operation.uncertain ??= error;
}
function prepareWorktreeRunEndClose() {
	return lifetime(captureOpenClawStateWorkerContext()).retainGateway();
}
//#endregion
export { prepareWorktreeRunEndClose as a, withWorktreeRunEnd as c, captureWorktreeRunEndContext as i, worktreeOwnerSelectionKey as l, captureWorktreeRegistryAuthority as n, retainWorktreeRunEndFailure as o, captureWorktreeRegistryMutation as r, setWorktreeRunEndCleanupFailure as s, WORKTREE_UNKNOWN_OWNER_SELECTION as t };
