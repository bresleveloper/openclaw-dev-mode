import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as resolveUpdateRehearsalRoot, r as isUpdateRehearsalReadOnlyPath } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { w as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-Cwkw6Ed6.mjs";
import "./workspace-default-BKv26wgx.mjs";
import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-BzW1QYAL.mjs";
import path from "node:path";
//#region src/plugins/doctor-migration-resources.ts
/** Select one whole-plugin data scope for both rehearsal inventory and execution. */
async function preparePluginDoctorMigrationResources(entries, params) {
	const rehearsalRoot = resolveUpdateRehearsalRoot(params.env);
	const resources = /* @__PURE__ */ new Map();
	const pluginResources = /* @__PURE__ */ new Map();
	for (const { pluginId, migration } of entries) {
		if (migration.collectBackupResources === void 0) {
			if (!params.warnings.some((warning) => warning.pluginId === pluginId)) params.warnings.push({
				kind: "undeclared-migration-resources",
				pluginId,
				message: `${pluginId} migration declares no data resources; its private state is not in the recovery set`
			});
			continue;
		}
		const resolved = await migration.collectBackupResources({
			config: params.config,
			env: params.env,
			stateDir: params.stateDir,
			serviceWorkspaceDir: tryResolveConfiguredAgentWorkspaceDir(params.config, params.env) ?? resolveDefaultAgentWorkspaceDir(params.env),
			...params.requireLocalResources ? { requireLocalResources: true } : {}
		});
		if (!Array.isArray(resolved)) throw new Error(`Invalid migration backup inventory from ${pluginId}/${migration.id}`);
		const candidates = resolved;
		for (const resource of candidates) {
			if (!isMigrationBackupResource(resource)) throw new Error(`Invalid migration backup resource from ${pluginId}/${migration.id}`);
			const resourcePath = resource.path;
			const previous = resources.get(resourcePath);
			if (previous && previous.kind !== resource.kind) throw new Error(`Conflicting migration backup resource kinds for ${resourcePath}`);
			resources.set(resourcePath, {
				path: resourcePath,
				kind: resource.kind
			});
			const paths = pluginResources.get(pluginId) ?? /* @__PURE__ */ new Set();
			paths.add(resourcePath);
			pluginResources.set(pluginId, paths);
		}
	}
	const deferredPluginIds = new Set(rehearsalRoot ? [...pluginResources].flatMap(([pluginId, paths]) => [...paths].some((file) => isUpdateRehearsalReadOnlyPath(file, params.env)) ? [pluginId] : []) : []);
	const selectedPaths = /* @__PURE__ */ new Set();
	for (const [pluginId, paths] of pluginResources) if (!deferredPluginIds.has(pluginId)) for (const resourcePath of paths) selectedPaths.add(resourcePath);
	const selectedResources = [...resources.values()].filter((resource) => selectedPaths.has(resource.path)).toSorted((left, right) => left.path.localeCompare(right.path));
	const assertCurrent = () => {
		if (!rehearsalRoot) return;
		if (resolveUpdateRehearsalRoot(params.env) !== rehearsalRoot) throw new Error("Plugin migration rehearsal scope changed during preparation");
		for (const resource of selectedResources) if (isUpdateRehearsalReadOnlyPath(resource.path, params.env)) throw new Error(`Plugin migration data escaped the rehearsal root: ${resource.path}`);
	};
	assertCurrent();
	return {
		resources: selectedResources,
		deferredPluginIds,
		notices: [...deferredPluginIds].map((pluginId) => `rehearsal: ${pluginId} state migrations deferred; declared data outside the rehearsal root left untouched`),
		assertCurrent
	};
}
/** Inspect sources for selected trusted owners before the updater replaces the service. */
async function assertPluginStateRetention(records, params) {
	for (const record of records) {
		const declared = record.doctorContract?.stateMigrations;
		if (!Array.isArray(declared)) continue;
		const retained = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
			dirName: record.id,
			artifactCandidates: ["state-retention-api.js"],
			retainedAt: params.candidateRoot
		});
		if (!retained || retained.packageName !== record.packageName) continue;
		for (const migration of retained.stateMigrations) if (declared.some(({ id }) => id === migration.id)) await migration.assertSupportedState(params);
	}
}
function isMigrationBackupResource(value) {
	return isRecord(value) && typeof value.path === "string" && path.isAbsolute(value.path) && path.normalize(value.path) === value.path && (value.kind === "sqlite" || value.kind === "file" || value.kind === "directory");
}
//#endregion
export { preparePluginDoctorMigrationResources as n, assertPluginStateRetention as t };
