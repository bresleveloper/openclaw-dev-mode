import { a as getWindowsSystem32ExePath } from "./windows-install-roots-Qi4d52Il.mjs";
import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { t as isWSL } from "./wsl-DAucJ7y0.mjs";
import { t as detectBinary } from "./detect-binary-1PDZeQ8f.mjs";
//#region src/infra/browser-open.ts
function normalizeBrowserOpenUrl(raw) {
	try {
		const parsed = new URL(raw);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
		return parsed.toString();
	} catch {
		return null;
	}
}
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
	if (platform === "darwin") return await detectBinary("open") ? { argv: ["open"] } : {
		argv: null,
		reason: "missing-open"
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
		return await detectBinary("xdg-open") ? { argv: ["xdg-open"] } : {
			argv: null,
			reason: "missing-xdg-open"
		};
	}
	return {
		argv: null,
		reason: "unsupported-platform"
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
	const normalizedUrl = normalizeBrowserOpenUrl(url);
	if (!normalizedUrl) return false;
	const resolved = await resolveBrowserOpenCommand();
	if (!resolved.argv) return false;
	const command = [...resolved.argv, normalizedUrl];
	try {
		const result = await runCommandWithTimeout(command, { timeoutMs: 5e3 });
		return result.code === 0 && result.termination === "exit";
	} catch {
		return false;
	}
}
//#endregion
export { openUrl as n, resolveBrowserOpenCommand as r, detectBrowserOpenSupport as t };
