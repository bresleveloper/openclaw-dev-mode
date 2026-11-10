import { t as __exportAll } from "./session-binding-sidecars-D0c8mmZ9.mjs";
import { createRequire } from "node:module";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { runUtf8CommandWithTimeout } from "openclaw/plugin-sdk/process-runtime";
import { constants, existsSync, realpathSync } from "node:fs";
import path from "node:path";
import { access, open, realpath } from "node:fs/promises";
import { coerceErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { resolveNodeHostExecutable } from "openclaw/plugin-sdk/node-host";
import { parse } from "semver";
//#region extensions/codex/src/app-server/desktop-app-paths.ts
/** Shared path candidates for Codex's macOS desktop app bundle. */
const MACOS_DESKTOP_CODEX_APP_PATH_CANDIDATES = ["ChatGPT.app", "Codex.app"].flatMap((appName) => {
	const appBundlePath = `/Applications/${appName}`;
	const resources = `${appBundlePath}/Contents/Resources`;
	const computerUseServiceAppPaths = [`${resources}/cua_node/lib/node_modules/@oai/sky/Codex Computer Use.app`, `${resources}/plugins/openai-bundled/plugins/computer-use/Codex Computer Use.app`];
	if (appName === "Codex.app") computerUseServiceAppPaths.reverse();
	const candidate = {
		appName,
		appBundlePath,
		appServerCommandPath: `${resources}/codex`,
		bundledMarketplacePath: `${resources}/plugins/openai-bundled`,
		computerUseServiceAppPaths
	};
	return [{
		...candidate,
		appServerCommandPath: path.join(resources, "codex-cli", "CodexCLI.app", "Contents", "MacOS", "codex")
	}, candidate];
});
function resolveMacOSDesktopCodexAppPathCandidates(platform = process.platform) {
	return platform === "darwin" ? MACOS_DESKTOP_CODEX_APP_PATH_CANDIDATES : [];
}
function resolveMacOSDesktopCodexAppServerCommandCandidates(platform = process.platform) {
	return resolveMacOSDesktopCodexAppPathCandidates(platform).map((candidate) => candidate.appServerCommandPath);
}
function resolveMacOSDesktopCodexBundledMarketplaceCandidates(platform = process.platform) {
	return [...new Set(resolveMacOSDesktopCodexAppPathCandidates(platform).map((candidate) => candidate.bundledMarketplacePath))];
}
function resolveMacOSDesktopCodexComputerUseServiceAppCandidates(platform = process.platform, appServerCommand) {
	if (platform !== "darwin") return [];
	const candidates = resolveMacOSDesktopCodexAppPathCandidates(platform);
	const matchingCandidate = appServerCommand ? candidates.find((candidate) => path.resolve(candidate.appServerCommandPath) === path.resolve(appServerCommand)) : void 0;
	return [.../* @__PURE__ */ new Set([...matchingCandidate?.computerUseServiceAppPaths ?? [], ...candidates.flatMap((candidate) => candidate.computerUseServiceAppPaths)])];
}
function resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath(params = {}) {
	const candidates = params.candidates ?? resolveMacOSDesktopCodexBundledMarketplaceCandidates(params.platform);
	const pathExists = params.pathExists ?? existsSync;
	return candidates.find((candidate) => pathExists(candidate));
}
//#endregion
//#region extensions/codex/src/app-server/version.ts
/** Exact Codex app-server version shipped by the OpenClaw Codex bridge. */
const CODEX_APP_SERVER_VERSION = "0.164.0";
/** Inclusive runtime compatibility floor for external app-server binaries. */
const MIN_SUPPORTED_CODEX_APP_SERVER_VERSION = "0.149.0";
const MANAGED_CODEX_APP_SERVER_PACKAGE = "@openai/codex";
//#endregion
//#region extensions/codex/src/app-server/managed-binary.ts
/**
* Resolves the managed Codex app-server binary before stdio startup: a newer
* user-installed Codex from PATH when it passes the version policy and an
* app-server handshake, otherwise the package shipped beside the Codex plugin.
*/
var managed_binary_exports = /* @__PURE__ */ __exportAll({
	CODEX_VERSION_TIMEOUT_MS: () => CODEX_VERSION_TIMEOUT_MS,
	INSTALLED_CODEX_PROBE_TIMEOUT_MS: () => INSTALLED_CODEX_PROBE_TIMEOUT_MS,
	INSTALLED_CODEX_START_TIMEOUT_MS: () => INSTALLED_CODEX_START_TIMEOUT_MS,
	assertInstalledCodexAppServerVersion: () => assertInstalledCodexAppServerVersion,
	isManagedCodexDesktopCommand: () => isManagedCodexDesktopCommand,
	parseCodexVersion: () => parseCodexVersion,
	readInstalledCodexAppServerStatus: () => readInstalledCodexAppServerStatus,
	rejectInstalledCodexAppServer: () => rejectInstalledCodexAppServer,
	resolveManagedCodexAppServerStartOptions: () => resolveManagedCodexAppServerStartOptions,
	resolveManagedCodexClientVersion: () => resolveManagedCodexClientVersion,
	resolveManagedCodexNativeCommand: () => resolveManagedCodexNativeCommand,
	resolveManagedCodexPackageEntrypoint: () => resolveManagedCodexPackageEntrypoint,
	resolvePackagedCodexNativeCommand: () => resolvePackagedCodexNativeCommand,
	runCodexVersionCommand: () => runCodexVersionCommand,
	setManagedCodexPluginRoot: () => setManagedCodexPluginRoot
});
const CODEX_VERSION_TIMEOUT_MS = 5e3;
const CODEX_VERSION_MAX_OUTPUT_BYTES = 65536;
const INSTALLED_CODEX_PROBE_TIMEOUT_MS = 4e3;
/**
* Initialize allowance for a managed start of the already-probed installed
* Codex while the bundled fallback remains; short enough that the fallback
* fits the 10 second model-catalog deadline.
*/
const INSTALLED_CODEX_START_TIMEOUT_MS = 4e3;
const NATIVE_TARGET_TRIPLES = /* @__PURE__ */ new Map([
	["linux-x64", "x86_64-unknown-linux-musl"],
	["linux-arm64", "aarch64-unknown-linux-musl"],
	["darwin-x64", "x86_64-apple-darwin"],
	["darwin-arm64", "aarch64-apple-darwin"],
	["win32-x64", "x86_64-pc-windows-msvc"],
	["win32-arm64", "aarch64-pc-windows-msvc"]
]);
const registeredCodexPlugin = resolveGlobalSingleton(Symbol.for("openclaw.codexManagedPluginRoot"), () => ({}));
const installedCodex = resolveGlobalSingleton(Symbol.for("openclaw.codexInstalledAppServer"), () => ({}), (state) => {
	delete state.selection;
	delete state.selected;
	delete state.pending;
	delete state.rejected;
});
/** Records the process-stable plugin root prepared by OpenClaw's plugin loader. */
function setManagedCodexPluginRoot(pluginRoot) {
	registeredCodexPlugin.root = pluginRoot;
}
/**
* Version that managed starts with this command order report to ChatGPT model
* discovery: the selected installed Codex, otherwise the bundled pin.
*/
async function resolveManagedCodexClientVersion(order, options = {}) {
	return (await resolveInstalledCodexForOrder(order, options))?.version ?? "0.164.0";
}
/**
* Desktop-first starts that find a macOS desktop app run it with the bundled
* package as fallback; they never wait on, start, or report a PATH Codex.
*/
async function resolveInstalledCodexForOrder(order, options) {
	const platform = options.platform ?? process.platform;
	const pathExists = options.pathExists ?? commandPathExists;
	if (order === "desktop-first") {
		for (const command of resolveMacOSDesktopCodexAppServerCommandCandidates(platform)) if (await pathExists(command, platform)) return;
	}
	return resolveInstalledCodexAppServer(options.probes, options.selectionTimeoutMs);
}
/**
* Selects the installed Codex once per process; later callers reuse the
* decision, so probes only apply to the call that makes it.
*/
async function resolveInstalledCodexAppServer(probes = {}, timeoutMs = INSTALLED_CODEX_PROBE_TIMEOUT_MS) {
	if (!installedCodex.selection) {
		installedCodex.pending = true;
		const selection = decideInstalledCodexAppServer(probes).then((decision) => {
			if (installedCodex.selection !== selection) return;
			delete installedCodex.pending;
			embeddedAgentLog.info("selected" in decision ? `Codex app-server: using installed ${decision.found} ${decision.selected.version} (newer than bundled ${CODEX_APP_SERVER_VERSION})` : `Codex app-server: using bundled ${CODEX_APP_SERVER_VERSION} (${decision.reason})`);
			if ("selected" in decision) {
				installedCodex.selected = decision.selected;
				return decision.selected;
			}
		});
		installedCodex.selection = selection;
	}
	const selection = installedCodex.selection;
	if (!installedCodex.pending) return selection;
	let timer;
	const expired = new Promise((resolve) => {
		timer = setTimeout(() => {
			if (installedCodex.selection === selection) {
				installedCodex.selection = Promise.resolve(void 0);
				delete installedCodex.pending;
				embeddedAgentLog.info(`Codex app-server: using bundled ${CODEX_APP_SERVER_VERSION} (installed Codex selection exceeded its startup budget)`);
			}
			resolve(void 0);
		}, Math.min(timeoutMs, INSTALLED_CODEX_PROBE_TIMEOUT_MS));
	});
	try {
		return await Promise.race([selection, expired]);
	} finally {
		clearTimeout(timer);
	}
}
/**
* Drops the selected installed Codex after it failed to start, so this process
* uses the bundled package until the Gateway restarts. Returns true for that
* launcher, including starts that captured it before another start dropped it,
* and false for any other command. Only the first failure is logged.
*/
function rejectInstalledCodexAppServer(command, error) {
	const selected = installedCodex.selected;
	if (selected?.command !== command) return installedCodex.rejected === command;
	installedCodex.rejected = command;
	installedCodex.selection = Promise.resolve(void 0);
	delete installedCodex.selected;
	embeddedAgentLog.warn(`Codex app-server: installed ${command} ${selected.version} failed to start (${coerceErrorMessage(error)}); using bundled ${CODEX_APP_SERVER_VERSION} until the Gateway restarts`);
	return true;
}
/**
* Rejects an initialize answer from the selected installed Codex that names
* another version, and any start of a launcher another start already rejected.
*/
function assertInstalledCodexAppServerVersion(command, serverVersion) {
	const selected = installedCodex.selected;
	if (selected?.command === command && serverVersion !== selected.version) throw new Error(`app-server reported ${serverVersion ?? "no version"}`);
	if (selected?.command !== command && installedCodex.rejected === command) throw new Error("another start already rejected this installed Codex");
}
/** Whether `command` is this process's selected installed Codex, or was until it failed. */
function readInstalledCodexAppServerStatus(command) {
	if (installedCodex.selected?.command === command) return "selected";
	return installedCodex.rejected === command ? "rejected" : void 0;
}
async function decideInstalledCodexAppServer(probes) {
	const env = probes.env ?? process.env;
	const platform = probes.platform ?? process.platform;
	const selectionDeadline = performance.now() + INSTALLED_CODEX_PROBE_TIMEOUT_MS;
	const found = resolveNodeHostExecutable("codex", {
		env,
		strategy: "direct"
	})?.executable;
	if (!found) return { reason: "no codex on PATH" };
	const launcher = await resolveInstalledCodexLauncher(found, platform);
	if (!launcher) return { reason: `installed ${found} is not a native Codex executable or the official ${MANAGED_CODEX_APP_SERVER_PACKAGE} launcher` };
	if (isManagedCodexDesktopCommand(launcher.command, platform)) return { reason: `installed ${found} belongs to a macOS desktop app` };
	let output;
	const versionTimeoutMs = Math.max(0, selectionDeadline - performance.now());
	if (versionTimeoutMs <= 0) return { reason: `installed ${found} selection timed out before the version check` };
	try {
		output = probes.runVersion ? await probes.runVersion(launcher.nativeCommand) : await runCodexVersionCommand(launcher.nativeCommand, process.env, versionTimeoutMs);
	} catch (error) {
		return { reason: `installed ${found} --version failed: ${coerceErrorMessage(error)}` };
	}
	const version = parseCodexVersion(output);
	const parsed = version ? parse(version) : null;
	if (!version || !parsed) return { reason: `installed ${found} did not report a parseable version` };
	const bundled = parse(CODEX_APP_SERVER_VERSION);
	if (parsed.compare(bundled) <= 0) return { reason: `installed ${found} ${version} is not newer` };
	if (parsed.prerelease.length > 0) return { reason: `installed ${found} ${version} is a prerelease` };
	if (parsed.major !== bundled.major) return { reason: `installed ${found} ${version} is a different major version` };
	const handshakeTimeoutMs = Math.max(0, selectionDeadline - performance.now());
	if (handshakeTimeoutMs <= 0) return { reason: `installed ${found} selection timed out before the app-server handshake` };
	let handshakeVersion;
	try {
		handshakeVersion = await (probes.probeHandshake ?? (async (command) => (await import("./installed-probe-BD2E4wxF.mjs")).probeCodexAppServerHandshake(command, handshakeTimeoutMs)))(launcher.command);
	} catch (error) {
		return { reason: `installed ${found} ${version} failed the app-server handshake: ${coerceErrorMessage(error)}` };
	}
	if (handshakeVersion !== version) return { reason: `installed ${found} ${version} reported ${handshakeVersion ?? "no version"} from app-server` };
	return {
		found,
		selected: {
			...launcher,
			version
		}
	};
}
/** Accepts native executables and the official npm launcher, never other script wrappers. */
async function resolveInstalledCodexLauncher(found, platform) {
	let command;
	try {
		command = await realpath(found);
		if (platform === "win32" && /\.(?:cmd|bat|ps1)$/iu.test(command)) command = await realpath(path.join(path.dirname(command), "node_modules", "@openai", "codex", "bin", "codex.js"));
	} catch {
		return;
	}
	const packagedNative = resolvePackagedCodexNativeCommand(command);
	if (packagedNative) return {
		command,
		nativeCommand: packagedNative
	};
	if (/\.(?:[cm]?js|cmd|bat|ps1)$/iu.test(command) || await startsWithShebang(command)) return;
	return {
		command,
		nativeCommand: command
	};
}
async function startsWithShebang(filePath) {
	const handle = await open(filePath, "r").catch(() => void 0);
	if (!handle) return true;
	try {
		const buffer = Buffer.alloc(2);
		const { bytesRead } = await handle.read(buffer, 0, 2, 0);
		return bytesRead === 2 && buffer.toString("latin1") === "#!";
	} finally {
		await handle.close();
	}
}
/** Extracts the semver from `codex --version` output such as `codex-cli 0.160.0`. */
function parseCodexVersion(output) {
	return /(?:^|\s)(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)(?:\s|$)/u.exec(output)?.[1];
}
/** Runs `<native> --version` with bounded time and output; returns stdout and stderr. */
async function runCodexVersionCommand(nativeCommand, env = process.env, timeoutMs = CODEX_VERSION_TIMEOUT_MS) {
	const result = await runUtf8CommandWithTimeout([nativeCommand, "--version"], {
		baseEnv: env,
		timeoutMs,
		maxOutputBytes: CODEX_VERSION_MAX_OUTPUT_BYTES,
		outputCapture: "head",
		terminateOnOutputLimit: true,
		killProcessTree: true,
		killSignal: "SIGKILL",
		killGraceMs: 0
	});
	if (result.termination !== "exit" || result.code !== 0 || result.outputLimitExceeded) throw new Error(result.outputLimitExceeded ? "Version output exceeded its capture limit" : result.termination === "timeout" ? `Version check timed out after ${timeoutMs} ms` : `Version check failed (${result.signal ?? result.code ?? result.termination})`);
	return `${result.stdout}\n${result.stderr}`;
}
async function resolveManagedCodexAppServerStartOptions(startOptions, options = {}) {
	if (startOptions.transport !== "stdio" || startOptions.commandSource !== "managed") return startOptions;
	const pluginRoot = options.pluginRoot ?? registeredCodexPlugin.root;
	if (!pluginRoot) throw new Error("Codex plugin root is unavailable. Load the Codex plugin before starting its managed app-server.");
	const platform = options.platform ?? process.platform;
	const pathExists = options.pathExists ?? commandPathExists;
	const managedCommandOrder = startOptions.managedCommandOrder ?? "package-first";
	const installed = options.preferInstalled === false ? void 0 : await resolveInstalledCodexForOrder(managedCommandOrder, {
		platform,
		pathExists,
		selectionTimeoutMs: options.selectionTimeoutMs
	});
	const candidateCommandPaths = resolveManagedCodexAppServerCommandCandidates(pluginRoot, platform, managedCommandOrder, installed?.command);
	const commandPaths = [];
	for (const commandPath of candidateCommandPaths) {
		const isInstalled = commandPath === installed?.command;
		if (await pathExists(commandPath, platform) && (!isInstalled || await pathExists(installed.nativeCommand, platform))) commandPaths.push(commandPath);
		else if (isInstalled) rejectInstalledCodexAppServer(commandPath, /* @__PURE__ */ new Error("executable is no longer available"));
	}
	const [commandPath, ...managedFallbackCommandPaths] = commandPaths;
	if (commandPath === void 0) throw new Error([
		`Managed Codex app-server binary was not found for ${MANAGED_CODEX_APP_SERVER_PACKAGE}.`,
		"Reinstall or update OpenClaw, or run pnpm install in a source checkout.",
		"Set plugins.entries.codex.config.appServer.command or OPENCLAW_CODEX_APP_SERVER_BIN to use a custom Codex binary."
	].join(" "));
	return {
		...startOptions,
		command: commandPath,
		commandSource: "resolved-managed",
		...managedFallbackCommandPaths.length > 0 ? { managedFallbackCommandPaths } : {}
	};
}
/** Resolves the native artifact behind a successful managed launcher selection. */
function resolveManagedCodexNativeCommand(command, options = {}) {
	const platform = options.platform ?? process.platform;
	const installedNative = installedCodex.selected;
	if (installedNative?.command === command) return installedNative.nativeCommand;
	if (isManagedCodexDesktopCommand(command, platform)) return command;
	const target = `${platform === "android" ? "linux" : platform}-${options.arch ?? process.arch}`;
	const triple = NATIVE_TARGET_TRIPLES.get(target);
	if (!triple) return;
	const packageRoot = resolveManagedCodexPackageRootForCommand(command, platform);
	if (!packageRoot) return;
	const resolvePackageJson = options.resolvePackageJson ?? resolvePackageJsonFromRoot;
	const pathExists = options.pathExists ?? existsSync;
	const packageJsonPath = resolvePackageJson(`@openai/codex-${target}`, packageRoot) ?? resolvePackageJson("@openai/codex", packageRoot);
	if (!packageJsonPath) return;
	const candidate = path.join(path.dirname(packageJsonPath), "vendor", triple, "bin", platform === "win32" ? "codex.exe" : "codex");
	return pathExists(candidate) ? candidate : void 0;
}
/** Recognizes only the official npm entrypoint, not arbitrary configured wrappers. */
function resolvePackagedCodexNativeCommand(entrypoint) {
	const packageRoot = path.dirname(path.dirname(entrypoint));
	if (path.basename(packageRoot) !== "codex" || path.basename(path.dirname(packageRoot)) !== "@openai" || path.relative(packageRoot, entrypoint) !== path.join("bin", "codex.js")) return;
	return resolveManagedCodexNativeCommand(entrypoint);
}
function isManagedCodexDesktopCommand(command, platform = process.platform) {
	return platform === "darwin" && resolveMacOSDesktopCodexAppServerCommandCandidates(platform).includes(command);
}
function resolveManagedCodexPackageRootForCommand(command, platform) {
	const pathApi = platform === "win32" ? path.win32 : path.posix;
	const commandPaths = [command];
	try {
		commandPaths.unshift(realpathSync(command));
	} catch {}
	for (const commandPath of commandPaths) {
		let current = pathApi.dirname(commandPath);
		while (true) {
			if (pathApi.basename(current) === "codex" && pathApi.basename(pathApi.dirname(current)) === "@openai") return current;
			if (pathApi.basename(current) === ".bin") return pathApi.join(pathApi.dirname(current), "@openai", "codex");
			const parent = pathApi.dirname(current);
			if (parent === current) break;
			current = parent;
		}
	}
}
function resolvePackageJsonFromRoot(packageName, root) {
	try {
		const manifestPath = realpathSync(path.join(root, "package.json"));
		return createRequire(manifestPath).resolve(`${packageName}/package.json`);
	} catch {
		return;
	}
}
function resolveManagedCodexAppServerCommandCandidates(pluginRoot, platform, managedCommandOrder, installedCommand) {
	const packageCommandPaths = [installedCommand, resolveManagedCodexPackageEntrypoint(pluginRoot)].filter((command) => command !== void 0);
	if (managedCommandOrder === "package-only") return packageCommandPaths;
	const desktopCommandPaths = resolveMacOSDesktopCodexAppServerCommandCandidates(platform);
	return managedCommandOrder === "desktop-first" ? [...desktopCommandPaths, ...packageCommandPaths] : [...packageCommandPaths, ...desktopCommandPaths];
}
function resolveManagedCodexPackageEntrypoint(pluginRoot) {
	try {
		return createRequire(path.join(pluginRoot, "package.json")).resolve(`${MANAGED_CODEX_APP_SERVER_PACKAGE}/bin/codex.js`);
	} catch {
		return;
	}
}
async function commandPathExists(filePath, platform) {
	try {
		await access(filePath, platform === "win32" ? constants.F_OK : constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
//#endregion
export { MIN_SUPPORTED_CODEX_APP_SERVER_VERSION as _, isManagedCodexDesktopCommand as a, resolveMacOSDesktopCodexBundledMarketplaceCandidates as b, readInstalledCodexAppServerStatus as c, resolveManagedCodexClientVersion as d, resolveManagedCodexNativeCommand as f, CODEX_APP_SERVER_VERSION as g, setManagedCodexPluginRoot as h, assertInstalledCodexAppServerVersion as i, rejectInstalledCodexAppServer as l, runCodexVersionCommand as m, INSTALLED_CODEX_PROBE_TIMEOUT_MS as n, managed_binary_exports as o, resolvePackagedCodexNativeCommand as p, INSTALLED_CODEX_START_TIMEOUT_MS as r, parseCodexVersion as s, CODEX_VERSION_TIMEOUT_MS as t, resolveManagedCodexAppServerStartOptions as u, resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath as v, resolveMacOSDesktopCodexComputerUseServiceAppCandidates as x, resolveMacOSDesktopCodexAppPathCandidates as y };
