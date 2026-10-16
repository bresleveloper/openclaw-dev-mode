import { C as retirePluginCache, D as withPluginCache, E as waitForPluginCacheRetirement, a as createPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-CdKflcqg.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-lifecycle-lease-identity.ts
const PLUGIN_LIFECYCLE_LEASE_IDENTITY = {
	scope: "core:plugin-lifecycle",
	key: "global"
};
//#endregion
//#region src/plugins/plugin-lifecycle-lease.ts
const DEFAULT_PLUGIN_LIFECYCLE_LEASE_MS = 3e5;
const DEFAULT_PLUGIN_LIFECYCLE_WAIT_MS = 6e5;
const activePluginLifecycleLease = new AsyncLocalStorage();
const lifecycleLeaseDemand = /* @__PURE__ */ new Map();
/** Lease holders use this to stop waiting on work that may be queued behind their lease. */
function hasPluginLifecycleLeaseDemand() {
	return [...lifecycleLeaseDemand.values()].some(({ holders, waiters }) => holders > 0 && waiters > 0);
}
function hasPluginLifecycleLease() {
	return activePluginLifecycleLease.getStore() !== void 0;
}
/** Detached observers must acquire ownership rather than borrow their writer's lease. */
function runOutsidePluginLifecycleLease(run) {
	return activePluginLifecycleLease.exit(run);
}
function resolveLifecycleLeaseEnv(env) {
	const requested = env ?? process.env;
	if (!process.env.VITEST || requested.VITEST || requested.OPENCLAW_STATE_DIR) return requested;
	return {
		...requested,
		VITEST: process.env.VITEST,
		VITEST_WORKER_ID: process.env.VITEST_WORKER_ID,
		VITEST_POOL_ID: process.env.VITEST_POOL_ID
	};
}
/** Serialize plugin artifact, install-index, and config mutations across processes. */
async function withPluginLifecycleLease(options, run) {
	const active = activePluginLifecycleLease.getStore();
	const refusal = active?.refusal ?? {};
	const assertAuthority = (check) => {
		if (refusal.current) throw refusal.current.error;
		try {
			check();
		} catch (error) {
			refusal.current = { error };
			throw error;
		}
	};
	const assertCurrent = options.assertCurrent;
	assertAuthority(() => assertCurrent?.());
	const runWithLease = async (lease) => {
		const owned = !assertCurrent && lease === active?.lease ? lease : {
			...lease,
			...lease.renew ? { renew: () => assertAuthority(() => {
				assertCurrent?.();
				lease.renew?.();
			}) } : {},
			assertCurrent: () => assertAuthority(() => {
				assertCurrent?.();
				lease.assertCurrent();
			}),
			assertOwned: () => assertAuthority(() => {
				assertCurrent?.();
				lease.assertOwned();
			}),
			assertOwnedInTransaction: (database) => assertAuthority(() => {
				assertCurrent?.();
				lease.assertOwnedInTransaction(database);
			})
		};
		if (assertCurrent) owned.assertOwned();
		return activePluginLifecycleLease.run({
			databasePath: owned.databasePath,
			lease: owned,
			refusal
		}, () => run(owned));
	};
	if (active && options.env === void 0 && options.path === void 0 && options.database === void 0) {
		options.signal?.throwIfAborted();
		active.lease.assertOwned();
		return await runWithLease(active.lease);
	}
	const env = resolveLifecycleLeaseEnv(options.env);
	const databasePath = path.resolve(options.database?.path ?? options.path ?? resolveOpenClawStateSqlitePath(env));
	if (active) {
		if (active.databasePath !== databasePath) throw new OpenClawStateLeaseError("nested plugin lifecycle lease cannot switch the shared state database", { code: "OPENCLAW_STATE_LEASE_INVALID_INPUT" });
		options.signal?.throwIfAborted();
		active.lease.assertOwned();
		return await runWithLease(active.lease);
	}
	const waitMs = options.waitMs ?? DEFAULT_PLUGIN_LIFECYCLE_WAIT_MS;
	const demand = lifecycleLeaseDemand.get(databasePath) ?? {
		acquisitions: 0,
		holders: 0,
		waiters: 0
	};
	lifecycleLeaseDemand.set(databasePath, demand);
	demand.acquisitions += 1;
	let waiting = waitMs > 0;
	let acquired = false;
	demand.waiters += Number(waiting);
	const stopWaiting = () => {
		if (waiting) {
			waiting = false;
			demand.waiters -= 1;
		}
	};
	return await withOpenClawStateLease({
		...PLUGIN_LIFECYCLE_LEASE_IDENTITY,
		database: {
			scope: "shared",
			schemaPolicy: options.schemaPolicy,
			options: {
				env,
				...options.path ? { path: options.path } : {},
				...options.database ? { database: options.database } : {}
			}
		},
		leaseMs: options.leaseMs ?? DEFAULT_PLUGIN_LIFECYCLE_LEASE_MS,
		waitMs,
		processBound: options.processBound,
		...options.signal ? { signal: options.signal } : {},
		leaseLabel: "plugin lifecycle lease",
		operationLabel: "plugins.lifecycle.lease"
	}, async (lease) => {
		stopWaiting();
		acquired = true;
		demand.holders += 1;
		const pluginLease = {
			databasePath,
			stateLease: lease,
			assertCurrent: () => assertAuthority(() => lease.signal.throwIfAborted()),
			signal: lease.signal,
			...lease.renew ? { renew: () => lease.renew?.() } : {},
			assertOwned: () => lease.assertOwned(),
			assertOwnedInTransaction: (database) => lease.assertOwnedInTransaction(database)
		};
		const cache = createPluginCache();
		const failures = [];
		let result;
		try {
			result = await withPluginCache(cache, () => runWithLease(pluginLease));
		} catch (error) {
			failures.push(error);
		}
		for (const cleanup of [() => cache.kind === "operation" ? retirePluginCache(cache) : void 0, waitForPluginCacheRetirement]) try {
			await cleanup();
		} catch (error) {
			failures.push(error);
		}
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, "Plugin lifecycle work failed");
		return result;
	}).finally(() => {
		stopWaiting();
		demand.holders -= Number(acquired);
		demand.acquisitions -= 1;
		if (demand.acquisitions === 0) lifecycleLeaseDemand.delete(databasePath);
	});
}
//#endregion
export { PLUGIN_LIFECYCLE_LEASE_IDENTITY as a, withPluginLifecycleLease as i, hasPluginLifecycleLeaseDemand as n, runOutsidePluginLifecycleLease as r, hasPluginLifecycleLease as t };
