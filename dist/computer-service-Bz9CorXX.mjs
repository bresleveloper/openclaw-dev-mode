import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import { m as parseComputerUseCapabilityDescriptor } from "./computer-use-contract-DzawlQtp.mjs";
import { r as parseComputerHostOutput, t as ComputerHostFinalizationError } from "./computer-protocol-BHvtEXcO.mjs";
import { t as getProcessSupervisor } from "./supervisor-Dye57EtO.mjs";
import { t as createPendingRequestRegistry } from "./pending-request-registry-6Top3fRe.mjs";
import { t as resolveNodeRuntimeExecutable } from "./node-runtime-executable-wWK_i2EJ.mjs";
import { n as parseNodeWorkerComputerInput } from "./node-computer-protocol-DyPyYkCS.mjs";
import { t as computerRunOwner } from "./computer-owner-2cO1Fh1p.mjs";
import { randomUUID } from "node:crypto";
//#region src/gateway/desktop/computer-process.ts
const STARTUP_TIMEOUT_MS = 6e4;
const SHUTDOWN_TIMEOUT_MS = 3e4;
const MAX_MESSAGE_CHARS = 33554432;
/** The native driver inherits one desktop environment for its entire process lifetime. */
function startComputerHostProcess(params) {
	const supervisor = params.supervisor ?? getProcessSupervisor();
	const scopeKey = `gateway-computer:${randomUUID()}`;
	const cleanupScope = supervisor.acquireScopeCleanup(scopeKey, { processTree: "owned-only" });
	const ready = createDeferredCore();
	const pending = createPendingRequestRegistry();
	let run;
	let closing;
	let active = true;
	let buffer = "";
	let failure;
	const assertActive = () => {
		params.assertCurrent();
		if (!active) throw failure ?? /* @__PURE__ */ new Error("Gateway computer process is closed");
	};
	const send = (message) => {
		if (!run?.stdin || run.stdin.destroyed || run.stdin.writableEnded) throw new Error("Gateway computer process input is closed");
		run.stdin.write(`${JSON.stringify(message)}\n`, (error) => {
			if (error) fail(error);
		});
	};
	const close = (execution) => {
		if (closing) return closing;
		if (active && run?.activity.resultSettled) failure ??= /* @__PURE__ */ new Error("Gateway computer process exited");
		active = false;
		const closedError = failure ?? /* @__PURE__ */ new Error("Gateway computer process is closed");
		ready.reject(closedError);
		pending.rejectAll(closedError);
		closing = (async () => {
			await launch;
			let exit;
			let waitFailure;
			if (run) {
				if (!run.activity.resultSettled) try {
					send({
						type: "stop",
						...execution ? { execution } : {}
					});
				} catch {
					run.cancel("manual-cancel");
				}
				const timer = setTimeout(() => run?.cancel("manual-cancel"), SHUTDOWN_TIMEOUT_MS);
				timer.unref?.();
				try {
					exit = await run.wait();
				} catch (error) {
					waitFailure = error instanceof Error ? error : new Error(String(error));
				} finally {
					clearTimeout(timer);
				}
			}
			await cleanupScope();
			if (waitFailure) throw waitFailure;
			if (exit && (exit.exitCode !== 0 || exit.exitSignal !== null)) failure ??= /* @__PURE__ */ new Error(`Gateway computer helper shutdown failed (${exit.exitSignal ?? `exit ${exit.exitCode}`})`);
			if (failure) throw new ComputerHostFinalizationError(failure);
		})();
		closing.catch((error) => {
			if (!(error instanceof ComputerHostFinalizationError)) closing = void 0;
		});
		return closing;
	};
	const fail = (error) => {
		failure ??= error;
		active = false;
		ready.reject(error);
		pending.rejectAll(error);
		close().catch(() => {});
	};
	const receive = (chunk) => {
		buffer += chunk;
		if (buffer.length > MAX_MESSAGE_CHARS) {
			fail(/* @__PURE__ */ new Error("Gateway computer response exceeds the transport limit"));
			return;
		}
		let newline;
		while ((newline = buffer.indexOf("\n")) >= 0) {
			const line = buffer.slice(0, newline);
			buffer = buffer.slice(newline + 1);
			try {
				const message = parseComputerHostOutput(JSON.parse(line));
				if (message.type === "ready") ready.resolve(parseComputerUseCapabilityDescriptor(message.computerUse));
				else if (message.type === "result") {
					const payload = JSON.parse(message.payload);
					pending.take(message.id)?.resolve(payload);
				} else if (message.id) pending.take(message.id)?.reject(new Error(message.message));
				else fail(new Error(message.message));
			} catch {
				fail(/* @__PURE__ */ new Error("Invalid Gateway computer response"));
			}
		}
	};
	const startupTimer = setTimeout(() => fail(/* @__PURE__ */ new Error("Gateway computer provider startup timed out")), STARTUP_TIMEOUT_MS);
	startupTimer.unref?.();
	ready.promise.then(() => clearTimeout(startupTimer), () => clearTimeout(startupTimer));
	const launch = Promise.resolve().then(async () => {
		if (!active) return;
		try {
			const node = resolveNodeRuntimeExecutable({ env: params.env });
			if (!node) throw new Error("Gateway computer control requires Node.js in PATH");
			const worker = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.computerHost);
			assertActive();
			run = await supervisor.spawn({
				scopeKey,
				mode: "child",
				argv: [node, ...resolveRuntimeWorkerArgv(worker, node)],
				env: params.env,
				exactEnv: true,
				stdinMode: "pipe-open",
				captureOutput: false,
				onStdout: receive,
				assertCurrent: assertActive
			});
			run.wait().then(() => {
				if (!closing) fail(/* @__PURE__ */ new Error("Gateway computer process exited"));
			}, (error) => {
				if (!closing) fail(error instanceof Error ? error : new Error(String(error)));
			});
			assertActive();
			send({
				type: "start",
				pluginIds: params.pluginIds
			});
		} catch (error) {
			if (!closing) fail(error instanceof Error ? error : new Error(String(error)));
		}
	});
	return {
		ready: ready.promise,
		isCurrent: () => active,
		async invoke(request) {
			await ready.promise;
			assertActive();
			request.assertCurrent();
			request.signal?.throwIfAborted();
			const id = randomUUID();
			let timedOut = false;
			const cancel = () => {
				try {
					send({
						type: "cancel",
						id
					});
				} catch {}
			};
			const abort = () => {
				cancel();
				pending.take(id)?.reject(request.signal?.reason ?? /* @__PURE__ */ new Error("Computer invocation cancelled"));
			};
			const entry = pending.add(id, {
				value: void 0,
				timeoutMs: request.timeoutMs ?? 6e4,
				timeoutError: () => /* @__PURE__ */ new Error("Gateway computer invocation timed out"),
				onTimeout: () => {
					timedOut = true;
					cancel();
				},
				dispose: () => request.signal?.removeEventListener("abort", abort)
			});
			if (!entry) throw new Error("Gateway computer request already exists");
			request.signal?.addEventListener("abort", abort, { once: true });
			try {
				assertActive();
				request.assertCurrent();
				request.signal?.throwIfAborted();
				send({
					type: "invoke",
					id,
					command: request.command,
					paramsJSON: JSON.stringify(request.params),
					...request.sessionKey ? { sessionKey: request.sessionKey } : {}
				});
			} catch (error) {
				pending.take(id)?.reject(error);
			}
			try {
				return await entry.promise;
			} catch (error) {
				if (request.signal?.aborted || timedOut || !active) await close();
				throw error;
			}
		},
		close
	};
}
//#endregion
//#region src/gateway/desktop/computer-service.ts
const log = createSubsystemLogger("gateway/computer");
/** Owns the Gateway transport, while registered providers retain native action semantics. */
function createGatewayComputerService(options) {
	let current;
	let stopped = false;
	let paused = false;
	const configuredProvider = () => {
		const config = options.getConfig();
		const registry = options.getPluginRegistry();
		return registry.nodeHostCommands.find((entry) => {
			const plugin = registry.plugins.find((candidate) => candidate.id === entry.pluginId);
			return entry.command.command === "computer.act" && entry.command.computerUse !== void 0 && plugin?.enabled === true && plugin.status === "loaded" && config.plugins?.enabled !== false && config.plugins?.entries?.[entry.pluginId]?.enabled === true;
		});
	};
	const configuredDesktopTarget = () => {
		const desktop = options.getConfig().desktop?.host;
		return desktop?.enabled && desktop.managed && desktop.port === void 0 ? "managed" : "native";
	};
	const assertRuntime = (runtime) => {
		if (stopped || paused || runtime.closed || current !== runtime || configuredProvider()?.command !== runtime.provider.command || runtime.desktopTarget !== configuredDesktopTarget() || runtime.desktop?.isCurrent() === false || runtime.process?.isCurrent() === false) throw new Error("COMPUTER_DRIVER_UNAVAILABLE: Gateway computer generation is closed");
	};
	const retire = (runtime, execution) => {
		if (runtime.closing) return runtime.closing;
		runtime.closed = true;
		clearTimeout(runtime.idleTimer);
		runtime.closing = (async () => {
			let finalizationFailure;
			try {
				await runtime.process?.close(execution);
			} catch (error) {
				if (!(error instanceof ComputerHostFinalizationError)) throw error;
				finalizationFailure = error;
			}
			runtime.desktop?.release();
			runtime.execution?.releaseOwner();
			if (current === runtime) current = void 0;
			if (finalizationFailure) throw finalizationFailure;
		})();
		runtime.closing.catch(() => {
			runtime.closing = void 0;
		});
		return runtime.closing;
	};
	const retireForShutdown = async (runtime) => {
		try {
			await retire(runtime);
		} catch (error) {
			if (!(error instanceof ComputerHostFinalizationError)) throw error;
			log.warn(error.message);
		}
	};
	const retireInBackground = (runtime) => {
		retireForShutdown(runtime).catch(() => {
			log.warn("Computer cleanup failed; retaining its desktop owner for recovery");
		});
	};
	const scheduleIdle = (runtime) => {
		clearTimeout(runtime.idleTimer);
		if (runtime.closed || runtime.execution?.requests.size) return;
		runtime.idleTimer = setTimeout(() => retireInBackground(runtime), runtime.execution ? 3e5 : 6e4);
		runtime.idleTimer.unref?.();
	};
	const prepare = async () => {
		if (stopped) throw new Error("Gateway computer service is stopped");
		if (paused) throw new Error("Gateway computer provider is reloading");
		const provider = configuredProvider();
		if (current) {
			if (current.provider.command === provider?.command && current.desktopTarget === configuredDesktopTarget() && !current.closed && current.desktop?.isCurrent() !== false && current.process?.isCurrent() !== false) {
				const existing = current;
				await existing.prepared;
				assertRuntime(existing);
				return existing;
			}
			await retire(current);
			return await prepare();
		}
		if (!provider) return;
		const prepared = createDeferredCore();
		const runtime = {
			provider,
			desktopTarget: configuredDesktopTarget(),
			closed: false,
			prepared: prepared.promise
		};
		current = runtime;
		(async () => {
			let env = process.env;
			if (runtime.desktopTarget === "managed") {
				if (!options.hostDesktopService) throw new Error("Managed Gateway desktop is unavailable");
				runtime.desktop = await options.hostDesktopService.acquireComputer({ onStop: () => retireForShutdown(runtime) });
				env = runtime.desktop.env;
			}
			assertRuntime(runtime);
			runtime.process = startComputerHostProcess({
				env,
				pluginIds: [provider.pluginId],
				assertCurrent: () => assertRuntime(runtime)
			});
			const computerUse = await runtime.process.ready;
			assertRuntime(runtime);
			return computerUse;
		})().then(prepared.resolve, prepared.reject);
		try {
			await runtime.prepared;
			scheduleIdle(runtime);
			return runtime;
		} catch (error) {
			await retire(runtime);
			runtime.desktop?.release();
			throw error;
		}
	};
	return {
		async reconcileRuntimePolicy() {
			const runtime = current;
			if (runtime && runtime.desktopTarget !== configuredDesktopTarget()) await retireForShutdown(runtime);
		},
		preparePluginReload({ changedPluginIds }) {
			const provider = current?.provider ?? configuredProvider();
			const affected = provider !== void 0 && changedPluginIds.has(provider.pluginId);
			if (affected) paused = true;
			return {
				drain: async () => {
					if (affected && current) await retireForShutdown(current);
				},
				resume: () => {
					if (affected) paused = false;
				}
			};
		},
		async status() {
			const configured = configuredProvider() !== void 0;
			try {
				const runtime = await prepare();
				return runtime?.process ? {
					configured: true,
					available: true,
					computerUse: await runtime.prepared
				} : {
					configured: false,
					available: false
				};
			} catch (error) {
				return {
					configured,
					available: false,
					error: error instanceof Error ? error.message : String(error)
				};
			}
		},
		async invoke(request) {
			const isClose = request.command === "computer.act" && request.params.action === "__close_execution";
			const input = parseNodeWorkerComputerInput(JSON.stringify(isClose ? {
				operation: "close",
				executionId: request.params.executionId,
				reason: request.params.reason ?? "completion"
			} : {
				operation: request.command === "screen.snapshot" ? "snapshot" : "act",
				providerGeneration: request.generation,
				params: request.params
			}));
			if (input.operation === "capabilities") throw new Error("Invalid computer invocation");
			const runtime = current;
			if (!runtime) {
				if (isClose) return { ok: true };
				throw new Error("COMPUTER_STALE_OBSERVATION: refresh the Gateway computer before acting");
			}
			const computerUse = await runtime.prepared;
			const child = runtime.process;
			if (!child) throw new Error("COMPUTER_STALE_OBSERVATION: Gateway computer is unavailable");
			if (request.generation !== computerUse.provider.generation) {
				if (isClose) return { ok: true };
				throw new Error("COMPUTER_STALE_OBSERVATION: Gateway computer generation changed");
			}
			const logicalId = input.operation === "close" ? input.executionId : input.params.executionId;
			const existing = runtime.execution;
			if (existing && (existing.owner !== request.owner || existing.logicalId !== logicalId)) throw new Error("COMPUTER_HOST_BUSY: another execution owns the Gateway computer");
			if (input.operation === "close") {
				if (!existing) return { ok: true };
				await retire(runtime, {
					executionId: existing.physicalId,
					reason: input.reason
				});
				return { ok: true };
			}
			if (runtime.closed || runtime.desktopTarget !== configuredDesktopTarget() || !child.isCurrent() || runtime.desktop?.isCurrent() === false) throw new Error("COMPUTER_STALE_OBSERVATION: refresh the Gateway computer before acting");
			assertRuntime(runtime);
			request.assertCurrent();
			request.signal?.throwIfAborted();
			request.ownerSignal?.throwIfAborted();
			const onOwnerClosed = () => retireInBackground(runtime);
			const execution = runtime.execution ??= {
				owner: request.owner,
				logicalId,
				physicalId: randomUUID(),
				requests: /* @__PURE__ */ new Map(),
				settled: /* @__PURE__ */ new Set(),
				releaseOwner: () => request.ownerSignal?.removeEventListener("abort", onOwnerClosed)
			};
			if (!existing) request.ownerSignal?.addEventListener("abort", onOwnerClosed, { once: true });
			const signature = JSON.stringify({
				command: request.command,
				params: request.params
			});
			const pending = execution.requests.get(request.idempotencyKey);
			if (pending) {
				if (pending.input !== signature) throw new Error("Computer idempotency key was reused with different input");
				return await pending.result;
			}
			if (execution.settled.has(request.idempotencyKey)) throw new Error("Computer request already settled; observe before issuing a new action");
			clearTimeout(runtime.idleTimer);
			const result = child.invoke({
				command: request.command,
				params: {
					...input.params,
					executionId: execution.physicalId
				},
				signal: request.signal,
				timeoutMs: request.timeoutMs,
				assertCurrent: () => {
					assertRuntime(runtime);
					request.assertCurrent();
				}
			});
			execution.requests.set(request.idempotencyKey, {
				input: signature,
				result
			});
			try {
				return await result;
			} finally {
				execution.requests.delete(request.idempotencyKey);
				execution.settled.add(request.idempotencyKey);
				scheduleIdle(runtime);
			}
		},
		async close() {
			stopped = true;
			if (current) await retireForShutdown(current);
		},
		revokeRunAuthority(authority) {
			const runtime = current;
			if (runtime?.execution?.owner === computerRunOwner(authority)) retireInBackground(runtime);
		}
	};
}
//#endregion
export { createGatewayComputerService };
