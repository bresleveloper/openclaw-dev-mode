import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Un as record } from "./schemas-BOYIvvln.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { i as resolvePackageExtensionEntries, l as pluginCacheRealpathSync } from "./package-manifest-C8sTeZKW.mjs";
import { i as isPluginInPackageBundledRoots, o as resolveBundledDirFromPackageRoot, s as resolveBundledPluginsDir } from "./bundled-dir-BGJkK8G5.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { t as INSTALLED_PLUGIN_INDEX_STATE_KEY } from "./installed-plugin-index-row-DAPhfvfQ.mjs";
import { i as resolvePluginPackageEntries, r as resolveBundledSourceCheckoutExtensionsDir, t as discoverConfiguredPluginLoadPaths } from "./discovery-D_5mAUI7.mjs";
import "./manifest-DHkEL08H.mjs";
import { f as parsePluginInstallRecordMap, p as serializePluginInstallRecordMap } from "./installed-plugin-record-match-CPrj3NTo.mjs";
import { n as loadBundledPluginManifestRegistry } from "./manifest-registry-build-BbQTPsvD.mjs";
import { n as listBundledPluginMetadata } from "./bundled-plugin-metadata-DiURDLnU.mjs";
import { n as resolveUpdateCandidatePluginPath } from "./update-candidate-paths-DRbpl9-r.mjs";
import { i as relocateRuntimePath } from "./update-runtime-relocation-YSSIn7u2.mjs";
import { n as inspectPluginSourceDependencies } from "./plugin-generation-source-inspection-BYmIVGn4.mjs";
import { t as resolveUpdateCandidatePluginSourceEntries } from "./update-candidate-plugin-sources-B5durtg6.mjs";
import { i as prepareUpdateCandidatePluginTrees, n as assertUpdateCandidatePluginCopySource, r as copyUpdateCandidatePluginTrees, t as UpdateCandidatePluginTreePlanSchema } from "./update-candidate-plugin-tree-BIliVjO7.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/update-candidate-plugins.ts
function bundledPluginRedirects(candidateRoot, env) {
	const redirects = /* @__PURE__ */ new Map();
	const sourceDir = resolveBundledPluginsDir(env);
	const sourcePackageRoot = sourceDir && resolveOpenClawPackageRootSync({ cwd: sourceDir });
	const candidateDir = resolveBundledDirFromPackageRoot(candidateRoot);
	if (!sourceDir || !sourcePackageRoot || !candidateDir || !isPluginInPackageBundledRoots({
		rootDir: candidateDir,
		packageRoot: candidateRoot
	})) return redirects;
	const bundledEnv = {
		...env,
		OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS: "1"
	};
	const candidates = new Map(loadBundledPluginManifestRegistry({
		env: bundledEnv,
		bundledRoot: candidateDir
	}).plugins.map((plugin) => [plugin.id, plugin]));
	for (const directory of [sourceDir, resolveBundledSourceCheckoutExtensionsDir(sourceDir)]) {
		if (!directory || !isPluginInPackageBundledRoots({
			rootDir: directory,
			packageRoot: sourcePackageRoot
		})) continue;
		const sourceReal = pluginCacheRealpathSync(directory, true);
		if (!sourceReal) continue;
		for (const source of listBundledPluginMetadata({
			scanDir: directory,
			includeChannelConfigs: false
		})) {
			const sourceRoot = pluginCacheRealpathSync(path.join(directory, source.dirName), true);
			if (!sourceRoot || !isPathInside(sourceReal, sourceRoot)) continue;
			const manifest = {
				name: source.packageName,
				openclaw: source.packageManifest
			};
			const extensions = resolvePackageExtensionEntries(manifest);
			if (extensions.status !== "ok") continue;
			const entries = resolvePluginPackageEntries({
				packageDir: sourceRoot,
				packageRootRealPath: sourceRoot,
				manifest,
				manifestId: source.manifest.id,
				extensions: extensions.entries,
				origin: "bundled",
				sourceLabel: sourceRoot,
				diagnostics: [],
				rejectHardlinks: false
			});
			let allEntriesMatched = entries.length === extensions.entries.length;
			const candidateRoots = /* @__PURE__ */ new Set();
			for (const entry of entries) {
				const candidate = candidates.get(entry.idHint);
				if (!candidate || path.parse(entry.source).name !== path.parse(candidate.source).name) {
					allEntriesMatched = false;
					continue;
				}
				const from = pluginCacheRealpathSync(entry.source, true);
				const to = pluginCacheRealpathSync(candidate.source, true);
				const targetRoot = pluginCacheRealpathSync(candidate.rootDir, true);
				if (!from || !to || !targetRoot || !isPathInside(sourceRoot, from) || !isPathInside(targetRoot, to) || !isPluginInPackageBundledRoots({
					rootDir: targetRoot,
					packageRoot: candidateRoot
				})) {
					allEntriesMatched = false;
					continue;
				}
				redirects.set(from, to);
				const declared = pluginCacheRealpathSync(path.resolve(sourceRoot, entry.entryPath), true);
				if (declared && isPathInside(sourceRoot, declared)) redirects.set(declared, to);
				candidateRoots.add(targetRoot);
			}
			const [targetRoot] = candidateRoots;
			if (allEntriesMatched && candidateRoots.size === 1 && targetRoot) redirects.set(sourceRoot, targetRoot);
		}
	}
	return redirects;
}
async function resolvePluginFilePackageRoot(file) {
	const directory = path.dirname(file);
	for (let current = directory;; current = path.dirname(current)) {
		if (await fs.access(path.join(current, "package.json")).then(() => true, (error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return false;
			throw error;
		})) return current;
		if (path.dirname(current) === current) return directory;
	}
}
const UpdateCandidatePluginPlanSchema = object({
	bytes: number().int().nonnegative(),
	stateDir: string(),
	installRecordsHash: string().nullable(),
	configInstallRecordsHash: string(),
	configLoadPaths: array(string()),
	bindings: array(object({
		source: string(),
		real: string().nullable(),
		dev: string().nullable(),
		ino: string().nullable()
	})),
	pluginPaths: record(string(), string()),
	recordPaths: record(string(), object({
		installPath: string().optional(),
		sourcePath: string().optional()
	})),
	aliases: array(object({
		alias: string(),
		target: string(),
		file: boolean()
	})),
	trees: UpdateCandidatePluginTreePlanSchema
});
function installRecordsHash(records) {
	return sha256Hex(serializePluginInstallRecordMap(records));
}
async function readCopiedPluginIndex(shared) {
	if (await fs.stat(shared).then(() => true, (error) => {
		if (hasNodeErrorCode(error, "ENOENT")) return false;
		throw error;
	})) {
		const db = openNodeSqliteDatabase(shared, { readOnly: true });
		try {
			if (tableExists(db, "config_machine_state")) {
				const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", INSTALLED_PLUGIN_INDEX_STATE_KEY));
				if (row) {
					const parsed = JSON.parse(row.value_json);
					if (!isRecord(parsed) || !isRecord(parsed.index)) throw new Error("Invalid copied plugin index");
					const installed = parsePluginInstallRecordMap(parsed.index.installRecords);
					if (!installed) throw new Error("Invalid copied plugin install records");
					return {
						value: parsed,
						records: installed
					};
				}
			}
		} finally {
			db.close();
		}
	}
}
/** Inventory reads only private SQLite state and freezes the complete plugin projection. */
async function prepareUpdateCandidatePlugins(params) {
	const sourceRoot = path.resolve(params.stateDir);
	const targetStateDir = resolvePathViaExistingAncestorSync(path.resolve(params.targetStateDir));
	const copied = await readCopiedPluginIndex(params.sharedStateDatabasePath ?? path.join(targetStateDir, "state", "openclaw.sqlite"));
	const records = copied?.records ?? params.config.plugins?.installs ?? {};
	const resolve = (locator) => resolveUserPath(locator, params.env);
	const canonicalStateRoot = await fs.realpath(sourceRoot).catch((error) => {
		if (hasNodeErrorCode(error, "ENOENT")) return sourceRoot;
		throw error;
	});
	const project = (source) => resolveUpdateCandidatePluginPath(canonicalStateRoot, targetStateDir, source);
	const bindings = [];
	const locators = [];
	const roots = /* @__PURE__ */ new Map();
	const npmProjects = path.join(canonicalStateRoot, "npm", "projects");
	const npmModules = path.join(canonicalStateRoot, "npm", "node_modules");
	const allRecords = Object.values(records).concat(Object.values(params.config.plugins?.installs ?? {}));
	const sources = new Set(allRecords.flatMap((record) => [record.installPath, record.source === "path" ? record.sourcePath : void 0]).filter((locator) => typeof locator === "string" && locator.length > 0).map(resolve));
	for (const source of params.config.plugins?.load?.paths ?? []) sources.add(resolve(source));
	const bundledRedirects = sources.size > 0 ? bundledPluginRedirects(params.candidateRoot, params.env) : /* @__PURE__ */ new Map();
	const pluginPaths = {};
	for (const source of sources) {
		const stat = await fs.stat(source, { bigint: true }).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return;
			throw error;
		});
		if (!stat) {
			pluginPaths[source] = project(source);
			bindings.push({
				source,
				real: null,
				dev: null,
				ino: null
			});
			continue;
		}
		const real = await fs.realpath(source);
		bindings.push({
			source,
			real,
			dev: stat.dev.toString(),
			ino: stat.ino.toString()
		});
		const bundled = bundledRedirects.get(real);
		if (bundled) {
			pluginPaths[source] = bundled;
			continue;
		}
		const file = stat.isFile();
		locators.push({
			source,
			real,
			file,
			preserveBasename: path.basename(source) !== path.basename(real)
		});
		const owner = isPathInside(npmProjects, real) ? path.join(npmProjects, path.relative(npmProjects, real).split(path.sep)[0]) : isPathInside(npmModules, real) ? npmModules : file ? await resolvePluginFilePackageRoot(real) : real;
		if (!roots.has(owner)) roots.set(owner, project(owner));
	}
	for (const source of roots.keys()) assertUpdateCandidatePluginCopySource(source, targetStateDir);
	const dependencies = inspectPluginSourceDependencies(resolveUpdateCandidatePluginSourceEntries(discoverConfiguredPluginLoadPaths({
		loadPaths: locators.map(({ real }) => real),
		env: params.env
	}).candidates, params.config));
	for (const source of [...dependencies.packageRoots, ...dependencies.files]) if (![...roots.keys()].some((root) => isPathInside(root, source))) roots.set(source, project(source));
	const trees = await prepareUpdateCandidatePluginTrees({
		roots,
		project,
		targetStateDir,
		candidateRoot: params.candidateRoot,
		onProgress: params.onProgress
	});
	dependencies.assertSourceCurrent();
	const aliases = [];
	for (const { source, real, file, preserveBasename } of locators) {
		const copy = trees.copies.find(([directory]) => isPathInside(directory, real));
		if (!copy) throw new Error("Plugin payload has no private copy root");
		const target = path.join(copy[1], path.relative(copy[0], real));
		const alias = preserveBasename ? project(source) : target;
		if (alias !== target) aliases.push({
			alias,
			target,
			file
		});
		pluginPaths[source] = alias;
	}
	const recordPaths = Object.fromEntries(Object.entries(records).map(([id, record]) => {
		const locations = {};
		for (const key of ["installPath", "sourcePath"]) {
			const locator = key === "sourcePath" && record.source !== "path" ? void 0 : record[key];
			if (!locator) continue;
			const projected = pluginPaths[resolve(locator)];
			if (!projected) throw new Error("Plugin record locator was not inventoried");
			locations[key] = projected;
		}
		return [id, locations];
	}));
	return {
		bytes: trees.bytes + aliases.length * 4096,
		stateDir: sourceRoot,
		installRecordsHash: copied ? installRecordsHash(copied.records) : null,
		configInstallRecordsHash: installRecordsHash(params.config.plugins?.installs ?? {}),
		configLoadPaths: [...params.config.plugins?.load?.paths ?? []],
		bindings,
		pluginPaths,
		recordPaths,
		aliases,
		trees
	};
}
/** Rebind admitted paths only; newer records or locator owners require a fresh inventory. */
async function copyUpdateCandidatePlugins(plan, params) {
	const targetStateDir = resolvePathViaExistingAncestorSync(path.resolve(params.targetStateDir));
	if (plan.stateDir !== path.resolve(params.stateDir)) throw new Error("Plugin state root changed after snapshot inventory");
	const shared = path.join(targetStateDir, "state", "openclaw.sqlite");
	const copied = await readCopiedPluginIndex(shared);
	if ((copied ? installRecordsHash(copied.records) : null) !== plan.installRecordsHash) throw new Error("Plugin install records changed after snapshot inventory");
	if (installRecordsHash(params.config.plugins?.installs ?? {}) !== plan.configInstallRecordsHash || !isDeepStrictEqual(params.config.plugins?.load?.paths ?? [], plan.configLoadPaths)) throw new Error("Configured plugin locators changed after snapshot inventory");
	const assertBindings = async () => {
		for (const binding of plan.bindings) {
			const stat = await fs.stat(binding.source, { bigint: true }).catch((error) => {
				if (hasNodeErrorCode(error, "ENOENT")) return;
				throw error;
			});
			if ((stat ? await fs.realpath(binding.source) : null) !== binding.real || (stat?.dev.toString() ?? null) !== binding.dev || (stat?.ino.toString() ?? null) !== binding.ino) throw new Error(`Plugin locator changed after snapshot inventory: ${binding.source}`);
		}
	};
	const rebase = (file) => relocateRuntimePath(file, [{
		sourceRoot: plan.trees.privateRoot,
		destinationRoot: targetStateDir
	}]);
	await assertBindings();
	await copyUpdateCandidatePluginTrees(plan.trees, params);
	await assertBindings();
	for (const entry of plan.aliases) {
		const alias = rebase(entry.alias);
		const target = rebase(entry.target);
		const [existing, targetIdentity] = await Promise.all([fs.stat(alias, { bigint: true }).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return;
			throw error;
		}), fs.stat(target, { bigint: true })]);
		if (!existing || !sameFileIdentity(existing, targetIdentity)) {
			await fs.mkdir(path.dirname(alias), { recursive: true });
			await fs.rm(alias, { force: true });
			await fs.symlink(target, alias, entry.file ? "file" : process.platform === "win32" ? "junction" : "dir");
		}
	}
	if (copied) {
		const projected = structuredClone(copied.records);
		for (const [id, locations] of Object.entries(plan.recordPaths)) {
			const record = projected[id];
			if (!record) throw new Error("Plugin install records changed after snapshot inventory");
			if (locations.sourcePath) record.sourcePath = rebase(locations.sourcePath);
			if (locations.installPath) record.installPath = rebase(locations.installPath);
		}
		const next = {
			...copied.value,
			index: { installRecords: projected }
		};
		const db = openNodeSqliteDatabase(shared);
		try {
			executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("config_machine_state").set({ value_json: JSON.stringify(next) }).where("state_key", "=", INSTALLED_PLUGIN_INDEX_STATE_KEY));
		} finally {
			db.close();
		}
	}
	return Object.fromEntries(Object.entries(plan.pluginPaths).map(([source, target]) => [source, rebase(target)]));
}
//#endregion
export { UpdateCandidatePluginPlanSchema, copyUpdateCandidatePlugins, prepareUpdateCandidatePlugins };
