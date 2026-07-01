import { A as resolvePositiveTimerTimeoutMs, d as clampPositiveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { u as toErrorObject } from "./errors-DCRXIYSQ.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { n as shouldDetachChildForProcessTree, r as signalChildProcessTree, t as forceKillChildProcessTree } from "./child-process-tree-_PGDyBVB.js";
import path from "node:path";
import { spawn } from "node:child_process";
//#region src/agents/provider-local-service.ts
/**
* Manages optional local provider sidecar processes attached to models. Leases
* keep shared services alive while requests run and stop them after idle.
*/
const log = createSubsystemLogger("provider-local-service");
const DEFAULT_READY_TIMEOUT_MS = 12e4;
const DEFAULT_PROBE_TIMEOUT_MS = 2e3;
const PROBE_INTERVAL_MS = 250;
const MODEL_PROVIDER_LOCAL_SERVICE_SYMBOL = Symbol.for("openclaw.modelProviderLocalService");
const services = /* @__PURE__ */ new Map();
let exitHandlerInstalled = false;
/** Attach local-service startup metadata to a model without mutating the original object. */
function attachModelProviderLocalService(model, service) {
	if (!service) return model;
	const next = { ...model };
	next[MODEL_PROVIDER_LOCAL_SERVICE_SYMBOL] = service;
	return next;
}
/** Read local-service startup metadata attached to a model. */
function getModelProviderLocalService(model) {
	return model[MODEL_PROVIDER_LOCAL_SERVICE_SYMBOL];
}
/** Ensure a model's local provider service is healthy and return a lease. */
async function ensureModelProviderLocalService(model, probeHeaders, signal) {
	const service = getModelProviderLocalService(model);
	if (!service) return;
	throwIfAborted(signal);
	validateLocalServiceConfig(service, model.provider);
	const healthUrl = resolveHealthUrl(service, model.baseUrl);
	const healthHeaders = buildHealthProbeHeaders(model, probeHeaders);
	const key = localServiceKey(model.provider, service, healthUrl);
	installExitHandler();
	const managed = services.get(key) ?? { active: 0 };
	services.set(key, managed);
	clearIdleTimer(managed);
	managed.active += 1;
	let released = false;
	const release = () => {
		if (released) return;
		released = true;
		managed.active = Math.max(0, managed.active - 1);
		scheduleIdleStop(key, managed, service);
	};
	try {
		if (managed.process && !hasLocalServiceProcessExited(managed.process) && await probeHealth(healthUrl, healthHeaders, signal)) return { release };
		if (!managed.starting) {
			const startupAbort = new AbortController();
			managed.startupAbort = startupAbort;
			managed.starting = startAndWaitForLocalService({
				provider: model.provider,
				service,
				healthUrl,
				healthHeaders,
				managed,
				signal: startupAbort.signal
			}).finally(() => {
				managed.starting = void 0;
				if (managed.startupAbort === startupAbort) managed.startupAbort = void 0;
			});
		}
		await waitForAbort(managed.starting, signal);
		if (!managed.process || hasLocalServiceProcessExited(managed.process)) {
			release();
			return;
		}
		return { release };
	} catch (error) {
		const abortingStartup = isAbortForSignal(error, signal) && Boolean(managed.starting);
		release();
		if (isAbortForSignal(error, signal)) {
			if (abortingStartup && managed.active === 0) {
				managed.startupAbort?.abort(toAbortError(signal));
				stopManagedService(key, managed, "startup-aborted");
			}
		} else stopManagedService(key, managed, "startup-failed");
		throw error;
	}
}
function validateLocalServiceConfig(service, provider) {
	if (!path.isAbsolute(service.command)) throw new Error(`models.providers.${provider}.localService.command must be an absolute path`);
}
function resolveHealthUrl(service, baseUrl) {
	const configured = service.healthUrl?.trim();
	if (configured) return configured;
	return `${baseUrl.replace(/\/+$/, "")}/models`;
}
function localServiceKey(provider, service, healthUrl) {
	return JSON.stringify({
		provider,
		command: service.command,
		args: service.args ?? [],
		cwd: service.cwd ?? "",
		env: sortedStringRecord(service.env),
		healthUrl
	});
}
function sortedStringRecord(record) {
	if (!record) return {};
	return Object.fromEntries(Object.entries(record).toSorted(([left], [right]) => left.localeCompare(right)));
}
function buildHealthProbeHeaders(model, requestHeaders) {
	const headers = new Headers();
	const appendHeaders = (input) => {
		if (!input) return;
		for (const [key, value] of new Headers(input)) if (value.trim().length > 0 && value.trim().toLowerCase() !== "null") headers.set(key, value);
	};
	appendHeaders(model.headers);
	appendHeaders(requestHeaders);
	return [...headers].length > 0 ? headers : void 0;
}
async function probeHealth(url, headers, signal) {
	throwIfAborted(signal);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), DEFAULT_PROBE_TIMEOUT_MS);
	timeout.unref?.();
	const onAbort = () => controller.abort(toAbortError(signal));
	signal?.addEventListener("abort", onAbort, { once: true });
	let response;
	try {
		response = await fetch(url, {
			headers,
			signal: controller.signal
		});
		return response.ok;
	} catch {
		if (signal?.aborted) throw toAbortError(signal);
		return false;
	} finally {
		clearTimeout(timeout);
		signal?.removeEventListener("abort", onAbort);
		await response?.body?.cancel?.().catch(() => void 0);
	}
}
async function startAndWaitForLocalService(params) {
	const { provider, service, healthUrl, healthHeaders, managed, signal } = params;
	if (await probeHealth(healthUrl, healthHeaders, signal)) return;
	if (managed.process && !hasLocalServiceProcessExited(managed.process)) {
		log.info(`restarting unhealthy ${provider} local service`);
		await stopManagedProcessForRestart(managed, signal);
	}
	log.info(`starting ${provider} local service: ${service.command}`);
	managed.process = spawn(service.command, service.args ?? [], {
		cwd: service.cwd,
		env: service.env ? {
			...process.env,
			...service.env
		} : process.env,
		stdio: "ignore",
		detached: shouldDetachChildForProcessTree()
	});
	const child = managed.process;
	managed.lastExit = void 0;
	child.unref();
	child.once("exit", (code, signalLocal) => {
		log.info(`${provider} local service exited: ${signalLocal ? `signal=${signalLocal}` : `code=${code ?? 0}`}`);
		if (managed.process === child) {
			managed.lastExit = {
				code,
				signal: signalLocal
			};
			managed.process = void 0;
		}
	});
	const spawnError = await waitForSpawnResult(child, signal);
	if (spawnError) throw new Error(`${provider} local service failed to start: ${spawnError.message}`);
	const readyTimeoutMs = resolvePositiveTimerTimeoutMs(service.readyTimeoutMs, DEFAULT_READY_TIMEOUT_MS);
	const deadline = Date.now() + readyTimeoutMs;
	for (;;) {
		if (await probeHealth(healthUrl, healthHeaders, signal)) {
			log.info(`${provider} local service ready`);
			return;
		}
		if (managed.lastExit) throw new Error(`${provider} local service exited before readiness with ${formatLocalServiceExit(managed.lastExit)}`);
		if (Date.now() >= deadline) throw new Error(`${provider} local service did not become ready at ${healthUrl}`);
		await sleep(PROBE_INTERVAL_MS, signal);
	}
}
function scheduleIdleStop(key, managed, service) {
	const idleStopMs = clampPositiveTimerTimeoutMs(service.idleStopMs);
	if (managed.active > 0) return;
	if (!managed.process) {
		if (!managed.starting) services.delete(key);
		return;
	}
	if (idleStopMs === void 0) return;
	managed.idleTimer = setTimeout(() => {
		if (managed.active === 0) stopManagedService(key, managed, "idle");
	}, idleStopMs);
	managed.idleTimer.unref?.();
}
function clearIdleTimer(managed) {
	if (managed.idleTimer) {
		clearTimeout(managed.idleTimer);
		managed.idleTimer = void 0;
	}
}
function stopManagedService(key, managed, reason) {
	clearIdleTimer(managed);
	managed.startupAbort?.abort(/* @__PURE__ */ new Error(`local service stopped: ${reason}`));
	managed.startupAbort = void 0;
	const child = managed.process;
	managed.process = void 0;
	managed.lastExit = void 0;
	services.delete(key);
	if (child && !hasLocalServiceProcessExited(child)) {
		log.info(`stopping local model service: reason=${reason}`);
		signalChildProcessTree(child, "SIGTERM");
	}
}
async function stopManagedProcessForRestart(managed, signal) {
	const child = managed.process;
	managed.process = void 0;
	managed.lastExit = void 0;
	if (!child || hasLocalServiceProcessExited(child)) return;
	signalChildProcessTree(child, "SIGTERM");
	await waitForChildExit(child, signal, DEFAULT_PROBE_TIMEOUT_MS);
	if (!hasLocalServiceProcessExited(child)) {
		forceKillChildProcessTree(child);
		await waitForChildExit(child, signal, DEFAULT_PROBE_TIMEOUT_MS);
	}
}
function formatLocalServiceExit(exit) {
	return exit.signal ? `signal ${exit.signal}` : `code ${exit.code ?? 0}`;
}
function installExitHandler() {
	if (exitHandlerInstalled) return;
	exitHandlerInstalled = true;
	process.once("exit", () => {
		for (const [key, managed] of services) stopManagedService(key, managed, "process-exit");
	});
}
function toAbortError(signal) {
	if (signal?.reason instanceof Error) return signal.reason;
	const error = /* @__PURE__ */ new Error("The operation was aborted.");
	error.name = "AbortError";
	return error;
}
function throwIfAborted(signal) {
	if (signal?.aborted) throw toAbortError(signal);
}
function isAbortForSignal(error, signal) {
	return Boolean(signal?.aborted) && (error === signal?.reason || error instanceof Error && error.name === "AbortError");
}
function waitForAbort(promise, signal) {
	throwIfAborted(signal);
	if (!signal) return promise;
	return new Promise((resolve, reject) => {
		const onAbort = () => {
			cleanup();
			reject(toAbortError(signal));
		};
		const cleanup = () => signal.removeEventListener("abort", onAbort);
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then((value) => {
			cleanup();
			resolve(value);
		}, (error) => {
			cleanup();
			reject(toErrorObject(error, "Non-Error rejection"));
		});
	});
}
function sleep(ms, signal) {
	throwIfAborted(signal);
	return new Promise((resolve, reject) => {
		const cleanup = () => signal?.removeEventListener("abort", onAbort);
		const onDone = () => {
			cleanup();
			resolve();
		};
		const onAbort = () => {
			clearTimeout(timeout);
			cleanup();
			reject(toAbortError(signal));
		};
		const timeout = setTimeout(onDone, ms);
		timeout.unref?.();
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
function waitForSpawnResult(child, signal) {
	throwIfAborted(signal);
	return new Promise((resolve) => {
		let settled = false;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			child.off("error", onError);
			child.off("spawn", onSpawn);
			signal?.removeEventListener("abort", onAbort);
			resolve(error);
		};
		const onError = (error) => finish(error);
		const onSpawn = () => finish();
		const onAbort = () => finish(toAbortError(signal));
		child.once("error", onError);
		child.once("spawn", onSpawn);
		signal?.addEventListener("abort", onAbort, { once: true });
		setImmediate(() => {
			if (child.pid) finish();
		});
	});
}
function waitForChildExit(child, signal, timeoutMs) {
	if (hasLocalServiceProcessExited(child)) return Promise.resolve();
	throwIfAborted(signal);
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			clearTimeout(timeout);
			child.off("exit", onExit);
			signal.removeEventListener("abort", onAbort);
		};
		const finish = () => {
			cleanup();
			resolve();
		};
		const onExit = () => finish();
		const onAbort = () => {
			cleanup();
			reject(toAbortError(signal));
		};
		const timeout = setTimeout(finish, timeoutMs);
		timeout.unref?.();
		child.once("exit", onExit);
		signal.addEventListener("abort", onAbort, { once: true });
	});
}
/** Return whether a child process has already reported an exit code or signal. */
function hasLocalServiceProcessExited(child) {
	return child.exitCode !== null || child.signalCode !== null;
}
//#endregion
export { ensureModelProviderLocalService as n, getModelProviderLocalService as r, attachModelProviderLocalService as t };
