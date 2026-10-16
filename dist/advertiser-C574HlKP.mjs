import { n as collectErrorGraphCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { n as parseBooleanValue } from "./boolean-BEb0Fdt8.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
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
const CIAO_SELF_PROBE_RETRY_FRAGMENT = "failed probing with reason: Error: Can't probe for a service which is announced already.";
const CIAO_MDNS_SOCKET_ERROR_FRAGMENT = "Encountered MDNS socket error on socket";
const CIAO_ENODEV_SOCKET_ERROR_FRAGMENT = "send ENODEV";
const defaultLogger = {
	info: (_msg) => {},
	warn: (_msg) => {},
	debug: (_msg) => {}
};
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
	return parseBooleanValue(process.env.OPENCLAW_DISABLE_BONJOUR) ?? isContainerEnvironment();
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
function truncateToDnsLabel(name, fallback = "OpenClaw") {
	if (Buffer.byteLength(name) <= MAX_DNS_LABEL_BYTES) return name;
	return truncateUtf8Prefix(name, MAX_DNS_LABEL_BYTES).replace(/-+$/, "").trim() || fallback;
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
function installCiaoConsoleNoiseFilter() {
	const previousConsoleLog = console.log;
	const previousConsoleWarn = console.warn;
	const logWrapper = (...args) => {
		if (args.some((arg) => typeof arg === "string" && arg.includes(CIAO_SELF_PROBE_RETRY_FRAGMENT))) return;
		previousConsoleLog(...args);
	};
	const warnWrapper = (...args) => {
		if (args.some((arg) => typeof arg === "string" && arg.includes(CIAO_MDNS_SOCKET_ERROR_FRAGMENT) && arg.includes(CIAO_ENODEV_SOCKET_ERROR_FRAGMENT))) return;
		previousConsoleWarn(...args);
	};
	console.log = logWrapper;
	console.warn = warnWrapper;
	return () => {
		if (console.log === logWrapper) console.log = previousConsoleLog;
		if (console.warn === warnWrapper) console.warn = previousConsoleWarn;
	};
}
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
		function handleAdvertiseFailure(label, svc, err, action) {
			const classification = classifyCiaoProcessError(err);
			if (classification) {
				logger.warn(`bonjour: advertise ${action} with ciao ${classification.kind} (${serviceSummary(label, svc)}): ${classification.formatted}`);
				return;
			}
			logger.warn(`bonjour: advertise ${action} (${serviceSummary(label, svc)}): ${formatBonjourError(err)}`);
		}
		logger.debug(`bonjour: starting (hostname=${hostname}, instance=${JSON.stringify(safeServiceName(instanceName))}, gatewayPort=${opts.gatewayPort}${opts.minimal ? ", minimal=true" : `, sshPort=${opts.sshPort ?? 22}`})`);
		const gateway = responder.createService({
			name: safeServiceName(instanceName),
			type: "openclaw-gw",
			port: opts.gatewayPort,
			domain: "local",
			hostname,
			txt: gatewayTxt
		});
		try {
			gateway.on("name-change", (name) => {
				logger.warn(`bonjour: gateway name conflict resolved; newName=${JSON.stringify(name)}`);
			});
			gateway.on("hostname-change", (nextHostname) => {
				logger.warn(`bonjour: gateway hostname conflict resolved; newHostname=${JSON.stringify(nextHostname)}`);
			});
		} catch (err) {
			logger.debug(`bonjour: failed to attach listeners for gateway: ${String(err)}`);
		}
		try {
			gateway.advertise().then(() => {
				logger.info(`bonjour: advertised ${serviceSummary("gateway", gateway)}`);
			}).catch((err) => {
				handleAdvertiseFailure("gateway", gateway, err, "failed");
			});
		} catch (err) {
			handleAdvertiseFailure("gateway", gateway, err, "threw");
		}
		let stopPromise = null;
		return { stop: () => {
			stopPromise ??= (async () => {
				try {
					await gateway.destroy();
				} catch {}
				try {
					await responder.shutdown();
				} catch {}
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
