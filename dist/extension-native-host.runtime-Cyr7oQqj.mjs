import { i as resolveBrowserConfig, s as resolveProfile } from "./config-xjgIR3E-.mjs";
import { t as readBrowserHostConfig } from "./extension-host-config-CElEV7KJ.mjs";
import { n as readExtensionRelayToken } from "./relay-auth-B3T3jEbR.mjs";
import { t as buildBrowserExtensionPairing } from "./extension-pairing-DioqVw_X.mjs";
import { spawn } from "node:child_process";
import net from "node:net";
//#region extensions/browser/src/browser/extension-relay-daemon-spawn.ts
const PORT_PROBE_TIMEOUT_MS = 750;
/** True when something already accepts connections on the loopback port. */
async function isRelayPortServed(port) {
	return await new Promise((resolve) => {
		const socket = net.connect({
			host: "127.0.0.1",
			port
		});
		const finish = (served) => {
			socket.destroy();
			resolve(served);
		};
		socket.setTimeout(PORT_PROBE_TIMEOUT_MS, () => finish(false));
		socket.once("connect", () => finish(true));
		socket.once("error", () => finish(false));
	});
}
/**
* Ensure the standalone relay daemon serves the extension relay port. The
* daemon is spawned detached so it outlives this one-shot native host; binding
* the port is the single-instance lock, so concurrent spawns are harmless.
*/
async function ensureExtensionRelayDaemonProcess(params) {
	const resolved = resolveBrowserConfig(params.cfg.browser, params.cfg);
	const configured = Object.keys(resolved.profiles).some((name) => {
		return resolved.profiles[name]?.driver === "extension" && resolveProfile(resolved, name)?.cdpPort === params.port;
	});
	if (!resolved.enabled || !configured) throw new Error("Relay port is not configured for an extension profile");
	if (!readExtensionRelayToken()) return "skipped";
	if (await isRelayPortServed(params.port)) return "running";
	spawn(process.execPath, [
		params.entryPath,
		"--port",
		String(params.port)
	], {
		detached: true,
		stdio: "ignore"
	}).unref();
	return "spawned";
}
//#endregion
//#region extensions/browser/src/browser/extension-native-host.runtime.ts
async function buildBrowserNativeHostPairing(profile) {
	return buildBrowserExtensionPairing({
		cfg: await readBrowserHostConfig(),
		localTransport: "gateway",
		profile
	});
}
async function ensureBrowserNativeRelay(port, entryPath) {
	return ensureExtensionRelayDaemonProcess({
		port,
		cfg: await readBrowserHostConfig(),
		entryPath
	});
}
//#endregion
export { buildBrowserNativeHostPairing, ensureBrowserNativeRelay };
