import { O as waitForPluginCacheRetirement, T as retirePluginCache, k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-BPKnfJ8N.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as withOpenClawStateLeaseAsync, t as withOpenClawStateLease } from "./openclaw-state-lease-B69mLcu_.mjs";
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
function createPluginLifecycleLeaseContext(databasePath, lease, assertAuthority) {
	return {
		databasePath,
		stateLease: lease,
		assertCurrent: () => assertAuthority(() => lease.signal.throwIfAborted()),
		signal: lease.signal,
		...lease.renew ? { renew: () => lease.renew?.() } : {},
		assertOwned: () => lease.assertOwned(),
		assertOwnedInTransaction: (database) => lease.assertOwnedInTransaction(database)
	};
}
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
/** Keep reload's deadlock escape aware of both runtime writers and filesystem cleanup. */
async function withPluginLifecycleLeaseDemand(databasePath, waitMs, run) {
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
	try {
		return await run(() => {
			stopWaiting();
			acquired = true;
			demand.holders += 1;
		});
	} finally {
		stopWaiting();
		demand.holders -= Number(acquired);
		demand.acquisitions -= 1;
		if (demand.acquisitions === 0) lifecycleLeaseDemand.delete(databasePath);
	}
}
/** Standalone retired-file cleanup uses worker-owned acquisition, verification and release. */
async function withPluginArtifactCleanupLease(options, run) {
	if (hasPluginLifecycleLease()) throw new Error("Plugin artifact cleanup must run outside runtime lifecycle work");
	const context = captureOpenClawStateWorkerContext({ env: resolveLifecycleLeaseEnv(options.env) });
	const assertCurrent = () => {
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
	};
	assertCurrent();
	return await withPluginLifecycleLeaseDemand(context.admission.databasePath, DEFAULT_PLUGIN_LIFECYCLE_WAIT_MS, (markAcquired) => withOpenClawStateLeaseAsync({
		...PLUGIN_LIFECYCLE_LEASE_IDENTITY,
		leaseMs: DEFAULT_PLUGIN_LIFECYCLE_LEASE_MS,
		waitMs: DEFAULT_PLUGIN_LIFECYCLE_WAIT_MS,
		signal: options.signal,
		processBound: true,
		heartbeat: "worker",
		leaseLabel: "plugin lifecycle lease",
		operationLabel: "plugins.lifecycle.lease"
	}, context, async (lease) => {
		markAcquired();
		const assertOwned = async () => {
			assertCurrent();
			await lease.assertOwned();
			assertCurrent();
		};
		await assertOwned();
		return await run(assertOwned);
	}));
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
		const guard = (check) => assertAuthority(() => {
			assertCurrent?.();
			check();
		});
		const owned = !assertCurrent && lease === active?.lease ? lease : {
			...lease,
			...lease.renew ? { renew: () => guard(() => lease.renew?.()) } : {},
			assertCurrent: () => guard(() => lease.assertCurrent()),
			assertOwned: () => guard(() => lease.assertOwned()),
			assertOwnedInTransaction: (database) => guard(() => lease.assertOwnedInTransaction(database))
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
	return await withPluginLifecycleLeaseDemand(databasePath, waitMs, (markAcquired) => withOpenClawStateLease({
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
		markAcquired();
		const pluginLease = createPluginLifecycleLeaseContext(databasePath, lease, assertAuthority);
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
	}));
}
//#endregion
export { withPluginLifecycleLease as a, withPluginArtifactCleanupLease as i, hasPluginLifecycleLeaseDemand as n, PLUGIN_LIFECYCLE_LEASE_IDENTITY as o, runOutsidePluginLifecycleLease as r, hasPluginLifecycleLease as t };
