import { F as resolveTimerTimeoutMs, P as resolvePositiveTimerTimeoutMs, w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-Qi4d52Il.mjs";
import { r as parseWindowsNetstatListeners } from "./ports-netstat-816BXbAP.mjs";
import { n as resolveLsofCommandSync } from "./ports-lsof-Rgl6w06g.mjs";
import { n as probePortUsage } from "./ports-probe-DMGtt9dg.mjs";
import { execFileSync } from "node:child_process";
import { createServer } from "node:net";
//#region src/cli/ports.ts
const FUSER_SIGNALS = {
	SIGTERM: "TERM",
	SIGKILL: "KILL"
};
const PORT_TOOL_TIMEOUT_MS = 1e4;
function readExecOutput(value) {
	if (typeof value === "string") return value;
	if (value instanceof Buffer) return value.toString("utf8");
	return "";
}
function withErrnoCode(message, code, cause) {
	const out = new Error(message, { cause: cause instanceof Error ? cause : void 0 });
	out.code = code;
	return out;
}
function getErrnoCode(err) {
	if (!err || typeof err !== "object") return;
	const direct = err.code;
	if (typeof direct === "string" && direct.length > 0) return direct;
	const cause = err.cause;
	if (cause && typeof cause === "object") {
		const nested = cause.code;
		if (typeof nested === "string" && nested.length > 0) return nested;
	}
}
function isRecoverableLsofError(err) {
	const code = getErrnoCode(err);
	if (code === "ENOENT" || code === "EACCES" || code === "EPERM" || code === "EPROTO") return true;
	const message = formatErrorMessage(err);
	return /lsof.*(permission denied|not permitted|operation not permitted|eacces|eperm)/i.test(message);
}
function parseFuserPidList(output) {
	const values = /* @__PURE__ */ new Set();
	for (const token of output.split(/\s+/)) {
		const pid = parseStrictPositiveInteger(token);
		if (pid !== void 0) values.add(pid);
	}
	return [...values];
}
function killPortWithFuser(port, signal, beforeSignal) {
	if (beforeSignal) {
		const listeners = runFuser(port);
		killPids(port, listeners, signal, beforeSignal);
		return listeners;
	}
	return runFuser(port, signal);
}
function runFuser(port, signal) {
	const args = [...signal ? ["-k", `-${FUSER_SIGNALS[signal]}`] : [], `${port}/tcp`];
	try {
		return parseFuserPidList(execFileSync("fuser", args, {
			env: resolveDiagnosticProcessEnv(),
			encoding: "utf-8",
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			timeout: PORT_TOOL_TIMEOUT_MS,
			killSignal: "SIGKILL"
		})).map((pid) => ({ pid }));
	} catch (err) {
		const execErr = err;
		if (execErr.status === 1) return parseFuserPidList([readExecOutput(execErr.stdout), ...signal ? [readExecOutput(execErr.stderr)] : []].filter(Boolean).join("\n")).map((pid) => ({ pid }));
		if (execErr.code === "ENOENT") throw withErrnoCode("fuser not found; required for --force when lsof is unavailable", "ENOENT", err);
		if (execErr.code === "EACCES" || execErr.code === "EPERM") throw withErrnoCode(`fuser permission denied while ${signal ? "forcing" : "inspecting"} gateway port`, execErr.code, err);
		throw err instanceof Error ? err : new Error(String(err));
	}
}
async function isPortBusy(port) {
	return await probePortUsage(port) !== "free";
}
function parseLsofOutput(output) {
	const lines = output.split(/\r?\n/).filter(Boolean);
	const results = [];
	let current;
	for (const line of lines) if (line.startsWith("p")) {
		if (current) results.push(current);
		const rawPidToken = line.slice(1);
		const rawPid = parseStrictPositiveInteger(rawPidToken);
		if (rawPid === void 0) throw withErrnoCode(`lsof returned malformed PID field: ${JSON.stringify(rawPidToken)}`, "EPROTO", void 0);
		current = { pid: rawPid };
	} else if (current && line.startsWith("c")) current.command = line.slice(1);
	if (current) results.push(current);
	return results;
}
function listPortListeners(port) {
	if (process.platform === "win32") try {
		const out = execFileSync(getWindowsSystem32ExePath("netstat.exe"), ["-ano"], {
			env: resolveDiagnosticProcessEnv(),
			encoding: "utf-8",
			timeout: PORT_TOOL_TIMEOUT_MS,
			killSignal: "SIGKILL"
		});
		const listeners = parseWindowsNetstatListeners(out, port);
		return [...new Set(listeners.map((listener) => listener.pid))].map((pid) => ({ pid }));
	} catch (err) {
		throw new Error(`netstat failed: ${String(err)}`, { cause: err });
	}
	try {
		const lsof = resolveLsofCommandSync();
		return parseLsofOutput(execFileSync(lsof, [
			"-nP",
			`-iTCP:${port}`,
			"-sTCP:LISTEN",
			"-FpFc"
		], {
			env: resolveDiagnosticProcessEnv(),
			encoding: "utf-8",
			timeout: PORT_TOOL_TIMEOUT_MS,
			killSignal: "SIGKILL"
		}));
	} catch (err) {
		const execErr = err;
		const status = execErr.status ?? void 0;
		const code = execErr.code;
		if (code === "ENOENT") throw withErrnoCode("lsof not found; required for --force", "ENOENT", err);
		if (code === "EACCES" || code === "EPERM") throw withErrnoCode("lsof permission denied while inspecting gateway port", code, err);
		if (status === 1) {
			const stderr = readExecOutput(execErr.stderr).trim();
			if (stderr && /permission denied|not permitted|operation not permitted|can't stat/i.test(stderr)) throw withErrnoCode(`lsof permission denied while inspecting gateway port: ${stderr}`, "EACCES", err);
			return [];
		}
		throw err instanceof Error ? err : new Error(String(err));
	}
}
function killPids(port, listeners, signal, beforeSignal) {
	for (const proc of listeners) {
		beforeSignal?.({
			port,
			pid: proc.pid,
			signal
		});
		try {
			process.kill(proc.pid, signal);
		} catch (err) {
			if (getErrnoCode(err) === "ESRCH") continue;
			throw new Error(`failed to kill pid ${proc.pid}${proc.command ? ` (${proc.command})` : ""}: ${String(err)}`, { cause: err });
		}
	}
}
async function forceFreePortAndWait(port, opts = {}) {
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 1500, 0);
	const intervalMs = resolvePositiveTimerTimeoutMs(opts.intervalMs, 100);
	const sigtermTimeoutMs = Math.min(resolveTimerTimeoutMs(opts.sigtermTimeoutMs, 600, 0), timeoutMs);
	let killed = [];
	let useFuserFallback = false;
	try {
		killed = listPortListeners(port);
	} catch (err) {
		if (!isRecoverableLsofError(err)) throw err;
		if (!await isPortBusy(port)) return {
			killed,
			waitedMs: 0,
			escalatedToSigkill: false
		};
		useFuserFallback = true;
		killed = killPortWithFuser(port, "SIGTERM", opts.beforeSignal);
	}
	if (!useFuserFallback) killPids(port, killed, "SIGTERM", opts.beforeSignal);
	if (killed.length === 0) {
		if (await isPortBusy(port)) throw new Error(`port ${port} is still busy after --force, but no listener PID could be determined`);
		return {
			killed,
			waitedMs: 0,
			escalatedToSigkill: false
		};
	}
	const checkBusy = async () => useFuserFallback ? isPortBusy(port) : listPortListeners(port).length > 0;
	if (!await checkBusy()) return {
		killed,
		waitedMs: 0,
		escalatedToSigkill: false
	};
	let waitedMs = 0;
	const waitUntilFree = async (deadlineMs) => {
		while (waitedMs < deadlineMs) {
			if (!await checkBusy()) return true;
			const sleepMs = Math.min(intervalMs, deadlineMs - waitedMs);
			await sleep(sleepMs);
			waitedMs += sleepMs;
		}
		return !await checkBusy();
	};
	if (await waitUntilFree(sigtermTimeoutMs)) return {
		killed,
		waitedMs,
		escalatedToSigkill: false
	};
	if (useFuserFallback) killPortWithFuser(port, "SIGKILL", opts.beforeSignal);
	else killPids(port, listPortListeners(port), "SIGKILL", opts.beforeSignal);
	if (await waitUntilFree(timeoutMs)) return {
		killed,
		waitedMs,
		escalatedToSigkill: true
	};
	if (useFuserFallback) throw new Error(`port ${port} still has listeners after --force (fuser fallback)`);
	const still = listPortListeners(port);
	throw new Error(`port ${port} still has listeners after --force: ${still.map((p) => p.pid).join(", ")}`);
}
function probePortFree(port, host = "0.0.0.0") {
	return new Promise((resolve, reject) => {
		const srv = createServer();
		srv.unref();
		srv.once("error", (err) => {
			srv.close();
			if (err.code === "EADDRINUSE") resolve(false);
			else reject(err);
		});
		srv.listen(port, host, () => {
			srv.close(() => resolve(true));
		});
	});
}
/**
* Poll until a real test-bind succeeds, up to `timeoutMs`.
* Returns the number of ms waited, or throws if the port never freed.
*/
async function waitForPortBindable(port, opts = {}) {
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 3e3, 0);
	const intervalMs = resolvePositiveTimerTimeoutMs(opts.intervalMs, 150);
	const host = opts.host;
	let waited = 0;
	while (waited < timeoutMs) {
		if (await probePortFree(port, host)) return waited;
		const sleepMs = Math.min(intervalMs, timeoutMs - waited);
		await sleep(sleepMs);
		waited += sleepMs;
	}
	if (await probePortFree(port, host)) return waited;
	throw new Error(`port ${port} still not bindable after ${waited}ms (TIME_WAIT or kernel hold)`);
}
//#endregion
export { forceFreePortAndWait, waitForPortBindable };
