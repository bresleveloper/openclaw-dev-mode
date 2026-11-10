import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { a as redactSensitiveFieldValue, s as redactSensitiveText } from "./redact-BcXJu5HP.mjs";
import { s as raceWithTimeout } from "./src-Bzfi3cQM.mjs";
import { t as attachErrorDiagnostic } from "./error-diagnostics-Cgksm9ND.mjs";
import { r as createOwnedStdioProcess } from "./owned-stdio-CtvrdfBc.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import "./time-runtime-D6GzEQJ4.mjs";
import "./logging-core-CsXmxYo2.mjs";
//#region extensions/anthropic/cli-process.ts
const STDERR_CAPTURE_CHARS = 8192;
const STDERR_DRAIN_GRACE_MS = 200;
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
	let exited = false;
	let disposed = false;
	let tail = "";
	let dropPartialLine = false;
	const observeStderr = (process) => {
		child = process;
		process.onExit(() => {
			exited = true;
		});
		process.onStderr((chunk) => {
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
		spawn: async (options) => {
			assertCurrent();
			environment = options.env;
			const spawned = await createOwnedStdioProcess({
				argv: [options.command, ...options.args],
				argv0: options.argv0,
				cwd: options.cwd,
				env: options.env,
				exactEnv: true,
				abortSignal: options.signal,
				assertCurrent,
				secretInput,
				terminateOnHostLoss: true,
				stdoutConsumption: "awaited"
			});
			observeStderr(spawned);
			return spawned;
		},
		async withDiagnostics(error) {
			const context = currentContext();
			if (disposed || !context || context.abortSignal?.aborted) return error;
			if (child && exited) await raceWithTimeout(child.wait().catch(() => void 0), STDERR_DRAIN_GRACE_MS, () => void 0);
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
