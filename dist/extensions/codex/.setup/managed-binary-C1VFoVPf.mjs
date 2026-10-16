import { t as __exportAll } from "./session-binding-sidecars-BrdV95Fg.mjs";
import { createRequire } from "node:module";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { constants, existsSync, realpathSync } from "node:fs";
import path from "node:path";
import { access } from "node:fs/promises";
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
		appServerCommandPath: path.join(appBundlePath, "Contents", "Resources", "codex-cli", "CodexCLI.app", "Contents", "MacOS", "codex")
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
	const orderedCandidates = matchingCandidate ? [matchingCandidate, ...candidates.filter((candidate) => candidate !== matchingCandidate)] : candidates;
	return [...new Set(orderedCandidates.flatMap((candidate) => candidate.computerUseServiceAppPaths))];
}
function resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath(params = {}) {
	const candidates = params.candidates ?? resolveMacOSDesktopCodexBundledMarketplaceCandidates(params.platform);
	const pathExists = params.pathExists ?? existsSync;
	return candidates.find((candidate) => pathExists(candidate));
}
//#endregion
//#region extensions/codex/src/app-server/version.ts
/** Exact Codex app-server version shipped by the OpenClaw Codex bridge. */
const CODEX_APP_SERVER_VERSION = "0.160.0";
/** Inclusive runtime compatibility floor for external app-server binaries. */
const MIN_SUPPORTED_CODEX_APP_SERVER_VERSION = "0.149.0";
const MANAGED_CODEX_APP_SERVER_PACKAGE = "@openai/codex";
//#endregion
//#region extensions/codex/src/app-server/managed-binary.ts
/**
* Resolves the managed Codex app-server binary shipped with or installed beside
* the Codex plugin before stdio startup.
*/
var managed_binary_exports = /* @__PURE__ */ __exportAll({
	isManagedCodexDesktopCommand: () => isManagedCodexDesktopCommand,
	resolveManagedCodexAppServerStartOptions: () => resolveManagedCodexAppServerStartOptions,
	resolveManagedCodexNativeCommand: () => resolveManagedCodexNativeCommand,
	resolveManagedCodexPackageEntrypoint: () => resolveManagedCodexPackageEntrypoint,
	resolvePackagedCodexNativeCommand: () => resolvePackagedCodexNativeCommand,
	setManagedCodexPluginRoot: () => setManagedCodexPluginRoot
});
const registeredCodexPlugin = resolveGlobalSingleton(Symbol.for("openclaw.codexManagedPluginRoot"), () => ({}));
/** Records the process-stable plugin root prepared by OpenClaw's plugin loader. */
function setManagedCodexPluginRoot(pluginRoot) {
	registeredCodexPlugin.root = pluginRoot;
}
/** Rewrites managed stdio start options to point at an executable Codex binary path. */
async function resolveManagedCodexAppServerStartOptions(startOptions, options = {}) {
	if (startOptions.transport !== "stdio" || startOptions.commandSource !== "managed") return startOptions;
	const pluginRoot = options.pluginRoot ?? registeredCodexPlugin.root;
	if (!pluginRoot) throw new Error("Codex plugin root is unavailable. Load the Codex plugin before starting its managed app-server.");
	const platform = options.platform ?? process.platform;
	const candidateCommandPaths = resolveManagedCodexAppServerCommandCandidates(pluginRoot, platform, startOptions.managedCommandOrder ?? "package-first");
	const pathExists = options.pathExists ?? commandPathExists;
	const commandPaths = [];
	for (const commandPath of candidateCommandPaths) if (await pathExists(commandPath, platform)) commandPaths.push(commandPath);
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
	if (isManagedCodexDesktopCommand(command, platform)) return command;
	const target = resolveCodexNativeTarget(platform, options.arch ?? process.arch);
	if (!target) return;
	const packageRoot = resolveManagedCodexPackageRootForCommand(command, platform);
	if (!packageRoot) return;
	const resolvePackageJson = options.resolvePackageJson ?? resolvePackageJsonFromRoot;
	const pathExists = options.pathExists ?? existsSync;
	const packageJsonPath = resolvePackageJson(target.packageName, packageRoot) ?? resolvePackageJson("@openai/codex", packageRoot);
	if (!packageJsonPath) return;
	const candidate = path.join(path.dirname(packageJsonPath), "vendor", target.triple, "bin", platform === "win32" ? "codex.exe" : "codex");
	return pathExists(candidate) ? candidate : void 0;
}
/** Recognizes only the official npm entrypoint, not arbitrary configured wrappers. */
function resolvePackagedCodexNativeCommand(entrypoint) {
	const packageRoot = path.dirname(path.dirname(entrypoint));
	if (path.basename(packageRoot) !== "codex" || path.basename(path.dirname(packageRoot)) !== "@openai" || path.relative(packageRoot, entrypoint) !== path.join("bin", "codex.js")) return;
	return resolveManagedCodexNativeCommand(entrypoint);
}
/** Returns whether a command is one of the standard macOS desktop app executables. */
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
function resolveCodexNativeTarget(platform, arch) {
	if ((platform === "linux" || platform === "android") && arch === "x64") return {
		packageName: "@openai/codex-linux-x64",
		triple: "x86_64-unknown-linux-musl"
	};
	if ((platform === "linux" || platform === "android") && arch === "arm64") return {
		packageName: "@openai/codex-linux-arm64",
		triple: "aarch64-unknown-linux-musl"
	};
	if (platform === "darwin" && arch === "x64") return {
		packageName: "@openai/codex-darwin-x64",
		triple: "x86_64-apple-darwin"
	};
	if (platform === "darwin" && arch === "arm64") return {
		packageName: "@openai/codex-darwin-arm64",
		triple: "aarch64-apple-darwin"
	};
	if (platform === "win32" && arch === "x64") return {
		packageName: "@openai/codex-win32-x64",
		triple: "x86_64-pc-windows-msvc"
	};
	if (platform === "win32" && arch === "arm64") return {
		packageName: "@openai/codex-win32-arm64",
		triple: "aarch64-pc-windows-msvc"
	};
}
function resolvePackageJsonFromRoot(packageName, root) {
	try {
		const manifestPath = realpathSync(path.join(root, "package.json"));
		return createRequire(manifestPath).resolve(`${packageName}/package.json`);
	} catch {
		return;
	}
}
function resolveManagedCodexAppServerCommandCandidates(pluginRoot, platform, managedCommandOrder) {
	const packageCommand = resolveManagedCodexPackageEntrypoint(pluginRoot);
	const packageCommandPaths = packageCommand ? [packageCommand] : [];
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
export { resolvePackagedCodexNativeCommand as a, MIN_SUPPORTED_CODEX_APP_SERVER_VERSION as c, resolveMacOSDesktopCodexBundledMarketplaceCandidates as d, resolveMacOSDesktopCodexComputerUseServiceAppCandidates as f, resolveManagedCodexNativeCommand as i, resolveFirstExistingMacOSDesktopCodexBundledMarketplacePath as l, managed_binary_exports as n, setManagedCodexPluginRoot as o, resolveManagedCodexAppServerStartOptions as r, CODEX_APP_SERVER_VERSION as s, isManagedCodexDesktopCommand as t, resolveMacOSDesktopCodexAppPathCandidates as u };
