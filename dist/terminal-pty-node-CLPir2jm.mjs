import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as signalPtySessionTree, t as killProcessTree } from "./kill-tree-BGQdx374.mjs";
import "./errors-DnjwnOju.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import { n as decodeTerminalPtyEvent } from "./terminal-pty-protocol-Czbd-FUN.mjs";
import { t as resolveNodeRuntimeExecutable } from "./node-runtime-executable-wWK_i2EJ.mjs";
import { spawn } from "node:child_process";
import { constants } from "node:os";
//#region src/process/terminal-pty-node.ts
const STARTUP_TIMEOUT_MS = 1e4;
const CLEANUP_TIMEOUT_MS = 2e3;
/** Keeps native PTY I/O on Node while the Gateway or node host runs on Bun. */
async function spawnNodeTerminalPty(params, beforeSpawn) {
	const node = resolveNodeRuntimeExecutable();
	if (!node) throw new Error("A Node executable is required for terminals on Bun; add node to PATH.");
	const worker = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.terminalPty);
	const child = spawn(node, resolveRuntimeWorkerArgv(worker, node), {
		stdio: [
			"ignore",
			"pipe",
			"pipe",
			"ipc"
		],
		serialization: "json",
		env: process.env
	});
	const stdout = child.stdout;
	const stderrPipe = child.stderr;
	if (!stdout || !stderrPipe) {
		child.once("error", () => void 0);
		child.kill("SIGKILL");
		throw new Error("Terminal Node worker did not provide its required output pipes");
	}
	const ready = createDeferredCore();
	const listeners = /* @__PURE__ */ new Set();
	let exited;
	let reportedExit;
	let startupError;
	let stderr = "";
	let paused = false;
	let subscribed = false;
	let ptyPid;
	let cleanupTimer;
	let helperExit;
	let outputEnded = false;
	let ipcClosed = false;
	const fail = (error) => {
		if (exited) return;
		startupError ??= error;
		if (child.connected) child.disconnect();
		stdout.resume();
		if (!helperExit) cleanupTimer ??= setTimeout(() => {
			if (ptyPid !== void 0) signalPtySessionTree(ptyPid, "SIGKILL");
			if (child.pid !== void 0) killProcessTree(child.pid, {
				force: true,
				detached: false
			});
		}, CLEANUP_TIMEOUT_MS);
	};
	const send = (message) => {
		if (!child.connected) return;
		child.send(message, (error) => {
			if (error) fail(error);
		});
	};
	const timeout = setTimeout(() => fail(/* @__PURE__ */ new Error("Terminal Node worker startup timed out")), STARTUP_TIMEOUT_MS);
	const finish = () => {
		if (exited || !helperExit || !outputEnded || !ipcClosed) return;
		ready.reject(startupError ?? new Error(stderr.trim() || "Terminal Node worker exited before startup"));
		exited = startupError ? { exitCode: 1 } : reportedExit ?? helperExit;
		for (const listener of listeners) listener(exited);
	};
	stdout.pause();
	stdout.setEncoding("utf8");
	stderrPipe.setEncoding("utf8");
	stderrPipe.on("data", (data) => {
		stderr = (stderr + data).slice(-8192);
	});
	child.on("error", (error) => {
		if (child.pid === void 0) {
			helperExit = { exitCode: 1 };
			ipcClosed = true;
		}
		fail(error);
		finish();
	});
	stdout.on("error", fail);
	stdout.once("close", () => {
		outputEnded = true;
		finish();
	});
	stdout.once("end", () => {
		outputEnded = true;
		finish();
	});
	child.once("disconnect", () => {
		ipcClosed = true;
		finish();
	});
	child.on("message", (raw) => {
		const message = decodeTerminalPtyEvent(raw);
		if (!message) {
			fail(/* @__PURE__ */ new Error("Invalid terminal worker message"));
			return;
		}
		if (message.type === "boot") try {
			beforeSpawn?.();
			send({
				type: "start",
				params
			});
		} catch (error) {
			fail(toErrorObject(error, "PTY launch denied"));
		}
		else if (message.type === "ready") {
			ptyPid = message.pid;
			if (!startupError) ready.resolve(message.pid);
		} else if (message.type === "error") fail(new Error(message.message));
		else reportedExit = {
			exitCode: message.exitCode,
			signal: message.signal
		};
	});
	child.once("exit", (code, signal) => {
		clearTimeout(timeout);
		clearTimeout(cleanupTimer);
		if (!reportedExit && ptyPid !== void 0) signalPtySessionTree(ptyPid, "SIGKILL");
		helperExit = {
			exitCode: code ?? 1,
			...signal ? { signal: constants.signals[signal] } : {}
		};
		if (ptyPid === void 0) stdout.resume();
		finish();
	});
	let pid;
	try {
		pid = await ready.promise;
	} finally {
		clearTimeout(timeout);
	}
	return {
		pid,
		write: (data) => send(typeof data === "string" ? {
			type: "input",
			data
		} : {
			type: "input",
			dataBase64: data.toString("base64")
		}),
		resize: (cols, rows) => send({
			type: "resize",
			cols,
			rows
		}),
		pause: () => {
			paused = true;
			stdout.pause();
		},
		resume: () => {
			paused = false;
			if (subscribed) stdout.resume();
		},
		onData: (listener) => {
			stdout.on("data", listener);
			subscribed = true;
			if (!paused) stdout.resume();
			return { dispose() {
				stdout.off("data", listener);
				subscribed = stdout.listenerCount("data") > 0;
				if (!subscribed) stdout.pause();
			} };
		},
		onExit: (listener) => {
			listeners.add(listener);
			if (exited) listener(exited);
			return { dispose: () => listeners.delete(listener) };
		},
		kill: (signal) => {
			send({
				type: "kill",
				signal
			});
			stdout.resume();
		}
	};
}
//#endregion
export { spawnNodeTerminalPty };
