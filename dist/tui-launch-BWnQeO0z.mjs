import { t as attachChildProcessBridge } from "./child-process-bridge-CFJsa4sQ.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as filterOpenClawChildExecArgv } from "./openclaw-cli-invocation-IIQ-EDjW.mjs";
import path from "node:path";
import { spawn } from "node:child_process";
//#region src/tui/tui-launch.ts
function appendOption(args, flag, value) {
	if (value === void 0) return;
	args.push(flag, String(value));
}
function buildCurrentCliEntryArgs() {
	const entry = process.argv[1]?.trim();
	if (!entry) throw new Error("unable to relaunch TUI: current CLI entry path is unavailable");
	return path.isAbsolute(entry) ? [entry] : [];
}
function buildTuiCliArgs(opts) {
	const args = [
		...filterOpenClawChildExecArgv(process.execArgv),
		...buildCurrentCliEntryArgs(),
		"tui"
	];
	if (opts.local) args.push("--local");
	appendOption(args, "--url", opts.url);
	appendOption(args, "--token", opts.token);
	appendOption(args, "--password", opts.password);
	appendOption(args, "--tls-fingerprint", opts.tlsFingerprint);
	appendOption(args, "--session", opts.session);
	appendOption(args, "--thinking", opts.thinking);
	appendOption(args, "--message", opts.message);
	appendOption(args, "--timeout-ms", opts.timeoutMs);
	appendOption(args, "--history-limit", opts.historyLimit);
	if (opts.deliver) args.push("--deliver");
	return args;
}
/** Launches a child TUI process with inherited stdio. */
async function launchTuiCli(opts) {
	const args = buildTuiCliArgs(opts);
	process.stdin.pause();
	await new Promise((resolve, reject) => {
		const child = spawn(process.execPath, args, {
			stdio: "inherit",
			env: process.env
		});
		const { detach } = attachChildProcessBridge(child);
		child.on("error", (error) => {
			if (child.pid !== void 0) return;
			detach();
			reject(/* @__PURE__ */ new Error(`failed to launch TUI: ${formatErrorMessage(error)}`));
		});
		child.once("exit", (code, signal) => {
			detach();
			if (signal) {
				reject(/* @__PURE__ */ new Error(`TUI exited from signal ${signal}`));
				return;
			}
			if ((code ?? 0) !== 0) {
				reject(/* @__PURE__ */ new Error(`TUI exited with code ${code ?? 1}`));
				return;
			}
			resolve();
		});
	});
}
//#endregion
export { launchTuiCli };
