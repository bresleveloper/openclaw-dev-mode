import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { k as withPluginCache, p as getPluginMetadataSnapshotCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { i as isPluginMetadataSnapshotCompatible, l as rebasePluginMetadataSnapshotManifestRegistry, o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import { h as withDeferredPluginDoctorMigrations } from "./doctor-contract-registry-CPMSf5LC.mjs";
//#region src/commands/doctor/shared/plugin-metadata-snapshot-scope.ts
const configWideDoctorSnapshots = /* @__PURE__ */ new WeakSet();
/** Aligns Doctor's immutable snapshot view with config-wide agent workspace discovery. */
function resolveConfigWideDoctorPluginMetadataSnapshot(params) {
	if (configWideDoctorSnapshots.has(params.snapshot)) return params.snapshot;
	const manifestRegistry = resolveConfigWidePluginManifestRegistry({
		config: params.config,
		env: params.env,
		allowCurrent: false
	});
	const snapshot = manifestRegistry === params.snapshot.manifestRegistry ? params.snapshot : rebasePluginMetadataSnapshotManifestRegistry(params.snapshot, manifestRegistry);
	configWideDoctorSnapshots.add(snapshot);
	return snapshot;
}
/** Reuses one exact immutable plugin metadata generation per Doctor workspace. */
function createDoctorPluginMetadataSnapshotScope(params) {
	const env = params.env ?? process.env;
	const snapshotsByWorkspace = /* @__PURE__ */ new Map();
	let currentBaseSnapshot;
	const ownedCaches = /* @__PURE__ */ new Set();
	const createOwnedCache = () => {
		const cache = createPluginCache();
		ownedCaches.add(cache);
		return cache;
	};
	let cache = createOwnedCache();
	const refreshBaseSnapshot = () => {
		const nextBaseSnapshot = params.getBaseSnapshot?.();
		if (nextBaseSnapshot === currentBaseSnapshot) return;
		currentBaseSnapshot = nextBaseSnapshot;
		cache = nextBaseSnapshot ? getPluginMetadataSnapshotCache(nextBaseSnapshot) : createOwnedCache();
		snapshotsByWorkspace.clear();
		if (nextBaseSnapshot && nextBaseSnapshot.pluginIds === void 0) snapshotsByWorkspace.set(nextBaseSnapshot.workspaceDir, nextBaseSnapshot);
	};
	const resolveSnapshot = (config, workspaceDir) => {
		const inheritedBase = workspaceDir === void 0 && currentBaseSnapshot?.pluginIds === void 0 ? currentBaseSnapshot : void 0;
		const snapshot = resolveConfigWideDoctorPluginMetadataSnapshot({
			snapshot: [snapshotsByWorkspace.get(workspaceDir), inheritedBase].find((snapshot) => snapshot && isPluginMetadataSnapshotCompatible({
				snapshot,
				config,
				env,
				workspaceDir: workspaceDir ?? snapshot.workspaceDir
			})) ?? loadPluginMetadataSnapshot({
				config,
				env,
				...workspaceDir ? { workspaceDir } : {}
			}),
			config,
			env
		});
		snapshotsByWorkspace.delete(workspaceDir);
		snapshotsByWorkspace.set(workspaceDir, snapshot);
		pruneMapToMaxSize(snapshotsByWorkspace, 64);
		return snapshot;
	};
	const run = (scope, operation) => {
		refreshBaseSnapshot();
		return withDeferredPluginDoctorMigrations(params.getDeferredPluginIds?.() ?? [], () => withPluginCache(cache, () => {
			const snapshot = resolveSnapshot(scope.config, scope.workspaceDir);
			return withPluginMetadataSnapshotScope(snapshot, operation, {
				config: scope.config,
				env,
				...scope.workspaceDir ? { workspaceDir: scope.workspaceDir } : {}
			});
		}));
	};
	return {
		async [Symbol.asyncDispose]() {
			await Promise.all([...ownedCaches].map((owned) => owned[Symbol.asyncDispose]()));
			ownedCaches.clear();
		},
		run,
		invalidate: () => {
			currentBaseSnapshot = void 0;
			snapshotsByWorkspace.clear();
			cache = createOwnedCache();
		}
	};
}
//#endregion
export { resolveConfigWideDoctorPluginMetadataSnapshot as n, createDoctorPluginMetadataSnapshotScope as t };
