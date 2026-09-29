import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-_gRhJUDw.mjs";
import { c as isPathInside, d as pathExists } from "./fs-safe-BAPek8At.mjs";
import { l as pathExists$1 } from "./utils-aKqR_F_U.mjs";
import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as stripAnsi } from "./ansi-CWsy0bu4.mjs";
import { a as UPDATE_RUN_HEARTBEAT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { o as resolveExecutablePath } from "./executable-path-BMRdcL7i.mjs";
import { a as redactSupportDiagnosticLine } from "./diagnostic-support-redaction-YQMFPlL7.mjs";
import { n as createUpdateFailureFact, t as createUpdateErrorFact } from "./update-failure-facts-THF-vx3i.mjs";
import { i as runCommandWithTimeout, t as runCommandBuffered } from "./exec-shcN2-sN.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-BXzjx6E8.mjs";
import { n as readPackageName, r as readPackageVersion, t as readPackageManagerSpec } from "./package-json-skO3uhlG.mjs";
import { s as parseSemver } from "./runtime-guard-QhifpZGP.mjs";
import { w as trimLogTail } from "./restart-sentinel-KM6PPxhT.mjs";
import { n as isFailedUpdateStep } from "./update-run-step-ijjXM1mH.mjs";
import { n as applyPosixNpmScriptShellEnv, r as createNpmFreshnessBypassArgs, t as applyNpmFreshnessBypassEnv } from "./npm-install-env-D6spEEnI.mjs";
import { t as applyPathPrepend } from "./path-prepend-CRp372y2.mjs";
import { a as readPackageDistInventoryIfPresent, r as collectPackageDistInventory, t as PACKAGE_DIST_INVENTORY_RELATIVE_PATH } from "./package-dist-inventory-DV_9aVsG.mjs";
import { t as collectGitRuntimeErrors } from "./update-git-runtime-CAxWdF8c.mjs";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { isUtf8 } from "node:buffer";
import { valid } from "semver";
//#region scripts/lib/bundled-runtime-sidecar-paths.json
var bundled_runtime_sidecar_paths_default = [
	"dist/extensions/a2a/runtime-api.js",
	"dist/extensions/browser/runtime-api.js",
	"dist/extensions/canvas/runtime-api.js",
	"dist/extensions/copilot-proxy/runtime-api.js",
	"dist/extensions/google/runtime-api.js",
	"dist/extensions/lmstudio/runtime-api.js",
	"dist/extensions/memory-core/runtime-api.js",
	"dist/extensions/ollama/runtime-api.js",
	"dist/extensions/reef/runtime-api.js",
	"dist/extensions/telegram/runtime-api.js",
	"dist/extensions/telegram/runtime-setter-api.js",
	"dist/extensions/webhooks/runtime-api.js",
	"dist/extensions/workboard/runtime-api.js"
];
//#endregion
//#region src/plugins/runtime-sidecar-paths.ts
function assertUniqueValues(values, label) {
	const seen = /* @__PURE__ */ new Set();
	const duplicates = /* @__PURE__ */ new Set();
	for (const value of values) {
		if (seen.has(value)) {
			duplicates.add(value);
			continue;
		}
		seen.add(value);
	}
	if (duplicates.size > 0) throw new Error(`Duplicate ${label}: ${Array.from(duplicates).join(", ")}`);
	return values;
}
const BUNDLED_RUNTIME_SIDECAR_PATHS = assertUniqueValues(bundled_runtime_sidecar_paths_default, "bundled runtime sidecar path");
//#endregion
//#region src/infra/detect-package-manager.ts
async function exists(p) {
	try {
		await fs$1.access(p);
		return true;
	} catch {
		return false;
	}
}
/** Resolves Bun's global project from its installed owner rather than unrelated caller settings. */
function resolveBunGlobalInstallOwner(pkgRoot, env = process.env) {
	const configuredInstall = env.BUN_INSTALL?.trim();
	const configuredGlobalProject = env.BUN_INSTALL_GLOBAL_DIR?.trim();
	if (pkgRoot == null) {
		const bunInstall = configuredInstall || path.join(os.homedir(), ".bun");
		const globalProjectRoot = path.resolve(configuredGlobalProject || path.join(bunInstall, "install", "global"));
		return {
			globalRoot: path.join(globalProjectRoot, "node_modules"),
			globalProjectRoot,
			...!configuredGlobalProject || configuredInstall ? { bunInstall: path.resolve(bunInstall) } : {}
		};
	}
	const trimmed = pkgRoot.trim();
	if (!trimmed) return null;
	let globalRoot = path.dirname(path.resolve(trimmed));
	if (path.basename(globalRoot).startsWith("@")) globalRoot = path.dirname(globalRoot);
	if (path.basename(globalRoot) !== "node_modules") return null;
	const globalProjectRoot = path.dirname(globalRoot);
	const installRoot = path.dirname(globalProjectRoot);
	const conventionalLayout = path.basename(globalProjectRoot) === "global" && path.basename(installRoot) === "install";
	const configuredProjectMatches = configuredGlobalProject !== void 0 && path.resolve(configuredGlobalProject) === globalProjectRoot;
	if (!conventionalLayout && !configuredProjectMatches) return null;
	const bunInstall = conventionalLayout ? path.dirname(installRoot) : configuredInstall;
	return {
		globalRoot,
		globalProjectRoot,
		...bunInstall ? { bunInstall: path.resolve(bunInstall) } : {}
	};
}
function resolvePnpmNodeModulesRoot(root) {
	const resolved = path.resolve(root);
	const parts = resolved.split(path.sep);
	const pnpmIndex = parts.lastIndexOf(".pnpm");
	if (pnpmIndex > 0) {
		const layoutRoot = parts.slice(0, pnpmIndex).join(path.sep) || path.sep;
		return path.basename(layoutRoot) === "node_modules" ? layoutRoot : path.join(layoutRoot, "node_modules");
	}
	const parent = path.dirname(resolved);
	return path.basename(parent) === "node_modules" ? parent : null;
}
async function isPnpmOwnedPackageRoot(root) {
	const nodeModulesRoot = resolvePnpmNodeModulesRoot(root);
	if (!nodeModulesRoot || !await exists(path.join(nodeModulesRoot, ".modules.yaml"))) return false;
	return true;
}
/** Detects the package manager that owns a package root from manifests, locks, and install layout. */
async function detectPackageManager(root) {
	const pm = (await readPackageManagerSpec(root))?.split("@")[0]?.trim();
	const files = await fs$1.readdir(root).catch(() => []);
	const hasNpmShrinkwrap = files.includes("npm-shrinkwrap.json");
	const hasPnpmLock = files.includes("pnpm-lock.yaml");
	const hasBunLock = files.includes("bun.lock") || files.includes("bun.lockb");
	if (resolveBunGlobalInstallOwner(root)) return "bun";
	if (hasNpmShrinkwrap) {
		if (pm === "pnpm" && (hasPnpmLock || await isPnpmOwnedPackageRoot(root))) return "pnpm";
		if (pm === "bun" && hasBunLock) return "bun";
		return "npm";
	}
	if (pm === "pnpm" || pm === "bun" || pm === "npm") return pm;
	if (hasPnpmLock) return "pnpm";
	if (hasBunLock) return "bun";
	if (files.includes("package-lock.json") || hasNpmShrinkwrap) return "npm";
	return null;
}
//#endregion
//#region src/infra/update-freebsd-pkg-ownership.ts
const PKG_INSPECTION_TIMEOUT_MS = 3e4;
var FreeBsdPkgOwnershipError = class extends Error {
	constructor(reason, source = "database") {
		super(reason === "pkg-owned-install" ? "This installation contains files owned by FreeBSD pkg. Update it through pkg or the Ports deployment that owns it; openclaw update will not replace package-owned files." : source === "paths" ? "FreeBSD pkg paths could not be inspected completely. Check access to the registered package directories and installation paths, and resolve any inspection timeout before retrying." : "FreeBSD pkg ownership could not be verified. Restore access to the active pkg database and configuration, then retry.");
		this.reason = reason;
		this.name = "FreeBsdPkgOwnershipError";
	}
};
async function readPkgFiles(timeoutMs) {
	const result = await runCommandBuffered([
		"/usr/sbin/pkg",
		"-N",
		"query",
		"-a",
		"%Fp"
	], {
		timeoutMs,
		env: {
			ALIAS: "query=query",
			PKG_ENABLE_PLUGINS: "no"
		},
		maxOutputBytes: {
			stdout: 16777216,
			stderr: 65536
		}
	});
	if (result.termination !== "exit" || result.code !== 0 || result.stderr.length !== 0 || !isUtf8(result.stdout)) throw new FreeBsdPkgOwnershipError("pkg-ownership-unavailable");
	const output = result.stdout.toString("utf8");
	if (output !== "" && !output.endsWith("\n")) throw new FreeBsdPkgOwnershipError("pkg-ownership-unavailable");
	const files = output === "" ? [] : output.slice(0, -1).split("\n");
	if (files.length > 25e4 || files.some((file) => !path.isAbsolute(file) || containsAsciiControlCharacter(file))) throw new FreeBsdPkgOwnershipError("pkg-ownership-unavailable");
	return files;
}
/** One planning snapshot; create a fresh inspection before installation effects. */
function createFreeBsdPkgOwnershipInspection(timeoutMs = PKG_INSPECTION_TIMEOUT_MS) {
	let files;
	const directories = /* @__PURE__ */ new Map();
	const assertions = /* @__PURE__ */ new Map();
	const budget = Number.isFinite(timeoutMs) ? Math.min(PKG_INSPECTION_TIMEOUT_MS, Math.max(1, timeoutMs)) : PKG_INSPECTION_TIMEOUT_MS;
	let deadline;
	let pathReads = 0;
	const read = async (operation, source) => {
		try {
			const value = await awaitWithinDeadline(operation, deadline);
			if (value !== ABSOLUTE_DEADLINE_EXPIRED) return value;
		} catch (error) {
			if (error instanceof FreeBsdPkgOwnershipError) throw error;
		}
		throw new FreeBsdPkgOwnershipError("pkg-ownership-unavailable", source);
	};
	const readPath = (operation) => read(() => {
		if (++pathReads > 5e4) throw new FreeBsdPkgOwnershipError("pkg-ownership-unavailable", "paths");
		return operation();
	}, "paths");
	const canonicalDirectory = (directory) => read(() => {
		let canonical = directories.get(directory);
		if (!canonical) {
			canonical = (async () => {
				let ancestor = directory;
				while (!await readPath(() => fs$1.lstat(ancestor).then(() => true, (error) => {
					if (hasNodeErrorCode(error, "ENOENT")) return false;
					throw error;
				}))) {
					const parent = path.dirname(ancestor);
					if (parent === ancestor) throw new FreeBsdPkgOwnershipError("pkg-ownership-unavailable", "paths");
					ancestor = parent;
				}
				return path.resolve(await readPath(() => fs$1.realpath(ancestor)), path.relative(ancestor, directory));
			})();
			directories.set(directory, canonical);
		}
		return canonical;
	}, "paths");
	const assertUnowned = async (lexicalRoot, entryOnly) => {
		const inventory = await read(() => files ??= readPkgFiles(budget), "database");
		const matches = (candidate, file) => entryOnly ? candidate === file : isPathInside(candidate, file);
		if (inventory.some((file) => matches(lexicalRoot, file))) throw new FreeBsdPkgOwnershipError("pkg-owned-install");
		const rootEntry = path.join(await canonicalDirectory(path.dirname(lexicalRoot)), path.basename(lexicalRoot));
		const canonicalRoot = entryOnly ? rootEntry : await canonicalDirectory(lexicalRoot);
		for (const file of inventory) {
			const canonicalFile = path.join(await canonicalDirectory(path.dirname(file)), path.basename(file));
			if (canonicalFile === rootEntry || matches(canonicalRoot, canonicalFile)) throw new FreeBsdPkgOwnershipError("pkg-owned-install");
		}
	};
	const inspect = (root, entryOnly = false) => {
		if (process.platform !== "freebsd" || !root) return Promise.resolve();
		const resolvedRoot = path.resolve(root);
		const key = `${entryOnly}:${resolvedRoot}`;
		const cached = assertions.get(key);
		if (cached) return cached;
		deadline ??= Date.now() + budget;
		if (Date.now() >= deadline) return Promise.reject(new FreeBsdPkgOwnershipError("pkg-ownership-unavailable", "paths"));
		const assertion = assertUnowned(resolvedRoot, entryOnly);
		assertions.set(key, assertion);
		return assertion;
	};
	return {
		assertUnowned: (root) => inspect(root),
		assertEntryUnowned: (file) => inspect(file, true)
	};
}
//#endregion
//#region src/infra/update-npm-prefix.ts
/** Reads the command value after package-manager warnings printed on stdout. */
function readPackageManagerProbeValue(stdout) {
	const lines = stdout.split(/\r?\n/u);
	for (let index = lines.length - 1; index >= 0; index -= 1) {
		const value = lines[index]?.trim();
		if (value) return value;
	}
	return "";
}
/**
* Infers npm prefix, package root, and bin paths from an npm global root.
* Direct `node_modules` roots are accepted only when the caller opts into them.
*/
function resolveNpmGlobalPrefixLayoutFromGlobalRoot(globalRoot, options = {}) {
	const trimmed = globalRoot?.trim();
	if (!trimmed) return null;
	const normalized = path.resolve(trimmed);
	if (path.basename(normalized) !== "node_modules") return null;
	const parentDir = path.dirname(normalized);
	if (path.basename(parentDir) === "lib") {
		const prefix = path.dirname(parentDir);
		return {
			prefix,
			globalRoot: normalized,
			binDir: path.join(prefix, "bin")
		};
	}
	if (process.platform === "win32") return {
		prefix: parentDir,
		globalRoot: normalized,
		binDir: parentDir
	};
	if (options.allowDirectNodeModulesRoot) return {
		prefix: parentDir,
		globalRoot: normalized,
		binDir: path.join(normalized, ".bin")
	};
	return null;
}
/**
* Derives npm's global package and bin directories from a prefix root.
* Used for staged installs where OpenClaw creates the prefix itself.
*/
function resolveNpmGlobalPrefixLayoutFromPrefix(prefix) {
	const resolvedPrefix = path.resolve(prefix);
	if (process.platform === "win32") return {
		prefix: resolvedPrefix,
		globalRoot: path.join(resolvedPrefix, "node_modules"),
		binDir: resolvedPrefix
	};
	return {
		prefix: resolvedPrefix,
		globalRoot: path.join(resolvedPrefix, "lib", "node_modules"),
		binDir: path.join(resolvedPrefix, "bin")
	};
}
async function probeNpmGlobalPrefix(runCommand, timeoutMs, command = "npm", diagnostics = []) {
	const executable = resolveExecutablePath(command);
	const cli = executable ? process.platform === "win32" ? path.join(path.dirname(executable), "node_modules", "npm", "bin", "npm-cli.js") : await fs$1.realpath(executable).catch(() => path.resolve(executable)) : null;
	const argv = cli && path.basename(cli) === "npm-cli.js" && await pathExists(cli) ? [
		process.execPath,
		cli,
		"prefix",
		"-g"
	] : [
		command,
		"prefix",
		"-g"
	];
	const env = {};
	for (const [key, value] of Object.entries(process.env)) if (value !== void 0) env[key] = value;
	applyPathPrepend(env, [path.dirname(process.execPath)]);
	const result = await runCommand(argv, {
		timeoutMs,
		env
	}).catch(() => null);
	const prefix = result?.code === 0 ? readPackageManagerProbeValue(result.stdout) : "";
	diagnostics.push(`${argv.join(" ")}: ${prefix || "unavailable"}`);
	return prefix && path.isAbsolute(prefix) ? resolveNpmGlobalPrefixLayoutFromPrefix(prefix) : null;
}
async function inspectNpmLauncher(layout) {
	const launcher = path.join(layout.binDir, process.platform === "win32" ? "openclaw.cmd" : "openclaw");
	let launcherTarget = await fs$1.realpath(launcher).catch(() => null);
	if (process.platform === "win32" && launcherTarget) {
		const script = await fs$1.readFile(launcher, "utf8").catch(() => "");
		const relative = /"(?:%dp0%|%~dp0)[\\/]([^"\r\n]+)"[ \t]+%\*/iu.exec(script)?.[1];
		launcherTarget = relative ? await fs$1.realpath(path.resolve(layout.binDir, ...relative.split(/[\\/]/u))).catch(() => null) : null;
	}
	return {
		launcher,
		launcherTarget
	};
}
//#endregion
//#region src/infra/update-global.ts
const PRIMARY_PACKAGE_NAME = "openclaw";
const ALL_PACKAGE_NAMES = [PRIMARY_PACKAGE_NAME];
const GLOBAL_RENAME_PREFIX = ".";
/** npm-compatible spec used when the user asks to install the moving main branch. */
const OPENCLAW_MAIN_PACKAGE_SPEC = "github:openclaw/openclaw#main";
const COREPACK_ENABLE_DOWNLOAD_PROMPT_DEFAULT = "0";
const NPM_GLOBAL_INSTALL_QUIET_FLAGS = [
	"--no-fund",
	"--no-audit",
	"--loglevel=error"
];
const PNPM_OPENCLAW_BUILD_ALLOWLIST_FLAG = `--allow-build=${PRIMARY_PACKAGE_NAME}`;
const BUN_OPENCLAW_TRUST_FLAG = "--trust";
const FIRST_PACKAGED_DIST_INVENTORY_VERSION = {
	major: 2026,
	minor: 4,
	patch: 15
};
const OMITTED_PRIVATE_QA_BUNDLED_PLUGIN_ROOTS = /* @__PURE__ */ new Set(["dist/extensions/qa-channel", "dist/extensions/qa-lab"]);
/** Selects npm's lifecycle policy from the version of the owning executable. */
function resolveNpmLifecyclePolicy(version) {
	const parsed = parseSemver(version);
	if (!parsed) return null;
	return parsed.major >= 12 ? "allow-scripts" : parsed.major === 11 && parsed.minor >= 16 ? "allow-scripts-advisory" : "unflagged";
}
/** Resolves the owning npm policy once, before any update mutation. */
function resolveNpmLifecyclePolicyGate(installTarget) {
	if (installTarget.manager !== "npm") return {
		policy: null,
		error: null
	};
	const policy = installTarget.npmOwner?.lifecyclePolicy ?? null;
	if (policy === "unflagged" || policy === "allow-scripts-advisory" || policy === "allow-scripts") return {
		policy,
		error: null
	};
	return {
		policy: null,
		error: `Unable to determine the owning npm version before updating; no package changes were made.${installTarget.npmOwner?.probeError ? ` ${installTarget.npmOwner.probeError}` : ""}`
	};
}
async function resolveNpmOwner(params) {
	const result = await params.runCommand([params.command, "--version"], { timeoutMs: params.timeoutMs }).catch((error) => ({
		stdout: "",
		stderr: error instanceof Error ? error.message : String(error),
		code: 1
	}));
	const version = result.code === 0 ? readPackageManagerProbeValue(result.stdout) : "";
	return {
		version: version || null,
		lifecyclePolicy: version ? resolveNpmLifecyclePolicy(version) : null,
		...result.code === 0 || !result.stderr ? {} : { probeError: result.stderr }
	};
}
function normalizePackageTarget(value) {
	return value.trim();
}
function normalizePackageVersionForComparison(value) {
	const trimmed = value?.trim();
	if (!trimmed) return null;
	return trimmed.replace(/^[vV](?=\d)/, "");
}
/** Returns true when a user target requests the moving main-branch package spec. */
function isMainPackageTarget(value) {
	return normalizeLowercaseStringOrEmpty(normalizePackageTarget(value)) === "main";
}
/**
* Returns true for targets that should pass through as package-manager specs
* rather than being treated as registry dist-tags.
*/
function isExplicitPackageInstallSpec(value) {
	const trimmed = normalizePackageTarget(value);
	if (!trimmed) return false;
	return /\.(?:tgz|tar\.gz)$/iu.test(trimmed) || trimmed.includes("://") || trimmed.includes("#") || /^(?:file|github|git\+ssh|git\+https|git\+http|git\+file|npm):/i.test(trimmed);
}
function isRelativePackageInstallPath(value) {
	return /^(?:\.{1,2})(?:[\\/]|$)/u.test(value);
}
function resolveNpmInstallScriptsAllowFlag(spec, installCwd, policy) {
	const normalized = normalizePackageTarget(spec);
	const unaliased = stripPrimaryPackageAlias(normalized);
	let identity = isExplicitPackageInstallSpec(normalized) || isExplicitPackageInstallSpec(unaliased) || isRelativePackageInstallPath(unaliased) || path.isAbsolute(normalized) || path.isAbsolute(unaliased) ? unaliased : PRIMARY_PACKAGE_NAME;
	const alias = resolveNpmAliasPackageName(identity);
	identity = alias ?? identity;
	const filePrefix = /^file:/iu.test(identity) ? "file:" : "";
	const archivePath = identity.slice(filePrefix.length);
	const gitShorthand = !/^~[\\/]/u.test(identity) && /^[^./@\s:#][^/\s:@#]*\/[^/\s:@#]+(?:#[\s\S]*)?$/u.test(identity);
	const localArchive = !alias && !gitShorthand && /\.(?:tgz|tar\.gz|tar)$/iu.test(archivePath) && (filePrefix || path.isAbsolute(archivePath) || !/^[a-z][a-z0-9+.-]*:/iu.test(archivePath));
	let absoluteArchive = "";
	if (localArchive) {
		const npmPath = process.platform === "win32" ? archivePath.replaceAll("\\", "/") : archivePath;
		let fileUrl = `file:${encodeURI(npmPath).replace(/[?#]/gu, encodeURIComponent)}`;
		fileUrl = fileUrl.replace(/^file:\/\/(?=[^/])/u, "file:/").replace(/^file:\/{1,3}(?=\.\.?(?:\/|$))/u, "file:");
		const specPath = decodeURIComponent(new URL(fileUrl).pathname);
		let resolvedPath = decodeURIComponent(new URL(fileUrl, `${pathToFileURL(path.resolve(installCwd || process.cwd())).href}/`).pathname);
		if (process.platform === "win32") resolvedPath = resolvedPath.replace(/^\/+([a-z]:\/)/iu, "$1");
		absoluteArchive = /^\/~(?:\/|$)/u.test(specPath) ? path.resolve(os.homedir(), specPath.slice(3)) : path.resolve(installCwd || process.cwd(), resolvedPath);
	}
	if (absoluteArchive && (policy !== "allow-scripts-advisory" || !absoluteArchive.includes(","))) identity = `${filePrefix}${absoluteArchive}`;
	else if (installCwd && path.isAbsolute(identity)) {
		const relativeIdentity = path.relative(installCwd, identity) || ".";
		identity = path.isAbsolute(relativeIdentity) || relativeIdentity === "." || relativeIdentity === ".." || relativeIdentity.startsWith(`..${path.sep}`) ? relativeIdentity : `./${relativeIdentity}`;
	}
	if (identity.includes(",")) throw new Error("npm cannot allow lifecycle scripts for this install target; use a package URL or local path without commas");
	return `--allow-scripts=${identity || PRIMARY_PACKAGE_NAME}`;
}
function resolveNpmAliasPackageName(spec) {
	if (!/^npm:/i.test(spec)) return null;
	const target = spec.slice(spec.indexOf(":") + 1).trim();
	if (target.startsWith("@")) {
		const scopeSeparator = target.indexOf("/");
		if (scopeSeparator <= 1) return null;
		const versionSeparator = target.indexOf("@", scopeSeparator + 1);
		return versionSeparator === -1 ? target : target.slice(0, versionSeparator);
	}
	const versionSeparator = target.indexOf("@");
	return (versionSeparator === -1 ? target : target.slice(0, versionSeparator)) || null;
}
function stripPrimaryPackageAlias(spec) {
	const normalized = normalizePackageTarget(spec);
	const prefix = `${PRIMARY_PACKAGE_NAME}@`;
	return normalized.toLowerCase().startsWith(prefix) ? normalized.slice(prefix.length).trim() : normalized;
}
/**
* Extracts a pinned installed version from package specs like `openclaw@1.2.3`.
* Moving tags, URLs, git refs, and aliases return null because they cannot be
* compared reliably after install.
*/
function resolveExpectedInstalledVersionFromSpec(packageName, spec) {
	const normalizedPackageName = packageName.trim();
	const normalizedSpec = normalizePackageTarget(spec);
	if (!normalizedPackageName || !normalizedSpec.startsWith(`${normalizedPackageName}@`)) return null;
	const rawVersion = normalizedSpec.slice(normalizedPackageName.length + 1).trim();
	return valid(rawVersion, true);
}
/**
* Verifies packaged installs, or the exact checkout built by a Git update.
* An explicit package spec alone never authorizes a source checkout.
*/
async function collectInstalledGlobalPackageErrors(params) {
	const errors = [];
	if (params.expectedGitCheckout) {
		const installedRoot = await fs$1.realpath(params.packageRoot).catch(() => null);
		if (installedRoot !== params.expectedGitCheckout.root) errors.push(`expected checkout ${params.expectedGitCheckout.root}, found ${installedRoot ?? "<missing>"}`);
		else {
			errors.push(...await collectGitRuntimeErrors(params.expectedGitCheckout));
			if (!await pathExists$1(path.join(installedRoot, "openclaw.mjs"))) errors.push(`missing ${path.join(installedRoot, "openclaw.mjs")}`);
		}
	} else errors.push(...await collectSourceCheckoutInstallErrors(params.packageRoot));
	const installedVersion = await readPackageVersion(params.packageRoot);
	const expectedComparable = normalizePackageVersionForComparison(params.expectedVersion);
	const installedComparable = normalizePackageVersionForComparison(installedVersion);
	if (expectedComparable && installedComparable !== expectedComparable) errors.push(`expected installed version ${expectedComparable}, found ${installedComparable ?? "<missing>"}`);
	if (!params.expectedGitCheckout) errors.push(...await collectInstalledPackageDistErrors({
		packageRoot: params.packageRoot,
		installedVersion,
		expectedVersion: params.expectedVersion
	}));
	return errors;
}
async function verifyPackageUpdateRecovery(root) {
	const version = root ? await readPackageVersion(root).catch(() => null) : null;
	if (root && version && (await collectInstalledGlobalPackageErrors({
		packageRoot: root,
		expectedVersion: version
	}).catch(() => ["verification failed"])).length === 0) return {
		serviceRestartSafe: true,
		version
	};
	return {
		serviceRestartSafe: false,
		reason: "runtime-verification-failed"
	};
}
async function collectSourceCheckoutInstallErrors(packageRoot) {
	const realPackageRoot = await tryRealpath(packageRoot);
	return (await pathExists$1(path.join(realPackageRoot, ".git")) || await pathExists$1(path.join(realPackageRoot, "pnpm-workspace.yaml"))) && await pathExists$1(path.join(realPackageRoot, "src")) && await pathExists$1(path.join(realPackageRoot, "extensions")) ? [`global package root resolves to source checkout: ${realPackageRoot}`] : [];
}
function shouldRequirePackagedDistInventory(version) {
	const parsed = parseSemver(version ?? null);
	if (!parsed) return false;
	if (parsed.major !== FIRST_PACKAGED_DIST_INVENTORY_VERSION.major) return parsed.major > FIRST_PACKAGED_DIST_INVENTORY_VERSION.major;
	if (parsed.minor !== FIRST_PACKAGED_DIST_INVENTORY_VERSION.minor) return parsed.minor > FIRST_PACKAGED_DIST_INVENTORY_VERSION.minor;
	return parsed.patch >= FIRST_PACKAGED_DIST_INVENTORY_VERSION.patch;
}
async function collectInstalledPackageDistErrors(params) {
	const criticalPaths = await collectCriticalInstalledPackageDistPaths(params.packageRoot);
	let inventoryFiles = null;
	let inventoryError = null;
	try {
		inventoryFiles = await readPackageDistInventoryIfPresent(params.packageRoot);
	} catch {
		inventoryError = `invalid package dist inventory ${PACKAGE_DIST_INVENTORY_RELATIVE_PATH}`;
	}
	if (inventoryFiles !== null) {
		const actualFiles = await collectPackageDistInventory(params.packageRoot);
		const inventoryErrors = await collectInstalledPathErrors({
			packageRoot: params.packageRoot,
			expectedFiles: inventoryFiles,
			actualFiles,
			missingMessage: (relativePath) => `missing packaged dist file ${relativePath}`,
			unexpectedMessage: (relativePath) => `unexpected packaged dist file ${relativePath}`
		});
		const inventorySet = new Set(inventoryFiles);
		const supplementalCriticalPaths = criticalPaths.filter((relativePath) => !inventorySet.has(relativePath));
		if (supplementalCriticalPaths.length === 0) return inventoryErrors;
		return [...inventoryErrors, ...await collectInstalledPathErrors({
			packageRoot: params.packageRoot,
			expectedFiles: supplementalCriticalPaths,
			actualFiles,
			missingMessage: (relativePath) => `missing bundled runtime sidecar ${relativePath}`
		})];
	}
	const criticalErrors = await collectInstalledPathErrors({
		packageRoot: params.packageRoot,
		expectedFiles: criticalPaths,
		actualFiles: null,
		missingMessage: (relativePath) => `missing bundled runtime sidecar ${relativePath}`
	});
	if (inventoryError) return [inventoryError, ...criticalErrors];
	if (shouldRequirePackagedDistInventory(params.installedVersion) || shouldRequirePackagedDistInventory(params.expectedVersion)) return [`missing package dist inventory ${PACKAGE_DIST_INVENTORY_RELATIVE_PATH}`, ...criticalErrors];
	return criticalErrors;
}
async function collectCriticalInstalledPackageDistPaths(packageRoot) {
	const expectedFiles = /* @__PURE__ */ new Set();
	await Promise.all(BUNDLED_RUNTIME_SIDECAR_PATHS.map(async (relativePath) => {
		const pluginRoot = resolveBundledPluginRoot(relativePath);
		if (pluginRoot === null) return;
		if (OMITTED_PRIVATE_QA_BUNDLED_PLUGIN_ROOTS.has(pluginRoot)) return;
		if (await pathExists$1(path.join(packageRoot, pluginRoot, "package.json")) || await pathExists$1(path.join(packageRoot, pluginRoot, "openclaw.plugin.json"))) expectedFiles.add(relativePath);
	}));
	return [...expectedFiles].toSorted((left, right) => left.localeCompare(right));
}
function resolveBundledPluginRoot(relativePath) {
	const match = /^dist\/extensions\/[^/]+/u.exec(relativePath);
	return match ? match[0] : null;
}
async function collectInstalledPathErrors(params) {
	const errors = [];
	const actualSet = params.actualFiles ? new Set(params.actualFiles) : null;
	for (const relativePath of params.expectedFiles) if (!(actualSet !== null ? actualSet.has(relativePath) : await pathExists$1(path.join(params.packageRoot, relativePath)))) errors.push(params.missingMessage(relativePath));
	if (actualSet !== null && params.unexpectedMessage) {
		const expectedSet = new Set(params.expectedFiles);
		for (const relativePath of params.actualFiles ?? []) if (!expectedSet.has(relativePath)) errors.push(params.unexpectedMessage(relativePath));
	}
	return errors;
}
/**
* Returns true when a target can be resolved through npm registry metadata.
* Explicit tarball, URL, git, and main-branch specs bypass registry lookup.
*/
function canResolveRegistryVersionForPackageTarget(value) {
	const trimmed = stripPrimaryPackageAlias(value);
	if (!trimmed) return true;
	return !isMainPackageTarget(trimmed) && !isExplicitPackageInstallSpec(trimmed);
}
/** Same-version registry targets are no-ops; explicit artifacts still require validation/install. */
function isPackageTargetAlreadyCurrent(params) {
	return params.currentVersion !== null && params.targetVersion !== null && params.currentVersion === params.targetVersion && canResolveRegistryVersionForPackageTarget(params.target);
}
async function resolvePortableGitPathPrepend() {
	if (process.platform !== "win32") return [];
	const localAppData = process.env.LOCALAPPDATA?.trim();
	if (!localAppData) return [];
	const portableGitRoot = path.join(localAppData, "OpenClaw", "deps", "portable-git");
	const candidates = [
		path.join(portableGitRoot, "mingw64", "bin"),
		path.join(portableGitRoot, "usr", "bin"),
		path.join(portableGitRoot, "cmd"),
		path.join(portableGitRoot, "bin")
	];
	const existing = [];
	for (const candidate of candidates) if (await pathExists$1(candidate)) existing.push(candidate);
	return existing;
}
function applyWindowsPackageInstallEnv(env) {
	if (process.platform !== "win32") return;
	env.NPM_CONFIG_UPDATE_NOTIFIER = "false";
	env.NPM_CONFIG_FUND = "false";
	env.NPM_CONFIG_AUDIT = "false";
}
function applyCorepackDownloadPromptEnv(env) {
	if (!env.COREPACK_ENABLE_DOWNLOAD_PROMPT?.trim()) env.COREPACK_ENABLE_DOWNLOAD_PROMPT = COREPACK_ENABLE_DOWNLOAD_PROMPT_DEFAULT;
}
/**
* Converts a user tag or explicit package target into the package-manager spec
* used by global install commands.
*/
function resolveGlobalInstallSpec(params) {
	const override = params.env?.OPENCLAW_UPDATE_PACKAGE_SPEC?.trim() || process.env.OPENCLAW_UPDATE_PACKAGE_SPEC?.trim();
	if (override) return override;
	const target = normalizePackageTarget(params.tag);
	if (isMainPackageTarget(target)) return OPENCLAW_MAIN_PACKAGE_SPEC;
	if (isExplicitPackageInstallSpec(target)) return target;
	return `${params.packageName}@${target}`;
}
/**
* Builds the package-manager environment used for global installs.
* It keeps caller env values, adds platform-specific install defaults, and
* disables npm/corepack prompts that would otherwise hang unattended updates.
*/
async function createGlobalInstallEnv(env) {
	const pathPrepend = await resolvePortableGitPathPrepend();
	const sourceEnv = env ?? process.env;
	const merged = Object.fromEntries(Object.entries(sourceEnv).filter(([, value]) => value != null).map(([key, value]) => [key, String(value)]));
	applyPathPrepend(merged, pathPrepend);
	applyWindowsPackageInstallEnv(merged);
	applyCorepackDownloadPromptEnv(merged);
	applyNpmFreshnessBypassEnv(merged);
	applyPosixNpmScriptShellEnv(merged);
	return merged;
}
async function tryRealpath(targetPath) {
	try {
		return await fs$1.realpath(targetPath);
	} catch {
		return path.resolve(targetPath);
	}
}
function resolveBunGlobalRoot() {
	return resolveBunGlobalInstallOwner()?.globalRoot ?? path.join(os.homedir(), ".bun", "install", "global", "node_modules");
}
function inferNpmPrefixFromPackageRoot(pkgRoot) {
	return resolveNpmGlobalPrefixLayoutFromGlobalRoot(inferGlobalRootFromPackageRoot(pkgRoot))?.prefix ?? null;
}
function splitNormalizedPathParts(value) {
	return path.resolve(value).split(path.sep).filter(Boolean).map((part) => normalizeLowercaseStringOrEmpty(part));
}
function isNodeVersionPathPart(value) {
	return value !== void 0 && /^v?\d+(?:\.\d+){0,3}(?:[-+][0-9a-z.-]+)?$/u.test(value);
}
function hasPathSequence(parts, sequence) {
	const lastStart = parts.length - sequence.length;
	for (let index = 0; index <= lastStart; index += 1) if (sequence.every((part, offset) => parts[index + offset] === part)) return true;
	return false;
}
function isEphemeralNodeManagedNpmPrefix(prefix) {
	const parts = splitNormalizedPathParts(prefix);
	const basename = parts.at(-1);
	const parent = parts.at(-2);
	const grandparent = parts.at(-3);
	if (isNodeVersionPathPart(basename) && grandparent === "cellar") return true;
	if (isNodeVersionPathPart(basename) && (hasPathSequence(parts, [
		".nvm",
		"versions",
		"node"
	]) || hasPathSequence(parts, [
		"n",
		"versions",
		"node"
	]) || hasPathSequence(parts, [
		".asdf",
		"installs",
		"nodejs"
	]) || hasPathSequence(parts, [
		".volta",
		"tools",
		"image",
		"node"
	]))) return true;
	return basename === "installation" && isNodeVersionPathPart(parent) && grandparent === "node-versions";
}
function resolveNpmCommandBesidePackageRoot(pkgRoot) {
	const prefix = inferNpmPrefixFromPackageRoot(pkgRoot);
	if (!prefix) return null;
	const candidate = process.platform === "win32" ? path.join(prefix, "npm.cmd") : path.join(prefix, "bin", "npm");
	return fs.existsSync(candidate) ? candidate : null;
}
function resolvePreferredNpmCommand(pkgRoot) {
	const prefix = inferNpmPrefixFromPackageRoot(pkgRoot);
	if (prefix && isEphemeralNodeManagedNpmPrefix(prefix)) return null;
	return resolveNpmCommandBesidePackageRoot(pkgRoot);
}
function inferGlobalRootFromPackageRoot(pkgRoot) {
	const trimmed = pkgRoot?.trim();
	if (!trimmed) return null;
	const normalized = path.resolve(trimmed);
	let globalRoot = path.dirname(normalized);
	if (path.basename(globalRoot).startsWith("@")) globalRoot = path.dirname(globalRoot);
	return path.basename(globalRoot) === "node_modules" ? globalRoot : null;
}
function resolvePackageRootFromGlobalRoot(params) {
	const parts = (params.packageName?.trim() || PRIMARY_PACKAGE_NAME).split("/");
	const hasSafeSegments = parts.length > 0 && parts.length <= 2 && parts.every((part) => part.length > 0 && part !== "." && part !== ".." && !part.includes("\\")) && (parts.length === 1 || parts[0]?.startsWith("@"));
	return path.join(params.globalRoot, ...hasSafeSegments ? parts : [PRIMARY_PACKAGE_NAME]);
}
function isDirectNpmNodeModulesRoot(globalRoot) {
	return globalRoot !== null && resolveNpmGlobalPrefixLayoutFromGlobalRoot(globalRoot) === null && resolveNpmGlobalPrefixLayoutFromGlobalRoot(globalRoot, { allowDirectNodeModulesRoot: true }) !== null;
}
function inferBunGlobalRootFromPackageRoot(pkgRoot) {
	return pkgRoot ? resolveBunGlobalInstallOwner(pkgRoot)?.globalRoot ?? null : null;
}
function inferPnpmGlobalRootFromPackageRoot(pkgRoot) {
	const isolatedGlobalRoot = inferPnpmIsolatedGlobalRootFromPackageRoot(pkgRoot);
	if (isolatedGlobalRoot) return isolatedGlobalRoot;
	const directGlobalRoot = inferGlobalRootFromPackageRoot(pkgRoot);
	if (resolvePnpmGlobalDirFromGlobalRoot(directGlobalRoot)) return directGlobalRoot;
	const trimmed = pkgRoot?.trim();
	if (!trimmed) return null;
	const parts = path.resolve(trimmed).split(path.sep);
	const pnpmIndex = parts.lastIndexOf(".pnpm");
	if (pnpmIndex <= 0) return null;
	if (parts[pnpmIndex + 2] !== "node_modules") return null;
	const layoutDir = parts.slice(0, pnpmIndex).join(path.sep) || path.sep;
	const globalRoot = path.basename(layoutDir) === "node_modules" ? layoutDir : path.join(layoutDir, "node_modules");
	return resolvePnpmGlobalDirFromGlobalRoot(globalRoot) ? globalRoot : null;
}
function resolvePnpmIsolatedLayoutVersion(globalRoot) {
	const trimmed = globalRoot?.trim();
	const match = trimmed ? /^v(\d+)$/u.exec(path.basename(path.resolve(trimmed))) : null;
	return match ? Number.parseInt(match[1] ?? "", 10) : null;
}
function inferPnpmIsolatedGlobalRootFromPackageRoot(pkgRoot) {
	const nodeModulesRoot = inferGlobalRootFromPackageRoot(pkgRoot);
	if (!nodeModulesRoot) return null;
	const globalRoot = path.dirname(path.dirname(nodeModulesRoot));
	return resolvePnpmIsolatedLayoutVersion(globalRoot) === null ? null : globalRoot;
}
async function hasPnpmIsolatedProjectMetadata(pkgRoot, packageName = PRIMARY_PACKAGE_NAME) {
	if (!inferPnpmIsolatedGlobalRootFromPackageRoot(pkgRoot)) return false;
	const nodeModulesRoot = inferGlobalRootFromPackageRoot(pkgRoot);
	if (!nodeModulesRoot) return false;
	const installDir = path.dirname(nodeModulesRoot);
	const manifest = await fs$1.readFile(path.join(installDir, "package.json"), "utf8").then((raw) => JSON.parse(raw)).catch(() => null);
	return Boolean(manifest?.dependencies && packageName in manifest.dependencies && await pathExists$1(path.join(installDir, "pnpm-lock.yaml")));
}
/** Resolves the pnpm project owner without following its shared-store package symlink. */
async function resolvePnpmIsolatedInstallOwner(pkgRoot) {
	const nodeModulesRoot = inferGlobalRootFromPackageRoot(pkgRoot);
	if (!nodeModulesRoot) return null;
	return path.resolve(await tryRealpath(path.dirname(nodeModulesRoot)));
}
async function listPnpmIsolatedGlobalPackages(params) {
	const globalRoot = params.globalRoot?.trim();
	const layoutVersion = resolvePnpmIsolatedLayoutVersion(globalRoot);
	if (!globalRoot || layoutVersion === null) return [];
	const packageName = params.packageName?.trim() || PRIMARY_PACKAGE_NAME;
	const entries = await fs$1.readdir(globalRoot, { withFileTypes: true }).catch(() => []);
	const packages = [];
	for (const entry of entries.toSorted((a, b) => a.name.localeCompare(b.name))) {
		if (!entry.isSymbolicLink()) continue;
		const installDir = await fs$1.realpath(path.join(globalRoot, entry.name)).catch(() => null);
		if (!installDir) continue;
		const manifest = await fs$1.readFile(path.join(installDir, "package.json"), "utf8").then((raw) => JSON.parse(raw)).catch(() => null);
		if (!manifest?.dependencies || !(packageName in manifest.dependencies)) continue;
		const packageRoot = resolvePackageRootFromGlobalRoot({
			globalRoot: path.join(installDir, "node_modules"),
			packageName
		});
		if (await pathExists$1(packageRoot)) packages.push({
			globalRoot: path.resolve(globalRoot),
			packageRoot,
			layoutVersion,
			packageNames: Object.keys(manifest.dependencies).toSorted((a, b) => a.localeCompare(b))
		});
	}
	return packages;
}
async function listActivePnpmIsolatedGlobalPackages(params) {
	return (await listPnpmIsolatedGlobalPackages(params)).map((entry) => ({
		packageRoot: entry.packageRoot,
		packageNames: entry.packageNames
	}));
}
async function resolvePnpmIsolatedGlobalPackage(params) {
	const packages = await listPnpmIsolatedGlobalPackages(params);
	const requestedPackageRoot = params.pkgRoot ? path.resolve(params.pkgRoot) : null;
	const requestedOwnerRoot = inferPnpmIsolatedGlobalRootFromPackageRoot(params.pkgRoot);
	const globalRoot = params.globalRoot?.trim();
	const canonicalRequestedOwnerRoot = requestedOwnerRoot ? path.resolve(await tryRealpath(requestedOwnerRoot)) : null;
	const canonicalGlobalRoot = globalRoot ? path.resolve(await tryRealpath(globalRoot)) : null;
	const requestedInstallOwner = requestedPackageRoot && canonicalRequestedOwnerRoot !== null && canonicalRequestedOwnerRoot === canonicalGlobalRoot ? await resolvePnpmIsolatedInstallOwner(requestedPackageRoot) : null;
	for (const entry of packages) {
		const packageRoot = entry.packageRoot;
		if (requestedPackageRoot) {
			const installOwner = await resolvePnpmIsolatedInstallOwner(packageRoot);
			if (requestedInstallOwner === null || installOwner !== requestedInstallOwner) continue;
		}
		return entry;
	}
	return null;
}
async function isPnpmIsolatedGlobalPackageRoot(pkgRoot) {
	const globalRoot = inferPnpmIsolatedGlobalRootFromPackageRoot(pkgRoot);
	if (!globalRoot) return false;
	return Boolean(await resolvePnpmIsolatedGlobalPackage({
		globalRoot,
		pkgRoot
	}));
}
/**
* Resolves pnpm's global-dir from its active global package root.
* pnpm 10 used `<globalDir>/<version>/node_modules`; pnpm 11 uses
* `<globalDir>/v<version>` with isolated package projects below it.
*/
function resolvePnpmGlobalDirFromGlobalRoot(globalRoot) {
	const trimmed = globalRoot?.trim();
	if (!trimmed) return null;
	const normalized = path.resolve(trimmed);
	if (/^v\d+$/u.test(path.basename(normalized))) return path.dirname(normalized);
	if (path.basename(normalized) !== "node_modules") return null;
	const layoutDir = path.dirname(normalized);
	return /^\d+$/u.test(path.basename(layoutDir)) ? path.dirname(layoutDir) : null;
}
async function isPnpmGlobalPackageRoot(pkgRoot) {
	if (await isPnpmIsolatedGlobalPackageRoot(pkgRoot)) return true;
	if (await hasPnpmIsolatedProjectMetadata(pkgRoot)) return true;
	const globalRoot = inferPnpmGlobalRootFromPackageRoot(pkgRoot);
	if (!globalRoot) return false;
	const layoutDir = path.dirname(globalRoot);
	if (!await pathExists$1(path.join(globalRoot, ".modules.yaml"))) return false;
	return await pathExists$1(path.join(layoutDir, "pnpm-lock.yaml")) || await pathExists$1(path.join(layoutDir, "package.json"));
}
/** Resolves an installed pnpm project's identity and its active OpenClaw package link. */
async function resolvePnpmGlobalInstallOwner(pkgRoot) {
	const globalRoot = inferPnpmGlobalRootFromPackageRoot(pkgRoot);
	if (!globalRoot || await readPackageName(pkgRoot) !== PRIMARY_PACKAGE_NAME) return null;
	let ownerRoot;
	let packageRoot;
	if (inferPnpmIsolatedGlobalRootFromPackageRoot(pkgRoot)) {
		const active = await resolvePnpmIsolatedGlobalPackage({
			globalRoot,
			pkgRoot
		});
		if (!active) return null;
		ownerRoot = await resolvePnpmIsolatedInstallOwner(active.packageRoot);
		packageRoot = active.packageRoot;
	} else {
		if (!await isPnpmGlobalPackageRoot(pkgRoot)) return null;
		ownerRoot = await fs$1.realpath(path.dirname(globalRoot)).catch(() => null);
		packageRoot = resolvePackageRootFromGlobalRoot({ globalRoot });
	}
	if (!ownerRoot || await readPackageName(packageRoot) !== PRIMARY_PACKAGE_NAME) return null;
	return {
		ownerRoot,
		packageRoot
	};
}
function resolvePreferredGlobalManagerCommand(manager, pkgRoot) {
	if (manager !== "npm") return manager;
	return resolvePreferredNpmCommand(pkgRoot) ?? manager;
}
/**
* Resolves the package-manager command to execute for a global install.
* npm may use the npm binary beside an existing package root when available.
*/
function resolveGlobalInstallCommand(manager, pkgRoot) {
	return {
		manager,
		command: resolvePreferredGlobalManagerCommand(manager, pkgRoot)
	};
}
function normalizeGlobalInstallCommand(managerOrCommand, pkgRoot) {
	return typeof managerOrCommand === "string" ? resolveGlobalInstallCommand(managerOrCommand, pkgRoot) : managerOrCommand;
}
function resolveBunGlobalInstallSpec(spec) {
	const trimmed = normalizePackageTarget(spec);
	if (normalizeLowercaseStringOrEmpty(trimmed).startsWith(`${PRIMARY_PACKAGE_NAME}@`)) return trimmed;
	const isWindowsAbsolutePath = /^[a-z]:[\\/]/iu.test(trimmed);
	const hasScheme = /^[a-z][a-z0-9+.-]*:/iu.test(trimmed) && !isWindowsAbsolutePath;
	const target = /\.(?:tgz|tar\.gz)$/iu.test(trimmed) && !hasScheme ? `file:${trimmed}` : trimmed;
	return `${PRIMARY_PACKAGE_NAME}@${target}`;
}
function resolveInstallCommandForManager(managerOrCommand, manager, pkgRoot) {
	const normalized = normalizeGlobalInstallCommand(managerOrCommand, pkgRoot);
	return normalized.manager === manager ? normalized : resolveGlobalInstallCommand(manager, pkgRoot);
}
/**
* Reads the global `node_modules` root for a package manager command.
* Bun uses its deterministic install root because it has no `root -g` command.
*/
async function resolveGlobalRoot(managerOrCommand, runCommand, timeoutMs, pkgRoot) {
	const resolved = normalizeGlobalInstallCommand(managerOrCommand, pkgRoot);
	if (resolved.manager === "bun") return inferBunGlobalRootFromPackageRoot(pkgRoot) ?? resolveBunGlobalRoot();
	const res = await runCommand([
		resolved.command,
		"root",
		"-g"
	], { timeoutMs }).catch(() => null);
	if (!res || res.code !== 0) return null;
	return readPackageManagerProbeValue(res.stdout) || null;
}
/**
* Resolves the effective global install target, honoring an existing package
* root when requested and detecting pnpm or bun layouts before command probes.
*/
async function resolveGlobalInstallTarget(params) {
	await (params.pkgOwnership ?? createFreeBsdPkgOwnershipInspection(params.timeoutMs)).assertUnowned(params.pkgRoot);
	const requestedCommand = normalizeGlobalInstallCommand(params.manager, params.pkgRoot);
	const requestedPnpmGlobalRoot = requestedCommand.manager === "pnpm" ? await resolveGlobalRoot(requestedCommand, params.runCommand, params.timeoutMs, params.pkgRoot) : null;
	const inferredPnpmIsolatedGlobalRoot = inferPnpmIsolatedGlobalRootFromPackageRoot(params.pkgRoot);
	const pnpmIsolatedPackage = inferredPnpmIsolatedGlobalRoot ? await resolvePnpmIsolatedGlobalPackage({
		globalRoot: inferredPnpmIsolatedGlobalRoot,
		packageName: params.packageName,
		pkgRoot: params.pkgRoot
	}) : await resolvePnpmIsolatedGlobalPackage({
		globalRoot: requestedPnpmGlobalRoot,
		packageName: params.packageName,
		pkgRoot: params.pkgRoot
	});
	const hasPnpmIsolatedMetadata = pnpmIsolatedPackage ? true : await hasPnpmIsolatedProjectMetadata(params.pkgRoot, params.packageName);
	const verifiedPnpmIsolatedGlobalRoot = pnpmIsolatedPackage?.globalRoot ?? (hasPnpmIsolatedMetadata ? inferredPnpmIsolatedGlobalRoot : null);
	const honoredPackageRootGlobalRoot = params.honorPackageRoot ? inferGlobalRootFromPackageRoot(params.pkgRoot) : null;
	const pnpmPackageRootGlobalRoot = verifiedPnpmIsolatedGlobalRoot || await isPnpmGlobalPackageRoot(params.pkgRoot) ? inferPnpmGlobalRootFromPackageRoot(params.pkgRoot) : null;
	const bunPackageRootGlobalRoot = inferBunGlobalRootFromPackageRoot(params.pkgRoot);
	const honoredDirectNpmRoot = verifiedPnpmIsolatedGlobalRoot === null && pnpmIsolatedPackage === null && pnpmPackageRootGlobalRoot === null && bunPackageRootGlobalRoot === null && isDirectNpmNodeModulesRoot(honoredPackageRootGlobalRoot);
	const command = bunPackageRootGlobalRoot ? resolveInstallCommandForManager(params.manager, "bun", params.pkgRoot) : verifiedPnpmIsolatedGlobalRoot || pnpmPackageRootGlobalRoot ? resolveInstallCommandForManager(params.manager, "pnpm", params.pkgRoot) : honoredDirectNpmRoot ? resolveInstallCommandForManager(params.manager, "npm", params.pkgRoot) : normalizeGlobalInstallCommand(params.manager, params.pkgRoot);
	const pkgRootGlobalRoot = command.manager === "pnpm" ? pnpmPackageRootGlobalRoot : null;
	const npmPackageRootGlobalRoot = command.manager === "npm" && inferNpmPrefixFromPackageRoot(params.pkgRoot) ? inferGlobalRootFromPackageRoot(params.pkgRoot) : null;
	const targetGlobalRoot = (command.manager === "bun" ? bunPackageRootGlobalRoot : null) ?? (command.manager === "pnpm" ? verifiedPnpmIsolatedGlobalRoot : null) ?? pkgRootGlobalRoot ?? (command.manager === "npm" ? honoredPackageRootGlobalRoot : null) ?? npmPackageRootGlobalRoot ?? (requestedCommand.manager === "pnpm" && command.manager === requestedCommand.manager && command.command === requestedCommand.command ? requestedPnpmGlobalRoot : await resolveGlobalRoot(command, params.runCommand, params.timeoutMs, params.pkgRoot));
	const pnpmIsolatedLayoutVersion = pnpmIsolatedPackage?.layoutVersion ?? resolvePnpmIsolatedLayoutVersion(verifiedPnpmIsolatedGlobalRoot);
	const fallbackPackageRoot = targetGlobalRoot ? resolvePackageRootFromGlobalRoot({
		globalRoot: targetGlobalRoot,
		packageName: params.packageName
	}) : null;
	const packageRoot = command.manager === "pnpm" ? pnpmIsolatedPackage?.packageRoot ?? (verifiedPnpmIsolatedGlobalRoot && params.pkgRoot ? params.pkgRoot : fallbackPackageRoot) : fallbackPackageRoot;
	if (process.platform === "freebsd" && !packageRoot) throw new FreeBsdPkgOwnershipError("pkg-ownership-unavailable", "paths");
	await createFreeBsdPkgOwnershipInspection(params.timeoutMs).assertUnowned(packageRoot);
	const npmOwner = command.manager === "npm" ? await resolveNpmOwner({
		command: command.command,
		runCommand: params.runCommand,
		timeoutMs: params.timeoutMs
	}) : null;
	return {
		...command,
		...command.manager === "pnpm" && pnpmIsolatedLayoutVersion !== null ? { pnpmIsolated: { layoutVersion: pnpmIsolatedLayoutVersion } } : {},
		globalRoot: targetGlobalRoot,
		packageRoot,
		...npmOwner ? { npmOwner } : {},
		...honoredPackageRootGlobalRoot && targetGlobalRoot === honoredPackageRootGlobalRoot && honoredDirectNpmRoot ? { directNodeModulesRoot: true } : {}
	};
}
async function inspectNpmGlobalOwner(runCommand, pkgRoot, timeoutMs, diagnostics) {
	const layout = resolveNpmGlobalPrefixLayoutFromGlobalRoot(inferGlobalRootFromPackageRoot(pkgRoot));
	if (!layout) {
		diagnostics.push("npm install layout: no global prefix");
		return false;
	}
	const selected = await probeNpmGlobalPrefix(runCommand, timeoutMs, resolvePreferredGlobalManagerCommand("npm", pkgRoot), diagnostics);
	const pkgReal = await tryRealpath(pkgRoot);
	if (selected && await tryRealpath(path.join(selected.globalRoot, PRIMARY_PACKAGE_NAME)) === pkgReal) return true;
	const { launcher, launcherTarget } = await inspectNpmLauncher(layout);
	diagnostics.push(`npm install prefix: ${layout.prefix}`, `npm launcher: ${launcher}`);
	if (!launcherTarget) return false;
	const relative = path.relative(pkgReal, launcherTarget);
	return relative !== "" && relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}
/** Identifies a global owner from command probes and installed layout evidence. */
async function detectGlobalInstallManagerForRoot(runCommand, pkgRoot, timeoutMs, diagnostics = []) {
	const pkgReal = await tryRealpath(pkgRoot);
	diagnostics.push(`package root: ${pkgRoot} (resolved: ${pkgReal})`);
	if (resolveBunGlobalInstallOwner(pkgRoot) ?? resolveBunGlobalInstallOwner(pkgReal)) return await isPnpmGlobalPackageRoot(pkgRoot) ? "pnpm" : "bun";
	for (const { manager, argv } of [{
		manager: "npm",
		argv: [
			"npm",
			"root",
			"-g"
		]
	}, {
		manager: "pnpm",
		argv: [
			"pnpm",
			"root",
			"-g"
		]
	}]) {
		const res = await runCommand(argv, { timeoutMs }).catch(() => null);
		const globalRoot = res?.code === 0 ? readPackageManagerProbeValue(res.stdout) : "";
		diagnostics.push(`${argv.join(" ")}: ${globalRoot || "unavailable"}`);
		if (!res || res.code !== 0) continue;
		if (!globalRoot) continue;
		const globalReal = await tryRealpath(globalRoot);
		if (manager === "pnpm") {
			for (const name of ALL_PACKAGE_NAMES) if (await resolvePnpmIsolatedGlobalPackage({
				globalRoot,
				packageName: name,
				pkgRoot
			})) return "pnpm";
		}
		for (const name of ALL_PACKAGE_NAMES) {
			const expectedReal = await tryRealpath(path.join(globalReal, name));
			if (path.resolve(expectedReal) === path.resolve(pkgReal)) return manager;
		}
	}
	if (await isPnpmGlobalPackageRoot(pkgRoot)) return "pnpm";
	if (resolveNpmCommandBesidePackageRoot(pkgRoot)) return "npm";
	return await inspectNpmGlobalOwner(runCommand, pkgRoot, timeoutMs, diagnostics) ? "npm" : null;
}
/**
* Detects an installed global OpenClaw package by probing package-manager roots
* when no trusted package root is already available.
*/
async function detectGlobalInstallManagerByPresence(runCommand, timeoutMs) {
	for (const manager of ["npm", "pnpm"]) {
		const root = await resolveGlobalRoot(manager, runCommand, timeoutMs);
		if (!root) continue;
		for (const name of ALL_PACKAGE_NAMES) if (await pathExists$1(path.join(root, name))) return manager;
	}
	const bunRoot = resolveBunGlobalRoot();
	for (const name of ALL_PACKAGE_NAMES) if (await pathExists$1(path.join(bunRoot, name))) return "bun";
	return null;
}
/**
* Builds the primary package-manager argv for a global OpenClaw install.
* npm receives quiet/freshness-bypass flags; pnpm and Bun approve OpenClaw's lifecycle.
*/
function globalInstallArgs(managerOrCommand, spec, pkgRoot, installPrefix, installCwd, npmLifecyclePolicy = "allow-scripts") {
	const resolved = normalizeGlobalInstallCommand(managerOrCommand, pkgRoot);
	if (resolved.manager === "pnpm") return [
		resolved.command,
		"add",
		"-g",
		PNPM_OPENCLAW_BUILD_ALLOWLIST_FLAG,
		spec
	];
	if (resolved.manager === "bun") return [
		resolved.command,
		"add",
		"-g",
		BUN_OPENCLAW_TRUST_FLAG,
		resolveBunGlobalInstallSpec(spec)
	];
	return [
		resolved.command,
		"i",
		"-g",
		...npmLifecyclePolicy !== "unflagged" ? [resolveNpmInstallScriptsAllowFlag(spec, installCwd, npmLifecyclePolicy)] : [],
		...installPrefix ? ["--prefix", installPrefix] : [],
		spec,
		...NPM_GLOBAL_INSTALL_QUIET_FLAGS,
		...createNpmFreshnessBypassArgs(process.env, /* @__PURE__ */ new Date(), { npmConfigPrefix: installPrefix })
	];
}
/**
* Builds npm's retry argv without optional dependencies.
* Non-npm managers have no equivalent fallback and return null.
*/
function globalInstallFallbackArgs(managerOrCommand, spec, pkgRoot, installPrefix, installCwd, npmLifecyclePolicy = "allow-scripts") {
	const resolved = normalizeGlobalInstallCommand(managerOrCommand, pkgRoot);
	if (resolved.manager !== "npm") return null;
	return [
		resolved.command,
		"i",
		"-g",
		...npmLifecyclePolicy !== "unflagged" ? [resolveNpmInstallScriptsAllowFlag(spec, installCwd, npmLifecyclePolicy)] : [],
		...installPrefix ? ["--prefix", installPrefix] : [],
		spec,
		"--omit=optional",
		...NPM_GLOBAL_INSTALL_QUIET_FLAGS,
		...createNpmFreshnessBypassArgs(process.env, /* @__PURE__ */ new Date(), { npmConfigPrefix: installPrefix })
	];
}
/** Removes leftover hidden global package directories from interrupted renames. */
async function cleanupGlobalRenameDirs(params) {
	const removed = [];
	const root = params.globalRoot.trim();
	const name = params.packageName.trim();
	if (!root || !name) return { removed };
	const prefix = `${GLOBAL_RENAME_PREFIX}${name}-`;
	const inspectionDeadline = Date.now() + PKG_INSPECTION_TIMEOUT_MS;
	let entries;
	try {
		entries = await fs$1.readdir(root);
	} catch {
		return { removed };
	}
	for (const entry of entries) {
		if (!entry.startsWith(prefix)) continue;
		const target = path.join(root, entry);
		try {
			const stat = await fs$1.lstat(target);
			if (!stat.isDirectory()) continue;
			if (process.platform === "freebsd") {
				const remainingMs = inspectionDeadline - Date.now();
				if (remainingMs <= 0) break;
				await createFreeBsdPkgOwnershipInspection(remainingMs).assertUnowned(target);
				const current = await fs$1.lstat(target);
				if (!current.isDirectory() || !sameFileIdentity(stat, current)) continue;
			}
			await fs$1.rm(target, {
				recursive: true,
				force: true
			});
			removed.push(entry);
		} catch (error) {
			if (error instanceof FreeBsdPkgOwnershipError && error.reason === "pkg-ownership-unavailable") break;
		}
	}
	return { removed };
}
//#endregion
//#region src/infra/update-npm-failure.ts
const NPM_FAILURE_CODES = [
	"EACCES",
	"EPERM",
	"ENOTEMPTY",
	"EEXIST",
	"ENOENT",
	"E404",
	"ETARGET",
	"ENOSPC",
	"ENOTFOUND",
	"EAI_AGAIN",
	"ECONNREFUSED",
	"ECONNRESET",
	"ETIMEDOUT",
	"ENETUNREACH",
	"EHOSTUNREACH",
	"EPIPE",
	"E401",
	"E403",
	"EOTP",
	"ERESOLVE",
	"EBADENGINE",
	"EINTEGRITY",
	"EUSAGE",
	"EOVERRIDE",
	"EINVALIDTAGNAME",
	"EUNSUPPORTEDPROTOCOL",
	"CERT_HAS_EXPIRED",
	"UNABLE_TO_VERIFY_LEAF_SIGNATURE",
	"SELF_SIGNED_CERT_IN_CHAIN",
	"DEPTH_ZERO_SELF_SIGNED_CERT",
	"unknown"
];
function npmFailureCode(value) {
	return NPM_FAILURE_CODES.find((code) => code === value) ?? "unknown";
}
function sanitizeNpmLine(line, context) {
	return truncateUtf8Prefix(redactSupportDiagnosticLine(line, context).replace(/^(npm (?:ERR!|error) code)\s+\S+/u, (_match, prefix) => `${prefix} ${npmFailureCode(line.split(/\s+/u)[3])}`), 200);
}
/** Capture npm's error lines before command tails or permission guidance replace them. */
function createNpmFailureFacts(stdout, stderr, env = process.env) {
	const lines = stripAnsi(`${stderr}\n${stdout}`).split(/[\r\n\u2028\u2029]/u).map((line) => line.trim()).filter((line) => /^npm (?:ERR!|error)(?:\s|$)/u.test(line));
	const code = npmFailureCode(lines.map((line) => /^npm (?:ERR!|error) code (\S+)/u.exec(line)?.[1]).find(Boolean));
	const context = {
		env,
		stateDir: resolveStateDir(env)
	};
	return (lines.length ? lines.slice(0, 5) : ["npm error (no error lines captured)"]).map((line) => ({
		check: "npm",
		code,
		message: sanitizeNpmLine(line, context)
	}));
}
function formatNpmFailureFacts(facts, context) {
	const npm = facts.filter((fact) => fact.check === "npm").slice(0, 5);
	if (!npm.length) return [];
	const code = npmFailureCode(npm[0]?.code);
	const remedy = code === "EACCES" || code === "EPERM" ? "Check the npm global prefix and run the update as its owning account: https://docs.openclaw.ai/cli/update." : code === "ENOSPC" ? "Free disk space on the npm prefix and cache volumes, then retry the update." : code === "E404" || code === "ETARGET" ? "Check the configured npm registry and requested package version or tag, then retry the update." : void 0;
	return [
		`npm failure code: ${code}`,
		...npm.flatMap((fact) => fact.message ? [sanitizeNpmLine(fact.message, context)] : []),
		...remedy ? [`Next step: ${remedy}`] : []
	];
}
//#endregion
//#region src/infra/update-runner-command.ts
const MAX_LOG_CHARS = 8e3;
const warnedHeartbeats = /* @__PURE__ */ new WeakSet();
function mergeCommandEnvironments(baseEnv, overrideEnv) {
	if (!baseEnv) return overrideEnv;
	if (!overrideEnv) return baseEnv;
	return {
		...baseEnv,
		...overrideEnv
	};
}
async function runStep(opts) {
	const { runCommand, name, argv, cwd, timeoutMs, env, progress, stepIndex, totalSteps } = opts;
	const command = argv.join(" ");
	const stepInfo = {
		name,
		command,
		index: stepIndex,
		total: totalSteps
	};
	progress?.onStepStart?.(stepInfo);
	const started = Date.now();
	const onHeartbeat = progress?.onHeartbeat;
	const heartbeat = onHeartbeat ? setInterval(() => {
		try {
			onHeartbeat();
		} catch (error) {
			if (!warnedHeartbeats.has(onHeartbeat)) {
				warnedHeartbeats.add(onHeartbeat);
				console.warn(`[update] Could not refresh the update heartbeat; continuing the command: ${trimLogTail(formatErrorMessage(error), 500)}`);
			}
		}
	}, UPDATE_RUN_HEARTBEAT_MS) : void 0;
	heartbeat?.unref();
	let result;
	let commandError;
	let failureFacts;
	try {
		result = await runCommand(argv, {
			cwd,
			timeoutMs,
			env
		});
	} catch (error) {
		commandError = { cause: error };
		const fact = createUpdateErrorFact(name, error, env);
		failureFacts = [fact];
		result = {
			code: 1,
			stdout: "",
			stderr: fact.message ?? ""
		};
	} finally {
		clearInterval(heartbeat);
	}
	const durationMs = Date.now() - started;
	const stdoutTail = trimLogTail(result.stdout, MAX_LOG_CHARS);
	const stderrTail = trimLogTail(result.stderr, MAX_LOG_CHARS);
	if (!failureFacts && result.code !== 0 && [
		"package-install",
		"package-install-omit-optional",
		"package-pack"
	].includes(name) && (/(?:^|[\\/])npm(?:\.cmd|\.exe)?$/iu.test(argv[0] ?? "") || /\bnpm (?:ERR!|error)(?:\s|$)/u.test(`${result.stderr}\n${result.stdout}`))) failureFacts = createNpmFailureFacts(result.stdout, result.stderr, env);
	failureFacts ??= isFailedUpdateStep({
		exitCode: result.code,
		killed: result.killed,
		outputLimitExceeded: result.outputLimitExceeded,
		termination: result.termination
	}) ? [createUpdateFailureFact({
		check: name,
		code: result.stderr.match(/\bnpm (?:ERR!|error) code ([A-Z][A-Z0-9_]+)/u)?.[1] ?? (result.termination && result.termination !== "exit" ? result.termination : "command-failed"),
		message: result.stderr
	}, env)] : void 0;
	const completion = {
		name,
		command,
		durationMs,
		exitCode: result.code,
		stdoutTail,
		stderrTail,
		signal: result.signal,
		killed: result.killed,
		outputLimitExceeded: result.outputLimitExceeded,
		termination: result.termination,
		...failureFacts ? { failureFacts } : {}
	};
	progress?.onStepComplete?.({
		...stepInfo,
		...completion
	});
	const stepResult = {
		...completion,
		cwd
	};
	opts.results?.push(stepResult);
	if (commandError) throw commandError.cause;
	return stepResult;
}
function normalizeFallbackFailureReason(stepName) {
	switch (stepName) {
		case "package-install":
		case "package-install-omit-optional":
		case "package-stage":
		case "package-verify":
		case "package-swap": return "global-install-failed";
		case "openclaw doctor": return "doctor-failed";
		case "post-install-verify": return "runtime-verification-failed";
		case "post-doctor-ui-build": return "ui-build-failed";
		default: return "unexpected-error";
	}
}
async function buildUpdateCommandRunner(runCommand) {
	const defaultCommandEnv = await createGlobalInstallEnv();
	if (runCommand) return {
		defaultCommandEnv,
		runCommand
	};
	return {
		defaultCommandEnv,
		runCommand: async (argv, options) => await runCommandWithTimeout(argv, {
			...options,
			env: mergeCommandEnvironments(defaultCommandEnv, options.env),
			killProcessTree: true
		})
	};
}
//#endregion
export { createFreeBsdPkgOwnershipInspection as A, verifyPackageUpdateRecovery as C, resolveNpmGlobalPrefixLayoutFromGlobalRoot as D, readPackageManagerProbeValue as E, resolveBunGlobalInstallOwner as M, resolveNpmGlobalPrefixLayoutFromPrefix as O, resolvePnpmIsolatedInstallOwner as S, probeNpmGlobalPrefix as T, resolveGlobalInstallSpec as _, formatNpmFailureFacts as a, resolvePnpmGlobalDirFromGlobalRoot as b, collectInstalledGlobalPackageErrors as c, detectGlobalInstallManagerForRoot as d, globalInstallArgs as f, resolveExpectedInstalledVersionFromSpec as g, listActivePnpmIsolatedGlobalPackages as h, runStep as i, detectPackageManager as j, FreeBsdPkgOwnershipError as k, createGlobalInstallEnv as l, isPackageTargetAlreadyCurrent as m, buildUpdateCommandRunner as n, canResolveRegistryVersionForPackageTarget as o, globalInstallFallbackArgs as p, normalizeFallbackFailureReason as r, cleanupGlobalRenameDirs as s, MAX_LOG_CHARS as t, detectGlobalInstallManagerByPresence as u, resolveGlobalInstallTarget as v, inspectNpmLauncher as w, resolvePnpmGlobalInstallOwner as x, resolveNpmLifecyclePolicyGate as y };
