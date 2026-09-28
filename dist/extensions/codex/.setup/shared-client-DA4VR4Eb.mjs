import { t as __exportAll } from "./rolldown-runtime-8H4AJuhK.mjs";
import { n as defineCodexBuildState, t as codexBuildSymbol } from "./build-state-C7EnDVgr.mjs";
import { t as CODEX_APP_SERVER_AUTH_PROVIDER } from "./auth-profile-selection-DFu9e167.mjs";
import { d as resolveCodexAppServerHomeDir, f as resolveCodexAppServerLocalHomeDir, h as withEphemeralCodexAuthStore, m as withClearedEnvironmentVariables, p as resolveCodexAppServerUserHomeDir } from "./config-security-BEReZ6go.mjs";
import { n as isCodexAppServerProxyLaunch } from "./launch-args-DbFCehO7.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { a as resolveCodexAppServerStartOptionsForAgent, d as readCodexEffectiveConfig, o as resolveCodexComputerUseConfig, t as codexAppServerStartOptionsKey, u as CODEX_SESSION_OVERRIDABLE_LAYER_TYPES } from "./config-options-BvaRs51b.mjs";
import { d as resolveMacOSDesktopCodexBundledMarketplaceCandidates, f as resolveMacOSDesktopCodexComputerUseServiceAppCandidates, i as resolveManagedCodexNativeCommand, l as resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath, r as resolveManagedCodexAppServerStartOptions, t as isManagedCodexDesktopCommand, u as resolveMacOSDesktopCodexAppPathCandidates } from "./managed-binary-BnshlFag.mjs";
import { a as readCodexCliAuthFileApiKey, c as resolveCodexAppServerPreparedApiKeyCacheKey, d as waitForCodexDesktopGeneration, i as fingerprintTokenAuthProfileCacheKey, n as CODEX_AUTH_JSON_FILENAME, o as readFirstNonEmptyEnv, r as fingerprintApiKeyAuthProfileCacheKey, s as resolveCodexAppServerFallbackApiKeyCacheKey, t as CODEX_APP_SERVER_API_KEY_ENV_VARS, u as isCodexDesktopGenerationCurrent } from "./auth-cache-key-B2mpaI9D.mjs";
import { d as createCodexAppServerStartupLifetime, f as getCurrentSharedClientEntry, h as retireSharedCodexAppServerClientIfCurrent, l as closeRetiredSharedClientEntry, n as observeCodexCatalogClient, o as readCodexSessionMeta, p as getSharedCodexAppServerClientState, u as closeRetiredSharedClientEntryIfIdle } from "./session-catalog-events-Bj6j94E_.mjs";
import { n as resolveCodexAppServerSpawnEnv } from "./transport-stdio-h2VHOskC.mjs";
import { n as CodexAppServerAuthProfileUnavailableError, r as formatCodexAuthProfileUnavailableMessage } from "./auth-profile-recovery-BREezV0L.mjs";
import { i as withTimeout } from "./timeout-C910MdAB.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-C8Rw1m1m.mjs";
import { a as resolveCodexAppServerAuthProfileStore, i as resolveCodexAppServerAuthProfileIdForAgent, r as resolveCodexAppServerAuthProfileId, t as isCodexAppServerNativeAuthProfile } from "./auth-profile-WqZtZfXN.mjs";
import { f as isUnsupportedCodexAppServerVersionError, t as CodexAppServerClient } from "./client-Cs08OXVQ.mjs";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { AgentHarnessPreflightError, resolveDefaultAgentDir } from "openclaw/plugin-sdk/agent-harness-registration";
import { addTimerTimeoutGraceMs, resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { runExec } from "openclaw/plugin-sdk/process-runtime";
import fs, { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { ensureAuthProfileStore, findPersistedAuthProfileCredential, refreshOAuthCredentialForRuntime, resolveApiKeyForProfile, resolvePersistedAuthProfileOwnerAgentDir } from "openclaw/plugin-sdk/agent-runtime";
import { AgentHarnessPreflightError as AgentHarnessPreflightError$1, embeddedAgentLog as embeddedAgentLog$1, formatErrorMessage } from "openclaw/plugin-sdk/agent-harness-runtime";
import { hasUsableOAuthCredential, resolveOpenAICodexAuthIdentity } from "openclaw/plugin-sdk/provider-auth";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { assertNoSymlinkParents } from "openclaw/plugin-sdk/security-runtime";
//#region extensions/codex/src/app-server/attempt-timeouts.ts
/**
* Timeout defaults and normalizers for Codex app-server startup and turn
* liveness watches.
*/
/** Minimum startup timeout accepted by the Codex app-server harness. */
const CODEX_APP_SERVER_STARTUP_TIMEOUT_FLOOR_MS = 100;
const TURN_TERMINAL_SETTLEMENT_TIMEOUT_MS = 12e4;
const TURN_FINALIZE_DRAIN_ABORT_GRACE_MS = 5e3;
var CodexAppServerStartupError = class extends Error {
	constructor(reason, message = reason === "timed_out" ? "codex app-server startup timed out" : "codex app-server startup aborted") {
		super(message);
		this.reason = reason;
		this.code = "CODEX_APP_SERVER_STARTUP_CANCELLED";
		this.name = "CodexAppServerStartupError";
	}
};
function isCodexAppServerStartupError(error, reason) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_STARTUP_CANCELLED" && "reason" in error && (error.reason === "aborted" || error.reason === "timed_out") && (reason === void 0 || error.reason === reason);
}
function resolvePositiveIntegerTimeoutMs(value, fallbackMs) {
	const fallback = resolveTimerTimeoutMs(fallbackMs, 1);
	return resolveTimerTimeoutMs(value, fallback);
}
/** Runs startup work with abort and timeout handling plus optional cleanup. */
async function withCodexStartupTimeout(params) {
	if (params.signal.aborted) throw new CodexAppServerStartupError("aborted");
	let timeout;
	let abortCleanup;
	let timeoutError;
	let timeoutCleanup;
	try {
		return await Promise.race([params.operation(), new Promise((_, reject) => {
			const rejectOnce = (error) => {
				if (timeout) {
					clearTimeout(timeout);
					timeout = void 0;
				}
				reject(error);
			};
			timeout = setTimeout(() => {
				timeoutError = new CodexAppServerStartupError("timed_out");
				timeoutCleanup = Promise.resolve(params.onTimeout?.()).then(() => void 0, () => void 0);
				timeoutCleanup.finally(() => {
					rejectOnce(timeoutError);
				});
			}, params.timeoutMs);
			const abortListener = () => rejectOnce(new CodexAppServerStartupError("aborted"));
			params.signal.addEventListener("abort", abortListener, { once: true });
			abortCleanup = () => params.signal.removeEventListener("abort", abortListener);
		})]);
	} catch (error) {
		if (timeoutError) {
			await timeoutCleanup;
			throw timeoutError;
		}
		throw error;
	} finally {
		if (timeout) clearTimeout(timeout);
		abortCleanup?.();
	}
}
/** Resolves startup timeout while honoring the configured floor. */
function resolveCodexStartupTimeoutMs(params) {
	const timeoutFloorMs = resolvePositiveIntegerTimeoutMs(params.timeoutFloorMs, CODEX_APP_SERVER_STARTUP_TIMEOUT_FLOOR_MS);
	const timeoutMs = resolvePositiveIntegerTimeoutMs(params.timeoutMs, timeoutFloorMs);
	return Math.max(timeoutFloorMs, timeoutMs);
}
/** Adds gateway grace time to a caller timeout without overflowing invalid values. */
function resolveCodexGatewayTimeoutWithGraceMs(timeoutMs, graceMs = 1e4) {
	const timeout = resolvePositiveIntegerTimeoutMs(timeoutMs, 1);
	const grace = resolveTimerTimeoutMs(graceMs, 0, 0);
	return addTimerTimeoutGraceMs(timeout, grace) ?? timeout;
}
//#endregion
//#region extensions/codex/src/app-server/computer-use-service-path.ts
/** Filesystem ownership guards for isolated Computer Use service provisioning. */
async function assertOwnedServicePath(params) {
	await assertOwnedCodexHomePath({
		ownershipRoot: params.ownershipRoot,
		codexHome: params.codexHome,
		allowMissing: true
	});
	assertPathAtOrInside(params.ownershipRoot, params.targetParent, "Computer Use service parent");
	await assertNoSymlinkParents({
		rootDir: params.ownershipRoot,
		targetPath: params.targetParent,
		allowMissing: true,
		requireDirectories: true,
		messagePrefix: "Computer Use service path"
	});
	await assertNotSymlink(params.targetPath, "Computer Use service target");
}
async function ensureOwnedCodexHome(codexHomeInput, ownershipRootInput = path.dirname(path.resolve(codexHomeInput))) {
	const codexHome = path.resolve(codexHomeInput);
	const ownershipRoot = path.resolve(ownershipRootInput);
	await fs$1.mkdir(ownershipRoot, {
		recursive: true,
		mode: 448
	});
	await assertOwnedCodexHomePath({
		ownershipRoot,
		codexHome,
		allowMissing: true
	});
	await ensureRealDirectoryTree(ownershipRoot, codexHome, "isolated Codex home");
	await assertOwnedCodexHomePath({
		ownershipRoot,
		codexHome,
		allowMissing: false
	});
}
async function prepareOwnedServiceParent(params) {
	await ensureOwnedCodexHome(params.codexHome, params.ownershipRoot);
	await ensureRealDirectoryTree(params.ownershipRoot, params.targetParent, "Computer Use service parent");
	await assertNoSymlinkParents({
		rootDir: params.ownershipRoot,
		targetPath: params.targetParent,
		allowMissing: false,
		requireDirectories: true,
		messagePrefix: "Computer Use service path"
	});
	const [rootIdentity, parentIdentity] = await Promise.all([readRealDirectoryIdentity(params.ownershipRoot, "Computer Use ownership root"), readRealDirectoryIdentity(params.targetParent, "Computer Use service parent")]);
	assertPathAtOrInside(rootIdentity.realPath, parentIdentity.realPath, "canonical Computer Use service parent");
	return parentIdentity;
}
async function assertOwnedCodexHomePath(params) {
	await readRealDirectoryIdentity(params.ownershipRoot, "Computer Use ownership root");
	assertPathAtOrInside(params.ownershipRoot, params.codexHome, "isolated Codex home");
	await assertNoSymlinkParents({
		rootDir: params.ownershipRoot,
		targetPath: params.codexHome,
		allowMissing: params.allowMissing,
		requireDirectories: true,
		messagePrefix: "Computer Use service path"
	});
}
async function readRealDirectoryIdentity(directoryPath, label) {
	const logicalPath = path.resolve(directoryPath);
	const before = await fs$1.lstat(logicalPath);
	if (before.isSymbolicLink() || !before.isDirectory()) throw new Error(`${label} must be a real directory: ${logicalPath}`);
	const realPath = await fs$1.realpath(logicalPath);
	const [after, resolved] = await Promise.all([fs$1.lstat(logicalPath), fs$1.lstat(realPath)]);
	if (after.isSymbolicLink() || !after.isDirectory() || !resolved.isDirectory() || before.dev !== after.dev || before.ino !== after.ino || after.dev !== resolved.dev || after.ino !== resolved.ino) throw new Error(`${label} changed while its ownership boundary was being established.`);
	return {
		logicalPath,
		realPath,
		dev: after.dev,
		ino: after.ino
	};
}
async function assertOwnedServiceParentStable(parent) {
	await assertDirectoryIdentityStable(parent, "Computer Use service parent");
}
async function assertDirectoryIdentityStable(expected, label) {
	if (!await directoryIdentityIsStable(expected)) throw new Error(`${label} changed during refresh; refusing to mutate the replacement path.`);
}
async function ownedServiceParentIsStable(parent) {
	return await directoryIdentityIsStable(parent);
}
async function directoryIdentityIsStable(expected) {
	try {
		const current = await fs$1.lstat(expected.logicalPath);
		if (current.isSymbolicLink() || !current.isDirectory() || current.dev !== expected.dev || current.ino !== expected.ino) return false;
		return await fs$1.realpath(expected.logicalPath) === expected.realPath;
	} catch {
		return false;
	}
}
async function assertNotSymlink(filePath, label) {
	try {
		if ((await fs$1.lstat(filePath)).isSymbolicLink()) throw new Error(`${label} must not be a symbolic link: ${filePath}`);
	} catch (error) {
		if (hasNodeErrorCode$1(error, "ENOENT")) return;
		throw error;
	}
}
async function ensureRealDirectoryTree(ownershipRoot, directoryPath, label) {
	const root = path.resolve(ownershipRoot);
	const target = path.resolve(directoryPath);
	assertPathAtOrInside(root, target, label);
	const relative = path.relative(root, target);
	let current = root;
	for (const segment of relative.split(path.sep).filter(Boolean)) {
		current = path.join(current, segment);
		const existing = await fs$1.lstat(current).catch((error) => {
			if (hasNodeErrorCode$1(error, "ENOENT")) return;
			throw error;
		});
		if (!existing) {
			try {
				await fs$1.mkdir(current, { mode: 448 });
			} catch (error) {
				if (!hasNodeErrorCode$1(error, "EEXIST")) throw error;
			}
			const created = await fs$1.lstat(current);
			if (created.isSymbolicLink() || !created.isDirectory()) throw new Error(`${label} changed while its directory tree was being created: ${current}`);
		} else if (existing.isSymbolicLink() || !existing.isDirectory()) throw new Error(`${label} must traverse real directories: ${current}`);
	}
	await assertNoSymlinkParents({
		rootDir: root,
		targetPath: target,
		allowMissing: false,
		requireDirectories: true,
		messagePrefix: "Computer Use service path"
	});
	await readRealDirectoryIdentity(target, label);
}
function assertPathAtOrInside(rootPath, candidatePath, label) {
	const relative = path.relative(path.resolve(rootPath), path.resolve(candidatePath));
	if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new Error(`${label} must remain inside ${path.resolve(rootPath)}.`);
}
function hasNodeErrorCode$1(error, code) {
	return Boolean(error && typeof error === "object" && "code" in error && error.code === code);
}
//#endregion
//#region extensions/codex/src/app-server/computer-use-cache.ts
/** Shared Computer Use plugin cache reconciliation for isolated Codex homes. */
const DEFAULT_CODEX_COMPUTER_USE_BUNDLED_MARKETPLACE_PATH = resolveMacOSDesktopCodexBundledMarketplaceCandidates("darwin")[0] ?? "";
const DEFAULT_BUNDLED_MARKETPLACE_NAME = "openai-bundled";
async function ensureCodexComputerUseSharedPluginCache(params) {
	if (!params.config.enabled) return skippedCacheResult("disabled", "Computer Use cache sharing skipped because it is disabled.");
	if (params.config.pluginCacheMode === "independent") return skippedCacheResult("independent", "Computer Use cache sharing skipped because pluginCacheMode is independent.");
	if (params.config.marketplaceName || params.config.marketplacePath) return skippedCacheResult("explicit_marketplace", "Computer Use cache sharing skipped because an explicit marketplace is configured.");
	const bundledMarketplacePath = resolveComputerUseBundledMarketplacePath(params);
	const sourcePluginRoot = path.join(bundledMarketplacePath, "plugins", params.config.pluginName);
	const version = await readBundledPluginVersion(sourcePluginRoot);
	if (!version) return skippedCacheResult("source_missing", `Computer Use bundled plugin source was not found at ${sourcePluginRoot}.`);
	const marketplaceName = params.config.marketplaceName ?? DEFAULT_BUNDLED_MARKETPLACE_NAME;
	const cacheRoot = path.join(params.codexHome, "plugins", "cache", marketplaceName, params.config.pluginName);
	const cachePath = path.join(cacheRoot, version);
	return {
		status: "shared",
		changed: await ensureRealDirectoryCopy(cachePath, sourcePluginRoot, version, {
			codexHome: params.codexHome,
			ownershipRoot: params.ownershipRoot,
			assertCurrent: params.assertCurrent,
			forceRefresh: params.forceRefresh
		}),
		cachePath,
		targetPath: sourcePluginRoot,
		version,
		removedStaleVersions: [],
		warnings: [],
		message: `Computer Use plugin cache ${cachePath} contains bundled plugin ${sourcePluginRoot}.`
	};
}
function resolveComputerUseBundledMarketplacePath(params) {
	return params.bundledMarketplacePath ?? resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath({ candidates: params.bundledMarketplacePathCandidates }) ?? params.bundledMarketplacePathCandidates?.[0] ?? DEFAULT_CODEX_COMPUTER_USE_BUNDLED_MARKETPLACE_PATH;
}
async function readBundledPluginVersion(sourcePluginRoot) {
	const pluginJsonPath = path.join(sourcePluginRoot, ".codex-plugin", "plugin.json");
	let raw;
	try {
		raw = await fs$1.readFile(pluginJsonPath, "utf8");
	} catch {
		return;
	}
	try {
		const parsed = JSON.parse(raw);
		return typeof parsed.version === "string" && parsed.version.trim() ? parsed.version.trim() : void 0;
	} catch {
		return;
	}
}
async function ensureRealDirectoryCopy(cachePath, sourcePluginRoot, version, boundary) {
	const cacheRoot = path.dirname(cachePath);
	const ownedParent = boundary.ownershipRoot ? await prepareOwnedServiceParent({
		ownershipRoot: boundary.ownershipRoot,
		codexHome: boundary.codexHome,
		targetParent: cacheRoot
	}) : void 0;
	if (!ownedParent) await fs$1.mkdir(cacheRoot, { recursive: true });
	const physicalCachePath = ownedParent ? path.join(ownedParent.realPath, path.basename(cachePath)) : cachePath;
	const stat = await fs$1.lstat(physicalCachePath).catch(() => void 0);
	if (stat?.isDirectory() && !stat.isSymbolicLink()) {
		if (await readBundledPluginVersion(physicalCachePath) === version && !boundary.forceRefresh) return false;
	}
	const cacheName = path.basename(cachePath);
	const physicalCacheRoot = path.dirname(physicalCachePath);
	const stagingRoot = await fs$1.mkdtemp(path.join(physicalCacheRoot, `.${cacheName}.staging-`));
	const stagedPath = path.join(stagingRoot, cacheName);
	const backupPath = path.join(physicalCacheRoot, `.${cacheName}.backup-${process.pid}-${Date.now()}`);
	let backupCreated = false;
	try {
		await fs$1.cp(sourcePluginRoot, stagedPath, { recursive: true });
		await waitForCodexDesktopGeneration();
		if (ownedParent) await assertDirectoryIdentityStable(ownedParent, "Computer Use plugin cache parent");
		if (stat) {
			boundary.assertCurrent?.();
			await fs$1.rename(physicalCachePath, backupPath);
			backupCreated = true;
		}
		try {
			if (ownedParent) await assertDirectoryIdentityStable(ownedParent, "Computer Use plugin cache parent");
			boundary.assertCurrent?.();
			await fs$1.rename(stagedPath, physicalCachePath);
		} catch (error) {
			if (backupCreated) try {
				if (ownedParent) await assertDirectoryIdentityStable(ownedParent, "Computer Use plugin cache parent");
				await fs$1.rename(backupPath, physicalCachePath);
				backupCreated = false;
			} catch (restoreError) {
				throw new Error(`Failed to install Computer Use cache ${cachePath} and restore its prior copy: ${String(error)}`, { cause: restoreError });
			}
			throw error;
		}
		if (backupCreated) {
			if (ownedParent) await assertDirectoryIdentityStable(ownedParent, "Computer Use plugin cache parent");
			await fs$1.rm(backupPath, {
				recursive: true,
				force: true
			});
		}
		return true;
	} finally {
		if (!ownedParent || await directoryIdentityIsStable(ownedParent)) await fs$1.rm(stagingRoot, {
			recursive: true,
			force: true
		});
	}
}
function skippedCacheResult(status, message) {
	return {
		status,
		changed: false,
		message,
		removedStaleVersions: [],
		warnings: status === "source_missing" ? [message] : []
	};
}
//#endregion
//#region extensions/codex/src/app-server/computer-use-marketplace.ts
/** Managed local wrapper for Codex's reserved bundled marketplace. */
const MARKETPLACE_NAME = "openai-bundled";
const activeInstalls$1 = /* @__PURE__ */ new Map();
function resolveCodexManagedBundledMarketplacePath(codexHome) {
	return path.join(codexHome, ".tmp", "bundled-marketplaces", MARKETPLACE_NAME);
}
async function ensureCodexManagedBundledMarketplace(params) {
	const candidates = params.candidates ?? resolveMacOSDesktopCodexAppPathCandidates();
	const source = await resolveCodexManagedBundledMarketplaceSource({
		...params,
		candidates
	});
	if (!source) return;
	const parentPath = path.dirname(resolveCodexManagedBundledMarketplacePath(params.codexHome));
	const targetPath = path.join(parentPath, MARKETPLACE_NAME);
	const parent = await prepareOwnedServiceParent({
		ownershipRoot: params.ownershipRoot,
		codexHome: params.codexHome,
		targetParent: parentPath
	});
	const physicalTargetPath = path.join(parent.realPath, MARKETPLACE_NAME);
	await assertNotSymlink(physicalTargetPath, "managed bundled marketplace");
	const active = activeInstalls$1.get(physicalTargetPath);
	if (active) {
		if (active.sourcePath === source.bundledMarketplacePath) return await active.promise;
		await active.promise.catch(() => void 0);
		return await ensureCodexManagedBundledMarketplace(params);
	}
	const install = reconcileManagedWrapper({
		parent,
		physicalTargetPath,
		targetPath,
		source,
		ownershipCandidates: params.ownershipCandidates ?? candidates,
		assertCurrent: params.assertCurrent
	});
	const activeEntry = {
		sourcePath: source.bundledMarketplacePath,
		promise: install
	};
	activeInstalls$1.set(physicalTargetPath, activeEntry);
	const clearActive = () => {
		if (activeInstalls$1.get(physicalTargetPath) === activeEntry) activeInstalls$1.delete(physicalTargetPath);
	};
	install.then(clearActive, clearActive);
	return await install;
}
async function reconcileManagedWrapper(params) {
	if (await wrapperMatches(params.physicalTargetPath, params.source.bundledMarketplacePath)) return params.targetPath;
	return await publishManagedWrapper(params);
}
async function publishManagedWrapper(params) {
	const { parent, physicalTargetPath, targetPath, source, ownershipCandidates, assertCurrent } = params;
	const stagingPath = await fs$1.mkdtemp(path.join(parent.realPath, `.${MARKETPLACE_NAME}.staging-`));
	const backupPath = path.join(parent.realPath, `.${MARKETPLACE_NAME}.backup-${process.pid}-${Date.now()}`);
	let backupCreated = false;
	try {
		const manifestParent = path.join(stagingPath, ".agents", "plugins");
		await fs$1.mkdir(manifestParent, {
			recursive: true,
			mode: 448
		});
		await Promise.all([fs$1.symlink(path.join(source.bundledMarketplacePath, ".agents", "plugins", "marketplace.json"), path.join(manifestParent, "marketplace.json")), fs$1.symlink(path.join(source.bundledMarketplacePath, "plugins"), path.join(stagingPath, "plugins"))]);
		await assertDirectoryIdentityStable(parent, "managed bundled marketplace parent");
		const existing = await fs$1.lstat(physicalTargetPath).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT")) return;
			throw error;
		});
		if (existing && !existing.isDirectory()) throw new Error(`Managed bundled marketplace must be a real directory: ${targetPath}`);
		if (existing && !await wrapperMatchesAnySource(physicalTargetPath, ownershipCandidates)) throw new Error(`Refusing to replace an unowned bundled marketplace directory: ${targetPath}`);
		if (existing) {
			assertCurrent?.();
			await fs$1.rename(physicalTargetPath, backupPath);
			backupCreated = true;
			await assertDirectoryIdentityStable(parent, "managed bundled marketplace parent");
		}
		assertCurrent?.();
		await fs$1.rename(stagingPath, physicalTargetPath);
		await assertDirectoryIdentityStable(parent, "managed bundled marketplace parent");
		if (backupCreated) {
			await fs$1.rm(backupPath, { recursive: true });
			backupCreated = false;
		}
		return targetPath;
	} catch (error) {
		if (backupCreated) try {
			await assertDirectoryIdentityStable(parent, "managed bundled marketplace parent");
			if (await fs$1.lstat(physicalTargetPath).catch(() => void 0)) {
				if (!await wrapperMatches(physicalTargetPath, source.bundledMarketplacePath)) throw new Error("managed bundled marketplace replacement is no longer owned", { cause: error });
				await fs$1.rm(physicalTargetPath, { recursive: true });
			}
			await fs$1.rename(backupPath, physicalTargetPath);
			backupCreated = false;
		} catch (restoreError) {
			throw new Error(`Failed to restore the prior managed bundled marketplace: ${String(error)}`, { cause: restoreError });
		}
		throw error;
	} finally {
		if (await directoryIdentityIsStable(parent)) await fs$1.rm(stagingPath, {
			recursive: true,
			force: true
		});
	}
}
async function resolveCodexManagedBundledMarketplaceSource(params) {
	const candidates = params.candidates ?? resolveMacOSDesktopCodexAppPathCandidates();
	const command = params.appServerCommand && path.resolve(params.appServerCommand);
	const ordered = command ? candidates.filter((candidate) => path.resolve(candidate.appServerCommandPath) === command) : candidates;
	for (const candidate of ordered) if (await isExpectedMarketplace(candidate.bundledMarketplacePath)) return candidate;
}
async function isExpectedMarketplace(root) {
	try {
		const manifest = JSON.parse(await fs$1.readFile(path.join(root, ".agents", "plugins", "marketplace.json"), "utf8"));
		await fs$1.access(path.join(root, "plugins", "computer-use", ".codex-plugin", "plugin.json"));
		return isRecord(manifest) && manifest.name === MARKETPLACE_NAME && Array.isArray(manifest.plugins) && manifest.plugins.some((plugin) => isRecord(plugin) && plugin.name === "computer-use");
	} catch {
		return false;
	}
}
async function wrapperMatches(targetPath, sourcePath) {
	try {
		const target = await fs$1.lstat(targetPath);
		if (!target.isDirectory() || target.isSymbolicLink()) return false;
		const [manifest, plugins] = await Promise.all([fs$1.readlink(path.join(targetPath, ".agents", "plugins", "marketplace.json")), fs$1.readlink(path.join(targetPath, "plugins"))]);
		return manifest === path.join(sourcePath, ".agents", "plugins", "marketplace.json") && plugins === path.join(sourcePath, "plugins");
	} catch {
		return false;
	}
}
async function wrapperMatchesAnySource(targetPath, candidates) {
	for (const candidate of candidates) if (await wrapperMatches(targetPath, candidate.bundledMarketplacePath)) return true;
	return false;
}
function hasNodeErrorCode(error, code) {
	return Boolean(error && typeof error === "object" && "code" in error && error.code === code);
}
//#endregion
//#region extensions/codex/src/app-server/computer-use-service.ts
/** Native Computer Use service provisioning for isolated Codex homes. */
const SERVICE_APP_NAME = "Codex Computer Use.app";
const SERVICE_BUNDLE_ID = "com.openai.sky.CUAService";
const CLIENT_BUNDLE_ID = "com.openai.sky.CUAService.cli";
const OPENAI_TEAM_ID = "2DC432GLL2";
const CLIENT_APP_RELATIVE_PATH = path.join("Contents", "SharedSupport", "SkyComputerUseClient.app");
const CLIENT_RELATIVE_PATH = path.join(CLIENT_APP_RELATIVE_PATH, "Contents", "MacOS", "SkyComputerUseClient");
const COPY_TIMEOUT_MS = 12e4;
const INSPECT_TIMEOUT_MS = 3e4;
const activeInstalls = /* @__PURE__ */ new Map();
/** Finds the first signed native service from one ordered desktop owner set. */
async function resolveCodexComputerUseServiceAppSourcePath(params) {
	const platform = params.platform ?? process.platform;
	if (platform !== "darwin") return;
	return (await findUsableServiceApp(params.sourceAppCandidates ?? resolveMacOSDesktopCodexComputerUseServiceAppCandidates(platform, params.appServerCommand), params.inspectServiceApp ?? inspectTrustedServiceApp))?.path;
}
/** Synchronizes the CODEX_HOME native client with the selected signed desktop distribution. */
async function ensureCodexComputerUseServiceApp(params) {
	const platform = params.platform ?? process.platform;
	if (platform !== "darwin") return {
		status: "unsupported",
		changed: false
	};
	const codexHome = path.resolve(params.codexHome);
	const ownershipRoot = path.resolve(params.ownershipRoot ?? path.dirname(codexHome));
	const targetParent = path.join(codexHome, "computer-use");
	const targetPath = path.join(targetParent, SERVICE_APP_NAME);
	await ensureOwnedCodexHome(codexHome, ownershipRoot);
	await assertOwnedServicePath({
		ownershipRoot,
		codexHome,
		targetParent,
		targetPath
	});
	const candidates = params.sourceAppCandidates ?? resolveMacOSDesktopCodexComputerUseServiceAppCandidates(platform, params.appServerCommand);
	const syncKey = [targetPath, ...candidates].join("\0");
	const active = activeInstalls.get(targetPath);
	if (active) {
		if (active.syncKey === syncKey) return await active.promise;
		await active.promise.catch(() => void 0);
		return await ensureCodexComputerUseServiceApp(params);
	}
	const install = ensureCodexComputerUseServiceAppOnce({
		...params,
		codexHome,
		ownershipRoot,
		targetParent,
		targetPath,
		platform,
		sourceAppCandidates: candidates
	});
	const activeEntry = {
		syncKey,
		promise: install
	};
	activeInstalls.set(targetPath, activeEntry);
	const clearActive = () => {
		if (activeInstalls.get(targetPath) === activeEntry) activeInstalls.delete(targetPath);
	};
	install.then(clearActive, clearActive);
	return await install;
}
async function ensureCodexComputerUseServiceAppOnce(params) {
	const inspectServiceApp = params.inspectServiceApp ?? inspectTrustedServiceApp;
	const source = await findUsableServiceApp(params.sourceAppCandidates ?? [], inspectServiceApp);
	if (!source) return {
		status: "source_missing",
		changed: false,
		targetPath: params.targetPath
	};
	const { path: sourcePath, identity: sourceIdentity } = source;
	const ownedParent = await prepareOwnedServiceParent({
		ownershipRoot: params.ownershipRoot,
		codexHome: params.codexHome,
		targetParent: params.targetParent
	});
	const operationTargetPath = path.join(ownedParent.realPath, SERVICE_APP_NAME);
	await assertNotSymlink(operationTargetPath, "Computer Use service target");
	const initialTarget = await readServiceAppSnapshot(operationTargetPath, inspectServiceApp);
	if (initialTarget.identity && identitiesMatch(initialTarget.identity, sourceIdentity)) return {
		status: "already_current",
		changed: false,
		targetPath: params.targetPath,
		sourcePath,
		sourceBuild: sourceIdentity.build
	};
	await assertOwnedServiceParentStable(ownedParent);
	const stagingRoot = await fs$1.mkdtemp(path.join(ownedParent.realPath, ".service-app.staging-"));
	const stagingRootIdentity = await readRealDirectoryIdentity(stagingRoot, "Computer Use service staging directory");
	const stagedPath = path.join(stagingRoot, SERVICE_APP_NAME);
	const backupPath = path.join(ownedParent.realPath, `.service-app.backup-${process.pid}-${Date.now()}`);
	let backupCreated = false;
	try {
		await (params.copyServiceApp ?? copyServiceAppWithDitto)(sourcePath, stagedPath);
		await assertOwnedServiceParentStable(ownedParent);
		await assertDirectoryIdentityStable(stagingRootIdentity, "Computer Use service staging directory");
		await assertNotSymlink(stagedPath, "Copied Computer Use service app");
		const stagedIdentity = await inspectServiceApp(stagedPath);
		if (!stagedIdentity || !identitiesMatch(stagedIdentity, sourceIdentity)) throw new Error(`Copied Computer Use service app at ${stagedPath} does not match its selected signed source.`);
		const stagedSnapshot = await readServiceAppSnapshot(stagedPath, inspectServiceApp);
		const currentSourceIdentity = await inspectServiceApp(sourcePath);
		await waitForCodexDesktopGeneration();
		await assertOwnedServiceParentStable(ownedParent);
		await assertDirectoryIdentityStable(stagingRootIdentity, "Computer Use service staging directory");
		if (!currentSourceIdentity || !identitiesMatch(currentSourceIdentity, sourceIdentity)) throw new Error("Selected Computer Use service source changed during refresh.");
		await assertNotSymlink(operationTargetPath, "Computer Use service target");
		if (await pathExists$1(operationTargetPath)) {
			await assertOwnedServiceParentStable(ownedParent);
			params.assertCurrent?.();
			await fs$1.rename(operationTargetPath, backupPath);
			await assertOwnedServiceParentStable(ownedParent);
			backupCreated = true;
			const movedTarget = await readServiceAppSnapshot(backupPath, inspectServiceApp);
			if (movedTarget.identity && identitiesMatch(movedTarget.identity, sourceIdentity)) {
				await assertOwnedServiceParentStable(ownedParent);
				await fs$1.rename(backupPath, operationTargetPath);
				await assertOwnedServiceParentStable(ownedParent);
				backupCreated = false;
				return {
					status: "already_current",
					changed: false,
					targetPath: params.targetPath,
					sourcePath,
					sourceBuild: sourceIdentity.build
				};
			}
			if (!snapshotsMatch(initialTarget, movedTarget)) {
				await assertOwnedServiceParentStable(ownedParent);
				await fs$1.rename(backupPath, operationTargetPath);
				await assertOwnedServiceParentStable(ownedParent);
				backupCreated = false;
				throw new Error("Computer Use service target changed to an unexpected generation during refresh.");
			}
		}
		try {
			await assertOwnedServiceParentStable(ownedParent);
			params.assertCurrent?.();
			await fs$1.rename(stagedPath, operationTargetPath);
			await assertOwnedServiceParentStable(ownedParent);
		} catch (error) {
			await assertOwnedServiceParentStable(ownedParent);
			await assertNotSymlink(operationTargetPath, "Computer Use service target");
			const winnerIdentity = await inspectServiceApp(operationTargetPath);
			if (!winnerIdentity || !identitiesMatch(winnerIdentity, sourceIdentity)) {
				if (backupCreated) {
					if (!await pathExists$1(operationTargetPath)) {
						await assertOwnedServiceParentStable(ownedParent);
						await fs$1.rename(backupPath, operationTargetPath);
						await assertOwnedServiceParentStable(ownedParent);
						backupCreated = false;
					}
				}
				throw error;
			}
			if (backupCreated) {
				await assertOwnedServiceParentStable(ownedParent);
				await assertNotSymlink(backupPath, "Computer Use service backup");
				await fs$1.rm(backupPath, {
					recursive: true,
					force: true
				});
				await assertOwnedServiceParentStable(ownedParent);
				backupCreated = false;
			}
			return {
				status: "already_current",
				changed: false,
				targetPath: params.targetPath,
				sourcePath,
				sourceBuild: sourceIdentity.build
			};
		}
		await assertNotSymlink(operationTargetPath, "Installed Computer Use service app");
		const installedSnapshot = await readServiceAppSnapshot(operationTargetPath, inspectServiceApp);
		if (!installedSnapshot.identity || !identitiesMatch(installedSnapshot.identity, sourceIdentity)) {
			if (filesystemSnapshotsMatch(installedSnapshot, stagedSnapshot)) {
				await assertOwnedServiceParentStable(ownedParent);
				await fs$1.rm(operationTargetPath, {
					recursive: true,
					force: true
				});
				await assertOwnedServiceParentStable(ownedParent);
				if (backupCreated) {
					await fs$1.rename(backupPath, operationTargetPath);
					await assertOwnedServiceParentStable(ownedParent);
					backupCreated = false;
				}
			}
			throw new Error("Installed Computer Use service app failed post-install identity verification.");
		}
		if (backupCreated) {
			await assertOwnedServiceParentStable(ownedParent);
			await assertNotSymlink(backupPath, "Computer Use service backup");
			await fs$1.rm(backupPath, {
				recursive: true,
				force: true
			});
			await assertOwnedServiceParentStable(ownedParent);
			backupCreated = false;
		}
		return {
			status: initialTarget.exists ? "refreshed" : "installed",
			changed: true,
			targetPath: params.targetPath,
			sourcePath,
			sourceBuild: sourceIdentity.build,
			...initialTarget.identity ? { previousBuild: initialTarget.identity.build } : {}
		};
	} catch (error) {
		if (backupCreated && await ownedServiceParentIsStable(ownedParent) && !await pathExists$1(operationTargetPath)) {
			await assertOwnedServiceParentStable(ownedParent);
			await fs$1.rename(backupPath, operationTargetPath);
			backupCreated = false;
		}
		throw error;
	} finally {
		if (await ownedServiceParentIsStable(ownedParent) && await directoryIdentityIsStable(stagingRootIdentity)) await fs$1.rm(stagingRoot, {
			recursive: true,
			force: true
		});
	}
}
async function pathExists$1(filePath) {
	return await fs$1.lstat(filePath).then(() => true, () => false);
}
async function findUsableServiceApp(candidates, inspectServiceApp) {
	for (const candidate of candidates) {
		const identity = await inspectServiceApp(candidate);
		if (identity) return {
			path: candidate,
			identity
		};
	}
}
async function readServiceAppSnapshot(appPath, inspectServiceApp) {
	if (!await pathExists$1(appPath)) return { exists: false };
	return {
		exists: true,
		identity: await inspectServiceApp(appPath),
		filesystemKey: await readServiceAppFilesystemKey(appPath)
	};
}
async function readServiceAppFilesystemKey(appPath) {
	const paths = [
		appPath,
		path.join(appPath, "Contents", "Info.plist"),
		path.join(appPath, CLIENT_RELATIVE_PATH)
	];
	return (await Promise.all(paths.map(async (entryPath) => await fs$1.stat(entryPath).then((stat) => `${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeMs}`, () => "missing")))).join("|");
}
function snapshotsMatch(left, right) {
	if (left.exists !== right.exists) return false;
	if (!left.exists) return true;
	if (left.filesystemKey && right.filesystemKey && left.filesystemKey !== right.filesystemKey) return false;
	if (left.identity || right.identity) return Boolean(left.identity && right.identity && identitiesMatch(left.identity, right.identity));
	return left.filesystemKey !== void 0 && left.filesystemKey === right.filesystemKey;
}
function filesystemSnapshotsMatch(left, right) {
	return Boolean(left.exists && right.exists && left.filesystemKey && right.filesystemKey && left.filesystemKey === right.filesystemKey);
}
function identitiesMatch(left, right) {
	return left.bundleId === right.bundleId && left.version === right.version && left.build === right.build && left.cdHash === right.cdHash && left.teamId === right.teamId && left.clientBundleId === right.clientBundleId && left.clientCdHash === right.clientCdHash && left.clientTeamId === right.clientTeamId;
}
async function hasExecutableClient(appPath) {
	try {
		await fs$1.access(path.join(appPath, CLIENT_RELATIVE_PATH), constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
async function inspectTrustedServiceApp(appPath) {
	if (!await hasExecutableClient(appPath)) return;
	const clientAppPath = path.join(appPath, CLIENT_APP_RELATIVE_PATH);
	try {
		await verifyTrustedBundle(appPath, SERVICE_BUNDLE_ID, true);
		await verifyTrustedBundle(clientAppPath, CLIENT_BUNDLE_ID, false);
		const [info, serviceSignature, clientSignature] = await Promise.all([
			readBundleInfo(appPath),
			readCodeSignature(appPath),
			readCodeSignature(clientAppPath)
		]);
		if (!info || serviceSignature.identifier !== SERVICE_BUNDLE_ID || serviceSignature.teamId !== OPENAI_TEAM_ID || clientSignature.identifier !== CLIENT_BUNDLE_ID || clientSignature.teamId !== OPENAI_TEAM_ID) return;
		return {
			bundleId: serviceSignature.identifier,
			version: info.version,
			build: info.build,
			cdHash: serviceSignature.cdHash,
			teamId: serviceSignature.teamId,
			clientBundleId: clientSignature.identifier,
			clientCdHash: clientSignature.cdHash,
			clientTeamId: clientSignature.teamId
		};
	} catch {
		return;
	}
}
async function verifyTrustedBundle(appPath, bundleId, deep) {
	const requirement = `anchor apple generic and certificate leaf[subject.OU] = "${OPENAI_TEAM_ID}" and identifier "${bundleId}"`;
	await runExec("/usr/bin/codesign", [
		"--verify",
		"--strict",
		...deep ? ["--deep"] : [],
		`-R=${requirement}`,
		appPath
	], {
		logOutput: false,
		timeoutMs: INSPECT_TIMEOUT_MS
	});
}
async function readBundleInfo(appPath) {
	const result = await runExec("/usr/bin/plutil", [
		"-convert",
		"json",
		"-o",
		"-",
		"--",
		path.join(appPath, "Contents", "Info.plist")
	], {
		logOutput: false,
		timeoutMs: INSPECT_TIMEOUT_MS
	});
	const parsed = JSON.parse(result.stdout);
	if (!isRecord(parsed)) return;
	const version = parsed.CFBundleShortVersionString;
	const build = parsed.CFBundleVersion;
	return typeof version === "string" && version && typeof build === "string" && build ? {
		version,
		build
	} : void 0;
}
async function readCodeSignature(appPath) {
	const result = await runExec("/usr/bin/codesign", [
		"-d",
		"--verbose=4",
		appPath
	], {
		logOutput: false,
		timeoutMs: INSPECT_TIMEOUT_MS
	});
	const output = `${result.stdout}\n${result.stderr}`;
	const identifier = readCodeSignField(output, "Identifier");
	const teamId = readCodeSignField(output, "TeamIdentifier");
	const cdHash = readCodeSignField(output, "CDHash").toLowerCase();
	if (!identifier || !teamId || !/^[a-f0-9]+$/.test(cdHash)) throw new Error(`Could not inspect the signed identity at ${appPath}.`);
	return {
		identifier,
		teamId,
		cdHash
	};
}
function readCodeSignField(output, field) {
	const prefix = `${field}=`;
	return output.split(/\r?\n/u).find((candidate) => candidate.startsWith(prefix))?.slice(prefix.length).trim() ?? "";
}
async function copyServiceAppWithDitto(sourcePath, targetPath) {
	await runExec("/usr/bin/ditto", [
		"--noqtn",
		sourcePath,
		targetPath
	], {
		logOutput: false,
		timeoutMs: COPY_TIMEOUT_MS
	});
}
//#endregion
//#region extensions/codex/src/app-server/auth-bridge.ts
const OPENAI_CODEX_DEFAULT_PROFILE_ID = "openai:default";
const CODEX_HOME_ENV_VAR = "CODEX_HOME";
const HOME_ENV_VAR = "HOME";
const CODEX_APP_SERVER_PREPARED_AUTH_ENV_VARS = [
	"CODEX_API_KEY",
	"OPENAI_API_KEY",
	"CODEX_ACCESS_TOKEN"
];
const CODEX_APP_SERVER_HOME_ENV_VARS = [CODEX_HOME_ENV_VAR, HOME_ENV_VAR];
const MAX_COMPUTER_USE_ARTIFACT_OWNERS = 128;
const activeComputerUseArtifactReconciliations = /* @__PURE__ */ new Map();
const scopedOAuthRefreshQueues = /* @__PURE__ */ new WeakMap();
async function bridgeCodexAppServerStartOptions(params) {
	if (params.startOptions.transport !== "stdio") return params.startOptions;
	const scopeStartOptions = () => withCodexHomeEnvironment(withEphemeralCodexAuthStore(params), params.agentDir);
	if (params.preparedAuth) {
		const scopedStartOptions = await scopeStartOptions();
		return withClearedEnvironmentVariables(scopedStartOptions, CODEX_APP_SERVER_PREPARED_AUTH_ENV_VARS);
	}
	if (params.authProfileId === null) return scopeStartOptions();
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir: params.agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	const authProfileId = resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
	if (!authProfileId) assertNoUnimportedAgentCodexAuthFile(params);
	const scopedStartOptions = await scopeStartOptions();
	return shouldClearOpenAiApiKeyForCodexAuthProfile({
		store,
		authProfileId
	}) ? withClearedEnvironmentVariables(scopedStartOptions, CODEX_APP_SERVER_API_KEY_ENV_VARS) : scopedStartOptions;
}
function assertNoUnimportedAgentCodexAuthFile(params) {
	if (params.authRequirement === "api-key" && resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions: params.startOptions })) return;
	const message = resolveUnimportedAgentCodexAuthMessage(params);
	if (message) throw new AgentHarnessPreflightError(message);
}
function resolveUnimportedAgentCodexAuthMessage(params) {
	if (params.startOptions.transport !== "stdio" || params.startOptions.homeScope === "user") return;
	const codexHome = resolveCodexAppServerHomeDir(params.agentDir);
	const authPath = path.join(codexHome, CODEX_AUTH_JSON_FILENAME);
	if (!fs.existsSync(authPath)) return;
	const targetAgentId = params.agentId?.trim() || "<agent-id>";
	return `A Codex auth file exists at ${authPath}, but agent-scoped Codex runs use OpenClaw's auth store and do not read that file. Preview only that credential import with \`openclaw migrate plan codex --from <codex-home> --agent ${targetAgentId} --include-secrets --item auth:openai\`, then run \`openclaw migrate apply codex --from <codex-home> --agent ${targetAgentId} --include-secrets --item auth:openai --yes\`. If the plan finds no credentials, remove the stale auth file.`;
}
/** Resolves prepared profile login material once so cache identity and RPC login cannot drift. */
async function resolveCodexAppServerPreparedAuthProfileSnapshot(params) {
	const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {});
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	const profileId = resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
	if (!profileId) return;
	const credential = store.profiles[profileId];
	if (!credential || !isCodexAppServerAuthProfileCredential(credential)) return;
	const loginParams = await resolveCodexAppServerAuthProfileLoginParamsInternal({
		agentDir,
		authProfileId: profileId,
		authProfileStore: store,
		config: params.config
	});
	if (!loginParams) return;
	const accountId = loginParams.type === "chatgptAuthTokens" ? loginParams.chatgptAccountId : resolveChatgptAccountId(profileId, credential);
	const stableChatgptAccountId = resolveStableChatgptAccountId(credential);
	const secretFreeCacheKey = credential.type === "api_key" && loginParams.type === "apiKey" ? `${accountId}:${fingerprintApiKeyAuthProfileCacheKey(loginParams.apiKey)}` : loginParams.type === "chatgptAuthTokens" && (credential.type === "token" || !stableChatgptAccountId) ? `${accountId}:${fingerprintTokenAuthProfileCacheKey(loginParams.accessToken)}` : accountId;
	const chatgptAccountId = loginParams.type === "chatgptAuthTokens" ? loginParams.chatgptAccountId : void 0;
	return {
		loginParams,
		secretFreeCacheKey,
		...chatgptAccountId ? { chatgptAccountId } : {}
	};
}
/** Maps one prepared route to one mutually exclusive app-server auth handoff. */
async function resolveCodexAppServerPreparedAuthHandoff(params) {
	const usesNativeHome = params.homeScope === "user";
	if (params.requirePreparedAuth && usesNativeHome) throw createCodexAppServerAuthError("Codex remote-exec cloud placement requires prepared OpenAI auth. Configure an OpenAI API-key, OAuth, or token profile and use appServer.homeScope=\"agent\"; ambient credentials and native Codex auth are not allowed.");
	if (usesNativeHome) return { nativeAuthProfile: true };
	if (params.authRequirement === "api-key") {
		const apiKey = params.resolvedApiKey?.trim();
		if (!apiKey) throw new Error("Prepared Codex API-key route is missing its resolved API key.");
		return {
			nativeAuthProfile: false,
			preparedAuth: {
				kind: "api-key",
				apiKey
			}
		};
	}
	const authProfileId = params.authProfileId?.trim() || void 0;
	if (authProfileId && !params.authProfileStore.profiles[authProfileId]) throw new CodexAppServerAuthProfileUnavailableError(formatCodexAuthProfileUnavailableMessage(authProfileId));
	const nativeAuthProfile = isCodexAppServerNativeAuthProfile({
		authProfileId,
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
	if (params.authRequirement !== "subscription" && !params.requirePreparedAuth) return {
		authProfileId,
		nativeAuthProfile
	};
	if (!authProfileId || params.authRequirement === "subscription" && !nativeAuthProfile) throw createCodexAppServerAuthError(params.requirePreparedAuth ? "Codex remote-exec cloud placement requires prepared OpenAI auth. Configure an OpenAI API-key, OAuth, or token profile; ambient CODEX_API_KEY, OPENAI_API_KEY, and native Codex auth are not allowed." : params.subscriptionProfileRequiredError);
	const snapshot = await resolveCodexAppServerPreparedAuthProfileSnapshot({
		authProfileId,
		authProfileStore: params.authProfileStore,
		agentDir: params.agentDir,
		config: params.config
	});
	if (!snapshot) throw createCodexAppServerAuthError(params.requirePreparedAuth ? "Codex remote-exec cloud placement could not prepare the selected OpenAI auth profile. Repair or replace the profile, then retry." : params.subscriptionProfileUnusableError);
	return {
		authProfileId,
		nativeAuthProfile,
		preparedAuth: {
			kind: "profile",
			profileId: authProfileId,
			store: params.authProfileStore,
			snapshot
		}
	};
}
async function resolveCodexAppServerAuthAccountCacheKey(params) {
	const agentDir = params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {});
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	const profileId = resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
	if (!profileId) return;
	const credential = store.profiles[profileId];
	if (!credential || !isCodexAppServerAuthProfileCredential(credential)) return;
	const accountId = resolveChatgptAccountId(profileId, credential);
	if (credential.type === "oauth") return accountId;
	const value = (await resolveApiKeyForProfile({
		cfg: params.config,
		store,
		profileId,
		agentDir
	}))?.apiKey?.trim();
	if (!value) return accountId;
	return `${accountId}:${credential.type === "api_key" ? fingerprintApiKeyAuthProfileCacheKey(value) : fingerprintTokenAuthProfileCacheKey(value)}`;
}
async function withCodexHomeEnvironment(startOptions, agentDir) {
	const codexHome = resolveCodexAppServerLocalHomeDir(startOptions, agentDir);
	const nativeHome = startOptions.env?.[HOME_ENV_VAR]?.trim() ? startOptions.env[HOME_ENV_VAR] : void 0;
	await fs$1.mkdir(codexHome, { recursive: true });
	if (nativeHome) await fs$1.mkdir(nativeHome, { recursive: true });
	const nextStartOptions = {
		...startOptions,
		env: {
			...startOptions.env,
			[CODEX_HOME_ENV_VAR]: codexHome,
			...nativeHome ? { [HOME_ENV_VAR]: nativeHome } : {}
		}
	};
	const clearEnv = withoutClearedCodexHomeEnv(startOptions.clearEnv);
	if (clearEnv) nextStartOptions.clearEnv = clearEnv;
	else delete nextStartOptions.clearEnv;
	return nextStartOptions;
}
/** Reconciles Computer Use artifacts for the exact managed command about to start. */
async function reconcileCodexComputerUseStartArtifacts(params) {
	if (params.startOptions.transport !== "stdio") return;
	const codexHome = resolveCodexAppServerLocalHomeDir(params.startOptions, params.agentDir);
	const key = path.resolve(codexHome);
	let owner = activeComputerUseArtifactReconciliations.get(key);
	if (!owner) {
		owner = {
			active: 0,
			tail: Promise.resolve()
		};
		activeComputerUseArtifactReconciliations.set(key, owner);
	} else {
		activeComputerUseArtifactReconciliations.delete(key);
		activeComputerUseArtifactReconciliations.set(key, owner);
	}
	owner.active += 1;
	const epoch = params.desktopGeneration?.epoch;
	if (epoch !== void 0 && (owner.latestEpoch === void 0 || epoch > owner.latestEpoch)) owner.latestEpoch = epoch;
	const assertCurrent = () => {
		params.assertCurrent?.();
		if (epoch !== void 0 && owner.latestEpoch !== epoch) throw new Error("Codex Computer Use artifact reconciliation was superseded.");
	};
	const operation = owner.tail.catch(() => void 0).then(async () => {
		assertCurrent();
		const appliedCacheBinding = await reconcileCodexComputerUseStartArtifactsOnce({
			...params,
			codexHome,
			assertCurrent,
			previousCacheBinding: owner.appliedCacheBinding
		});
		assertCurrent();
		owner.appliedCacheBinding = appliedCacheBinding;
	});
	const settled = operation.then(() => void 0, () => void 0);
	owner.tail = settled;
	try {
		await operation;
	} finally {
		owner.active = Math.max(0, owner.active - 1);
		if (owner.active === 0 && owner.latestEpoch === void 0 && activeComputerUseArtifactReconciliations.get(key) === owner && owner.tail === settled) activeComputerUseArtifactReconciliations.delete(key);
		pruneComputerUseArtifactOwners();
	}
}
async function reconcileCodexComputerUseStartArtifactsOnce(params) {
	const codexHome = params.codexHome;
	const computerUseConfig = resolveCodexComputerUseConfig({ pluginConfig: params.pluginConfig });
	const ownsIsolatedCodexHome = params.ownsIsolatedCodexHome ?? (params.startOptions.homeScope !== "user" && !params.startOptions.env?.[CODEX_HOME_ENV_VAR]?.trim());
	const shouldProvisionComputerUse = computerUseConfig.enabled && computerUseConfig.autoInstall && ownsIsolatedCodexHome;
	const provisioningAgentDir = shouldProvisionComputerUse ? params.agentDir : void 0;
	if (shouldProvisionComputerUse && !provisioningAgentDir) throw new Error("Managed Codex Computer Use requires an OpenClaw agent directory");
	if (provisioningAgentDir) await ensureOwnedCodexHome(codexHome, provisioningAgentDir);
	else await fs$1.mkdir(codexHome, { recursive: true });
	const desktopCandidates = resolveMacOSDesktopCodexAppPathCandidates();
	const exactDesktopCandidate = desktopCandidates.find((candidate) => path.resolve(candidate.appServerCommandPath) === path.resolve(params.startOptions.command));
	const usesManagedBundledMarketplace = !computerUseConfig.marketplaceSource && !computerUseConfig.marketplacePath && !computerUseConfig.marketplaceName;
	const needsBundledMarketplace = usesManagedBundledMarketplace || computerUseConfig.pluginCacheMode === "shared" && !computerUseConfig.marketplaceName && !computerUseConfig.marketplacePath;
	const artifactCandidate = shouldProvisionComputerUse ? await resolveCompleteComputerUseArtifactCandidate({
		candidates: exactDesktopCandidate ? [exactDesktopCandidate] : desktopCandidates,
		needsBundledMarketplace
	}) : exactDesktopCandidate;
	params.assertCurrent();
	if (provisioningAgentDir) {
		if (desktopCandidates.length > 0 && !artifactCandidate) throw new CodexComputerUseCandidateArtifactsUnavailableError();
		try {
			const marketplacePath = usesManagedBundledMarketplace ? await ensureCodexManagedBundledMarketplace({
				codexHome,
				ownershipRoot: provisioningAgentDir,
				...artifactCandidate ? {
					appServerCommand: artifactCandidate.appServerCommandPath,
					candidates: [artifactCandidate],
					ownershipCandidates: desktopCandidates
				} : {},
				assertCurrent: params.assertCurrent
			}) : void 0;
			params.assertCurrent();
			if (usesManagedBundledMarketplace && desktopCandidates.length > 0 && !marketplacePath) throw new CodexComputerUseCandidateArtifactsUnavailableError();
			const service = await ensureCodexComputerUseServiceApp({
				codexHome,
				ownershipRoot: params.agentDir,
				...artifactCandidate ? {
					appServerCommand: artifactCandidate.appServerCommandPath,
					sourceAppCandidates: artifactCandidate.computerUseServiceAppPaths
				} : {},
				assertCurrent: params.assertCurrent
			});
			params.assertCurrent();
			if (desktopCandidates.length > 0 && service.status === "source_missing") throw new CodexComputerUseCandidateArtifactsUnavailableError();
		} catch (error) {
			params.assertCurrent();
			if (error instanceof CodexComputerUseCandidateArtifactsUnavailableError) throw error;
			throw new AgentHarnessPreflightError("Codex Computer Use client provisioning failed.", {
				cause: error,
				scope: "harness"
			});
		}
	}
	params.assertCurrent();
	const cacheBinding = [
		params.desktopGeneration?.epoch ?? "manual",
		artifactCandidate?.bundledMarketplacePath ?? "default",
		computerUseConfig.pluginName
	].join("\0");
	const cache = await ensureCodexComputerUseSharedPluginCache({
		codexHome,
		config: computerUseConfig,
		...ownsIsolatedCodexHome ? { ownershipRoot: params.agentDir } : {},
		...artifactCandidate ? { bundledMarketplacePath: artifactCandidate.bundledMarketplacePath } : {},
		assertCurrent: params.assertCurrent,
		forceRefresh: params.forceCacheRefresh === true || params.previousCacheBinding !== cacheBinding
	});
	params.assertCurrent();
	return cache.status === "shared" ? cacheBinding : void 0;
}
async function resolveCompleteComputerUseArtifactCandidate(params) {
	for (const candidate of params.candidates) {
		if (params.needsBundledMarketplace && !await resolveCodexManagedBundledMarketplaceSource({ candidates: [candidate] })) continue;
		if (await resolveCodexComputerUseServiceAppSourcePath({ sourceAppCandidates: candidate.computerUseServiceAppPaths })) return candidate;
	}
}
function pruneComputerUseArtifactOwners() {
	while (activeComputerUseArtifactReconciliations.size > MAX_COMPUTER_USE_ARTIFACT_OWNERS) {
		const inactive = [...activeComputerUseArtifactReconciliations].find(([, owner]) => owner.active === 0);
		if (!inactive) return;
		activeComputerUseArtifactReconciliations.delete(inactive[0]);
	}
}
var CodexComputerUseCandidateArtifactsUnavailableError = class extends Error {
	constructor() {
		super("The selected Codex desktop app does not contain complete Computer Use artifacts.");
		this.code = "CODEX_COMPUTER_USE_CANDIDATE_ARTIFACTS_UNAVAILABLE";
		this.name = "CodexComputerUseCandidateArtifactsUnavailableError";
	}
};
function withoutClearedCodexHomeEnv(clearEnv) {
	if (!clearEnv) return;
	const reserved = new Set(CODEX_APP_SERVER_HOME_ENV_VARS);
	const filtered = clearEnv.filter((envVar) => !reserved.has(envVar.trim().toUpperCase()));
	return filtered.length === clearEnv.length ? clearEnv : filtered;
}
async function applyCodexAppServerAuthProfile(params) {
	params.assertCurrent?.();
	if (!params.preparedAuth && params.authProfileId === null) {
		await assertNativeCodexAccountMatchesRoute(params.client, params.authRequirement, params.assertCurrent);
		return;
	}
	const agentDir = params.agentDir ?? resolveDefaultAgentDir(params.config ?? {});
	let loginParams = params.preparedAuth?.kind === "profile" ? params.preparedAuth.snapshot.loginParams : params.preparedAuth?.kind === "api-key" ? {
		type: "apiKey",
		apiKey: params.preparedAuth.apiKey
	} : await resolveCodexAppServerAuthProfileLoginParams({
		agentDir,
		authProfileId: params.authProfileId ?? void 0,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	if (params.authRequirement === "subscription" && loginParams?.type !== "chatgptAuthTokens") throw createCodexAppServerAuthError("Codex subscription auth profile could not produce login credentials. Sign in with `openclaw models auth login --provider openai`, select that profile, then retry.");
	if (!loginParams && params.authRequirement === "api-key" && params.startOptions?.transport === "stdio") {
		const env = resolveCodexAppServerSpawnEnv(params.startOptions, process.env);
		loginParams = await resolveCodexAppServerFallbackApiKeyLoginParams({
			client: params.client,
			env,
			codexCliAuthEnv: process.env,
			assertCurrent: params.assertCurrent
		});
	}
	if (loginParams) {
		await params.client.request("account/login/start", loginParams, { assertCurrent: params.assertCurrent });
		if (loginParams.type === "chatgptAuthTokens") {
			params.assertCurrent?.();
			return {
				accessFingerprint: fingerprintTokenAuthProfileCacheKey(loginParams.accessToken),
				chatgptAccountId: loginParams.chatgptAccountId
			};
		}
	}
}
/**
* Native-home connections are verified, never logged into. Both directions of the
* check protect the same billing boundary: a subscription route cannot run without
* ChatGPT tokens, and a Platform route must not silently spend the operator's
* ChatGPT plan. An absent account is left alone because the native home may serve a
* custom model provider that reports no OpenAI account at all.
*/
async function assertNativeCodexAccountMatchesRoute(client, authRequirement, assertCurrent) {
	if (!authRequirement) return;
	const accountType = (await client.request("account/read", { refreshToken: false }, { assertCurrent })).account?.type;
	if (authRequirement === "subscription") {
		if (accountType !== "chatgpt") throw createCodexAppServerAuthError("Codex subscription route requires ChatGPT auth in the native Codex home. Run `codex login` for that home, or use appServer.homeScope=\"agent\" with an OpenClaw OAuth profile, then retry.");
		return;
	}
	if (accountType === "chatgpt") throw createCodexAppServerAuthError("Codex Platform route requires an API-key account, but the native Codex home is signed in with a ChatGPT subscription. Sign that home in with `codex login --with-api-key`, or set appServer.homeScope=\"agent\" so OpenClaw can inject its own key.");
}
function createCodexAppServerAuthError(message, cause) {
	const error = cause === void 0 ? new Error(message) : new Error(message, { cause });
	return Object.assign(error, { status: 401 });
}
async function resolveCodexAppServerAuthProfileLoginParams(params) {
	const store = resolveCodexAppServerAuthProfileStore(params);
	return await resolveCodexAppServerAuthProfileLoginParamsInternal({
		...params,
		authProfileStore: store
	});
}
async function refreshCodexAppServerAuthTokens(params) {
	const previousAccountId = params.previousAccountId?.trim();
	const handoffAccountId = params.authHandoff?.chatgptAccountId.trim();
	if (previousAccountId && handoffAccountId && previousAccountId !== handoffAccountId) throw new Error("ChatGPT workspace changed before Codex token refresh. Retry to start a client for the selected workspace.");
	if (previousAccountId) {
		const store = resolveCodexAppServerAuthProfileStore(params);
		const profileId = resolveCodexAppServerAuthProfileId({
			authProfileId: params.authProfileId,
			store,
			config: params.config
		});
		const credential = profileId ? store.profiles[profileId] : void 0;
		const selectedAccountId = credential ? resolveExplicitChatgptAccountId(credential) ?? (credential.type === "oauth" ? resolveOpenAICodexAuthIdentity({ access: credential.access }).accountId : void 0) : void 0;
		if (selectedAccountId && selectedAccountId !== previousAccountId) throw new Error("ChatGPT workspace changed before Codex token refresh. Retry to start a client for the selected workspace.");
	}
	const loginParams = await resolveCodexAppServerAuthProfileLoginParamsInternal({
		...params,
		forceOAuthRefresh: true
	});
	if (!loginParams || loginParams.type !== "chatgptAuthTokens") throw new Error("Codex app-server ChatGPT token refresh requires an OAuth auth profile. Sign in with `openclaw models auth login --provider openai`, select that profile, then retry.");
	if (previousAccountId && loginParams.chatgptAccountId !== previousAccountId) throw new Error("ChatGPT workspace changed during Codex token refresh. Retry to start a client for the selected workspace.");
	if (params.authHandoff && loginParams.chatgptAccountId !== params.authHandoff.chatgptAccountId) throw new Error("ChatGPT workspace changed during Codex token refresh. Retry to start a client for the selected workspace.");
	return {
		accessToken: loginParams.accessToken,
		chatgptAccountId: loginParams.chatgptAccountId,
		chatgptPlanType: loginParams.chatgptPlanType ?? null
	};
}
async function resolveCodexAppServerAuthProfileLoginParamsInternal(params) {
	const store = resolveCodexAppServerAuthProfileStore({
		agentDir: params.agentDir,
		authProfileId: params.authProfileId,
		authProfileStore: params.authProfileStore,
		config: params.config
	});
	const profileId = resolveCodexAppServerAuthProfileId({
		authProfileId: params.authProfileId,
		store,
		config: params.config
	});
	if (!profileId) return;
	const credential = store.profiles[profileId];
	if (!credential) throw new CodexAppServerAuthProfileUnavailableError(formatCodexAuthProfileUnavailableMessage(profileId));
	if (!isCodexAppServerAuthProfileCredential(credential)) throw new CodexAppServerAuthProfileUnavailableError(`Codex app-server auth profile "${profileId}" must use the canonical OpenAI auth provider; run "openclaw doctor --fix" to migrate legacy provider IDs.`);
	const loginParams = await resolveLoginParamsForCredential(profileId, credential, {
		agentDir: params.agentDir,
		store,
		preferStoreCredential: Boolean(params.authProfileStore?.profiles[profileId]),
		forceOAuthRefresh: params.forceOAuthRefresh === true,
		authHandoff: params.authHandoff,
		previousAccountId: params.previousAccountId,
		config: params.config
	});
	if (!loginParams) throw new CodexAppServerAuthProfileUnavailableError(`Codex app-server auth profile "${profileId}" does not contain usable credentials. Repair or replace the selected OpenAI credential, then retry.`);
	return loginParams;
}
async function resolveCodexAppServerFallbackApiKeyLoginParams(params) {
	const apiKey = readFirstNonEmptyEnv(params.env, CODEX_APP_SERVER_API_KEY_ENV_VARS) ?? await readCodexCliAuthFileApiKey(params.codexCliAuthEnv);
	if (!apiKey) return;
	if ((await params.client.request("account/read", { refreshToken: false }, { assertCurrent: params.assertCurrent })).account) return;
	return {
		type: "apiKey",
		apiKey
	};
}
async function resolveLoginParamsForCredential(profileId, credential, params) {
	if (credential.type === "api_key" || credential.type === "token") {
		const value = (await resolveApiKeyForProfile({
			cfg: params.config,
			store: params.preferStoreCredential ? params.store : ensureAuthProfileStore(params.agentDir, {
				allowKeychainPrompt: false,
				profileId,
				config: params.config
			}),
			profileId,
			agentDir: params.agentDir
		}))?.apiKey?.trim();
		if (!value) return;
		return credential.type === "api_key" ? {
			type: "apiKey",
			apiKey: value
		} : buildChatgptAuthTokensParams(profileId, credential, value);
	}
	if (credential.type !== "oauth") return;
	const resolvedCredential = await resolveOAuthCredentialForCodexAppServer(profileId, credential, {
		agentDir: params.agentDir,
		store: params.store,
		preferStoreCredential: params.preferStoreCredential,
		forceRefresh: params.forceOAuthRefresh,
		authHandoff: params.authHandoff,
		previousAccountId: params.previousAccountId,
		config: params.config
	});
	const accessToken = resolvedCredential.access?.trim();
	return accessToken ? buildChatgptAuthTokensParams(profileId, resolvedCredential, accessToken) : void 0;
}
async function resolveOAuthCredentialForCodexAppServer(profileId, credential, params) {
	const ownerAgentDir = resolvePersistedAuthProfileOwnerAgentDir({
		agentDir: params.agentDir,
		profileId
	});
	const persistedCredential = findPersistedAuthProfileCredential({
		agentDir: ownerAgentDir,
		profileId
	});
	const useScopedCredential = params.preferStoreCredential && shouldUseScopedOAuthCredential({
		store: params.store,
		profileId,
		persistedCredential,
		suppliedCredential: credential
	});
	if (params.preferStoreCredential && params.store.runtimePersistedProfileIds?.includes(profileId) && (persistedCredential?.type !== "oauth" || !isCodexAppServerAuthProvider(persistedCredential.provider))) throw new CodexAppServerAuthProfileUnavailableError(`Codex app-server auth profile "${profileId}" is no longer an OpenAI OAuth credential in its persisted OpenClaw store. Run "openclaw doctor" to inspect credential ownership, or select an existing OpenAI profile.`);
	const store = useScopedCredential ? params.store : resolveCodexAppServerAuthProfileStore({
		agentDir: ownerAgentDir,
		authProfileId: profileId,
		config: params.config
	});
	const persistedOAuthCredential = !useScopedCredential && persistedCredential?.type === "oauth" && isCodexAppServerAuthProvider(persistedCredential.provider) ? persistedCredential : void 0;
	const ownerCredential = store.profiles[profileId];
	const overlaidOAuthCredential = ownerCredential?.type === "oauth" && isCodexAppServerAuthProvider(ownerCredential.provider) ? ownerCredential : void 0;
	const currentCredential = useScopedCredential || !persistedOAuthCredential ? overlaidOAuthCredential : persistedOAuthCredential;
	const reuseCompletedRotation = params.forceRefresh && (Boolean(persistedOAuthCredential) || params.preferStoreCredential) && shouldReuseCompletedCodexOAuthRotation({
		credential: currentCredential,
		authHandoff: params.authHandoff,
		previousAccountId: params.previousAccountId
	});
	const selectedAccountId = currentCredential ? resolveOpenAICodexAuthIdentity(currentCredential).accountId?.trim() : void 0;
	const callbackAccountId = params.authHandoff?.chatgptAccountId.trim() ?? params.previousAccountId?.trim() ?? void 0;
	if (callbackAccountId && selectedAccountId && callbackAccountId !== selectedAccountId) throw new Error("ChatGPT workspace changed before Codex token refresh. Retry to start a client for the selected workspace.");
	const expectedAccountId = callbackAccountId ?? selectedAccountId;
	if (useScopedCredential && overlaidOAuthCredential) return await resolveScopedOAuthCredential({
		store,
		profileId,
		credential: overlaidOAuthCredential,
		forceRefresh: params.forceRefresh && !reuseCompletedRotation,
		expectedAccountId,
		config: params.config
	});
	if (params.forceRefresh && !persistedOAuthCredential && overlaidOAuthCredential) {
		if (reuseCompletedRotation) return overlaidOAuthCredential;
		const refreshedRuntimeCredential = await refreshOAuthCredentialForRuntime({
			credential: overlaidOAuthCredential,
			cfg: params.config
		});
		if (!refreshedRuntimeCredential?.access?.trim()) throw new Error(`Codex app-server auth profile "${profileId}" could not refresh. Sign in again with OpenClaw, then retry.`);
		assertCodexOAuthRefreshWorkspace(profileId, refreshedRuntimeCredential, expectedAccountId);
		store.profiles[profileId] = refreshedRuntimeCredential;
		return refreshedRuntimeCredential;
	}
	const resolved = await resolveApiKeyForProfile({
		cfg: params.config,
		store,
		profileId,
		agentDir: ownerAgentDir,
		forceRefresh: params.forceRefresh && Boolean(persistedOAuthCredential) && !reuseCompletedRotation,
		allowProfileFallback: false,
		...expectedAccountId ? { validateOAuthCredential: (candidate) => assertCodexOAuthRefreshWorkspace(profileId, candidate, expectedAccountId) } : {}
	});
	if (!resolved || resolved.credential?.type !== "oauth" || !isCodexAppServerAuthProvider(resolved.credential.provider) || !resolved.apiKey.trim()) throw new CodexAppServerAuthProfileUnavailableError(`Codex app-server auth profile "${profileId}" could not resolve usable OAuth credentials from its OpenClaw credential store. Run "openclaw doctor" to inspect credential ownership, or select an existing OpenAI profile.`);
	const candidate = {
		...resolved.credential,
		access: resolved.apiKey
	};
	if (isDeepStrictEqual(params.store.profiles[profileId], credential)) params.store.profiles[profileId] = candidate;
	return candidate;
}
function shouldReuseCompletedCodexOAuthRotation(params) {
	const handoff = params.authHandoff;
	const credential = params.credential;
	if (!handoff || !credential || !hasUsableOAuthCredential(credential) || fingerprintTokenAuthProfileCacheKey(credential.access.trim()) === handoff.accessFingerprint) return false;
	const accountId = resolveOpenAICodexAuthIdentity(credential).accountId?.trim();
	const previousAccountId = params.previousAccountId?.trim();
	return accountId === handoff.chatgptAccountId && (!previousAccountId || previousAccountId === handoff.chatgptAccountId);
}
function shouldUseScopedOAuthCredential(params) {
	if (!params.store.runtimePersistedProfileIds?.includes(params.profileId)) return true;
	const persisted = params.persistedCredential;
	if (persisted?.type !== "oauth" || !isCodexAppServerAuthProvider(persisted.provider)) return false;
	return !isDeepStrictEqual(persisted, params.suppliedCredential) && !hasMatchingOAuthIdentity(persisted, params.suppliedCredential);
}
function hasMatchingOAuthIdentity(persisted, supplied) {
	const persistedAccountId = resolveOpenAICodexAuthIdentity(persisted).accountId?.trim();
	const suppliedAccountId = resolveOpenAICodexAuthIdentity(supplied).accountId?.trim();
	if (persistedAccountId && suppliedAccountId) return persistedAccountId === suppliedAccountId;
	const persistedEmail = persisted.email?.trim().toLowerCase();
	const suppliedEmail = supplied.email?.trim().toLowerCase();
	return Boolean(persistedEmail && suppliedEmail && persistedEmail === suppliedEmail);
}
async function resolveScopedOAuthCredential(params) {
	const existingRefresh = scopedOAuthRefreshQueues.get(params.store)?.get(params.profileId);
	if (existingRefresh) {
		const refreshed = await existingRefresh;
		assertCodexOAuthRefreshWorkspace(params.profileId, refreshed, params.expectedAccountId);
		return refreshed;
	}
	if (!params.forceRefresh && hasUsableOAuthCredential(params.credential)) return params.credential;
	const storeRefreshes = scopedOAuthRefreshQueues.get(params.store) ?? /* @__PURE__ */ new Map();
	scopedOAuthRefreshQueues.set(params.store, storeRefreshes);
	const refresh = (async () => {
		const current = params.store.profiles[params.profileId];
		const credential = current?.type === "oauth" ? current : params.credential;
		if (!params.forceRefresh && hasUsableOAuthCredential(credential)) return credential;
		const refreshed = await refreshOAuthCredentialForRuntime({
			credential,
			cfg: params.config
		});
		if (!refreshed?.access?.trim()) throw new Error(`Codex app-server auth profile "${params.profileId}" could not refresh. Sign in again with OpenClaw, then retry.`);
		assertCodexOAuthRefreshWorkspace(params.profileId, refreshed, params.expectedAccountId);
		if (!isDeepStrictEqual(params.store.profiles[params.profileId], credential)) throw new Error(`Codex app-server auth profile "${params.profileId}" changed while refreshing. Retry with the newly selected OpenAI profile.`);
		params.store.profiles[params.profileId] = refreshed;
		return refreshed;
	})();
	storeRefreshes.set(params.profileId, refresh);
	try {
		return await refresh;
	} finally {
		if (storeRefreshes.get(params.profileId) === refresh) storeRefreshes.delete(params.profileId);
	}
}
function assertCodexOAuthRefreshWorkspace(profileId, credential, expectedAccountId) {
	if (!expectedAccountId) return;
	const loginParams = buildChatgptAuthTokensParams(profileId, credential, credential.access.trim());
	if (loginParams.type !== "chatgptAuthTokens" || loginParams.chatgptAccountId !== expectedAccountId) throw new Error("ChatGPT workspace changed during Codex token refresh. Retry to start a client for the selected workspace.");
}
function isCodexAppServerAuthProvider(provider) {
	return provider.trim().toLowerCase() === CODEX_APP_SERVER_AUTH_PROVIDER;
}
function isCodexAppServerAuthProfileCredential(credential) {
	return isCodexAppServerAuthProvider(credential.provider);
}
function shouldClearOpenAiApiKeyForCodexAuthProfile(params) {
	const profileId = params.authProfileId?.trim();
	return isCodexSubscriptionCredential(profileId ? params.store.profiles[profileId] : params.store.profiles[OPENAI_CODEX_DEFAULT_PROFILE_ID]);
}
function isCodexSubscriptionCredential(credential) {
	if (!credential || !isCodexAppServerAuthProvider(credential.provider)) return false;
	return credential.type === "oauth" || credential.type === "token";
}
function buildChatgptAuthTokensParams(profileId, credential, accessToken) {
	const storedAccountId = resolveExplicitChatgptAccountId(credential);
	const tokenAccountId = resolveOpenAICodexAuthIdentity({ access: accessToken }).accountId;
	if (storedAccountId && tokenAccountId && storedAccountId !== tokenAccountId) throw new CodexAppServerAuthProfileUnavailableError(`Codex app-server auth profile "${profileId}" has a different ChatGPT account ID than its access token. Sign in again before retrying.`);
	const chatgptAccountId = storedAccountId ?? tokenAccountId;
	if (!chatgptAccountId) throw new CodexAppServerAuthProfileUnavailableError(`Codex app-server auth profile "${profileId}" is missing its ChatGPT account ID. Sign in again before retrying.`);
	return {
		type: "chatgptAuthTokens",
		accessToken,
		chatgptAccountId,
		chatgptPlanType: resolveChatgptPlanType(credential)
	};
}
function resolveChatgptPlanType(credential) {
	const record = credential;
	const planType = record.chatgptPlanType ?? record.planType;
	return typeof planType === "string" && planType.trim() ? planType.trim() : null;
}
function resolveChatgptAccountId(profileId, credential) {
	return resolveStableChatgptAccountId(credential) ?? profileId;
}
function resolveStableChatgptAccountId(credential) {
	return resolveExplicitChatgptAccountId(credential) ?? (credential.email?.trim() || void 0);
}
function resolveExplicitChatgptAccountId(credential) {
	if ("accountId" in credential && typeof credential.accountId === "string") {
		const accountId = credential.accountId.trim();
		if (accountId) return accountId;
	}
}
//#endregion
//#region extensions/codex/src/app-server/client-thread-owner.ts
function createThreadOwnerToken(threadId, onInvalidated) {
	const owner = {
		invalidated: false,
		invalidate: () => {
			if (owner.invalidated) return;
			owner.invalidated = true;
			try {
				onInvalidated?.();
			} catch (error) {
				embeddedAgentLog$1.warn("codex thread ownership invalidation failed", {
					threadId,
					reason: formatErrorMessage(error)
				});
			}
		}
	};
	return owner;
}
function hasThreadOwnership(runtime, threadId) {
	return runtime !== void 0 && !runtime.closed && (runtime.retainedThreads.get(threadId) !== void 0 || runtime.releasingThreads.get(threadId) !== void 0 || runtime.claimedThreads.get(threadId) !== void 0);
}
function hasSiblingThreadWork(runtime, threadId) {
	if (!runtime || runtime.closed) return false;
	if (runtime.protectedThreads.size > 0) return true;
	for (const [retainedThreadId, retained] of runtime.retainedThreads) if (retainedThreadId !== threadId && retained.ephemeralPolicy !== void 0) return true;
	for (const claimedThreadId of runtime.claimedThreads.keys()) if (claimedThreadId !== threadId) return true;
	return false;
}
function invalidateThreadOwnership(runtime, threadId) {
	const retainedOwner = runtime.retainedThreads.get(threadId)?.ownerToken;
	const claimedOwner = runtime.claimedThreads.get(threadId);
	const releasing = runtime.releasingThreads.get(threadId);
	if (releasing) releasing.invalidated = true;
	runtime.retainedThreads.delete(threadId);
	runtime.claimedThreads.delete(threadId);
	retainedOwner?.invalidate();
	claimedOwner?.invalidate();
	releasing?.retainedOwnerToken?.invalidate();
}
function forgetThreadOwnership(runtime, threadId, owner) {
	let forgotten = false;
	if (runtime.claimedThreads.get(threadId) === owner) {
		runtime.claimedThreads.delete(threadId);
		forgotten = true;
	}
	if (runtime.retainedThreads.get(threadId)?.ownerToken === owner) {
		runtime.retainedThreads.delete(threadId);
		forgotten = true;
	}
	const releasing = runtime.releasingThreads.get(threadId);
	if (releasing?.retainedOwnerToken === owner) {
		releasing.invalidated = true;
		forgotten = true;
	}
	if (forgotten) owner.invalidate();
	return forgotten;
}
//#endregion
//#region extensions/codex/src/app-server/rate-limit-cache.ts
const DEFAULT_CODEX_RATE_LIMIT_CACHE_MAX_AGE_MS = 6e5;
const SPARSE_ACCOUNT_METADATA_KEYS = [
	"credits",
	"individualLimit",
	"planType"
];
const rateLimitsByClient = /* @__PURE__ */ new WeakMap();
/** Replaces one physical client's cache with an authoritative rate-limit read response. */
function rememberCodexRateLimitsRead(client, value, nowMs = Date.now()) {
	if (value !== void 0) {
		const revisionsByLimitId = { ...rateLimitsByClient.get(client)?.revisionsByLimitId };
		for (const limitId of readRateLimitIds(value)) revisionsByLimitId[limitId] = (revisionsByLimitId[limitId] ?? 0) + 1;
		rateLimitsByClient.set(client, {
			value,
			updatedAtMs: nowMs,
			revisionsByLimitId
		});
	}
}
/** Merges a sparse rolling notification into one physical client's latest read response. */
function mergeCodexRateLimitsUpdate(client, value, nowMs = Date.now()) {
	const update = isJsonObject(value) && isJsonObject(value.rateLimits) ? value.rateLimits : void 0;
	if (!update) return;
	const currentState = rateLimitsByClient.get(client);
	const current = currentState?.value;
	const limitId = readLimitId(update);
	rateLimitsByClient.set(client, {
		value: mergeRateLimitUpdate(current, update),
		updatedAtMs: nowMs,
		revisionsByLimitId: {
			...currentState?.revisionsByLimitId,
			[limitId]: (currentState?.revisionsByLimitId[limitId] ?? 0) + 1
		}
	});
}
/** Per-limit marker used to trust only primary Codex updates from one turn startup. */
function readCodexRateLimitsRevision(client, limitId = "codex") {
	return rateLimitsByClient.get(client)?.revisionsByLimitId[limitId] ?? 0;
}
/** Reads one physical client's cached rate-limit payload within the max-age window. */
function readRecentCodexRateLimits(client, options) {
	const state = rateLimitsByClient.get(client);
	if (!state) return;
	const nowMs = options?.nowMs ?? Date.now();
	const maxAgeMs = options?.maxAgeMs ?? DEFAULT_CODEX_RATE_LIMIT_CACHE_MAX_AGE_MS;
	return maxAgeMs >= 0 && nowMs - state.updatedAtMs > maxAgeMs ? void 0 : state.value;
}
function mergeRateLimitUpdate(current, update) {
	const currentEnvelope = isJsonObject(current) ? current : void 0;
	const currentPrimary = currentEnvelope && isJsonObject(currentEnvelope.rateLimits) ? currentEnvelope.rateLimits : void 0;
	const currentByLimitId = currentEnvelope && isJsonObject(currentEnvelope.rateLimitsByLimitId) ? currentEnvelope.rateLimitsByLimitId : void 0;
	const limitId = readLimitId(update);
	const currentPrimaryLimitId = currentPrimary ? readLimitId(currentPrimary) : void 0;
	const currentForLimit = (currentByLimitId && isJsonObject(currentByLimitId[limitId]) ? currentByLimitId[limitId] : void 0) ?? (currentPrimaryLimitId === limitId ? currentPrimary : void 0);
	const merged = mergeSparseSnapshot(isJsonObject(currentForLimit) ? currentForLimit : void 0, currentPrimary, update, limitId);
	const nextPrimary = !currentPrimary || currentPrimaryLimitId === limitId ? merged : currentPrimary;
	let nextByLimitId;
	if (currentByLimitId) nextByLimitId = {
		...currentByLimitId,
		[limitId]: merged
	};
	else if (currentPrimary && currentPrimaryLimitId && currentPrimaryLimitId !== limitId) nextByLimitId = {
		[currentPrimaryLimitId]: currentPrimary,
		[limitId]: merged
	};
	return {
		...currentEnvelope,
		rateLimits: nextPrimary,
		...nextByLimitId ? { rateLimitsByLimitId: nextByLimitId } : {}
	};
}
function readRateLimitIds(value) {
	if (!isJsonObject(value)) return [];
	const ids = /* @__PURE__ */ new Set();
	if (isJsonObject(value.rateLimits)) ids.add(readLimitId(value.rateLimits));
	if (isJsonObject(value.rateLimitsByLimitId)) for (const [key, snapshot] of Object.entries(value.rateLimitsByLimitId)) {
		const snapshotLimitId = isJsonObject(snapshot) && typeof snapshot.limitId === "string" ? snapshot.limitId.trim() : "";
		ids.add(snapshotLimitId || key);
	}
	return [...ids];
}
function mergeSparseSnapshot(current, accountFallback, update, limitId) {
	const merged = {
		...update,
		limitId
	};
	for (const key of SPARSE_ACCOUNT_METADATA_KEYS) {
		const previous = current?.[key] ?? accountFallback?.[key];
		if (merged[key] == null && previous != null) merged[key] = previous;
	}
	return merged;
}
function readLimitId(snapshot) {
	const value = snapshot.limitId;
	return typeof value === "string" && value.trim() ? value.trim() : "codex";
}
//#endregion
//#region extensions/codex/src/app-server/client-runtime.ts
/** Client-scoped Codex auth and account observers. */
/** Match Codex's native grace window without retaining inactive conversations indefinitely. */
const CODEX_APP_SERVER_LIVE_THREAD_IDLE_TIMEOUT_MS = 18e5;
/** Native-child parents are active ownership, so only otherwise-idle threads count against this cap. */
const CODEX_APP_SERVER_LIVE_THREAD_MAX_IDLE = 64;
/** Return a deterministic error before Codex cancels its ten-second external-auth request. */
const CODEX_EXTERNAL_AUTH_REFRESH_TIMEOUT_MS = 9e3;
const configuredClients = /* @__PURE__ */ new WeakMap();
const physicalThreadReleases = /* @__PURE__ */ new WeakMap();
const claimedThreadReleaseTokens = /* @__PURE__ */ new WeakMap();
/** Only an initialized, still-open physical client can own retained native subscriptions. */
function isCodexAppServerClientRuntimeLive(client) {
	const runtime = configuredClients.get(client);
	return runtime !== void 0 && !runtime.closed;
}
function recordCodexAppServerAuthHandoff(client, handoff) {
	const runtime = configuredClients.get(client);
	if (runtime && !runtime.closed && handoff) runtime.authHandoff = handoff;
}
/** Reference history is only trusted while this native subscription stays warm. */
function forgetCodexWorkspaceReferences(client, threadId) {
	configuredClients.get(client)?.workspaceReferences.delete(threadId);
}
/** Record accepted input without clearing a compaction observed during turn/start. */
function prepareCodexWorkspaceReferences(client, threadId, reference) {
	const runtime = configuredClients.get(client);
	const digest = createHash("sha256").update(reference ?? "").digest("hex");
	const previous = runtime?.workspaceReferences.get(threadId) ?? { needsReintroduction: true };
	if (runtime && !runtime.closed) runtime.workspaceReferences.set(threadId, previous);
	return {
		include: previous.needsReintroduction || previous.digest !== digest,
		accepted: () => {
			if (!runtime || runtime.closed || runtime.workspaceReferences.get(threadId) !== previous) return;
			runtime.workspaceReferences.set(threadId, {
				digest,
				needsReintroduction: false
			});
		}
	};
}
/** Immutable declarations are data owned by this physical client, never retained executors. */
async function readCodexClientSessionMeta(client, sessionsRoot, boundRolloutPath, threadId) {
	let rolloutPath = boundRolloutPath;
	const runtime = configuredClients.get(client);
	if (!runtime || runtime.closed) throw new Error("Codex native metadata requires a live selected client");
	const cached = runtime.sessionMetadata.get(threadId);
	if (cached && cached.sessionsRoot === sessionsRoot && (!rolloutPath || cached.rolloutPath === rolloutPath)) return structuredClone(cached.metadata);
	if (!rolloutPath) {
		const { thread } = await client.request("thread/read", {
			threadId,
			includeTurns: false
		});
		if (thread.id !== threadId || !thread.path) throw new Error("Codex native metadata has no verified thread path");
		rolloutPath = thread.path;
	}
	const metadata = await readCodexSessionMeta(sessionsRoot, rolloutPath, threadId);
	if (runtime.closed || !metadata) throw new Error("Codex native metadata is unavailable on the selected client");
	runtime.sessionMetadata.delete(threadId);
	runtime.sessionMetadata.set(threadId, {
		sessionsRoot,
		rolloutPath,
		metadata
	});
	pruneMapToMaxSize(runtime.sessionMetadata, CODEX_APP_SERVER_LIVE_THREAD_MAX_IDLE);
	return structuredClone(metadata);
}
/** Installs one auth-refresh handler and one rate-limit observer per physical client. */
function ensureCodexAppServerClientRuntime(client, context) {
	const existing = configuredClients.get(client);
	if (existing) {
		if (existing.closed) return;
		existing.context = {
			...existing.context,
			config: context.config
		};
		return;
	}
	const runtime = {
		context,
		closed: false,
		retainedThreads: /* @__PURE__ */ new Map(),
		claimedThreads: /* @__PURE__ */ new Map(),
		releasingThreads: /* @__PURE__ */ new Map(),
		protectedThreads: /* @__PURE__ */ new Map(),
		sessionMetadata: /* @__PURE__ */ new Map(),
		workspaceReferences: /* @__PURE__ */ new Map()
	};
	configuredClients.set(client, runtime);
	client.addCloseHandler(() => {
		runtime.closed = true;
		if (runtime.evictionTimer) {
			clearTimeout(runtime.evictionTimer);
			runtime.evictionTimer = void 0;
		}
		for (const threadId of /* @__PURE__ */ new Set([
			...runtime.retainedThreads.keys(),
			...runtime.claimedThreads.keys(),
			...runtime.releasingThreads.keys()
		])) invalidateThreadOwnership(runtime, threadId);
		runtime.protectedThreads.clear();
		runtime.sessionMetadata.clear();
		runtime.workspaceReferences.clear();
	});
	client.addRequestHandler(async (request) => {
		if (request.method !== "account/chatgptAuthTokens/refresh") return;
		if (runtime.context.authMode === "prepared-api-key") throw new Error("ChatGPT token refresh is unavailable for prepared Codex API-key auth.");
		if (!runtime.context.agentDir) throw new Error("ChatGPT token refresh requires an OpenClaw-owned auth profile.");
		const previousAccountId = isJsonObject(request.params) && typeof request.params.previousAccountId === "string" ? request.params.previousAccountId.trim() || void 0 : void 0;
		const authHandoff = runtime.authHandoff;
		try {
			const tokens = await withTimeout(refreshCodexAppServerAuthTokens({
				agentDir: runtime.context.agentDir,
				authProfileId: runtime.context.authProfileId,
				...authHandoff ? { authHandoff } : {},
				...previousAccountId ? { previousAccountId } : {},
				...runtime.context.authProfileStore ? { authProfileStore: runtime.context.authProfileStore } : {},
				config: runtime.context.config
			}), CODEX_EXTERNAL_AUTH_REFRESH_TIMEOUT_MS, "Codex app-server ChatGPT token refresh timed out before its external-auth deadline. Retry the request; if it persists, sign in again with OpenClaw.");
			if (previousAccountId && tokens.chatgptAccountId !== previousAccountId) throw new Error("ChatGPT workspace changed during Codex token refresh. Retry to start a client for the selected workspace.");
			if (runtime.closed) throw new Error("Codex app-server client closed during ChatGPT token refresh.");
			runtime.authHandoff = {
				accessFingerprint: fingerprintTokenAuthProfileCacheKey(tokens.accessToken),
				chatgptAccountId: tokens.chatgptAccountId
			};
			return { ...tokens };
		} catch (error) {
			runtime.context.onAuthRefreshFailure?.();
			throw error;
		}
	});
	client.addNotificationHandler((notification) => {
		if (notification.method === "item/completed" && isJsonObject(notification.params) && isJsonObject(notification.params.item) && notification.params.item.type === "contextCompaction" && typeof notification.params.threadId === "string") {
			const threadId = notification.params.threadId;
			const previous = runtime.workspaceReferences.get(threadId);
			if (previous) runtime.workspaceReferences.set(threadId, {
				...previous,
				needsReintroduction: true
			});
		}
		if (notification.method === "account/rateLimits/updated") {
			mergeCodexRateLimitsUpdate(client, notification.params);
			return;
		}
		if (notification.method === "thread/archived" || notification.method === "thread/deleted" || notification.method === "thread/closed") {
			const threadId = notification.params?.threadId;
			if (typeof threadId === "string") {
				invalidateThreadOwnership(runtime, threadId);
				runtime.sessionMetadata.delete(threadId);
				runtime.workspaceReferences.delete(threadId);
				scheduleRetainedThreadEviction(client, runtime);
			}
		}
	});
}
function scheduleRetainedThreadEviction(client, runtime) {
	if (runtime.evictionTimer) {
		clearTimeout(runtime.evictionTimer);
		runtime.evictionTimer = void 0;
	}
	if (runtime.closed) return;
	let expiresAt = Number.POSITIVE_INFINITY;
	for (const [threadId, thread] of runtime.retainedThreads) if (!runtime.protectedThreads.has(threadId)) expiresAt = Math.min(expiresAt, thread.expiresAt);
	if (!Number.isFinite(expiresAt)) return;
	runtime.evictionTimer = setTimeout(() => {
		runtime.evictionTimer = void 0;
		evictExpiredRetainedThreads(client, runtime).catch((error) => {
			embeddedAgentLog$1.warn("codex retained thread expiry failed", { reason: formatErrorMessage(error) });
		});
	}, Math.max(0, expiresAt - Date.now()));
	runtime.evictionTimer.unref?.();
}
async function releaseRetainedThread(client, runtime, threadId, assertCurrent) {
	const pendingRelease = runtime.releasingThreads.get(threadId);
	if (pendingRelease) {
		await pendingRelease.completion;
		assertCurrent?.();
		return false;
	}
	const retained = runtime.retainedThreads.get(threadId);
	if (!retained) return false;
	const olderThreadIds = /* @__PURE__ */ new Set();
	for (const candidateThreadId of runtime.retainedThreads.keys()) {
		if (candidateThreadId === threadId) break;
		olderThreadIds.add(candidateThreadId);
	}
	runtime.retainedThreads.delete(threadId);
	scheduleRetainedThreadEviction(client, runtime);
	const transition = {
		retainedOwnerToken: retained.ownerToken,
		completion: Promise.resolve().then(() => {
			assertCurrent?.();
			return assertCurrent ? retained.release(threadId, assertCurrent) : retained.release(threadId);
		})
	};
	runtime.releasingThreads.set(threadId, transition);
	try {
		await transition.completion;
		runtime.workspaceReferences.delete(threadId);
		retained.ownerToken?.invalidate();
		return true;
	} catch (error) {
		if (!runtime.closed && !transition.invalidated && runtime.releasingThreads.get(threadId) === transition && !runtime.retainedThreads.has(threadId) && !runtime.claimedThreads.has(threadId)) {
			if (retained.ephemeralPolicy === void 0) retained.expiresAt = Date.now() + CODEX_APP_SERVER_LIVE_THREAD_IDLE_TIMEOUT_MS;
			const newerThreads = [...runtime.retainedThreads.entries()].filter(([candidateThreadId]) => !olderThreadIds.has(candidateThreadId));
			for (const [candidateThreadId] of newerThreads) runtime.retainedThreads.delete(candidateThreadId);
			runtime.retainedThreads.set(threadId, retained);
			for (const [candidateThreadId, newerThread] of newerThreads) runtime.retainedThreads.set(candidateThreadId, newerThread);
		}
		throw error;
	} finally {
		if (runtime.releasingThreads.get(threadId) === transition) runtime.releasingThreads.delete(threadId);
		scheduleRetainedThreadEviction(client, runtime);
	}
}
async function evictExpiredRetainedThreads(client, runtime) {
	const now = Date.now();
	for (const [threadId, thread] of runtime.retainedThreads) if (thread.expiresAt <= now && !runtime.protectedThreads.has(threadId)) await releaseRetainedThread(client, runtime, threadId);
	scheduleRetainedThreadEviction(client, runtime);
}
async function evictExcessIdleThreads(client, runtime) {
	const idleThreads = () => [...runtime.retainedThreads].filter(([threadId, thread]) => thread.ephemeralPolicy === void 0 && !runtime.protectedThreads.has(threadId));
	let idleThreadIds = idleThreads();
	while (idleThreadIds.length > CODEX_APP_SERVER_LIVE_THREAD_MAX_IDLE) {
		await releaseRetainedThread(client, runtime, idleThreadIds[0][0]);
		idleThreadIds = idleThreads();
	}
}
/** Retain separately owned Codex subscriptions; completing B must never cold-restart A. */
async function retainCodexAppServerLiveThread(client, threadId, releaseThread, configFingerprint, serviceTier, ephemeralPolicy) {
	const runtime = configuredClients.get(client);
	if (!runtime || runtime.closed) return false;
	const claimed = runtime.claimedThreads.get(threadId);
	const ownerToken = releaseThread ? claimedThreadReleaseTokens.get(releaseThread) : void 0;
	if (claimed !== ownerToken || ownerToken?.invalidated) return false;
	const pendingRelease = runtime.releasingThreads.get(threadId);
	if (pendingRelease) {
		await pendingRelease.completion;
		return false;
	}
	const previousOwner = runtime.retainedThreads.get(threadId)?.ownerToken;
	runtime.retainedThreads.delete(threadId);
	const retained = {
		ownerToken,
		configFingerprint,
		ephemeralPolicy,
		serviceTier,
		expiresAt: ephemeralPolicy === void 0 ? Date.now() + CODEX_APP_SERVER_LIVE_THREAD_IDLE_TIMEOUT_MS : Number.POSITIVE_INFINITY,
		release: (releaseThread ? physicalThreadReleases.get(releaseThread) ?? releaseThread : void 0) ?? (async (releasedThreadId, assertCurrent) => {
			await unsubscribeCodexAppServerLiveThread(client, releasedThreadId, 5e3, assertCurrent);
		})
	};
	runtime.retainedThreads.set(threadId, retained);
	if (previousOwner !== ownerToken) previousOwner?.invalidate();
	try {
		await evictExcessIdleThreads(client, runtime);
	} catch (error) {
		if (runtime.retainedThreads.get(threadId) === retained) runtime.retainedThreads.delete(threadId);
		scheduleRetainedThreadEviction(client, runtime);
		embeddedAgentLog$1.warn("codex retained thread capacity eviction failed", {
			threadId,
			reason: formatErrorMessage(error)
		});
		return false;
	}
	if (runtime.closed) return false;
	if (claimed !== void 0 && runtime.claimedThreads.get(threadId) === claimed) runtime.claimedThreads.delete(threadId);
	scheduleRetainedThreadEviction(client, runtime);
	return true;
}
/** Transfer one idle subscription to its next turn or compaction without touching sibling threads. */
async function consumeCodexAppServerLiveThread(client, threadId, configFingerprint) {
	const runtime = configuredClients.get(client);
	if (!runtime || runtime.closed) return;
	const pendingRelease = runtime.releasingThreads.get(threadId);
	if (pendingRelease) {
		await pendingRelease.completion;
		return;
	}
	const retained = runtime.retainedThreads.get(threadId);
	if (!retained || configFingerprint !== void 0 && retained.configFingerprint !== configFingerprint) return;
	return claimCodexAppServerThreadOwnership(client, runtime, threadId, retained);
}
/** Claims an auto-subscription; invalidation ends the handle after replacement or release. */
async function claimCodexAppServerLiveThread(client, threadId, onInvalidated) {
	const runtime = configuredClients.get(client);
	if (!runtime || runtime.closed || runtime.claimedThreads.has(threadId)) return;
	const pendingRelease = runtime.releasingThreads.get(threadId);
	if (pendingRelease) {
		await pendingRelease.completion;
		return;
	}
	return claimCodexAppServerThreadOwnership(client, runtime, threadId, runtime.retainedThreads.get(threadId) ?? {
		expiresAt: Date.now() + CODEX_APP_SERVER_LIVE_THREAD_IDLE_TIMEOUT_MS,
		release: async (releasedThreadId, assertCurrent) => {
			await unsubscribeCodexAppServerLiveThread(client, releasedThreadId, 5e3, assertCurrent);
		}
	}, onInvalidated);
}
function claimCodexAppServerThreadOwnership(client, runtime, threadId, retained, onInvalidated) {
	const previousClaim = runtime.claimedThreads.get(threadId);
	runtime.retainedThreads.delete(threadId);
	const claimed = createThreadOwnerToken(threadId, onInvalidated);
	runtime.claimedThreads.set(threadId, claimed);
	previousClaim?.invalidate();
	retained.ownerToken?.invalidate();
	scheduleRetainedThreadEviction(client, runtime);
	const assertCurrent = () => {
		if (claimed.invalidated || runtime.closed || runtime.claimedThreads.get(threadId) !== claimed) throw new Error(`Codex thread subscription ownership changed: ${threadId}`);
	};
	const release = async (releasedThreadId, assertReleaseCurrent) => {
		if (releasedThreadId !== threadId || claimed.invalidated) {
			assertReleaseCurrent?.();
			return;
		}
		if (runtime.claimedThreads.get(threadId) !== claimed) {
			if (runtime.retainedThreads.get(threadId)?.ownerToken === claimed) await releaseRetainedThread(client, runtime, threadId, assertReleaseCurrent);
			else {
				const pendingRelease = runtime.releasingThreads.get(threadId);
				if (pendingRelease?.retainedOwnerToken === claimed) await pendingRelease.completion;
				assertReleaseCurrent?.();
			}
			return;
		}
		const pendingRelease = runtime.releasingThreads.get(threadId);
		if (pendingRelease) {
			await pendingRelease.completion;
			return;
		}
		const transition = { completion: Promise.resolve().then(async () => {
			if (runtime.closed || runtime.claimedThreads.get(threadId) !== claimed) {
				assertReleaseCurrent?.();
				return;
			}
			assertReleaseCurrent?.();
			await (assertReleaseCurrent ? retained.release(releasedThreadId, assertReleaseCurrent) : retained.release(releasedThreadId));
		}) };
		runtime.releasingThreads.set(threadId, transition);
		try {
			await transition.completion;
			if (runtime.claimedThreads.get(threadId) === claimed) {
				runtime.claimedThreads.delete(threadId);
				runtime.workspaceReferences.delete(threadId);
				claimed.invalidate();
			}
		} finally {
			if (runtime.releasingThreads.get(threadId) === transition) runtime.releasingThreads.delete(threadId);
		}
	};
	physicalThreadReleases.set(release, retained.release);
	claimedThreadReleaseTokens.set(release, claimed);
	return {
		assertCurrent,
		configFingerprint: retained.configFingerprint,
		ephemeralPolicy: retained.ephemeralPolicy,
		serviceTier: retained.serviceTier,
		release,
		forget: () => {
			if (forgetThreadOwnership(runtime, threadId, claimed)) {
				runtime.workspaceReferences.delete(threadId);
				scheduleRetainedThreadEviction(client, runtime);
			}
		}
	};
}
/** Distinguish active claimed ownership from an already-evicted idle subscription. */
function hasCodexAppServerLiveThread(client, threadId) {
	return hasThreadOwnership(configuredClients.get(client), threadId);
}
function isCodexAppServerLiveThreadClaimed(client, threadId) {
	const runtime = configuredClients.get(client);
	return runtime !== void 0 && !runtime.closed && runtime.claimedThreads.has(threadId);
}
function hasCodexAppServerSiblingThreadWork(client, threadId) {
	return hasSiblingThreadWork(configuredClients.get(client), threadId);
}
/** Release the exact physical subscription and finish only its observed ownership generation. */
async function unsubscribeCodexAppServerLiveThread(client, threadId, timeoutMs, assertCurrent) {
	const runtime = configuredClients.get(client);
	const claimed = runtime?.claimedThreads.get(threadId);
	const retained = runtime?.retainedThreads.get(threadId);
	let transition = runtime?.releasingThreads.get(threadId);
	if (transition?.physicalRelease) {
		await transition.physicalRelease;
		assertCurrent?.();
		return;
	}
	const physicalRelease = Promise.resolve().then(async () => {
		if (claimed !== void 0 && runtime?.claimedThreads.get(threadId) !== claimed || retained !== void 0 && runtime?.retainedThreads.get(threadId) !== retained) {
			assertCurrent?.();
			return;
		}
		assertCurrent?.();
		await client.request("thread/unsubscribe", { threadId }, {
			timeoutMs,
			assertCurrent
		});
		assertCurrent?.();
		runtime?.workspaceReferences.delete(threadId);
	});
	const ownsTransition = runtime !== void 0 && transition === void 0;
	if (transition) transition.physicalRelease = physicalRelease;
	else if (runtime) {
		transition = {
			completion: physicalRelease,
			physicalRelease
		};
		runtime.releasingThreads.set(threadId, transition);
	}
	try {
		await physicalRelease;
		if (retained !== void 0 && runtime?.retainedThreads.get(threadId) === retained) {
			runtime.retainedThreads.delete(threadId);
			retained.ownerToken?.invalidate();
			scheduleRetainedThreadEviction(client, runtime);
		}
		if (claimed !== void 0 && runtime?.claimedThreads.get(threadId) === claimed) {
			runtime.claimedThreads.delete(threadId);
			claimed.invalidate();
		}
	} finally {
		if (ownsTransition && runtime.releasingThreads.get(threadId) === transition) runtime.releasingThreads.delete(threadId);
	}
}
/** Reset/end owns the exact thread; failed generation retirement must never release its successor. */
async function releaseCodexAppServerLiveThread(client, threadId, assertCurrent) {
	const runtime = configuredClients.get(client);
	return runtime ? await releaseRetainedThread(client, runtime, threadId, assertCurrent) : false;
}
/** Native child work pins its parent's subscription even after the foreground parent turn ends. */
function protectCodexAppServerLiveThread(client, threadId) {
	const runtime = configuredClients.get(client);
	if (!runtime || runtime.closed) return () => void 0;
	runtime.protectedThreads.set(threadId, (runtime.protectedThreads.get(threadId) ?? 0) + 1);
	scheduleRetainedThreadEviction(client, runtime);
	let protectedThread = true;
	return () => {
		if (!protectedThread) return;
		protectedThread = false;
		if (runtime.closed) return;
		const count = runtime.protectedThreads.get(threadId) ?? 0;
		if (count <= 1) {
			runtime.protectedThreads.delete(threadId);
			const retained = runtime.retainedThreads.get(threadId);
			if (retained) {
				if (retained.ephemeralPolicy === void 0) retained.expiresAt = Date.now() + CODEX_APP_SERVER_LIVE_THREAD_IDLE_TIMEOUT_MS;
				runtime.retainedThreads.delete(threadId);
				runtime.retainedThreads.set(threadId, retained);
			}
		} else runtime.protectedThreads.set(threadId, count - 1);
		scheduleRetainedThreadEviction(client, runtime);
		evictExcessIdleThreads(client, runtime).catch((error) => {
			embeddedAgentLog$1.warn("codex retained thread unpin eviction failed", {
				threadId,
				reason: formatErrorMessage(error)
			});
		});
	};
}
//#endregion
//#region extensions/codex/src/app-server/inference-routing.ts
const owners = defineCodexBuildState("openclaw.codexAppServerInferenceOwners", () => /* @__PURE__ */ new WeakMap())();
const MAX_ROUTES = 8;
const MAX_THREADS = 256;
const NATIVE_OPENAI_UPSTREAMS = /* @__PURE__ */ new Set(["https://api.openai.com/v1", "https://chatgpt.com/backend-api/codex"]);
/** Only managed native stdio startup calls this; locality or metadata cannot opt a client in. */
function ownCodexInferenceClient(client) {
	if (owners.has(client)) return;
	const owner = {
		closed: false,
		routes: /* @__PURE__ */ new Map(),
		threads: /* @__PURE__ */ new Map(),
		handles: /* @__PURE__ */ new Set()
	};
	owners.set(client, owner);
	const close = () => {
		owner.closed = true;
		owner.threads.clear();
		owner.handles.clear();
		for (const pending of owner.routes.values()) pending.then((route) => route.close(), () => {});
		owner.routes.clear();
	};
	client.addCloseHandler(close);
	client.addNotificationHandler((notification) => {
		if (notification.method === "thread/closed" && isJsonObject(notification.params) && typeof notification.params.threadId === "string") owner.threads.delete(notification.params.threadId);
		if (notification.method !== "account/updated" || !owner.authRoute) return;
		const mode = isJsonObject(notification.params) ? notification.params.authMode : void 0;
		if ((mode === "apiKey" ? "apiKey" : mode === "chatgpt" || mode === "chatgptAuthTokens" ? "chatgpt" : void 0) !== owner.authRoute) close();
	});
}
async function prepareCodexInferenceRoute(params) {
	const owner = owners.get(params.client);
	if (!owner) return;
	const assertClient = () => {
		if (owner.closed || owners.get(params.client) !== owner) throw new Error("Codex inference route ownership changed; reconnect before retrying");
	};
	const assertCurrent = () => {
		assertClient();
		params.signal?.throwIfAborted();
		params.assertCurrent();
	};
	assertCurrent();
	const snapshot = params.effectiveConfig ?? await readCodexEffectiveConfig(params.client, params.cwd, { signal: params.signal });
	assertCurrent();
	if (snapshot.config.model_provider != null && snapshot.config.model_provider !== "openai") return;
	if (isJsonObject(snapshot.config.features) && snapshot.config.features.respect_system_proxy === true) return;
	const configured = snapshot.config.openai_base_url;
	if (configured != null && typeof configured !== "string") throw new Error("Codex inference upstream configuration is invalid");
	if (configured) {
		let target;
		try {
			target = new URL(configured);
		} catch {
			return;
		}
		if (!NATIVE_OPENAI_UPSTREAMS.has(target.href.replace(/\/$/, ""))) return;
	}
	const origin = snapshot.origins?.openai_base_url;
	if (origin && !CODEX_SESSION_OVERRIDABLE_LAYER_TYPES.has(origin.name.type)) return;
	const account = await params.client.request("account/read", { refreshToken: false }, {
		signal: params.signal,
		assertCurrent
	});
	assertCurrent();
	const type = account.account?.type;
	if (type !== "apiKey" && type !== "chatgpt") return;
	if (owner.authRoute && owner.authRoute !== type) throw new Error("Codex native account route changed; reconnect before retrying");
	owner.authRoute = type;
	const target = new URL(configured || (type === "apiKey" ? "https://api.openai.com/v1" : "https://chatgpt.com/backend-api/codex"));
	const key = target.toString();
	let pending = owner.routes.get(key);
	if (!pending) {
		if (owner.routes.size >= MAX_ROUTES) throw new Error("Codex inference route limit reached");
		pending = import("./inference-proxy-b-aJMSxm.mjs").then(({ createCodexInferenceProxy }) => {
			assertClient();
			return createCodexInferenceProxy({
				upstream: target,
				assertCurrent: assertClient
			});
		});
		owner.routes.set(key, pending);
	}
	const route = await pending;
	assertCurrent();
	route.assertCurrent();
	params.client.protectPrivateTransportSecret(new URL(route.baseUrl).pathname.split("/")[1] ?? "");
	owner.handles.add(route);
	return route;
}
/** Prepare a managed thread without changing an attached or unsupported native profile. */
async function prepareCodexInferenceThreadConfig(params) {
	const { binding } = params;
	if (binding?.connectionScope === "supervision" || binding?.preserveNativeModel === true) return;
	const route = await prepareCodexInferenceRoute(params);
	if (!route) return;
	if (binding?.clientId === params.clientId && !getCodexInferenceThread(params.client, binding.threadId)) {
		const { thread } = await params.client.request("thread/read", {
			threadId: binding.threadId,
			includeTurns: false
		}, {
			signal: params.signal,
			assertCurrent: params.assertCurrent
		});
		params.assertCurrent();
		if (thread.id !== binding.threadId || thread.status?.type !== "notLoaded") throw new Error("Codex loaded thread has no owned inference route; reconnect before retrying");
	}
	if (params.config?.openai_base_url !== void 0 && params.config.openai_base_url !== route.upstream) throw new Error("Codex thread configuration conflicts with its trusted inference upstream");
	return {
		route,
		config: {
			...params.config,
			openai_base_url: route.baseUrl
		}
	};
}
/** Validate the exact private handle and unchanged upstream, not a localhost string exception. */
function assertCodexInferenceRouteConfig(client, route, config) {
	if (!route) return;
	const owner = owners.get(client);
	if (!owner || owner.closed || !owner.handles.has(route) || config?.openai_base_url !== route.baseUrl) throw new Error("Codex parent-local inference route was overridden; no turn was sent");
	route.assertCurrent();
}
function bindCodexInferenceThread(client, threadId, route) {
	const owner = owners.get(client);
	if (!owner && !route) return;
	if (!owner || owner.closed) throw new Error("Codex inference client is closed");
	if (!route) {
		owner.threads.delete(threadId);
		return;
	}
	route.assertCurrent();
	if (!owner.threads.has(threadId) && owner.threads.size >= MAX_THREADS) throw new Error("Codex inference thread limit reached; reconnect before retrying");
	owner.threads.set(threadId, route);
}
function getCodexInferenceThread(client, threadId) {
	const owner = owners.get(client);
	if (owner?.closed) throw new Error("Codex inference client is closed");
	return owner?.threads.get(threadId);
}
//#endregion
//#region extensions/codex/src/app-server/native-config-fence.ts
const CODEX_NATIVE_CONFIG_FENCE_STATE = Symbol.for("openclaw.codexNativeConfigFenceState");
function getFenceState() {
	const globalState = globalThis;
	globalState[CODEX_NATIVE_CONFIG_FENCE_STATE] ??= /* @__PURE__ */ new Map();
	return globalState[CODEX_NATIVE_CONFIG_FENCE_STATE];
}
/** Acquires the per-CODEX_HOME fence and returns an idempotent release. */
async function acquireCodexNativeConfigFence(key, options = {}) {
	const state = getFenceState();
	const previous = state.get(key) ?? Promise.resolve();
	let resolveCurrent = () => void 0;
	const current = new Promise((resolve) => {
		resolveCurrent = resolve;
	});
	state.set(key, current);
	try {
		await waitForPreviousFence(previous, options);
	} catch (error) {
		previous.then(() => {
			resolveCurrent();
			if (state.get(key) === current) state.delete(key);
		});
		throw error;
	}
	let released = false;
	return () => {
		if (released) return;
		released = true;
		resolveCurrent();
		if (state.get(key) === current) state.delete(key);
	};
}
async function waitForPreviousFence(previous, options) {
	if (options.signal?.aborted) throw new Error(options.abortMessage ?? "Codex native config fence aborted");
	if (options.timeoutMs === void 0 && !options.signal) {
		await previous;
		return;
	}
	await new Promise((resolve, reject) => {
		let timeout;
		const cleanup = () => {
			if (timeout) {
				clearTimeout(timeout);
				timeout = void 0;
			}
			options.signal?.removeEventListener("abort", onAbort);
		};
		const settle = (run) => {
			cleanup();
			run();
		};
		const onAbort = () => settle(() => reject(new Error(options.abortMessage ?? "Codex native config fence aborted")));
		previous.then(() => settle(resolve));
		if (options.signal) options.signal.addEventListener("abort", onAbort, { once: true });
		if (options.timeoutMs !== void 0) {
			timeout = setTimeout(() => settle(() => reject(new Error(options.timeoutMessage ?? "Codex native config fence timed out"))), Math.max(1, options.timeoutMs));
			timeout.unref?.();
		}
	});
}
//#endregion
//#region extensions/codex/src/app-server/native-hook-relay-state.ts
const pending = /* @__PURE__ */ new Set();
const closing = /* @__PURE__ */ new Set();
/** Owns delayed hook-relay cleanup across runtime scheduling and test teardown. */
const nativeHookRelayUnregisterQueue = {
	add(entry) {
		pending.add(entry);
	},
	delete(entry) {
		return pending.delete(entry);
	},
	track(operation) {
		closing.add(operation);
		operation.then(() => closing.delete(operation), () => closing.delete(operation));
	},
	async flush() {
		while (pending.size > 0) {
			const entry = pending.values().next().value;
			if (!entry) break;
			clearTimeout(entry.timeout);
			entry.unregister();
		}
		while (closing.size > 0) await Promise.allSettled(closing);
	},
	async clear() {
		for (const entry of pending) clearTimeout(entry.timeout);
		pending.clear();
		while (closing.size > 0) await Promise.allSettled(closing);
	}
};
//#endregion
//#region extensions/codex/src/app-server/spawn-identity.ts
/** Resolves non-secret spawn identity before startup; argv is represented only by its hash. */
function resolveCodexAppServerSpawnIdentity(startOptions, resolvedNativeCommand) {
	const nativeCommand = resolvedNativeCommand ?? (startOptions.commandSource === "resolved-managed" ? resolveManagedCodexNativeCommand(startOptions.command) : void 0);
	return {
		command: startOptions.command,
		argsFingerprint: createHash("sha256").update(JSON.stringify(startOptions.args)).digest("hex"),
		...startOptions.commandSource ? { commandSource: startOptions.commandSource } : {},
		...startOptions.managedCommandOrder ? { managedCommandOrder: startOptions.managedCommandOrder } : {},
		...nativeCommand ? { nativeCommand } : {}
	};
}
//#endregion
//#region extensions/codex/src/app-server/thread-lifecycle-errors.ts
var CodexThreadStartRequestError = class extends Error {
	constructor(cause) {
		super(`thread/start: ${formatErrorMessage(cause)}`, { cause });
		this.name = "CodexThreadStartRequestError";
	}
};
var CodexThreadClientReplacementError = class extends AgentHarnessPreflightError$1 {
	constructor() {
		super("Codex did not confirm unloading its previous configuration after a settled failure; a fresh client is required.");
		this.name = "CodexThreadClientReplacementError";
	}
};
var CodexThreadBindingConflictError = class extends Error {
	constructor(threadId, operation) {
		super(`Codex thread binding changed while ${operation}: ${threadId}`);
		this.name = "CodexThreadBindingConflictError";
	}
};
var CodexAdoptedThreadActiveError = class extends AgentHarnessPreflightError$1 {
	constructor(message = "Codex session became active in another runner; wait for it to finish before continuing") {
		super(message);
		this.name = "CodexAdoptedThreadActiveError";
	}
};
//#endregion
//#region extensions/codex/src/app-server/shared-client.ts
/**
* Owns shared and isolated Codex app-server client startup, auth application,
* lease tracking, and teardown.
*/
var shared_client_exports = /* @__PURE__ */ __exportAll({
	assertCodexAppServerClientStartSelectionCurrent: () => assertCodexAppServerClientStartSelectionCurrent,
	captureCodexAppServerClientLifetime: () => captureCodexAppServerClientLifetime,
	captureSharedCodexAppServerCatalogLifetime: () => captureSharedCodexAppServerCatalogLifetime,
	clearSharedCodexAppServerClientAndWait: () => clearSharedCodexAppServerClientAndWait,
	clearSharedCodexAppServerClientIfCurrent: () => clearSharedCodexAppServerClientIfCurrent,
	clearSharedCodexAppServerClientIfCurrentAndUnclaimed: () => clearSharedCodexAppServerClientIfCurrentAndUnclaimed,
	clearSharedCodexAppServerClientIfCurrentAndWait: () => clearSharedCodexAppServerClientIfCurrentAndWait,
	createIsolatedCodexAppServerClient: () => createIsolatedCodexAppServerClient,
	getLeasedSharedCodexAppServerClient: () => getLeasedSharedCodexAppServerClient,
	getSharedCodexAppServerClient: () => getSharedCodexAppServerClient,
	isCodexAppServerStartSelectionChangedError: () => isCodexAppServerStartSelectionChangedError,
	readCodexAppServerClientDesktopGeneration: () => readCodexAppServerClientDesktopGeneration,
	readCodexAppServerClientDesktopGenerationFingerprint: () => readCodexAppServerClientDesktopGenerationFingerprint,
	readCodexAppServerClientProcessIdentity: () => readCodexAppServerClientProcessIdentity,
	releaseCodexAppServerClientLease: () => releaseCodexAppServerClientLease,
	releaseLeasedSharedCodexAppServerClient: () => releaseLeasedSharedCodexAppServerClient,
	resolveCodexNativeConfigFenceKey: () => resolveCodexNativeConfigFenceKey,
	retainSharedCodexAppServerClientByInstanceId: () => retainSharedCodexAppServerClientByInstanceId,
	retainSharedCodexAppServerClientIfCurrent: () => retainSharedCodexAppServerClientIfCurrent,
	retireSharedCodexAppServerClientIfCurrent: () => retireSharedCodexAppServerClientIfCurrent,
	waitForCodexAppServerClientDesktopGenerationDrain: () => waitForCodexAppServerClientDesktopGenerationDrain,
	withLeasedCodexAppServerClientStartSelectionRetry: () => withLeasedCodexAppServerClientStartSelectionRetry
});
const SHARED_CODEX_APP_SERVER_CLIENT_DISPOSER = codexBuildSymbol("openclaw.codexAppServerClientDisposer");
const CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE = "codex app-server initialize timed out";
function ownCodexStartup(lifetime, operation) {
	lifetime.pending.add(operation);
	const release = () => lifetime.pending.delete(operation);
	operation.then(release, release);
	return operation;
}
async function prepareCodexAppServerClient(options) {
	const lifetime = getSharedCodexAppServerClientState().startup;
	const abandonSignal = options?.abandonSignal ? AbortSignal.any([lifetime.controller.signal, options.abandonSignal]) : lifetime.controller.signal;
	const assertCurrent = () => {
		if (abandonSignal.aborted) throw new CodexAppServerStartupError("aborted", "codex app-server initialize aborted");
	};
	assertCurrent();
	const startedAt = performance.now();
	return {
		context: await withCodexAppServerAcquireDeadline(options?.timeoutMs ?? 0, ownCodexStartup(lifetime, resolveCodexAppServerClientStartContext(options)), abandonSignal),
		lifetime,
		abandonSignal,
		startedAt,
		assertCurrent
	};
}
/** Reads the exact successful spawn selection plus its initialized runtime identity. */
function readCodexAppServerClientProcessIdentity(client) {
	const metadata = getSharedCodexAppServerClientState().startMetadata.get(client);
	if (!metadata) return;
	const runtimeIdentity = client.getRuntimeIdentity();
	return {
		clientId: client.getInstanceId(),
		...resolveCodexAppServerSpawnIdentity(metadata.startOptions, metadata.nativeCommand),
		...runtimeIdentity?.serverVersion ? { serverVersion: runtimeIdentity.serverVersion } : {},
		...runtimeIdentity?.userAgent ? { userAgent: runtimeIdentity.userAgent } : {}
	};
}
/** Returns the lifecycle fingerprint that owns a managed desktop client. */
function readCodexAppServerClientDesktopGenerationFingerprint(client) {
	return readCodexAppServerClientDesktopGeneration(client)?.fingerprint;
}
/** Returns the lifecycle generation that owns a managed desktop client. */
function readCodexAppServerClientDesktopGeneration(client) {
	return getSharedCodexAppServerClientState().startMetadata.get(client)?.desktopGeneration;
}
/** Waits until older physical desktop clients for this client's Codex home exit. */
async function waitForCodexAppServerClientDesktopGenerationDrain(params) {
	const metadata = getSharedCodexAppServerClientState().startMetadata.get(params.client);
	if (!metadata?.desktopGeneration) return;
	const drain = createOlderDesktopGenerationDrainWait({
		generation: metadata.desktopGeneration,
		startOptions: metadata.startOptions,
		agentDir: metadata.agentDir
	});
	try {
		await withCodexAppServerAcquireDeadline(params.timeoutMs ?? 0, drain.promise, params.signal, "Codex Computer Use install timed out waiting for older desktop clients");
	} finally {
		drain.cancel();
	}
}
var CodexAppServerStartSelectionChangedError = class extends Error {
	constructor() {
		super("Codex app-server managed executable selection changed during startup");
		this.code = "CODEX_APP_SERVER_START_SELECTION_CHANGED";
		this.name = "CodexAppServerStartSelectionChangedError";
	}
};
/** Cross-bundle-safe check for a managed executable selection retry. */
function isCodexAppServerStartSelectionChangedError(error) {
	return error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_START_SELECTION_CHANGED";
}
/**
* Rechecks mutable Codex-owned plugin state immediately before thread start/resume.
* The synchronous check prevents another gateway task from installing Computer
* Use between the check and the JSON-RPC write on the same event loop turn.
*/
function assertCodexAppServerClientStartSelectionCurrent(params) {
	const metadata = getSharedCodexAppServerClientState().startMetadata.get(params.client);
	if (!metadata) return;
	if (metadata.desktopGeneration && !isCodexDesktopGenerationCurrent(metadata.desktopGeneration)) throw new CodexAppServerStartSelectionChangedError();
	const requestedStartOptions = params.startOptions ?? metadata.requestedStartOptions;
	if (requestedStartOptions.commandSource !== "managed") return;
	const current = resolveCodexAppServerStartOptionsForAgent({
		startOptions: requestedStartOptions,
		agentDir: params.agentDir ?? metadata.agentDir
	});
	if ((metadata.startOptions.managedCommandOrder ?? "package-first") !== (current.managedCommandOrder ?? "package-first")) throw new CodexAppServerStartSelectionChangedError();
}
/** Resolves the per-CODEX_HOME key used to serialize native config loading. */
function resolveCodexNativeConfigFenceKey(params) {
	const metadata = params.client ? getSharedCodexAppServerClientState().startMetadata.get(params.client) : void 0;
	const startOptions = metadata?.startOptions ?? params.startOptions;
	if (!startOptions || startOptions.transport !== "stdio") return;
	const configuredHome = startOptions.codexHome ?? startOptions.env?.CODEX_HOME?.trim();
	const codexHome = configuredHome ? configuredHome : startOptions.homeScope === "user" ? resolveCodexAppServerUserHomeDir() : resolveCodexAppServerHomeDir(params.agentDir ?? metadata?.agentDir ?? resolveDefaultAgentDir(params.config ?? {}));
	return codexHome ? `codex-home:${path.resolve(codexHome)}` : void 0;
}
async function resolveCodexAppServerClientStartContext(options) {
	const requestedStartOptions = options?.startOptions ?? resolveCodexAppServerRuntimeOptions({ pluginConfig: options?.pluginConfig }).start;
	const agentDir = options?.agentDir ?? (requestedStartOptions.homeScope === "user" ? void 0 : resolveDefaultAgentDir(options?.config ?? {}));
	const desktopGeneration = shouldTrackDesktopGeneration(requestedStartOptions, options?.pluginConfig) ? await waitForCodexDesktopGeneration() : void 0;
	const preparedAuth = options?.preparedAuth;
	const preparedApiKey = preparedAuth?.kind === "api-key" ? preparedAuth.apiKey.trim() : void 0;
	if (preparedAuth && options?.authProfileId !== void 0) throw new Error("Prepared Codex auth cannot also select a legacy auth profile.");
	if (preparedAuth?.kind === "profile" && !preparedAuth.store.profiles[preparedAuth.profileId]) throw new CodexAppServerAuthProfileUnavailableError(formatCodexAuthProfileUnavailableMessage(preparedAuth.profileId));
	if (preparedAuth?.kind === "api-key" && !preparedApiKey) throw new Error("Prepared Codex API-key auth is missing its resolved key.");
	if (preparedAuth && requestedStartOptions.homeScope === "user") throw new Error("Prepared Codex auth requires an isolated app-server home.");
	const preparedAuthRequirement = preparedAuth && (preparedAuth.kind === "api-key" ? "api-key" : "subscription");
	if (options?.authRequirement && preparedAuthRequirement && options.authRequirement !== preparedAuthRequirement) throw new Error("Prepared Codex auth does not satisfy the requested auth requirement.");
	const authRequirement = options?.authRequirement ?? preparedAuthRequirement;
	const usesNativeAuth = !preparedAuth && (options?.authProfileId === null || requestedStartOptions.homeScope === "user");
	const requestedAuthProfileId = preparedAuth?.kind === "profile" ? preparedAuth.profileId : options?.authProfileId ?? void 0;
	const authProfileStore = preparedAuth?.kind === "profile" ? preparedAuth.store : !usesNativeAuth && preparedAuth?.kind !== "api-key" ? resolveCodexAppServerAuthProfileStore({
		agentDir,
		authProfileId: requestedAuthProfileId,
		authProfileStore: options?.authProfileStore,
		config: options?.config
	}) : options?.authProfileStore;
	const authProfileId = preparedAuth?.kind === "profile" ? preparedAuth.profileId : usesNativeAuth || preparedAuth?.kind === "api-key" ? void 0 : resolveCodexAppServerAuthProfileIdForAgent({
		authProfileId: requestedAuthProfileId,
		agentDir,
		config: options?.config,
		...authProfileStore ? { authProfileStore } : {}
	});
	const preparedAuthProfileSnapshot = !usesNativeAuth && authProfileId ? (preparedAuth?.kind === "profile" ? preparedAuth.snapshot : void 0) ?? await resolveCodexAppServerPreparedAuthProfileSnapshot({
		authProfileId,
		authProfileStore,
		agentDir,
		config: options?.config
	}) : void 0;
	if (preparedAuth?.kind === "profile" && !preparedAuthProfileSnapshot) throw new CodexAppServerAuthProfileUnavailableError(`Prepared Codex auth profile "${preparedAuth.profileId}" is unusable. Repair or replace the selected OpenAI profile, then retry.`);
	const resolvedPreparedAuth = preparedAuth?.kind === "api-key" ? {
		kind: "api-key",
		apiKey: preparedApiKey
	} : preparedAuthProfileSnapshot && authProfileId && authProfileStore ? {
		kind: "profile",
		profileId: authProfileId,
		store: authProfileStore,
		snapshot: preparedAuthProfileSnapshot
	} : void 0;
	const agentStartOptions = resolveCodexAppServerStartOptionsForAgent({
		startOptions: requestedStartOptions,
		agentDir
	});
	return {
		agentDir,
		usesNativeAuth,
		authProfileId,
		authProfileStore,
		requestedStartOptions,
		preparedAuth: resolvedPreparedAuth,
		authRequirement,
		startOptions: await bridgeCodexAppServerStartOptions({
			startOptions: await resolveManagedCodexAppServerStartOptions(agentStartOptions),
			agentId: options?.agentId,
			agentDir,
			authProfileId: usesNativeAuth || preparedAuth?.kind === "api-key" ? null : authProfileId,
			...preparedAuth && resolvedPreparedAuth ? { preparedAuth: resolvedPreparedAuth } : {},
			authRequirement,
			config: options?.config,
			pluginConfig: options?.pluginConfig,
			...authProfileStore ? { authProfileStore } : {}
		}),
		...options?.pluginConfig !== void 0 ? { pluginConfig: options.pluginConfig } : {},
		...desktopGeneration ? { desktopGeneration } : {}
	};
}
function shouldTrackDesktopGeneration(startOptions, pluginConfig) {
	if (startOptions.transport !== "stdio") return false;
	if (resolveCodexComputerUseConfig({ pluginConfig }).enabled && (startOptions.commandSource === "managed" || startOptions.commandSource === "resolved-managed")) return true;
	return startOptions.commandSource === "managed" && (startOptions.managedCommandOrder ?? "package-first") === "desktop-first";
}
/** Gets or starts a shared Codex app-server client without retaining a lease. */
function getSharedCodexAppServerClient(options) {
	return acquireSharedCodexAppServerClient(options);
}
/** Gets or starts a shared Codex app-server client and records a release lease. */
function getLeasedSharedCodexAppServerClient(options) {
	return acquireSharedCodexAppServerClient(options, true);
}
/** Releases one outstanding lease for a shared Codex app-server client. */
function releaseLeasedSharedCodexAppServerClient(client) {
	const entry = getSharedCodexAppServerClientState().entriesByClient.get(client);
	if (!entry || entry.anonymousLeases === 0) return false;
	entry.anonymousLeases -= 1;
	releaseSharedClientEntry(entry, "activeLeases");
	return true;
}
/** Releases the currently owned client exactly once. */
function releaseCodexAppServerClientLease(lease) {
	const client = lease.client;
	lease.client = void 0;
	return client ? releaseLeasedSharedCodexAppServerClient(client) : false;
}
/** Retries one config-loading operation with a shared deadline and current client lease. */
async function withLeasedCodexAppServerClientStartSelectionRetry(params) {
	let client = params.lease.client;
	if (!client) throw new Error("Codex app-server selection retry requires an active client lease");
	const timeoutMs = params.options?.timeoutMs ?? 6e4;
	const deadline = performance.now() + timeoutMs;
	const signal = params.signal ?? params.options?.abandonSignal;
	const requestOptions = () => {
		if (signal?.aborted) throw new CodexAppServerStartupError("aborted", "Codex app-server selection retry aborted");
		const remainingTimeoutMs = deadline - performance.now();
		if (remainingTimeoutMs <= 0) throw new CodexAppServerStartupError("timed_out", "Codex app-server selection retry timed out");
		return {
			timeoutMs: remainingTimeoutMs,
			...signal ? { signal } : {}
		};
	};
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const attemptClient = client;
		let scopeActive = true;
		const assertCurrent = () => {
			if (!scopeActive || params.lease.client !== attemptClient) throw new CodexAppServerStartupError("aborted", "Codex app-server request scope is closed");
		};
		try {
			requestOptions();
			return await params.run(client, () => {
				assertCurrent();
				return {
					...requestOptions(),
					assertCurrent
				};
			});
		} catch (error) {
			if (!isCodexAppServerStartSelectionChangedError(error) || attempt > 0) throw error;
			retireSharedCodexAppServerClientIfCurrent(client);
			params.lease.client = void 0;
			if (!releaseLeasedSharedCodexAppServerClient(client)) {
				client.close();
				throw new Error("Codex app-server selection retry requires a leased shared client", { cause: error });
			}
			const replacementOptions = requestOptions();
			client = await getLeasedSharedCodexAppServerClient({
				...params.options,
				timeoutMs: replacementOptions.timeoutMs,
				...signal ? { abandonSignal: signal } : {}
			});
			params.lease.client = client;
			params.onClientChange?.(client);
		} finally {
			scopeActive = false;
		}
	}
	throw new Error("Codex app-server selection retry loop exited unexpectedly");
}
async function acquireSharedCodexAppServerClient(options, leased = false) {
	const timeoutMs = options?.timeoutMs ?? 0;
	const state = getSharedCodexAppServerClientState();
	const { context, lifetime, abandonSignal, startedAt, assertCurrent } = await prepareCodexAppServerClient(options);
	assertCurrent();
	const { agentDir, usesNativeAuth, authProfileId, authProfileStore, preparedAuth, authRequirement, requestedStartOptions, startOptions, desktopGeneration, pluginConfig } = context;
	const remainingTimeoutMs = resolveRemainingAcquireTimeout(timeoutMs, startedAt);
	const authIdentityCacheKey = preparedAuth?.kind === "api-key" ? resolveCodexAppServerPreparedApiKeyCacheKey(preparedAuth.apiKey) : preparedAuth?.snapshot.secretFreeCacheKey ?? (authRequirement === "api-key" && !authProfileId ? resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions }) : void 0);
	const baseKey = `${codexAppServerStartOptionsKey(startOptions, {
		authProfileId,
		authBindingFingerprint: options?.authBindingFingerprint,
		agentDir: usesNativeAuth ? void 0 : agentDir,
		fallbackApiKeyCacheKey: authIdentityCacheKey
	})}\0auth-requirement:${authRequirement ?? "native"}${desktopGeneration ? `\0desktop-generation:${desktopGeneration.epoch}` : ""}`;
	const runtimeArtifactMode = options?.runtimeArtifactMode ?? (options?.expectedRuntimeArtifact ? "capture" : void 0);
	const expectedRuntimeArtifactKey = options?.expectedRuntimeArtifact ? createHash("sha256").update(options.expectedRuntimeArtifact.id).update("\0").update(options.expectedRuntimeArtifact.fingerprint).digest("hex") : "mint";
	const key = runtimeArtifactMode ? `${baseKey}\0runtime-artifact:capture-v1:${expectedRuntimeArtifactKey}` : baseKey;
	let entry = getOrCreateSharedClientEntry(state, key);
	const existingClient = entry.client;
	const existingGeneration = existingClient ? state.startMetadata.get(existingClient)?.desktopGeneration : void 0;
	if (existingClient && existingGeneration && !isCodexDesktopGenerationCurrent(existingGeneration)) {
		retireSharedCodexAppServerClientIfCurrent(existingClient);
		entry = getOrCreateSharedClientEntry(state, key);
	}
	entry.startupAbort ??= new AbortController();
	entry.closeWhenIdle = false;
	const releasePendingAcquire = retainSharedClientEntry(entry, "pendingAcquires");
	const startedCallback = options?.onStartedClient;
	if (startedCallback) {
		entry.onStartedClientCallbacks.add(startedCallback);
		if (entry.client) startedCallback(entry.client);
	}
	const stopStartedClientNotifications = () => {
		if (startedCallback) entry.onStartedClientCallbacks.delete(startedCallback);
	};
	let cleanupAbandonSignal;
	if (options?.abandonSignal) {
		const abandon = () => {
			stopStartedClientNotifications();
			releasePendingAcquire();
			retirePendingSharedClientEntryIfUnclaimed(entry);
		};
		options.abandonSignal.addEventListener("abort", abandon, { once: true });
		cleanupAbandonSignal = () => options.abandonSignal?.removeEventListener("abort", abandon);
		if (options.abandonSignal.aborted) abandon();
	}
	const startup = entry.startup ?? (entry.startup = createSharedCodexAppServerClientStartup({
		lifetime,
		entry,
		requestedStartOptions,
		startOptions,
		desktopGeneration,
		...pluginConfig !== void 0 ? { pluginConfig } : {},
		agentDir,
		authProfileId: usesNativeAuth || preparedAuth?.kind === "api-key" ? null : authProfileId,
		authProfileStore,
		preparedAuth,
		authRequirement,
		runtimeArtifactMode,
		...options?.expectedRuntimeArtifact ? { expectedRuntimeArtifact: options.expectedRuntimeArtifact } : {},
		abandonSignal: entry.startupAbort.signal,
		config: options?.config
	}));
	try {
		await withCodexAppServerAcquireDeadline(remainingTimeoutMs, startup.initialized, abandonSignal, CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE, () => buildCodexAppServerInitializeTimeoutError(entry.client));
		const client = await withCodexAppServerAcquireDeadline(timeoutMs, startup.ready, abandonSignal, "codex app-server authentication timed out");
		if (entry.closeError) throw entry.closeError;
		ensureCodexAppServerClientRuntime(client, {
			agentDir,
			authProfileId: usesNativeAuth ? void 0 : authProfileId,
			...authProfileStore ? { authProfileStore } : {},
			authMode: preparedAuth?.kind === "api-key" ? "prepared-api-key" : "profile",
			config: options?.config
		});
		if (leased) {
			entry.anonymousLeases += 1;
			entry.activeLeases += 1;
		}
		return client;
	} catch (error) {
		releasePendingAcquire();
		retirePendingSharedClientEntryIfUnclaimed(entry);
		throw error;
	} finally {
		cleanupAbandonSignal?.();
		stopStartedClientNotifications();
		releasePendingAcquire();
	}
}
async function withCodexAppServerAcquireDeadline(timeoutMs, promise, signal, timeoutMessage = CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE, timeoutErrorFactory) {
	if (signal?.aborted) throw new CodexAppServerStartupError("aborted", "codex app-server initialize aborted");
	const timed = withTimeout(promise, timeoutMs, timeoutMessage, () => timeoutErrorFactory?.() ?? new CodexAppServerStartupError("timed_out", timeoutMessage));
	if (!signal) return await timed;
	return await new Promise((resolve, reject) => {
		const onAbort = () => reject(new CodexAppServerStartupError("aborted", "codex app-server initialize aborted"));
		signal.addEventListener("abort", onAbort, { once: true });
		timed.then(resolve, reject).finally(() => signal.removeEventListener("abort", onAbort));
	});
}
function buildCodexAppServerInitializeTimeoutError(client) {
	const stderr = client?.getStderrDiagnostic();
	return new CodexAppServerStartupError("timed_out", stderr ? `${CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE}; stderr=${JSON.stringify(stderr)}` : CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE);
}
function resolveRemainingAcquireTimeout(timeoutMs, startedAt) {
	if (!(timeoutMs > 0)) return timeoutMs;
	const remaining = timeoutMs - (performance.now() - startedAt);
	if (remaining <= 0) throw new CodexAppServerStartupError("timed_out", "codex app-server initialize timed out");
	return remaining;
}
function createSharedCodexAppServerClientStartup(params) {
	const initialized = createDeferred();
	const ready = ownCodexStartup(params.lifetime, startInitializedCodexAppServerClient({
		...params,
		onStartedClient: (startedClient) => {
			const state = getSharedCodexAppServerClientState();
			if (params.entry.client) state.entriesByClient.delete(params.entry.client);
			params.entry.client = startedClient;
			state.entriesByClient.set(startedClient, params.entry);
			state.liveClients.add(startedClient);
			startedClient.addTransportExitHandler((exitedClient) => {
				state.liveClients.delete(exitedClient);
				notifyDesktopGenerationDrainChecks(state);
			});
			for (const callback of params.entry.onStartedClientCallbacks) callback(startedClient);
			retirePendingSharedClientEntryIfUnclaimed(params.entry);
		},
		onInitializedClient: () => initialized.resolve()
	}).then((client) => {
		const state = getSharedCodexAppServerClientState();
		params.entry.client = client;
		client.addCloseHandler((closedClient) => {
			const entry = getCurrentSharedClientEntry(closedClient);
			if (entry) state.clients.delete(entry.key);
		});
		return client;
	}, (error) => {
		initialized.reject(error);
		throw error;
	}));
	initialized.promise.catch(() => void 0);
	ready.catch(() => void 0);
	return {
		initialized: initialized.promise,
		ready
	};
}
/** Starts a caller-owned client; its assertion never binds ordinary shared-client leases. */
async function createIsolatedCodexAppServerClient(options) {
	options?.assertCurrent?.();
	const { context, lifetime, abandonSignal, startedAt, assertCurrent } = await prepareCodexAppServerClient(options);
	assertCurrent();
	const timeoutMs = options?.timeoutMs ?? 0;
	const { agentDir, usesNativeAuth, authProfileId, authProfileStore, preparedAuth, authRequirement, requestedStartOptions, startOptions, desktopGeneration, pluginConfig } = context;
	return await ownCodexStartup(lifetime, startInitializedCodexAppServerClient({
		lifetime,
		requestedStartOptions,
		startOptions,
		...desktopGeneration ? { desktopGeneration } : {},
		...pluginConfig !== void 0 ? { pluginConfig } : {},
		agentDir,
		authProfileId: usesNativeAuth || preparedAuth?.kind === "api-key" ? null : authProfileId,
		authProfileStore,
		preparedAuth,
		authRequirement,
		runtimeArtifactMode: options?.runtimeArtifactMode ?? (options?.expectedRuntimeArtifact ? "capture" : void 0),
		...options?.expectedRuntimeArtifact ? { expectedRuntimeArtifact: options.expectedRuntimeArtifact } : {},
		config: options?.config,
		timeoutMs: resolveRemainingAcquireTimeout(timeoutMs, startedAt),
		abandonSignal,
		assertCurrent: options?.assertCurrent,
		onStartedClient: (client) => {
			trackIsolatedCodexAppServerClient(client);
			options?.onStartedClient?.(client);
		}
	}));
}
function trackIsolatedCodexAppServerClient(client) {
	const state = getSharedCodexAppServerClientState();
	state.isolatedClients.add(client);
	client.addTransportExitHandler((exitedClient) => {
		state.isolatedClients.delete(exitedClient);
		notifyDesktopGenerationDrainChecks(state);
	});
}
async function startInitializedCodexAppServerClient(params) {
	const acquireStartedAt = performance.now();
	const timeoutMs = params.timeoutMs ?? 0;
	const abandonSignal = params.abandonSignal ? AbortSignal.any([params.lifetime.controller.signal, params.abandonSignal]) : params.lifetime.controller.signal;
	const waitForStartup = (operation, timeoutMessage = CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE, timeoutErrorFactory) => {
		if (abandonSignal.aborted) throw new CodexAppServerStartupError("aborted", "codex app-server initialize aborted");
		return withCodexAppServerAcquireDeadline(resolveRemainingAcquireTimeout(timeoutMs, acquireStartedAt), ownCodexStartup(params.lifetime, operation()), abandonSignal, timeoutMessage, timeoutErrorFactory);
	};
	const startOptionsCandidates = resolveManagedFallbackStartOptions(params.startOptions);
	for (const [index, startOptions] of startOptionsCandidates.entries()) {
		params.assertCurrent?.();
		const desktopGeneration = params.desktopGeneration ?? (isManagedCodexDesktopCommand(startOptions.command) ? await waitForStartup(waitForCodexDesktopGeneration) : void 0);
		const assertStartupCurrent = () => {
			params.assertCurrent?.();
			if (abandonSignal.aborted) throw new CodexAppServerStartupError("aborted", "codex app-server initialize aborted");
			if (desktopGeneration && !isCodexDesktopGenerationCurrent(desktopGeneration)) throw new CodexAppServerStartSelectionChangedError();
		};
		const computerUseConfig = resolveCodexComputerUseConfig({ pluginConfig: params.pluginConfig });
		const ownsIsolatedCodexHome = params.requestedStartOptions.homeScope !== "user" && !params.requestedStartOptions.env?.CODEX_HOME?.trim();
		const artifactDrain = desktopGeneration && ownsIsolatedCodexHome && computerUseConfig.enabled && (computerUseConfig.autoInstall || computerUseConfig.pluginCacheMode === "shared") ? createOlderDesktopGenerationDrainWait({
			generation: desktopGeneration,
			startOptions,
			agentDir: params.agentDir
		}) : void 0;
		try {
			if (artifactDrain) await waitForStartup(() => artifactDrain.promise);
			await reconcileCodexComputerUseStartArtifacts({
				startOptions,
				agentDir: params.agentDir,
				pluginConfig: params.pluginConfig,
				...desktopGeneration ? { desktopGeneration } : {},
				assertCurrent: assertStartupCurrent,
				ownsIsolatedCodexHome
			});
		} catch (error) {
			if (isCodexComputerUseCandidateArtifactsUnavailableError(error)) {
				if (index + 1 < startOptionsCandidates.length) continue;
				throw new AgentHarnessPreflightError("Codex Computer Use artifacts are unavailable from the installed desktop apps.", {
					cause: error,
					scope: "harness"
				});
			}
			throw error;
		} finally {
			artifactDrain?.cancel();
		}
		const runtimeArtifactModule = params.runtimeArtifactMode ? await import("./runtime-artifact-CLZ8udh-.mjs") : void 0;
		const runtimeArtifactBeforeStart = runtimeArtifactModule ? await runtimeArtifactModule.captureCodexAppServerRuntimeArtifactBeforeStart({
			startOptions,
			spawnIdentity: resolveCodexAppServerSpawnIdentity(startOptions),
			signal: abandonSignal
		}) : void 0;
		if (runtimeArtifactModule && runtimeArtifactBeforeStart && params.expectedRuntimeArtifact && !runtimeArtifactModule.validateCodexAppServerRuntimeArtifactCapture(params.expectedRuntimeArtifact, runtimeArtifactBeforeStart)) {
			if (index + 1 < startOptionsCandidates.length) continue;
			throw new Error("Codex app-server runtime artifact does not match verified inference");
		}
		assertStartupCurrent();
		let starting;
		let client;
		try {
			client = await waitForStartup(() => starting = CodexAppServerClient.start(startOptions, () => {
				assertStartupCurrent();
				resolveRemainingAcquireTimeout(timeoutMs, acquireStartedAt);
			}));
		} catch (error) {
			if (starting) ownCodexStartup(params.lifetime, starting.then((lateClient) => lateClient.closeAndWait(), () => {}));
			throw error;
		}
		let ready = false;
		try {
			const nativeCommandAtStart = startOptions.commandSource === "resolved-managed" ? resolveManagedCodexNativeCommand(startOptions.command) : void 0;
			getSharedCodexAppServerClientState().startMetadata.set(client, {
				requestedStartOptions: params.requestedStartOptions,
				startOptions,
				agentDir: params.agentDir,
				...nativeCommandAtStart ? { nativeCommand: nativeCommandAtStart } : {},
				...desktopGeneration ? { desktopGeneration } : {}
			});
			assertStartupCurrent();
			params.onStartedClient?.(client);
			try {
				await waitForStartup(() => client.initialize(), CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE, () => buildCodexAppServerInitializeTimeoutError(client));
			} catch (error) {
				if (shouldTryManagedFallbackStartOption(error, startOptions, index, startOptionsCandidates)) continue;
				throw error;
			}
			assertStartupCurrent();
			params.onInitializedClient?.();
			await waitForStartup(() => observeCodexCatalogClient(client, {
				startOptions: params.requestedStartOptions,
				agentDir: params.agentDir
			}));
			let runtimeArtifact;
			if (runtimeArtifactModule && runtimeArtifactBeforeStart) {
				runtimeArtifact = await runtimeArtifactModule.finalizeCodexAppServerRuntimeArtifact({
					before: runtimeArtifactBeforeStart,
					startOptions,
					spawnIdentity: resolveCodexAppServerSpawnIdentity(startOptions),
					runtimeIdentity: client.getRuntimeIdentity(),
					signal: abandonSignal
				});
				if (params.expectedRuntimeArtifact && (runtimeArtifact.id !== params.expectedRuntimeArtifact.id || runtimeArtifact.fingerprint !== params.expectedRuntimeArtifact.fingerprint)) throw new Error("Codex app-server runtime artifact does not match verified inference");
			}
			ensureCodexAppServerClientRuntime(client, {
				agentDir: params.agentDir,
				authProfileId: params.authProfileId ?? void 0,
				authMode: params.preparedAuth?.kind === "api-key" ? "prepared-api-key" : "profile",
				...params.authProfileStore ? { authProfileStore: params.authProfileStore } : {},
				config: params.config,
				onAuthRefreshFailure: () => retireSharedCodexAppServerClientIfCurrent(client)
			});
			assertStartupCurrent();
			const authHandoff = await waitForStartup(() => applyCodexAppServerAuthProfile({
				client,
				agentDir: params.agentDir,
				authProfileId: params.authProfileId,
				preparedAuth: params.preparedAuth,
				authRequirement: params.authRequirement,
				startOptions,
				config: params.config,
				assertCurrent: assertStartupCurrent,
				...params.authProfileStore ? { authProfileStore: params.authProfileStore } : {}
			}));
			if (startOptions.transport === "stdio" && nativeCommandAtStart && !desktopGeneration && !isManagedCodexDesktopCommand(startOptions.command) && !isCodexAppServerProxyLaunch(startOptions.args)) ownCodexInferenceClient(client);
			recordCodexAppServerAuthHandoff(client, authHandoff);
			if (runtimeArtifactModule && runtimeArtifact) runtimeArtifactModule.bindCodexAppServerRuntimeArtifact(client, runtimeArtifact);
			assertStartupCurrent();
			const fenceKey = resolveCodexNativeConfigFenceKey({ client });
			if (fenceKey) client.setThreadSessionRequestGuard(async (options) => {
				const release = await acquireCodexNativeConfigFence(fenceKey, options);
				try {
					assertCodexAppServerClientStartSelectionCurrent({ client });
					return release;
				} catch (error) {
					release();
					throw error;
				}
			}, () => Boolean(retireSharedCodexAppServerClientIfCurrent(client)));
			ready = true;
			return client;
		} finally {
			if (!ready) ownCodexStartup(params.lifetime, client.closeAndWait());
		}
	}
	throw new Error("Managed Codex app-server fallback candidates were exhausted.");
}
function isCodexComputerUseCandidateArtifactsUnavailableError(error) {
	return error !== null && typeof error === "object" && "code" in error && error.code === "CODEX_COMPUTER_USE_CANDIDATE_ARTIFACTS_UNAVAILABLE";
}
function resolveManagedFallbackStartOptions(startOptions) {
	const commands = [startOptions.command, ...startOptions.managedFallbackCommandPaths ?? []];
	const candidates = [];
	for (const [index, command] of commands.entries()) {
		const managedFallbackCommandPaths = commands.slice(index + 1);
		const candidate = {
			...startOptions,
			command
		};
		if (managedFallbackCommandPaths.length === 0) delete candidate.managedFallbackCommandPaths;
		else candidate.managedFallbackCommandPaths = managedFallbackCommandPaths;
		candidates.push(candidate);
	}
	return candidates;
}
function shouldTryManagedFallbackStartOption(error, startOptions, index, startOptionsCandidates) {
	return startOptions.commandSource === "resolved-managed" && index < startOptionsCandidates.length - 1 && isUnsupportedCodexAppServerVersionError(error);
}
/** Clears and closes the shared entry only if it still owns the supplied client. */
function clearSharedCodexAppServerClientIfCurrent(client) {
	if (!client) return false;
	const state = getSharedCodexAppServerClientState();
	const entry = getCurrentSharedClientEntry(client);
	if (!entry) return false;
	state.clients.delete(entry.key);
	client.close();
	return true;
}
/** Captures a revocable observation of the exact shared client and native account/config. */
function captureSharedCodexAppServerCatalogLifetime(client) {
	const isCurrent = captureSharedClientRegistration(client);
	const revision = client.getModelCatalogRevision();
	return () => isCurrent() && client.getModelCatalogRevision() === revision;
}
/** Registration ends on retirement even when sibling leases keep the process alive. */
function captureSharedClientRegistration(client) {
	const state = getSharedCodexAppServerClientState();
	const entry = getCurrentSharedClientEntry(client);
	const generation = readCodexAppServerClientDesktopGeneration(client);
	return () => entry !== void 0 && state.clients.get(entry.key) === entry && entry.client === client && !entry.closeWhenIdle && !entry.closeError && !client.getCloseError() && (!generation || isCodexDesktopGenerationCurrent(generation));
}
/** Retains the matching shared client and returns a release callback. */
function retainSharedCodexAppServerClientIfCurrent(client) {
	const entry = getCurrentSharedClientEntry(client);
	return entry ? retainSharedClientEntry(entry) : void 0;
}
/** Retains the live shared client whose initialized instance id matches a thread binding. */
function retainSharedCodexAppServerClientByInstanceId(clientId) {
	const normalizedClientId = clientId?.trim();
	if (!normalizedClientId) return;
	for (const entry of getSharedCodexAppServerClientState().clients.values()) {
		const client = entry.client;
		if (client?.getInstanceId() !== normalizedClientId || entry.closeWhenIdle || entry.closeError) continue;
		return {
			client,
			release: retainSharedClientEntry(entry)
		};
	}
}
/** Captures physical ownership, independently of unrelated thread and reader leases. */
function captureCodexAppServerClientLifetime(client, requiredOwnership) {
	const state = getSharedCodexAppServerClientState();
	const start = state.startMetadata.get(client)?.startOptions;
	if (requiredOwnership === "native-process" && (start?.transport !== "stdio" || isCodexAppServerProxyLaunch(start.args))) throw new AgentHarnessPreflightError("Codex manual thread adoption requires an OpenClaw-managed local stdio process, not an external socket or app-server proxy. No turn was sent; reconnect through managed local stdio before continuing.");
	const isCurrent = requiredOwnership !== "connection" && state.isolatedClients.has(client) ? () => state.isolatedClients.has(client) && !client.getCloseError() : captureSharedClientRegistration(client);
	const assertCurrent = () => {
		if (!isCurrent()) throw new CodexAdoptedThreadActiveError("Codex app-server connection changed during thread preparation; reconnect before continuing");
		assertCodexAppServerClientStartSelectionCurrent({ client });
	};
	assertCurrent();
	return assertCurrent;
}
function createOlderDesktopGenerationDrainWait(params) {
	const targetHome = resolveCodexNativeConfigFenceKey({
		startOptions: params.startOptions,
		agentDir: params.agentDir
	});
	if (!targetHome) return {
		promise: Promise.resolve(),
		cancel: () => void 0
	};
	const state = getSharedCodexAppServerClientState();
	let settled = false;
	let resolveWait;
	const promise = new Promise((resolve) => {
		resolveWait = resolve;
	});
	const cancel = () => {
		if (settled) return;
		settled = true;
		state.desktopGenerationDrainChecks.delete(check);
		resolveWait();
	};
	const check = () => {
		if (!hasLiveOlderDesktopGenerationClient({
			state,
			generation: params.generation,
			targetHome
		})) cancel();
	};
	state.desktopGenerationDrainChecks.add(check);
	check();
	return {
		promise,
		cancel
	};
}
function hasLiveOlderDesktopGenerationClient(params) {
	for (const client of params.state.liveClients) if (isOlderDesktopGenerationClientForHome(client, params.generation, params.targetHome)) return true;
	for (const client of params.state.isolatedClients) if (isOlderDesktopGenerationClientForHome(client, params.generation, params.targetHome)) return true;
	return false;
}
function isOlderDesktopGenerationClientForHome(client, generation, targetHome) {
	const metadata = getSharedCodexAppServerClientState().startMetadata.get(client);
	return Boolean(metadata?.desktopGeneration && metadata.desktopGeneration.epoch < generation.epoch && resolveCodexNativeConfigFenceKey({ client }) === targetHome);
}
function notifyDesktopGenerationDrainChecks(state) {
	for (const check of state.desktopGenerationDrainChecks) check();
}
/** Clears a matching shared client and waits for its process to exit. */
async function clearSharedCodexAppServerClientIfCurrentAndWait(client, options) {
	if (!client) return false;
	const state = getSharedCodexAppServerClientState();
	const entry = getCurrentSharedClientEntry(client);
	if (!entry) return false;
	state.clients.delete(entry.key);
	await client.closeAndWait(options);
	return true;
}
/** Clears all shared clients and waits for their processes to exit. */
async function clearSharedCodexAppServerClientAndWait(options) {
	const state = getSharedCodexAppServerClientState();
	const lifetime = state.startup;
	lifetime.controller.abort();
	state.clients.clear();
	const closing = Promise.all([...state.liveClients].map((client) => ownCodexStartup(lifetime, client.closeAndWait(options))));
	closing.catch(() => void 0);
	try {
		while (lifetime.pending.size > 0) await Promise.allSettled(lifetime.pending);
		await closing;
		await nativeHookRelayUnregisterQueue.flush();
	} finally {
		if (state.startup === lifetime) state.startup = createCodexAppServerStartupLifetime();
	}
}
globalThis[SHARED_CODEX_APP_SERVER_CLIENT_DISPOSER] = clearSharedCodexAppServerClientAndWait;
function getOrCreateSharedClientEntry(state, key) {
	let entry = state.clients.get(key);
	if (!entry) {
		entry = {
			key,
			activeLeases: 0,
			anonymousLeases: 0,
			pendingAcquires: 0,
			closeWhenIdle: false,
			onStartedClientCallbacks: /* @__PURE__ */ new Set()
		};
		state.clients.set(key, entry);
	}
	return entry;
}
/** Clears a matching shared client only when no lease or acquire currently claims it. */
function clearSharedCodexAppServerClientIfCurrentAndUnclaimed(client) {
	const entry = getCurrentSharedClientEntry(client);
	return {
		found: entry !== void 0,
		closed: entry ? closeSharedClientEntryIfUnclaimed(entry) : false,
		activeLeases: entry?.activeLeases ?? 0,
		pendingAcquires: entry?.pendingAcquires ?? 0
	};
}
function retainSharedClientEntry(entry, counter = "activeLeases") {
	let released = false;
	entry[counter] += 1;
	return () => {
		if (released) return;
		released = true;
		releaseSharedClientEntry(entry, counter);
	};
}
function releaseSharedClientEntry(entry, counter) {
	entry[counter] -= 1;
	closeRetiredSharedClientEntryIfIdle(entry);
	notifyDesktopGenerationDrainChecks(getSharedCodexAppServerClientState());
}
function closeSharedClientEntryIfUnclaimed(entry) {
	if (entry.activeLeases > 0 || entry.pendingAcquires > 0) return false;
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(entry.key) !== entry) return false;
	state.clients.delete(entry.key);
	entry.client?.close();
	return Boolean(entry.client);
}
function retirePendingSharedClientEntryIfUnclaimed(entry) {
	if (entry.activeLeases > 0 || entry.pendingAcquires > 0) return;
	entry.startupAbort?.abort(/* @__PURE__ */ new Error("Codex app-server startup was abandoned"));
	entry.closeWhenIdle = true;
	const state = getSharedCodexAppServerClientState();
	if (state.clients.get(entry.key) === entry) state.clients.delete(entry.key);
	if (!entry.client) return;
	closeRetiredSharedClientEntry(entry);
}
//#endregion
export { assertNotSymlink as $, getCodexInferenceThread as A, prepareCodexWorkspaceReferences as B, CodexThreadBindingConflictError as C, acquireCodexNativeConfigFence as D, nativeHookRelayUnregisterQueue as E, forgetCodexWorkspaceReferences as F, unsubscribeCodexAppServerLiveThread as G, readCodexClientSessionMeta as H, hasCodexAppServerLiveThread as I, rememberCodexRateLimitsRead as J, readCodexRateLimitsRevision as K, hasCodexAppServerSiblingThreadWork as L, claimCodexAppServerLiveThread as M, consumeCodexAppServerLiveThread as N, assertCodexInferenceRouteConfig as O, ensureCodexAppServerClientRuntime as P, resolveCodexManagedBundledMarketplacePath as Q, isCodexAppServerClientRuntimeLive as R, CodexAdoptedThreadActiveError as S, CodexThreadStartRequestError as T, releaseCodexAppServerLiveThread as U, protectCodexAppServerLiveThread as V, retainCodexAppServerLiveThread as W, resolveCodexAppServerAuthAccountCacheKey as X, reconcileCodexComputerUseStartArtifacts as Y, resolveCodexAppServerPreparedAuthHandoff as Z, retainSharedCodexAppServerClientByInstanceId as _, clearSharedCodexAppServerClientIfCurrentAndUnclaimed as a, resolveCodexStartupTimeoutMs as at, waitForCodexAppServerClientDesktopGenerationDrain as b, getLeasedSharedCodexAppServerClient as c, readCodexAppServerClientDesktopGeneration as d, CodexAppServerStartupError as et, readCodexAppServerClientDesktopGenerationFingerprint as f, resolveCodexNativeConfigFenceKey as g, releaseLeasedSharedCodexAppServerClient as h, clearSharedCodexAppServerClientIfCurrent as i, resolveCodexGatewayTimeoutWithGraceMs as it, prepareCodexInferenceThreadConfig as j, bindCodexInferenceThread as k, getSharedCodexAppServerClient as l, releaseCodexAppServerClientLease as m, captureCodexAppServerClientLifetime as n, TURN_TERMINAL_SETTLEMENT_TIMEOUT_MS as nt, clearSharedCodexAppServerClientIfCurrentAndWait as o, withCodexStartupTimeout as ot, readCodexAppServerClientProcessIdentity as p, readRecentCodexRateLimits as q, captureSharedCodexAppServerCatalogLifetime as r, isCodexAppServerStartupError as rt, createIsolatedCodexAppServerClient as s, assertCodexAppServerClientStartSelectionCurrent as t, TURN_FINALIZE_DRAIN_ABORT_GRACE_MS as tt, isCodexAppServerStartSelectionChangedError as u, retainSharedCodexAppServerClientIfCurrent as v, CodexThreadClientReplacementError as w, withLeasedCodexAppServerClientStartSelectionRetry as x, shared_client_exports as y, isCodexAppServerLiveThreadClaimed as z };
