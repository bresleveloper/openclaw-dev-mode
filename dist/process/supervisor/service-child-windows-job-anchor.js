import { n as coerceErrorMessage } from "../../error-coercion-BwMr25F8.mjs";
import { t as createDeferredCore } from "../../deferred-D0La5CRk.mjs";
import { r as resolveEnvironmentValue, t as mergeProcessEnv } from "../../process-env-BNjOnVtu.mjs";
import { t as getWindowsCmdExePath } from "../../windows-install-roots-BWNEWHjx.mjs";
import { t as createWindowsOutputDecoder } from "../../windows-encoding-BZ9QWkjs.mjs";
import { WindowsJob } from "@openclaw/proc-safe/windows-job";
//#region src/process/supervisor/service-child-windows-job-anchor.ts
const IDLE_OBSERVATION_MS = 10;
const OUTPUT_BUFFER_BYTES = 65536;
const OUTPUT_ROUNDS_PER_TURN = 2;
function sendProcessMessage(message) {
	return new Promise((resolve, reject) => {
		if (!process.connected || !process.send) {
			reject(/* @__PURE__ */ new Error("Windows Job anchor IPC is closed"));
			return;
		}
		process.send(message, (error) => error ? reject(error) : resolve());
	});
}
function runServiceChildWindowsJobAnchor() {
	const launchGrant = createDeferredCore();
	let start;
	let state = "starting";
	let sequence = 0;
	let lastHostSequence = 0;
	let outboundQueue = Promise.resolve();
	let job;
	let child;
	let rootObserved = false;
	let extinctionProven = false;
	let terminationRequested = false;
	let closeReason;
	let lifecycleTimer;
	let lifecycleImmediate;
	let lifecycleRunning = false;
	let lifecycleRerun = false;
	const outputStreams = [];
	const startupErrorAcknowledged = createDeferredCore();
	const cleanupFinished = createDeferredCore();
	cleanupFinished.promise.catch(() => {});
	const send = (payload) => {
		if (!start) return Promise.reject(/* @__PURE__ */ new Error("Windows Job anchor has not started"));
		sequence += 1;
		const message = {
			...payload,
			generation: start.generation,
			sequence
		};
		const delivery = outboundQueue.then(() => sendProcessMessage(message));
		outboundQueue = delivery.catch(() => {});
		return delivery;
	};
	const deliver = async (payload) => {
		if (!process.connected) {
			if (!closeReason) requestCleanup("parent-lost");
			return;
		}
		try {
			await send(payload);
		} catch (error) {
			if (process.connected) throw error;
			if (!closeReason) requestCleanup("parent-lost");
		}
	};
	const stopLifecycle = () => {
		clearTimeout(lifecycleTimer);
		clearImmediate(lifecycleImmediate);
		lifecycleTimer = void 0;
		lifecycleImmediate = void 0;
	};
	const finishAnchor = (exitCode) => {
		stopLifecycle();
		process.exitCode = exitCode;
		if (process.connected) process.disconnect?.();
	};
	const closeNativeHandles = () => {
		let closeError;
		for (const owner of [child, job]) try {
			owner?.close();
		} catch (error) {
			closeError ??= error instanceof Error ? error : new Error(coerceErrorMessage(error));
		}
		child = void 0;
		job = void 0;
		if (closeError) throw closeError;
	};
	const closeAuthority = async (reason) => {
		if (state === "closed") return;
		state = "closed";
		stopLifecycle();
		try {
			if (process.connected) await send({
				type: "closing",
				reason
			});
			closeNativeHandles();
			cleanupFinished.resolve();
			finishAnchor(0);
		} catch (error) {
			try {
				closeNativeHandles();
			} catch {}
			cleanupFinished.reject(error);
			finishAnchor(1);
		}
	};
	const failAuthority = async (error) => {
		if (state === "closed") return;
		state = "closed";
		stopLifecycle();
		try {
			if (process.connected && start) await send({
				type: "result-error",
				error: coerceErrorMessage(error)
			}).catch(() => {});
			closeNativeHandles();
		} catch {} finally {
			cleanupFinished.reject(error);
			finishAnchor(1);
		}
	};
	const finishOutput = async (stream) => {
		if (stream.ended) return;
		stream.ended = true;
		const tail = stream.decoder?.flush();
		if (tail) await deliver({
			type: "output",
			stream: stream.name,
			chunk: tail
		});
		await deliver({
			type: "output-end",
			stream: stream.name
		});
	};
	const observeOutput = async (stream) => {
		if (stream.ended) return false;
		if (!child || !stream.decoder) throw new Error(`${stream.name} output ownership was not initialized`);
		const bytes = stream.name === "stdout" ? child.readStdout(OUTPUT_BUFFER_BYTES) : child.readStderr(OUTPUT_BUFFER_BYTES);
		if (bytes === null) {
			await finishOutput(stream);
			return true;
		}
		if (bytes.length === 0) return false;
		const text = stream.decoder.decode(bytes);
		if (text) await deliver({
			type: "output",
			stream: stream.name,
			chunk: text
		});
		return true;
	};
	const observeRoot = async () => {
		if (rootObserved) return false;
		if (!child) throw new Error("Windows root process ownership was not initialized");
		const code = child.exitCode();
		if (code === null) return false;
		rootObserved = true;
		await deliver({
			type: "root-result",
			code,
			signal: null
		});
		return true;
	};
	const observeJob = () => {
		if (extinctionProven) return false;
		if (!job) throw new Error("Windows Job ownership was not initialized");
		extinctionProven = job.accounting().activeProcesses === 0;
		return extinctionProven;
	};
	const runLifecycle = async () => {
		if (lifecycleRunning || state === "closed" || !child) {
			lifecycleRerun ||= lifecycleRunning;
			return;
		}
		lifecycleRunning = true;
		let advanced = false;
		try {
			advanced = await observeRoot() || advanced;
			advanced = rootObserved && observeJob() || advanced;
			for (let round = 0; round < OUTPUT_ROUNDS_PER_TURN; round += 1) {
				let outputAdvanced = false;
				for (const stream of outputStreams) outputAdvanced = await observeOutput(stream) || outputAdvanced;
				advanced ||= outputAdvanced;
				if (!outputAdvanced) break;
			}
			if (extinctionProven && rootObserved && outputStreams.every((stream) => stream.ended)) {
				await closeAuthority(closeReason ?? "lineage-closed");
				return;
			}
		} catch (error) {
			await failAuthority(error);
			return;
		} finally {
			lifecycleRunning = false;
		}
		const immediate = advanced || lifecycleRerun;
		lifecycleRerun = false;
		scheduleLifecycle(immediate);
	};
	const scheduleLifecycle = (immediate) => {
		if (state === "closed" || !child) return;
		if (lifecycleRunning) {
			lifecycleRerun ||= immediate;
			return;
		}
		if (immediate && lifecycleTimer) {
			clearTimeout(lifecycleTimer);
			lifecycleTimer = void 0;
		}
		if (lifecycleTimer || lifecycleImmediate) return;
		if (immediate) {
			lifecycleImmediate = setImmediate(() => {
				lifecycleImmediate = void 0;
				runLifecycle();
			});
			return;
		}
		lifecycleTimer = setTimeout(() => {
			lifecycleTimer = void 0;
			runLifecycle();
		}, IDLE_OBSERVATION_MS);
		if (state === "active" && process.connected) lifecycleTimer.unref();
	};
	const requestCleanup = (reason) => {
		if (state === "closed") return cleanupFinished.promise;
		closeReason ??= reason;
		state = "closing";
		if (!child) {
			closeAuthority(reason);
			return cleanupFinished.promise;
		}
		if (!terminationRequested && !extinctionProven) {
			terminationRequested = true;
			try {
				if (!job) throw new Error("Windows Job cleanup authority was not initialized");
				job.terminate(1);
			} catch (error) {
				failAuthority(error);
				return cleanupFinished.promise;
			}
		}
		scheduleLifecycle(true);
		return cleanupFinished.promise;
	};
	const reportStartupError = async (error) => {
		if (!process.connected) return;
		await send({
			type: "startup-error",
			error: coerceErrorMessage(error)
		});
		await startupErrorAcknowledged.promise;
	};
	const startCommand = async (next) => {
		start = next;
		if (typeof next.windowsShellCommand !== "string") {
			state = "closed";
			finishAnchor(1);
			return;
		}
		try {
			job = WindowsJob.create();
			if (next.type === "prepare") {
				await send({ type: "prepared" });
				await Promise.race([launchGrant.promise, cleanupFinished.promise]);
				if (state !== "starting") return;
			}
			const shell = resolveEnvironmentValue(next.env, "COMSPEC", "win32") || getWindowsCmdExePath(next.env);
			child = job.spawn({
				executable: shell,
				commandLine: `"${shell}" /d /s /c "${next.windowsShellCommand}"`,
				cwd: next.cwd,
				env: next.env === void 0 ? void 0 : mergeProcessEnv([{ SystemRoot: resolveEnvironmentValue(process.env, "SystemRoot", "win32") }, next.env], "win32")
			});
			const commandPid = child.pid;
			outputStreams.push({
				name: "stdout",
				ended: false
			}, {
				name: "stderr",
				ended: false
			});
			for (const stream of outputStreams) stream.decoder = createWindowsOutputDecoder();
			state = "active";
			const readyDelivery = send({
				type: "ready",
				commandPid,
				anchorPid: process.pid
			});
			scheduleLifecycle(true);
			await readyDelivery;
		} catch (error) {
			if (state === "closed") return;
			if (state === "closing") {
				await cleanupFinished.promise.catch(() => {});
				return;
			}
			if (child && outputStreams.some((stream) => !stream.decoder)) for (const stream of outputStreams) stream.ended = true;
			await reportStartupError(error);
			await (child ? requestCleanup("lineage-lost") : closeAuthority("lineage-lost"));
		}
	};
	process.once("disconnect", () => {
		startupErrorAcknowledged.resolve();
		if (!start) {
			state = "closed";
			process.exitCode = 1;
			return;
		}
		requestCleanup("parent-lost");
	});
	process.once("SIGTERM", () => void requestCleanup("parent-lost"));
	process.once("SIGINT", () => void requestCleanup("parent-lost"));
	process.on("message", (message) => {
		if ((message.type === "start" || message.type === "prepare") && start === void 0 && state === "starting") {
			startCommand(message);
			return;
		}
		if (!start || state === "closed" || message.type !== "cancel" && message.type !== "startup-error-ack" && message.type !== "launch" || message.generation !== start.generation || message.sequence <= lastHostSequence) {
			if (start && state !== "closed") requestCleanup("lineage-lost");
			return;
		}
		lastHostSequence = message.sequence;
		if (message.type === "launch") launchGrant.resolve();
		else if (message.type === "startup-error-ack") startupErrorAcknowledged.resolve();
		else requestCleanup("cancel");
	});
}
runServiceChildWindowsJobAnchor();
//#endregion
export { runServiceChildWindowsJobAnchor };
