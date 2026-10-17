import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as isNodeHostLauncherChild, o as setNodeHostLauncherRestartArguments, r as notifyNodeHostLauncherReady, s as watchNodeHostParentStdin } from "./launcher-client-DNBTHwUk.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-Bd4757D_.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import { i as copyConfigResolutionFactsExcept } from "./resolution-facts-HH1cnmIY.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-C8RatpKO.mjs";
import { r as logInfo } from "./logger-DskmrSVa.mjs";
import { n as loadDeviceIdentityIfPresent, r as loadOrCreateDeviceIdentity } from "./device-identity-KmxGQO-v.mjs";
import { t as ConnectErrorDetailCodes } from "./connect-error-details-q_NaMExM.mjs";
import { a as loadDeviceAuthTokenReadOnly } from "./device-auth-store-BEiXAvyd.mjs";
import { t as startGatewayClientWhenEventLoopReady } from "./readiness-kkd804Uc.mjs";
import { r as resolveExplicitGatewayAuth } from "./credentials-lHQ7_oVm.mjs";
import { t as gatewayOriginScope } from "./gateway-origin-scope-D4zHFrov.mjs";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-DxDUO_P2.mjs";
import { t as GatewayClient } from "./client-CrrkVIh8.mjs";
import { t as GatewayClientRequestError } from "./request-error-Clu0Uyey.mjs";
import { t as resolveGatewayClientPlatformIdentity } from "./gateway-client-platform-h2QbDjYZ.mjs";
import { t as resolveMachineModelIdentifier } from "./machine-model-C0iHjDpF.mjs";
import { t as getMachineDisplayName } from "./machine-name-XEOScrzy.mjs";
import { a as loadNodeHostConfig, i as configureNodeHost, u as resolveNodeHostCloudflareAccess } from "./config-BO4n0NZx.mjs";
import { n as prepareNodeHostRuntime, r as startNodeHostConnection, t as ensureNodeHostStateReady } from "./startup-state-readiness-RvHpbrJ8.mjs";
import { f as buildCloudflareAccessHeaders } from "./launch-descriptor-BQV4k-tD.mjs";
import { a as coerceNodeInvokeInputPayload, i as coerceNodeInvokeCancelPayload, o as coerceNodeInvokePayload } from "./invoke-agent-cli-claude-params-C_OgNYoh.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/node-host/gateway-candidate-connection.ts
function formatGatewayCandidateUrl(gateway) {
	const host = gateway.host ?? "127.0.0.1";
	const urlHost = host.includes(":") && !(host.startsWith("[") && host.endsWith("]")) ? `[${host}]` : host;
	const port = gateway.port ?? 18789;
	return `${gateway.tls ? "wss" : "ws"}://${urlHost}:${port}${gateway.contextPath ? gateway.contextPath.startsWith("/") ? gateway.contextPath : `/${gateway.contextPath}` : ""}`;
}
function canTryNextGatewayCandidate(info) {
	return info?.phase === "pre-hello" && info.connectRequestSent === false;
}
function createNodeHostGatewayCandidateConnection(params) {
	if (params.candidates.length === 0) throw new Error("node host gateway candidate list cannot be empty");
	let currentCandidateIndex = 0;
	let stopped = false;
	let stopPromise;
	const candidateClients = [];
	let winnerSelected = params.candidates.length === 1;
	let latestManifest;
	let currentClient = createCandidateClient(currentCandidateIndex);
	function createCandidateClient(candidateIndex) {
		const candidate = params.candidates[candidateIndex];
		if (!candidate) throw new Error(`node host gateway candidate ${candidateIndex} is unavailable`);
		const url = formatGatewayCandidateUrl(candidate);
		const cloudflareAccess = params.cloudflareAccessByCandidate?.get(candidate);
		const candidateClient = new GatewayClient({
			...params.clientOptions,
			url,
			tlsFingerprint: candidate.tlsFingerprint,
			...cloudflareAccess ? { edgeAuthHeaders: buildCloudflareAccessHeaders(cloudflareAccess) } : {},
			onEvent: (event) => {
				if (currentCandidateIndex === candidateIndex) params.onEvent(event);
			},
			onHelloOk: (hello) => {
				if (currentCandidateIndex !== candidateIndex) return;
				if (!winnerSelected) {
					winnerSelected = true;
					params.onWinningCandidate(candidate);
				}
				params.onHelloOk(hello, url, candidate.tlsFingerprint, cloudflareAccess);
			},
			onConnectError: (error) => {
				if (currentCandidateIndex === candidateIndex) params.onConnectError(error);
			},
			onReconnectPaused: (info) => {
				if (currentCandidateIndex === candidateIndex) params.onReconnectPaused(info);
			},
			onClose: (code, reason, info) => {
				if (stopped || currentCandidateIndex !== candidateIndex) return;
				params.onClose(code, reason, info);
				const nextCandidateIndex = candidateIndex + 1;
				if (stopped || winnerSelected || nextCandidateIndex >= params.candidates.length || !canTryNextGatewayCandidate(info)) return;
				currentCandidateIndex = nextCandidateIndex;
				candidateClient.stop();
				queueMicrotask(() => {
					if (stopped || currentCandidateIndex !== nextCandidateIndex) return;
					currentClient = createCandidateClient(nextCandidateIndex);
					currentClient.start();
				});
			}
		});
		if (latestManifest) candidateClient.updateNodeManifest(latestManifest);
		candidateClients.push(candidateClient);
		return candidateClient;
	}
	return {
		start() {
			if (!stopped) currentClient.start();
		},
		stop() {
			stopped = true;
			stopPromise ??= Promise.resolve().then(async () => {
				const failures = (await Promise.allSettled(candidateClients.map((client) => client.stopAndWait()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (failures.length === 1) throw failures[0];
				if (failures.length > 1) throw new AggregateError(failures, "node host gateway cleanup failed");
			});
			return stopPromise;
		},
		request(...requestArgs) {
			return currentClient.request(...requestArgs);
		},
		updateNodeManifest(manifest) {
			latestManifest = manifest;
			currentClient.updateNodeManifest(manifest);
		}
	};
}
//#endregion
//#region src/node-host/gateway-platform-identity.ts
function resolveNodeHostGatewayPlatformIdentity(platform) {
	const modelIdentifier = resolveMachineModelIdentifier(platform);
	const identity = resolveGatewayClientPlatformIdentity(platform);
	return identity.deviceFamily ? {
		...identity,
		modelIdentifier
	} : identity;
}
//#endregion
//#region src/node-host/runner.ts
/** CLI runner for node-host stdin/stdout command dispatch. */
function writeStderrLine(message) {
	process.stderr.write(`${message}\n`);
}
const NODE_HOST_EXIT_ON_RECONNECT_PAUSE_CODES = /* @__PURE__ */ new Set([
	ConnectErrorDetailCodes.AUTH_TOKEN_MISSING,
	ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH,
	ConnectErrorDetailCodes.AUTH_BOOTSTRAP_TOKEN_INVALID,
	ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING,
	ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH,
	ConnectErrorDetailCodes.AUTH_IDENTITY_HEADER_REQUIRED,
	ConnectErrorDetailCodes.CLIENT_VERSION_MISMATCH
]);
async function canReuseNodeHostDeviceToken(params) {
	const savedGatewayScope = params.savedGateway ? gatewayOriginScope(formatGatewayCandidateUrl(params.savedGateway)) : void 0;
	return Boolean(savedGatewayScope && params.gatewayCandidates.every((candidate) => gatewayOriginScope(formatGatewayCandidateUrl(candidate)) === savedGatewayScope) && (await loadDeviceAuthTokenReadOnly({
		deviceId: params.deviceId,
		role: "node",
		env: params.env ?? process.env
	}))?.token);
}
async function resolveNodeHostGatewayCredentials(params) {
	const env = params.env ?? process.env;
	if (params.envOnly || await canReuseNodeHostDeviceToken(params)) return resolveExplicitGatewayAuth({
		token: env.OPENCLAW_GATEWAY_TOKEN,
		password: env.OPENCLAW_GATEWAY_PASSWORD
	});
	const configForResolution = (params.config.gateway?.mode === "remote" ? "remote" : "local") === "local" ? buildNodeHostLocalAuthConfig(params.config) : params.config;
	return await resolveGatewayCredentialsWithSecretInputs({
		config: configForResolution,
		env,
		localPrecedence: "env-first",
		remoteTokenPrecedence: "env-first",
		remotePasswordPrecedence: "env-first"
	});
}
function buildNodeHostLocalAuthConfig(config) {
	if (!config.gateway?.remote?.token && !config.gateway?.remote?.password) return config;
	const nextConfig = structuredClone(config);
	copyConfigResolutionFactsExcept(config, nextConfig, ["gateway.remote.token", "gateway.remote.password"]);
	if (nextConfig.gateway?.remote) {
		nextConfig.gateway.remote.token = void 0;
		nextConfig.gateway.remote.password = void 0;
	}
	return nextConfig;
}
/**
* The saved Gateway endpoint when a node credential exists to reconnect without a setup code.
* Node tokens are not bound to an endpoint, so callers must present the reconnect as conditional.
*/
async function loadResumableNodeHostGateway() {
	const gateway = (await loadNodeHostConfig())?.gateway;
	const identity = gateway ? loadDeviceIdentityIfPresent() : null;
	return gateway && identity && await canReuseNodeHostDeviceToken({
		savedGateway: gateway,
		gatewayCandidates: [gateway],
		deviceId: identity.deviceId
	}) ? gateway : void 0;
}
async function runNodeHost(opts) {
	const { initializeSqliteRuntimeCapabilities } = await import("./infra/bun-sqlite-library.js");
	await initializeSqliteRuntimeCapabilities();
	ensureNodeHostStateReady();
	const cfg = getRuntimeConfig();
	const savedConfig = await loadNodeHostConfig();
	const plannedGateway = {
		host: opts.gatewayHost,
		port: opts.gatewayPort,
		tls: opts.gatewayTls ?? cfg.gateway?.tls?.enabled ?? false,
		tlsFingerprint: opts.gatewayTlsFingerprint,
		contextPath: opts.gatewayContextPath,
		cloudflareAccess: opts.gatewayCloudflareAccess
	};
	let gatewayBootstrapToken = opts.gatewayBootstrapToken;
	let reuseDeviceTokenOnly = false;
	if (gatewayBootstrapToken && opts.gatewayBootstrapExpiresAtMs !== void 0 && opts.gatewayBootstrapExpiresAtMs <= Date.now()) {
		const identity = loadDeviceIdentityIfPresent();
		if (opts.preferGatewayBootstrapToken || opts.gatewayAuthFromEnv || !identity || !await canReuseNodeHostDeviceToken({
			savedGateway: savedConfig?.gateway,
			gatewayCandidates: opts.gatewayCandidates?.length ? opts.gatewayCandidates : [plannedGateway],
			deviceId: identity.deviceId
		})) throw new Error("Pairing setup code has expired.");
		gatewayBootstrapToken = void 0;
		reuseDeviceTokenOnly = true;
	}
	const fallbackDisplayName = await getMachineDisplayName();
	const config = await configureNodeHost({
		nodeId: opts.nodeId,
		displayName: opts.displayName,
		fallbackDisplayName,
		gateway: plannedGateway,
		installedAppsSharing: opts.installedAppsSharing,
		commands: opts.commands,
		allCommands: opts.allCommands
	});
	const nodeId = config.nodeId;
	const displayName = config.displayName ?? fallbackDisplayName;
	const gateway = config.gateway ?? plannedGateway;
	const gatewayCandidates = opts.gatewayCandidates?.length ? opts.gatewayCandidates.map((candidate, index) => index === 0 && gateway.cloudflareAccess && !candidate.cloudflareAccess ? {
		...candidate,
		cloudflareAccess: gateway.cloudflareAccess
	} : candidate) : [gateway];
	if (gatewayCandidates.find((candidate) => candidate.cloudflareAccess && candidate.tls !== true)) throw new Error("Cloudflare Access credentials require a TLS Gateway connection");
	const resolvedCloudflareAccess = await Promise.all(gatewayCandidates.map(async (candidate) => await resolveNodeHostCloudflareAccess({
		value: candidate.cloudflareAccess,
		config: cfg,
		env: process.env
	})));
	const cloudflareAccessByCandidate = /* @__PURE__ */ new Map();
	gatewayCandidates.forEach((candidate, index) => {
		const credentials = resolvedCloudflareAccess[index];
		if (credentials) cloudflareAccessByCandidate.set(candidate, credentials);
	});
	const preparedRuntime = await prepareNodeHostRuntime({
		config: cfg,
		env: process.env,
		enableAgentRuns: true,
		enableWorkerRuns: true,
		forceWorkerRuns: opts.forceWorkerRuns,
		ephemeral: opts.ephemeral,
		installedAppsSharingEnabled: config.installedAppsSharing,
		desktopSharingEnabled: opts.desktopSharingEnabled,
		commands: config.commands
	});
	logInfo(`node-host: advertised commands: ${preparedRuntime.manifest.commands.join(", ")}`);
	const deviceIdentity = loadOrCreateDeviceIdentity();
	const { token, password } = gatewayBootstrapToken || reuseDeviceTokenOnly ? {} : await resolveNodeHostGatewayCredentials({
		config: cfg,
		envOnly: opts.gatewayAuthFromEnv,
		savedGateway: savedConfig?.gateway,
		gatewayCandidates,
		deviceId: deviceIdentity.deviceId,
		env: process.env
	});
	let consecutivePermanentGatewayRejections = 0;
	const autoUpdateAbort = new AbortController();
	let autoUpdateStart;
	let autoUpdater;
	const persistWinningGateway = (winningGateway) => {
		configureNodeHost({
			nodeId,
			displayName,
			fallbackDisplayName,
			gateway: winningGateway,
			installedAppsSharing: config.installedAppsSharing
		}).catch((error) => {
			writeStderrLine(`node host gateway endpoint persistence failed: ${String(error)}`);
		});
	};
	const client = createNodeHostGatewayCandidateConnection({
		candidates: gatewayCandidates,
		cloudflareAccessByCandidate,
		clientOptions: {
			token: token || void 0,
			bootstrapToken: gatewayBootstrapToken,
			preferBootstrapToken: opts.preferGatewayBootstrapToken,
			password: password || void 0,
			instanceId: nodeId,
			clientName: GATEWAY_CLIENT_NAMES.NODE_HOST,
			clientDisplayName: displayName,
			clientVersion: VERSION,
			...resolveNodeHostGatewayPlatformIdentity(process.platform),
			mode: GATEWAY_CLIENT_MODES.NODE,
			role: "node",
			scopes: [],
			caps: preparedRuntime.manifest.caps,
			commands: preparedRuntime.manifest.commands,
			computerUse: preparedRuntime.manifest.computerUse,
			pathEnv: preparedRuntime.manifest.pathEnv,
			permissions: void 0,
			deviceIdentity
		},
		onEvent: (evt) => {
			if (evt.event === "node.pair.resolved") {
				if (isRecord(evt.payload) && evt.payload.nodeId === deviceIdentity.deviceId && evt.payload.decision === "approved") activeRuntime.refreshRunnerInventory();
				return;
			}
			if (evt.event === "node.invoke.cancel") {
				const payload = coerceNodeInvokeCancelPayload(evt.payload);
				if (payload) activeRuntime.cancel(payload.invokeId);
				return;
			}
			if (evt.event === "node.invoke.input") {
				const payload = coerceNodeInvokeInputPayload(evt.payload);
				if (payload) activeRuntime.handleInput(payload.invokeId, payload.seq, payload.payloadJSON);
				return;
			}
			if (evt.event !== "node.invoke.request") return;
			const payload = coerceNodeInvokePayload(evt.payload);
			if (payload) activeRuntime.invoke(payload);
		},
		onHelloOk: (hello, url, tlsFingerprint, cloudflareAccess) => {
			consecutivePermanentGatewayRejections = 0;
			writeStderrLine(`node host gateway connected: ${url}`);
			if (opts.stopAfterFirstConnect) {
				finish(0);
				return;
			}
			activeRuntime.connect({
				url,
				protocol: hello.protocol,
				capabilities: hello.features?.capabilities ?? [],
				...tlsFingerprint ? { tlsFingerprint } : {},
				...cloudflareAccess ? { cloudflareAccess } : {}
			});
			announceLauncherReady(url, tlsFingerprint).catch((error) => {
				writeStderrLine(`node host update supervisor readiness failed: ${String(error)}`);
			});
		},
		onConnectError: (error) => {
			writeStderrLine(`node host gateway connect failed: ${error.message}`);
			const rejection = error instanceof GatewayClientRequestError && isRecord(error.details) ? error.details : void 0;
			if (rejection?.reason !== "websocket-upgrade-rejected" || rejection.httpStatus !== 403 || rejection.gatewayErrorType !== "proxy_attribution_required") {
				consecutivePermanentGatewayRejections = 0;
				return;
			}
			if (++consecutivePermanentGatewayRejections < 3) return;
			const remediation = typeof rejection.gatewayErrorMessage === "string" ? rejection.gatewayErrorMessage : error.message;
			writeStderrLine(`node host gateway permanently rejected connection (${rejection.gatewayErrorType}): ${remediation}; exiting`);
			finish(1);
		},
		onReconnectPaused: (info) => {
			const shouldExit = info.detailCode !== null && NODE_HOST_EXIT_ON_RECONNECT_PAUSE_CODES.has(info.detailCode);
			const detail = info.detailCode ? ` detail=${info.detailCode}` : "";
			const reason = info.reason.trim() || "no close reason";
			const action = shouldExit ? "exiting for supervisor restart" : "waiting for operator action";
			writeStderrLine(`node host gateway reconnect paused after close (${info.code}): ${reason}${detail}; ${action}`);
			if (shouldExit) finish(1).finally(() => requestExitAfterOneShotOutput(void 0, 1));
		},
		onClose: (code, reason) => {
			activeRuntime.disconnect();
			writeStderrLine(`node host gateway closed (${code}): ${reason}`);
		},
		onWinningCandidate: persistWinningGateway
	});
	const activeRuntime = startNodeHostConnection({
		prepared: preparedRuntime,
		client,
		writeStderrLine,
		onManifestChanged: (manifest) => client.updateNodeManifest(manifest)
	});
	async function announceLauncherReady(url, tlsFingerprint) {
		if (!isNodeHostLauncherChild() || opts.ephemeral || autoUpdateAbort.signal.aborted) return;
		const endpoint = new URL(url);
		const args = [
			"node",
			"run",
			"--host",
			endpoint.hostname.replace(/^\[|\]$/g, ""),
			"--port",
			endpoint.port || (endpoint.protocol === "wss:" ? "443" : "80"),
			"--node-id",
			nodeId,
			"--display-name",
			displayName,
			endpoint.protocol === "wss:" ? "--tls" : "--no-tls",
			config.installedAppsSharing ? "--share-installed-apps" : "--no-share-installed-apps"
		];
		if (endpoint.pathname !== "/") args.push("--context-path", endpoint.pathname);
		if (tlsFingerprint) args.push("--tls-fingerprint", tlsFingerprint);
		if (config.commands) args.push("--commands", config.commands.join(","));
		if (opts.forceWorkerRuns) args.push("--session-host");
		if (opts.desktopSharingEnabled !== void 0) args.push(opts.desktopSharingEnabled ? "--desktop-sharing" : "--no-desktop-sharing");
		if (opts.gatewayAuthFromEnv) args.push("--auth-from-env");
		if (opts.parentStdin) args.push("--parent-stdin");
		await setNodeHostLauncherRestartArguments(args);
		if (autoUpdateAbort.signal.aborted) return;
		await notifyNodeHostLauncherReady(VERSION);
		autoUpdateStart ??= import("./auto-update-VJp8ah6X.mjs").then(({ startNodeHostAutoUpdate }) => {
			if (!autoUpdateAbort.signal.aborted) autoUpdater = startNodeHostAutoUpdate({
				runtime: activeRuntime,
				signal: autoUpdateAbort.signal,
				log: writeStderrLine,
				onRestartAccepted: () => {
					finish(0);
				}
			});
		});
		await autoUpdateStart;
	}
	let stopping = false;
	const { promise: stopped, resolve: resolveStopped } = createDeferredCore();
	const lifetimeInterval = setInterval(() => {}, 1e6);
	let stopWatchingParent = () => {};
	const removeSignalHandlers = () => {
		stopWatchingParent();
		process.off("SIGINT", onSigint);
		process.off("SIGTERM", onSigterm);
	};
	const stopClientAndMcp = async () => {
		stopping = true;
		try {
			autoUpdateAbort.abort();
			await autoUpdateStart?.catch(() => void 0);
			await autoUpdater?.stop();
			const failures = [];
			try {
				await client.stop();
			} catch (error) {
				failures.push(error);
			}
			try {
				await activeRuntime.close();
			} catch (error) {
				failures.push(error);
			}
			if (failures.length === 1) throw failures[0];
			if (failures.length > 1) throw new AggregateError(failures, "node host shutdown cleanup failed");
		} finally {
			clearInterval(lifetimeInterval);
		}
	};
	const finish = async (exitCode) => {
		if (stopping) return;
		stopping = true;
		let finalExitCode = exitCode;
		try {
			await stopClientAndMcp();
		} catch (error) {
			finalExitCode = 1;
			writeStderrLine(`node host shutdown failed: ${formatErrorMessage(error)}`);
		} finally {
			removeSignalHandlers();
			process.exitCode = finalExitCode;
			resolveStopped();
		}
	};
	const onSigint = AsyncLocalStorage.bind(() => void finish(130));
	const onSigterm = AsyncLocalStorage.bind(() => void finish(143));
	process.on("SIGINT", onSigint);
	process.on("SIGTERM", onSigterm);
	if (opts.parentStdin && !isNodeHostLauncherChild()) stopWatchingParent = watchNodeHostParentStdin(onSigterm);
	const readinessPromise = startGatewayClientWhenEventLoopReady(client);
	try {
		if (!(await readinessPromise).ready) throw new Error("node host gateway event loop readiness timeout");
	} catch (error) {
		if (stopping) {
			await stopped;
			return;
		}
		removeSignalHandlers();
		await stopClientAndMcp();
		throw error;
	}
	await stopped;
}
//#endregion
export { runNodeHost as n, formatGatewayCandidateUrl as r, loadResumableNodeHostGateway as t };
