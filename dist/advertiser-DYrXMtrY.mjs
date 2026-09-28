import { n as collectErrorGraphCandidates } from "./error-coercion-C787aVxk.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import fs from "node:fs";
import os from "node:os";
//#region extensions/bonjour/src/errors.ts
/**
* Bonjour error formatting helper. It normalizes Error and non-Error values
* into concise messages for gateway discovery logs.
*/
/** Format an unknown Bonjour/ciao error value for logs. */
function formatBonjourError(err) {
	if (err instanceof Error) {
		const msg = err.message.trim() || err.name || String(err).trim();
		if (err.name && err.name !== "Error") return msg === err.name ? err.name : `${err.name}: ${msg}`;
		return msg;
	}
	return String(err);
}
//#endregion
//#region extensions/bonjour/src/ciao.ts
/**
* Ciao process-error classifier. It recognizes known noisy ciao failures so
* the Bonjour plugin can suppress or repair expected mDNS lifecycle issues.
*/
const CIAO_NETMASK_ASSERTION_MESSAGE_RE = /IP ADDRESS VERSION MUST MATCH\.\s+NETMASK CANNOT HAVE A VERSION DIFFERENT FROM THE ADDRESS!?/u;
const CIAO_INTERFACE_ENUMERATION_FAILURE_RE = /\bUV_INTERFACE_ADDRESSES\b/u;
/** Classify a ciao error/rejection chain into a known category. */
function classifyCiaoProcessError(reason) {
	for (const candidate of collectErrorGraphCandidates(reason, (current) => [
		current.cause,
		current.reason,
		current.original,
		current.error,
		current.data,
		...Array.isArray(current.errors) ? current.errors : []
	])) {
		const formatted = formatBonjourError(candidate);
		const message = formatted.toUpperCase();
		if (CIAO_NETMASK_ASSERTION_MESSAGE_RE.test(message)) return {
			kind: "netmask-assertion",
			formatted
		};
		if (CIAO_INTERFACE_ENUMERATION_FAILURE_RE.test(message)) return {
			kind: "interface-enumeration-failure",
			formatted
		};
	}
	return null;
}
//#endregion
//#region extensions/bonjour/src/advertiser.ts
/** Publishes gateway/SSH records through one ciao-owned advertisement lifecycle. */
const CIAO_SELF_PROBE_RETRY_FRAGMENT = "failed probing with reason: Error: Can't probe for a service which is announced already.";
const CIAO_MDNS_SOCKET_ERROR_FRAGMENT = "Encountered MDNS socket error on socket";
const CIAO_ENODEV_SOCKET_ERROR_FRAGMENT = "send ENODEV";
const defaultLogger = {
	info: (_msg) => {},
	warn: (_msg) => {},
	debug: (_msg) => {}
};
function readBonjourDisableOverride() {
	const raw = process.env.OPENCLAW_DISABLE_BONJOUR;
	const normalized = raw?.trim().toLowerCase();
	if (!normalized) return null;
	if (isTruthyEnvValue(raw)) return true;
	switch (normalized) {
		case "0":
		case "false":
		case "no":
		case "off": return false;
		default: return null;
	}
}
function isContainerEnvironment() {
	if (process.env.FLY_MACHINE_ID?.trim() && process.env.FLY_APP_NAME?.trim()) return true;
	for (const sentinelPath of [
		"/.dockerenv",
		"/run/.containerenv",
		"/var/run/.containerenv"
	]) try {
		if (fs.existsSync(sentinelPath)) return true;
	} catch {}
	try {
		const cgroup = fs.readFileSync("/proc/1/cgroup", "utf8");
		return /\/docker\/|cri-containerd-[0-9a-f]|containerd\/[0-9a-f]{64}|\/kubepods[/.]|\blxc\b/u.test(cgroup);
	} catch {
		return false;
	}
}
function isDisabledByEnv() {
	if (process.env.VITEST) return true;
	const envOverride = readBonjourDisableOverride();
	if (envOverride !== null) return envOverride;
	if (isContainerEnvironment()) return true;
	return false;
}
function resolveSystemMdnsHostname() {
	let raw;
	try {
		raw = os.hostname();
	} catch {
		return null;
	}
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const firstLabel = trimmed.replace(/\.local$/i, "").split(".")[0]?.trim() ?? "";
	if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(firstLabel)) return null;
	return firstLabel;
}
const MAX_DNS_LABEL_BYTES = 63;
const utf8Encoder = new TextEncoder();
function truncateToDnsLabel(name, fallback = "OpenClaw") {
	const encoded = utf8Encoder.encode(name);
	if (encoded.byteLength <= MAX_DNS_LABEL_BYTES) return name;
	for (let end = MAX_DNS_LABEL_BYTES; end > 0; end -= 1) try {
		return new TextDecoder("utf-8", { fatal: true }).decode(encoded.subarray(0, end)).replace(/-+$/, "").trim() || fallback;
	} catch {}
	return fallback;
}
function safeServiceName(name) {
	const trimmed = name.trim();
	return trimmed.length > 0 ? truncateToDnsLabel(trimmed) : "OpenClaw";
}
function prettifyInstanceName(name) {
	const normalized = name.trim().replace(/\s+/g, " ");
	return normalized.replace(/\s+\(OpenClaw\)\s*$/i, "").trim() || normalized;
}
function serviceSummary(label, svc) {
	return `${label} fqdn=${svc.getFQDN()} host=${svc.getHostname()} port=${svc.getPort()} state=${svc.serviceState}`;
}
function shouldSuppressCiaoConsoleLog(args) {
	return args.some((arg) => typeof arg === "string" && arg.includes(CIAO_SELF_PROBE_RETRY_FRAGMENT));
}
function shouldSuppressCiaoConsoleWarn(args) {
	return args.some((arg) => typeof arg === "string" && arg.includes(CIAO_MDNS_SOCKET_ERROR_FRAGMENT) && arg.includes(CIAO_ENODEV_SOCKET_ERROR_FRAGMENT));
}
function installCiaoConsoleNoiseFilter() {
	const previousConsoleLog = console.log;
	const previousConsoleWarn = console.warn;
	const logWrapper = (...args) => {
		if (shouldSuppressCiaoConsoleLog(args)) return;
		previousConsoleLog(...args);
	};
	const warnWrapper = (...args) => {
		if (shouldSuppressCiaoConsoleWarn(args)) return;
		previousConsoleWarn(...args);
	};
	console.log = logWrapper;
	console.warn = warnWrapper;
	return () => {
		if (console.log === logWrapper) console.log = previousConsoleLog;
		if (console.warn === warnWrapper) console.warn = previousConsoleWarn;
	};
}
/** Start Bonjour advertisements for the local gateway services. */
async function startGatewayBonjourAdvertiser(opts, deps) {
	if (isDisabledByEnv()) return { stop: async () => {} };
	const logger = {
		info: deps.logger?.info ?? defaultLogger.info,
		warn: deps.logger?.warn ?? defaultLogger.warn,
		debug: deps.logger?.debug ?? defaultLogger.debug
	};
	let restoreConsoleLog = () => {};
	let cleanupUnhandledRejection;
	let cleanupUncaughtException;
	let processHandlersCleaned = false;
	function cleanupProcessHandlers() {
		if (processHandlersCleaned) return;
		processHandlersCleaned = true;
		cleanupUncaughtException?.();
		cleanupUnhandledRejection?.();
	}
	try {
		const { getResponder } = await import("@homebridge/ciao");
		restoreConsoleLog = installCiaoConsoleNoiseFilter();
		const handleCiaoProcessError = (reason) => {
			const classification = classifyCiaoProcessError(reason);
			if (!classification) return false;
			if (classification.kind === "interface-enumeration-failure") logger.warn(`bonjour: disabling mDNS — networkInterfaces() unavailable in this environment: ${classification.formatted}`);
			else logger.warn(`bonjour: suppressing ciao netmask assertion: ${classification.formatted}`);
			return true;
		};
		cleanupUnhandledRejection = deps.registerUnhandledRejectionHandler(handleCiaoProcessError);
		cleanupUncaughtException = deps.registerUncaughtExceptionHandler(handleCiaoProcessError);
		const hostnameWithoutLocal = (process.env.OPENCLAW_MDNS_HOSTNAME?.trim() || resolveSystemMdnsHostname() || "openclaw").replace(/\.local$/i, "");
		const dotIndex = hostnameWithoutLocal.indexOf(".");
		const labelEnd = dotIndex === -1 ? hostnameWithoutLocal.length : dotIndex;
		const hostname = truncateToDnsLabel(hostnameWithoutLocal.slice(0, labelEnd).trim() || "openclaw", "openclaw");
		const instanceName = typeof opts.instanceName === "string" && opts.instanceName.trim() ? opts.instanceName.trim() : `${hostname} (OpenClaw)`;
		const displayName = prettifyInstanceName(instanceName);
		const txtBase = {
			role: "gateway",
			gatewayPort: String(opts.gatewayPort),
			lanHost: `${hostname}.local`,
			displayName
		};
		if (opts.gatewayTlsEnabled) {
			txtBase.gatewayTls = "1";
			if (opts.gatewayTlsFingerprintSha256) txtBase.gatewayTlsSha256 = opts.gatewayTlsFingerprintSha256;
		}
		if (opts.gatewayDirectReachable) txtBase.gatewayDirectReachable = "1";
		if (!opts.minimal && typeof opts.tailnetDns === "string" && opts.tailnetDns.trim()) txtBase.tailnetDns = opts.tailnetDns.trim();
		if (!opts.minimal && typeof opts.cliPath === "string" && opts.cliPath.trim()) txtBase.cliPath = opts.cliPath.trim();
		const gatewayTxt = {
			...txtBase,
			transport: "gateway"
		};
		if (!opts.minimal) gatewayTxt.sshPort = String(opts.sshPort ?? 22);
		const responder = getResponder();
		function createServices() {
			const services = [];
			const gateway = responder.createService({
				name: safeServiceName(instanceName),
				type: "openclaw-gw",
				port: opts.gatewayPort,
				domain: "local",
				hostname,
				txt: gatewayTxt
			});
			services.push({
				label: "gateway",
				svc: gateway
			});
			return services;
		}
		async function stopServices(services) {
			for (const { svc } of services) try {
				await svc.destroy();
			} catch {}
			try {
				await responder.shutdown();
			} catch {}
		}
		function attachConflictListeners(services) {
			for (const { label, svc } of services) try {
				svc.on("name-change", (name) => {
					logger.warn(`bonjour: ${label} name conflict resolved; newName=${JSON.stringify(name)}`);
				});
				svc.on("hostname-change", (nextHostname) => {
					logger.warn(`bonjour: ${label} hostname conflict resolved; newHostname=${JSON.stringify(nextHostname)}`);
				});
			} catch (err) {
				logger.debug(`bonjour: failed to attach listeners for ${label}: ${String(err)}`);
			}
		}
		function handleAdvertiseFailure(label, svc, err, action) {
			const classification = classifyCiaoProcessError(err);
			if (classification) {
				logger.warn(`bonjour: advertise ${action} with ciao ${classification.kind} (${serviceSummary(label, svc)}): ${classification.formatted}`);
				return;
			}
			logger.warn(`bonjour: advertise ${action} (${serviceSummary(label, svc)}): ${formatBonjourError(err)}`);
		}
		function startAdvertising(services) {
			for (const { label, svc } of services) try {
				svc.advertise().then(() => {
					logger.info(`bonjour: advertised ${serviceSummary(label, svc)}`);
				}).catch((err) => {
					handleAdvertiseFailure(label, svc, err, "failed");
				});
			} catch (err) {
				handleAdvertiseFailure(label, svc, err, "threw");
			}
		}
		logger.debug(`bonjour: starting (hostname=${hostname}, instance=${JSON.stringify(safeServiceName(instanceName))}, gatewayPort=${opts.gatewayPort}${opts.minimal ? ", minimal=true" : `, sshPort=${opts.sshPort ?? 22}`})`);
		const services = createServices();
		attachConflictListeners(services);
		startAdvertising(services);
		let stopPromise = null;
		return { stop: () => {
			stopPromise ??= (async () => {
				await stopServices(services);
				restoreConsoleLog();
				cleanupProcessHandlers();
			})();
			return stopPromise;
		} };
	} catch (err) {
		restoreConsoleLog();
		cleanupProcessHandlers();
		throw err;
	}
}
//#endregion
export { startGatewayBonjourAdvertiser };
