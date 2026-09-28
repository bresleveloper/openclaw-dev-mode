import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import "./errors-DnjwnOju.mjs";
import { n as readGitHead, r as readGitMetadataPrefix } from "./git-root-DLNHL8nb.mjs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/infra/git-commit.ts
const formatCommit = (value) => {
	if (!value) return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	const match = trimmed.match(/[0-9a-fA-F]{7,40}/);
	if (!match) return null;
	return normalizeLowercaseStringOrEmpty(match[0].slice(0, 7));
};
function gitCommitPrefixesMatch(left, right) {
	const normalizedLeft = normalizeLowercaseStringOrEmpty(left);
	const normalizedRight = normalizeLowercaseStringOrEmpty(right);
	return normalizedLeft.length >= 7 && normalizedRight.length >= 7 && (normalizedLeft.startsWith(normalizedRight) || normalizedRight.startsWith(normalizedLeft));
}
const cachedGitCommitBySearchDir = /* @__PURE__ */ new Map();
const GIT_COMMIT_CACHE_LIMIT = 256;
const resolveCommitSearchDir = (options) => {
	if (options.cwd) return path.resolve(options.cwd);
	if (options.moduleUrl) try {
		return path.dirname(fileURLToPath(options.moduleUrl));
	} catch {}
	return process.cwd();
};
const cacheGitCommit = (searchDir, commit) => {
	cachedGitCommitBySearchDir.set(searchDir, commit);
	pruneMapToMaxSize(cachedGitCommitBySearchDir, GIT_COMMIT_CACHE_LIMIT);
	return commit;
};
const resolveGitLookupDepth = (searchDir, packageRoot) => {
	if (!packageRoot) return;
	const relative = path.relative(packageRoot, searchDir);
	if (relative.startsWith("..") || path.isAbsolute(relative)) return;
	return (relative ? relative.split(path.sep).filter(Boolean).length : 0) + 1;
};
const readCommitFromGit = (searchDir, packageRoot) => {
	const head = readGitHead(searchDir, { maxDepth: resolveGitLookupDepth(searchDir, packageRoot) });
	return head === void 0 ? void 0 : formatCommit(head.value);
};
const readCommitFromPackageJson = () => {
	try {
		const pkg = createRequire(import.meta.url)("../../package.json");
		return formatCommit(pkg.gitHead ?? pkg.githead ?? null);
	} catch {
		return null;
	}
};
const readCommitProbe = (moduleUrl, candidates, field) => {
	try {
		for (const candidate of candidates) {
			const filePath = fileURLToPath(new URL(candidate, moduleUrl));
			let raw;
			try {
				raw = readGitMetadataPrefix(filePath, 1024);
			} catch (error) {
				if (isMissingPathError(error)) continue;
				return null;
			}
			try {
				const value = asNullableRecord(JSON.parse(raw))?.[field];
				return typeof value === "string" ? formatCommit(value) : null;
			} catch {
				return null;
			}
		}
	} catch {}
};
const readCommitFromBuildInfo = (moduleUrl = import.meta.url) => {
	return readCommitProbe(moduleUrl, ["../build-info.json", "./build-info.json"], "commit") ?? null;
};
const readLoadedCommit = (moduleUrl) => {
	const buildStamp = readCommitProbe(moduleUrl, ["../.buildstamp", "./.buildstamp"], "head");
	const runtimeStamp = readCommitProbe(moduleUrl, ["../.runtime-postbuildstamp", "./.runtime-postbuildstamp"], "head");
	if (buildStamp !== void 0 || runtimeStamp !== void 0) {
		if (buildStamp || runtimeStamp) return buildStamp && buildStamp === runtimeStamp ? buildStamp : null;
		return readCommitFromBuildInfo(moduleUrl);
	}
	return readCommitProbe(moduleUrl, ["../build-info.json", "./build-info.json"], "commit");
};
const resolveCommitHash = (options = {}) => {
	const env = options.env ?? process.env;
	const readers = options.readers ?? {};
	const readGitCommit = readers.readGitCommit ?? readCommitFromGit;
	const envCommit = env.GIT_COMMIT?.trim() || env.GIT_SHA?.trim();
	const normalized = formatCommit(envCommit);
	if (normalized) return normalized;
	const searchDir = resolveCommitSearchDir(options);
	if (cachedGitCommitBySearchDir.has(searchDir)) {
		const cached = cachedGitCommitBySearchDir.get(searchDir) ?? null;
		cachedGitCommitBySearchDir.delete(searchDir);
		cachedGitCommitBySearchDir.set(searchDir, cached);
		return cached;
	}
	const packageRoot = resolveOpenClawPackageRootSync({
		cwd: options.cwd,
		moduleUrl: options.moduleUrl
	});
	try {
		const gitCommit = readGitCommit(searchDir, packageRoot);
		if (gitCommit !== void 0) return cacheGitCommit(searchDir, gitCommit);
	} catch {}
	const buildInfoCommit = readers.readBuildInfoCommit?.() ?? readCommitFromBuildInfo();
	if (buildInfoCommit) return cacheGitCommit(searchDir, buildInfoCommit);
	const pkgCommit = readers.readPackageJsonCommit?.() ?? readCommitFromPackageJson();
	if (pkgCommit) return cacheGitCommit(searchDir, pkgCommit);
	try {
		return cacheGitCommit(searchDir, readGitCommit(searchDir, packageRoot) ?? null);
	} catch {
		return cacheGitCommit(searchDir, null);
	}
};
/** Resolve the commit that produced the loaded artifact, not the checkout's current revision. */
function resolveLoadedCommitHash(options = {}) {
	const moduleUrl = options.moduleUrl ?? import.meta.url;
	const loaded = readLoadedCommit(moduleUrl);
	return loaded === void 0 ? resolveCommitHash({
		moduleUrl,
		...options.env ? { env: options.env } : {}
	}) : loaded;
}
//#endregion
export { resolveCommitHash as n, resolveLoadedCommitHash as r, gitCommitPrefixesMatch as t };
