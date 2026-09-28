import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as killProcessTree } from "./kill-tree-BGQdx374.mjs";
import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { t as STAGED_INPUT_GIT_PATHSPEC } from "./staged-inputs-De-HBXyz.mjs";
import { t as runGitWorkerOperation } from "./git-worker-Da8RAwNx.mjs";
import { i as workerSshCommandOptions } from "./ssh-D4TnVP7T.mjs";
import { t as workspaceInventoryError } from "./workspace-inventory-error-CmipulKw.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
//#region src/gateway/worker-environments/workspace-sync-inventory.ts
const COMMAND_KILL_GRACE_MS = 300;
/** Exact rsync exemptions, prepared once without walking input file contents. */
async function readWorkspaceStagedInputDirectories(rootDir) {
	return await runGitWorkerOperation({
		type: "workspace.inventory.staged-directories",
		input: { rootDir }
	}, { inputBytes: Buffer.byteLength(rootDir) });
}
async function readWorkspaceTransferPaths(filePath, signal) {
	return await runGitWorkerOperation({
		type: "workspace.inventory.paths",
		input: { filePath }
	}, {
		signal,
		inputBytes: Buffer.byteLength(filePath)
	});
}
async function writeInventory(command, outputPath, signal) {
	signal?.throwIfAborted();
	const output = await fs.open(outputPath, "wx", 384);
	try {
		await runGitWorkerOperation(command, {
			signal,
			inputBytes: Object.values(command.input).reduce((bytes, value) => bytes + Buffer.byteLength(value), 0),
			onInventoryChunk: async (bytes, context) => {
				context.signal.throwIfAborted();
				await output.writeFile(bytes);
				context.signal.throwIfAborted();
			}
		});
		signal?.throwIfAborted();
		return outputPath;
	} finally {
		await output.close();
	}
}
async function filterExistingGitTransferList(params) {
	return await writeInventory({
		type: "workspace.inventory.existing",
		input: {
			gitRoot: params.gitRoot,
			preparedListPath: params.preparedListPath
		}
	}, params.outputPath, params.signal);
}
async function runWorkspaceInventoryCommandToFile(params) {
	const [command, ...args] = params.argv;
	if (!command) throw new Error("Worker workspace command requires an executable");
	const output = await fs.open(params.outputPath, "wx", 384);
	let input;
	let stderr = "";
	let timer;
	let terminationTimer;
	let abort;
	let abortedCommand = false;
	let outputError;
	let outputBytes = 0;
	let outputWrite = Promise.resolve();
	try {
		input = params.inputPath ? await fs.open(params.inputPath, "r") : void 0;
		params.signal.throwIfAborted();
		const boundedOutput = params.maxOutputBytes !== void 0;
		const child = spawn(command, args, {
			env: params.baseEnv ?? workerSshCommandOptions({ timeoutMs: params.timeoutMs }).baseEnv,
			stdio: [
				input?.fd ?? "ignore",
				boundedOutput ? "pipe" : output.fd,
				"pipe"
			],
			...process.platform !== "win32" ? { detached: true } : {},
			windowsHide: true
		});
		const childStderr = child.stderr;
		if (!childStderr) throw new Error("Worker workspace command has no stderr pipe");
		childStderr.setEncoding("utf8");
		childStderr.on("data", (chunk) => {
			stderr = sliceUtf16Safe(`${stderr}${chunk}`, -4096);
		});
		const result = await new Promise((resolve) => {
			let settled = false;
			const finish = (value) => {
				if (settled) return;
				settled = true;
				resolve(value);
			};
			let terminationStarted = false;
			const terminate = () => {
				if (settled || terminationStarted) return;
				terminationStarted = true;
				const pid = child.pid;
				if (typeof pid === "number" && pid > 0) killProcessTree(pid, {
					graceMs: COMMAND_KILL_GRACE_MS,
					detached: process.platform !== "win32"
				});
				else child.kill("SIGTERM");
				terminationTimer = setTimeout(() => {
					if (typeof pid === "number" && pid > 0) killProcessTree(pid, {
						force: true,
						detached: process.platform !== "win32"
					});
					else child.kill("SIGKILL");
					childStderr.destroy();
					finish({ code: child.exitCode });
				}, 1300);
				terminationTimer.unref?.();
			};
			if (boundedOutput) {
				const childStdout = child.stdout;
				if (!childStdout) {
					finish({
						code: null,
						error: /* @__PURE__ */ new Error("Worker workspace command has no stdout pipe")
					});
					return;
				}
				childStdout.on("data", (value) => {
					const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
					outputBytes += chunk.byteLength;
					if (outputBytes > params.maxOutputBytes) {
						outputError = workspaceInventoryError(`Cloud workspace pack exceeds the ${params.maxOutputBytes} byte limit`);
						terminate();
						return;
					}
					childStdout.pause();
					outputWrite = outputWrite.then(async () => {
						await output.writeFile(chunk);
						childStdout.resume();
					}).catch((error) => {
						outputError = error instanceof Error ? error : new Error(String(error));
						terminate();
					});
				});
				childStdout.once("error", (error) => {
					outputError = error;
					terminate();
				});
			}
			child.once("error", (error) => finish({
				code: null,
				error
			}));
			child.once("close", (code) => finish({ code }));
			abort = () => {
				abortedCommand = !terminationStarted && child.exitCode === null && child.signalCode === null;
				terminate();
			};
			params.signal.addEventListener("abort", abort, { once: true });
			timer = setTimeout(terminate, params.timeoutMs);
			timer.unref?.();
			if (params.signal.aborted) abort();
		});
		await outputWrite;
		if (outputError) throw outputError;
		if (result.error) throw result.error;
		if (abortedCommand) params.signal.throwIfAborted();
		if (result.code !== 0) throw new Error(stderr.trim() ? `Worker workspace file enumeration failed: ${stderr.trim()}` : "Worker workspace file enumeration failed");
		params.signal.throwIfAborted();
	} finally {
		clearTimeout(timer);
		clearTimeout(terminationTimer);
		if (abort) params.signal.removeEventListener("abort", abort);
		await output.close();
		await input?.close();
	}
}
async function settleWorkspaceInventoryCommands(commands, signal) {
	for (const result of await Promise.allSettled(commands)) if (result.status === "rejected" && (!signal.aborted || result.reason !== signal.reason)) throw result.reason;
	signal.throwIfAborted();
}
async function createWorkspaceGitTransferList(params) {
	const eligiblePath = path.join(params.temporaryDirectory, "eligible");
	const ignoredPath = path.join(params.temporaryDirectory, "ignored");
	const selectedPath = path.join(params.temporaryDirectory, "selected");
	const outputPath = path.join(params.temporaryDirectory, "transfer-list");
	await fs.mkdir(params.temporaryDirectory, { mode: 448 });
	await runWorkspaceInventoryCommandToFile({
		argv: [
			"git",
			"-C",
			params.gitRoot,
			"ls-files",
			"--full-name",
			"--cached",
			"--others",
			"--exclude-standard",
			"-z"
		],
		outputPath: eligiblePath,
		signal: params.signal,
		timeoutMs: params.timeoutMs
	});
	const worktreeIncludePath = path.join(params.gitRoot, ".worktreeinclude");
	const hasWorktreeInclude = (await fs.lstat(worktreeIncludePath).catch((error) => {
		if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return;
		throw error;
	}))?.isFile() === true;
	await settleWorkspaceInventoryCommands([runWorkspaceInventoryCommandToFile({
		argv: [
			"git",
			"-C",
			params.gitRoot,
			"ls-files",
			"--full-name",
			"--others",
			"--ignored",
			"--exclude-standard",
			"-z",
			...hasWorktreeInclude ? [] : ["--", STAGED_INPUT_GIT_PATHSPEC]
		],
		outputPath: ignoredPath,
		signal: params.signal,
		timeoutMs: params.timeoutMs
	}), hasWorktreeInclude ? runWorkspaceInventoryCommandToFile({
		argv: [
			"git",
			"-C",
			params.gitRoot,
			"ls-files",
			"--full-name",
			"--others",
			"--ignored",
			`--exclude-from=${worktreeIncludePath}`,
			"-z"
		],
		outputPath: selectedPath,
		signal: params.signal,
		timeoutMs: params.timeoutMs
	}) : fs.writeFile(selectedPath, "", { mode: 384 })], params.signal);
	await writeInventory({
		type: "workspace.inventory.select",
		input: {
			gitRoot: params.gitRoot,
			eligiblePath,
			ignoredPath,
			selectedPath
		}
	}, outputPath, params.signal);
	return outputPath;
}
//#endregion
export { runWorkspaceInventoryCommandToFile as a, readWorkspaceTransferPaths as i, filterExistingGitTransferList as n, settleWorkspaceInventoryCommands as o, readWorkspaceStagedInputDirectories as r, createWorkspaceGitTransferList as t };
