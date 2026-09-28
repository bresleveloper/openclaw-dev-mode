import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
//#region src/system-agent/probes.ts
const LOCAL_COMMAND_PROBE_OUTPUT_MAX_CHARS = 16384;
/** Probe a command by running a small version command with bounded output and timeout. */
async function probeLocalCommand(command, args = ["--version"], opts = {}) {
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 1500);
	const outputLimit = opts.outputLimit ?? LOCAL_COMMAND_PROBE_OUTPUT_MAX_CHARS;
	try {
		const result = await runCommandWithTimeout([command, ...args], {
			killProcessTree: true,
			maxOutputBytes: outputLimit,
			timeoutMs
		});
		if (result.termination === "timeout") return {
			command,
			found: true,
			error: `timed out after ${timeoutMs}ms`,
			timedOut: true
		};
		const text = `${result.stdout}\n${result.stderr}`.trim().split(/\r?\n/)[0]?.trim();
		return {
			command,
			found: result.code === 0 || Boolean(text),
			version: text || void 0,
			error: result.code === 0 ? void 0 : `exited ${String(result.code)}`
		};
	} catch (error) {
		const spawnError = error;
		return {
			command,
			found: spawnError.code !== "ENOENT",
			error: spawnError.code === "ENOENT" ? "not found" : spawnError.message
		};
	}
}
/** Probe a Gateway URL by translating it to its HTTP /healthz endpoint. */
async function probeGatewayUrl(url, opts = {}) {
	const httpUrl = url.replace(/^ws:/, "http:").replace(/^wss:/, "https:");
	const healthUrl = new URL("/healthz", httpUrl).toString();
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 900);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);
	let response;
	try {
		response = await fetch(healthUrl, {
			method: "GET",
			signal: controller.signal
		});
		return {
			reachable: response.ok,
			url,
			error: response.ok ? void 0 : response.statusText
		};
	} catch (err) {
		return {
			reachable: false,
			url,
			error: err instanceof Error ? err.message : String(err)
		};
	} finally {
		clearTimeout(timeout);
		await response?.body?.cancel().catch(() => void 0);
	}
}
//#endregion
export { probeLocalCommand as n, probeGatewayUrl as t };
