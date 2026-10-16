import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as isNodeRuntime, t as isBunRuntime } from "./runtime-binary-BAwmhhZ0.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as matchesVersionManagerPath } from "./version-manager-path-CORhhR2Q.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { l as isSupportedOpenClawNodeVersion, n as SUPPORTED_NODE_VERSIONS } from "./node-version-DdJ6cN09.mjs";
import { a as nodeRuntimeNote, i as nodeRuntimeFailure, r as isSqliteWalResetSafeVersion, t as SQLITE_CAPABILITY_PROBE } from "./node-sqlite-DWn4GVXM.mjs";
import "./bun-sqlite-library-CBSPJxTD.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { i as getWindowsProgramFilesRoots } from "./windows-install-roots-Qi4d52Il.mjs";
import { n as runExec } from "./exec-DJvyCA0D.mjs";
import { i as isSupportedBunVersion, o as parseSemver } from "./runtime-guard-BoZCdLcu.mjs";
import { t as stableHomebrewNodePathCandidates } from "./stable-node-path-gbtKbqE-.mjs";
import fs, { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { pathExists } from "@openclaw/fs-safe/advanced";
//#region src/infra/stable-node-path.ts
/**
* Homebrew Cellar paths (e.g. /opt/homebrew/Cellar/node/25.7.0/bin/node)
* break when Homebrew upgrades Node and removes the old version directory.
* Resolve these to a stable Homebrew-managed path that survives upgrades:
*   - Default formula "node":  <prefix>/opt/node/bin/node  or  <prefix>/bin/node
*   - Versioned formula "node@22":  <prefix>/opt/node@22/bin/node  (keg-only)
*/
async function resolveStableNodePath(nodePath) {
	for (const candidate of stableHomebrewNodePathCandidates(nodePath)) if (await pathExists(candidate)) return candidate;
	return nodePath;
}
//#endregion
//#region src/daemon/service-path-policy.ts
/** Classifies service PATH entries that should not be frozen into daemons. */
function normalizeServicePathEntry(entry, platform) {
	const normalized = (platform === "win32" ? path.win32 : path.posix).normalize(entry).replaceAll("\\", "/");
	if (platform === "win32") return normalizeLowercaseStringOrEmpty(normalized);
	return normalized;
}
function isNonMinimalServicePathEntry(entry, platform) {
	if (platform === "win32") return false;
	const normalized = normalizeServicePathEntry(entry, platform);
	return matchesVersionManagerPath(normalized, "service-path") || normalized.includes("/pnpm/") || normalized.endsWith("/pnpm");
}
function mergeServicePath(nextPath, existingPath, tmpDir, platform) {
	const segments = [];
	const seen = /* @__PURE__ */ new Set();
	const normalizedTmpDirs = [tmpDir, os.tmpdir()].map((value) => value?.trim()).filter((value) => Boolean(value)).map((value) => path.resolve(value));
	const realTmpDirs = normalizedTmpDirs.map((tmpRoot) => {
		try {
			return path.normalize(fs.realpathSync.native(tmpRoot));
		} catch {
			return tmpRoot;
		}
	});
	const isSameOrChildPath = (candidate, parent) => candidate === parent || candidate.startsWith(`${parent}${path.sep}`);
	const isUnsafeProcPath = (candidate) => candidate === `${path.sep}proc` || candidate.startsWith(`${path.sep}proc${path.sep}`);
	const normalizePreservedPathSegment = (segment) => {
		if (!path.isAbsolute(segment)) return;
		const normalized = path.normalize(segment);
		if (isUnsafeProcPath(normalized)) return;
		const cwd = path.resolve(process.cwd());
		if (isSameOrChildPath(normalized, cwd)) return;
		const realSegment = resolveIdentityPathViaExistingAncestorSync(normalized);
		try {
			const realCwd = path.normalize(fs.realpathSync.native(cwd));
			if (isSameOrChildPath(realSegment, realCwd)) return;
		} catch {}
		if (isNonMinimalServicePathEntry(normalized, platform)) return;
		return [...normalizedTmpDirs, ...realTmpDirs].some((tmpRoot) => isSameOrChildPath(normalized, tmpRoot) || isSameOrChildPath(realSegment, tmpRoot)) ? void 0 : normalized;
	};
	const addPath = (value, options) => {
		if (typeof value !== "string" || value.trim().length === 0) return;
		for (const segment of value.split(path.delimiter)) {
			const trimmed = segment.trim();
			const candidate = options?.preserve ? normalizePreservedPathSegment(trimmed) : trimmed;
			if (!candidate || seen.has(candidate)) continue;
			seen.add(candidate);
			segments.push(candidate);
		}
	};
	addPath(nextPath);
	if (platform !== "darwin") {
		addPath(existingPath, { preserve: true });
		const platformPath = platform === "win32" ? path.win32 : path.posix;
		const normalizeOrderEntry = (entry) => {
			const normalized = platform === "win32" ? normalizeServicePathEntry(entry, platform) : platformPath.normalize(entry);
			return normalized.endsWith("/") && normalized !== platformPath.parse(normalized).root ? normalized.slice(0, -1) : normalized;
		};
		const admitted = new Map(segments.map((segment) => [normalizeOrderEntry(segment), segment]));
		const preserved = (existingPath?.split(path.delimiter) ?? []).flatMap((segment) => {
			const trimmed = segment.trim();
			const normalized = platformPath.normalize(trimmed);
			const entry = seen.has(trimmed) ? trimmed : seen.has(normalized) ? normalized : admitted.get(normalizeOrderEntry(trimmed));
			return entry === void 0 ? [] : [entry];
		});
		const existing = new Set(preserved.map(normalizeOrderEntry));
		const ordered = [...segments.filter((segment) => !existing.has(normalizeOrderEntry(segment))), ...preserved];
		return ordered.length > 0 ? ordered.join(path.delimiter) : void 0;
	}
	return segments.length > 0 ? segments.join(path.delimiter) : void 0;
}
//#endregion
//#region src/daemon/runtime-paths.ts
/** Selects stable runtime executable paths for daemon installs across platforms. */
function getPathModule(platform) {
	return platform === "win32" ? path.win32 : path.posix;
}
function buildSystemNodeCandidates(env, platform) {
	if (platform === "darwin") return [
		"/opt/homebrew/bin/node",
		"/opt/homebrew/opt/node/bin/node",
		"/opt/homebrew/opt/node@24/bin/node",
		"/opt/homebrew/opt/node@22/bin/node",
		"/usr/local/bin/node",
		"/usr/local/opt/node/bin/node",
		"/usr/local/opt/node@24/bin/node",
		"/usr/local/opt/node@22/bin/node",
		"/usr/bin/node"
	];
	if (platform === "linux") return ["/usr/local/bin/node", "/usr/bin/node"];
	if (platform === "win32") {
		const pathModule = getPathModule(platform);
		return getWindowsProgramFilesRoots(env).map((root) => pathModule.join(root, "nodejs", "node.exe"));
	}
	return [];
}
function buildBunCandidates(env, platform, execPath) {
	const pathModule = getPathModule(platform);
	const executable = platform === "win32" ? "bun.exe" : "bun";
	const candidates = [];
	const seen = /* @__PURE__ */ new Set();
	const addCandidate = (candidate) => {
		if (!candidate || !pathModule.isAbsolute(candidate)) return;
		const normalized = normalizeServicePathEntry(candidate, platform);
		if (seen.has(normalized)) return;
		seen.add(normalized);
		candidates.push(candidate);
	};
	const bunInstall = env.BUN_INSTALL?.trim();
	if (bunInstall) addCandidate(pathModule.join(bunInstall, "bin", executable));
	const home = (platform === "win32" ? env.USERPROFILE : env.HOME)?.trim();
	if (home) addCandidate(pathModule.join(home, ".bun", "bin", executable));
	const pathEnv = env.PATH ?? env.Path ?? env.path ?? "";
	const delimiter = platform === "win32" ? ";" : ":";
	for (const entry of pathEnv.split(delimiter)) {
		const trimmed = entry.trim();
		if (trimmed) addCandidate(pathModule.join(trimmed, executable));
	}
	if (isBunRuntime(execPath)) addCandidate(execPath);
	for (const candidate of platform === "darwin" ? [
		"/opt/homebrew/bin/bun",
		"/usr/local/bin/bun",
		"/usr/bin/bun"
	] : platform === "linux" ? ["/usr/local/bin/bun", "/usr/bin/bun"] : []) addCandidate(candidate);
	return candidates;
}
const RUNTIME_PROBE_TIMEOUT_MS = 5e3;
const RUNTIME_PROBE_ENV_KEYS = [
	"PATH",
	"SystemRoot",
	"SYSTEMROOT",
	"WINDIR",
	"TEMP",
	"TMP",
	"TMPDIR",
	"HOMEBREW_PREFIX",
	"OPENCLAW_SQLITE_LIBRARY"
];
const execFileAsync = async (file, args, options) => await runExec(file, [...args], {
	baseEnv: options.env,
	logOutput: false,
	timeoutMs: options.timeoutMs
});
function buildRuntimeProbeEnv(env) {
	const probeEnv = {};
	for (const key of RUNTIME_PROBE_ENV_KEYS) {
		const value = env[key];
		if (value) probeEnv[key] = value;
	}
	return probeEnv;
}
/**
* Bun candidates load the selection module the Gateway itself uses, so the probe rejects
* the same invalid overrides and reports the version of the library that will be selected
* instead of the runtime's default SQLite. A missing module fails the whole probe.
*/
function buildRuntimeProbeScript(sqliteLibraryModulePath) {
	const selector = sqliteLibraryModulePath ? `require(${JSON.stringify(sqliteLibraryModulePath)}).ensureSqliteLibrarySelected` : "() => {}";
	return String.raw`
const selectSqliteLibrary = ${selector};
let sqliteVersion = null;
let sqliteSelectionError = null;
let sqliteLibraryPath = null;
let sqliteProbe = { available: false, version: null, text: false, blob: false, json: false };
try {
  const selection = selectSqliteLibrary();
  if (selection?.path) sqliteLibraryPath = require("node:path").resolve(selection.path);
} catch (error) {
  sqliteSelectionError = error instanceof Error ? error.message : String(error);
}
if (sqliteSelectionError === null) {
  try {
    sqliteProbe = ${SQLITE_CAPABILITY_PROBE};
    sqliteVersion = sqliteProbe.version;
  } catch {}
}
const variables = (process.config && process.config.variables) || {};
const nodeSharedSqlite = variables.node_shared_sqlite === true || variables.node_shared_sqlite === "true";
process.stdout.write(JSON.stringify({ nodeVersion: process.versions.node, bunVersion: process.versions.bun ?? null, sqliteVersion, sqliteProbe, sqliteSelectionError, sqliteLibraryPath, nodeSharedSqlite }));
`;
}
async function resolveRuntimeInfo(runtimePath, runtime, execFileImpl, env, timeoutMs = RUNTIME_PROBE_TIMEOUT_MS) {
	const label = runtime === "node" ? "Node" : "Bun";
	let cwd;
	try {
		cwd = process.cwd();
		const { stdout } = await execFileImpl(runtimePath, ["-e", buildRuntimeProbeScript(runtime === "bun" ? fileURLToPath(resolveRuntimeProcessEntrypointUrl("bunSqliteLibrary")) : void 0)], {
			encoding: "utf8",
			timeoutMs,
			env: buildRuntimeProbeEnv(env)
		});
		const parsed = JSON.parse(stdout);
		if (!isRecord(parsed)) throw new Error("Runtime probe returned invalid output");
		const version = parsed[`${runtime}Version`];
		const sqliteVersion = parsed.sqliteVersion;
		const sqliteSelectionError = parsed.sqliteSelectionError;
		const sqliteLibraryPath = parsed.sqliteLibraryPath;
		const probe = parsed.sqliteProbe;
		if (!(typeof version === "string" || runtime === "bun" && version === null) || runtime === "node" && typeof version === "string" && !parseSemver(version) || !(typeof sqliteVersion === "string" || sqliteVersion === null) || !(typeof sqliteSelectionError === "string" || sqliteSelectionError == null) || !(sqliteLibraryPath == null || typeof sqliteLibraryPath === "string" && path.isAbsolute(sqliteLibraryPath)) || !isRecord(probe) || typeof probe.available !== "boolean" || probe.version !== sqliteVersion || typeof probe.text !== "boolean" || typeof probe.blob !== "boolean" || typeof probe.json !== "boolean" || !(probe.error === void 0 || typeof probe.error === "string")) throw new Error("Runtime probe returned invalid version metadata");
		const sqliteProbe = {
			available: probe.available,
			version: sqliteVersion,
			text: probe.text,
			blob: probe.blob,
			json: probe.json,
			...probe.error ? { error: probe.error } : {}
		};
		const capabilityError = runtime === "node" ? typeof parsed.bunVersion === "string" ? "The executable is Bun, not Node." : nodeRuntimeFailure(version, sqliteProbe) : null;
		const note = runtime === "node" ? nodeRuntimeNote(version, sqliteProbe) : null;
		return {
			status: (runtime === "node" ? !capabilityError : isSupportedBunVersion(version)) && !sqliteSelectionError && sqliteVersion !== null && isSqliteWalResetSafeVersion(sqliteVersion) ? "supported" : "unsupported",
			version,
			sqliteVersion,
			sqliteProbe,
			...capabilityError ? { capabilityError } : {},
			...note ? { note } : {},
			nodeSharedSqlite: parsed.nodeSharedSqlite === true || parsed.nodeSharedSqlite === "true",
			...sqliteSelectionError ? { sqliteSelectionError } : {},
			...typeof sqliteLibraryPath === "string" ? { sqliteLibraryPath } : {}
		};
	} catch (cause) {
		return {
			status: "probe-failed",
			error: new Error(`${label} runtime probe failed for ${runtimePath} (cwd: ${cwd ?? "unavailable"}): ${String(cause)}. Check executable and working-directory access, then retry.`, { cause })
		};
	}
}
/** Probes whether a Bun executable satisfies the managed daemon runtime contract. */
function resolveBunRuntimeInfo(bunPath, execFileImpl = execFileAsync, env = process.env) {
	return resolveRuntimeInfo(bunPath, "bun", execFileImpl, env);
}
/** Probes a recorded Node executable without inheriting service preloads or secrets. */
function resolveNodeRuntimeInfo(nodePath, env = process.env, timeoutMs = RUNTIME_PROBE_TIMEOUT_MS) {
	return resolveRuntimeInfo(nodePath, "node", execFileAsync, env, timeoutMs);
}
/** Probe the recorded executable without substituting a discovered runtime. */
async function resolveRecordedDaemonRuntime(runtimePath, env) {
	if (!runtimePath) return;
	const runtime = isBunRuntime(runtimePath) ? "bun" : isNodeRuntime(runtimePath) ? "node" : void 0;
	if (!runtime) return;
	return {
		...await resolveRuntimeInfo(runtimePath, runtime, execFileAsync, env),
		runtime,
		path: runtimePath
	};
}
async function isVersionManagedRealNodePath(nodePath, platform) {
	try {
		return isVersionManagedNodePath(await fs$1.realpath(nodePath), platform);
	} catch {
		return false;
	}
}
/** True when a Node path lives under a known user version-manager root. */
function isVersionManagedNodePath(nodePath, platform = process.platform) {
	const normalized = normalizeLowercaseStringOrEmpty(normalizeServicePathEntry(nodePath, platform));
	return matchesVersionManagerPath(normalized, "daemon-runtime");
}
/** True when a Node path matches known system install candidates for the platform. */
function isSystemNodePath(nodePath, env = process.env, platform = process.platform) {
	const normalized = normalizeServicePathEntry(nodePath, platform);
	return buildSystemNodeCandidates(env, platform).some((candidate) => {
		const normalizedCandidate = normalizeServicePathEntry(candidate, platform);
		return normalized === normalizedCandidate;
	});
}
/** Resolves the first available system Node candidate for the platform. */
async function resolveSystemNodePath(env = process.env, platform = process.platform) {
	const candidates = buildSystemNodeCandidates(env, platform);
	for (const candidate of candidates) try {
		await fs$1.access(candidate);
		return candidate;
	} catch {}
	return null;
}
/** Resolves system Node info, preferring a supported non-version-managed install. */
async function resolveSystemNodeInfo(params) {
	const env = params.env ?? process.env;
	const platform = params.platform ?? process.platform;
	const execFileImpl = params.execFile ?? execFileAsync;
	let firstAvailable = null;
	for (const systemNode of buildSystemNodeCandidates(env, platform)) {
		try {
			await fs$1.access(systemNode);
		} catch {
			continue;
		}
		if (await isVersionManagedRealNodePath(systemNode, platform)) continue;
		const info = {
			path: systemNode,
			...await resolveRuntimeInfo(systemNode, "node", execFileImpl, env)
		};
		if (info.status === "supported" && (params.acceptNodeVersion?.(info.version) ?? true)) return info;
		firstAvailable = info.status === "probe-failed" ? info : firstAvailable ?? info;
	}
	return firstAvailable;
}
/** Renders a warning when the system Node exists but is unsuitable for the daemon. */
function renderSystemNodeWarning(systemNode, selectedNodePath) {
	if (!systemNode) return null;
	if (systemNode.status === "supported") return systemNode.note ?? null;
	const selectedLabel = selectedNodePath ? ` Using ${selectedNodePath} for the daemon.` : "";
	if (systemNode.status === "probe-failed") return `${systemNode.error.message}${selectedLabel}`;
	const versionLabel = systemNode.version;
	if (systemNode.capabilityError && (!systemNode.sqliteProbe.text || systemNode.sqliteProbe.error)) return `${systemNode.capabilityError}${selectedLabel}`;
	if (isSupportedOpenClawNodeVersion(systemNode.version)) {
		const sqliteLabel = systemNode.sqliteVersion ?? "unknown";
		if (systemNode.nodeSharedSqlite) return `System Node ${versionLabel} at ${systemNode.path} uses shared system SQLite ${sqliteLabel}, which is not WAL-reset-safe.${selectedLabel} Upgrade the system SQLite library to 3.51.3+ (or patched 3.50.7+/3.44.6+), or install a Node build that embeds a safe version.`;
		return `System Node ${versionLabel} at ${systemNode.path} uses SQLite ${sqliteLabel}, which is not WAL-reset-safe.${selectedLabel} Install Node ${SUPPORTED_NODE_VERSIONS} from nodejs.org or Homebrew.`;
	}
	return `System Node ${versionLabel} at ${systemNode.path} is outside the supported range.${selectedLabel} Install Node ${SUPPORTED_NODE_VERSIONS} from nodejs.org or Homebrew.`;
}
/** Resolves the Node binary the daemon should use for a node runtime. */
async function resolvePreferredNodePath(params) {
	if (params.runtime !== "node") return;
	const env = params.env ?? process.env;
	const platform = params.platform ?? process.platform;
	const currentExecPath = params.execPath ?? process.execPath;
	const execFileImpl = params.execFile ?? execFileAsync;
	const currentNode = isNodeRuntime(currentExecPath) ? await resolveRuntimeInfo(currentExecPath, "node", execFileImpl, env) : null;
	if (currentNode?.status === "supported" && (params.preferCurrentExecPath || !isVersionManagedNodePath(currentExecPath, platform))) return resolveStableNodePath(currentExecPath);
	const systemNode = await resolveSystemNodeInfo(params);
	if (systemNode?.status === "supported") return systemNode.path;
	if (currentNode?.status === "supported") return resolveStableNodePath(currentExecPath);
	if (currentNode?.status === "probe-failed") throw currentNode.error;
	if (systemNode?.status === "probe-failed") throw systemNode.error;
}
/** Resolves a stable Bun binary that satisfies the daemon runtime contract. */
async function resolvePreferredBunPath(params) {
	if (params.runtime !== "bun") return;
	const env = params.env ?? process.env;
	const platform = params.platform ?? process.platform;
	const execFileImpl = params.execFile ?? execFileAsync;
	const currentExecPath = params.execPath ?? process.execPath;
	let probeFailure;
	let selectionError;
	for (const candidate of buildBunCandidates(env, platform, currentExecPath)) {
		try {
			await fs$1.access(candidate);
		} catch (error) {
			if (isMissingPathError(error)) continue;
		}
		const runtime = await resolveBunRuntimeInfo(candidate, execFileImpl, env);
		if (runtime.status === "probe-failed") probeFailure ??= runtime.error;
		else selectionError ??= runtime.sqliteSelectionError;
		if (runtime.status === "supported") return candidate;
	}
	if (selectionError) throw new Error(selectionError);
	if (probeFailure) throw probeFailure;
}
/** Validate an operator pin without falling back to another executable. */
async function resolvePinnedDaemonRuntimePath(input, runtime, env) {
	if (input === void 0) return;
	const value = input.trim();
	const paths = getPathModule(process.platform);
	if (!value || !paths.isAbsolute(value) || value.includes("\0") || value.includes("\r") || value.includes("\n")) throw new Error("--runtime-path must be an absolute executable path.");
	const runtimePath = paths.normalize(value);
	if (!(runtime === "node" ? isNodeRuntime(runtimePath) : isBunRuntime(runtimePath))) throw new Error(`--runtime-path must name a ${runtime} executable: ${runtimePath}`);
	try {
		if (!(await fs$1.stat(runtimePath)).isFile()) throw new Error("not a regular file");
		await fs$1.access(runtimePath, constants.X_OK);
	} catch (cause) {
		throw new Error(`Pinned runtime is not executable: ${runtimePath}`, { cause });
	}
	const info = await resolveRuntimeInfo(runtimePath, runtime, execFileAsync, env);
	if (info.status === "probe-failed") throw info.error;
	if (info.status !== "supported") {
		const detail = info.sqliteSelectionError ?? info.capabilityError ?? (runtime === "node" ? `Node ${SUPPORTED_NODE_VERSIONS} with WAL-reset-safe SQLite is required.` : "Bun 1.4+ with WAL-reset-safe node:sqlite is required.");
		throw new Error(`Pinned runtime ${runtimePath} is unsupported: ${detail}`);
	}
	return runtimePath;
}
//#endregion
export { resolveBunRuntimeInfo as a, resolvePreferredBunPath as c, resolveSystemNodeInfo as d, resolveSystemNodePath as f, normalizeServicePathEntry as h, renderSystemNodeWarning as i, resolvePreferredNodePath as l, mergeServicePath as m, isSystemNodePath as n, resolveNodeRuntimeInfo as o, isNonMinimalServicePathEntry as p, isVersionManagedNodePath as r, resolvePinnedDaemonRuntimePath as s, buildRuntimeProbeEnv as t, resolveRecordedDaemonRuntime as u };
