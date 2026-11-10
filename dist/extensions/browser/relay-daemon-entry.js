import { a as extractErrorCode } from "../../error-coercion-BwMr25F8.mjs";
import { t as createSubsystemLogger } from "../../subsystem-mStysHHC.mjs";
import { t as captureRuntimeConfigAsyncReader } from "../../io.runtime-Ds5uC0Bf.mjs";
import "../../security-runtime-6domDoE8.mjs";
import "../../runtime-config-snapshot-kTPhBdOK.mjs";
import "../../logging-core-CsXmxYo2.mjs";
import { a as createDeferred } from "../../extension-shared-Bp_Ziw8S.mjs";
import { i as resolveBrowserConfig, s as resolveProfile } from "../../config-xjgIR3E-.mjs";
import { t as readBrowserHostConfig } from "../../extension-host-config-CElEV7KJ.mjs";
import { n as readExtensionRelayToken } from "../../relay-auth-B3T3jEbR.mjs";
import { n as startExtensionRelayServer } from "../../relay-server-BZJInYjI.mjs";
//#region extensions/browser/src/browser/relay-daemon.ts
const log = createSubsystemLogger("browser").child("relay-daemon");
/** Default grace before a daemon with no extension and no CDP clients exits. */
const RELAY_DAEMON_IDLE_EXIT_MS = 6e5;
const IDLE_POLL_MS = 3e4;
/**
* Run the standalone extension relay daemon: one loopback relay server with no
* Gateway. The daemon stays alive while the paired extension holds its relay
* connection or a CDP client is attached, and exits once both sides have been
* gone for the idle grace so an idle daemon never outlives Chrome.
*/
async function runExtensionRelayDaemon(params) {
	const allowLegacyAuth = params.allowLegacyAuth ?? false;
	const now = Date.now;
	const completion = createDeferred();
	const token = readExtensionRelayToken();
	if (!token) {
		log.warn("relay daemon refused to start: no extension relay credential");
		completion.resolve("no-credential");
		return {
			done: completion.promise,
			port: null,
			stop: () => {}
		};
	}
	let handle;
	try {
		const config = await captureRuntimeConfigAsyncReader()();
		const resolved = resolveBrowserConfig(config.browser, config);
		const profiles = Object.keys(resolved.profiles).filter((name) => {
			const profile = resolveProfile(resolved, name);
			return profile?.driver === "extension" && profile.cdpPort === params.port;
		});
		const profileName = profiles.length === 1 ? profiles[0] : void 0;
		handle = await startExtensionRelayServer({
			port: params.port,
			token,
			allowLegacyAuth,
			profileName
		});
	} catch (error) {
		if (extractErrorCode(error) === "EADDRINUSE") {
			log.info(`relay port ${params.port} is already served; standalone daemon not needed`);
			completion.resolve("port-in-use");
			return {
				done: completion.promise,
				port: null,
				stop: () => {}
			};
		}
		throw error;
	}
	log.info(`standalone extension relay listening on 127.0.0.1:${handle.port}`);
	let lastActiveAtMs = now();
	let stopped = false;
	const finish = (reason) => {
		if (stopped) return;
		stopped = true;
		clearInterval(idleTimer);
		handle.close().then(() => completion.resolve(reason), completion.reject);
	};
	const idleTimer = setInterval(() => {
		if (handle.bridge.extensionConnected || handle.bridge.cdpClientCount > 0) {
			lastActiveAtMs = now();
			return;
		}
		if (now() - lastActiveAtMs >= RELAY_DAEMON_IDLE_EXIT_MS) {
			log.info("relay daemon idle (no extension, no CDP clients); exiting");
			finish("idle");
		}
	}, IDLE_POLL_MS);
	idleTimer.unref?.();
	return {
		done: completion.promise,
		port: handle.port,
		stop: () => finish("stopped")
	};
}
//#endregion
//#region extensions/browser/relay-daemon-entry.ts
/**
* Standalone extension relay daemon. Hosts the loopback relay the OpenClaw
* Chrome extension dials, with no Gateway required — CDP clients (mcporter,
* Playwright, chrome-devtools-mcp) attach through the same relay port. Spawned
* on demand by the native messaging host, or run manually.
*/
const DEFAULT_RELAY_PORT = 18799;
/**
* The standalone daemon is v2-only by default. Honor an explicit
* `browser.extensionRelay.allowLegacyAuth=true` opt-in, but never fall back to
* legacy on a read/parse failure — fail closed to the stricter mode. Read the
* raw config value (not the resolved `?? true` default) so an unset key stays
* v2-only rather than inheriting the gateway's permissive default.
*/
async function resolveAllowLegacyAuth() {
	try {
		return (await readBrowserHostConfig()).browser?.extensionRelay?.allowLegacyAuth === true;
	} catch {
		return false;
	}
}
function resolvePortArgument(argv) {
	const index = argv.indexOf("--port");
	const raw = index >= 0 ? argv[index + 1] : void 0;
	if (raw === void 0) return DEFAULT_RELAY_PORT;
	const parsed = Number(raw);
	if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > 65535) throw new Error(`invalid --port value: ${raw}`);
	return parsed;
}
async function main() {
	const run = await runExtensionRelayDaemon({
		port: resolvePortArgument(process.argv.slice(2)),
		allowLegacyAuth: await resolveAllowLegacyAuth()
	});
	const stop = () => run.stop();
	process.once("SIGINT", stop);
	process.once("SIGTERM", stop);
	const reason = await run.done;
	process.exitCode = reason === "no-credential" ? 1 : 0;
}
main().catch((error) => {
	process.stderr.write(`openclaw relay daemon failed: ${String(error)}\n`);
	process.exitCode = 1;
});
//#endregion
export {};
