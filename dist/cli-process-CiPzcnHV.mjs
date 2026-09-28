import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as killProcessTree } from "./kill-tree-BGQdx374.mjs";
import { _ as redactSensitiveText, m as redactSensitiveFieldValue } from "./redact-B5EGyLvV.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { t as prepareSecretInputStdio } from "./spawn-secret-input-C34dSJDo.mjs";
import { t as attachErrorDiagnostic } from "./error-diagnostics-805LTf-V.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import "./process-runtime-BF3dUvYO.mjs";
import "./logging-core-CUJDGfv-.mjs";
import { spawn } from "node:child_process";
//#region extensions/anthropic/cli-process.ts
const STDERR_CAPTURE_CHARS = 8192;
const STDERR_DRAIN_GRACE_MS = 200;
function spawnClaudeCliProcess(options, secretInput, observeStderr) {
	try {
		var _usingCtx$1 = _usingCtx();
		const stdio = [
			"pipe",
			"pipe",
			"pipe"
		];
		const secretDelivery = _usingCtx$1.u(prepareSecretInputStdio(stdio, secretInput));
		const child = spawn(options.command, options.args, {
			argv0: options.argv0,
			cwd: options.cwd,
			detached: process.platform !== "win32",
			env: options.env,
			signal: options.signal,
			stdio,
			windowsHide: true
		});
		observeStderr(child);
		const killChild = child.kill.bind(child);
		child.kill = (signal) => {
			if (!child.pid || signal !== void 0 && signal !== "SIGTERM" && signal !== "SIGKILL") return killChild(signal);
			killProcessTree(child.pid, {
				detached: process.platform !== "win32",
				...signal === "SIGKILL" ? { force: true } : {}
			});
			return true;
		};
		secretDelivery?.deliverTo(child).catch(() => child.kill());
		return child;
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
/** Owns process-wide diagnostics and the credentials needed to redact warm turns. */
function createClaudeCliProcessOwner(currentContext, secretInput) {
	const assertCurrent = () => {
		const context = currentContext();
		if (!context) throw new Error("Claude CLI run is no longer active.");
		context.assertCurrent?.();
	};
	assertCurrent();
	const credential = secretInput?.createData();
	let environment = {};
	let child;
	let drained;
	let disposed = false;
	let tail = "";
	let dropPartialLine = false;
	const observeStderr = (process) => {
		child = process;
		drained = new Promise((resolve) => {
			process.stderr.once("close", resolve);
		});
		process.stderr.setEncoding("utf8");
		process.stderr.on("error", () => {});
		process.stderr.on("data", (chunk) => {
			let text = chunk;
			if (disposed) return;
			if (dropPartialLine) {
				const newline = text.indexOf("\n");
				if (newline < 0) return;
				text = text.slice(newline + 1);
				dropPartialLine = false;
			}
			tail += text;
			if (tail.length > STDERR_CAPTURE_CHARS) {
				const bounded = sliceUtf16Safe(tail, -8192);
				const newline = bounded.indexOf("\n");
				tail = newline < 0 ? "" : bounded.slice(newline + 1);
				dropPartialLine = newline < 0;
			}
		});
	};
	return {
		[Symbol.dispose]() {
			disposed = true;
			credential?.fill(0);
			environment = {};
			tail = "";
		},
		spawn: (options) => {
			assertCurrent();
			environment = options.env;
			return spawnClaudeCliProcess(options, secretInput, observeStderr);
		},
		async withDiagnostics(error) {
			const context = currentContext();
			if (disposed || !context || context.abortSignal?.aborted) return error;
			if (child && (child.exitCode !== null || child.signalCode !== null)) {
				let timer;
				try {
					await Promise.race([drained, new Promise((resolve) => {
						timer = setTimeout(resolve, STDERR_DRAIN_GRACE_MS);
					})]);
				} finally {
					clearTimeout(timer);
				}
			}
			if (disposed || currentContext() !== context || context.abortSignal?.aborted) return error;
			let diagnostic = tail;
			const secrets = [environment, context.env].flatMap((env) => Object.entries(env).flatMap(([name, value]) => value && redactSensitiveFieldValue(name, value, { mode: "tools" }) !== value ? [value] : []));
			if (credential) secrets.push(credential.toString("utf8"));
			for (const secret of secrets.filter(Boolean)) for (const value of [
				secret,
				encodeURIComponent(secret),
				JSON.stringify(secret).slice(1, -1)
			]) diagnostic = diagnostic.replaceAll(value, "[REDACTED]");
			diagnostic = sliceUtf16Safe(redactSensitiveText(diagnostic, { mode: "tools" }), -2e3).trim();
			if (diagnostic && error instanceof Error) attachErrorDiagnostic(error, `stderr (process-wide; may include earlier turns): ${diagnostic}`);
			return error;
		}
	};
}
//#endregion
export { createClaudeCliProcessOwner as t };
