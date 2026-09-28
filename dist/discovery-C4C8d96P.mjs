import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { c as readFileDescriptorBoundedSync, o as openRootFileSync } from "./boundary-file-read-D-Aa04On.mjs";
import { r as isPathInsideWithRealpath } from "./path-safety-0BfxAYBQ.mjs";
import "./includes-CaaCq-XN.mjs";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.mjs";
import { f as parseFrontmatterBlockResult } from "./frontmatter-BdjKgRi1.mjs";
import { i as resolveHookManifestMetadata, n as resolveHookInvocationPolicy } from "./frontmatter-Cb3BnaSU.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/hooks/discovery.ts
const HOOK_METADATA_MAX_BYTES = 1048576;
function readHookPackagePaths(dir, warn) {
	const raw = readRootFileUtf8({
		absolutePath: path.join(dir, "package.json"),
		rootPath: dir,
		boundaryLabel: "hook package directory",
		maxBytes: HOOK_METADATA_MAX_BYTES
	}, warn);
	const manifest = raw === null ? void 0 : asOptionalObjectRecord(safeParseJson(raw));
	return normalizeTrimmedStringList(asOptionalObjectRecord(manifest?.[MANIFEST_KEY])?.hooks);
}
function resolveContainedDir(baseDir, targetDir) {
	const base = path.resolve(baseDir);
	const resolved = path.resolve(baseDir, targetDir);
	if (!isPathInsideWithRealpath(base, resolved, { requireRealpath: true })) return null;
	return resolved;
}
function loadHookFromDir(params, warn) {
	const hookMdPath = path.join(params.hookDir, "HOOK.md");
	const content = readRootFileUtf8({
		absolutePath: hookMdPath,
		rootPath: params.hookDir,
		boundaryLabel: "hook directory",
		maxBytes: HOOK_METADATA_MAX_BYTES
	}, warn);
	if (content === null) return null;
	try {
		const { frontmatter, issues } = parseFrontmatterBlockResult(content);
		const name = frontmatter.name || path.basename(params.hookDir);
		const description = frontmatter.description || "";
		const handlerCandidates = [
			"handler.ts",
			"handler.js",
			"index.ts",
			"index.js"
		];
		let handlerPath;
		for (const candidate of handlerCandidates) {
			const safeCandidatePath = resolveRootFilePath({
				absolutePath: path.join(params.hookDir, candidate),
				rootPath: params.hookDir,
				boundaryLabel: "hook directory"
			});
			if (safeCandidatePath) {
				handlerPath = safeCandidatePath;
				break;
			}
		}
		if (!handlerPath) warn?.(`Hook "${name}" has HOOK.md but no readable handler in ${params.hookDir}`);
		let baseDir = params.hookDir;
		try {
			baseDir = fs.realpathSync.native(params.hookDir);
		} catch {}
		return {
			hook: {
				name,
				description,
				source: params.source,
				pluginId: params.pluginId,
				filePath: hookMdPath,
				baseDir,
				handlerPath
			},
			frontmatter,
			invalidMetadata: issues.length > 0,
			metadata: resolveHookManifestMetadata(frontmatter),
			invocation: resolveHookInvocationPolicy(frontmatter)
		};
	} catch (err) {
		const message = err instanceof Error ? err.stack ?? err.message : String(err);
		warn?.(`Failed to load hook from ${params.hookDir}: ${message}`);
		return null;
	}
}
function loadHooksFromCandidate(params, warn) {
	const { hookDir, source, pluginId } = params;
	const packageHooks = readHookPackagePaths(hookDir, warn);
	if (packageHooks.length === 0) {
		if (!fs.existsSync(path.join(hookDir, "HOOK.md"))) return null;
		const hook = loadHookFromDir(params, warn);
		return hook ? [hook] : [];
	}
	const hooks = [];
	for (const hookPath of packageHooks) {
		const resolvedHookDir = resolveContainedDir(hookDir, hookPath);
		if (!resolvedHookDir) {
			warn?.(`Ignoring out-of-package hook path "${hookPath}" in ${hookDir} (must be within package directory)`);
			continue;
		}
		const hook = loadHookFromDir({
			hookDir: resolvedHookDir,
			source,
			pluginId
		}, warn);
		if (hook) hooks.push(hook);
	}
	return hooks;
}
function loadHookEntriesFromDir(params, warn) {
	const { dir, source, pluginId } = params;
	if (params.rootDir && !isPathInsideWithRealpath(params.rootDir, dir, { requireRealpath: true })) {
		warn?.(`Plugin hook path is missing or escapes plugin root (${pluginId}): ${dir}`);
		return [];
	}
	if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];
	return (params.includeRoot ? loadHooksFromCandidate({
		hookDir: dir,
		source,
		pluginId
	}, warn) : null) ?? fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		if (!entry.isDirectory()) return [];
		return loadHooksFromCandidate({
			hookDir: path.join(dir, entry.name),
			source,
			pluginId
		}, warn) ?? [];
	});
}
function readRootFileUtf8(params, warn) {
	return withOpenedRootFileSync(params, (opened) => {
		try {
			return readFileDescriptorBoundedSync(opened.fd, params.maxBytes).toString("utf-8");
		} catch (err) {
			if (err instanceof RangeError) warn?.(`Ignoring oversized hook metadata ${params.absolutePath}: file exceeds the ${params.maxBytes}-byte limit`);
			return null;
		}
	});
}
function withOpenedRootFileSync(params, read) {
	const opened = openRootFileSync({
		absolutePath: params.absolutePath,
		rootPath: params.rootPath,
		boundaryLabel: params.boundaryLabel,
		rejectSymlinks: false
	});
	if (!opened.ok) return null;
	try {
		return read({
			fd: opened.fd,
			path: opened.path
		});
	} finally {
		fs.closeSync(opened.fd);
	}
}
function resolveRootFilePath(params) {
	return withOpenedRootFileSync(params, (opened) => opened.path);
}
//#endregion
export { loadHookEntriesFromDir as t };
