import { createRequire } from "node:module";
import { once } from "node:events";
import fs, { closeSync, readFileSync, readdirSync } from "node:fs";
import { Socket } from "node:net";
import { pipeline } from "node:stream";
import { spawn, spawnSync } from "node:child_process";
//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
//#endregion
//#region src/shared/deferred.ts
const promiseWithResolvers = Promise;
function createDeferredCore() {
	return promiseWithResolvers.withResolvers();
}
//#endregion
//#region src/process/linux-oom-score.ts
const OOM_SCORE_WRAP_SHELL = "/bin/sh";
const OOM_SCORE_WRAP_SCRIPT = "echo 1000 > /proc/self/oom_score_adj 2>/dev/null; exec \"$0\" \"$@\"";
[
	"echo 1000 > /proc/self/oom_score_adj 2>/dev/null; if [ \"${OC_INTERNAL_OOM_EXEC_BASH_ENV+x}\" = x ]; then BASH_ENV=\"$OC_INTERNAL_OOM_EXEC_BASH_ENV\"; export BASH_ENV; fi; unset OC_INTERNAL_OOM_EXEC_BASH_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_ENV+x}\" = x ]; then ENV=\"$OC_INTERNAL_OOM_EXEC_ENV\"; export ENV; fi; unset OC_INTERNAL_OOM_EXEC_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_CDPATH+x}\" = x ]; then CDPATH=\"$OC_INTERNAL_OOM_EXEC_CDPATH\"; export CDPATH; fi; unset OC_INTERNAL_OOM_EXEC_CDPATH",
	"if [ \"${OC_INTERNAL_OOM_EXEC_PS4+x}\" = x ]; then PS4=\"$OC_INTERNAL_OOM_EXEC_PS4\"; export PS4; fi; unset OC_INTERNAL_OOM_EXEC_PS4; exec \"$0\" \"$@\""
].join("; ");
function isWrapped(command, args) {
	return command === OOM_SCORE_WRAP_SHELL && args[0] === "-c" && args[1] === OOM_SCORE_WRAP_SCRIPT;
}
/** Only small spawn owners may temporarily raise their score; never call from the Gateway. */
function spawnWithInheritedOomScore(command, args, options) {
	if (process.platform !== "linux" || !isWrapped(command, args) || !args[2] || options.shell || options.argv0 !== void 0) return spawn(command, args, options);
	let scoreFd;
	let original;
	try {
		scoreFd = fs.openSync("/proc/self/oom_score_adj", "r+");
		original = fs.readFileSync(scoreFd, "utf8").trim();
		fs.writeSync(scoreFd, "1000", 0, "utf8");
	} catch {
		if (scoreFd !== void 0) fs.closeSync(scoreFd);
		return spawn(command, args, options);
	}
	try {
		return spawn(args[2], args.slice(3), options);
	} finally {
		try {
			fs.writeSync(scoreFd, original, 0, "utf8");
		} catch {
			process.emitWarning("Could not restore spawn owner's Linux OOM score");
		} finally {
			fs.closeSync(scoreFd);
		}
	}
}
//#endregion
//#region src/process/supervisor/cancellation-policy.ts
const GRACEFUL_CANCEL_TIMEOUT_MS = 5e3;
//#endregion
//#region packages/normalization-core/src/error-coercion.ts
function readProperty(value, key) {
	try {
		return value[key];
	} catch {
		return;
	}
}
function extractErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = readProperty(err, "code");
	return typeof code === "string" || typeof code === "number" ? String(code) : void 0;
}
//#endregion
//#region src/shared/pid-alive.ts
function isValidPid(pid) {
	return Number.isInteger(pid) && pid > 0;
}
/**
* Check whether a Linux task is terminal and has no live sibling threads.
* Missing or reaped procfs snapshots require a fresh existence probe.
*/
function isExitedLinuxProcess(pid) {
	if (process.platform !== "linux") return false;
	try {
		const status = fs.readFileSync(`/proc/${pid}/status`, "utf8");
		const state = status.match(/^State:\s+(\S)/m)?.[1];
		const threads = status.match(/^Threads:[ \t]+(\d+)[ \t]*$/m)?.[1];
		if (threads !== "0") return (state === "Z" || state === "X") && threads === "1";
	} catch {}
	try {
		process.kill(pid, 0);
	} catch (error) {
		return error.code === "ESRCH";
	}
	return false;
}
/** Returns true only when the PID is invalid, missing, or a known terminal Linux task. */
function isPidDefinitelyDead(pid) {
	if (!isValidPid(pid)) return true;
	try {
		process.kill(pid, 0);
	} catch (err) {
		return err.code === "ESRCH";
	}
	return isExitedLinuxProcess(pid);
}
//#endregion
//#region src/process/supervisor/service-child-group-ownership.ts
function readLinuxProcessUid(pid) {
	try {
		const lines = readFileSync(`/proc/${pid}/status`, "utf8").split("\n").filter((line) => line.startsWith("Uid:"));
		const ids = (lines.length === 1 ? /^Uid:[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]*$/.exec(lines[0]) : null)?.slice(1).map(Number);
		const inspectorUid = process.getuid?.();
		return ids?.every((uid) => Number.isSafeInteger(uid) && uid <= 4294967295) ? ids.find((uid) => uid === inspectorUid) ?? ids[0] : void 0;
	} catch {
		return;
	}
}
/** Stop in-group descendants without killing the anchor that observes their lineage. */
function killOwnedProcessGroupMembers() {
	for (const { pid, pgid } of readProcessGroupMembers(1e3)) {
		if (pid === process.pid || pgid !== process.pid) continue;
		try {
			process.kill(pid, "SIGKILL");
		} catch (error) {
			if (extractErrorCode(error) !== "ESRCH") throw error;
		}
	}
}
/** The caller supplies native command inspection; the standalone group worker stays dependency-free. */
function* readProcessGroupMembers(timeoutMs, commandInspection) {
	const includeCommand = commandInspection !== void 0;
	if (process.platform === "linux") {
		const deadline = Date.now() + timeoutMs;
		for (const name of readdirSync("/proc")) {
			if (Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
			if (!/^\d+$/.test(name)) continue;
			const pid = Number(name);
			let stat;
			let argv;
			let uid;
			let opaqueForeignOwner = false;
			try {
				stat = readFileSync(`/proc/${name}/stat`, "utf8");
				if (includeCommand) {
					uid = readLinuxProcessUid(pid);
					try {
						argv = readFileSync(`/proc/${name}/cmdline`, "utf8").split("\0").filter(Boolean);
					} catch (error) {
						const inspectorUid = process.getuid?.();
						opaqueForeignOwner = uid !== void 0 && inspectorUid !== void 0 && uid !== inspectorUid && ["EACCES", "EPERM"].includes(extractErrorCode(error) ?? "");
						if (!opaqueForeignOwner) throw error;
					}
				}
			} catch (error) {
				if (pid !== process.pid && ["ENOENT", "ESRCH"].includes(extractErrorCode(error) ?? "")) continue;
				throw new Error(`Could not classify PID ${pid}: process command inspection failed (${extractErrorCode(error) ?? "unavailable"}).`, { cause: error });
			}
			const match = /^(\d+) \([\s\S]*\) (\S) (\d+) (\d+)(?:\s|$)/.exec(stat);
			if (!match || Number(match[1]) !== pid || Date.now() >= deadline) throw new Error("Process group census is unavailable");
			if (argv?.length === 0) {
				const flags = Number(stat.slice(stat.lastIndexOf(")") + 2).split(/\s+/)[6]);
				if (!(Number.isInteger(flags) && (flags & 2097152) !== 0) && !isPidDefinitelyDead(pid)) {
					const inspectorUid = process.getuid?.();
					if (uid !== void 0 && inspectorUid !== void 0 && uid !== inspectorUid) {
						opaqueForeignOwner = true;
						argv = void 0;
					} else throw new Error(`Could not classify PID ${pid}: live userspace process has no readable arguments.`);
				}
			}
			yield {
				pid,
				pgid: Number(match[4]),
				state: match[2],
				...argv ? { command: {
					ppid: Number(match[3]),
					argv,
					...uid === void 0 ? {} : { uid }
				} } : opaqueForeignOwner && uid !== void 0 ? { command: {
					ppid: Number(match[3]),
					argvUnavailable: true,
					uid
				} } : {}
			};
		}
		if (Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
		return;
	}
	if (includeCommand && process.platform !== "darwin") throw new Error(`Exact process command census is unavailable on ${process.platform}.`);
	const deadline = Date.now() + timeoutMs;
	const census = spawnSync("/bin/ps", [
		"-A",
		"-o",
		includeCommand ? "pid=,pgid=,stat=,ppid=,uid=" : "pid=,pgid=,stat="
	], {
		encoding: "utf8",
		timeout: timeoutMs,
		maxBuffer: 4194304
	});
	if (census.error || census.status !== 0) throw new Error("Process group census is unavailable");
	for (const line of census.stdout.split("\n")) {
		if (!line.trim()) continue;
		const match = includeCommand ? /^\s*(\d+)\s+(\d+)\s+(\S+)\s+(\d+)\s+(-?\d+)\s*$/.exec(line) : /^\s*(\d+)\s+(\d+)\s+(\S+)\s*$/.exec(line);
		if (!match) throw new Error("Process group census is unavailable");
		const pid = Number(match[1]);
		if (pid !== census.pid) {
			if (includeCommand && Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
			const command = includeCommand ? match[3].startsWith("Z") || pid === 0 ? { argv: [] } : commandInspection?.readDarwinCommand(pid, Number(match[5]) >>> 0) : void 0;
			if (includeCommand && !command) continue;
			yield {
				pid,
				pgid: Number(match[2]),
				state: match[3],
				...command ? { command: {
					ppid: Number(match[4]),
					...command,
					uid: Number(match[5]) >>> 0
				} } : {}
			};
		}
	}
	if (includeCommand && Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
}
/** Advisory retirement timing only; the host owns kernel group-disappearance proof. */
function hasLiveOwnedProcessGroupMembers(timeoutMs = 1e3) {
	let observedOwner = false;
	try {
		for (const { pid, pgid, state } of readProcessGroupMembers(Math.max(1, Math.min(1e3, timeoutMs)))) if (pid === process.pid) {
			if (pgid !== process.pid) return;
			observedOwner = true;
		} else if (pgid === process.pid && (!state.startsWith("Z") || process.platform === "linux" && !isPidDefinitelyDead(pid))) return true;
	} catch {
		return;
	}
	return observedOwner ? false : void 0;
}
//#endregion
//#region src/process/supervisor/service-child-protocol.ts
function encodeServiceChildMessage(message) {
	return `${JSON.stringify(message)}\n`;
}
//#endregion
//#region src/process/supervisor/service-child-stdio.ts
function setStdioEntry(stdio, fd, value) {
	while (stdio.length <= fd) stdio.push("ignore");
	stdio[fd] = value;
}
function reserveStdioEntry(stdio, value) {
	let fd = 3;
	while (stdio[fd] !== void 0 && stdio[fd] !== "ignore") fd += 1;
	setStdioEntry(stdio, fd, value);
	return fd;
}
//#endregion
//#region src/process/supervisor/service-child-group-anchor.ts
function commandStdio(start) {
	const stdio = [
		start.stdinMode === "inherit" ? "inherit" : "pipe",
		"pipe",
		"pipe"
	];
	if (start.secretFd !== void 0) setStdioEntry(stdio, start.secretFd, start.secretFd);
	const lineageFd = reserveStdioEntry(stdio, start.lineageFd ?? "pipe");
	const inheritedLineageFds = [lineageFd, ...(start.parentLineageFds ?? []).map((fd) => reserveStdioEntry(stdio, fd))];
	if (start.ownedWorker) stdio.push("ipc");
	return {
		stdio,
		lineageFd,
		inheritedLineageFds
	};
}
function delay(ms, retainOwner = false) {
	return new Promise((resolve) => {
		const timer = setTimeout(resolve, ms);
		if (!retainOwner) timer.unref?.();
	});
}
function runServiceChildGroupAnchor() {
	let start;
	let state = "starting";
	let sequence = 0;
	let lastHostSequence = 0;
	let command;
	let lineageCompletion;
	let inheritedLineageClosed = false;
	let workerStarted = false;
	let workerLineageFds = [];
	let control;
	let rootSettlementStarted = false;
	let rootResultDelivery;
	let rootExit;
	const pendingOutput = /* @__PURE__ */ new Set(["stdout", "stderr"]);
	let lineageClosed = false;
	let lineageObservationFailed = false;
	let markHostLineageClosed;
	let forceCleanup = false;
	const forceCleanupRequested = createDeferredCore();
	const lineageDone = createDeferredCore();
	const rootExited = createDeferredCore();
	const rootSettledDone = createDeferredCore();
	const startupErrorAcknowledged = createDeferredCore();
	const retirementReady = createDeferredCore();
	let closingSequence;
	const send = async (message) => {
		if (!start || !control || control.destroyed) return;
		sequence += 1;
		await new Promise((resolve) => {
			control.write(encodeServiceChildMessage({
				...message,
				generation: start.generation,
				sequence
			}), () => resolve());
		});
	};
	const closeAuthority = async (reason, hardKill, deadline = Date.now() + GRACEFUL_CANCEL_TIMEOUT_MS) => {
		if (!start || state === "closed") return;
		if (start.treeOwnership === "linux-subreaper") {
			if (command && true) throw new Error("native owner cannot close before descendant extinction");
			state = "closed";
			for (const fd of new Set(start.parentLineageFds ?? [])) closeSync(fd);
			closingSequence = sequence + 1;
			await send({
				type: "closing",
				reason
			});
			const acknowledged = await Promise.race([retirementReady.promise, delay(Math.max(0, deadline - Date.now())).then(() => false)]);
			control?.end(() => process.exit(acknowledged ? 0 : 1));
			return;
		}
		state = "closed";
		if (hardKill && start.lineageFd === void 0 && !lineageClosed) {
			process.kill(0, "SIGKILL");
			return;
		}
		const requiresAcknowledgement = start.acknowledgeClosing === true;
		closingSequence = requiresAcknowledgement ? sequence + 1 : void 0;
		const remainingMs = deadline - Date.now();
		if (remainingMs > 0) send({
			type: "closing",
			reason
		}).then(() => {
			if (!requiresAcknowledgement) retirementReady.resolve(true);
		}, () => retirementReady.resolve(false));
		if (remainingMs <= 0 || !await Promise.race([retirementReady.promise, delay(remainingMs).then(() => false)]) || Date.now() >= deadline || hardKill) {
			process.kill(0, "SIGKILL");
			return;
		}
		control?.end(() => process.exit(0));
	};
	const closeInheritedLineage = () => {
		if (start?.lineageFd !== void 0 && !inheritedLineageClosed) {
			inheritedLineageClosed = true;
			closeSync(start.lineageFd);
		}
	};
	const reportStartupFailure = async (error, hardKill = false) => {
		closeInheritedLineage();
		await send({
			type: "startup-error",
			error
		});
		await Promise.race([startupErrorAcknowledged.promise, retirementReady.promise]);
		await closeAuthority("lineage-lost", hardKill);
	};
	const requestCleanup = async (reason, signal = "SIGTERM") => {
		if (!start || state === "closed") return;
		if (state === "closing") {
			forceCleanup ||= signal === "SIGKILL";
			if (forceCleanup) forceCleanupRequested.resolve();
			return;
		}
		state = "closing";
		forceCleanup = signal === "SIGKILL";
		if (!command) {
			await reportStartupFailure("command startup cancelled before spawn", true);
			return;
		}
		const cleanupDeadline = Date.now() + GRACEFUL_CANCEL_TIMEOUT_MS;
		const termGraceDone = delay(GRACEFUL_CANCEL_TIMEOUT_MS);
		if (start.ownedWorker) {
			if (!forceCleanup) process.kill(0, "SIGTERM");
			const settled = Promise.all([rootExited.promise, lineageDone.promise]);
			if (!forceCleanup) await Promise.race([
				settled,
				termGraceDone,
				forceCleanupRequested.promise
			]);
			if (!rootExit) command?.kill("SIGKILL");
			if (!lineageClosed) killOwnedProcessGroupMembers();
			await settled;
			await rootResultDelivery;
			let lineageRecorded = false;
			if (rootExit && lineageClosed && lineageCompletion) try {
				lineageRecorded = lineageCompletion.recordNodeWorkerLineageSettled(start.cleanupBinding);
			} catch {}
			if (!lineageRecorded) await send({
				type: "output",
				stream: "stderr",
				chunk: "node worker lineage completion was not recorded; restart recovery will retain capacity until cleanup can be verified\n"
			});
			if (!forceCleanup) await Promise.race([
				rootSettledDone.promise,
				termGraceDone,
				forceCleanupRequested.promise
			]);
			await closeAuthority(reason, true);
			return;
		}
		if (!forceCleanup) {
			process.kill(0, "SIGTERM");
			await Promise.race([
				lineageDone.promise,
				termGraceDone,
				forceCleanupRequested.promise
			]);
		}
		if (state !== "closing" || !start) return;
		if (lineageClosed && !rootExit && !forceCleanup) await Promise.race([
			rootExited.promise,
			termGraceDone,
			forceCleanupRequested.promise
		]);
		if (state !== "closing" || !start) return;
		if (rootExit && !forceCleanup) {
			await Promise.race([
				rootSettledDone.promise,
				termGraceDone,
				forceCleanupRequested.promise
			]);
			if (state !== "closing" || !start) return;
		}
		for (;;) {
			if (forceCleanup || !rootExit || pendingOutput.size > 0 || !lineageClosed) break;
			const remainingMs = cleanupDeadline - Date.now();
			if (remainingMs <= 0) break;
			if (hasLiveOwnedProcessGroupMembers(remainingMs) === false) {
				await closeAuthority(reason, false, cleanupDeadline);
				return;
			}
			const nextObservationMs = Math.min(100, cleanupDeadline - Date.now());
			if (nextObservationMs <= 0) break;
			await Promise.race([delay(nextObservationMs), forceCleanupRequested.promise]);
		}
		await closeAuthority(reason, true);
	};
	const onControlMessage = (message) => {
		if (!start || message.generation !== start.generation || !Number.isSafeInteger(message.sequence) || message.sequence <= lastHostSequence) return;
		if (message.type === "closing-ack") {
			if (state === "closed" && closingSequence !== void 0 && message.closingSequence === closingSequence) {
				lastHostSequence = message.sequence;
				retirementReady.resolve(true);
			}
			return;
		}
		if (state === "closed") return;
		lastHostSequence = message.sequence;
		if (message.type === "startup-error-ack") {
			startupErrorAcknowledged.resolve();
			return;
		}
		if (message.type === "lineage-closed") {
			markHostLineageClosed?.();
			return;
		}
		if (message.type === "worker-close") {
			if (start.ownedWorker && !command) requestCleanup("cancel");
			else if (start.ownedWorker && command?.connected) command.disconnect();
			return;
		}
		if (message.type === "worker-start") {
			if (!start.ownedWorker || workerStarted || state !== "active") return;
			if (!command?.connected) {
				requestCleanup("parent-lost");
				return;
			}
			workerStarted = true;
			command.send({
				type: "openclaw-worker-start-v1",
				lineageFds: workerLineageFds,
				...start.nativeProcessOwner ? { nativeProcessOwner: start.nativeProcessOwner } : {}
			}, (error) => {
				if (error) requestCleanup("parent-lost");
			});
			return;
		}
		requestCleanup("cancel", message.signal);
	};
	const startCommand = async (next) => {
		const controlFd = next.controlFd;
		if (controlFd === void 0) {
			process.exitCode = 1;
			return;
		}
		start = next;
		const socket = process.versions.bun ? new Socket({
			readable: true,
			writable: true
		}) : new Socket({
			fd: controlFd,
			readable: true,
			writable: true
		});
		control = socket;
		socket.setEncoding("utf8");
		let pending = "";
		socket.on("data", (chunk) => {
			pending += chunk;
			for (;;) {
				const newline = pending.indexOf("\n");
				if (newline < 0) break;
				const line = pending.slice(0, newline);
				pending = pending.slice(newline + 1);
				try {
					onControlMessage(JSON.parse(line));
				} catch {
					requestCleanup("parent-lost");
				}
			}
		});
		const onControlLoss = () => {
			retirementReady.resolve(false);
			if (state !== "closed") requestCleanup("parent-lost");
		};
		socket.once("end", onControlLoss);
		socket.once("close", onControlLoss);
		socket.once("error", onControlLoss);
		if (process.versions.bun) socket.connect({ fd: controlFd });
		lineageCompletion = (next.ownedWorker, void 0);
		if (next.treeOwnership === "linux-subreaper") try {
			throw new Error("portable workers require their admitted host-native process owner");
		} catch (error) {
			await reportStartupFailure(error instanceof Error ? error.message : String(error));
			return;
		}
		if (start !== next || control !== socket || state !== "starting" || socket.destroyed || socket.readableEnded || socket.writableEnded || !process.connected) {
			await requestCleanup("parent-lost");
			return;
		}
		const { stdio, lineageFd, inheritedLineageFds } = commandStdio(start);
		workerLineageFds = inheritedLineageFds;
		let shutdownOutput;
		try {
			if (process.versions.bun && (process.platform === "darwin" || process.platform === "linux")) {
				const ffi = createRequire(import.meta.url)("bun:ffi");
				const library = process.platform === "darwin" ? "/usr/lib/libSystem.B.dylib" : "libc.so.6";
				shutdownOutput = ffi.dlopen(library, { shutdown: {
					args: ["i32", "i32"],
					returns: "i32"
				} }).symbols.shutdown;
			}
			command = spawnWithInheritedOomScore(start.command, start.args, {
				cwd: start.cwd,
				env: start.env,
				argv0: start.argv0,
				stdio,
				detached: false,
				windowsHide: true
			});
			if (command.pid);
			await once(command, "spawn");
		} catch (error) {
			await reportStartupFailure(error instanceof Error ? error.message : String(error));
			return;
		}
		const markLineageClosed = () => {
			if (lineageClosed || lineageObservationFailed) return;
			lineageClosed = true;
			lineageDone.resolve();
			if (state === "active") (async () => {
				await rootExited.promise;
				if (state !== "active") return;
				if (rootSettlementStarted) await rootSettledDone.promise;
				if (state !== "active") return;
				requestCleanup("lineage-lost");
			})();
		};
		if (start.lineageFd !== void 0) {
			markHostLineageClosed = markLineageClosed;
			closeInheritedLineage();
		} else {
			const lineage = command.stdio[lineageFd];
			if (!lineage) {
				await send({
					type: "startup-error",
					error: "command lineage pipe was not created"
				});
				await requestCleanup("lineage-lost", "SIGKILL");
				return;
			}
			lineage.once("end", markLineageClosed);
			const markLineageFailed = () => {
				if (lineageClosed || lineageObservationFailed) return;
				lineageObservationFailed = true;
				lineageDone.resolve();
				requestCleanup("lineage-lost");
			};
			lineage.once("close", () => {
				if (!lineage.readableEnded) markLineageFailed();
			});
			lineage.once("error", markLineageFailed);
			lineage.resume();
		}
		const settleRoot = async () => {
			if (rootSettlementStarted || !rootResultDelivery || pendingOutput.size > 0) return;
			rootSettlementStarted = true;
			await rootResultDelivery;
			rootSettledDone.resolve();
			if (lineageClosed && state === "active") await requestCleanup("lineage-lost");
		};
		for (const stream of ["stdout", "stderr"]) pipeline(command[stream], process[stream], () => {
			shutdownOutput?.(stream === "stdout" ? 1 : 2, 1);
			pendingOutput.delete(stream);
			settleRoot();
		});
		if (start.stdinMode !== "inherit" && command.stdin) {
			const input = process.stdin;
			const destination = command.stdin;
			const endInput = () => destination.end();
			let inputClosed = false;
			const stopInput = () => {
				input.unpipe(destination);
				input.off("end", endInput);
				input.destroy();
				if (!inputClosed) {
					inputClosed = true;
					send({ type: "stdin-closed" });
				}
			};
			destination.once("error", stopInput);
			destination.once("close", stopInput);
			input.pipe(destination, { end: false });
			if (input.readableEnded) endInput();
			else input.once("end", endInput);
		}
		command.once("error", (error) => {
			if (state === "starting") reportStartupFailure(error.message);
		});
		if (start.ownedWorker) command.on("message", (message) => {
			if (state === "active") send({
				type: "worker-message",
				message
			});
		});
		if (command.pid && state === "starting") {
			state = "active";
			send({
				type: "ready",
				commandPid: command.pid,
				anchorPid: process.pid
			});
		}
		command.once("exit", (code, signal) => {
			rootExit = {
				code,
				signal
			};
			rootResultDelivery = send({
				type: "root-result",
				code,
				signal
			});
			rootExited.resolve();
			settleRoot();
		});
	};
	const onParentSignal = () => {
		if (state === "active" || start && state === "starting") requestCleanup("parent-lost");
	};
	process.on("SIGTERM", onParentSignal);
	process.on("SIGINT", onParentSignal);
	process.once("disconnect", () => {
		retirementReady.resolve(false);
		if (state !== "closed") requestCleanup("parent-lost");
	});
	process.on("message", (raw) => {
		const message = raw;
		if (message.type === "start" && !start && state === "starting") {
			if (isRecord(raw) && raw.acknowledgeClosing !== void 0 && raw.acknowledgeClosing !== true) process.exit(1);
			startCommand(message);
		} else if (message.type === "parent-loss" && message.generation === start?.generation) {
			retirementReady.resolve(false);
			requestCleanup("parent-lost");
		}
	});
}
runServiceChildGroupAnchor();
//#endregion
export { runServiceChildGroupAnchor };
