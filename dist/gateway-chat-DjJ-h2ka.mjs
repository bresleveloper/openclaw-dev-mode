import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { s as readActiveGatewayLockPort } from "./gateway-lock-B6mKYs2x.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES, t as GATEWAY_CLIENT_CAPS } from "./client-info-C8RatpKO.mjs";
import { a as roleScopesAllow } from "./operator-scope-compat-Ci6GBcmU.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-BTjjxElt.mjs";
import "./version-CwNT1gaY.mjs";
import { n as loadDeviceIdentityIfPresent } from "./device-identity-KmxGQO-v.mjs";
import { t as ConnectErrorDetailCodes, u as readConnectErrorDetailCode } from "./connect-error-details-q_NaMExM.mjs";
import { s as loadOriginDeviceToken } from "./device-auth-store-BEiXAvyd.mjs";
import { t as buildGatewayConnectionDetails } from "./call-DnqhP17M.mjs";
import { t as startGatewayClientWhenEventLoopReady } from "./readiness-kkd804Uc.mjs";
import { r as resolveExplicitGatewayAuth } from "./credentials-lHQ7_oVm.mjs";
import { i as resolveGatewayDeviceAuthRoute } from "./connection-details-BcuL3xPn.mjs";
import { i as resolveGatewayUrlOverride, r as resolveGatewayClientBootstrap } from "./client-bootstrap-D-pUrrKi.mjs";
import { a as isRetryableGatewayStartupUnavailableError } from "./startup-unavailable-D0-EeFjq.mjs";
import { t as GatewayClient } from "./client-CrrkVIh8.mjs";
import { t as GatewayClientRequestError } from "./request-error-Clu0Uyey.mjs";
import { n as normalizeEdgeAuthHeadersConfig, r as resolveEdgeAuthHeaders, t as gatewayEdgeAuthValueForTarget } from "./edge-auth-CCWpK-_0.mjs";
import { t as assertExplicitGatewayAuthModeWhenBothConfigured } from "./auth-mode-policy-DzNSJi11.mjs";
import { t as mergeChatStreamMessage } from "./chat-stream-message-Cxmp5iwS.mjs";
import { n as isListedTuiSession } from "./tui-session-list-policy-GTQ8VnY7.mjs";
import { randomUUID } from "node:crypto";
//#region packages/gateway-client/src/chat-stream-projection.ts
/** Connection-owned chat baselines, independent of the selected local view. */
var GatewayChatStreamProjection = class {
	constructor() {
		this.runs = /* @__PURE__ */ new Map();
	}
	project(event) {
		if (event.event !== "chat") return {
			event,
			missingBaseline: false
		};
		const payload = asNullableRecord(event.payload);
		if (!payload || typeof payload.runId !== "string" || typeof payload.sessionKey !== "string") return {
			event,
			missingBaseline: false
		};
		if (payload.state === "delta") {
			const previous = this.runs.get(payload.runId);
			const message = mergeChatStreamMessage(previous?.sessionKey === payload.sessionKey && previous.agentId === payload.agentId ? previous.message : void 0, payload);
			if (message !== void 0) this.runs.set(payload.runId, {
				sessionKey: payload.sessionKey,
				agentId: payload.agentId,
				message
			});
			return {
				event: {
					...event,
					payload: {
						...payload,
						message
					}
				},
				missingBaseline: message === void 0
			};
		}
		if (payload.state === "final" || payload.state === "error" || payload.state === "aborted") this.runs.delete(payload.runId);
		return {
			event,
			missingBaseline: false
		};
	}
	retire(isRetired) {
		for (const [runId, scope] of this.runs) if (isRetired(scope)) this.runs.delete(runId);
	}
	clear() {
		this.runs.clear();
	}
};
//#endregion
//#region src/tui/gateway-chat-models.ts
function refreshTuiGatewayModelCatalog(params) {
	const { catalogs, client, agentId, published, onChanged } = params;
	let entry = catalogs.get(agentId);
	if (!entry) {
		entry = {};
		catalogs.set(agentId, entry);
	}
	if (entry.pending) return entry.pending;
	const owner = entry;
	const current = () => catalogs.get(agentId) === owner && owner.pending === pending;
	const pending = client.request("models.list", {
		...agentId ? { agentId } : {},
		...published ? { includeDetails: true } : {}
	}).then((res) => {
		if (!current()) return catalogs.get(agentId)?.models ?? [];
		const models = Array.isArray(res?.models) ? res.models : [];
		owner.models = published ? models : models.map(({ available: _available, unavailableReason: _reason, ...model }) => model);
		onChanged?.(agentId);
		return owner.models;
	}).catch((error) => {
		if (!current()) return catalogs.get(agentId)?.models ?? [];
		throw error;
	}).finally(() => {
		if (current()) owner.pending = void 0;
	});
	owner.pending = pending;
	return pending;
}
//#endregion
//#region src/tui/gateway-chat.ts
const STARTUP_CHAT_HISTORY_RETRY_TIMEOUT_MS = 6e4;
const STARTUP_CHAT_HISTORY_DEFAULT_RETRY_MS = 500;
const STARTUP_CHAT_HISTORY_MAX_RETRY_MS = 5e3;
function throwGatewayAuthResolutionError(reason) {
	throw new Error([
		reason,
		"Fix: set OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD, pass --token/--password,",
		"or resolve the configured secret provider for this credential."
	].join("\n"));
}
function isRetryableStartupUnavailable(err, method) {
	if (!(err instanceof GatewayClientRequestError)) return false;
	if (err.gatewayCode !== "UNAVAILABLE" || !err.retryable) return false;
	const details = err.details;
	if (!details || typeof details !== "object") return true;
	const detailMethod = details.method;
	return typeof detailMethod !== "string" || detailMethod === method;
}
function resolveStartupRetryDelayMs(err) {
	const retryAfterMs = typeof err.retryAfterMs === "number" ? err.retryAfterMs : STARTUP_CHAT_HISTORY_DEFAULT_RETRY_MS;
	return Math.min(Math.max(retryAfterMs, 100), STARTUP_CHAT_HISTORY_MAX_RETRY_MS);
}
async function hasStoredOriginDeviceAuth(deviceAuthScope) {
	try {
		const identity = loadDeviceIdentityIfPresent();
		return Boolean(identity && (await loadOriginDeviceToken({
			gatewayScope: deviceAuthScope,
			deviceId: identity.deviceId,
			role: "operator"
		}))?.token);
	} catch {
		return false;
	}
}
function isLegacyParameterError(err, method, parameter) {
	if (!(err instanceof GatewayClientRequestError) || err.gatewayCode !== "INVALID_REQUEST") return false;
	const message = err.message.toLowerCase();
	return message.includes(`invalid ${method} params`) && message.includes(parameter);
}
var GatewayChatClient = class GatewayChatClient {
	constructor(connection) {
		this.chatStream = new GatewayChatStreamProjection();
		this.historyLifetime = new AbortController();
		this.ready = createDeferredCore();
		this.modelCatalogs = /* @__PURE__ */ new Map();
		this.connection = connection;
		this.client = new GatewayClient({
			url: connection.url,
			...connection.deviceAuthScope ? { deviceAuthScope: connection.deviceAuthScope } : {},
			...connection.sshTunnel ? { sshTunnel: connection.sshTunnel } : {},
			token: connection.token,
			password: connection.password,
			edgeAuthHeaders: connection.edgeAuthHeaders,
			tlsFingerprint: connection.tlsFingerprint,
			preauthHandshakeTimeoutMs: connection.preauthHandshakeTimeoutMs,
			clientName: GATEWAY_CLIENT_NAMES.TUI,
			clientDisplayName: "openclaw-tui",
			clientVersion: VERSION,
			mode: GATEWAY_CLIENT_MODES.UI,
			scopes: [
				"operator.admin",
				"operator.read",
				"operator.write",
				"operator.approvals"
			],
			caps: [
				GATEWAY_CLIENT_CAPS.AGENT_KIND,
				GATEWAY_CLIENT_CAPS.PLUGIN_APPROVALS,
				GATEWAY_CLIENT_CAPS.TASK_SUGGESTIONS,
				GATEWAY_CLIENT_CAPS.TOOL_EVENTS,
				GATEWAY_CLIENT_CAPS.ULTRAFAST
			],
			instanceId: randomUUID(),
			minProtocol: 4,
			maxProtocol: 4,
			notifyOnStartupRetry: true,
			onHelloOk: (hello) => {
				this.pendingConnectError = void 0;
				this.hello = hello;
				this.ready.resolve();
				this.onConnected?.();
			},
			onEvent: (evt) => {
				this.refreshModelsForEvent(evt);
				const projected = this.chatStream.project({
					event: evt.event,
					payload: evt.payload,
					seq: evt.seq
				});
				this.onEvent?.(projected.event);
			},
			onClose: (_code, reason) => {
				this.chatStream.clear();
				this.modelCatalogs.clear();
				this.ready = createDeferredCore();
				if (this.pendingConnectError && this.onConnectError) {
					this.pendingConnectError = void 0;
					return;
				}
				this.onDisconnected?.(reason);
			},
			onConnectError: (error) => this.notifyConnectError(error),
			onGap: (info) => {
				this.onGap?.(info);
			}
		});
	}
	static async connect(opts) {
		const connection = await resolveGatewayConnection(opts);
		return new GatewayChatClient(connection);
	}
	/** Connect to a target already selected and authenticated by a preceding Gateway probe. */
	static async connectBound(opts) {
		return new GatewayChatClient(await resolveBoundGatewayConnection(opts));
	}
	start() {
		startGatewayClientWhenEventLoopReady(this.client, { clientOptions: { preauthHandshakeTimeoutMs: this.connection.preauthHandshakeTimeoutMs } }).then((readiness) => {
			if (!readiness.ready && !readiness.aborted) this.notifyUnclosedConnectError(/* @__PURE__ */ new Error("gateway event loop readiness timeout"));
		}).catch((err) => {
			this.notifyUnclosedConnectError(err instanceof Error ? err : new Error(String(err)));
		});
	}
	notifyConnectError(error) {
		if (this.pendingConnectError) return;
		if (isRetryableGatewayStartupUnavailableError(error)) return;
		if (this.connection.deviceAuthScope && readConnectErrorDetailCode(error.details) === ConnectErrorDetailCodes.PAIRING_REQUIRED && !error.message.includes("Pairing request sent.")) error.message = [error.message, "Pairing request sent. Approve it in that gateway's Control UI (Settings -> Devices), or run `openclaw devices approve --latest` on the gateway host, then retry."].join("\n");
		this.pendingConnectError = error;
		this.onConnectError?.(error);
	}
	notifyUnclosedConnectError(error) {
		const hasStructuredHandler = Boolean(this.onConnectError);
		this.notifyConnectError(error);
		if (!hasStructuredHandler) this.onDisconnected?.(error.message);
	}
	stop() {
		this.chatStream.clear();
		this.historyLifetime.abort();
		this.modelCatalogs.clear();
		return this.client.stopAndWait();
	}
	async subscribeSessionEvents() {
		return await this.client.request("sessions.subscribe", {});
	}
	async waitForReady() {
		await this.ready.promise;
	}
	async sendChat(opts) {
		const runId = opts.runId ?? randomUUID();
		const response = await this.client.request("chat.send", {
			sessionKey: opts.sessionKey,
			...opts.agentId ? { agentId: opts.agentId } : {},
			...opts.sessionId ? { sessionId: opts.sessionId } : {},
			message: opts.message,
			thinking: opts.thinking,
			deliver: opts.deliver,
			timeoutMs: opts.timeoutMs,
			idempotencyKey: runId
		});
		const acceptedRunId = normalizeOptionalString(response?.runId) ?? runId;
		const status = normalizeOptionalString(response?.status);
		return status ? {
			runId: acceptedRunId,
			status
		} : { runId: acceptedRunId };
	}
	async abortChat(opts) {
		const params = {
			sessionKey: opts.sessionKey,
			...opts.agentId ? { agentId: opts.agentId } : {},
			...opts.runId ? { runId: opts.runId } : {}
		};
		try {
			return await this.client.request("chat.abort", opts.runId ? params : {
				...params,
				preserveSideRuns: true
			});
		} catch (err) {
			if (opts.runId || !isLegacyParameterError(err, "chat.abort", "preservesideruns")) throw err;
			return await this.client.request("chat.abort", params);
		}
	}
	async loadHistory(opts) {
		const deadline = Date.now() + STARTUP_CHAT_HISTORY_RETRY_TIMEOUT_MS;
		for (;;) {
			this.historyLifetime.signal.throwIfAborted();
			try {
				return await this.client.request("chat.history", {
					sessionKey: opts.sessionKey,
					...opts.agentId ? { agentId: opts.agentId } : {},
					limit: opts.limit
				});
			} catch (err) {
				if (Date.now() >= deadline || !isRetryableStartupUnavailable(err, "chat.history")) throw err;
				await sleep(resolveStartupRetryDelayMs(err), this.historyLifetime.signal);
			}
		}
	}
	async loadImage(opts) {
		const { loadGatewayImage } = await import("./gateway-image-loader-C7p2hc8p.mjs");
		const signal = AbortSignal.any([opts.signal, this.historyLifetime.signal]);
		const credentials = [this.hello?.auth.deviceToken, ...this.hello?.auth.method === "password" ? [this.connection.password, this.connection.token] : [this.connection.token, this.connection.password]].filter((value) => Boolean(value));
		return await loadGatewayImage({
			request: {
				...opts,
				signal
			},
			connection: this.connection,
			credentials: [...new Set(credentials)],
			readMediaBasePath: async (requestSignal) => {
				return (await this.client.request("config.get", {}, { signal: requestSignal })).runtimeConfig.gateway?.controlUi?.basePath ?? "";
			},
			downloadArtifact: (artifactId, requestSignal) => this.client.request("artifacts.download", {
				sessionKey: opts.sessionKey,
				...opts.agentId ? { agentId: opts.agentId } : {},
				artifactId
			}, { signal: requestSignal })
		});
	}
	async listSessions(opts) {
		return await this.client.request("sessions.list", opts ?? {});
	}
	async resolveSession(opts) {
		return await this.client.request("sessions.resolve", opts);
	}
	async describeSession(opts) {
		const agentId = opts.agentId ?? parseAgentSessionKey(opts.sessionKey)?.agentId;
		const signal = this.historyLifetime.signal;
		for (;;) {
			signal.throwIfAborted();
			const connection = this.ready;
			const hello = this.hello;
			const isCurrentConnection = () => connection === this.ready && hello === this.hello;
			try {
				const [description, listing] = await Promise.all([this.client.request("sessions.describe", {
					key: opts.sessionKey,
					...opts.agentId ? { agentId: opts.agentId } : {}
				}, { signal }), this.client.request("sessions.list", {
					agentId,
					limit: 1
				}, { signal })]);
				signal.throwIfAborted();
				if (isCurrentConnection()) {
					const session = description.session;
					return {
						session: session && isListedTuiSession(session) ? session : null,
						defaults: listing.defaults
					};
				}
			} catch (error) {
				if (signal.aborted || isCurrentConnection()) throw error;
			}
			await racePromiseWithAbortSignal(this.ready.promise, signal);
		}
	}
	async listAgents() {
		const result = await this.client.request("agents.list", {});
		if (!this.modelCatalogs.has(result.defaultId)) this.listModels({ agentId: result.defaultId }).catch(() => {});
		return result;
	}
	async patchSession(opts) {
		return await this.client.request("sessions.patch", opts);
	}
	async createSession(opts) {
		const params = {
			...opts,
			emitCommandHooks: Boolean(opts.parentSessionKey)
		};
		try {
			return await this.client.request("sessions.create", params);
		} catch (err) {
			if (opts.succeedsParent === void 0 || !isLegacyParameterError(err, "sessions.create", "succeedsparent")) throw err;
			const { succeedsParent: _succeedsParent, ...legacyParams } = params;
			if (!opts.succeedsParent) {
				const { parentSessionKey: _parentSessionKey, emitCommandHooks: _emitCommandHooks, ...parallelParams } = legacyParams;
				return await this.client.request("sessions.create", parallelParams);
			}
			return await this.client.request("sessions.create", legacyParams);
		}
	}
	async resetSession(key, reason, opts) {
		return await this.client.request("sessions.reset", {
			key,
			...opts?.agentId ? { agentId: opts.agentId } : {},
			...reason ? { reason } : {}
		});
	}
	async getGatewayStatus() {
		return await this.client.request("status");
	}
	getKnownModels(opts) {
		return this.modelCatalogs.get(opts?.agentId)?.models;
	}
	listModels(opts) {
		return refreshTuiGatewayModelCatalog({
			catalogs: this.modelCatalogs,
			client: this.client,
			agentId: opts?.agentId,
			published: this.hello?.features.capabilities?.includes(GATEWAY_SERVER_CAPS.PUBLISHED_MODEL_CATALOG) === true,
			onChanged: this.onModelsChanged
		});
	}
	refreshModelsForEvent(event) {
		const payload = asNullableRecord(event.payload);
		const clear = event.event === "chat.metadata.changed" && payload?.modelSelectionChanged === true;
		const refresh = event.event === "config.changed" || event.event === "chat.metadata.changed" && payload?.modelCatalogChanged !== false;
		const scope = event.event === "models.snapshot" ? asNullableRecord(payload?.scope) : null;
		if (!clear && !refresh && !scope) return;
		for (const [agentId, entry] of this.modelCatalogs) {
			if (scope && (scope.agentId !== agentId || scope.sessionKey || scope.authProfileId)) continue;
			entry.pending = void 0;
			if (clear) {
				entry.models = void 0;
				this.onModelsChanged?.(agentId);
			}
			this.listModels({ agentId }).catch(() => {});
		}
	}
	async listCommands(opts) {
		const res = await this.client.request("commands.list", opts ?? {});
		return Array.isArray(res?.commands) ? res.commands : [];
	}
	async listPluginApprovals() {
		return await this.client.request("plugin.approval.list", {});
	}
	async listQuestions() {
		return await this.client.request("question.list", {});
	}
	async getQuestion(id) {
		return await this.client.request("question.get", { id });
	}
	async resolveQuestion(params) {
		return await this.client.request("question.resolve", params);
	}
	async resolvePluginApproval(id, decision) {
		return await this.client.request("plugin.approval.resolve", {
			id,
			decision
		});
	}
	getTaskSuggestionActionCapabilities() {
		const auth = this.hello?.auth;
		const methods = this.hello?.features?.methods;
		const allows = (method, scope) => Array.isArray(methods) && methods.includes(method) && Boolean(auth && roleScopesAllow({
			role: auth.role,
			requestedScopes: [scope],
			allowedScopes: auth.scopes
		}));
		return {
			canAccept: allows("taskSuggestions.accept", "operator.admin"),
			canDismiss: allows("taskSuggestions.dismiss", "operator.write")
		};
	}
	async listTaskSuggestions() {
		if (this.hello?.features?.methods?.includes("taskSuggestions.list") !== true) return [];
		const actions = this.getTaskSuggestionActionCapabilities();
		if (!actions.canAccept && !actions.canDismiss) return [];
		return (await this.client.request("taskSuggestions.list", {})).suggestions;
	}
	async acceptTaskSuggestion(taskId) {
		return await this.client.request("taskSuggestions.accept", {
			taskId,
			mode: "local"
		});
	}
	async dismissTaskSuggestion(taskId) {
		return await this.client.request("taskSuggestions.dismiss", { taskId });
	}
};
/**
* Preserve a pre-probed Gateway route across an in-process handoff. This path
* deliberately ignores global config and Gateway env overrides, including
* credentials, while still applying the normal remote URL safety policy.
*/
async function resolveBoundGatewayConnection(opts) {
	const url = buildGatewayConnectionDetails({
		config: opts.config,
		url: opts.url,
		ignoreEnvUrlOverride: true
	}).url;
	const explicitAuth = resolveExplicitGatewayAuth({
		token: opts.token,
		password: opts.password
	});
	const edgeAuthConfig = normalizeEdgeAuthHeadersConfig(gatewayEdgeAuthValueForTarget({
		config: opts.config,
		targetUrl: url
	}));
	const edgeAuthHeaders = await resolveEdgeAuthHeaders({
		config: opts.config,
		value: edgeAuthConfig,
		targetUrl: url,
		env: process.env
	});
	const { deviceAuthScope, sshTunnel } = resolveGatewayDeviceAuthRoute({
		config: opts.config,
		url,
		remote: true,
		configuredRemote: opts.configuredRemote,
		tlsFingerprint: opts.tlsFingerprint
	});
	return {
		url,
		deviceAuthScope,
		...sshTunnel ? { sshTunnel } : {},
		token: explicitAuth.token,
		password: explicitAuth.password,
		...edgeAuthHeaders ? { edgeAuthHeaders } : {},
		...opts.tlsFingerprint ? { tlsFingerprint: opts.tlsFingerprint } : {}
	};
}
async function resolveGatewayConnection(opts) {
	const config = getRuntimeConfig();
	const env = process.env;
	const gatewayAuthMode = config.gateway?.auth?.mode;
	const isRemoteMode = config.gateway?.mode === "remote";
	const urlOverride = resolveGatewayUrlOverride({
		gatewayUrl: opts.url,
		env
	});
	const explicitAuth = resolveExplicitGatewayAuth({
		token: opts.token,
		password: opts.password
	});
	const hasExplicitGatewayTarget = Boolean(urlOverride.url || env.OPENCLAW_GATEWAY_PORT?.trim() || isRemoteMode);
	const resumeMayMatchLocalTarget = opts.allowConfiguredAuthForExactTarget === true && urlOverride.source === "cli" && !isRemoteMode && !env.OPENCLAW_GATEWAY_PORT?.trim();
	const activeLocalGatewayPort = !hasExplicitGatewayTarget || resumeMayMatchLocalTarget ? await readActiveGatewayLockPort() : void 0;
	if (!urlOverride.source && gatewayAuthMode !== "none" && gatewayAuthMode !== "trusted-proxy" && !isRemoteMode) try {
		assertExplicitGatewayAuthModeWhenBothConfigured(config);
	} catch (err) {
		throwGatewayAuthResolutionError(formatErrorMessage(err));
	}
	const bootstrap = await resolveGatewayClientBootstrap({
		config,
		gatewayUrl: urlOverride.source === "cli" ? urlOverride.url : void 0,
		explicitAuth,
		env,
		authPolicy: "interactive",
		allowConfiguredAuthForExactTarget: opts.allowConfiguredAuthForExactTarget,
		suppressEnvAuthFallback: opts.suppressEnvAuthFallback,
		...activeLocalGatewayPort ? { localPortOverride: activeLocalGatewayPort } : {},
		explicitTlsFingerprint: opts.tlsFingerprint,
		allowStoredOriginAuth: hasStoredOriginDeviceAuth,
		overrideAuthErrorHint: "Fix: pass --token or --password once to request pairing, approve it in that gateway's Control UI (Settings -> Devices), then retry with the same credential so OpenClaw can store the device token.",
		buildConnectionDetails: buildGatewayConnectionDetails
	});
	const hasStoredOriginAuth = Boolean(bootstrap.deviceAuthScope && await hasStoredOriginDeviceAuth(bootstrap.deviceAuthScope));
	const missingSharedAuth = bootstrap.authFailureReason === "Missing gateway auth credentials." || bootstrap.authFailureReason === "Missing gateway auth token." || bootstrap.authFailureReason === "Missing gateway auth password.";
	if (bootstrap.authFailureReason && (!missingSharedAuth || !hasStoredOriginAuth)) throwGatewayAuthResolutionError(bootstrap.authFailureReason);
	const edgeAuthConfig = normalizeEdgeAuthHeadersConfig(gatewayEdgeAuthValueForTarget({
		config,
		targetUrl: bootstrap.url
	}));
	const edgeAuthHeaders = await resolveEdgeAuthHeaders({
		config,
		value: edgeAuthConfig,
		targetUrl: bootstrap.url,
		env
	});
	return {
		url: bootstrap.url,
		deviceAuthScope: bootstrap.deviceAuthScope,
		...bootstrap.sshTunnel ? { sshTunnel: bootstrap.sshTunnel } : {},
		token: bootstrap.auth.token,
		password: bootstrap.auth.password,
		...edgeAuthHeaders ? { edgeAuthHeaders } : {},
		...bootstrap.tlsFingerprint ? { tlsFingerprint: bootstrap.tlsFingerprint } : {}
	};
}
//#endregion
export { GatewayChatClient };
