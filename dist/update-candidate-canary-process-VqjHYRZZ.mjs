import "./update-candidate-canary-progress-YZ66-D3c.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as signalProcessTree } from "./kill-tree-ecObdMeW.mjs";
import { t as resolveRuntimeArgs } from "./runtime-worker-url-DoBSDhBS.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { s as redactSupportDiagnosticLine } from "./diagnostic-support-redaction-C72A4r6A.mjs";
import { spawn } from "node:child_process";
//#region src/infra/update-candidate-canary-process.ts
function launchCanary(params) {
	const { entry, args, env, capture } = params;
	params.assertCurrent?.();
	const runtime = params.nodeRunner ?? process.execPath;
	const child = spawn(runtime, [
		...resolveRuntimeArgs(runtime),
		entry,
		...args
	], {
		cwd: params.root,
		env,
		detached: process.platform !== "win32",
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		windowsHide: true
	});
	let stdout = "";
	let lastStderrLine;
	const stderrLines = [];
	let fatalHeader;
	const stderrTail = () => (fatalHeader ? [fatalHeader, ...stderrLines] : stderrLines).join("\n");
	let cliReason;
	const captureStderr = (line) => {
		if (!line.trim() || line.startsWith("openclaw-update-canary-progress: ")) return;
		const safe = redactSupportDiagnosticLine(line, {
			env,
			stateDir: params.stateDir
		}, Number.MAX_SAFE_INTEGER);
		lastStderrLine = sliceUtf16Safe(safe, -200);
		if (safe.startsWith("FATAL ERROR:")) {
			fatalHeader = sliceUtf16Safe(safe, 0, 512);
			stderrLines.length = 0;
		} else stderrLines.push(sliceUtf16Safe(safe, 0, 512));
		while (stderrLines.length > (fatalHeader ? 79 : 80) || stderrTail().length > 8192) stderrLines.shift();
		if (line.startsWith("[openclaw] Reason: ")) cliReason = sliceUtf16Safe(safe.replace(/^\[openclaw\] Reason: /u, ""), -200);
	};
	let stdoutBytes = 0;
	let outputExceeded = false;
	const flushers = [child.stdout, child.stderr].map((stream) => {
		stream.setEncoding("utf8");
		let pending = "";
		let droppingLine = false;
		const captureLine = (line) => {
			if (stream === child.stderr) captureStderr(line);
			capture(line);
			params.onLine?.(line);
		};
		stream.on("data", (chunk) => {
			let text = chunk;
			if (droppingLine) {
				const newline = text.indexOf("\n");
				if (newline < 0) return;
				text = text.slice(newline + 1);
				droppingLine = false;
			}
			pending += text;
			const lines = pending.split(/\r?\n/u);
			pending = lines.pop() ?? "";
			for (const line of lines) captureLine(line);
			if (pending.length > 65536) {
				pending = "";
				droppingLine = true;
				if (stream === child.stderr) lastStderrLine ??= "[oversized log line omitted]";
				capture("[oversized log line omitted]");
			}
		});
		return () => {
			if (pending) {
				captureLine(pending);
				pending = "";
			}
		};
	});
	child.stdout.on("data", (chunk) => {
		stdoutBytes += Buffer.byteLength(chunk);
		if (stdoutBytes <= 1048576) {
			stdout += chunk;
			params.onStdout?.(stdout);
		} else outputExceeded = true;
	});
	let exited = false;
	let processExited = false;
	return {
		child,
		result: new Promise((resolve) => {
			child.once("exit", (code) => {
				processExited = true;
				if (code !== 0) resolve(code);
			});
			child.once("error", (error) => {
				captureStderr(error.message);
				capture(error.message);
				exited = true;
				resolve(null);
			});
			child.once("close", (code) => {
				for (const flush of flushers) flush();
				exited = true;
				resolve(code);
			});
		}),
		closed: new Promise((resolve) => {
			child.once("close", () => resolve());
		}),
		hasExited: () => exited,
		processExited: () => processExited,
		stdout: () => stdout,
		stderrDiagnostic: () => fatalHeader ?? cliReason ?? lastStderrLine,
		stderrTail,
		outputExceeded: () => outputExceeded
	};
}
async function waitBounded(promise, milliseconds, signal) {
	let timer;
	let abort;
	try {
		return await Promise.race([promise.then((value) => ({
			status: "completed",
			value
		})), new Promise((resolve) => {
			timer = setTimeout(() => resolve({ status: "deadline" }), Math.max(0, milliseconds));
			abort = () => resolve({ status: "aborted" });
			signal?.addEventListener("abort", abort, { once: true });
			if (signal?.aborted) abort();
		})]);
	} finally {
		clearTimeout(timer);
		if (abort) signal?.removeEventListener("abort", abort);
	}
}
async function terminateCanary(child, closed, deadline) {
	if (!child.pid) return true;
	const options = { detached: process.platform !== "win32" };
	const signal = (kind) => new Promise((resolve) => {
		signalProcessTree(child.pid, kind, {
			...options,
			onComplete: resolve
		});
	});
	const term = signal("SIGTERM");
	await waitBounded(Promise.all([term, closed]), Math.min(1e3, Math.max(0, deadline - Date.now())));
	return (await waitBounded(Promise.all([
		term,
		signal("SIGKILL"),
		closed
	]), Math.min(1e3, Math.max(0, deadline - Date.now())))).status === "completed";
}
async function stopCanary(params) {
	const cleanupStarted = Date.now();
	try {
		if (await terminateCanary(params.running.child, params.running.closed, params.deadline)) return;
		await params.recordStep({
			name: `${params.name}-cleanup`,
			command: "SIGTERM, SIGKILL",
			cwd: params.root,
			durationMs: Date.now() - cleanupStarted,
			exitCode: null,
			advisory: {
				kind: "recoverable-maintenance",
				message: "Update cleanup deadline elapsed before process close and termination requests both completed. Update validation results are unchanged."
			}
		});
	} catch (cleanupError) {
		if (hasCommandProcessCleanupError(params.primaryFailure)) throw new AggregateError([params.primaryFailure, cleanupError], "Candidate startup and cleanup failed", { cause: cleanupError });
		throw cleanupError;
	}
}
//#endregion
export { waitBounded as i, stopCanary as n, terminateCanary as r, launchCanary as t };
