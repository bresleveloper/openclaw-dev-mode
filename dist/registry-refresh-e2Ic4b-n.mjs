import { h as getScopedPluginCache, k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as isGatewayPluginMetadataSnapshotActive } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { c as tracePluginLifecyclePhaseAsync } from "./discovery-B5pUUvVG.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { a as createManagedRuntimeEnvBase, t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { r as formatConfigIssueSummary } from "./issue-format-Cu1pIc3h.mjs";
import { a as withPluginLifecycleLease, t as hasPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import "./installed-plugin-index-records-DTzp62mN.mjs";
import { t as refreshPluginRegistry } from "./plugin-registry-refresh-CsnvrffN.mjs";
//#region src/plugins/registry-refresh.ts
/** Refresh inventory from the committed file, including deferred runtime changes. */
async function refreshPluginRegistryAfterConfigMutation(params) {
	const suppliedRecordsOwned = hasPluginLifecycleLease();
	const owner = params.lease;
	let authorityRefusal;
	const assertAuthority = (assert) => {
		if (authorityRefusal) throw authorityRefusal.error;
		try {
			assert();
		} catch (error) {
			authorityRefusal = { error };
			throw error;
		}
	};
	const callerLease = owner ? {
		...owner,
		assertCurrent: () => assertAuthority(() => owner.assertCurrent()),
		assertOwned: () => assertAuthority(() => {
			owner.assertCurrent();
			owner.assertOwned();
		}),
		assertOwnedInTransaction: (database) => assertAuthority(() => owner.assertOwnedInTransaction(database))
	} : void 0;
	callerLease?.assertOwned();
	const warn = (error) => params.logger?.warn?.(`Plugin registry refresh failed: ${formatErrorMessage(error)}`);
	try {
		await withPluginLifecycleLease({
			...params.env ? { env: params.env } : {},
			...callerLease ? {
				path: callerLease.databasePath,
				assertCurrent: () => callerLease.assertCurrent()
			} : {}
		}, async (acquiredLease) => {
			const lease = {
				...acquiredLease,
				assertCurrent: () => assertAuthority(() => {
					acquiredLease.assertCurrent();
					callerLease?.assertCurrent();
				}),
				assertOwned: () => assertAuthority(() => {
					acquiredLease.assertOwned();
					callerLease?.assertOwned();
				}),
				assertOwnedInTransaction: (database) => assertAuthority(() => {
					acquiredLease.assertOwnedInTransaction(database);
					callerLease?.assertOwnedInTransaction(database);
				})
			};
			try {
				const scoped = getScopedPluginCache();
				const cache = params.reason === "policy-changed" && suppliedRecordsOwned && !isGatewayPluginMetadataSnapshotActive() && scoped?.kind === "operation" ? scoped : createPluginCache();
				await withPluginCache(cache, async () => {
					const installRecords = (suppliedRecordsOwned ? params.installRecords : void 0) ?? await tracePluginLifecyclePhaseAsync("install records load", () => loadInstalledPluginIndexInstallRecords({
						...params.env ? { env: params.env } : {},
						filePath: lease.databasePath
					}), { command: params.traceCommand ?? "registry-refresh" });
					lease.assertOwned();
					await tracePluginLifecyclePhaseAsync("registry refresh", async () => {
						const snapshot = await createConfigIO({
							configPath: params.configPath,
							env: createManagedRuntimeEnvBase(params.env),
							observe: false,
							pluginValidation: "core-only"
						}).readConfigFileSnapshot();
						lease.assertOwned();
						if (!snapshot.valid) throw new Error(`Config invalid: ${formatConfigIssueSummary(snapshot.issues)}`);
						return refreshPluginRegistry({
							config: snapshot.runtimeConfig,
							reason: params.reason,
							installRecords,
							...params.policyPluginIds ? { policyPluginIds: params.policyPluginIds } : {},
							...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
							...params.env ? { env: params.env } : {},
							filePath: lease.databasePath,
							lease
						});
					}, {
						command: params.traceCommand ?? "registry-refresh",
						reason: params.reason
					});
				});
			} catch (error) {
				lease.assertOwned();
				warn(error);
			}
			lease.assertOwned();
		});
	} catch (error) {
		if (authorityRefusal) throw authorityRefusal.error;
		callerLease?.assertOwned();
		warn(error);
	}
	callerLease?.assertOwned();
	if (params.invalidateRuntimeCache !== false) await invalidatePluginRuntimeDiscoveryAfterConfigMutation({
		...params,
		assertCurrent: callerLease ? () => callerLease.assertOwned() : void 0
	});
}
async function invalidatePluginRuntimeDiscoveryAfterConfigMutation(params) {
	let clearPluginRegistryLoadCache;
	try {
		({clearPluginRegistryLoadCache} = await import("./plugins/loader.js"));
	} catch (error) {
		params.assertCurrent?.();
		params.logger?.warn?.(`Plugin runtime cache invalidation failed: ${formatErrorMessage(error)}`);
		return;
	}
	params.assertCurrent?.();
	try {
		clearPluginRegistryLoadCache();
	} catch (error) {
		params.logger?.warn?.(`Plugin runtime cache invalidation failed: ${formatErrorMessage(error)}`);
	}
}
//#endregion
export { refreshPluginRegistryAfterConfigMutation as n, invalidatePluginRuntimeDiscoveryAfterConfigMutation as t };
