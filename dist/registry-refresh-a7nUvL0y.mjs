import { D as withPluginCache, a as createPluginCache, p as getScopedPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { r as formatConfigIssueSummary } from "./issue-format-L1jxHK43.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { o as isGatewayPluginMetadataSnapshotActive } from "./current-plugin-metadata-state-CfLPTM0e.mjs";
import { c as tracePluginLifecyclePhaseAsync } from "./discovery-Dma3bVNk.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { a as createManagedRuntimeEnvBase, t as createConfigIO } from "./io.factory-GdHkk8Z_.mjs";
import { i as withPluginLifecycleLease, t as hasPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import "./installed-plugin-index-records-VCj98mZ6.mjs";
import { t as refreshPluginRegistry } from "./plugin-registry-refresh-DwR0WK8L.mjs";
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
		assertOwned: () => assertAuthority(() => owner.assertOwned()),
		assertOwnedInTransaction: (database) => assertAuthority(() => owner.assertOwnedInTransaction(database))
	} : void 0;
	callerLease?.assertOwned();
	const warn = (error) => params.logger?.warn?.(`Plugin registry refresh failed: ${formatErrorMessage(error)}`);
	try {
		await withPluginLifecycleLease({
			...params.env ? { env: params.env } : {},
			...callerLease ? {
				path: callerLease.databasePath,
				assertCurrent: () => callerLease.assertOwned()
			} : {}
		}, async (acquiredLease) => {
			const lease = {
				...acquiredLease,
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
