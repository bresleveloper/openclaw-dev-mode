import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as isErrno } from "./errno-FR4CRyya.mjs";
import "./errors-DPfGDWk1.mjs";
import { n as info, o as shouldLogVerbose, t as danger } from "./globals-XVSoVbNQ.mjs";
import { t as logDebug } from "./logger-DHVmYOKs.mjs";
import { i as tryListenOnPort } from "./ports-probe-FuJ7VYyD.mjs";
import { r as formatPortDiagnostics } from "./ports-format-Bal9BDTl.mjs";
//#region src/infra/ports.ts
var PortInUseError = class extends Error {
	constructor(port, details) {
		super(`Port ${port} is already in use.`);
		this.name = "PortInUseError";
		this.port = port;
		this.details = details;
	}
};
async function describePortOwner(port) {
	const { inspectPortUsage } = await import("./ports-inspect-Jh_A88rx.mjs");
	const diagnostics = await inspectPortUsage(port);
	if (diagnostics.listeners.length === 0) return;
	return formatPortDiagnostics(diagnostics).join("\n");
}
/** Probes Node's wildcard bind by default; callers may scope checks to their owned interface. */
async function ensurePortAvailable(port, host, signal) {
	try {
		const probe = {
			port,
			...host ? { host } : {},
			...signal ? { signal } : {}
		};
		await tryListenOnPort(probe);
	} catch (err) {
		if (isErrno(err) && err.code === "EADDRINUSE") throw new PortInUseError(port);
		throw err;
	}
}
async function handlePortError(err, port, context, runtime = defaultRuntime) {
	if (err instanceof PortInUseError || isErrno(err) && err.code === "EADDRINUSE") {
		const details = (err instanceof PortInUseError ? err.details : void 0) ?? await describePortOwner(port);
		runtime.error(danger(`${context} failed: port ${port} is already in use.`));
		if (details) {
			runtime.error(info("Port listener details:"));
			runtime.error(details);
		}
		runtime.error(info("Resolve by stopping the process using the port or passing --port <free-port>."));
		runtime.exit(1);
	}
	runtime.error(danger(`${context} failed: ${String(err)}`));
	if (shouldLogVerbose()) {
		const stdout = err?.stdout;
		const stderr = err?.stderr;
		if (stdout?.trim()) logDebug(`stdout: ${stdout.trim()}`);
		if (stderr?.trim()) logDebug(`stderr: ${stderr.trim()}`);
	}
	runtime.exit(1);
	throw new Error("unreachable");
}
//#endregion
export { handlePortError as i, describePortOwner as n, ensurePortAvailable as r, PortInUseError as t };
