import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as isNodeHostLauncherChild, o as setNodeHostLauncherRestartArguments, r as notifyNodeHostLauncherReady, s as watchNodeHostParentStdin } from "./launcher-client-DNBTHwUk.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as VERSION } from "./version-jg_14gWz.mjs";
import { i as copyConfigResolutionFactsExcept } from "./resolution-facts-D_pto3MV.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { t as resolveMachineModelIdentifier } from "./machine-model-C0iHjDpF.mjs";
import { r as resolveExplicitGatewayAuth } from "./credentials-BPKYf2nk.mjs";
import { t as ConnectErrorDetailCodes } from "./connect-error-details-DhaB57zU.mjs";
import { r as logInfo } from "./logger-DHVmYOKs.mjs";
import { t as GatewayClientRequestError } from "./request-error-CnPCYq3A.mjs";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-DmuNrGrj.mjs";
import { t as throwNodeHostCleanupErrors } from "./cleanup-errors-eP-PTE_D.mjs";
import { n as loadDeviceIdentityIfPresent, r as loadOrCreateDeviceIdentity } from "./device-identity-8y_iX6az.mjs";
import { t as startGatewayClientWhenEventLoopReady } from "./readiness-DhwKMLkG.mjs";
import { n as resolveGatewayCredentialsWithSecretInputs } from "./credentials-secret-inputs-B1O-0cQW.mjs";
import "./client-CkNBSciY.mjs";
import { t as resolveGatewayClientPlatformIdentity } from "./gateway-client-platform-h2QbDjYZ.mjs";
import { t as getMachineDisplayName } from "./machine-name-e279gKlh.mjs";
import { l as resolveNodeHostCloudflareAccess } from "./node-worker-prepared-workspace-publication-BVABEP6T.mjs";
import { a as loadNodeHostConfig, i as configureNodeHost } from "./config-JeTOF5Uw.mjs";
import { n as prepareNodeHostRuntime, r as startNodeHostConnection, t as ensureNodeHostStateReady } from "./startup-state-readiness-De4dsAOt.mjs";
import { a as coerceNodeInvokeInputPayload, i as coerceNodeInvokeCancelPayload, o as coerceNodeInvokePayload } from "./invoke-agent-cli-claude-params-D_miSykQ.mjs";
import { n as createNodeHostGatewayCandidateConnection, t as canReuseNodeHostDeviceToken } from "./gateway-auth-DdSopJKp.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
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
async function resolveNodeHostGatewayCredentials(params) {
	const env = process.env;
	const canReuseDeviceToken = await canReuseNodeHostDeviceToken(params);
	if (params.envOnly) {
		const auth = resolveExplicitGatewayAuth({
			token: env.OPENCLAW_GATEWAY_TOKEN,
			password: env.OPENCLAW_GATEWAY_PASSWORD
		});
		if (canReuseDeviceToken && (auth.token || auth.password)) writeStderrLine(`node host: --auth-from-env selects ${[...auth.token ? ["OPENCLAW_GATEWAY_TOKEN"] : [], ...auth.password ? ["OPENCLAW_GATEWAY_PASSWORD"] : []].join(" and ")} instead of the paired device token`);
		return auth;
	}
	if (canReuseDeviceToken) return {};
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
	const cfg = await captureRuntimeConfigAsyncReader()();
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
		deviceId: deviceIdentity.deviceId
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
		autoUpdateStart ??= import("./auto-update-BBfzXoGP.mjs").then(({ startNodeHostAutoUpdate }) => {
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
			for (const close of [() => client.stop(), () => activeRuntime.close()]) try {
				await close();
			} catch (error) {
				failures.push(error);
			}
			throwNodeHostCleanupErrors(failures, "node host shutdown cleanup failed");
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
export { runNodeHost as n, loadResumableNodeHostGateway as t };
