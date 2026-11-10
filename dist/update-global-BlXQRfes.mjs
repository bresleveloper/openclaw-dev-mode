import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as extractErrorCode, n as coerceErrorMessage } from "./error-coercion-BwMr25F8.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { l as pathExists$1 } from "./utils-gjJ-tD2q.mjs";
import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as isPathInside } from "./fs-safe-6Z4UiMS4.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DaL1xmcH.mjs";
import { t as normalizeSupportDiagnosticErrorCode } from "./diagnostic-support-redaction-BP5XqJ7g.mjs";
import { a as normalizeUpdateFailureFacts } from "./update-failure-facts-3t5Fm3wV.mjs";
import { t as runCommandBuffered } from "./exec-Bf6uhUA7.mjs";
import { n as applyPosixNpmScriptShellEnv, r as createNpmFreshnessBypassArgs, t as applyNpmFreshnessBypassEnv } from "./npm-install-env-B76s0YXJ.mjs";
import { t as applyPathPrepend } from "./path-prepend-D21kYd3c.mjs";
import { i as readPackageVersion, r as readPackageName } from "./package-json-B0xzRYh1.mjs";
import { n as resolveBunGlobalInstallOwner } from "./detect-package-manager-Bj0ojQ-Y.mjs";
import { a as readPackageDistInventoryIfPresent, r as collectPackageDistInventory, s as PACKAGE_DIST_INVENTORY_RELATIVE_PATH } from "./package-dist-inventory-_17OXIG1.mjs";
import { t as collectGitRuntimeErrors } from "./update-git-runtime-S2Kgafdv.mjs";
import { o as parseSemver } from "./runtime-guard-BzyF4hYe.mjs";
import { i as resolvePnpmHome, n as resolvePnpmCommand, r as resolvePnpmGlobalDirFromGlobalRoot } from "./update-native-package-owner-CYzbhR-v.mjs";
import { i as resolveNpmGlobalPrefixLayoutFromGlobalRoot, n as probeNpmGlobalPrefix, r as readPackageManagerProbeValue, t as inspectNpmLauncher } from "./update-npm-prefix-DY4dJ1W0.mjs";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
import { valid } from "semver";
import { isUtf8 } from "node:buffer";
//#region scripts/lib/bundled-runtime-sidecar-paths.json
var bundled_runtime_sidecar_paths_default = [
	"dist/extensions/a2a/runtime-api.js",
	"dist/extensions/browser/runtime-api.js",
	"dist/extensions/canvas/runtime-api.js",
	"dist/extensions/cloudflare/runtime-api.js",
	"dist/extensions/copilot-proxy/runtime-api.js",
	"dist/extensions/google/runtime-api.js",
	"dist/extensions/lmstudio/runtime-api.js",
	"dist/extensions/memory-core/runtime-api.js",
	"dist/extensions/ollama/runtime-api.js",
	"dist/extensions/reef/runtime-api.js",
	"dist/extensions/telegram/runtime-api.js",
	"dist/extensions/telegram/runtime-setter-api.js",
	"dist/extensions/workboard/runtime-api.js",
	"dist/extensions/x/runtime-api.js"
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
//#region src/infra/update-pre-mutation-error.ts
var UpdatePreMutationError = class extends Error {
	#stepResult;
	get stepResult() {
		return this.#stepResult;
	}
	constructor(reason, message, options) {
		super(message, options);
		this.reason = reason;
		this.name = "UpdatePreMutationError";
		this.origin = options?.origin;
		this.nextAction = options?.nextAction;
		this.recoverySteps = options?.recoverySteps;
		this.#stepResult = options?.stepResult ? {
			steps: options.stepResult.steps,
			failedStep: options.stepResult.failedStep
		} : void 0;
		this.failureFacts = normalizeUpdateFailureFacts(options?.failureFacts ?? [{
			check: reason,
			code: reason,
			message
		}]);
	}
};
//#endregion
//#region src/infra/update-system-package-ownership.ts
const PKG_INSPECTION_TIMEOUT_MS = 3e4;
const PACKAGE_OWNERS = [{
	platform: "freebsd",
	manager: "pkg",
	label: "FreeBSD pkg",
	command: [
		"/usr/sbin/pkg",
		"-N",
		"query",
		"-a",
		"%Fp"
	],
	env: {
		ALIAS: "query=query",
		PKG_ENABLE_PLUGINS: "no"
	},
	guidance: "Update it through pkg or the Ports deployment that owns it"
}, {
	platform: "linux",
	manager: "pacman",
	label: "pacman",
	command: ["pacman", "-Qql"],
	env: void 0,
	guidance: "Update with `pacman -Syu` or your AUR helper"
}];
function packageOwner() {
	return PACKAGE_OWNERS.find((owner) => owner.platform === process.platform);
}
var SystemPackageOwnershipError = class extends UpdatePreMutationError {
	constructor(kind, source = "database", diagnostic) {
		const owner = packageOwner() ?? PACKAGE_OWNERS[0];
		const code = diagnostic && "code" in diagnostic ? normalizeSupportDiagnosticErrorCode(diagnostic.code) : void 0;
		const prefix = !diagnostic ? "" : "budgetMs" in diagnostic ? `${owner.label} inspection exhausted its shared ${diagnostic.budgetMs} ms budget during ${diagnostic.operation}. ` : `${owner.label} inspection failed during ${diagnostic.operation}${code ? ` (${code})` : ""}. `;
		super(`${owner.manager}-${kind}`, prefix + (kind === "owned-install" ? `This installation contains files installed by ${owner.label}. ${owner.guidance}; openclaw update will not replace package-owned files.` : source === "paths" ? `${owner.label} paths could not be inspected completely. Check access to the registered package directories and installation paths, and resolve any inspection timeout before retrying.` : `${owner.label} ${code === "ENOENT" ? "executable was not found. Package ownership could not be verified." : `ownership could not be verified. Restore access to the active ${owner.manager} database and configuration, then retry.`}`));
		this.owned = kind === "owned-install";
	}
};
async function readPackageFiles(owner, timeoutMs, runCommand) {
	const result = await runCommand([...owner.command], {
		timeoutMs,
		env: owner.env,
		maxOutputBytes: {
			stdout: 16777216,
			stderr: 65536
		}
	});
	const output = result.stdout.toString("utf8");
	const files = output === "" ? [] : output.slice(0, -1).split("\n");
	if (result.termination !== "exit" || result.code !== 0 || result.stderr.length !== 0 || !isUtf8(result.stdout) || output !== "" && !output.endsWith("\n") || files.length > 25e4 || files.some((file) => !path.isAbsolute(file) || containsAsciiControlCharacter(file))) throw new SystemPackageOwnershipError("ownership-unavailable", "database", {
		operation: `${owner.manager} query`,
		...result.termination === "timeout" ? { budgetMs: timeoutMs } : { code: extractErrorCode(result.error) }
	});
	return files;
}
/** One planning snapshot; create a fresh inspection before installation effects. */
const log = createSubsystemLogger("update");
function createSystemPackageOwnershipInspection(timeoutMs = PKG_INSPECTION_TIMEOUT_MS, options = {}) {
	const owner = packageOwner();
	let files;
	let unavailable = false;
	const directories = /* @__PURE__ */ new Map();
	const assertions = /* @__PURE__ */ new Map();
	const budget = Number.isFinite(timeoutMs) ? Math.min(PKG_INSPECTION_TIMEOUT_MS, Math.max(1, timeoutMs)) : PKG_INSPECTION_TIMEOUT_MS;
	let deadline;
	let pathReads = 0;
	const read = async (source, label, operation) => {
		try {
			const value = await awaitWithinDeadline(() => {
				if (source === "paths" && ++pathReads > 5e4) throw new SystemPackageOwnershipError("ownership-unavailable", "paths");
				return operation();
			}, deadline);
			if (value !== ABSOLUTE_DEADLINE_EXPIRED) return value;
		} catch (error) {
			if (error instanceof SystemPackageOwnershipError) throw error;
			throw new SystemPackageOwnershipError("ownership-unavailable", source, {
				operation: label,
				code: extractErrorCode(error)
			});
		}
		throw new SystemPackageOwnershipError("ownership-unavailable", source, {
			operation: label,
			budgetMs: budget
		});
	};
	const canonicalDirectory = (directory) => getOrCreatePromise(directories, directory, async () => {
		if (await read("paths", "lstat", () => fs$1.lstat(directory).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return null;
			throw error;
		}))) return read("paths", "realpath", () => fs$1.realpath(directory));
		const parent = path.dirname(directory);
		if (parent === directory) throw new SystemPackageOwnershipError("ownership-unavailable", "paths");
		return path.join(await canonicalDirectory(parent), path.basename(directory));
	});
	const canonicalEntry = async (file) => path.join(await canonicalDirectory(path.dirname(file)), path.basename(file));
	const assertUnowned = async (lexicalRoot, entryOnly) => {
		if (!owner) return;
		const inventory = await read("database", `${owner.manager} query`, () => files ??= readPackageFiles(owner, budget, options.runCommand ?? runCommandBuffered));
		const matches = (candidate, file) => entryOnly ? candidate === file : isPathInside(candidate, file);
		if (inventory.some((file) => matches(lexicalRoot, file))) throw new SystemPackageOwnershipError("owned-install");
		const rootEntry = await canonicalEntry(lexicalRoot);
		const canonicalRoot = entryOnly ? rootEntry : await canonicalDirectory(lexicalRoot);
		for (const file of inventory) {
			const canonicalFile = await canonicalEntry(file);
			if (canonicalFile === rootEntry || matches(canonicalRoot, canonicalFile)) throw new SystemPackageOwnershipError("owned-install");
		}
	};
	const inspect = (root, entryOnly = false) => {
		if (!owner || !root || unavailable) return Promise.resolve();
		const resolvedRoot = path.resolve(root);
		return getOrCreatePromise(assertions, `${entryOnly}:${resolvedRoot}`, async () => {
			deadline ??= Date.now() + budget;
			if (Date.now() >= deadline) throw new SystemPackageOwnershipError("ownership-unavailable", "paths", {
				operation: "path inspection",
				budgetMs: budget
			});
			return assertUnowned(resolvedRoot, entryOnly);
		}).catch((error) => {
			if (!(error instanceof SystemPackageOwnershipError) || error.owned) throw error;
			if (unavailable) return;
			unavailable = true;
			(options.onWarning ?? ((message) => log.warn(message)))(`${error.message} Continuing without verified system-package ownership.`);
		});
	};
	return {
		assertUnowned: (root) => inspect(root),
		assertEntryUnowned: (file) => inspect(file, true)
	};
}
//#endregion
//#region src/infra/update-global-env.ts
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
/** Prepares the selected package manager for unattended global installs. */
async function createGlobalInstallEnv(env, options = {}) {
	const pathPrepend = await resolvePortableGitPathPrepend();
	const sourceEnv = env ?? process.env;
	const merged = Object.fromEntries(Object.entries(sourceEnv).filter(([, value]) => value != null).map(([key, value]) => [key, String(value)]));
	applyPathPrepend(merged, pathPrepend);
	const pnpmHome = options.manager === "pnpm" ? resolvePnpmHome(options.globalRoot) : null;
	if (pnpmHome) {
		merged.PNPM_HOME = pnpmHome;
		applyPathPrepend(merged, [path.join(pnpmHome, "bin"), pnpmHome]);
	}
	if (process.platform === "win32") {
		merged.NPM_CONFIG_UPDATE_NOTIFIER = "false";
		merged.NPM_CONFIG_FUND = "false";
		merged.NPM_CONFIG_AUDIT = "false";
	}
	if (!merged.COREPACK_ENABLE_DOWNLOAD_PROMPT?.trim()) merged.COREPACK_ENABLE_DOWNLOAD_PROMPT = "0";
	if (options.manager !== "bun") applyNpmFreshnessBypassEnv(merged);
	applyPosixNpmScriptShellEnv(merged);
	if (process.versions.bun) merged.OPENCLAW_PACKAGE_BUN_LAUNCHER = process.execPath;
	return merged;
}
//#endregion
//#region src/infra/update-global.ts
const PRIMARY_PACKAGE_NAME = "openclaw";
/** npm-compatible spec used when the user asks to install the moving main branch. */
const OPENCLAW_MAIN_PACKAGE_SPEC = "github:openclaw/openclaw#main";
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
		stderr: coerceErrorMessage(error),
		code: 1
	}));
	const version = result.code === 0 ? readPackageManagerProbeValue(result.stdout) : "";
	return {
		version: version || null,
		lifecyclePolicy: version ? resolveNpmLifecyclePolicy(version) : null,
		...result.code === 0 || !result.stderr ? {} : { probeError: result.stderr }
	};
}
function normalizePackageVersionForComparison(value) {
	const trimmed = value?.trim();
	if (!trimmed) return null;
	return trimmed.replace(/^[vV](?=\d)/, "");
}
function isMainPackageTarget(value) {
	return normalizeLowercaseStringOrEmpty(value) === "main";
}
function isExplicitPackageInstallSpec(value) {
	const trimmed = value.trim();
	return /\.(?:tgz|tar\.gz)$/iu.test(trimmed) || trimmed.includes("://") || trimmed.includes("#") || /^(?:file|github|git\+ssh|git\+https|git\+http|git\+file|npm):/i.test(trimmed);
}
function resolveNpmInstallScriptsAllowFlag(spec, installCwd, policy) {
	const normalized = spec.trim();
	const unaliased = stripPrimaryPackageAlias(normalized);
	let identity = isExplicitPackageInstallSpec(normalized) || isExplicitPackageInstallSpec(unaliased) || /^(?:\.{1,2})(?:[\\/]|$)/u.test(unaliased) || path.isAbsolute(normalized) || path.isAbsolute(unaliased) ? unaliased : PRIMARY_PACKAGE_NAME;
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
	const scoped = target.startsWith("@");
	const scopeSeparator = scoped ? target.indexOf("/") : -1;
	if (scoped && scopeSeparator <= 1) return null;
	const versionSeparator = target.indexOf("@", scopeSeparator + 1);
	return (versionSeparator === -1 ? target : target.slice(0, versionSeparator)) || null;
}
function stripPrimaryPackageAlias(spec) {
	const normalized = spec.trim();
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
	const normalizedSpec = spec.trim();
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
	let criticalPaths = await collectCriticalInstalledPackageDistPaths(params.packageRoot);
	let inventoryFiles = null;
	let inventoryError = null;
	try {
		inventoryFiles = await readPackageDistInventoryIfPresent(params.packageRoot);
	} catch {
		inventoryError = `invalid package dist inventory ${PACKAGE_DIST_INVENTORY_RELATIVE_PATH}`;
	}
	let actualFiles = null;
	let inventoryErrors = [];
	if (inventoryFiles !== null) {
		actualFiles = await collectPackageDistInventory(params.packageRoot);
		inventoryErrors = await collectInstalledPathErrors({
			packageRoot: params.packageRoot,
			expectedFiles: inventoryFiles,
			actualFiles,
			missingMessage: (relativePath) => `missing packaged dist file ${relativePath}`,
			unexpectedMessage: (relativePath) => `unexpected packaged dist file ${relativePath}`
		});
		const inventorySet = new Set(inventoryFiles);
		criticalPaths = criticalPaths.filter((relativePath) => !inventorySet.has(relativePath));
	}
	const criticalErrors = await collectInstalledPathErrors({
		packageRoot: params.packageRoot,
		expectedFiles: criticalPaths,
		actualFiles,
		missingMessage: (relativePath) => `missing bundled runtime sidecar ${relativePath}`
	});
	if (inventoryFiles === null) {
		if (inventoryError) inventoryErrors.push(inventoryError);
		else if (shouldRequirePackagedDistInventory(params.installedVersion) || shouldRequirePackagedDistInventory(params.expectedVersion)) inventoryErrors.push(`missing package dist inventory ${PACKAGE_DIST_INVENTORY_RELATIVE_PATH}`);
	}
	return [...inventoryErrors, ...criticalErrors];
}
async function collectCriticalInstalledPackageDistPaths(packageRoot) {
	const expectedFiles = /* @__PURE__ */ new Set();
	await Promise.all(BUNDLED_RUNTIME_SIDECAR_PATHS.map(async (relativePath) => {
		const pluginRoot = /^dist\/extensions\/[^/]+/u.exec(relativePath)?.[0];
		if (!pluginRoot) return;
		if (await pathExists$1(path.join(packageRoot, pluginRoot, "package.json")) || await pathExists$1(path.join(packageRoot, pluginRoot, "openclaw.plugin.json"))) expectedFiles.add(relativePath);
	}));
	return [...expectedFiles].toSorted((left, right) => left.localeCompare(right));
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
	return !isMainPackageTarget(trimmed) && !isExplicitPackageInstallSpec(trimmed);
}
/** Same-version registry targets are no-ops; explicit artifacts still require validation/install. */
function isPackageTargetAlreadyCurrent(params) {
	return params.currentVersion !== null && params.currentVersion === params.targetVersion && canResolveRegistryVersionForPackageTarget(params.target);
}
function resolveGlobalInstallSpec(params) {
	const override = params.env?.OPENCLAW_UPDATE_PACKAGE_SPEC?.trim() || process.env.OPENCLAW_UPDATE_PACKAGE_SPEC?.trim();
	if (override) return override;
	const target = params.tag.trim();
	if (isMainPackageTarget(target)) return OPENCLAW_MAIN_PACKAGE_SPEC;
	if (isExplicitPackageInstallSpec(target)) return target;
	return `${params.packageName}@${target}`;
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
function isNodeVersionPathPart(value) {
	return value !== void 0 && /^v?\d+(?:\.\d+){0,3}(?:[-+][0-9a-z.-]+)?$/u.test(value);
}
function hasPathSequence(parts, sequence) {
	const lastStart = parts.length - sequence.length;
	for (let index = 0; index <= lastStart; index += 1) if (sequence.every((part, offset) => parts[index + offset] === part)) return true;
	return false;
}
function isEphemeralNodeManagedNpmPrefix(prefix) {
	const parts = path.resolve(prefix).split(path.sep).filter(Boolean).map(normalizeLowercaseStringOrEmpty);
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
function inferBunGlobalRootFromPackageRoot(pkgRoot, env) {
	return pkgRoot ? resolveBunGlobalInstallOwner(pkgRoot, env)?.globalRoot ?? null : null;
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
function inferPnpmProjectRoot(pkgRoot) {
	const nodeModulesRoot = inferGlobalRootFromPackageRoot(pkgRoot);
	if (!nodeModulesRoot) return null;
	const parts = nodeModulesRoot.split(path.sep);
	const storeIndex = parts.length - 3;
	return path.dirname(parts[storeIndex] === ".pnpm" && parts[storeIndex - 1] === "node_modules" ? parts.slice(0, storeIndex).join(path.sep) : nodeModulesRoot);
}
function inferPnpmIsolatedGlobalRootFromPackageRoot(pkgRoot) {
	const projectRoot = inferPnpmProjectRoot(pkgRoot);
	const globalRoot = projectRoot ? path.dirname(projectRoot) : null;
	return resolvePnpmIsolatedLayoutVersion(globalRoot) === null ? null : globalRoot;
}
async function hasPnpmIsolatedProjectMetadata(pkgRoot, packageName = PRIMARY_PACKAGE_NAME) {
	if (!inferPnpmIsolatedGlobalRootFromPackageRoot(pkgRoot)) return false;
	const installDir = inferPnpmProjectRoot(pkgRoot);
	if (!installDir) return false;
	const manifest = await fs$1.readFile(path.join(installDir, "package.json"), "utf8").then((raw) => JSON.parse(raw)).catch(() => null);
	return Boolean(manifest?.dependencies && packageName in manifest.dependencies && await pathExists$1(path.join(installDir, "pnpm-lock.yaml")));
}
/** Resolves the pnpm project owner without following its shared-store package symlink. */
async function resolvePnpmIsolatedInstallOwner(pkgRoot) {
	const projectRoot = inferPnpmProjectRoot(pkgRoot);
	return projectRoot ? await tryRealpath(projectRoot) : null;
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
		const installDir = path.resolve(globalRoot, entry.name);
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
	const requestedInstallOwner = await resolvePnpmIsolatedInstallOwner(requestedPackageRoot);
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
async function isPnpmGlobalPackageRoot(pkgRoot) {
	const isolatedRoot = inferPnpmIsolatedGlobalRootFromPackageRoot(pkgRoot);
	if (isolatedRoot && await resolvePnpmIsolatedGlobalPackage({
		globalRoot: isolatedRoot,
		pkgRoot
	}) || await hasPnpmIsolatedProjectMetadata(pkgRoot)) return true;
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
function normalizeGlobalInstallCommand(managerOrCommand, pkgRoot) {
	const pnpm = resolvePnpmCommand(inferPnpmGlobalRootFromPackageRoot(pkgRoot));
	return typeof managerOrCommand === "string" ? {
		manager: managerOrCommand,
		command: managerOrCommand === "npm" ? resolvePreferredNpmCommand(pkgRoot) ?? managerOrCommand : managerOrCommand === "pnpm" && pnpm ? pnpm : managerOrCommand === "bun" && process.versions.bun ? process.execPath : managerOrCommand
	} : managerOrCommand;
}
function resolveBunGlobalInstallSpec(spec) {
	const trimmed = spec.trim();
	if (normalizeLowercaseStringOrEmpty(trimmed).startsWith(`${PRIMARY_PACKAGE_NAME}@`)) return trimmed;
	const isWindowsAbsolutePath = /^[a-z]:[\\/]/iu.test(trimmed);
	const hasScheme = /^[a-z][a-z0-9+.-]*:/iu.test(trimmed) && !isWindowsAbsolutePath;
	const target = /\.(?:tgz|tar\.gz)$/iu.test(trimmed) && !hasScheme ? `file:${trimmed}` : trimmed;
	return `${PRIMARY_PACKAGE_NAME}@${target}`;
}
/**
* Reads the global `node_modules` root for a package manager command.
* Bun uses its deterministic install root because it has no `root -g` command.
*/
async function resolveGlobalRoot(resolved, runCommand, timeoutMs, pkgRoot) {
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
	await (params.pkgOwnership ?? createSystemPackageOwnershipInspection(params.timeoutMs)).assertUnowned(params.pkgRoot);
	const requestedCommand = normalizeGlobalInstallCommand(params.manager, params.pkgRoot);
	let requestedPnpmGlobalRoot;
	const resolveRequestedPnpmGlobalRoot = () => requestedPnpmGlobalRoot ??= requestedCommand.manager === "pnpm" ? resolveGlobalRoot(requestedCommand, params.runCommand, params.timeoutMs, params.pkgRoot) : Promise.resolve(null);
	const inferredPnpmIsolatedGlobalRoot = inferPnpmIsolatedGlobalRootFromPackageRoot(params.pkgRoot);
	const pnpmIsolatedPackage = await resolvePnpmIsolatedGlobalPackage({
		globalRoot: inferredPnpmIsolatedGlobalRoot || await resolveRequestedPnpmGlobalRoot(),
		packageName: params.packageName,
		pkgRoot: params.pkgRoot
	});
	const hasPnpmIsolatedMetadata = pnpmIsolatedPackage ? true : await hasPnpmIsolatedProjectMetadata(params.pkgRoot, params.packageName);
	const verifiedPnpmIsolatedGlobalRoot = pnpmIsolatedPackage?.globalRoot ?? (hasPnpmIsolatedMetadata ? inferredPnpmIsolatedGlobalRoot : null);
	const honoredPackageRootGlobalRoot = params.honorPackageRoot ? inferGlobalRootFromPackageRoot(params.pkgRoot) : null;
	const pnpmPackageRootGlobalRoot = verifiedPnpmIsolatedGlobalRoot || await isPnpmGlobalPackageRoot(params.pkgRoot) ? inferPnpmGlobalRootFromPackageRoot(params.pkgRoot) : null;
	const bunPackageRootGlobalRoot = inferBunGlobalRootFromPackageRoot(params.pkgRoot, params.env);
	const honoredDirectNpmRoot = verifiedPnpmIsolatedGlobalRoot === null && pnpmIsolatedPackage === null && pnpmPackageRootGlobalRoot === null && bunPackageRootGlobalRoot === null && honoredPackageRootGlobalRoot !== null && resolveNpmGlobalPrefixLayoutFromGlobalRoot(honoredPackageRootGlobalRoot) === null && resolveNpmGlobalPrefixLayoutFromGlobalRoot(honoredPackageRootGlobalRoot, { allowDirectNodeModulesRoot: true }) !== null;
	const manager = bunPackageRootGlobalRoot ? "bun" : verifiedPnpmIsolatedGlobalRoot || pnpmPackageRootGlobalRoot ? "pnpm" : honoredDirectNpmRoot ? "npm" : requestedCommand.manager;
	const command = manager === requestedCommand.manager ? requestedCommand : normalizeGlobalInstallCommand(manager, params.pkgRoot);
	const pkgRootGlobalRoot = command.manager === "pnpm" ? pnpmPackageRootGlobalRoot : null;
	const npmPackageRootGlobalRoot = command.manager === "npm" && inferNpmPrefixFromPackageRoot(params.pkgRoot) ? inferGlobalRootFromPackageRoot(params.pkgRoot) : null;
	const targetGlobalRoot = (command.manager === "bun" ? bunPackageRootGlobalRoot : null) ?? (command.manager === "pnpm" ? verifiedPnpmIsolatedGlobalRoot : null) ?? pkgRootGlobalRoot ?? (command.manager === "npm" ? honoredPackageRootGlobalRoot : null) ?? npmPackageRootGlobalRoot ?? (requestedCommand.manager === "pnpm" && command.manager === requestedCommand.manager && command.command === requestedCommand.command ? await resolveRequestedPnpmGlobalRoot() : await resolveGlobalRoot(command, params.runCommand, params.timeoutMs, params.pkgRoot));
	const pnpmIsolatedLayoutVersion = pnpmIsolatedPackage?.layoutVersion ?? resolvePnpmIsolatedLayoutVersion(verifiedPnpmIsolatedGlobalRoot);
	const fallbackPackageRoot = targetGlobalRoot ? resolvePackageRootFromGlobalRoot({
		globalRoot: targetGlobalRoot,
		packageName: params.packageName
	}) : null;
	const packageRoot = command.manager === "pnpm" ? pnpmIsolatedPackage?.packageRoot ?? (verifiedPnpmIsolatedGlobalRoot && params.pkgRoot ? params.pkgRoot : fallbackPackageRoot) : fallbackPackageRoot;
	await createSystemPackageOwnershipInspection(params.timeoutMs).assertUnowned(packageRoot);
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
	const selected = await probeNpmGlobalPrefix(runCommand, timeoutMs, resolvePreferredNpmCommand(pkgRoot) ?? "npm", diagnostics);
	const pkgReal = await tryRealpath(pkgRoot);
	if (selected && await tryRealpath(path.join(selected.globalRoot, PRIMARY_PACKAGE_NAME)) === pkgReal) return true;
	const { launcher, launcherTarget } = await inspectNpmLauncher(layout);
	diagnostics.push(`npm install prefix: ${layout.prefix}`, `npm launcher: ${launcher}`);
	if (!launcherTarget) return false;
	const relative = path.relative(pkgReal, launcherTarget);
	return relative !== "" && relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}
async function detectGlobalInstallManagerForRoot(runCommand, pkgRoot, timeoutMs, diagnostics = []) {
	const pkgReal = await tryRealpath(pkgRoot);
	diagnostics.push(`package root: ${pkgRoot} (resolved: ${pkgReal})`);
	if (resolveBunGlobalInstallOwner(pkgRoot) ?? resolveBunGlobalInstallOwner(pkgReal)) return await isPnpmGlobalPackageRoot(pkgRoot) ? "pnpm" : "bun";
	for (const manager of ["npm", "pnpm"]) {
		const globalRoot = await resolveGlobalRoot({
			manager,
			command: manager
		}, runCommand, timeoutMs);
		diagnostics.push(`${manager} root -g: ${globalRoot || "unavailable"}`);
		if (!globalRoot) continue;
		const globalReal = await tryRealpath(globalRoot);
		if (manager === "pnpm" && await resolvePnpmIsolatedGlobalPackage({
			globalRoot,
			pkgRoot
		})) return "pnpm";
		const expectedReal = await tryRealpath(path.join(globalReal, PRIMARY_PACKAGE_NAME));
		if (path.resolve(expectedReal) === path.resolve(pkgReal)) return manager;
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
		const root = await resolveGlobalRoot({
			manager,
			command: manager
		}, runCommand, timeoutMs);
		if (!root) continue;
		if (await pathExists$1(path.join(root, PRIMARY_PACKAGE_NAME))) return manager;
	}
	const bunRoot = resolveBunGlobalRoot();
	if (await pathExists$1(path.join(bunRoot, PRIMARY_PACKAGE_NAME))) return "bun";
	return null;
}
/**
* Builds the primary package-manager argv for a global OpenClaw install.
* npm receives quiet/freshness-bypass flags; pnpm and Bun approve OpenClaw's lifecycle.
*/
function globalInstallArgs(managerOrCommand, spec, pkgRoot, installPrefix, installCwd, npmLifecyclePolicy = "allow-scripts") {
	const resolved = normalizeGlobalInstallCommand(managerOrCommand, pkgRoot);
	if (resolved.manager !== "npm") return [
		resolved.command,
		"add",
		"-g",
		resolved.manager === "pnpm" ? PNPM_OPENCLAW_BUILD_ALLOWLIST_FLAG : BUN_OPENCLAW_TRUST_FLAG,
		resolved.manager === "pnpm" ? spec : resolveBunGlobalInstallSpec(spec)
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
async function cleanupGlobalRenameDirs(params) {
	const removed = [];
	const root = params.globalRoot.trim();
	const name = params.packageName.trim();
	if (!root || !name) return { removed };
	const prefix = `.${name}-`;
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
			const stat = await fs$1.lstat(target, { bigint: true });
			if (!stat.isDirectory()) continue;
			const remainingMs = inspectionDeadline - Date.now();
			if (remainingMs <= 0) break;
			await createSystemPackageOwnershipInspection(remainingMs).assertUnowned(target);
			if (Date.now() >= inspectionDeadline) break;
			const current = await fs$1.lstat(target, { bigint: true });
			if (!current.isDirectory() || !sameFileIdentity(stat, current)) continue;
			await fs$1.rm(target, {
				recursive: true,
				force: true
			});
			removed.push(entry);
		} catch {}
	}
	return { removed };
}
//#endregion
export { PKG_INSPECTION_TIMEOUT_MS as _, detectGlobalInstallManagerForRoot as a, UpdatePreMutationError as b, listActivePnpmIsolatedGlobalPackages as c, resolveGlobalInstallTarget as d, resolveNpmLifecyclePolicyGate as f, createGlobalInstallEnv as g, verifyPackageUpdateRecovery as h, detectGlobalInstallManagerByPresence as i, resolveExpectedInstalledVersionFromSpec as l, resolvePnpmIsolatedInstallOwner as m, cleanupGlobalRenameDirs as n, globalInstallArgs as o, resolvePnpmGlobalInstallOwner as p, collectInstalledGlobalPackageErrors as r, isPackageTargetAlreadyCurrent as s, canResolveRegistryVersionForPackageTarget as t, resolveGlobalInstallSpec as u, SystemPackageOwnershipError as v, createSystemPackageOwnershipInspection as y };
