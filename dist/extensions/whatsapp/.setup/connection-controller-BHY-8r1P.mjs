import { r as getWhatsAppChannelRuntime } from "./runtime-BLlToOi6.mjs";
import { n as WHATSAPP_CONNECTION_OWNER_PENDING_CAPABILITY, t as WHATSAPP_CONNECTION_CONTROLLER_CAPABILITY } from "./connection-controller-runtime-context-hgLJoRc8.mjs";
import { M as waitForCredsSaveQueueWithTimeout, c as logoutWeb, f as readWebAuthExistsForDecision, k as resolveComparableIdentity, r as WhatsAppAuthUnstableError } from "./auth-store-Dh8a3cba.mjs";
import { a as waitForWaConnection, m as acquireWhatsAppGatewayConnectionOwner, o as DEFAULT_WHATSAPP_SOCKET_TIMING, r as createWaSocket, t as closeWhatsAppSocketAndWait } from "./socket-close-YDZcXb67.mjs";
import { n as getStatusCode, t as formatError } from "./session-errors-JuazczrA.mjs";
import { computeBackoff, info, sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { registerChannelRuntimeContext } from "openclaw/plugin-sdk/channel-runtime-context";
import { clamp } from "openclaw/plugin-sdk/text-utility-runtime";
import { randomUUID } from "node:crypto";
//#region extensions/whatsapp/src/reconnect.ts
const DEFAULT_HEARTBEAT_SECONDS = 60;
const DEFAULT_RECONNECT_POLICY = {
	initialMs: 2e3,
	maxMs: 3e4,
	factor: 1.8,
	jitter: .25,
	maxAttempts: 12
};
function resolveHeartbeatSeconds(cfg, overrideSeconds) {
	const candidate = overrideSeconds;
	if (typeof candidate === "number" && candidate > 0) return candidate;
	return DEFAULT_HEARTBEAT_SECONDS;
}
function resolveReconnectPolicy(cfg, overrides) {
	const overrideConfig = overrides ?? {};
	const merged = {
		...DEFAULT_RECONNECT_POLICY,
		...overrideConfig
	};
	merged.initialMs = Math.max(250, merged.initialMs);
	merged.maxMs = Math.max(merged.initialMs, merged.maxMs);
	merged.factor = clamp(merged.factor, 1.1, 10);
	merged.jitter = clamp(merged.jitter, 0, 1);
	merged.maxAttempts = Math.max(0, Math.floor(merged.maxAttempts));
	return merged;
}
function newConnectionId() {
	return randomUUID();
}
//#endregion
//#region extensions/whatsapp/src/connection-controller.ts
const LOGGED_OUT_STATUS = 401;
const POST_PAIRING_RESTART_STATUS = 515;
const TIMED_OUT_STATUS = 408;
const WHATSAPP_LOGIN_RESTART_MESSAGE = "WhatsApp asked for a restart after pairing (code 515); waiting for creds to save…";
const WHATSAPP_LOGIN_TIMEOUT_RESTART_MESSAGE = "WhatsApp connection timed out before login; retrying with a fresh socket…";
const WHATSAPP_LOGGED_OUT_RELINK_MESSAGE = "WhatsApp reported the session is logged out. Cleared cached web session; please rerun openclaw channels login and scan the QR again.";
const WHATSAPP_LOGIN_AUTH_UNSTABLE_MESSAGE = "WhatsApp connected, but saving the linked credentials has not settled on disk yet. Retry login in a moment.";
const WHATSAPP_LOGIN_AUTH_NOT_PERSISTED_MESSAGE = "WhatsApp connected, but the linked credentials were not found on disk. Retry login in a moment.";
const WHATSAPP_LOGIN_AUTH_NOT_CLEARED_MESSAGE = "existing auth could not be cleared. Remove or fix the configured WhatsApp auth directory, then retry login.";
const WHATSAPP_LOGGED_OUT_QR_MESSAGE = "WhatsApp reported the session is logged out. Cleared cached web session; please scan a new QR.";
const WHATSAPP_WATCHDOG_TIMEOUT_ERROR = "watchdog-timeout";
function createNeverResolvePromise() {
	return new Promise(() => {});
}
function getLoginSocketRestartKind(statusCode) {
	if (statusCode === POST_PAIRING_RESTART_STATUS) return "post-pairing";
	if (statusCode === TIMED_OUT_STATUS) return "timeout";
	return null;
}
function getLoginSocketRestartMessage(kind) {
	return kind === "timeout" ? WHATSAPP_LOGIN_TIMEOUT_RESTART_MESSAGE : WHATSAPP_LOGIN_RESTART_MESSAGE;
}
function createLiveConnection(params) {
	let closeResolved = false;
	let resolveClosePromise = (_reason) => {};
	const closePromise = new Promise((resolve) => {
		resolveClosePromise = (reason) => {
			if (closeResolved) return;
			closeResolved = true;
			resolve(reason);
		};
	});
	return {
		connectionId: params.connectionId,
		startedAt: Date.now(),
		sock: params.sock,
		listener: params.listener,
		heartbeat: null,
		watchdogTimer: null,
		lastInboundAt: null,
		lastTransportActivityAt: Date.now(),
		handledMessages: 0,
		unregisterUnhandled: null,
		unregisterTransportActivity: null,
		openedAfterRecentInbound: params.openedAfterRecentInbound,
		backgroundTasks: /* @__PURE__ */ new Set(),
		closePromise,
		resolveClose: resolveClosePromise,
		socketClosed: false
	};
}
async function closeWebSocketBestEffort(sock) {
	try {
		await sock.ws?.close?.();
	} catch {}
}
function closeWaSocket(sock) {
	try {
		if (typeof sock?.end === "function") {
			Promise.resolve(sock.end(/* @__PURE__ */ new Error("OpenClaw WhatsApp socket close"))).catch(async () => await closeWebSocketBestEffort(sock));
			return;
		}
		if (sock) closeWebSocketBestEffort(sock);
	} catch {
		if (sock) closeWebSocketBestEffort(sock);
	}
}
function stoppedControllerError() {
	return /* @__PURE__ */ new Error("WhatsApp connection controller is shutting down");
}
function closeWaSocketSoon(sock, delayMs = 500) {
	setTimeout(() => {
		closeWaSocket(sock);
	}, delayMs);
}
async function waitForLoginSocket(params) {
	if (!params.credentialPersistenceFailure) {
		await params.wait();
		return;
	}
	const outcome = await Promise.race([params.wait().then(() => ({ kind: "connected" })), params.credentialPersistenceFailure.then((failure) => ({
		kind: "credential-persistence-failed",
		failure
	}))]);
	if (outcome.kind === "credential-persistence-failed") throw outcome.failure.error;
}
function throwIfCredentialPersistenceFailed(getFailure) {
	const failure = getFailure?.();
	if (failure) throw failure.error;
}
async function waitForWhatsAppLoginResult(params) {
	const wait = params.waitForConnection ?? waitForWaConnection;
	const createSocket = params.createSocket ?? createWaSocket;
	let currentSock = params.sock;
	let postPairingRestarted = false;
	let timeoutRestarted = false;
	let loggedOutRestarted = false;
	const replaceLoginSocket = async (opts = {}) => {
		if (opts.closeCurrent ?? true) closeWaSocket(currentSock);
		try {
			currentSock = await createSocket(false, params.verbose, {
				authDir: params.authDir,
				...params.socketTiming,
				onQr: params.onQr,
				beforeCredentialPersistence: params.beforeCredentialPersistence,
				onCredentialPersistenceError: params.onCredentialPersistenceError,
				onCredentialPersistenceTask: params.onCredentialPersistenceTask
			});
			params.onSocketReplaced?.(currentSock);
			return null;
		} catch (createErr) {
			return {
				outcome: "failed",
				message: formatError(createErr),
				statusCode: getStatusCode(createErr),
				error: createErr
			};
		}
	};
	while (true) try {
		await waitForLoginSocket({
			wait: async () => await wait(currentSock, { timeout: "none" }),
			credentialPersistenceFailure: params.credentialPersistenceFailure
		});
		await params.waitForCredentialPersistence?.();
		throwIfCredentialPersistenceFailed(params.getCredentialPersistenceFailure);
		const persistedAuth = await readWebAuthExistsForDecision(params.authDir);
		throwIfCredentialPersistenceFailed(params.getCredentialPersistenceFailure);
		if (persistedAuth.outcome === "unstable") return {
			outcome: "failed",
			message: WHATSAPP_LOGIN_AUTH_UNSTABLE_MESSAGE,
			error: new WhatsAppAuthUnstableError(WHATSAPP_LOGIN_AUTH_UNSTABLE_MESSAGE)
		};
		if (!persistedAuth.exists) return {
			outcome: "failed",
			message: WHATSAPP_LOGIN_AUTH_NOT_PERSISTED_MESSAGE,
			error: new WhatsAppAuthUnstableError(WHATSAPP_LOGIN_AUTH_NOT_PERSISTED_MESSAGE)
		};
		return {
			outcome: "connected",
			restarted: postPairingRestarted || timeoutRestarted || loggedOutRestarted,
			sock: currentSock
		};
	} catch (err) {
		const statusCode = getStatusCode(err);
		const restartKind = getLoginSocketRestartKind(statusCode);
		if (restartKind && (restartKind === "post-pairing" && !postPairingRestarted || restartKind === "timeout" && !timeoutRestarted)) {
			if (restartKind === "post-pairing") postPairingRestarted = true;
			else timeoutRestarted = true;
			params.runtime.log(info(getLoginSocketRestartMessage(restartKind)));
			const replacementFailure = await replaceLoginSocket();
			if (replacementFailure) return replacementFailure;
			continue;
		}
		if (statusCode === LOGGED_OUT_STATUS) {
			if (loggedOutRestarted) return {
				outcome: "logged-out",
				message: WHATSAPP_LOGGED_OUT_RELINK_MESSAGE,
				statusCode: LOGGED_OUT_STATUS,
				error: err
			};
			closeWaSocket(currentSock);
			if (!await logoutWeb({
				authDir: params.authDir,
				isLegacyAuthDir: params.isLegacyAuthDir,
				runtime: params.runtime,
				beforeCredentialPersistence: params.beforeCredentialPersistence
			})) {
				const existingAuth = await readWebAuthExistsForDecision(params.authDir);
				if (existingAuth.outcome === "unstable") return {
					outcome: "failed",
					message: WHATSAPP_LOGIN_AUTH_UNSTABLE_MESSAGE,
					error: new WhatsAppAuthUnstableError(WHATSAPP_LOGIN_AUTH_UNSTABLE_MESSAGE)
				};
				if (existingAuth.exists) return {
					outcome: "failed",
					message: WHATSAPP_LOGIN_AUTH_NOT_CLEARED_MESSAGE,
					error: err
				};
			}
			loggedOutRestarted = true;
			const replacementFailure = await replaceLoginSocket({ closeCurrent: false });
			if (replacementFailure) return replacementFailure;
			continue;
		}
		return {
			outcome: "failed",
			message: formatError(err),
			statusCode,
			error: err
		};
	}
}
var WhatsAppConnectionController = class {
	constructor(params) {
		this.disconnectRetryController = new AbortController();
		this.current = null;
		this.runtimeContextLease = null;
		this.pendingOwnerContextLease = null;
		this.connectionOwnerLease = null;
		this.retainedOwnerReleaseLease = null;
		this.connectionOwnerLeasePromise = null;
		this.connectionSetupPromise = null;
		this.pendingSocketCleanup = null;
		this.shuttingDown = false;
		this.ownerAcquireAbortController = new AbortController();
		this.setupAbortController = new AbortController();
		this.reconnectAttempts = 0;
		this.lastHandledInboundAt = null;
		this.accountId = params.accountId;
		this.authDir = params.authDir;
		this.verbose = params.verbose;
		this.keepAlive = params.keepAlive;
		this.heartbeatSeconds = params.heartbeatSeconds;
		this.transportTimeoutMs = params.transportTimeoutMs;
		this.messageTimeoutMs = params.messageTimeoutMs;
		this.appSilenceTimeoutMs = params.messageTimeoutMs * 4;
		this.watchdogCheckMs = params.watchdogCheckMs;
		this.reconnectPolicy = params.reconnectPolicy;
		this.abortSignal = params.abortSignal;
		this.sleep = params.sleep ?? ((ms, signal) => sleepWithAbort(ms, signal));
		this.isNonRetryableStatus = params.isNonRetryableStatus ?? (() => false);
		this.socketTiming = {
			...DEFAULT_WHATSAPP_SOCKET_TIMING,
			...params.socketTiming
		};
		this.socketRef = { current: null };
		const abortSignal = params.abortSignal;
		if (abortSignal) this.abortPromise = new Promise((resolve) => {
			const stop = () => {
				resolve("aborted");
				this.stopDisconnectRetries();
				this.ownerAcquireAbortController.abort(abortSignal.reason);
				this.setupAbortController.abort(abortSignal.reason);
			};
			if (abortSignal.aborted) stop();
			else abortSignal.addEventListener("abort", stop, { once: true });
		});
	}
	getActiveListener() {
		return this.current?.listener ?? null;
	}
	getCurrentSock() {
		return this.socketRef.current;
	}
	getSelfIdentity() {
		const user = this.socketRef.current?.user;
		if (!user) return null;
		const jid = user.id ?? null;
		const lid = user.lid ?? null;
		if (!jid && !lid) return null;
		const resolved = resolveComparableIdentity({
			jid,
			lid
		}, this.authDir);
		return {
			jid: resolved.jid,
			lid: resolved.lid,
			e164: resolved.e164
		};
	}
	getReconnectAttempts() {
		return this.reconnectAttempts;
	}
	isStopRequested() {
		return this.abortSignal?.aborted === true;
	}
	shouldRetryDisconnect() {
		return this.keepAlive && !this.isStopRequested() && !this.disconnectRetryController.signal.aborted;
	}
	getDisconnectRetryAbortSignal() {
		return this.disconnectRetryController.signal;
	}
	noteInbound(timestamp = Date.now()) {
		if (!this.current) return;
		this.current.handledMessages += 1;
		this.current.lastInboundAt = timestamp;
		this.current.lastTransportActivityAt = timestamp;
		this.current.openedAfterRecentInbound = false;
		this.lastHandledInboundAt = timestamp;
	}
	noteTransportActivity(timestamp = Date.now()) {
		if (!this.current) return;
		this.current.lastTransportActivityAt = timestamp;
	}
	getCurrentSnapshot(connection = this.current) {
		if (!connection) return null;
		return {
			connectionId: connection.connectionId,
			startedAt: connection.startedAt,
			lastInboundAt: connection.lastInboundAt,
			lastTransportActivityAt: connection.lastTransportActivityAt,
			handledMessages: connection.handledMessages,
			reconnectAttempts: this.reconnectAttempts,
			uptimeMs: Date.now() - connection.startedAt
		};
	}
	setUnhandledRejectionCleanup(unregister) {
		if (!this.current) {
			unregister?.();
			return;
		}
		this.current.unregisterUnhandled?.();
		this.current.unregisterUnhandled = unregister;
	}
	async openConnection(params) {
		if (this.shuttingDown) throw stoppedControllerError();
		if (this.connectionSetupPromise) throw new Error("WhatsApp connection setup is already in progress");
		const setupPromise = this.openConnectionOwned(params);
		this.connectionSetupPromise = setupPromise;
		try {
			return await setupPromise;
		} finally {
			if (this.connectionSetupPromise === setupPromise) this.connectionSetupPromise = null;
		}
	}
	async openConnectionOwned(params) {
		await this.ensureConnectionOwnership();
		this.throwIfSetupStopped();
		await this.finishPendingSocketCleanup();
		this.throwIfSetupStopped();
		if (this.current) await this.closeCurrentConnection();
		this.throwIfSetupStopped();
		let sock = null;
		let connection = null;
		try {
			sock = await createWaSocket(false, this.verbose, {
				authDir: this.authDir,
				...this.socketTiming,
				...params.getMessage ? { getMessage: params.getMessage } : {},
				...params.cachedGroupMetadata ? { cachedGroupMetadata: params.cachedGroupMetadata } : {}
			});
			this.throwIfSetupStopped();
			await this.waitForSetupStep(waitForWaConnection(sock, { timeoutMs: this.socketTiming.connectTimeoutMs }));
			this.throwIfSetupStopped();
			this.socketRef.current = sock;
			connection = createLiveConnection({
				connectionId: params.connectionId,
				sock,
				listener: {},
				openedAfterRecentInbound: this.isOpeningAfterRecentInbound()
			});
			const listenerTask = params.createListener({
				sock,
				connection
			});
			let listener;
			try {
				listener = await this.waitForSetupStep(listenerTask);
			} catch (error) {
				if (this.setupAbortController.signal.aborted) listenerTask.then((lateListener) => lateListener.close?.()).catch(() => {});
				throw error;
			}
			connection.listener = listener;
			this.throwIfSetupStopped();
			this.current = connection;
			connection.unregisterTransportActivity = this.attachTransportActivityListener(sock);
			const previousRuntimeContextLease = this.runtimeContextLease;
			this.runtimeContextLease = registerChannelRuntimeContext({
				channelRuntime: getWhatsAppChannelRuntime(),
				channelId: "whatsapp",
				accountId: this.accountId,
				capability: WHATSAPP_CONNECTION_CONTROLLER_CAPABILITY,
				context: this,
				abortSignal: this.abortSignal
			});
			previousRuntimeContextLease?.dispose();
			this.pendingOwnerContextLease?.dispose();
			this.pendingOwnerContextLease = null;
			this.startTimers(connection, {
				onHeartbeat: params.onHeartbeat,
				onWatchdogTimeout: params.onWatchdogTimeout
			});
			return connection;
		} catch (err) {
			try {
				if (connection && this.current === connection) await this.closeCurrentConnection();
				else {
					try {
						await connection?.listener.close?.();
					} catch {}
					if (this.socketRef.current === sock) this.socketRef.current = null;
					if (sock) {
						const cleanup = connection ?? {
							sock,
							socketClosed: false
						};
						await this.finishSocketCleanup(cleanup);
					}
					if (connection?.unregisterUnhandled) connection.unregisterUnhandled();
					connection?.unregisterTransportActivity?.();
				}
			} catch (closeError) {
				if (sock && (!connection || this.current !== connection)) this.pendingSocketCleanup = connection ?? {
					sock,
					socketClosed: false
				};
				throw new AggregateError([err, closeError], "WhatsApp connection setup and close failed", { cause: err });
			}
			throw err;
		}
	}
	async waitForClose() {
		const connection = this.current;
		if (!connection) return "aborted";
		const listenerClose = connection.listener.onClose?.catch((err) => ({
			status: 500,
			isLoggedOut: false,
			error: err
		})) ?? createNeverResolvePromise();
		return await Promise.race([
			connection.closePromise,
			listenerClose,
			this.abortPromise ?? createNeverResolvePromise()
		]);
	}
	normalizeCloseReason(reason) {
		const statusCode = (typeof reason === "object" && reason && "status" in reason ? reason.status : void 0) ?? void 0;
		return {
			statusCode,
			statusLabel: typeof statusCode === "number" ? statusCode : "unknown",
			isLoggedOut: typeof reason === "object" && reason !== null && "isLoggedOut" in reason && reason.isLoggedOut === true,
			error: reason?.error,
			errorText: formatError(reason)
		};
	}
	resolveCloseDecision(reason) {
		if (reason === "aborted" || this.isStopRequested()) return "aborted";
		const current = this.current;
		if (current && Date.now() - current.startedAt > this.heartbeatSeconds * 1e3) this.reconnectAttempts = 0;
		const normalized = this.normalizeCloseReason(reason);
		if (normalized.isLoggedOut) return {
			action: "stop",
			reconnectAttempts: this.reconnectAttempts,
			healthState: "logged-out",
			normalized
		};
		if (this.isNonRetryableStatus(normalized.statusCode)) return {
			action: "stop",
			reconnectAttempts: this.reconnectAttempts,
			healthState: "conflict",
			normalized
		};
		const retryDecision = this.consumeReconnectAttempt();
		if (retryDecision.action === "stop") return {
			action: "stop",
			reconnectAttempts: retryDecision.reconnectAttempts,
			healthState: retryDecision.healthState,
			normalized
		};
		return {
			action: "retry",
			delayMs: retryDecision.delayMs,
			reconnectAttempts: retryDecision.reconnectAttempts,
			healthState: retryDecision.healthState,
			normalized
		};
	}
	resolveSetupErrorDecision(error) {
		const statusCode = getStatusCode(error);
		if (typeof statusCode !== "number") return null;
		return this.resolveCloseDecision({
			status: statusCode,
			isLoggedOut: statusCode === LOGGED_OUT_STATUS,
			error
		});
	}
	consumeReconnectAttempt() {
		this.reconnectAttempts += 1;
		if (this.reconnectPolicy.maxAttempts > 0 && this.reconnectAttempts >= this.reconnectPolicy.maxAttempts) return {
			action: "stop",
			reconnectAttempts: this.reconnectAttempts,
			healthState: "stopped"
		};
		return {
			action: "retry",
			delayMs: computeBackoff(this.reconnectPolicy, this.reconnectAttempts),
			reconnectAttempts: this.reconnectAttempts,
			healthState: "reconnecting"
		};
	}
	forceClose(reason) {
		const connection = this.current;
		if (!connection) return;
		connection.resolveClose(reason);
		connection.listener.signalClose?.(reason);
	}
	async closeCurrentConnection() {
		const connection = this.current;
		if (!connection) return;
		this.current = null;
		this.pendingSocketCleanup = connection;
		if (this.socketRef.current === connection.sock) this.socketRef.current = null;
		connection.unregisterUnhandled?.();
		connection.unregisterTransportActivity?.();
		if (connection.heartbeat) clearInterval(connection.heartbeat);
		if (connection.watchdogTimer) clearInterval(connection.watchdogTimer);
		if (connection.backgroundTasks.size > 0) {
			await Promise.allSettled(connection.backgroundTasks);
			connection.backgroundTasks.clear();
		}
		try {
			await connection.listener.close?.();
		} catch {}
		await this.finishSocketCleanup(connection);
		if (this.pendingSocketCleanup === connection) this.pendingSocketCleanup = null;
	}
	async waitBeforeRetry(delayMs) {
		await this.sleep(delayMs, this.abortSignal);
	}
	async shutdown() {
		this.shuttingDown = true;
		const stoppedError = stoppedControllerError();
		this.ownerAcquireAbortController.abort(stoppedError);
		this.setupAbortController.abort(stoppedError);
		this.stopDisconnectRetries();
		await this.connectionSetupPromise?.catch(() => {});
		await this.connectionOwnerLeasePromise?.catch(() => {});
		await this.closeCurrentConnection();
		await this.finishPendingSocketCleanup();
		try {
			this.runtimeContextLease?.dispose();
		} finally {
			this.runtimeContextLease = null;
			try {
				this.pendingOwnerContextLease?.dispose();
			} finally {
				this.pendingOwnerContextLease = null;
				if (this.connectionOwnerLease) {
					await this.connectionOwnerLease.release();
					this.connectionOwnerLease = null;
				}
				if (this.retainedOwnerReleaseLease) {
					await this.retainedOwnerReleaseLease.release();
					this.retainedOwnerReleaseLease = null;
				}
			}
		}
	}
	async finishSocketCleanup(cleanup) {
		if (!cleanup.socketClosed) {
			await closeWhatsAppSocketAndWait(cleanup.sock, "OpenClaw WhatsApp socket close");
			cleanup.socketClosed = true;
		}
		if (await waitForCredsSaveQueueWithTimeout(this.authDir) === "timed_out") throw new Error("WhatsApp credential persistence did not drain before owner release");
	}
	async finishPendingSocketCleanup() {
		const cleanup = this.pendingSocketCleanup;
		if (!cleanup) return;
		await this.finishSocketCleanup(cleanup);
		if (this.pendingSocketCleanup === cleanup) this.pendingSocketCleanup = null;
	}
	throwIfSetupStopped() {
		if (this.shuttingDown || this.setupAbortController.signal.aborted) throw stoppedControllerError();
	}
	async waitForSetupStep(task) {
		this.throwIfSetupStopped();
		const signal = this.setupAbortController.signal;
		let onAbort;
		const aborted = new Promise((_resolve, reject) => {
			onAbort = () => reject(stoppedControllerError());
			signal.addEventListener("abort", onAbort, { once: true });
		});
		try {
			return await Promise.race([task, aborted]);
		} finally {
			if (onAbort) signal.removeEventListener("abort", onAbort);
		}
	}
	async ensureConnectionOwnership() {
		if (this.retainedOwnerReleaseLease) {
			await this.retainedOwnerReleaseLease.release();
			this.retainedOwnerReleaseLease = null;
		}
		if (this.connectionOwnerLease) return;
		if (!this.connectionOwnerLeasePromise) this.connectionOwnerLeasePromise = (async () => {
			const ownerLease = await acquireWhatsAppGatewayConnectionOwner(this.authDir, this.ownerAcquireAbortController.signal);
			try {
				if (this.shuttingDown) throw stoppedControllerError();
				this.pendingOwnerContextLease = registerChannelRuntimeContext({
					channelRuntime: getWhatsAppChannelRuntime(),
					channelId: "whatsapp",
					accountId: this.accountId,
					capability: WHATSAPP_CONNECTION_OWNER_PENDING_CAPABILITY,
					context: true,
					abortSignal: this.abortSignal
				});
				this.connectionOwnerLease = ownerLease;
			} catch (error) {
				try {
					await ownerLease.release();
				} catch (releaseError) {
					this.retainedOwnerReleaseLease = ownerLease;
					throw new AggregateError([error, releaseError], "WhatsApp connection ownership setup and release failed", { cause: error });
				}
				throw error;
			}
		})().finally(() => {
			this.connectionOwnerLeasePromise = null;
		});
		await this.connectionOwnerLeasePromise;
	}
	startTimers(connection, hooks) {
		if (!this.keepAlive) return;
		connection.heartbeat = setInterval(() => {
			const snapshot = this.getCurrentSnapshot(connection);
			if (!snapshot) return;
			hooks.onHeartbeat?.(snapshot);
		}, this.heartbeatSeconds * 1e3);
		connection.watchdogTimer = setInterval(() => {
			const now = Date.now();
			const transportStaleForMs = now - connection.lastTransportActivityAt;
			const appSilentForMs = now - (connection.lastInboundAt ?? connection.startedAt);
			const appSilenceTimeoutMs = connection.openedAfterRecentInbound ? this.messageTimeoutMs : this.appSilenceTimeoutMs;
			if (transportStaleForMs <= this.transportTimeoutMs && appSilentForMs <= appSilenceTimeoutMs) return;
			const snapshot = this.getCurrentSnapshot(connection);
			if (!snapshot) return;
			hooks.onWatchdogTimeout?.(snapshot);
			this.forceClose({
				status: 499,
				isLoggedOut: false,
				error: WHATSAPP_WATCHDOG_TIMEOUT_ERROR
			});
		}, this.watchdogCheckMs);
	}
	attachTransportActivityListener(sock) {
		const ws = sock.ws;
		if (!ws || typeof ws.on !== "function") return null;
		const noteActivity = () => this.noteTransportActivity();
		ws.on("frame", noteActivity);
		return () => {
			if (typeof ws.off === "function") {
				ws.off("frame", noteActivity);
				return;
			}
			ws.removeListener?.("frame", noteActivity);
		};
	}
	isOpeningAfterRecentInbound() {
		if (this.reconnectAttempts <= 0 || this.lastHandledInboundAt === null) return false;
		return Date.now() - this.lastHandledInboundAt <= this.appSilenceTimeoutMs;
	}
	stopDisconnectRetries() {
		if (!this.disconnectRetryController.signal.aborted) this.disconnectRetryController.abort();
	}
};
//#endregion
export { closeWaSocketSoon as a, computeBackoff as c, resolveReconnectPolicy as d, sleepWithAbort as f, closeWaSocket as i, newConnectionId as l, WHATSAPP_WATCHDOG_TIMEOUT_ERROR as n, waitForWhatsAppLoginResult as o, WhatsAppConnectionController as r, DEFAULT_RECONNECT_POLICY as s, WHATSAPP_LOGGED_OUT_QR_MESSAGE as t, resolveHeartbeatSeconds as u };
