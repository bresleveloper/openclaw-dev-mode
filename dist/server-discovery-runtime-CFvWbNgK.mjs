import { m as clampTimerTimeoutMs, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { n as parseTcpPort } from "./tcp-port-BVV_ljmK.mjs";
import { c as runPluginCleanup, i as getPluginValueInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import { n as pickPrimaryTailnetIPv4, r as pickPrimaryTailnetIPv6 } from "./tailnet-tYVaPrxr.mjs";
import { i as getTailnetHostname } from "./tailscale-BRIsmHIP.mjs";
import { a as resolveWideAreaDiscoveryDomain, o as writeWideAreaGatewayZone } from "./widearea-dns-BFMogE6t.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/gateway/server-discovery.ts
/** Formats the Bonjour instance name while preserving user-provided OpenClaw names. */
function formatBonjourInstanceName(displayName) {
	const trimmed = displayName.trim();
	if (!trimmed) return "OpenClaw";
	if (/openclaw/i.test(trimmed)) return trimmed;
	return `${trimmed} (OpenClaw)`;
}
/** Resolves the CLI path advertised to Bonjour clients, preferring explicit env config. */
function resolveBonjourCliPath(opts = {}) {
	const envPath = (opts.env ?? process.env).OPENCLAW_CLI_PATH?.trim();
	if (envPath) return envPath;
	const statSync = opts.statSync ?? fs.statSync;
	const isFile = (candidate) => {
		try {
			return statSync(candidate).isFile();
		} catch {
			return false;
		}
	};
	const execPath = opts.execPath ?? process.execPath;
	const execDir = path.dirname(execPath);
	const siblingCli = path.join(execDir, "openclaw");
	if (isFile(siblingCli)) return siblingCli;
	const argvPath = (opts.argv ?? process.argv)[1];
	if (argvPath && isFile(argvPath)) return argvPath;
	const cwd = opts.cwd ?? process.cwd();
	const distCli = path.join(cwd, "dist", "index.js");
	if (isFile(distCli)) return distCli;
	const binCli = path.join(cwd, "bin", "openclaw");
	if (isFile(binCli)) return binCli;
}
/** Resolves a Tailnet DNS hint from env or the local tailscale CLI when enabled. */
async function resolveTailnetDnsHint(opts) {
	const envRaw = (opts?.env ?? process.env).OPENCLAW_TAILNET_DNS?.trim();
	const envValue = envRaw && envRaw.length > 0 ? envRaw.replace(/\.$/, "") : "";
	if (envValue) return envValue;
	if (opts?.enabled === false) return;
	const exec = opts?.exec ?? ((command, args) => runExec(command, args, {
		timeoutMs: 1500,
		maxBuffer: 2e5
	}));
	try {
		return await getTailnetHostname(exec);
	} catch {
		return;
	}
}
//#endregion
//#region src/gateway/server-discovery-runtime.ts
/** One owner replaces local advertisements and keeps wide-area TXT policy in sync. */
async function startGatewayDiscovery(params) {
	let mode = params.discovery?.mdns?.mode ?? "minimal";
	let tlsFingerprint = params.gatewayTls?.fingerprintSha256;
	const wideAreaDomain = params.discovery?.wideArea?.domain;
	let services = params.gatewayDiscoveryServices ?? [];
	let claim = params.pluginRuntimeClaim;
	let current;
	let closed = false;
	let pending = Promise.resolve();
	let cleanup = Promise.resolve();
	const isCurrent = (generation) => !closed && current === generation;
	const stopService = (stop) => {
		cleanup = cleanup.then(stop).catch((err) => {
			params.logDiscovery.warn(`gateway discovery stop failed: ${String(err)}`);
		});
		return cleanup;
	};
	const stopGeneration = async (generation) => {
		for (const [entry, advertisement] of [...generation?.services ?? []].toReversed()) {
			if (current !== generation && current?.services.get(entry) === advertisement) continue;
			generation?.services.delete(entry);
			const stop = advertisement.stop;
			advertisement.stop = void 0;
			if (stop) stopService(stop);
		}
		let drained;
		do {
			drained = cleanup;
			await drained;
		} while (drained !== cleanup);
	};
	const enqueue = (operation) => {
		const result = pending.then(operation);
		pending = result.catch(() => {});
		return result;
	};
	const waitForClaim = (generation) => {
		if (generation.waiting) return;
		generation.waiting = true;
		generation.claim.waitForUnblocked().then((accepted) => enqueue(async () => {
			generation.waiting = false;
			if (isCurrent(generation)) await (accepted ? advertise(generation) : stopGeneration(generation));
		})).catch((err) => params.logDiscovery.warn(`gateway discovery refresh failed: ${String(err)}`));
	};
	const advertise = async (generation) => {
		if (!isCurrent(generation)) return;
		const localEnabled = generation.mode !== "off" && !isTruthyEnvValue(process.env.OPENCLAW_DISABLE_BONJOUR) && !process.env.VITEST;
		const minimal = generation.mode !== "full";
		const tailnetDns = localEnabled || wideAreaDomain?.trim() ? await resolveTailnetDnsHint({ enabled: params.tailscaleMode !== "off" }) : void 0;
		if (!isCurrent(generation)) return;
		const context = {
			machineDisplayName: params.machineDisplayName,
			gatewayPort: params.port,
			gatewayTlsEnabled: params.gatewayTls?.enabled ?? false,
			gatewayTlsFingerprintSha256: generation.tlsFingerprint,
			gatewayDirectReachable: params.gatewayDirectReachable === true,
			sshPort: minimal ? void 0 : parseTcpPort(process.env.OPENCLAW_SSH_PORT) ?? void 0,
			tailnetDns,
			cliPath: minimal ? void 0 : resolveBonjourCliPath(),
			minimal
		};
		if (wideAreaDomain?.trim()) {
			const domain = resolveWideAreaDiscoveryDomain({ configDomain: wideAreaDomain });
			const tailnetIPv4 = pickPrimaryTailnetIPv4();
			if (!domain) params.logDiscovery.warn("wide-area discovery was requested without a domain; set discovery.wideArea.domain to enable unicast DNS-SD");
			else if (!tailnetIPv4) params.logDiscovery.warn("discovery.wideArea.domain is set, but no Tailscale IPv4 address was found; skipping unicast DNS-SD zone update");
			else try {
				const result = await writeWideAreaGatewayZone({
					...context,
					domain,
					displayName: formatBonjourInstanceName(params.machineDisplayName),
					tailnetIPv4,
					tailnetIPv6: pickPrimaryTailnetIPv6() ?? void 0
				});
				params.logDiscovery.info(`wide-area DNS-SD ${result.changed ? "updated" : "unchanged"} (${domain} → ${result.zonePath})`);
			} catch (err) {
				params.logDiscovery.warn(`wide-area discovery update failed: ${String(err)}`);
			}
		}
		const advertiseTimeoutMs = clampTimerTimeoutMs(parseStrictPositiveInteger(process.env.OPENCLAW_GATEWAY_DISCOVERY_ADVERTISE_TIMEOUT_MS?.trim())) ?? 5e3;
		for (const [entry, advertisement] of generation.services) {
			let drained;
			do {
				drained = cleanup;
				await drained;
			} while (drained !== cleanup);
			if (!localEnabled || !isCurrent(generation)) return;
			if (!generation.claim.isCurrent()) {
				waitForClaim(generation);
				return;
			}
			if (advertisement.started) continue;
			advertisement.started = true;
			let timedOut = false;
			let timer;
			const instance = entry.instance ?? getPluginValueInstance(entry.service);
			const start = async () => {
				let handle;
				try {
					handle = await entry.service.advertise(context);
				} catch (error) {
					advertisement.started = false;
					throw error;
				}
				if (handle?.stop) {
					const stop = handle.stop;
					const invokeStop = () => stop.call(handle);
					const stopOwned = () => instance ? instance.runCleanup(invokeStop) : runPluginCleanup(stop, invokeStop);
					if (!closed && current?.services.get(entry) === advertisement) {
						advertisement.stop = stopOwned;
						if (!current.claim.isCurrent()) waitForClaim(current);
					} else await stopService(stopOwned);
				}
				if (timedOut) params.logDiscovery.warn(`gateway discovery service completed after startup timeout (${entry.id}, plugin=${entry.pluginId})`);
			};
			const started = (async () => instance ? instance.run(start) : start())().catch((err) => {
				params.logDiscovery.warn(`gateway discovery service failed${timedOut ? " after startup timeout" : ""} (${entry.id}, plugin=${entry.pluginId}): ${String(err)}`);
			});
			await Promise.race([started, new Promise((resolve) => {
				timer = setTimeout(() => {
					timedOut = true;
					params.logDiscovery.warn(`gateway discovery service timed out after ${advertiseTimeoutMs}ms (${entry.id}, plugin=${entry.pluginId}); continuing startup`);
					resolve();
				}, advertiseTimeoutMs);
				timer.unref?.();
			})]);
			clearTimeout(timer);
		}
	};
	const update = (next, nextClaim = claim) => {
		const nextMode = "mdnsMode" in next ? next.mdnsMode ?? "minimal" : mode;
		const nextServices = next.gatewayDiscoveryServices ?? services;
		const nextTlsFingerprint = next.gatewayTlsFingerprintSha256 ?? tlsFingerprint;
		if (closed || current && mode === nextMode && services === nextServices && claim === nextClaim && tlsFingerprint === nextTlsFingerprint) return Promise.resolve();
		const previous = current;
		const retained = mode === nextMode && tlsFingerprint === nextTlsFingerprint ? previous?.services : void 0;
		mode = nextMode;
		tlsFingerprint = nextTlsFingerprint;
		services = nextServices;
		claim = nextClaim;
		const generation = current = {
			mode,
			tlsFingerprint,
			services: new Map(services.map((entry) => [entry, retained?.get(entry) ?? {}])),
			claim,
			waiting: false
		};
		return enqueue(async () => {
			await stopGeneration(previous);
			await advertise(generation);
		});
	};
	await update({});
	return {
		update,
		stop: () => {
			closed = true;
			const previous = current;
			current = void 0;
			return enqueue(() => stopGeneration(previous));
		}
	};
}
//#endregion
export { startGatewayDiscovery };
