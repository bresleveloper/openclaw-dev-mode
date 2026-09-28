import { D as withPluginCache, a as createPluginCache, d as getPluginMetadataSnapshotCache } from "./plugin-cache-A1nT2dqa.mjs";
import { l as withPluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { i as isPluginMetadataSnapshotCompatible, l as rebasePluginMetadataSnapshotManifestRegistry, n as completePluginMetadataSnapshot, o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { d as withDeferredPluginDoctorMigrations } from "./doctor-contract-registry-6tw5Ndqt.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DPc05JSs.mjs";
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
	const snapshot = rebasePluginMetadataSnapshotManifestRegistry(params.snapshot, manifestRegistry);
	configWideDoctorSnapshots.add(snapshot);
	return snapshot;
}
/** Promotes validation-scoped metadata to a complete immutable Doctor snapshot. */
function completeDoctorPluginMetadataSnapshot(params) {
	const snapshot = completePluginMetadataSnapshot(params);
	return snapshot ? resolveConfigWideDoctorPluginMetadataSnapshot({
		snapshot,
		config: params.config,
		env: params.env
	}) : void 0;
}
/** Reuses one exact immutable plugin metadata generation per Doctor workspace. */
function createDoctorPluginMetadataSnapshotScope(params) {
	const env = params.env ?? process.env;
	const snapshotsByWorkspace = /* @__PURE__ */ new Map();
	const readBaseSnapshot = () => params.getBaseSnapshot?.() ?? params.baseSnapshot;
	let currentBaseSnapshot;
	let cache = createPluginCache();
	const refreshBaseSnapshot = () => {
		const nextBaseSnapshot = readBaseSnapshot();
		if (nextBaseSnapshot === currentBaseSnapshot) return;
		currentBaseSnapshot = nextBaseSnapshot;
		cache = nextBaseSnapshot ? getPluginMetadataSnapshotCache(nextBaseSnapshot) : createPluginCache();
		snapshotsByWorkspace.clear();
		if (nextBaseSnapshot && nextBaseSnapshot.pluginIds === void 0) snapshotsByWorkspace.set(nextBaseSnapshot.workspaceDir, nextBaseSnapshot);
	};
	const resolveSnapshot = (config, workspaceDir) => {
		const inheritedBase = workspaceDir === void 0 && currentBaseSnapshot?.pluginIds === void 0 ? currentBaseSnapshot : void 0;
		for (const current of [snapshotsByWorkspace.get(workspaceDir), inheritedBase]) if (current && isPluginMetadataSnapshotCompatible({
			snapshot: current,
			config,
			env,
			workspaceDir: workspaceDir ?? current.workspaceDir
		})) {
			const snapshot = resolveConfigWideDoctorPluginMetadataSnapshot({
				snapshot: current,
				config,
				env
			});
			snapshotsByWorkspace.set(workspaceDir, snapshot);
			return snapshot;
		}
		const snapshot = resolveConfigWideDoctorPluginMetadataSnapshot({
			snapshot: loadPluginMetadataSnapshot({
				config,
				env,
				...workspaceDir ? { workspaceDir } : {}
			}),
			config,
			env
		});
		snapshotsByWorkspace.set(workspaceDir, snapshot);
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
		run,
		invalidate: () => {
			currentBaseSnapshot = void 0;
			snapshotsByWorkspace.clear();
			cache = createPluginCache();
		}
	};
}
//#endregion
export { createDoctorPluginMetadataSnapshotScope as n, resolveConfigWideDoctorPluginMetadataSnapshot as r, completeDoctorPluginMetadataSnapshot as t };
