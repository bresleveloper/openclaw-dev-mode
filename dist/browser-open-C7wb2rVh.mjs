import { a as getWindowsSystem32ExePath } from "./windows-install-roots-BWNEWHjx.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { t as isWSL } from "./wsl-DAucJ7y0.mjs";
import { t as detectBinary } from "./detect-binary-BlNusQ8Q.mjs";
import { pathToFileURL } from "node:url";
import path from "node:path";
//#region src/infra/browser-open.ts
/** Resolve the platform command used to open an HTTP(S) URL in a browser. */
async function resolveBrowserOpenCommand(environment = {}) {
	const platform = environment.platform ?? process.platform;
	const env = environment.env ?? process.env;
	const hasDisplay = Boolean(env.DISPLAY || env.WAYLAND_DISPLAY);
	if ((Boolean(env.SSH_CLIENT) || Boolean(env.SSH_TTY) || Boolean(env.SSH_CONNECTION)) && !hasDisplay && platform !== "win32" && platform !== "darwin") return {
		argv: null,
		reason: "ssh-no-display"
	};
	if (platform === "win32") return { argv: [getWindowsSystem32ExePath("rundll32.exe"), "url.dll,FileProtocolHandler"] };
	if (platform !== "darwin" && platform !== "linux") return {
		argv: null,
		reason: "unsupported-platform"
	};
	if (platform === "linux") {
		const wsl = await isWSL(environment);
		if (!hasDisplay && !wsl) return {
			argv: null,
			reason: "no-display"
		};
		if (wsl) {
			if (await detectBinary("wslview")) return { argv: ["wslview"] };
			if (!hasDisplay) return {
				argv: null,
				reason: "wsl-no-wslview"
			};
		}
	}
	const command = platform === "darwin" ? "open" : "xdg-open";
	return await detectBinary(command) ? { argv: [command] } : {
		argv: null,
		reason: `missing-${command}`
	};
}
/** Report whether browser opening is currently available. */
async function detectBrowserOpenSupport(environment = {}) {
	const resolved = await resolveBrowserOpenCommand(environment);
	if (!resolved.argv) return {
		ok: false,
		reason: resolved.reason
	};
	return { ok: true };
}
/** Open a safe HTTP(S) URL in the user's browser when the platform supports it. */
async function openUrl(url) {
	if (process.env.VITEST || false) return false;
	const parsed = URL.parse(url);
	if (parsed?.protocol !== "http:" && parsed?.protocol !== "https:") return false;
	return await openBrowserPath(parsed.toString());
}
/**
* Open a local file in the user's browser when the platform supports it.
*
* Unlike {@link openUrl}, this accepts a `file://` path for private browser
* handoffs: the path contains no credential, so passing it as an opener
* argument does not expose secret material through process command lines.
* The target file itself is the caller's responsibility (for example a
* mode-0600 document inside a mode-0700 directory).
*/
async function openLocalFile(filePath) {
	if (process.env.VITEST || false) return false;
	const windows = process.platform === "win32";
	const platformPath = windows ? path.win32 : path.posix;
	if (!platformPath.isAbsolute(filePath)) return false;
	return await openBrowserPath(pathToFileURL(platformPath.resolve(filePath), { windows }).toString());
}
async function openBrowserPath(normalizedPath) {
	const resolved = await resolveBrowserOpenCommand();
	if (!resolved.argv) return false;
	const command = [...resolved.argv, normalizedPath];
	try {
		const result = await runCommandWithTimeout(command, { timeoutMs: 5e3 });
		return result.code === 0 && result.termination === "exit";
	} catch {
		return false;
	}
}
//#endregion
export { openLocalFile as n, openUrl as r, detectBrowserOpenSupport as t };
