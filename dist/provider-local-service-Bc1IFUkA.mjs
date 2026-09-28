import { P as resolvePositiveTimerTimeoutMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { _ as redactSensitiveText, a as isSensitiveFieldKey } from "./redact-B5EGyLvV.mjs";
import "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as signalChildProcessTree, n as isChildProcessTreeAlive, r as shouldDetachChildForProcessTree } from "./child-process-tree-Cmpyfjdc.mjs";
import { f as isLoopbackIpAddress, i as isCanonicalDottedDecimalIPv4 } from "./ip-CDH5BTTD.mjs";
import { n as prepareOomScoreAdjustedSpawnPreservingExecEnv } from "./linux-oom-score-YCP0ajt5.mjs";
import { n as getModelProviderLocalServiceReconciler } from "./provider-local-service-reconcile-BYimpgvx.mjs";
import { n as unwrapHeadersInitSentinelsForProviderEgress } from "./provider-secret-egress-BkXZF4dA.mjs";
import { r as setManagedProviderLocalServicesActive } from "./provider-runtime-lifecycle-Cn0O7tiR.mjs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
//#region src/agents/provider-local-service-diagnostics.ts
const LOCAL_SERVICE_OUTPUT_TAIL_MAX_BYTES = 8192;
function appendLocalServiceOutputTail(current, chunk, serviceEnv, inheritedEnv, serviceArgs, healthHeaders) {
	let redacted = redactSensitiveText(`${current}${chunk.toString()}`, { mode: "tools" });
	for (const value of Object.values(serviceEnv ?? {})) if (value) redacted = redacted.replaceAll(value, "[redacted]");
	for (const [key, value] of Object.entries(inheritedEnv)) if (value && isSensitiveFieldKey(key)) redacted = redacted.replaceAll(value, "[redacted]");
	for (const value of serviceArgs ?? []) if (value) redacted = redacted.replaceAll(value, "[redacted]");
	for (const [, value] of new Headers(healthHeaders)) if (value) redacted = redacted.replaceAll(value, "[redacted]");
	const bytes = Buffer.from(redacted);
	if (bytes.byteLength <= LOCAL_SERVICE_OUTPUT_TAIL_MAX_BYTES) return redacted;
	let start = bytes.byteLength - LOCAL_SERVICE_OUTPUT_TAIL_MAX_BYTES;
	while (start < bytes.byteLength) {
		const byte = bytes.at(start);
		if (byte === void 0 || (byte & 192) !== 128) break;
		start += 1;
	}
	return bytes.subarray(start).toString("utf8");
}
function formatLocalServiceDiagnosticTail(diagnostics) {
	return diagnostics.stderrTail ? `; stderr: ${diagnostics.stderrTail}` : "";
}
function formatLocalServiceExit(exit) {
	return exit.signal ? `signal ${exit.signal}` : `code ${exit.code ?? 0}`;
}
//#endregion
//#region src/agents/provider-local-service-process.ts
const DEFAULT_PROBE_TIMEOUT_MS$1 = 2e3;
const PROCESS_TREE_EXIT_POLL_MS = 25;
function trackLocalServiceProcess(child) {
	const owned = {
		child,
		closed: false,
		pendingSignals: /* @__PURE__ */ new Set()
	};
	child.once("close", () => {
		owned.closed = true;
	});
	return owned;
}
function unrefLocalServiceOutput(stream) {
	stream?.unref?.();
}
function drainLocalServiceOutput(child) {
	child.stdout?.removeAllListeners("data");
	child.stderr?.removeAllListeners("data");
	child.stdout?.resume();
	child.stderr?.resume();
	unrefLocalServiceOutput(child.stdout);
	unrefLocalServiceOutput(child.stderr);
}
function isLocalServiceProcessTreeAlive(owned) {
	const windows = process.platform === "win32";
	if (windows && (owned.windowsRootGone || hasLocalServiceProcessExited(owned.child))) {
		owned.windowsRootGone = true;
		return false;
	}
	const alive = isChildProcessTreeAlive(owned.child);
	if (windows && !alive) owned.windowsRootGone = true;
	return alive;
}
function isLocalServiceProcessSettled(owned) {
	return owned.closed && owned.pendingSignals.size === 0 && !isLocalServiceProcessTreeAlive(owned);
}
function signalLocalServiceProcess(owned, signal) {
	if (owned.pendingSignals.has(signal) || !isLocalServiceProcessTreeAlive(owned)) return;
	owned.pendingSignals.add(signal);
	try {
		signalChildProcessTree(owned.child, signal, () => owned.pendingSignals.delete(signal));
	} catch (error) {
		owned.pendingSignals.delete(signal);
		throw error;
	}
}
function forceStopLocalServiceProcess(owned) {
	if (!isLocalServiceProcessTreeAlive(owned)) return;
	drainLocalServiceOutput(owned.child);
	signalLocalServiceProcess(owned, "SIGKILL");
}
async function stopLocalServiceProcess(owned) {
	if (isLocalServiceProcessSettled(owned)) return;
	drainLocalServiceOutput(owned.child);
	const gracefulDeadline = Date.now() + DEFAULT_PROBE_TIMEOUT_MS$1;
	if (owned.pendingSignals.size === 0) signalLocalServiceProcess(owned, "SIGTERM");
	await waitForChildProcessTreeExit(owned, gracefulDeadline);
	if (!isLocalServiceProcessSettled(owned)) {
		const forceDeadline = Date.now() + DEFAULT_PROBE_TIMEOUT_MS$1;
		signalLocalServiceProcess(owned, "SIGKILL");
		await waitForChildProcessTreeExit(owned, forceDeadline);
	}
	if (!isLocalServiceProcessSettled(owned)) throw new Error(`Local model service process tree ${owned.child.pid} did not stop`);
}
async function waitForChildProcessTreeExit(owned, deadline) {
	while (!isLocalServiceProcessSettled(owned)) {
		const remainingMs = deadline - Date.now();
		if (remainingMs <= 0) return;
		await sleepWithAbort(Math.min(PROCESS_TREE_EXIT_POLL_MS, remainingMs));
	}
}
/** Return whether a child process has already reported an exit code or signal. */
function hasLocalServiceProcessExited(child) {
	return child.exitCode !== null || child.signalCode !== null;
}
//#endregion
//#region src/agents/provider-local-service-target.ts
function resolveConfiguredProviderLocalServiceTarget(config, target) {
	const provider = config.models?.providers?.[target.providerId];
	if (!provider?.localService) return;
	if (!isConfiguredProviderBaseUrl(target.baseUrl, readConfiguredProviderBaseUrl(provider))) throw new Error(`Local endpoint must match models.providers.${target.providerId}.baseUrl`);
	return {
		...target,
		service: provider.localService
	};
}
function readConfiguredProviderBaseUrl(provider) {
	const baseUrl = provider?.baseUrl?.trim();
	const baseURL = typeof provider?.baseURL === "string" ? provider.baseURL.trim() : "";
	return baseUrl || baseURL || void 0;
}
function normalizeProviderBaseUrl(value) {
	const trimmed = value.trim();
	const candidate = /^[a-z][a-z\d+.-]*:\/\//iu.test(trimmed) ? trimmed : `http://${trimmed}`;
	try {
		const url = new URL(candidate);
		if (url.protocol !== "http:" && url.protocol !== "https:") return;
		url.search = "";
		url.hash = "";
		url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
		return url.toString().replace(/\/$/u, "");
	} catch {
		return;
	}
}
function configuredProviderBaseUrlVariants(value) {
	const normalized = normalizeProviderBaseUrl(value);
	const root = normalized?.replace(/\/v1$/iu, "");
	return normalized && root ? /* @__PURE__ */ new Set([
		normalized,
		root,
		`${root}/v1`
	]) : /* @__PURE__ */ new Set();
}
function isLoopbackProviderBaseUrl(value) {
	const normalized = normalizeProviderBaseUrl(value);
	if (!normalized) return false;
	const hostname = new URL(normalized).hostname.toLowerCase();
	if (hostname === "localhost" || hostname === "[::1]") return true;
	return isCanonicalDottedDecimalIPv4(hostname) && isLoopbackIpAddress(hostname);
}
function isConfiguredProviderBaseUrl(targetBaseUrl, configuredBaseUrl) {
	const target = normalizeProviderBaseUrl(targetBaseUrl);
	if (!target) return false;
	const configured = configuredBaseUrl?.trim();
	if (!configured) return isLoopbackProviderBaseUrl(target);
	return configuredProviderBaseUrlVariants(configured).has(target);
}
//#endregion
//#region src/agents/provider-local-service.ts
/** Manages optional local provider processes; request leases keep shared services alive. */
const log = createSubsystemLogger("provider-local-service");
const DEFAULT_READY_TIMEOUT_MS = 12e4;
const DEFAULT_PROBE_TIMEOUT_MS = 2e3;
const PROBE_INTERVAL_MS = 250;
const MODEL_PROVIDER_LOCAL_SERVICE_SYMBOL = Symbol.for("openclaw.modelProviderLocalService");
const services = /* @__PURE__ */ new Map();
let exitHandlerInstalled = false;
/** Bind local-service acquisition to a host-owned config snapshot. */
function createConfiguredProviderLocalServiceAcquirer(getConfig) {
	return async (target, signal) => {
		const resolved = resolveConfiguredProviderLocalServiceTarget(getConfig(), target);
		return resolved ? await ensureProviderLocalService(resolved, signal) : void 0;
	};
}
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
	return await ensureProviderLocalService({
		providerId: model.provider,
		baseUrl: model.baseUrl,
		headers: buildHealthProbeHeaders(model.headers, probeHeaders),
		service,
		reconcile: getModelProviderLocalServiceReconciler(model)
	}, signal);
}
/** Ensure a provider endpoint's local service is healthy and return a request lease. */
async function ensureProviderLocalService(target, signal) {
	const lease = await acquireProviderLocalService(target, signal);
	if (!lease || !target.reconcile) return lease;
	try {
		await target.reconcile({
			baseUrl: target.baseUrl,
			signal: signal ?? void 0
		});
		throwIfAborted(signal);
	} catch (error) {
		lease.release();
		throw error;
	}
	return lease;
}
async function acquireProviderLocalService(target, signal) {
	const service = target.service;
	if (!service) return;
	throwIfAborted(signal);
	validateLocalServiceConfig(service, target.providerId);
	const healthUrl = resolveHealthUrl(service, target.baseUrl);
	const healthHeaders = buildHealthProbeHeaders(target.headers, void 0);
	const key = localServiceKey(target.providerId, service, healthUrl);
	installExitHandler();
	let current = services.get(key);
	while (current?.stopping) {
		await waitForAbort(stopManagedService(key, current, "reacquire"), signal);
		throwIfAborted(signal);
		current = services.get(key);
	}
	const managed = current ?? { active: 0 };
	services.set(key, managed);
	setManagedProviderLocalServicesActive(true);
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
		target.onReadinessWait?.(true);
		try {
			const currentProcess = managed.process;
			const healthy = currentProcess && !managed.processStop && !hasLocalServiceProcessExited(currentProcess.child) ? await probeHealth(healthUrl, healthHeaders, signal) : false;
			assertCurrentServiceAcquisition(key, managed, signal);
			if (healthy && currentProcess && managed.process === currentProcess && !managed.processStop && !hasLocalServiceProcessExited(currentProcess.child)) return { release };
			if (!managed.starting) {
				const startupAbort = new AbortController();
				managed.startupAbort = startupAbort;
				managed.starting = startAndWaitForLocalService({
					key,
					provider: target.providerId,
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
			assertCurrentServiceAcquisition(key, managed, signal);
			const ready = !managed.processStop && (managed.process && !hasLocalServiceProcessExited(managed.process.child) || await probeHealth(healthUrl, healthHeaders, signal));
			assertCurrentServiceAcquisition(key, managed, signal);
			if (ready && !managed.processStop) return { release };
			release();
			return;
		} finally {
			target.onReadinessWait?.(false);
		}
	} catch (error) {
		const abortingStartup = isAbortForSignal(error, signal) && Boolean(managed.starting);
		release();
		if (isAbortForSignal(error, signal)) {
			if (abortingStartup && managed.active === 0) {
				managed.startupAbort?.abort(toAbortError(signal));
				await stopManagedService(key, managed, "startup-aborted");
			}
		} else await stopManagedService(key, managed, "startup-failed");
		throw error;
	}
}
function assertCurrentServiceAcquisition(key, managed, signal) {
	throwIfAborted(signal);
	if (managed.stopping || services.get(key) !== managed) throw new Error("Local model service stopped during acquisition");
}
/** Stop all managed local services owned by this process. */
async function stopManagedProviderLocalServices() {
	await Promise.all([...services].map(([key, managed]) => stopManagedService(key, managed, "host-shutdown")));
}
/** Return bounded local-service state for focused lifecycle tests. */
function getManagedProviderLocalServiceDiagnosticsForTest() {
	return structuredClone([...services.values()].map((managed) => managed.diagnostics).filter((value) => value !== void 0));
}
function validateLocalServiceConfig(service, provider) {
	if (!path.isAbsolute(service.command)) throw new Error(`models.providers.${provider}.localService.command must be an absolute path`);
}
function resolveHealthUrl(service, baseUrl) {
	return service.healthUrl?.trim() || `${baseUrl.replace(/\/+$/, "")}/models`;
}
function localServiceKey(provider, service, healthUrl) {
	return JSON.stringify({
		provider,
		command: service.command,
		args: service.args ?? [],
		cwd: service.cwd ?? "",
		envHash: hashStringRecord(service.env),
		healthUrl
	});
}
function hashStringRecord(record) {
	const sorted = Object.entries(record ?? {}).toSorted(([left], [right]) => left.localeCompare(right));
	return createHash("sha256").update(JSON.stringify(sorted)).digest("hex");
}
function buildHealthProbeHeaders(providerHeaders, requestHeaders) {
	const headers = new Headers();
	const appendHeaders = (input) => {
		if (!input) return;
		for (const [key, value] of new Headers(input)) if (value.trim().length > 0 && value.trim().toLowerCase() !== "null") headers.set(key, value);
	};
	appendHeaders(providerHeaders);
	appendHeaders(requestHeaders);
	return [...headers].length > 0 ? headers : void 0;
}
async function probeHealth(url, headers, signal) {
	throwIfAborted(signal);
	const egressHeaders = unwrapHeadersInitSentinelsForProviderEgress(headers, "to probe local model provider health");
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), DEFAULT_PROBE_TIMEOUT_MS);
	timeout.unref?.();
	const onAbort = () => controller.abort(toAbortError(signal));
	signal?.addEventListener("abort", onAbort, { once: true });
	let response;
	try {
		response = await fetch(url, {
			headers: egressHeaders,
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
	const { key, provider, service, healthUrl, healthHeaders, managed, signal } = params;
	const healthy = await probeHealth(healthUrl, healthHeaders, signal);
	assertCurrentServiceAcquisition(key, managed, signal);
	if (healthy) return;
	if (managed.process) {
		log.info(`restarting unhealthy ${provider} local service`);
		await stopManagedProcess(managed, signal);
	}
	const startedAt = Date.now();
	const diagnostics = {
		providerId: provider,
		healthUrl,
		startedAt,
		stdoutTail: "",
		stderrTail: ""
	};
	managed.diagnostics = diagnostics;
	assertCurrentServiceAcquisition(key, managed, signal);
	log.info(`starting ${provider} local service: ${service.command}`);
	const serviceEnv = service.env ? mergeProcessEnv([process.env, service.env]) : process.env;
	const preparedSpawn = prepareOomScoreAdjustedSpawnPreservingExecEnv(service.command, service.args ?? [], { env: serviceEnv });
	const child = spawn(preparedSpawn.command, preparedSpawn.args, {
		cwd: service.cwd,
		env: preparedSpawn.env,
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		detached: shouldDetachChildForProcessTree()
	});
	const owned = trackLocalServiceProcess(child);
	managed.process = owned;
	diagnostics.pid = child.pid;
	managed.lastExit = void 0;
	child.stdout?.setEncoding("utf8");
	child.stderr?.setEncoding("utf8");
	const captureStdout = (chunk) => {
		diagnostics.stdoutTail = appendLocalServiceOutputTail(diagnostics.stdoutTail, chunk, service.env, process.env, service.args, healthHeaders);
	};
	const captureStderr = (chunk) => {
		diagnostics.stderrTail = appendLocalServiceOutputTail(diagnostics.stderrTail, chunk, service.env, process.env, service.args, healthHeaders);
	};
	child.stdout?.on("data", captureStdout);
	child.stderr?.on("data", captureStderr);
	child.unref();
	child.once("exit", (code, signalLocal) => {
		const exit = {
			code,
			signal: signalLocal
		};
		diagnostics.lastExit = exit;
		log.info(`${provider} local service exited: ${signalLocal ? `signal=${signalLocal}` : `code=${code ?? 0}`}`);
		if (managed.process === owned) managed.lastExit = exit;
	});
	const spawnError = await waitForSpawnResult(child, signal);
	if (spawnError) throw new Error(`${provider} local service failed to start: ${spawnError.message}${formatLocalServiceDiagnosticTail(diagnostics)}`);
	diagnostics.spawnedAt = Date.now();
	const readyTimeoutMs = resolvePositiveTimerTimeoutMs(service.readyTimeoutMs, DEFAULT_READY_TIMEOUT_MS);
	const deadline = Date.now() + readyTimeoutMs;
	for (;;) {
		if (await probeHealth(healthUrl, healthHeaders, signal)) {
			diagnostics.readyAt = Date.now();
			diagnostics.lastHealthyAt = diagnostics.readyAt;
			diagnostics.stdoutTail = "";
			diagnostics.stderrTail = "";
			drainLocalServiceOutput(child);
			log.info(`${provider} local service ready: pid=${diagnostics.pid ?? "unknown"} spawnMs=${diagnostics.spawnedAt - startedAt} readyMs=${diagnostics.readyAt - startedAt}`);
			return;
		}
		if (managed.lastExit) throw new Error(`${provider} local service exited before readiness with ${formatLocalServiceExit(managed.lastExit)}${formatLocalServiceDiagnosticTail(diagnostics)}`);
		if (Date.now() >= deadline) throw new Error(`${provider} local service did not become ready at ${healthUrl}`);
		await sleepWithAbort(PROBE_INTERVAL_MS, signal, { ref: false });
	}
}
function scheduleIdleStop(key, managed, service) {
	if (managed.stopping || services.get(key) !== managed) return;
	const idleStopMs = clampPositiveTimerTimeoutMs(service.idleStopMs);
	if (managed.active > 0) return;
	if (!managed.process) {
		if (!managed.starting) {
			services.delete(key);
			setManagedProviderLocalServicesActive(services.size > 0);
		}
		return;
	}
	if (idleStopMs === void 0) return;
	managed.idleTimer = setTimeout(() => {
		if (managed.active === 0) stopManagedService(key, managed, "idle").catch((error) => {
			log.warn("idle local model service shutdown failed", { error: toErrorObject(error, "Local model service shutdown failed").message });
		});
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
	const stopping = managed.stopping ??= {};
	if (stopping.promise) return stopping.promise;
	clearIdleTimer(managed);
	const starting = managed.starting;
	const startupAbort = managed.startupAbort;
	managed.startupAbort = void 0;
	const pending = Promise.resolve().then(async () => {
		startupAbort?.abort(/* @__PURE__ */ new Error(`local service stopped: ${reason}`));
		if (managed.process && !hasLocalServiceProcessExited(managed.process.child)) log.info(`stopping local model service: reason=${reason}`);
		await starting?.catch(() => {});
		await stopManagedProcess(managed, new AbortController().signal);
		if (services.get(key) === managed) services.delete(key);
		setManagedProviderLocalServicesActive(services.size > 0);
	}).catch((error) => {
		stopping.promise = void 0;
		throw error;
	});
	stopping.promise = pending;
	return pending;
}
async function stopManagedProcess(managed, signal) {
	throwIfAborted(signal);
	if (!managed.processStop) {
		const owned = managed.process;
		managed.lastExit = void 0;
		if (!owned) return;
		managed.processStop = { process: owned };
	}
	const stopping = managed.processStop;
	let pending = stopping.promise;
	if (!pending) {
		pending = Promise.resolve().then(() => stopLocalServiceProcess(stopping.process)).then(() => {
			if (managed.process === stopping.process) managed.process = void 0;
			if (managed.processStop === stopping) managed.processStop = void 0;
		}).catch((error) => {
			stopping.promise = void 0;
			throw error;
		});
		stopping.promise = pending;
	}
	await waitForAbort(pending, signal);
}
function forceStopManagedService(key, managed) {
	clearIdleTimer(managed);
	const owned = managed.processStop?.process ?? managed.process;
	managed.process = void 0;
	if (services.get(key) === managed) services.delete(key);
	if (owned) forceStopLocalServiceProcess(owned);
}
function installExitHandler() {
	if (exitHandlerInstalled) return;
	exitHandlerInstalled = true;
	process.once("exit", () => {
		for (const [key, managed] of services) forceStopManagedService(key, managed);
		setManagedProviderLocalServicesActive(false);
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
//#endregion
export { getManagedProviderLocalServiceDiagnosticsForTest as a, ensureProviderLocalService as i, createConfiguredProviderLocalServiceAcquirer as n, getModelProviderLocalService as o, ensureModelProviderLocalService as r, stopManagedProviderLocalServices as s, attachModelProviderLocalService as t };
