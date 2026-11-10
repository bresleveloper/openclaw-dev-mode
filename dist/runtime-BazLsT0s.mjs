import { t as clearActiveProgressLine } from "./progress-line-Bn5MVCt6.mjs";
import { t as restoreTerminalState } from "./restore-Cz8op5Oa.mjs";
import { n as loggingState } from "./state-UxwJeH7V.mjs";
//#region src/runtime.ts
function shouldEmitRuntimeLog(env = process.env) {
	if (env.VITEST !== "true") return true;
	if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") return true;
	return typeof console.log.mock === "object";
}
function shouldEmitRuntimeStdout(env = process.env) {
	if (env.VITEST !== "true") return true;
	if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") return true;
	return typeof process.stdout.write.mock === "object";
}
function isPipeClosedError(err) {
	const code = err?.code;
	return code === "EPIPE" || code === "EIO";
}
function hasRuntimeOutputWriter(runtime) {
	return typeof runtime.writeStdout === "function";
}
function writeStdout(value) {
	if (!shouldEmitRuntimeStdout()) return;
	clearActiveProgressLine();
	const line = value.endsWith("\n") ? value : `${value}\n`;
	try {
		process.stdout.write(line);
	} catch (err) {
		if (isPipeClosedError(err)) return;
		throw err;
	}
}
function createRuntimeIo() {
	return {
		log: (...args) => {
			if (!shouldEmitRuntimeLog()) return;
			clearActiveProgressLine();
			console.log(...args);
		},
		error: (...args) => {
			clearActiveProgressLine();
			console.error(...args);
		},
		writeStdout,
		writeJson: (value, space = 2) => {
			writeStdout(JSON.stringify(value, void 0, space > 0 ? space : void 0));
		}
	};
}
/** Keep terminal reset bytes off stdout when the invocation owns machine-readable output. */
function restoreRuntimeTerminalState(reason, options = {}) {
	const resetStream = options.resetStream ?? (loggingState.forceConsoleToStderr ? process.stderr : void 0);
	restoreTerminalState(reason, {
		...options,
		...resetStream ? { resetStream } : {}
	});
}
const defaultRuntime = {
	...createRuntimeIo(),
	exit: (code, opts) => {
		restoreRuntimeTerminalState("runtime exit", {
			resumeStdinIfPaused: false,
			...opts?.resetStream ? { resetStream: opts.resetStream } : {}
		});
		throw new ExitError(code);
	}
};
/** Signals a deferred or non-exiting runtime exit so callers can unwind owned resources. */
var ExitError = class extends Error {
	constructor(code, message) {
		super(message ?? `exit ${code}`);
		this.code = code;
		this.name = "ExitError";
	}
};
function createNonExitingRuntime() {
	return {
		...createRuntimeIo(),
		exit: (code, _opts) => {
			throw new ExitError(code);
		}
	};
}
/** Ingress owners return payloads through their transport, never process output. */
function withoutRuntimeOutput(runtime) {
	return {
		...runtime,
		writeStdout() {},
		writeJson() {}
	};
}
function writeRuntimeJson(runtime, value, space = 2) {
	if (hasRuntimeOutputWriter(runtime)) {
		runtime.writeJson(value, space);
		return;
	}
	runtime.log(JSON.stringify(value, void 0, space > 0 ? space : void 0));
}
function writeRuntimeStdout(runtime, value) {
	if (hasRuntimeOutputWriter(runtime)) {
		runtime.writeStdout(value);
		return;
	}
	runtime.log(value);
}
//#endregion
export { withoutRuntimeOutput as a, restoreRuntimeTerminalState as i, createNonExitingRuntime as n, writeRuntimeJson as o, defaultRuntime as r, writeRuntimeStdout as s, ExitError as t };
