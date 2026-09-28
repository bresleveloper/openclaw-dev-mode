import { i as resolveBrowserConfig, s as resolveProfile } from "./config-fMVye_Fl.mjs";
import { t as readBrowserHostConfig } from "./extension-host-config-n0nWqOeB.mjs";
import { n as readExtensionRelayToken } from "./relay-auth-BkA-pgXS.mjs";
import { t as buildBrowserExtensionPairing } from "./extension-pairing-Brv0kHvE.mjs";
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
	if (!(params.readToken ?? readExtensionRelayToken)()) return "skipped";
	if (await (params.probe ?? isRelayPortServed)(params.port)) return "running";
	(params.spawnProcess ?? ((command, args) => {
		spawn(command, args, {
			detached: true,
			stdio: "ignore"
		}).unref();
	}))(params.execPath ?? process.execPath, [
		params.entryPath,
		"--port",
		String(params.port)
	]);
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
