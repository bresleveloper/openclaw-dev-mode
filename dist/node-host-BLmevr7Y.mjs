import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { a as resolveExecutableFromPathEnv } from "./executable-path-BMRdcL7i.mjs";
import { a as resolveExecutableFromUserShellPath } from "./shell-env-B_7LkFoy.mjs";
import { t as spawnTerminalPty } from "./terminal-pty-LhLIkMbf.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/node-host/pty-command.ts
function resolvePtyCwd(candidate, required = false) {
	if (candidate && path.isAbsolute(candidate)) try {
		if (fs.statSync(candidate).isDirectory()) return candidate;
	} catch {}
	if (required) throw new Error("INVALID_REQUEST: cwd must be an existing absolute directory on this node");
	return os.homedir();
}
function decodePtyInput(payloadJSON) {
	try {
		const value = JSON.parse(payloadJSON);
		if (!isRecord(value)) return null;
		const input = value;
		if (input.kind === "data" && typeof input.data === "string") return {
			kind: "data",
			data: input.data
		};
		if (input.kind === "resize" && Number.isInteger(input.cols) && Number.isInteger(input.rows) && input.cols >= 1 && input.cols <= 2e3 && input.rows >= 1 && input.rows <= 2e3) return {
			kind: "resize",
			cols: input.cols,
			rows: input.rows
		};
		return null;
	} catch {
		return null;
	}
}
function decodePtyParams(paramsJSON, action) {
	let value;
	try {
		value = JSON.parse(paramsJSON ?? "");
	} catch {
		throw new Error(`INVALID_REQUEST: terminal ${action} params must be valid JSON`);
	}
	if (!isRecord(value)) throw new Error(`INVALID_REQUEST: terminal ${action} params must be an object`);
	const allowed = /* @__PURE__ */ new Set([
		action === "start" ? "initialMessage" : "threadId",
		"cwd",
		"cols",
		"rows"
	]);
	const unknown = Object.keys(value).find((key) => !allowed.has(key));
	if (unknown) throw new Error(`INVALID_REQUEST: unknown terminal ${action} parameter: ${unknown}`);
	const dimension = (candidate, label) => {
		if (typeof candidate !== "number" || !Number.isInteger(candidate) || candidate < 1 || candidate > 2e3) throw new Error(`INVALID_REQUEST: ${label} must be an integer from 1 to 2000`);
		return candidate;
	};
	if (value.cwd !== void 0 && (typeof value.cwd !== "string" || Buffer.byteLength(value.cwd, "utf8") > 4096)) throw new Error("INVALID_REQUEST: cwd must be a bounded string");
	return {
		record: value,
		cwd: typeof value.cwd === "string" && value.cwd ? value.cwd : void 0,
		cols: dimension(value.cols, "cols"),
		rows: dimension(value.rows, "rows")
	};
}
function decodeNodePtyResumeParams(paramsJSON, validateThreadId) {
	const { record, ...params } = decodePtyParams(paramsJSON, "resume");
	return {
		threadId: validateThreadId(record.threadId),
		...params
	};
}
function decodeNodePtyStartParams(paramsJSON) {
	const { record, cwd, ...size } = decodePtyParams(paramsJSON, "start");
	if (record.initialMessage !== void 0 && (typeof record.initialMessage !== "string" || record.initialMessage.length > 16384)) throw new Error("INVALID_REQUEST: initialMessage must be a string of at most 16384 characters");
	return {
		cwd: resolvePtyCwd(cwd, true),
		...size,
		...typeof record.initialMessage === "string" ? { initialMessage: record.initialMessage } : {}
	};
}
/** Runs one allowlisted plugin-owned command in an interactive node PTY. */
async function runNodePtyCommand(params, io, spawn = spawnTerminalPty) {
	if (io.signal.aborted) return { exitCode: 130 };
	const env = mergeProcessEnv([
		process.env,
		params.env,
		params.pathEnv ? { PATH: params.pathEnv } : void 0,
		{ OPENCLAW_TERMINAL: "1" }
	]);
	params.assertCurrent?.();
	const pty = await spawn({
		file: params.file,
		args: params.args,
		cwd: resolvePtyCwd(params.cwd, params.requiredCwd),
		env,
		cols: params.cols,
		rows: params.rows
	}, {
		abortSignal: io.signal,
		assertCurrent: params.assertCurrent
	});
	let outputQueue = Promise.resolve();
	let settled = false;
	const kill = () => pty.kill();
	io.signal.addEventListener("abort", kill, { once: true });
	if (io.signal.aborted) kill();
	io.onInput((payloadJSON) => {
		if (settled || io.signal.aborted) return;
		const input = decodePtyInput(payloadJSON);
		try {
			if (input?.kind === "data") pty.write(input.data);
			else if (input?.kind === "resize") pty.resize(input.cols, input.rows);
		} catch {}
	});
	pty.onData((chunk) => {
		if (settled) return;
		pty.pause();
		outputQueue = outputQueue.then(() => io.emitChunk(chunk)).finally(() => pty.resume());
	});
	return await new Promise((resolve) => {
		pty.onExit((event) => {
			if (settled) return;
			settled = true;
			io.signal.removeEventListener("abort", kill);
			outputQueue.finally(() => resolve({
				exitCode: event.exitCode,
				...event.signal ? { signal: event.signal } : {}
			}));
		});
	});
}
//#endregion
//#region src/plugin-sdk/node-host.ts
/** Resolve a node-host executable using the selected PATH source policy. */
function resolveNodeHostExecutable(executable, options) {
	const env = options.env ?? process.env;
	const resolve = (includeExtensionless) => {
		if (options.strategy === "direct") {
			const resolved = resolveExecutableFromPathEnv(executable, options.pathEnv ?? env.PATH ?? env.Path ?? "", env, { includeExtensionless });
			return resolved ? { executable: resolved } : void 0;
		}
		return resolveExecutableFromUserShellPath(executable, {
			env,
			pathEnv: options.pathEnv,
			includeExtensionless,
			strategy: options.strategy
		});
	};
	if (options.includeExtensionless !== void 0 || process.platform !== "win32") return resolve(options.includeExtensionless ?? true);
	return resolve(false) ?? resolve(true);
}
//#endregion
export { runNodePtyCommand as i, decodeNodePtyResumeParams as n, decodeNodePtyStartParams as r, resolveNodeHostExecutable as t };
