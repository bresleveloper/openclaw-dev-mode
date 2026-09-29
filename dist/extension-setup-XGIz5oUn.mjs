import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { E as resolveStateDir, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { n as replaceFileAtomic } from "./replace-file-DJtj9VLX.mjs";
import { a as inspectPathPermissions } from "./permissions-DOmAO-Zd.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import "./state-paths-Bk2vDLZh.mjs";
import { a as resolveFirstExtensionProfileName, i as resolveBrowserConfig, s as resolveProfile } from "./config-fMVye_Fl.mjs";
import { r as isValidProfileName } from "./profiles-CQrkMz7M.mjs";
import { t as readPrivateNativeHostFile } from "./extension-native-host-file-B8Lb2IZe.mjs";
import { n as BROWSER_NATIVE_HOST_NAME, t as BROWSER_NATIVE_HOST_DESCRIPTION } from "./extension-native-host.constants-CchS6g7H.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import crypto from "node:crypto";
//#region extensions/browser/src/browser/extension-install-context.ts
function resolveInstallStateDir(deps) {
	return path.resolve(deps.stateDir ?? resolveStateDir(deps.env));
}
function resolveInstallConfigPath(deps) {
	const env = deps.env ?? process.env;
	const explicit = env.OPENCLAW_CONFIG_PATH?.trim();
	return explicit ? resolveStateDir({
		...env,
		OPENCLAW_STATE_DIR: explicit
	}) : void 0;
}
var NativeHostSetupContextError = class extends Error {};
function assertExpectedNativeHostProfile(registration, expectedRegistrations) {
	if (!expectedRegistrations) return;
	const expected = expectedRegistrations.find((entry) => entry.manifestPath === registration.manifestPath);
	if (!expected || registration.state !== expected.state || registration.browserProfile !== expected.browserProfile) throw new NativeHostSetupContextError("Chrome's native host browser selection changed during setup. Inspect setup again before retrying.");
}
function assertCurrentNativeHostLaunchContext(registration, deps) {
	if (registration.state !== "owned") return;
	const saved = registration.launchContext;
	const current = {
		stateDir: resolveInstallStateDir(deps),
		configPath: resolveInstallConfigPath(deps)
	};
	const configPath = (context) => resolveConfigPath({
		...deps.env ?? process.env,
		OPENCLAW_STATE_DIR: context.stateDir,
		OPENCLAW_CONFIG_PATH: context.configPath
	}, context.stateDir);
	if (!saved || path.resolve(saved.stateDir) !== current.stateDir || configPath(saved) !== configPath(current)) throw new NativeHostSetupContextError("Chrome's native host uses a different OpenClaw configuration. Rerun setup with its matching OPENCLAW_STATE_DIR and OPENCLAW_CONFIG_PATH.");
}
//#endregion
//#region extensions/browser/src/browser/extension-install-layout.ts
const EXTENSION_ID_PATTERN = /^[a-p]{32}$/;
const UNPACKED_MANIFEST_LOCATION = 4;
const OWNED_COPY_MARKER = ".openclaw-owned.json";
const PREFERENCES_MAX_BYTES = 33554432;
async function approvedInstallRealpaths(installed, bundled) {
	const installedPath = await fs$1.realpath(installed);
	const bundledPath = await fs$1.realpath(bundled);
	await assertOwnedPath(installedPath, "directory");
	await assertOwnedPath(bundledPath, "directory", { allowRootOwner: true });
	return [.../* @__PURE__ */ new Set([installedPath, bundledPath])];
}
/** Chromium crx_file::id_util::GenerateIdForPath for a canonical absolute path. */
function generateChromeExtensionIdForPath(canonicalPath, platform = process.platform) {
	if (!(platform === "win32" ? path.win32.isAbsolute(canonicalPath) : path.isAbsolute(canonicalPath))) throw new Error("Chrome extension ID paths must be canonical absolute paths");
	let nativePath = canonicalPath;
	if (platform === "win32" && /^[a-z]:/u.test(nativePath)) nativePath = `${nativePath[0]?.toUpperCase()}${nativePath.slice(1)}`;
	const bytes = Buffer.from(nativePath, platform === "win32" ? "utf16le" : "utf8");
	return crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 32).replace(/[0-9a-f]/gu, (nibble) => String.fromCharCode("a".charCodeAt(0) + Number.parseInt(nibble, 16)));
}
function homeDirectory(deps) {
	const value = deps.homeDir ?? deps.env?.HOME ?? deps.env?.USERPROFILE ?? os.homedir();
	if (!value.trim()) throw new Error("Could not resolve the user home directory.");
	return path.resolve(value);
}
/** Chromium-derived default user-data and user native-host roots. */
function chromeProductRoots(deps = {}) {
	const platform = deps.platform ?? process.platform;
	const env = deps.env ?? process.env;
	const home = homeDirectory({
		...deps,
		env
	});
	if (platform === "darwin") {
		const appSupport = path.join(home, "Library", "Application Support");
		const testingData = path.join(appSupport, "Google", "Chrome for Testing");
		return [
			{
				product: "chrome",
				label: "Google Chrome",
				userDataDir: path.join(appSupport, "Google", "Chrome"),
				nativeManifestDir: path.join(appSupport, "Google", "Chrome", "NativeMessagingHosts")
			},
			{
				product: "chrome-for-testing",
				label: "Google Chrome for Testing",
				userDataDir: testingData,
				nativeManifestDir: path.join(testingData, "NativeMessagingHosts")
			},
			{
				product: "chrome-for-testing",
				label: "Google Chrome for Testing (documented host root)",
				userDataDir: testingData,
				nativeManifestDir: path.join(appSupport, "Google", "ChromeForTesting", "NativeMessagingHosts")
			},
			{
				product: "chromium",
				label: "Chromium",
				userDataDir: path.join(appSupport, "Chromium"),
				nativeManifestDir: path.join(appSupport, "Chromium", "NativeMessagingHosts")
			}
		];
	}
	if (platform === "linux") {
		const configHome = path.resolve(env.CHROME_CONFIG_HOME?.trim() || env.XDG_CONFIG_HOME?.trim() || path.join(home, ".config"));
		return [
			[
				"chrome",
				"Google Chrome",
				"google-chrome"
			],
			[
				"chrome-for-testing",
				"Google Chrome for Testing",
				"google-chrome-for-testing"
			],
			[
				"chromium",
				"Chromium",
				"chromium"
			]
		].map(([product, label, basename]) => ({
			product,
			label,
			userDataDir: path.join(configHome, basename),
			nativeManifestDir: path.join(configHome, basename, "NativeMessagingHosts")
		}));
	}
	if (platform === "win32") {
		const localAppData = env.LOCALAPPDATA?.trim();
		if (!localAppData) return [];
		return [
			[
				"chrome",
				"Google Chrome",
				path.join("Google", "Chrome", "User Data")
			],
			[
				"chrome-for-testing",
				"Google Chrome for Testing",
				path.join("Google", "Chrome for Testing", "User Data")
			],
			[
				"chromium",
				"Chromium",
				path.join("Chromium", "User Data")
			]
		].map(([product, label, suffix]) => ({
			product,
			label,
			userDataDir: path.join(localAppData, suffix),
			nativeManifestDir: ""
		}));
	}
	return [];
}
function stableChromeExtensionDir(deps = {}) {
	return path.join(path.resolve(deps.stateDir ?? resolveStateDir(deps.env)), "browser", "chrome-extension");
}
async function pathInfo(target) {
	try {
		return await fs$1.lstat(target);
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
async function assertOwnedPath(target, kind, policy = {}) {
	const info = await fs$1.lstat(target);
	if (info.isSymbolicLink() || (kind === "file" ? !info.isFile() : !info.isDirectory())) throw new Error(`Unsafe ${kind} at ${target}`);
	if (process.platform === "win32") {
		const permissions = await inspectPathPermissions(target);
		if (!permissions.ok || permissions.source !== "windows-acl" || permissions.ownerTrusted !== true || permissions.groupWritable || permissions.worldWritable) throw new Error(`Refusing unsafe Windows owner or ACL at ${target}`);
	} else {
		const uid = process.getuid?.();
		if (!(uid === void 0 || info.uid === uid || policy.allowRootOwner === true && info.uid === 0)) throw new Error(`Refusing foreign owner at ${target}`);
		if ((info.mode & 18) !== 0) throw new Error(`Refusing group/world-writable path at ${target}`);
	}
	const canonical = await fs$1.realpath(target);
	const expected = path.resolve(target);
	if (process.platform === "win32" ? canonical.toLowerCase() !== expected.toLowerCase() : canonical !== expected) throw new Error(`Refusing non-canonical path at ${target}`);
}
async function ensurePrivateDirectory(target) {
	await fs$1.mkdir(target, {
		recursive: true,
		mode: 448
	});
	await assertOwnedPath(target, "directory");
	if (process.platform !== "win32") await fs$1.chmod(target, 448);
}
async function inspectInstalledCopy(target) {
	if (!await pathInfo(target)) return {
		present: false,
		owned: false
	};
	await assertOwnedPath(target, "directory");
	const markerPath = path.join(target, OWNED_COPY_MARKER);
	try {
		await assertOwnedPath(markerPath, "file");
		const marker = JSON.parse(await fs$1.readFile(markerPath, "utf8"));
		return {
			present: true,
			owned: Boolean(marker) && typeof marker === "object" && !Array.isArray(marker) && marker.v === 1
		};
	} catch {
		return {
			present: true,
			owned: false
		};
	}
}
async function copyRuntimeTree(source, target) {
	await ensurePrivateDirectory(target);
	for (const entry of await fs$1.readdir(source, { withFileTypes: true })) {
		if (/(?:sidepanel|copilot|page-share)/iu.test(entry.name) || entry.name.endsWith(".test.ts") || entry.name.endsWith(".test-support.ts") || entry.name.endsWith(".test-harness.ts") || entry.name.endsWith(".d.ts")) continue;
		const sourcePath = path.join(source, entry.name);
		const targetPath = path.join(target, entry.name);
		if (entry.isSymbolicLink()) throw new Error(`Refusing symlink in bundled Chrome extension: ${sourcePath}`);
		if (entry.isDirectory()) await copyRuntimeTree(sourcePath, targetPath);
		else if (entry.isFile()) {
			await fs$1.copyFile(sourcePath, targetPath, constants.COPYFILE_EXCL);
			if (process.platform !== "win32") await fs$1.chmod(targetPath, 384);
		}
	}
}
/** Copy/update the bundled extension with rollback-safe same-directory renames. */
async function installStableChromeExtension(bundledDir, deps = {}) {
	const source = await fs$1.realpath(path.resolve(bundledDir));
	await assertOwnedPath(source, "directory", { allowRootOwner: true });
	const target = stableChromeExtensionDir(deps);
	await ensurePrivateDirectory(path.resolve(deps.stateDir ?? resolveStateDir(deps.env)));
	await ensurePrivateDirectory(path.dirname(target));
	const existing = await inspectInstalledCopy(target);
	if (existing.present && !existing.owned) throw new Error(`Refusing to overwrite foreign Chrome extension directory: ${target}`);
	const suffix = `${process.pid}-${crypto.randomBytes(6).toString("hex")}`;
	const temporary = `${target}.tmp-${suffix}`;
	const previous = `${target}.previous-${suffix}`;
	try {
		await copyRuntimeTree(source, temporary);
		await fs$1.writeFile(path.join(temporary, OWNED_COPY_MARKER), `${JSON.stringify({
			v: 1,
			owner: "openclaw"
		})}\n`, {
			mode: 384,
			flag: "wx"
		});
		if (existing.present) await fs$1.rename(target, previous);
		try {
			await fs$1.rename(temporary, target);
		} catch (error) {
			if (existing.present) await fs$1.rename(previous, target).catch(() => void 0);
			throw error;
		}
		if (existing.present) await fs$1.rm(previous, {
			recursive: true,
			force: true
		});
		return await fs$1.realpath(target);
	} finally {
		await fs$1.rm(temporary, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
}
function comparablePath(value, platform) {
	const resolved = path.resolve(value);
	return platform === "win32" ? resolved.toLowerCase() : resolved;
}
async function approvedRealpaths(paths) {
	const resolved = await Promise.all(paths.map(async (candidate) => await fs$1.realpath(candidate).catch(() => null)));
	return [...new Set(resolved.filter((value) => value !== null))];
}
/** Discover exact Store identity separately from approved unpacked path records. */
async function discoverChromeExtensionIds(params) {
	const deps = params.deps ?? {};
	const platform = deps.platform ?? process.platform;
	const approved = new Set((await approvedRealpaths(params.approvedDirs)).map((value) => comparablePath(value, platform)));
	const discovered = [];
	const storeDiscovered = [];
	const issues = [];
	const identityMismatches = [];
	for (const root of chromeProductRoots(deps)) {
		if (!await pathInfo(root.userDataDir)) continue;
		try {
			await assertOwnedPath(root.userDataDir, "directory");
		} catch (error) {
			issues.push(`${root.label}: ${error instanceof Error ? error.message : String(error)}`);
			continue;
		}
		let profiles;
		try {
			profiles = await fs$1.readdir(root.userDataDir, { withFileTypes: true });
		} catch (error) {
			issues.push(`${root.label}: could not list profiles (${String(error)})`);
			continue;
		}
		for (const profileEntry of profiles) {
			if (!profileEntry.isDirectory() || profileEntry.isSymbolicLink()) continue;
			const profileDir = path.join(root.userDataDir, profileEntry.name);
			for (const filename of ["Preferences", "Secure Preferences"]) {
				const preferencesPath = path.join(profileDir, filename);
				const preferencesInfo = await pathInfo(preferencesPath);
				if (!preferencesInfo) continue;
				try {
					await assertOwnedPath(profileDir, "directory");
					await assertOwnedPath(preferencesPath, "file");
					if (preferencesInfo.size > PREFERENCES_MAX_BYTES) throw new Error(`${filename} exceeds the 32 MiB inspection limit`);
					const settings = JSON.parse(await fs$1.readFile(preferencesPath, "utf8"))?.extensions?.settings;
					if (!settings || typeof settings !== "object" || Array.isArray(settings)) continue;
					for (const [extensionId, rawEntry] of Object.entries(settings)) {
						if (!EXTENSION_ID_PATTERN.test(extensionId) || !rawEntry || typeof rawEntry !== "object") continue;
						const entry = rawEntry;
						if (extensionId === params.storeExtensionId && entry.from_webstore === true && entry.location !== UNPACKED_MANIFEST_LOCATION) {
							const reasons = entry.disable_reasons;
							const enabled = (entry.state === void 0 || entry.state === 1) && (reasons === void 0 || reasons === 0 || Array.isArray(reasons) && reasons.length === 0);
							const awaitingApproval = Array.isArray(reasons) ? reasons.includes(8192) : typeof reasons === "number" && (reasons & 8192) !== 0;
							storeDiscovered.push({
								product: root.product,
								browser: root.label,
								userDataDir: root.userDataDir,
								profile: profileEntry.name,
								securePreferencesPath: preferencesPath,
								extensionId,
								enabled,
								awaitingApproval
							});
							continue;
						}
						if (entry.location !== UNPACKED_MANIFEST_LOCATION || typeof entry.path !== "string") continue;
						const recordedPath = path.isAbsolute(entry.path) ? entry.path : path.join(profileDir, "Extensions", entry.path);
						const canonicalPath = await fs$1.realpath(recordedPath).catch(() => null);
						if (!canonicalPath || !approved.has(comparablePath(canonicalPath, platform))) continue;
						const predictedId = generateChromeExtensionIdForPath(canonicalPath, platform);
						if (extensionId !== predictedId) {
							const issue = `${root.label} profile ${profileEntry.name}: unpacked extension ID ${extensionId} does not match predicted ID ${predictedId} for ${canonicalPath}`;
							issues.push(issue);
							identityMismatches.push(issue);
							continue;
						}
						discovered.push({
							product: root.product,
							browser: root.label,
							userDataDir: root.userDataDir,
							profile: profileEntry.name,
							securePreferencesPath: preferencesPath,
							extensionId,
							extensionPath: canonicalPath
						});
					}
				} catch (error) {
					issues.push(`${root.label} profile ${profileEntry.name} (${filename}): ${error instanceof Error ? error.message : String(error)}`);
				}
			}
		}
	}
	const unique = new Map(discovered.map((entry) => [`${entry.product}\0${entry.profile}\0${entry.extensionId}\0${entry.extensionPath}`, entry]));
	const uniqueStore = new Map(storeDiscovered.map((entry) => [`${entry.product}\0${entry.profile}\0${entry.extensionId}`, entry]));
	return {
		discovered: [...unique.values()].toSorted((a, b) => `${a.product}/${a.profile}/${a.extensionId}`.localeCompare(`${b.product}/${b.profile}/${b.extensionId}`)),
		storeDiscovered: [...uniqueStore.values()].toSorted((a, b) => `${a.product}/${a.profile}/${a.extensionId}`.localeCompare(`${b.product}/${b.profile}/${b.extensionId}`)),
		issues,
		identityMismatches
	};
}
//#endregion
//#region extensions/browser/src/browser/extension-install-external.ts
const FOUNDATION_CHROME_WEB_STORE_EXTENSION_ID = "kcdjddhmeafeomebliikmbpblkmkfoig";
const FOUNDATION_CHROME_WEB_STORE_URL = `https://chromewebstore.google.com/detail/openclaw/${FOUNDATION_CHROME_WEB_STORE_EXTENSION_ID}`;
const OWNED_REQUEST = {
	external_update_url: "https://clients2.google.com/service/update2/crx",
	openclawOwnership: "browser-store-install-v1"
};
function requestPath(root) {
	return path.join(root.userDataDir, "External Extensions", `${FOUNDATION_CHROME_WEB_STORE_EXTENSION_ID}.json`);
}
async function inspectRequest(root) {
	const target = requestPath(root);
	const result = {
		browser: root.label,
		path: target
	};
	try {
		if (!await pathInfo(target)) return {
			...result,
			state: "missing"
		};
		await assertOwnedPath(root.userDataDir, "directory");
		await assertOwnedPath(path.dirname(target), "directory");
		await assertOwnedPath(target, "file");
		if ((await fs$1.stat(target)).size > 4096) throw new Error("Store install registration exceeds 4 KiB");
		const value = JSON.parse(await fs$1.readFile(target, "utf8"));
		if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).length !== 2 || !("external_update_url" in value) || value.external_update_url !== OWNED_REQUEST.external_update_url || !("openclawOwnership" in value) || value.openclawOwnership !== OWNED_REQUEST.openclawOwnership) return {
			...result,
			state: "foreign",
			issue: "Store install registration is not OpenClaw-owned"
		};
		return {
			...result,
			state: "requested"
		};
	} catch (error) {
		return {
			...result,
			state: "invalid",
			issue: error instanceof Error ? error.message : String(error)
		};
	}
}
function supportedRoots(deps) {
	return (deps.platform ?? process.platform) === "darwin" ? chromeProductRoots(deps).filter((root) => root.product === "chrome") : [];
}
/** Registration requests installation; only Chrome can install and approve it. */
async function chromeStoreInstallRequests(deps = {}) {
	return await Promise.all(supportedRoots(deps).map(inspectRequest));
}
/** The caller must register the native host successfully before requesting installation. */
async function requestChromeStoreInstall(root, deps) {
	if (!supportedRoots(deps).some((candidate) => candidate.userDataDir === root.userDataDir)) return;
	const before = await inspectRequest(root);
	if (before.state === "requested") return before;
	if (before.state !== "missing") throw new Error(before.issue);
	await assertOwnedPath(root.userDataDir, "directory");
	await ensurePrivateDirectory(path.dirname(before.path));
	await fs$1.writeFile(before.path, `${JSON.stringify(OWNED_REQUEST, null, 2)}\n`, {
		mode: 384,
		flag: "wx"
	});
	return await inspectRequest(root);
}
/** Chrome may remove an externally installed extension after this request is removed. */
async function removeChromeStoreInstallRequests(deps = {}) {
	const removed = [];
	const refused = [];
	for (const root of supportedRoots(deps)) {
		const current = await inspectRequest(root);
		if (current.state === "requested") {
			await fs$1.unlink(current.path);
			removed.push(current.path);
		} else if (current.state !== "missing") refused.push(current.path);
	}
	return {
		removed,
		refused
	};
}
//#endregion
//#region extensions/browser/src/browser/extension-install-registration.ts
const OWNED_LAUNCHER_MARKER = "# OpenClaw native messaging bootstrap v1";
function nativeMessagingRoot(deps = {}) {
	return path.join(resolveInstallStateDir(deps), "browser", "native-messaging");
}
function shellQuote(value) {
	return `'${value.replaceAll("'", `'"'"'`)}'`;
}
async function resolveNativeHostPath(pluginRoot, explicit) {
	if (explicit) return await fs$1.realpath(explicit);
	const resolvedPluginRoot = path.resolve(pluginRoot);
	const candidates = [path.join(resolvedPluginRoot, "native-host-entry.js")];
	let cursor = resolvedPluginRoot;
	for (;;) {
		candidates.push(path.join(cursor, "dist", "extensions", "browser", "native-host-entry.js"));
		const parent = path.dirname(cursor);
		if (parent === cursor) break;
		cursor = parent;
	}
	for (const candidate of candidates) if (await pathInfo(candidate)) return await fs$1.realpath(candidate);
	throw new Error("Could not resolve the built browser native-host entrypoint; run pnpm build.");
}
function launcherPathForManifest(manifestPath, deps) {
	const suffix = crypto.createHash("sha256").update(manifestPath).digest("hex").slice(0, 16);
	return path.join(nativeMessagingRoot(deps), `${BROWSER_NATIVE_HOST_NAME}.${suffix}.sh`);
}
function versionedLauncherPath(basePath, content) {
	return `${basePath.slice(0, -3)}.${crypto.createHash("sha256").update(content).digest("hex")}.sh`;
}
function expectedExtensionIds(extensionIds) {
	return [.../* @__PURE__ */ new Set([...extensionIds, FOUNDATION_CHROME_WEB_STORE_EXTENSION_ID])].toSorted();
}
function expectedOriginsForExtensionIds(extensionIds) {
	return expectedExtensionIds(extensionIds).map((extensionId) => `chrome-extension://${extensionId}/`);
}
function pathDerivedExtensionIds(extensionIds) {
	return extensionIds.filter((extensionId) => extensionId !== FOUNDATION_CHROME_WEB_STORE_EXTENSION_ID);
}
function isSafeOriginMigration(existingIds, desiredPathIds) {
	const existingPathIds = pathDerivedExtensionIds(existingIds).toSorted();
	const desiredIds = [...new Set(desiredPathIds)].toSorted();
	if (JSON.stringify(existingPathIds) === JSON.stringify(desiredIds)) return true;
	const removed = existingPathIds.filter((id) => !desiredIds.includes(id));
	const added = desiredIds.filter((id) => !existingPathIds.includes(id));
	const overlap = existingPathIds.some((id) => desiredIds.includes(id));
	return existingPathIds.length === desiredIds.length && removed.length === 1 && added.length === 1 && overlap;
}
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}
function parseOwnedLauncher(params) {
	const quotedValue = String.raw`'(?:[^'\r\n]|'"'"')*'`;
	const command = [
		`(${quotedValue})`,
		`(${quotedValue})`,
		escapeRegExp(shellQuote("--manifest")),
		escapeRegExp(shellQuote(params.manifestPath)),
		escapeRegExp(shellQuote("--launcher")),
		escapeRegExp(shellQuote(params.launcherPath)),
		...params.origins.flatMap((origin) => [escapeRegExp(shellQuote("--expected-origin")), escapeRegExp(shellQuote(origin))])
	].join(" ");
	const profileArgument = `(?: ${escapeRegExp(shellQuote("--browser-profile"))} (${quotedValue}))?`;
	const [stateDir, configPath, nodePath, nativeHostPath, savedProfile] = new RegExp(`^#!/bin/sh\\n${escapeRegExp(OWNED_LAUNCHER_MARKER)}\\nexport OPENCLAW_STATE_DIR=(${quotedValue})\\n(?:export OPENCLAW_CONFIG_PATH=(${quotedValue})\\n)?exec ${command}${profileArgument} "\\$@"\\n$`, "u").exec(params.content)?.slice(1) ?? [];
	if (stateDir === void 0 || nodePath === void 0 || nativeHostPath === void 0) return;
	const decode = (value) => value.slice(1, -1).replaceAll(`'"'"'`, "'");
	const browserProfile = savedProfile === void 0 ? void 0 : decode(savedProfile);
	if (browserProfile !== void 0 && !isValidProfileName(browserProfile)) return;
	return {
		targets: [decode(nodePath), decode(nativeHostPath)],
		context: {
			stateDir: decode(stateDir),
			configPath: configPath === void 0 ? void 0 : decode(configPath)
		},
		...browserProfile === void 0 ? {} : { browserProfile }
	};
}
async function assertNativeHostTarget(target, accessMode) {
	if (!path.isAbsolute(target)) throw new Error("native host target must be an absolute path");
	await assertOwnedPath(target, "file", { allowRootOwner: true });
	await fs$1.access(target, accessMode);
}
async function resolveLauncherInstall(params) {
	const launcherPath = launcherPathForManifest(params.manifestPath, params.deps);
	const nodePath = await fs$1.realpath(params.deps.nodePath ?? process.execPath);
	const nativeHostPath = await resolveNativeHostPath(params.pluginRoot, params.deps.nativeHostPath);
	await assertNativeHostTarget(nodePath, fs$1.constants.X_OK);
	await assertNativeHostTarget(nativeHostPath, fs$1.constants.R_OK);
	const command = [
		nodePath,
		nativeHostPath,
		"--manifest",
		params.manifestPath,
		"--launcher",
		launcherPath,
		...expectedOriginsForExtensionIds(params.extensionIds).flatMap((origin) => ["--expected-origin", origin])
	];
	if (params.browserProfile) command.push("--browser-profile", params.browserProfile);
	const context = params.launchContext ?? {
		stateDir: resolveInstallStateDir(params.deps),
		configPath: resolveInstallConfigPath(params.deps)
	};
	const content = [
		"#!/bin/sh",
		OWNED_LAUNCHER_MARKER,
		`export OPENCLAW_STATE_DIR=${shellQuote(context.stateDir)}`,
		...context.configPath !== void 0 ? [`export OPENCLAW_CONFIG_PATH=${shellQuote(context.configPath)}`] : [],
		`exec ${command.map(shellQuote).join(" ")} "$@"`,
		""
	].join("\n");
	const versionedPath = versionedLauncherPath(launcherPath, content);
	return {
		path: versionedPath,
		content: content.replace(` '--launcher' ${shellQuote(launcherPath)}`, () => ` '--launcher' ${shellQuote(versionedPath)}`)
	};
}
async function inspectRegistration(root, deps, expectedPathExtensionIds) {
	const manifestPath = path.join(root.nativeManifestDir, `${BROWSER_NATIVE_HOST_NAME}.json`);
	if (!await pathInfo(manifestPath)) return {
		product: root.product,
		browser: root.label,
		manifestPath,
		extensionIds: [],
		state: "missing"
	};
	try {
		const manifestFile = await readPrivateNativeHostFile(manifestPath, false);
		const manifest = asNullableRecord(JSON.parse(manifestFile.buffer.toString("utf8")));
		if (!manifest) throw new Error("manifest is not an object");
		const baseLauncher = launcherPathForManifest(manifestPath, deps);
		const expectedLauncher = typeof manifest.path === "string" ? manifest.path : "";
		const versionedPathPattern = new RegExp(`^${escapeRegExp(baseLauncher.slice(0, -3))}\\.[a-f0-9]{64}\\.sh$`, "u");
		const origins = Array.isArray(manifest.allowed_origins) ? manifest.allowed_origins : [];
		const ids = origins.flatMap((origin) => {
			const match = /^chrome-extension:\/\/([a-p]{32})\/$/.exec(String(origin));
			return match?.[1] ? [match[1]] : [];
		});
		if (manifest.name !== "ai.openclaw.browser_bootstrap" || expectedLauncher !== baseLauncher && !versionedPathPattern.test(expectedLauncher)) return {
			product: root.product,
			browser: root.label,
			manifestPath,
			extensionIds: ids,
			state: "foreign",
			issue: "same host name is registered to a foreign manifest or launcher"
		};
		const exactKeys = [
			"name",
			"description",
			"path",
			"type",
			"allowed_origins"
		];
		const stringOrigins = origins.filter((origin) => typeof origin === "string");
		const validOrigins = origins.length > 0 && origins.length === stringOrigins.length && stringOrigins.every((origin) => /^chrome-extension:\/\/[a-p]{32}\/$/u.test(origin)) && new Set(origins).size === origins.length;
		const canonicalOrigins = [...stringOrigins].toSorted();
		const expectedOrigins = expectedPathExtensionIds ? expectedOriginsForExtensionIds(expectedPathExtensionIds) : null;
		if (Object.keys(manifest).length !== exactKeys.length || !exactKeys.every((key) => Object.hasOwn(manifest, key)) || manifest.description !== "OpenClaw browser extension bootstrap" || manifest.type !== "stdio" || !validOrigins || JSON.stringify(origins) !== JSON.stringify(canonicalOrigins)) throw new Error("native host manifest does not contain exact allowed origins");
		const launcherContent = (await readPrivateNativeHostFile(expectedLauncher, true)).buffer.toString("utf8");
		const canonicalContent = launcherContent.replace(` '--launcher' ${shellQuote(expectedLauncher)}`, () => ` '--launcher' ${shellQuote(baseLauncher)}`);
		if (expectedLauncher !== baseLauncher && versionedLauncherPath(baseLauncher, canonicalContent) !== expectedLauncher) throw new Error("native host launcher content does not match its immutable identity");
		const parsedLauncher = parseOwnedLauncher({
			content: launcherContent,
			manifestPath,
			launcherPath: expectedLauncher,
			origins: stringOrigins
		});
		if (!parsedLauncher) throw new Error("native host launcher and manifest origins do not match");
		let issue;
		if (expectedPathExtensionIds !== void 0 && JSON.stringify(origins) !== JSON.stringify(expectedOrigins)) {
			if (!isSafeOriginMigration(ids, expectedPathExtensionIds)) throw new Error("native host manifest does not contain exact allowed origins");
			issue = "registered native host origins require a supported path migration; run openclaw browser extension install";
		}
		try {
			for (const [index, target] of parsedLauncher.targets.entries()) await assertNativeHostTarget(target, index === 0 ? fs$1.constants.X_OK : fs$1.constants.R_OK);
		} catch {
			issue ??= "registered native host runtime or entry is unavailable or unsafe; run openclaw browser extension install";
		}
		return {
			product: root.product,
			browser: root.label,
			manifestPath,
			extensionIds: ids.toSorted(),
			state: "owned",
			nativeHostPath: parsedLauncher.targets[1],
			launcherPath: expectedLauncher,
			launchContext: parsedLauncher.context,
			issue,
			...parsedLauncher.browserProfile === void 0 ? {} : { browserProfile: parsedLauncher.browserProfile }
		};
	} catch (error) {
		return {
			product: root.product,
			browser: root.label,
			manifestPath,
			extensionIds: [],
			state: "invalid",
			issue: error instanceof Error ? error.message : String(error)
		};
	}
}
async function installRegistration(params) {
	const { root, extensionIds, deps } = params;
	const manifestPath = path.join(root.nativeManifestDir, `${BROWSER_NATIVE_HOST_NAME}.json`);
	const existing = await inspectRegistration(root, deps);
	assertExpectedNativeHostProfile(existing, params.expectedRegistrations);
	if (existing.state === "foreign" || existing.state === "invalid") throw new Error(`Refusing to overwrite ${existing.state} native host: ${manifestPath}`);
	if (params.requireCurrentLaunchContext) assertCurrentNativeHostLaunchContext(existing, deps);
	if (params.expectedNativeHostPath !== void 0 && existing.nativeHostPath !== params.expectedNativeHostPath) throw new Error("Native host target changed before repair; inspect it again.");
	const desiredOrigins = expectedOriginsForExtensionIds(extensionIds);
	if (existing.state === "owned" && JSON.stringify(existing.extensionIds.map((id) => `chrome-extension://${id}/`)) !== JSON.stringify(desiredOrigins) && !isSafeOriginMigration(existing.extensionIds, extensionIds)) throw new Error(`Refusing to overwrite owned native host with unexpected allowed origins`);
	params.signal?.throwIfAborted();
	await ensurePrivateDirectory(nativeMessagingRoot(deps));
	params.signal?.throwIfAborted();
	await ensurePrivateDirectory(root.nativeManifestDir);
	const launcher = await resolveLauncherInstall({
		manifestPath,
		pluginRoot: params.pluginRoot,
		extensionIds,
		deps,
		launchContext: params.requireCurrentLaunchContext || params.expectedNativeHostPath !== void 0 ? existing.launchContext : void 0,
		browserProfile: params.browserProfile ?? existing.browserProfile
	});
	const launcherPath = launcher.path;
	const previousManifest = existing.state === "owned" ? await fs$1.readFile(manifestPath, "utf8") : void 0;
	const previousLauncher = existing.launcherPath ? {
		path: existing.launcherPath,
		content: await fs$1.readFile(existing.launcherPath, "utf8")
	} : null;
	let createdLauncher = false;
	if (await pathInfo(launcherPath)) {
		await assertOwnedPath(launcherPath, "file");
		if (await fs$1.readFile(launcherPath, "utf8") !== launcher.content) throw new Error(`Refusing to overwrite changed immutable native host launcher: ${launcherPath}`);
	} else {
		params.signal?.throwIfAborted();
		await replaceFileAtomic({
			filePath: launcherPath,
			content: launcher.content,
			mode: 448
		});
		createdLauncher = true;
	}
	const manifest = {
		name: BROWSER_NATIVE_HOST_NAME,
		description: BROWSER_NATIVE_HOST_DESCRIPTION,
		path: launcherPath,
		type: "stdio",
		allowed_origins: expectedOriginsForExtensionIds(extensionIds)
	};
	const manifestContent = `${JSON.stringify(manifest, null, 2)}\n`;
	try {
		params.signal?.throwIfAborted();
		if (process.platform !== "win32") await fs$1.chmod(launcherPath, 448);
		params.signal?.throwIfAborted();
		await replaceFileAtomic({
			filePath: manifestPath,
			content: manifestContent,
			mode: 384,
			beforeRename: params.requireCurrentLaunchContext || params.expectedRegistrations ? async () => {
				params.signal?.throwIfAborted();
				const current = await inspectRegistration(root, deps);
				if (params.requireCurrentLaunchContext) assertCurrentNativeHostLaunchContext(current, deps);
				assertExpectedNativeHostProfile(current, params.expectedRegistrations);
				const currentManifest = current.state === "missing" ? void 0 : await fs$1.readFile(manifestPath, "utf8");
				if (current.state !== existing.state || currentManifest !== previousManifest) throw new NativeHostSetupContextError("Chrome's native host selection changed during setup. Inspect the registered OPENCLAW_CONFIG_PATH before trying again.");
				params.signal?.throwIfAborted();
			} : void 0
		});
	} catch (error) {
		const observedManifest = await fs$1.readFile(manifestPath, "utf8").catch((readError) => asNullableRecord(readError)?.code === "ENOENT" ? void 0 : null);
		if (createdLauncher && observedManifest === previousManifest) {
			await readPrivateNativeHostFile(launcherPath, true);
			await fs$1.unlink(launcherPath);
		}
		throw error;
	}
	if (previousLauncher && previousLauncher.path !== launcherPath && await fs$1.readFile(manifestPath, "utf8") === manifestContent && await fs$1.readFile(previousLauncher.path, "utf8") === previousLauncher.content) {
		await readPrivateNativeHostFile(previousLauncher.path, true);
		await fs$1.unlink(previousLauncher.path);
	}
	return await inspectRegistration(root, deps, extensionIds);
}
/** Inspect or refresh existing registrations without reading personal browser profiles. */
async function repairChromeExtensionNativeHosts(params) {
	if (!params.dryRun && (!params.fromNativeHostPath || !path.isAbsolute(params.fromNativeHostPath))) throw new Error("Native host repair requires --from with the exact absolute registered entrypoint; use --dry-run to inspect targets.");
	const deps = params.deps ?? {};
	const fromNativeHostPath = params.fromNativeHostPath;
	const changes = [];
	const warnings = [];
	const registrations = [];
	const retained = /* @__PURE__ */ new Set();
	const manualRequired = (deps.platform ?? process.platform) === "win32";
	let retentionSafe = !manualRequired;
	for (const root of manualRequired ? [] : chromeProductRoots(deps)) {
		let registration = await inspectRegistration(root, deps);
		if (!params.dryRun && fromNativeHostPath && registration.state === "owned" && registration.nativeHostPath === fromNativeHostPath) try {
			const installed = stableChromeExtensionDir(deps);
			if (!(await inspectInstalledCopy(installed)).owned) throw new Error("stable extension copy is not OpenClaw-owned; run browser extension install explicitly");
			const extensionIds = (await approvedInstallRealpaths(installed, params.bundledDir)).map((candidate) => generateChromeExtensionIdForPath(candidate, deps.platform ?? process.platform));
			const launcher = await resolveLauncherInstall({
				manifestPath: registration.manifestPath,
				pluginRoot: params.pluginRoot,
				extensionIds,
				deps,
				launchContext: registration.launchContext,
				browserProfile: registration.browserProfile
			});
			if (JSON.stringify(registration.extensionIds) !== JSON.stringify(expectedExtensionIds(extensionIds)) || registration.launcherPath !== launcher.path) {
				registration = await installRegistration({
					root,
					extensionIds,
					pluginRoot: params.pluginRoot,
					deps,
					expectedNativeHostPath: fromNativeHostPath
				});
				changes.push(`Repaired ${root.label} OpenClaw native messaging registration.`);
			}
		} catch (error) {
			warnings.push(`${root.label} native host repair failed: ${String(error)}`);
			retained.add(fromNativeHostPath);
			registration = await inspectRegistration(root, deps);
		}
		registrations.push(registration);
		if (registration.state === "owned" && registration.nativeHostPath && path.isAbsolute(registration.nativeHostPath)) retained.add(registration.nativeHostPath);
		else if (registration.state !== "missing") {
			retentionSafe = false;
			warnings.push(`${root.label} native host target cannot be established: ${registration.issue ?? registration.state}`);
		}
	}
	return {
		changes,
		warnings,
		registrations: registrations.map(({ launchContext: _launchContext, ...registration }) => registration),
		retainedNativeHostPaths: [...retained].toSorted(),
		retentionSafe,
		manualRequired
	};
}
/** Remove only registrations and launchers that carry OpenClaw ownership. */
async function uninstallChromeExtensionNativeHosts(params = {}) {
	const deps = params.deps ?? {};
	if ((deps.platform ?? process.platform) === "win32") return process.platform === "win32" || deps.windowsNative ? (await import("./extension-windows-host-De9dw0U9.mjs")).uninstallWindowsNativeHosts({
		...params,
		executable: params.nativeHostExecutable
	}) : {
		removed: [],
		refused: [],
		manualRequired: true
	};
	if (params.removeStore) throw new Error("Use uninstall-store for macOS Store requests.");
	const removed = [];
	const refused = [];
	for (const root of chromeProductRoots(deps)) {
		const status = await inspectRegistration(root, deps);
		if (status.state === "missing") continue;
		if (status.state !== "owned") {
			refused.push(status.manifestPath);
			continue;
		}
		const launcherPath = status.launcherPath;
		if (!launcherPath) {
			refused.push(status.manifestPath);
			continue;
		}
		const launcher = await pathInfo(launcherPath);
		if (launcher) {
			await assertOwnedPath(launcherPath, "file");
			if (!(await fs$1.readFile(launcherPath, "utf8")).includes(OWNED_LAUNCHER_MARKER)) {
				refused.push(launcherPath);
				continue;
			}
		}
		await fs$1.unlink(status.manifestPath);
		removed.push(status.manifestPath);
		if (launcher) {
			await fs$1.unlink(launcherPath);
			removed.push(launcherPath);
		}
	}
	return {
		removed,
		refused,
		manualRequired: false
	};
}
//#endregion
//#region extensions/browser/src/browser/extension-install.ts
const BROWSER_EXTENSION_INSTALL_WAIT_DEFAULT_MS = 3e4;
const BROWSER_EXTENSION_INSTALL_WAIT_MIN_MS = 1e3;
const BROWSER_EXTENSION_INSTALL_WAIT_MAX_MS = 12e4;
function normalizeExtensionInstallWaitMs(value) {
	if (value === void 0) return BROWSER_EXTENSION_INSTALL_WAIT_DEFAULT_MS;
	const parsed = typeof value === "number" || typeof value === "string" && /^\d+$/u.test(value) ? Number(value) : NaN;
	if (!Number.isInteger(parsed) || parsed < BROWSER_EXTENSION_INSTALL_WAIT_MIN_MS || parsed > BROWSER_EXTENSION_INSTALL_WAIT_MAX_MS) throw new Error(`--wait-ms must be an integer from ${BROWSER_EXTENSION_INSTALL_WAIT_MIN_MS} to ${BROWSER_EXTENSION_INSTALL_WAIT_MAX_MS}`);
	return parsed;
}
/** Copy, pre-register Store plus deterministic IDs, then verify Chrome's recorded identity. */
async function installChromeExtensionBootstrap(params) {
	const deps = params.deps ?? {};
	const platform = deps.platform ?? process.platform;
	if (params.browserProfile !== void 0 && !isValidProfileName(params.browserProfile)) throw new Error("Invalid native browser profile");
	params.signal?.throwIfAborted();
	if ((params.requireCurrentLaunchContext || params.expectedRegistrations) && platform !== "win32") {
		for (const root of chromeProductRoots(deps)) {
			const registration = await inspectRegistration(root, deps);
			if (params.requireCurrentLaunchContext) assertCurrentNativeHostLaunchContext(registration, deps);
			assertExpectedNativeHostProfile(registration, params.expectedRegistrations);
		}
		params.signal?.throwIfAborted();
	}
	const installed = await installStableChromeExtension(params.bundledDir, deps);
	if (platform === "win32" && process.platform !== "win32" && !deps.windowsNative) return await browserExtensionStatus({
		bundledDir: params.bundledDir,
		deps
	});
	const approvedPaths = await approvedInstallRealpaths(installed, params.bundledDir);
	const predictedIds = [...new Set(approvedPaths.map((candidate) => generateChromeExtensionIdForPath(candidate, platform)))].toSorted();
	if (platform === "win32") {
		const { installWindowsNativeHost } = await import("./extension-windows-host-De9dw0U9.mjs");
		const windows = await installWindowsNativeHost({
			...params,
			executable: params.nativeHostExecutable,
			extensionIds: predictedIds,
			deps
		});
		return await browserExtensionStatus({
			...params,
			deps,
			windowsObservation: windows
		});
	}
	const preRegistrationIssues = [];
	let preRegisteredRoots = 0;
	for (const root of chromeProductRoots(deps)) {
		params.signal?.throwIfAborted();
		try {
			if (!await pathInfo(root.userDataDir)) {
				if (platform !== "darwin" || root.product !== "chrome") continue;
				await ensurePrivateDirectory(root.userDataDir);
			}
			await assertOwnedPath(root.userDataDir, "directory");
			params.signal?.throwIfAborted();
			await installRegistration({
				root,
				extensionIds: predictedIds,
				pluginRoot: params.pluginRoot,
				deps,
				browserProfile: params.browserProfile,
				signal: params.signal,
				requireCurrentLaunchContext: params.requireCurrentLaunchContext,
				expectedRegistrations: params.expectedRegistrations
			});
			preRegisteredRoots += 1;
			params.onProgress?.(`Pre-registered the native host for ${root.label}.`);
		} catch (error) {
			params.signal?.throwIfAborted();
			if (error instanceof NativeHostSetupContextError) throw error;
			preRegistrationIssues.push(`${root.label}: native host pre-registration refused (${error instanceof Error ? error.message : String(error)})`);
			continue;
		}
		try {
			params.signal?.throwIfAborted();
			if (params.requestStoreInstall === false ? void 0 : await requestChromeStoreInstall(root, deps)) params.onProgress?.(`Requested the OpenClaw Store extension for ${root.label}. Restart Chrome if needed, then approve OpenClaw in chrome://extensions.`);
		} catch (error) {
			params.signal?.throwIfAborted();
			preRegistrationIssues.push(`${root.label}: Store installation request refused (${error instanceof Error ? error.message : String(error)}). Add OpenClaw directly: ${FOUNDATION_CHROME_WEB_STORE_URL}`);
		}
	}
	if (preRegisteredRoots > 0) params.onProgress?.(`Native bootstrap is ready. Add OpenClaw from the Chrome Web Store: ${FOUNDATION_CHROME_WEB_STORE_URL}. For development, load unpacked from ${installed}.`);
	else preRegistrationIssues.push("No native host was pre-registered. Resolve any pre-registration refusals above; if Chrome has not been launched yet, launch it first. Then run install again before loading the extension.");
	const waitMs = normalizeExtensionInstallWaitMs(params.waitMs);
	const now = deps.now ?? Date.now;
	const sleep = deps.sleep ?? ((ms) => new Promise((resolve) => {
		setTimeout(resolve, ms);
	}));
	const deadline = now() + waitMs;
	let discovery = await discoverChromeExtensionIds({
		approvedDirs: approvedPaths,
		storeExtensionId: FOUNDATION_CHROME_WEB_STORE_EXTENSION_ID,
		deps
	});
	let announcedWait = false;
	while (discovery.discovered.length === 0 && discovery.storeDiscovered.length === 0 && now() < deadline) {
		if (!announcedWait) {
			params.onProgress?.("Waiting for Chrome to verify the OpenClaw extension…");
			announcedWait = true;
		}
		params.signal?.throwIfAborted();
		await sleep(Math.min(500, Math.max(1, deadline - now())));
		params.signal?.throwIfAborted();
		discovery = await discoverChromeExtensionIds({
			approvedDirs: approvedPaths,
			storeExtensionId: FOUNDATION_CHROME_WEB_STORE_EXTENSION_ID,
			deps
		});
	}
	const status = await browserExtensionStatus({
		bundledDir: params.bundledDir,
		deps,
		requireCurrentLaunchContext: params.requireCurrentLaunchContext
	});
	return {
		...status,
		issues: [.../* @__PURE__ */ new Set([...preRegistrationIssues, ...status.issues])]
	};
}
/** Read-only extension copy, profile discovery, and native registration report. */
async function browserExtensionStatus(params) {
	const deps = params.deps ?? {};
	const platform = deps.platform ?? process.platform;
	const installedPath = stableChromeExtensionDir(deps);
	const installedCopy = await inspectInstalledCopy(installedPath);
	const bundledPath = await fs$1.realpath(params.bundledDir);
	await assertOwnedPath(bundledPath, "directory", { allowRootOwner: true });
	const approvedPaths = installedCopy.owned ? await approvedInstallRealpaths(installedPath, bundledPath) : [bundledPath];
	const discovery = await discoverChromeExtensionIds({
		approvedDirs: approvedPaths,
		storeExtensionId: FOUNDATION_CHROME_WEB_STORE_EXTENSION_ID,
		deps
	});
	const predictedIds = [...new Set(approvedPaths.map((candidate) => generateChromeExtensionIdForPath(candidate, platform)))].toSorted();
	const windows = platform === "win32" && (process.platform === "win32" || deps.windowsNative) ? params.windowsObservation ?? await (await import("./extension-windows-host-De9dw0U9.mjs")).inspectWindowsNativeHosts({
		deps,
		pluginRoot: params.pluginRoot,
		executable: params.nativeHostExecutable,
		extensionIds: predictedIds,
		browserProfile: params.browserProfile,
		signal: params.signal
	}) : void 0;
	const registrations = platform === "win32" ? windows?.registrations ?? [] : await Promise.all(chromeProductRoots(deps).map((root) => inspectRegistration(root, deps, predictedIds))).then((entries) => entries.map((registration) => {
		if (params.requireCurrentLaunchContext) assertCurrentNativeHostLaunchContext(registration, deps);
		const { nativeHostPath: _nativeHostPath, launcherPath: _launcherPath, launchContext: _launchContext, ...entry } = registration;
		return entry;
	}));
	const unavailableRegistration = registrations.some((registration) => {
		return (discovery.discovered.some((entry) => entry.product === registration.product) || discovery.storeDiscovered.some((entry) => entry.product === registration.product)) && (registration.state !== "owned" || Boolean(registration.issue));
	});
	const storeInstallRequests = windows?.storeInstallRequests ?? await chromeStoreInstallRequests(deps);
	return {
		platform,
		platformSupport: platform === "win32" && !registrations.length ? "manual_required" : "automatic",
		installedCopy: {
			path: installedPath,
			...installedCopy
		},
		bundledPath: path.resolve(params.bundledDir),
		approvedPaths,
		discovered: discovery.discovered,
		storeDiscovered: discovery.storeDiscovered,
		storeInstallRequests,
		registrations,
		manualSetupRequired: platform === "win32" && !registrations.length || installedCopy.present && !installedCopy.owned || discovery.discovered.length === 0 && !discovery.storeDiscovered.some((entry) => entry.enabled) || discovery.identityMismatches.length > 0 || unavailableRegistration,
		issues: [
			...installedCopy.present && !installedCopy.owned ? [`Chrome extension copy is not OpenClaw-owned: ${installedPath}`] : [],
			...discovery.issues,
			...windows?.issues ?? [],
			...storeInstallRequests.flatMap((entry) => entry.issue ? [`${entry.browser}: ${entry.issue}`] : []),
			...registrations.flatMap((entry) => entry.issue ? [`${entry.browser}: ${entry.issue}`] : [])
		]
	};
}
/** Resolve the installed stable copy when present, bundled source otherwise. */
async function resolveChromeExtensionLoadPath(bundledDir, deps = {}) {
	const installedPath = stableChromeExtensionDir(deps);
	const installed = await inspectInstalledCopy(installedPath);
	if (installed.present) {
		if (!installed.owned) throw new Error(`Refusing foreign Chrome extension directory: ${installedPath}`);
		return await fs$1.realpath(installedPath);
	}
	const bundledPath = await fs$1.realpath(path.resolve(bundledDir));
	await assertOwnedPath(bundledPath, "directory", { allowRootOwner: true });
	return bundledPath;
}
//#endregion
//#region extensions/browser/src/browser/extension-setup.ts
/** Filesystem setup has one owner; callers retain their documented output projections. */
async function observeBrowserExtensionSetup(options) {
	options.signal?.throwIfAborted();
	return options.action === "install" ? installChromeExtensionBootstrap({
		...options,
		browserProfile: options.profile
	}) : browserExtensionStatus({
		bundledDir: options.bundledDir,
		pluginRoot: options.pluginRoot,
		browserProfile: options.profile,
		nativeHostExecutable: options.nativeHostExecutable,
		signal: options.signal,
		requireCurrentLaunchContext: options.requireCurrentLaunchContext
	});
}
async function resolveWindowsSetupSelection(options, initial, resolved) {
	const { windowsManagementObservation } = await import("./extension-windows-host-De9dw0U9.mjs");
	const blocked = () => /* @__PURE__ */ new Error("Windows saved profile is unverified. Repair the intended existing profile with an explicit --browser-profile; no automatic change was made.");
	const inspect = async (profile) => {
		options.signal?.throwIfAborted();
		const status = await observeBrowserExtensionSetup({
			...options,
			action: "inspect",
			profile
		});
		options.signal?.throwIfAborted();
		return status;
	};
	function classify(status) {
		if (status.platform !== "win32") return "blocked";
		const fact = windowsManagementObservation(status.registrations);
		const response = fact?.response;
		if (!response || response.store !== "missing" && response.store !== "requested") return "blocked";
		if (response.ok && response.registration === "owned" && response.mode === "native-windows-cli" && response.installation && fact.browserProfile) return "matching";
		if (response.ok && response.registration === "missing" && response.mode === null && !response.installation && response.store === "missing") return "missing";
		if (!response.ok && response.code === "context_conflict" && response.registration === "owned" && response.mode === "native-windows-cli" && !response.installation) return "conflict";
		return "blocked";
	}
	let observed = initial;
	let kind = classify(observed);
	if (kind === "conflict") for (const name of Object.keys(resolved.profiles)) {
		options.signal?.throwIfAborted();
		if (name === "chrome" || !isValidProfileName(name) || resolveProfile(resolved, name)?.driver !== "extension") continue;
		observed = await inspect(name);
		kind = classify(observed);
		if (kind === "matching") break;
		if (kind !== "conflict") throw blocked();
	}
	if (kind !== "matching" && kind !== "missing") throw blocked();
	const selected = windowsManagementObservation(observed.registrations);
	const profile = kind === "missing" ? "chrome" : selected?.browserProfile;
	if (!profile || !isValidProfileName(profile) || resolveProfile(resolved, profile)?.driver !== "extension") throw blocked();
	const confirmed = await inspect(profile);
	const confirmation = windowsManagementObservation(confirmed.registrations);
	if (classify(confirmed) !== kind || kind === "matching" && (confirmation?.browserProfile !== profile || confirmation.response?.installation?.generation !== selected?.response?.installation?.generation)) throw blocked();
	return {
		observed: confirmed,
		profile
	};
}
/** Native bootstrap, not the UI, transfers the host-local key to the origin-locked extension. */
async function runBrowserExtensionSetup(input) {
	let options = {
		...input,
		requireCurrentLaunchContext: true
	};
	options.signal?.throwIfAborted();
	const windowsBudget = AbortSignal.timeout(6e4);
	const windowsSignal = options.signal ? AbortSignal.any([options.signal, windowsBudget]) : windowsBudget;
	if (process.platform === "win32") options = {
		...options,
		signal: windowsSignal
	};
	const resolved = resolveBrowserConfig(options.cfg.browser, options.cfg);
	let observed = options.profile === void 0 || options.action !== "install" ? await observeBrowserExtensionSetup({
		...options,
		action: "inspect"
	}) : void 0;
	let windowsProfile;
	if (observed?.platform === "win32" && options.profile === void 0) {
		options = {
			...options,
			signal: windowsSignal
		};
		options.signal?.throwIfAborted();
		const selection = await resolveWindowsSetupSelection(options, observed, resolved);
		observed = selection.observed;
		windowsProfile = selection.profile;
	}
	if (observed && observed.platform !== "win32" && observed.registrations.some((entry) => entry.state !== "owned" && entry.state !== "missing")) throw new Error("Chrome setup cannot recover the saved profile from an unverified native host");
	const legacyProfileName = resolveFirstExtensionProfileName(resolved);
	const savedProfiles = new Set(observed?.registrations.filter((entry) => entry.state === "owned").map((entry) => entry.browserProfile ?? legacyProfileName));
	if (options.action !== "install" && observed?.platform !== "win32" && options.profile !== void 0 && [...savedProfiles].some((profile) => profile !== options.profile)) throw new Error("Chrome setup profile does not match the registered native host; use an explicit install to change it");
	if (savedProfiles.size > 1) throw new Error("Chrome setup requires an explicit profile when owned registrations disagree");
	const profileName = options.profile ?? windowsProfile ?? savedProfiles.values().next().value ?? "chrome";
	const profile = resolveProfile(resolved, profileName);
	if (!profile || profile.driver !== "extension") throw new Error("Chrome setup requires an existing extension browser profile");
	const relayPort = profile.cdpPort ?? resolved.extensionRelayPorts[profileName] ?? resolved.extensionRelayDefaultPort;
	const status = options.action !== "install" && observed ? observed : await observeBrowserExtensionSetup({
		...options,
		profile: profileName,
		expectedRegistrations: options.profile === void 0 && observed?.platform !== "win32" ? observed?.registrations : void 0
	});
	options.signal?.throwIfAborted();
	const registrations = status.registrations.filter((entry) => entry.product === "chrome");
	const unpackedProfiles = status.discovered.filter((entry) => entry.product === "chrome");
	const storeProfiles = status.storeDiscovered.filter((entry) => entry.product === "chrome");
	const nativeHostRegistered = registrations.some((entry) => entry.state === "owned" && !entry.issue);
	const unavailable = registrations.some((entry) => entry.state === "foreign" || entry.state === "invalid" || Boolean(entry.issue));
	const installation = {
		nativeHostRegistered,
		installRequested: status.storeInstallRequests.some((entry) => entry.state === "requested"),
		installedProfiles: unpackedProfiles.length + storeProfiles.length,
		discoveredProfiles: unpackedProfiles.length + storeProfiles.filter((entry) => entry.enabled).length,
		awaitingApproval: storeProfiles.some((entry) => entry.awaitingApproval),
		automaticBootstrapSupported: status.platformSupport === "automatic"
	};
	const result = {
		action: options.action,
		target: {
			kind: "local-host",
			platform: status.platform,
			hostname: os.hostname(),
			profile: profileName,
			relayPort
		},
		phase: "waiting_for_connection",
		reason: "connection_unchecked",
		installation,
		connection: { state: "not_checked" },
		nextAction: "check_connection"
	};
	if (!installation.automaticBootstrapSupported) Object.assign(result, {
		phase: "blocked",
		reason: "platform_unsupported",
		nextAction: "unsupported"
	});
	else if (!nativeHostRegistered) Object.assign(result, {
		phase: unavailable ? "blocked" : "inspection_required",
		reason: unavailable ? "native_host_unavailable" : "native_host_missing",
		nextAction: unavailable ? "repair_native_host" : "install"
	});
	else if (!installation.discoveredProfiles) Object.assign(result, {
		phase: "needs_browser_action",
		reason: installation.awaitingApproval ? "chrome_approval_required" : "extension_missing",
		nextAction: installation.awaitingApproval ? "approve_extension" : installation.installRequested ? "open_chrome" : "install_from_store"
	});
	return options.action === "verify" && (status.platform !== "win32" || result.phase !== "blocked") ? verifyBrowserExtensionSetup(result, options.signal) : result;
}
async function verifyBrowserExtensionSetup(result, signal) {
	try {
		const { readExtensionRelayToken } = await import("./relay-auth-D8rT3e9m.mjs");
		const token = readExtensionRelayToken();
		if (!token) result.connection = { state: "unavailable" };
		else {
			const { RelayOwnerClient } = await import("./owner-client-fMvTk4sV.mjs");
			const client = await RelayOwnerClient.connect({
				port: result.target.relayPort,
				profile: result.target.profile,
				token,
				signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(5e3)]) : AbortSignal.timeout(5e3)
			});
			try {
				const connection = await client.status();
				result.connection = connection.ready && connection.identity ? {
					state: "connected",
					extensionVersion: connection.identity.extensionVersion
				} : { state: "waiting_for_extension" };
			} finally {
				await client.close();
			}
		}
	} catch {
		signal?.throwIfAborted();
		result.connection = { state: "unavailable" };
	}
	if (result.connection.state === "connected") Object.assign(result, {
		phase: "ready",
		reason: "connected",
		nextAction: "none"
	});
	else if (result.phase === "waiting_for_connection") result.reason = result.connection.state === "waiting_for_extension" ? "extension_disconnected" : "relay_unavailable";
	return result;
}
//#endregion
export { repairChromeExtensionNativeHosts as a, FOUNDATION_CHROME_WEB_STORE_URL as c, resolveChromeExtensionLoadPath as i, removeChromeStoreInstallRequests as l, runBrowserExtensionSetup as n, resolveNativeHostPath as o, normalizeExtensionInstallWaitMs as r, uninstallChromeExtensionNativeHosts as s, observeBrowserExtensionSetup as t, NativeHostSetupContextError as u };
