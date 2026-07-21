import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { spawn } from "node:child_process";
//#region src/crestodian/probes.ts
const LOCAL_COMMAND_PROBE_OUTPUT_MAX_CHARS = 16 * 1024;
const LOCAL_COMMAND_PROBE_KILL_GRACE_MS = 500;
const ignoreOutputStreamError = () => {};
function appendBounded(previous, chunk, limit) {
	const next = previous + chunk;
	return next.length > limit ? next.slice(-limit) : next;
}
/** Probe a command by running a small version command with bounded output and timeout. */
async function probeLocalCommand(command, args = ["--version"], opts = {}) {
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 1500);
	const outputLimit = opts.outputLimit ?? LOCAL_COMMAND_PROBE_OUTPUT_MAX_CHARS;
	const timeoutKillGraceMs = resolveTimerTimeoutMs(opts.timeoutKillGraceMs, LOCAL_COMMAND_PROBE_KILL_GRACE_MS, 0);
	return await new Promise((resolve) => {
		let stdout = "";
		let stderr = "";
		let settled = false;
		let timedOut = false;
		let killTimer;
		const child = spawn(command, args, { stdio: [
			"ignore",
			"pipe",
			"pipe"
		] });
		const timeoutResult = () => ({
			command,
			found: true,
			error: `timed out after ${timeoutMs}ms`
		});
		const finish = (result) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			if (killTimer) clearTimeout(killTimer);
			resolve(result);
		};
		const timer = setTimeout(() => {
			timedOut = true;
			child.kill("SIGTERM");
			killTimer = setTimeout(() => {
				child.kill("SIGKILL");
				child.stdout.destroy();
				child.stderr.destroy();
				finish(timeoutResult());
			}, timeoutKillGraceMs);
			killTimer.unref?.();
		}, timeoutMs);
		child.stdout.setEncoding("utf8");
		child.stderr.setEncoding("utf8");
		child.stdout.on("data", (chunk) => {
			stdout = appendBounded(stdout, String(chunk), outputLimit);
		});
		child.stdout.on("error", ignoreOutputStreamError);
		child.stderr.on("data", (chunk) => {
			stderr = appendBounded(stderr, String(chunk), outputLimit);
		});
		child.stderr.on("error", ignoreOutputStreamError);
		child.on("error", (err) => {
			finish({
				command,
				found: err.code !== "ENOENT",
				error: err.code === "ENOENT" ? "not found" : err.message
			});
		});
		child.on("close", (code) => {
			if (timedOut) {
				finish(timeoutResult());
				return;
			}
			const text = `${stdout}\n${stderr}`.trim().split(/\r?\n/)[0]?.trim();
			finish({
				command,
				found: code === 0 || Boolean(text),
				version: text || void 0,
				error: code === 0 ? void 0 : `exited ${String(code)}`
			});
		});
	});
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
