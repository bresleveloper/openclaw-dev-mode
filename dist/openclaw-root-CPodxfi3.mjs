import { c as getPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import openClawRootFsSync from "node:fs";
import { fileURLToPath } from "node:url";
import openClawRootFs from "node:fs/promises";
import path from "node:path";
//#region src/infra/openclaw-root.ts
const PNPM_VERSIONED_OPENCLAW_ENTRY_PATTERN = /^(.*?)([\\/])node_modules\2\.pnpm\2openclaw@[^\\/]+\2node_modules\2openclaw\2.+$/;
/** Keeps replacement and respawn on pnpm's stable package link. */
function rewritePnpmVersionedOpenClawEntryPath(entryPath) {
	return entryPath.replace(PNPM_VERSIONED_OPENCLAW_ENTRY_PATTERN, "$1$2node_modules$2openclaw$2openclaw.mjs");
}
/** Capture an installation path while its link still belongs to the running package. */
function resolveOpenClawInstallationRootSync(runningRoot, argv1) {
	const launcherRoot = argv1 ? findPackageRootSync(path.dirname(path.resolve(argv1))) : null;
	const pnpmRoot = path.dirname(rewritePnpmVersionedOpenClawEntryPath(path.join(runningRoot, "openclaw.mjs")));
	for (const candidate of [launcherRoot, pnpmRoot]) {
		if (!candidate || candidate === runningRoot) continue;
		try {
			if (openClawRootFsSync.realpathSync(candidate) === openClawRootFsSync.realpathSync(runningRoot)) return candidate;
		} catch {}
	}
	return runningRoot;
}
function parsePackageName(raw) {
	const parsed = JSON.parse(raw);
	return typeof parsed.name === "string" ? parsed.name : null;
}
async function readPackageName(dir) {
	const packageNameCache = getPluginCache().sdk.packageNames;
	const packageJsonPath = path.join(path.resolve(dir), "package.json");
	if (packageNameCache.has(packageJsonPath)) return packageNameCache.get(packageJsonPath) ?? null;
	try {
		const name = parsePackageName(await openClawRootFs.readFile(packageJsonPath, "utf-8"));
		packageNameCache.set(packageJsonPath, name);
		return name;
	} catch {
		packageNameCache.set(packageJsonPath, null);
		return null;
	}
}
function readPackageNameSync(dir) {
	const packageNameCache = getPluginCache().sdk.packageNames;
	const packageJsonPath = path.join(path.resolve(dir), "package.json");
	if (packageNameCache.has(packageJsonPath)) return packageNameCache.get(packageJsonPath) ?? null;
	try {
		const name = parsePackageName(openClawRootFsSync.readFileSync(packageJsonPath, "utf-8"));
		packageNameCache.set(packageJsonPath, name);
		return name;
	} catch {
		packageNameCache.set(packageJsonPath, null);
		return null;
	}
}
async function findPackageRoot(startDir, maxDepth = 12) {
	for (const current of iterAncestorDirs(startDir, maxDepth)) if (await readPackageName(current) === "openclaw") return current;
	return null;
}
function findPackageRootSync(startDir, maxDepth = 12) {
	for (const current of iterAncestorDirs(startDir, maxDepth)) if (readPackageNameSync(current) === "openclaw") return current;
	return null;
}
function* iterAncestorDirs(startDir, maxDepth) {
	let current = path.resolve(startDir);
	for (let i = 0; i < maxDepth; i += 1) {
		yield current;
		if (path.basename(current) === "node_modules") break;
		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}
}
function candidateDirsFromArgv1(argv1) {
	const argv1CandidateCache = getPluginCache().sdk.argvDirectories;
	const cacheKey = path.resolve(argv1);
	const cached = argv1CandidateCache.get(cacheKey);
	if (cached) return [...cached];
	const normalized = cacheKey;
	const candidates = [];
	try {
		const resolved = openClawRootFsSync.realpathSync(normalized);
		if (resolved !== normalized) candidates.push(path.dirname(resolved));
	} catch {}
	candidates.push(path.dirname(normalized));
	const parts = normalized.split(path.sep);
	const binIndex = parts.lastIndexOf(".bin");
	if (binIndex > 0 && parts[binIndex - 1] === "node_modules") {
		const binName = path.basename(normalized);
		const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
		candidates.push(path.join(nodeModulesDir, binName));
	}
	const deduped = dedupeCandidates(candidates);
	argv1CandidateCache.set(cacheKey, deduped);
	return [...deduped];
}
function preparePackageRootSearch(opts, preserveInventory) {
	const candidates = buildCandidates(opts);
	const cacheKey = candidates.join("\0");
	const searches = getPluginCache().sdk.packageSearches;
	const cached = searches.get(cacheKey);
	return {
		candidates,
		first: cached?.all ? cached.all[0] ?? null : cached?.first,
		complete(first) {
			searches.set(cacheKey, preserveInventory ? {
				...searches.get(cacheKey),
				first
			} : { first });
			return first;
		}
	};
}
async function resolveOpenClawPackageRoot(opts) {
	const search = preparePackageRootSearch(opts, true);
	if (search.first !== void 0) return search.first;
	for (const candidate of search.candidates) {
		const found = await findPackageRoot(candidate);
		if (found) return search.complete(found);
	}
	return search.complete(null);
}
function resolveOpenClawPackageRootsSync(opts) {
	const candidates = buildCandidates(opts);
	const cacheKey = candidates.join("\0");
	const searches = getPluginCache().sdk.packageSearches;
	const cached = searches.get(cacheKey)?.all;
	if (cached) return [...cached];
	const seen = /* @__PURE__ */ new Set();
	const roots = [];
	for (const candidate of candidates) {
		const found = findPackageRootSync(candidate);
		if (found && !seen.has(found)) {
			seen.add(found);
			roots.push(found);
		}
	}
	searches.set(cacheKey, { all: roots });
	return [...roots];
}
function resolveOpenClawPackageRootSync(opts) {
	const search = preparePackageRootSearch(opts, false);
	if (search.first !== void 0) return search.first;
	for (const candidate of search.candidates) {
		const found = findPackageRootSync(candidate);
		if (found) return search.complete(found);
	}
	return search.complete(null);
}
function buildCandidates(opts) {
	const candidates = [];
	if (opts.moduleUrl) try {
		candidates.push(path.dirname(fileURLToPath(opts.moduleUrl)));
	} catch {}
	if (opts.argv1) candidates.push(...candidateDirsFromArgv1(opts.argv1));
	if (opts.cwd) candidates.push(opts.cwd);
	return dedupeCandidates(candidates);
}
function dedupeCandidates(candidates) {
	return [...new Set(candidates.map((candidate) => path.resolve(candidate)))];
}
//#endregion
export { rewritePnpmVersionedOpenClawEntryPath as a, resolveOpenClawPackageRootsSync as i, resolveOpenClawPackageRoot as n, resolveOpenClawPackageRootSync as r, resolveOpenClawInstallationRootSync as t };
