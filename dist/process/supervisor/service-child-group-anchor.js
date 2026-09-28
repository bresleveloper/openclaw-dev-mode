import { t as createDeferredCore } from "../../deferred-D0La5CRk.mjs";
import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { t as GRACEFUL_CANCEL_TIMEOUT_MS } from "../../cancellation-policy-BQ2STJu_.mjs";
import { t as hasLiveOwnedProcessGroupMembers } from "../../service-child-group-ownership-Qp-X4dOa.mjs";
import { t as encodeServiceChildMessage } from "../../service-child-protocol-BASUIVtb.mjs";
import { n as setStdioEntry, t as reserveStdioEntry } from "../../service-child-stdio-Di1Z5Fp4.mjs";
import { closeSync, createWriteStream } from "node:fs";
import { spawn } from "node:child_process";
import { Socket } from "node:net";
import { pipeline } from "node:stream";
import { once } from "node:events";
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
function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms).unref?.();
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
	let stdoutDrained = false;
	let stderrDrained = false;
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
			const framed = {
				...message,
				generation: start.generation,
				sequence
			};
			control.write(encodeServiceChildMessage(framed), () => resolve());
		});
	};
	const closeAuthority = async (reason, hardKill, deadline = Date.now() + GRACEFUL_CANCEL_TIMEOUT_MS) => {
		if (!start || state === "closed") return;
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
			if (forceCleanup || !rootExit || !stdoutDrained || !stderrDrained || !lineageClosed) break;
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
				lineageFds: workerLineageFds
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
		lineageCompletion = next.ownedWorker && true ? await import("../../node-worker-lineage-completion-BnXCwNuv.mjs").catch(() => void 0) : void 0;
		if (start !== next || control !== socket || state !== "starting" || socket.destroyed || socket.readableEnded || socket.writableEnded || !process.connected) {
			await requestCleanup("parent-lost");
			return;
		}
		const { stdio, lineageFd, inheritedLineageFds } = commandStdio(start);
		workerLineageFds = inheritedLineageFds;
		try {
			command = spawn(start.command, start.args, {
				cwd: start.cwd,
				env: start.env,
				argv0: start.argv0,
				stdio,
				detached: false,
				windowsHide: true
			});
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
			if (rootSettlementStarted || !rootResultDelivery || !stdoutDrained || !stderrDrained) return;
			rootSettlementStarted = true;
			await rootResultDelivery;
			rootSettledDone.resolve();
			if (lineageClosed && state === "active") await requestCleanup("lineage-lost");
		};
		const stdout = process.versions.bun ? createWriteStream("", {
			fd: 1,
			autoClose: true
		}) : process.stdout;
		const stderr = process.versions.bun ? createWriteStream("", {
			fd: 2,
			autoClose: true
		}) : process.stderr;
		pipeline(command.stdout, stdout, () => {
			stdoutDrained = true;
			settleRoot();
		});
		pipeline(command.stderr, stderr, () => {
			stderrDrained = true;
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
	process.on("SIGTERM", () => {
		if (state === "active" || start && state === "starting") requestCleanup("parent-lost");
	});
	process.on("SIGINT", () => {
		if (state === "active" || start && state === "starting") requestCleanup("parent-lost");
	});
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
