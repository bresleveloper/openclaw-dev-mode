import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import os from "node:os";
//#region extensions/browser/src/browser/chrome.executable-probe.ts
const CHROME_VERSION_RE = /\b(\d+)(?:\.\d+){1,3}\b/g;
const BROWSER_VERSION_TIMEOUT_MS = 6e3;
const MAC_PLISTBUDDY_TIMEOUT_MS = 800;
const WINDOWS_FILE_METADATA_TIMEOUT_MS = 4e3;
function execBrowserProbe(command, args, timeoutMs = 1200, maxBuffer = 1048576) {
	try {
		const output = execFileSync(command, args, {
			timeout: timeoutMs,
			encoding: "utf8",
			maxBuffer
		});
		return normalizeOptionalString(output) ?? null;
	} catch {
		return null;
	}
}
/** Read a browser executable version from platform metadata or a command-line probe. */
function readBrowserVersion(executablePath) {
	if (process.platform === "darwin") {
		const bundleVersion = readMacBundleBrowserVersion(executablePath);
		if (bundleVersion) return bundleVersion;
	}
	if (process.platform === "win32") return readWindowsBrowserVersion(executablePath);
	const output = execBrowserProbe(executablePath, ["--version"], BROWSER_VERSION_TIMEOUT_MS);
	if (!output) return null;
	return output.replace(/\s+/g, " ").trim();
}
function readMacBundleBrowserVersion(executablePath) {
	const appBundlePath = resolveMacAppBundlePath(executablePath);
	if (!appBundlePath) return null;
	return execBrowserProbe("/usr/libexec/PlistBuddy", [
		"-c",
		"Print :CFBundleShortVersionString",
		path.join(appBundlePath, "Contents", "Info.plist")
	], MAC_PLISTBUDDY_TIMEOUT_MS);
}
const WINDOWS_VERSION_DIR_RE = /^\d+(?:\.\d+){1,3}$/;
function readWindowsBrowserVersion(executablePath) {
	const configuredSystemRoot = normalizeOptionalString(process.env.SystemRoot);
	const systemRoot = configuredSystemRoot && path.win32.isAbsolute(configuredSystemRoot) ? configuredSystemRoot : "C:\\Windows";
	const metadataVersion = execBrowserProbe(path.win32.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe"), [
		"-NoProfile",
		"-NonInteractive",
		"-Command",
		"[System.Diagnostics.FileVersionInfo]::GetVersionInfo($args[0]).ProductVersion",
		executablePath
	], WINDOWS_FILE_METADATA_TIMEOUT_MS);
	if (metadataVersion) return metadataVersion.replace(/\s+/g, " ").trim();
	try {
		const versionDirs = fs.readdirSync(path.win32.dirname(executablePath), { withFileTypes: true }).filter((entry) => entry.isDirectory() && WINDOWS_VERSION_DIR_RE.test(entry.name));
		return versionDirs.length === 1 ? versionDirs[0]?.name ?? null : null;
	} catch {
		return null;
	}
}
function resolveMacAppBundlePath(executablePath) {
	const parts = path.normalize(executablePath).split(path.sep);
	const appIndex = parts.findIndex((part) => part.endsWith(".app"));
	if (appIndex < 0) return null;
	return parts.slice(0, appIndex + 1).join(path.sep) || path.sep;
}
/** Parse a major browser version from a raw version string. */
function parseBrowserMajorVersion(rawVersion) {
	const match = [...(rawVersion ?? "").matchAll(CHROME_VERSION_RE)].at(-1);
	if (!match?.[1]) return null;
	const major = Number.parseInt(match[1], 10);
	return Number.isFinite(major) ? major : null;
}
//#endregion
//#region extensions/browser/src/browser/chrome.executables.ts
/** Chromium-family executable discovery across supported platforms. */
const PLAYWRIGHT_BROWSERS_PATH_ENV = "PLAYWRIGHT_BROWSERS_PATH";
const DEFAULT_WINDOWS_PROGRAM_FILES = "C:\\Program Files";
const DEFAULT_WINDOWS_PROGRAM_FILES_X86 = "C:\\Program Files (x86)";
const CHROMIUM_BUNDLE_IDS = /* @__PURE__ */ new Set([
	"com.google.Chrome",
	"com.google.Chrome.beta",
	"com.google.Chrome.canary",
	"com.google.Chrome.dev",
	"com.brave.Browser",
	"com.brave.Browser.beta",
	"com.brave.Browser.nightly",
	"com.microsoft.Edge",
	"com.microsoft.EdgeBeta",
	"com.microsoft.EdgeDev",
	"com.microsoft.EdgeCanary",
	"com.microsoft.edgemac",
	"com.microsoft.edgemac.beta",
	"com.microsoft.edgemac.dev",
	"com.microsoft.edgemac.canary",
	"org.chromium.Chromium",
	"com.vivaldi.Vivaldi",
	"com.operasoftware.Opera",
	"com.operasoftware.OperaGX",
	"com.yandex.desktop.yandex-browser",
	"company.thebrowser.Browser"
]);
const CHROMIUM_DESKTOP_IDS = /* @__PURE__ */ new Set([
	"google-chrome.desktop",
	"google-chrome-beta.desktop",
	"google-chrome-unstable.desktop",
	"brave-browser.desktop",
	"microsoft-edge.desktop",
	"microsoft-edge-beta.desktop",
	"microsoft-edge-dev.desktop",
	"microsoft-edge-canary.desktop",
	"chromium.desktop",
	"chromium-browser.desktop",
	"vivaldi.desktop",
	"vivaldi-stable.desktop",
	"opera.desktop",
	"opera-gx.desktop",
	"yandex-browser.desktop",
	"org.chromium.Chromium.desktop"
]);
const CHROMIUM_EXE_NAMES = /* @__PURE__ */ new Set([
	"chrome.exe",
	"msedge.exe",
	"brave.exe",
	"brave-browser.exe",
	"chromium.exe",
	"vivaldi.exe",
	"opera.exe",
	"yandex.exe",
	"yandexbrowser.exe",
	"google chrome",
	"google chrome canary",
	"brave browser",
	"microsoft edge",
	"chromium",
	"chrome",
	"brave",
	"msedge",
	"brave-browser",
	"google-chrome",
	"google-chrome-stable",
	"google-chrome-beta",
	"google-chrome-unstable",
	"microsoft-edge",
	"microsoft-edge-beta",
	"microsoft-edge-dev",
	"microsoft-edge-canary",
	"chromium-browser",
	"vivaldi",
	"vivaldi-stable",
	"opera",
	"opera-stable",
	"opera-gx",
	"yandex-browser"
]);
function exists(filePath) {
	try {
		return fs.existsSync(filePath);
	} catch {
		return false;
	}
}
function isExecutable(filePath, platform) {
	try {
		if (!fs.statSync(filePath).isFile()) return false;
		fs.accessSync(filePath, platform === "win32" ? fs.constants.F_OK : fs.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
function inferKindFromIdentifier(identifier) {
	const id = normalizeLowercaseStringOrEmpty(identifier);
	if (id.includes("brave")) return "brave";
	if (id.includes("edge")) return "edge";
	if (id.includes("chromium")) return "chromium";
	if (id.includes("canary")) return "canary";
	if (id.includes("opera") || id.includes("vivaldi") || id.includes("yandex") || id.includes("thebrowser")) return "chromium";
	return "chrome";
}
function detectDefaultChromiumExecutable(platform) {
	if (platform === "darwin") return detectDefaultChromiumExecutableMac();
	if (platform === "linux") return detectDefaultChromiumExecutableLinux();
	if (platform === "win32") return detectDefaultChromiumExecutableWindows();
	return null;
}
function detectDefaultChromiumExecutableMac() {
	const bundleId = detectDefaultBrowserBundleIdMac();
	if (!bundleId || !CHROMIUM_BUNDLE_IDS.has(bundleId)) return null;
	const appPathRaw = execBrowserProbe("/usr/bin/osascript", ["-e", `POSIX path of (path to application id "${bundleId}")`]);
	if (!appPathRaw) return null;
	const appPath = appPathRaw.replace(/\/$/, "");
	const exeName = execBrowserProbe("/usr/bin/defaults", [
		"read",
		path.join(appPath, "Contents", "Info"),
		"CFBundleExecutable"
	]);
	if (!exeName) return null;
	const exePath = path.join(appPath, "Contents", "MacOS", exeName);
	if (!isExecutable(exePath, "darwin")) return null;
	return {
		kind: inferKindFromIdentifier(bundleId),
		path: exePath
	};
}
function detectDefaultBrowserBundleIdMac() {
	const plistPath = path.join(os.homedir(), "Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist");
	if (!exists(plistPath)) return null;
	const handlersRaw = execBrowserProbe("/usr/bin/plutil", [
		"-extract",
		"LSHandlers",
		"json",
		"-o",
		"-",
		"--",
		plistPath
	], 2e3, 5242880);
	if (!handlersRaw) return null;
	let handlers;
	try {
		handlers = JSON.parse(handlersRaw);
	} catch {
		return null;
	}
	if (!Array.isArray(handlers)) return null;
	const resolveScheme = (scheme) => {
		let candidate = null;
		for (const entry of handlers) {
			if (!entry || typeof entry !== "object") continue;
			const record = entry;
			if (record.LSHandlerURLScheme !== scheme) continue;
			const role = typeof record.LSHandlerRoleAll === "string" && record.LSHandlerRoleAll || typeof record.LSHandlerRoleViewer === "string" && record.LSHandlerRoleViewer || null;
			if (role) candidate = role;
		}
		return candidate;
	};
	return resolveScheme("http") ?? resolveScheme("https");
}
function detectDefaultChromiumExecutableLinux() {
	const desktopId = execBrowserProbe("xdg-settings", ["get", "default-web-browser"]) || execBrowserProbe("xdg-mime", [
		"query",
		"default",
		"x-scheme-handler/http"
	]);
	if (!desktopId) return null;
	const trimmed = desktopId.trim();
	if (!CHROMIUM_DESKTOP_IDS.has(trimmed)) return null;
	const desktopPath = findDesktopFilePath(trimmed);
	if (!desktopPath) return null;
	const execLine = readDesktopExecLine(desktopPath);
	if (!execLine) return null;
	const command = extractExecutableFromExecLine(execLine);
	if (!command) return null;
	const resolved = resolveLinuxExecutablePath(command);
	if (!resolved || !isExecutable(resolved, "linux")) return null;
	const exeName = normalizeLowercaseStringOrEmpty(path.posix.basename(resolved));
	if (!CHROMIUM_EXE_NAMES.has(exeName)) return null;
	return {
		kind: inferKindFromIdentifier(exeName),
		path: resolved
	};
}
function detectDefaultChromiumExecutableWindows() {
	const progId = readWindowsProgId();
	const command = (progId ? readWindowsCommandForProgId(progId) : null) || readWindowsCommandForProgId("http");
	if (!command) return null;
	const exePath = extractWindowsExecutablePath(expandWindowsEnvVars(command));
	if (!exePath) return null;
	if (!isExecutable(exePath, "win32")) return null;
	const directPath = resolveDirectWindowsBrowserExecutable(exePath);
	if (!directPath) return null;
	const exeName = normalizeLowercaseStringOrEmpty(path.win32.basename(directPath));
	if (!CHROMIUM_EXE_NAMES.has(exeName)) return null;
	return {
		kind: inferKindFromIdentifier(exeName),
		path: directPath
	};
}
/** Resolve launchers that hand off to another process into a directly owned browser binary. */
function resolveDirectWindowsBrowserExecutable(executablePath) {
	if (normalizeLowercaseStringOrEmpty(path.win32.basename(executablePath)) !== "launcher.exe") return executablePath;
	const installDir = path.win32.dirname(executablePath);
	try {
		const status = JSON.parse(fs.readFileSync(path.win32.join(installDir, "installation_status.json"), "utf8"));
		const subfolder = status && typeof status === "object" ? Reflect.get(status, "_subfolder") : null;
		if (typeof subfolder !== "string" || !WINDOWS_VERSION_DIR_RE.test(subfolder)) return null;
		const candidate = path.win32.join(installDir, subfolder, "opera.exe");
		return exists(candidate) ? candidate : null;
	} catch {
		return null;
	}
}
function findDesktopFilePath(desktopId) {
	const candidates = [
		path.join(os.homedir(), ".local", "share", "applications", desktopId),
		path.join("/usr/local/share/applications", desktopId),
		path.join("/usr/share/applications", desktopId),
		path.join("/var/lib/snapd/desktop/applications", desktopId)
	];
	for (const candidate of candidates) if (exists(candidate)) return candidate;
	return null;
}
function readDesktopExecLine(desktopPath) {
	try {
		const lines = fs.readFileSync(desktopPath, "utf8").split(/\r?\n/);
		for (const line of lines) if (line.startsWith("Exec=")) return line.slice(5).trim();
	} catch {}
	return null;
}
function extractExecutableFromExecLine(execLine) {
	const tokens = splitExecLine(execLine);
	for (const token of tokens) {
		if (!token) continue;
		if (token === "env") continue;
		if (token.includes("=") && !token.startsWith("/") && !token.includes("\\")) continue;
		return token.replace(/^["']|["']$/g, "");
	}
	return null;
}
function splitExecLine(line) {
	const tokens = [];
	let current = "";
	let inQuotes = false;
	let quoteChar = "";
	for (const ch of line) {
		if ((ch === "\"" || ch === "'") && (!inQuotes || ch === quoteChar)) {
			if (inQuotes) {
				inQuotes = false;
				quoteChar = "";
			} else {
				inQuotes = true;
				quoteChar = ch;
			}
			continue;
		}
		if (!inQuotes && /\s/.test(ch)) {
			if (current) {
				tokens.push(current);
				current = "";
			}
			continue;
		}
		current += ch;
	}
	if (current) tokens.push(current);
	return tokens;
}
function resolveLinuxExecutablePath(command) {
	const cleaned = command.trim().replace(/%[a-zA-Z]/g, "");
	if (!cleaned) return null;
	if (cleaned.startsWith("/")) return cleaned;
	const resolved = execBrowserProbe("which", [cleaned], 800);
	return resolved ? resolved.trim() : null;
}
function readWindowsProgId() {
	const output = execBrowserProbe("reg", [
		"query",
		"HKCU\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice",
		"/v",
		"ProgId"
	]);
	if (!output) return null;
	return output.match(/ProgId\s+REG_\w+\s+(.+)$/im)?.[1]?.trim() || null;
}
function readWindowsCommandForProgId(progId) {
	const output = execBrowserProbe("reg", [
		"query",
		progId === "http" ? "HKCR\\http\\shell\\open\\command" : `HKCR\\${progId}\\shell\\open\\command`,
		"/ve"
	]);
	if (!output) return null;
	const match = output.match(/REG_\w+\s+(.+)$/im);
	return normalizeOptionalString(match?.[1]) ?? null;
}
function resolveWindowsBrowserInstallRoots() {
	return {
		localAppData: normalizeOptionalString(process.env.LOCALAPPDATA) ?? path.win32.join(os.homedir(), "AppData", "Local"),
		programFiles: normalizeOptionalString(process.env.ProgramFiles) ?? DEFAULT_WINDOWS_PROGRAM_FILES,
		programFilesX86: normalizeOptionalString(process.env["ProgramFiles(x86)"]) ?? DEFAULT_WINDOWS_PROGRAM_FILES_X86
	};
}
function expandWindowsEnvVars(value) {
	const installRoots = resolveWindowsBrowserInstallRoots();
	const installRootByEnvName = {
		localappdata: installRoots.localAppData,
		programfiles: installRoots.programFiles,
		"programfiles(x86)": installRoots.programFilesX86
	};
	return value.replace(/%([^%]+)%/g, (_match, name) => {
		const key = normalizeOptionalString(name);
		if (!key) return _match;
		return normalizeOptionalString(process.env[key]) ?? installRootByEnvName[key.toLowerCase()] ?? `%${key}%`;
	});
}
function extractWindowsExecutablePath(command) {
	const quoted = command.match(/"([^"]+\.exe)"/i);
	if (quoted?.[1]) return quoted[1];
	const unquoted = command.match(/^\s*(\S+\.exe)(?:\s|$)/i);
	if (unquoted?.[1]) return unquoted[1];
	return null;
}
function findFirstExecutable(candidates, platform) {
	for (const candidate of candidates) if (isExecutable(candidate.path, platform)) return candidate;
	return null;
}
function findFirstChromeExecutable(candidates, platform) {
	for (const candidate of candidates) if (isExecutable(candidate, platform)) {
		const normalizedPath = normalizeLowercaseStringOrEmpty(candidate);
		return {
			kind: normalizedPath.includes("beta") || normalizedPath.includes("canary") || normalizedPath.includes("sxs") || normalizedPath.includes("unstable") ? "canary" : "chrome",
			path: candidate
		};
	}
	return null;
}
function findPlaywrightChromiumExecutableCandidatesLinux() {
	const candidates = [];
	for (const browserPath of getPlaywrightBrowserCachePaths()) for (const entry of readSortedDirNames(browserPath)) {
		if (!entry.startsWith("chromium-")) continue;
		for (const linuxDir of ["chrome-linux64", "chrome-linux"]) candidates.push({
			kind: "chromium",
			path: path.join(browserPath, entry, linuxDir, "chrome")
		});
	}
	return candidates;
}
function getPlaywrightBrowserCachePaths() {
	const configured = normalizeOptionalString(process.env[PLAYWRIGHT_BROWSERS_PATH_ENV]);
	const candidates = [configured && configured !== "0" ? configured : null, path.join(os.homedir(), ".cache", "ms-playwright")];
	const seen = /* @__PURE__ */ new Set();
	return candidates.filter((candidate) => {
		if (!candidate || seen.has(candidate)) return false;
		seen.add(candidate);
		return true;
	});
}
function readSortedDirNames(dir) {
	try {
		return fs.readdirSync(dir).toSorted();
	} catch {
		return [];
	}
}
/** Find the best Chromium-family executable on macOS. */
function findChromeExecutableMac() {
	const applications = [
		["chrome", "Google Chrome"],
		["brave", "Brave Browser"],
		["edge", "Microsoft Edge"],
		["chromium", "Chromium"],
		["canary", "Google Chrome Canary"]
	];
	const roots = ["/Applications", path.join(os.homedir(), "Applications")];
	return findFirstExecutable(applications.flatMap(([kind, name]) => roots.map((root) => ({
		kind,
		path: path.join(root, `${name}.app`, "Contents", "MacOS", name)
	}))), "darwin");
}
function findGoogleChromeExecutableMac() {
	return findFirstChromeExecutable([
		"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
		path.join(os.homedir(), "Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
		"/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
		path.join(os.homedir(), "Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary")
	], "darwin");
}
/** Find the best Chromium-family executable on Linux. */
function findChromeExecutableLinux() {
	return findFirstExecutable([
		{
			kind: "chrome",
			path: "/usr/bin/google-chrome"
		},
		{
			kind: "chrome",
			path: "/usr/bin/google-chrome-stable"
		},
		{
			kind: "chrome",
			path: "/usr/bin/chrome"
		},
		{
			kind: "chrome",
			path: "/opt/google/chrome/chrome"
		},
		{
			kind: "brave",
			path: "/usr/bin/brave-browser"
		},
		{
			kind: "brave",
			path: "/usr/bin/brave-browser-stable"
		},
		{
			kind: "brave",
			path: "/usr/bin/brave"
		},
		{
			kind: "brave",
			path: "/snap/bin/brave"
		},
		{
			kind: "brave",
			path: "/opt/brave.com/brave/brave-browser"
		},
		{
			kind: "edge",
			path: "/usr/bin/microsoft-edge"
		},
		{
			kind: "edge",
			path: "/usr/bin/microsoft-edge-stable"
		},
		{
			kind: "chromium",
			path: "/usr/bin/chromium"
		},
		{
			kind: "chromium",
			path: "/usr/bin/chromium-browser"
		},
		{
			kind: "chromium",
			path: "/usr/lib/chromium/chromium"
		},
		{
			kind: "chromium",
			path: "/usr/lib/chromium-browser/chromium-browser"
		},
		{
			kind: "chromium",
			path: "/snap/bin/chromium"
		},
		...findPlaywrightChromiumExecutableCandidatesLinux()
	], "linux");
}
function findGoogleChromeExecutableLinux() {
	return findFirstChromeExecutable([
		"/usr/bin/google-chrome",
		"/usr/bin/google-chrome-stable",
		"/usr/bin/google-chrome-beta",
		"/usr/bin/google-chrome-unstable",
		"/opt/google/chrome/chrome",
		"/snap/bin/google-chrome"
	], "linux");
}
/** Find the best Chromium-family executable on Windows. */
function findChromeExecutableWindows() {
	const { localAppData, programFiles, programFilesX86 } = resolveWindowsBrowserInstallRoots();
	const browsers = [
		[
			"chrome",
			"Google",
			"Chrome",
			"Application",
			"chrome.exe"
		],
		[
			"brave",
			"BraveSoftware",
			"Brave-Browser",
			"Application",
			"brave.exe"
		],
		[
			"edge",
			"Microsoft",
			"Edge",
			"Application",
			"msedge.exe"
		],
		[
			"chromium",
			"Chromium",
			"Application",
			"chrome.exe"
		],
		[
			"canary",
			"Google",
			"Chrome SxS",
			"Application",
			"chrome.exe"
		]
	];
	const candidates = browsers.map(([kind, ...segments]) => ({
		kind,
		path: path.win32.join(localAppData, ...segments)
	}));
	for (const [kind, ...segments] of browsers.slice(0, 3)) for (const root of [programFiles, programFilesX86]) candidates.push({
		kind,
		path: path.win32.join(root, ...segments)
	});
	return findFirstExecutable(candidates, "win32");
}
function findGoogleChromeExecutableWindows() {
	const { localAppData, programFiles, programFilesX86 } = resolveWindowsBrowserInstallRoots();
	const joinWin = path.win32.join;
	return findFirstChromeExecutable([
		joinWin(localAppData, "Google", "Chrome", "Application", "chrome.exe"),
		joinWin(localAppData, "Google", "Chrome SxS", "Application", "chrome.exe"),
		joinWin(programFiles, "Google", "Chrome", "Application", "chrome.exe"),
		joinWin(programFilesX86, "Google", "Chrome", "Application", "chrome.exe")
	], "win32");
}
/** Resolve the Google Chrome executable for a named platform when available. */
function resolveGoogleChromeExecutableForPlatform(platform) {
	if (platform === "darwin") return findGoogleChromeExecutableMac();
	if (platform === "linux") return findGoogleChromeExecutableLinux();
	if (platform === "win32") return findGoogleChromeExecutableWindows();
	return null;
}
/** Resolve the preferred Chromium-family executable for a platform. */
function resolveBrowserExecutableForPlatform(resolved, platform) {
	if (resolved.executablePath) {
		if (!exists(resolved.executablePath)) throw new Error(`browser.executablePath not found: ${resolved.executablePath}`);
		const directPath = platform === "win32" ? resolveDirectWindowsBrowserExecutable(resolved.executablePath) : resolved.executablePath;
		if (!directPath) throw new Error(`browser.executablePath must point to the browser executable, not a handoff launcher: ${resolved.executablePath}`);
		return {
			kind: "custom",
			path: directPath
		};
	}
	const detected = detectDefaultChromiumExecutable(platform);
	if (detected) return detected;
	if (platform === "darwin") return findChromeExecutableMac();
	if (platform === "linux") return findChromeExecutableLinux();
	if (platform === "win32") return findChromeExecutableWindows();
	return null;
}
//#endregion
export { readBrowserVersion as i, resolveGoogleChromeExecutableForPlatform as n, parseBrowserMajorVersion as r, resolveBrowserExecutableForPlatform as t };
