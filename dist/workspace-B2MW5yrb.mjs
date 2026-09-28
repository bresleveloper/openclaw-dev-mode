import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { r as resolveHookEntries } from "./policy-D4HXkRoG.mjs";
import { t as iteratePluginRootContributions } from "./plugin-root-contributions-ESP9k-MN.mjs";
import { t as loadHookEntriesFromDir } from "./discovery-C4C8d96P.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/hooks/bundled-dir.ts
function resolveBundledHooksDir() {
	const override = process.env.OPENCLAW_BUNDLED_HOOKS_DIR?.trim();
	if (override) return override;
	try {
		const execDir = path.dirname(process.execPath);
		const sibling = path.join(execDir, "hooks", "bundled");
		if (fs.existsSync(sibling)) return sibling;
	} catch {}
	try {
		const moduleDir = path.dirname(fileURLToPath(import.meta.url));
		const distBundled = path.join(moduleDir, "bundled");
		if (fs.existsSync(distBundled)) return distBundled;
	} catch {}
	try {
		const moduleDir = path.dirname(fileURLToPath(import.meta.url));
		const root = path.resolve(moduleDir, "..", "..");
		const srcBundled = path.join(root, "src", "hooks", "bundled");
		if (fs.existsSync(srcBundled)) return srcBundled;
	} catch {}
}
//#endregion
//#region src/hooks/plugin-hooks.ts
/** Resolve hook directories declared by active plugin manifests. */
function resolvePluginHookDirs(params) {
	const workspaceDir = (params.workspaceDir ?? "").trim();
	if (!workspaceDir) return [];
	const metadataSnapshot = resolvePluginMetadataSnapshot({
		workspaceDir,
		config: params.config,
		env: process.env
	});
	if (metadataSnapshot.manifestRegistry.plugins.length === 0) return [];
	const seen = /* @__PURE__ */ new Set();
	const resolved = [];
	for (const { record, roots } of iteratePluginRootContributions({
		metadataSnapshot,
		config: params.config,
		contribution: "hooks"
	})) for (const raw of roots) {
		const trimmed = raw.trim();
		if (!trimmed) continue;
		const candidate = path.resolve(record.rootDir, trimmed);
		if (seen.has(candidate)) continue;
		seen.add(candidate);
		resolved.push({
			dir: candidate,
			pluginId: record.id,
			rootDir: record.rootDir
		});
	}
	return resolved;
}
//#endregion
//#region src/hooks/workspace.ts
const log = createSubsystemLogger("hooks/workspace");
function resolveHookDiscoveryRoots(workspaceDir, opts) {
	const bundledHooksDir = opts?.bundledHooksDir ?? resolveBundledHooksDir();
	return [
		...normalizeTrimmedStringList(opts?.config?.hooks?.internal?.load?.extraDirs).map((dir) => ({
			dir: resolveUserPath(dir),
			source: "openclaw-managed",
			includeRoot: true
		})),
		...bundledHooksDir ? [{
			dir: bundledHooksDir,
			source: "openclaw-bundled"
		}] : [],
		...resolvePluginHookDirs({
			workspaceDir,
			config: opts?.config
		}).map(({ dir, pluginId, rootDir }) => ({
			dir,
			pluginId,
			rootDir,
			source: "openclaw-plugin"
		})),
		{
			dir: opts?.managedHooksDir ?? path.join(CONFIG_DIR, "hooks"),
			source: "openclaw-managed"
		},
		{
			dir: path.join(workspaceDir, "hooks"),
			source: "openclaw-workspace"
		}
	];
}
/** Prepare source-policy facts separately from executable, freshly discovered handlers. */
function prepareWorkspaceHookEntries(workspaceDir, opts) {
	const candidates = resolveHookDiscoveryRoots(workspaceDir, opts).flatMap((root) => {
		const rootId = JSON.stringify([
			root.source,
			path.resolve(root.dir),
			root.pluginId,
			Boolean(root.includeRoot),
			root.rootDir
		]);
		const entries = loadHookEntriesFromDir(root, log.warn).map((entry) => ({
			rootId,
			filePath: entry.hook.filePath,
			hook: {
				name: entry.hook.name,
				source: entry.hook.source
			},
			metadata: entry.metadata,
			entry
		}));
		for (const previous of opts?.previousSources ?? []) {
			if (previous.rootId !== rootId) continue;
			const index = entries.findIndex((candidate) => candidate.filePath === previous.filePath);
			const entry = entries[index]?.entry;
			if (entry && !entry.invalidMetadata && entry.metadata?.events.length) continue;
			if (index >= 0) entries.splice(index, 1);
			entries.push({
				...previous,
				entry
			});
		}
		return entries;
	});
	const resolved = resolveHookEntries(opts?.requireValidHook ? candidates : candidates.filter(({ entry }) => entry?.hook.handlerPath), { onCollisionIgnored: ({ name, kept, ignored }) => {
		log.warn(`Ignoring ${ignored.hook.source} hook "${name}" because it cannot override ${kept.hook.source} hook code`);
	} });
	return {
		entries: resolved.flatMap((candidate) => {
			const { entry } = candidate;
			if (opts?.requireValidHook) {
				if (!opts.requireValidHook(candidate)) return [];
				if (!entry || entry.invalidMetadata || !entry.metadata?.events.length) throw new Error(`Hook "${candidate.hook.name}" has missing or invalid metadata at ${candidate.filePath}`);
				if (!entry.hook.handlerPath) throw new Error(`Hook "${candidate.hook.name}" has no readable handler in ${entry.hook.baseDir}`);
			}
			return entry ? [entry] : [];
		}).filter((entry) => Boolean(entry.hook.handlerPath)),
		sources: resolved.map(({ rootId, filePath, hook, metadata }) => ({
			rootId,
			filePath,
			hook,
			metadata
		}))
	};
}
/** Inspect hooks best-effort without retaining an active generation's source obligations. */
function loadWorkspaceHookEntries(workspaceDir, opts) {
	return prepareWorkspaceHookEntries(workspaceDir, opts).entries;
}
//#endregion
export { prepareWorkspaceHookEntries as n, loadWorkspaceHookEntries as t };
