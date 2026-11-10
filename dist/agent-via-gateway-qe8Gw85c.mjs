import { l as normalizeOptionalString, m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-CkhMiRw8.mjs";
import { n as captureAsyncWorkTracker, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { s as readFileDescriptorBounded } from "./boundary-file-read-CCth2Hwg.mjs";
import { i as createAbortError } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import { r as getBoundLegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DBY7FuQ8.mjs";
import { i as routeLogsToStderr } from "./console-CML7QnOp.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as buildAgentMainSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { l as resolveAgentIdFromSessionKey, m as scopeLegacySessionKeyToAgent, o as classifySessionKeyShape, s as isUnscopedSessionKeySentinel } from "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { C as tryResolveAgentOperationAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds, l as tryResolveSoleAgentId } from "./agent-roster-gkYP38su.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-BgcoFakQ.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import { a as READ_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./message-channel-normalize-CsnAJK7x.mjs";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BXFCjLO0.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-y64LHoys.mjs";
import { n as isGatewaySecretRefUnavailableError } from "./credentials-BPKYf2nk.mjs";
import { t as GatewayProtocolRequestError } from "./protocol-request-BMUN1re6.mjs";
import { s as isGatewayTransportError } from "./transport-error-VfHcwKpH.mjs";
import { c as recordCliGatewayRunFailure, s as readCliGatewayRunFailure } from "./failure-output-CpIKhMiV.mjs";
import { d as isGatewayExplicitAuthRequiredError, m as assertGatewayCliMessageContext, p as randomIdempotencyKey, r as callGateway, u as isGatewayCredentialsRequiredError } from "./call-b1jzw5fz.mjs";
import { n as readGatewayDispatchConfigWithShellEnvFallback, t as readGatewayDispatchConfig } from "./gateway-dispatch-config-Cbux7zcH.mjs";
import { n as readAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-BOQC0T2X.mjs";
import { r as withProgress } from "./progress-BIOeyA3T.mjs";
import { t as measureAgentStartup } from "./startup-timing-D4XTWDd_.mjs";
import { n as createEmbeddedStateSignalBridge } from "./embedded-state-lock-CLsuR7uN.mjs";
import fs from "node:fs/promises";
import { TextDecoder } from "node:util";
//#region src/plugins/one-shot-diagnostics.ts
const log = createSubsystemLogger("plugins");
const ONE_SHOT_DIAGNOSTICS_SERVICE_IDS = /* @__PURE__ */ new Set(["diagnostics-otel"]);
const ONE_SHOT_DIAGNOSTICS_DRAIN_TIMEOUT_MS = 5e3;
const ONE_SHOT_DIAGNOSTICS_FLUSH_TIMEOUT_MS = 1e4;
function suppressOtelStdoutLogSink(config) {
	const diagnostics = config.diagnostics;
	const otel = diagnostics?.otel;
	if (otel?.logs !== true || otel.logsExporter !== "stdout" && otel.logsExporter !== "both") return config;
	return {
		...config,
		diagnostics: {
			...diagnostics,
			otel: {
				...otel,
				logs: otel.logsExporter === "both",
				logsExporter: "otlp"
			}
		}
	};
}
function isOtelExportConfigured(config) {
	const diagnostics = config.diagnostics;
	return Boolean(diagnostics && diagnostics.enabled !== false && diagnostics.otel?.enabled);
}
/** CLI agent runs own exporter services outside the Gateway; stop drains and flushes them. */
async function startOneShotDiagnosticsExporters(params) {
	const config = params.suppressStdoutDiagnosticLogs === true ? suppressOtelStdoutLogSink(params.config) : params.config;
	if (!isOtelExportConfigured(config)) return null;
	const host = getBoundLegacyPluginSdkResourceHost();
	if (!host) throw new Error("One-shot diagnostics requires a bound SDK host scheduler");
	const scheduler = host.scheduler;
	const [{ acquirePluginRegistryForInspection }, { startPluginServices }] = await Promise.all([import("./plugins/loader.js"), import("./services-BRvQq3Wh.mjs")]);
	const acquired = await acquirePluginRegistryForInspection({
		config,
		onlyPluginIds: [...ONE_SHOT_DIAGNOSTICS_SERVICE_IDS],
		preferBuiltPluginArtifacts: true
	});
	const work = new AsyncWorkScope();
	let servicesHandle;
	let shutdown;
	const reportShutdownFailure = (error) => {
		for (const failure of error instanceof AggregateError ? error.errors : [error]) log.warn(`one-shot diagnostics shutdown failed: ${String(failure)}`);
	};
	const release = async () => {
		await work.drain();
		await acquired.release();
	};
	const stop = () => {
		const trackCaller = captureAsyncWorkTracker();
		if (!shutdown) {
			const stopping = work.track(async () => {
				try {
					const result = await servicesHandle?.stop();
					for (const failure of result?.errors ?? []) reportShutdownFailure(failure);
				} catch (error) {
					reportShutdownFailure(error);
				}
			});
			shutdown = {
				stopping,
				released: stopping.then(release, release).catch(reportShutdownFailure)
			};
		}
		const { stopping, released } = shutdown;
		trackCaller(() => released).catch(reportShutdownFailure);
		return stopping;
	};
	try {
		const services = acquired.registry.services.filter((entry) => ONE_SHOT_DIAGNOSTICS_SERVICE_IDS.has(entry.id));
		if (services.length === 0) {
			log.warn("diagnostics.otel is enabled but the diagnostics-otel plugin is not installed or not enabled; this run exports no telemetry.");
			await release().catch(reportShutdownFailure);
			return null;
		}
		servicesHandle = await work.track(() => startPluginServices({
			scheduler,
			registry: {
				...acquired.registry,
				services
			},
			config,
			oneShotStopTimeouts: {
				eventDrainMs: ONE_SHOT_DIAGNOSTICS_DRAIN_TIMEOUT_MS,
				serviceStopMs: ONE_SHOT_DIAGNOSTICS_FLUSH_TIMEOUT_MS
			},
			onHandle: (handle) => {
				servicesHandle = handle;
			}
		}));
		return { stop };
	} catch (error) {
		await stop();
		throw error;
	}
}
//#endregion
//#region src/commands/agent-gateway-identity.ts
function resolveAgentGatewayIdentity(needsAdmin, remoteGateway) {
	return {
		clientName: needsAdmin ? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT : GATEWAY_CLIENT_NAMES.CLI,
		mode: needsAdmin ? GATEWAY_CLIENT_MODES.BACKEND : GATEWAY_CLIENT_MODES.CLI,
		...needsAdmin || !remoteGateway ? { scopes: [ADMIN_SCOPE] } : {}
	};
}
//#endregion
//#region src/commands/agent-via-gateway.ts
const GATEWAY_TRANSIENT_CONNECT_RETRY_DELAYS_MS = [
	1e3,
	2e3,
	5e3,
	1e4,
	15e3
];
function usesImplicitRemoteCompatibilityDefault(roster) {
	return !roster.selectionRequired && (roster.ownership === "legacy" || !roster.ownership && roster.agentIds.length > 1);
}
function resolveImplicitCliAgentId(cfg, remote) {
	const selected = remote ? remote.selectionRequired ? void 0 : remote.defaultId : tryResolveAgentOperationAgentId(cfg);
	if (selected) return selected;
	const agentIds = remote?.agentIds ?? listAgentIds(cfg);
	throw new AgentSelectionRequiredError(agentIds, {
		surface: "agent turn",
		hint: `Pass --agent <id> to select one of: ${agentIds.join(", ")}.`
	});
}
const GATEWAY_ABORT_RETRY_DELAYS_MS = [
	50,
	150,
	300,
	600
];
const GATEWAY_ABORT_REQUEST_TIMEOUT_MS = 2e3;
const AGENT_CLI_SIGNAL_EXIT_CODES = {
	SIGINT: 130,
	SIGTERM: 143
};
const MESSAGE_FILE_DECODER = new TextDecoder("utf-8", { fatal: true });
/**
* Run the embedded agent command with OTel diagnostics export for this
* one-shot process: the Gateway only starts diagnostics exporters in its own
* process, so embedded runs start one here and flush it before the CLI exits
* (including signal exits, which happen after this returns).
*/
async function runEmbeddedAgentCommand(opts, runtime, deps) {
	const { agentCommand } = await measureAgentStartup("command-import", () => import("./agent--AUm-WF5.mjs"));
	const config = await loadRuntimeConfig();
	let diagnostics = null;
	try {
		diagnostics = await startOneShotDiagnosticsExporters({
			config,
			suppressStdoutDiagnosticLogs: opts.json === true
		});
	} catch (err) {
		runtime.error?.(`diagnostics exporter startup failed for embedded run: ${String(err)}`);
	}
	let stopLocalAuditWriter;
	if (isExecutionIdentityCollectionEnabled(config)) try {
		const { startAgentLocalAuditWriter } = await import("./agent-local-audit-BO6ieDsj.mjs");
		stopLocalAuditWriter = startAgentLocalAuditWriter(config);
	} catch {}
	try {
		return await agentCommand(opts, runtime, deps);
	} finally {
		await Promise.all([diagnostics?.stop(), stopLocalAuditWriter?.().catch(() => void 0)]);
	}
}
async function loadRuntimeConfig() {
	const { captureRuntimeConfigAsyncReader } = await import("./io-Cwio_qp9.mjs");
	return await captureRuntimeConfigAsyncReader()();
}
function usesRemoteGateway(cfg) {
	return Boolean(cfg.gateway?.mode === "remote" || normalizeOptionalString(process.env.OPENCLAW_GATEWAY_URL));
}
async function loadRemoteGatewayRoster(cfg) {
	const result = await callGateway({
		method: "agents.list",
		params: {},
		config: cfg,
		clientName: GATEWAY_CLIENT_NAMES.CLI,
		mode: GATEWAY_CLIENT_MODES.CLI,
		scopes: [READ_SCOPE]
	});
	return {
		agentIds: result.agents.filter((entry) => entry.kind !== "system").map((entry) => normalizeAgentId(entry.id)),
		defaultId: normalizeAgentId(result.defaultId),
		ownership: result.ownership,
		selectionRequired: result.selectionRequired ?? result.ownership === "explicit",
		mainKey: result.mainKey,
		scope: result.scope
	};
}
async function loadRemoteGatewayRosterWithShellEnvFallback(cfg) {
	try {
		return {
			config: cfg,
			roster: await loadRemoteGatewayRoster(cfg)
		};
	} catch (error) {
		if (!shouldRetryGatewayDispatchWithShellEnvFallback(error)) throw error;
		const fallbackConfig = await readGatewayDispatchConfigWithShellEnvFallback();
		return {
			config: fallbackConfig,
			roster: await loadRemoteGatewayRoster(fallbackConfig)
		};
	}
}
function formatActiveGatewayLocalRefusal(identity) {
	return `A Gateway is running for this state directory (pid ${identity.pid}, port ${identity.port}). Run without --local to use it, or stop the Gateway first (${formatCliCommand("openclaw gateway stop")}).`;
}
async function acquireEmbeddedAgentStateLock(options, signal) {
	const { acquireEmbeddedStateLock } = await import("./embedded-state-lock-y-OKgBZW.mjs");
	return await acquireEmbeddedStateLock({
		options,
		signal,
		formatActiveGatewayRefusal: formatActiveGatewayLocalRefusal
	});
}
function protectJsonStdout(opts) {
	if (opts.json === true) routeLogsToStderr();
}
function missingAgentMessageError() {
	return /* @__PURE__ */ new Error(`Missing message. Use ${formatCliCommand("openclaw agent --message \"...\" --agent <id>")} or ${formatCliCommand("openclaw agent --message-file <path> --agent <id>")}.`);
}
function formatMessageFileReadFailure(messageFile, err) {
	const code = typeof err?.code === "string" ? err.code : "";
	if (code === "ENOENT") return `Message file not found: ${messageFile}`;
	if (code === "EISDIR") return `Message file is a directory: ${messageFile}`;
	return `Unable to read message file ${messageFile}: ${err instanceof Error ? err.message : String(err)}`;
}
const AGENT_MESSAGE_FILE_MAX_BYTES = 4194304;
async function readAgentMessageFile(messageFile) {
	let handle;
	let buffer;
	try {
		handle = await fs.open(messageFile, "r");
		const stat = await handle.stat();
		if (stat.isDirectory()) throw Object.assign(/* @__PURE__ */ new Error("Message file is a directory"), { code: "EISDIR" });
		if (stat.isFile() && stat.size > AGENT_MESSAGE_FILE_MAX_BYTES) throw new Error(`File exceeds ${AGENT_MESSAGE_FILE_MAX_BYTES} bytes: ${messageFile}`);
		buffer = await readFileDescriptorBounded(handle.fd, AGENT_MESSAGE_FILE_MAX_BYTES);
	} catch (err) {
		throw new Error(formatMessageFileReadFailure(messageFile, err), { cause: err });
	} finally {
		await handle?.close().catch(() => void 0);
	}
	try {
		return MESSAGE_FILE_DECODER.decode(buffer).replace(/^\uFEFF/, "");
	} catch {
		throw new Error(`Message file must be valid UTF-8: ${messageFile}`);
	}
}
async function resolveAgentMessageOpts(opts) {
	const { messageFile: rawMessageFile, ...rest } = opts;
	const messageFile = readNonBlankString(rawMessageFile);
	if (opts.message !== void 0 && messageFile) throw new Error("Use either --message or --message-file, not both.");
	if (rawMessageFile !== void 0 && !messageFile) throw new Error("--message-file must not be empty.");
	const message = messageFile ? await readAgentMessageFile(messageFile) : opts.message ?? "";
	if (!message.trim()) throw messageFile ? /* @__PURE__ */ new Error(`Message file is empty: ${messageFile}`) : missingAgentMessageError();
	return {
		...rest,
		message
	};
}
function parseTimeoutSeconds(opts) {
	const raw = opts.timeout !== void 0 ? parseStrictNonNegativeInteger(opts.timeout) : opts.cfg.agents?.defaults?.timeoutSeconds ?? 600;
	if (raw === void 0) throw new Error(`Invalid --timeout. Use seconds as a non-negative integer, for example --timeout 600. Use --timeout 0 to disable the timeout.`);
	return raw;
}
async function formatPayloadForLog(payload) {
	const { resolveSendableOutboundReplyParts } = await import("./plugin-sdk/reply-payload.js");
	const { formatOutboundPayloadLog } = await import("./payloads-8gN16gK6.mjs");
	return formatOutboundPayloadLog(resolveSendableOutboundReplyParts({
		text: payload.text,
		mediaUrls: payload.mediaUrls,
		mediaUrl: typeof payload.mediaUrl === "string" ? payload.mediaUrl : void 0
	})).trimEnd();
}
function isCompactControlCommand(message) {
	return /^\/compact(?:\s|:|$)/iu.test(message.trim());
}
function isSessionResetCommand(message) {
	return /^\/(?:new|reset)(?:\s|$)/i.test(message.trim());
}
function shouldRetryGatewayDispatchWithShellEnvFallback(err) {
	return isGatewayCredentialsRequiredError(err) || isGatewayExplicitAuthRequiredError(err) || isGatewaySecretRefUnavailableError(err);
}
function formatGatewayAgentTransportLossHint(err) {
	if (!isGatewayTransportError(err)) return;
	const failureHint = err.kind === "timeout" ? "timed out" : "connection closed";
	const acceptedRun = readCliGatewayRunFailure(err);
	return `Gateway agent call ${failureHint}; the Gateway may still be running this turn${acceptedRun ? ` (accepted run ${acceptedRun.runId}` + (failureHint === "timed out" ? "; use --timeout <seconds> to extend the CLI wait" : "") + ")" : ""}. Check \`openclaw gateway status\` and the session transcript before retrying or rerunning with --local, so the turn does not execute twice.`;
}
function isTransientGatewayAgentConnectClose(err) {
	if (!isGatewayTransportError(err) || err.kind !== "closed") return false;
	const reason = normalizeOptionalString(err.reason);
	return err.code === 1e3 && (!reason || reason === "no close reason");
}
function validateExplicitSessionKeyForDispatch(opts) {
	const sessionKey = opts.sessionKey?.trim();
	if (!sessionKey) return;
	if (classifySessionKeyShape(sessionKey) === "malformed_agent") throw new Error(`Invalid --session-key "${sessionKey}". Agent-prefixed session keys must use agent:<agent-id>:<session-key>.`);
	const agentIdRaw = opts.agent?.trim() || void 0;
	if (!agentIdRaw || classifySessionKeyShape(sessionKey) !== "agent") return;
	const agentId = normalizeAgentId(agentIdRaw);
	const sessionAgentId = resolveAgentIdFromSessionKey(sessionKey);
	if (sessionAgentId !== agentId) throw new Error(`Agent id "${agentIdRaw}" does not match session key agent "${sessionAgentId}".`);
}
async function normalizeSessionKeyOptsForDispatch(opts) {
	let normalizedOpts = opts;
	const rawSessionKey = opts.sessionKey?.trim();
	const rawTo = opts.to?.trim();
	if (!rawSessionKey && !opts.sessionId?.trim() && classifySessionKeyShape(rawTo) === "agent") return normalizeSessionKeyOptsForDispatch({
		...opts,
		to: void 0,
		sessionKey: rawTo
	});
	const isLegacySessionKey = rawSessionKey && classifySessionKeyShape(rawSessionKey) === "legacy_or_alias";
	const explicitAgentIdRaw = opts.agent?.trim();
	let agentIdRaw = explicitAgentIdRaw;
	const hasExplicitSessionTarget = Boolean(opts.sessionId?.trim()) || [rawSessionKey, rawTo].some((value) => classifySessionKeyShape(value) === "agent");
	let selectionCfg;
	let remoteGatewayRoster;
	if (opts.local !== true) {
		const cfg = readGatewayDispatchConfig();
		normalizedOpts = {
			...normalizedOpts,
			gatewayDispatchConfig: cfg
		};
		selectionCfg = cfg;
		if (rawSessionKey && usesRemoteGateway(cfg) && classifySessionKeyShape(rawSessionKey) !== "agent") return normalizedOpts;
	}
	if (!agentIdRaw && !hasExplicitSessionTarget && !(opts.local === true && rawTo)) {
		let cfg = opts.local === true ? await loadRuntimeConfig() : selectionCfg ?? readGatewayDispatchConfig();
		if (opts.local !== true && usesRemoteGateway(cfg)) {
			const loaded = await loadRemoteGatewayRosterWithShellEnvFallback(cfg);
			cfg = loaded.config;
			remoteGatewayRoster = loaded.roster;
			normalizedOpts = {
				...normalizedOpts,
				gatewayDispatchConfig: cfg,
				remoteGatewayRoster
			};
		}
		selectionCfg = cfg;
		const effectiveOwnerSessionKey = rawSessionKey ?? (cfg.session?.scope === "global" ? "global" : void 0);
		const persistedKeyOwner = remoteGatewayRoster ? { kind: "none" } : resolvePersistedSessionStoreOwnerForKey(cfg, effectiveOwnerSessionKey);
		if (persistedKeyOwner.kind === "retired") throw new AgentSelectionRequiredError(listAgentIds(cfg), {
			surface: `session key "${rawSessionKey}"`,
			hint: `The shared fixed-store row belongs to retired agent "${persistedKeyOwner.agentId}".`
		});
		if (persistedKeyOwner.kind === "configured" && rawSessionKey === void 0 && effectiveOwnerSessionKey === "global") normalizedOpts = {
			...normalizedOpts,
			sessionKey: "global"
		};
		const selectedAgentId = persistedKeyOwner.kind === "configured" ? persistedKeyOwner.agentId : resolveImplicitCliAgentId(cfg, remoteGatewayRoster);
		const implicitSoleAgent = remoteGatewayRoster ? remoteGatewayRoster.ownership === "sole" || !remoteGatewayRoster.ownership && remoteGatewayRoster.agentIds.length === 1 : tryResolveSoleAgentId(cfg) === selectedAgentId;
		const implicitCompatibilityDefault = remoteGatewayRoster ? usesImplicitRemoteCompatibilityDefault(remoteGatewayRoster) : !implicitSoleAgent;
		const implicitGlobalSession = !explicitAgentIdRaw && rawSessionKey === void 0 && (remoteGatewayRoster ? remoteGatewayRoster.scope === "global" : (opts.local === true || !usesRemoteGateway(cfg)) && cfg.session?.scope === "global");
		const unscopedSession = isUnscopedSessionKeySentinel(rawSessionKey) || implicitGlobalSession;
		agentIdRaw = (implicitSoleAgent || implicitCompatibilityDefault) && unscopedSession ? void 0 : selectedAgentId;
		if (!remoteGatewayRoster && implicitCompatibilityDefault) normalizedOpts = {
			...normalizedOpts,
			localGatewayCompatibilityAgentId: selectedAgentId
		};
		if (agentIdRaw && implicitCompatibilityDefault && !rawSessionKey && !rawTo) normalizedOpts = {
			...normalizedOpts,
			sessionKey: buildAgentMainSessionKey({
				agentId: selectedAgentId,
				mainKey: remoteGatewayRoster?.mainKey ?? cfg.session?.mainKey
			})
		};
		else if (agentIdRaw && !implicitCompatibilityDefault) normalizedOpts = {
			...normalizedOpts,
			agent: selectedAgentId
		};
	}
	const cfg = isLegacySessionKey && (agentIdRaw || !isUnscopedSessionKeySentinel(rawSessionKey)) ? normalizedOpts.local === true ? await loadRuntimeConfig() : selectionCfg ?? readGatewayDispatchConfig() : void 0;
	if ((cfg && rawSessionKey && isLegacySessionKey && !isUnscopedSessionKeySentinel(rawSessionKey) ? resolvePersistedSessionStoreOwnerForKey(cfg, rawSessionKey) : void 0)?.kind === "configured" || isUnscopedSessionKeySentinel(rawSessionKey)) return normalizedOpts;
	const sessionKey = scopeLegacySessionKeyToAgent({
		agentId: agentIdRaw,
		sessionKey: normalizedOpts.sessionKey,
		mainKey: remoteGatewayRoster?.mainKey ?? cfg?.session?.mainKey
	});
	if (sessionKey === normalizedOpts.sessionKey) return normalizedOpts;
	return {
		...normalizedOpts,
		sessionKey
	};
}
function isAbortError(err) {
	return err instanceof Error && err.name === "AbortError";
}
function readAcceptedRunContext(payload) {
	const accepted = asOptionalRecord(payload);
	if (accepted?.status !== "accepted") return;
	return {
		runId: normalizeOptionalString(accepted.runId),
		sessionKey: normalizeOptionalString(accepted.sessionKey),
		agentId: normalizeOptionalString(accepted.agentId)
	};
}
function createAgentCliSignalBridge(processLike = process) {
	return {
		...createEmbeddedStateSignalBridge(processLike),
		setExitCode: (code) => {
			processLike.exitCode = code;
		}
	};
}
function isAgentCliProcessLike(value) {
	return Boolean(value) && typeof value === "object" && typeof value.on === "function" && typeof value.off === "function";
}
function resolveAgentCliProcessLike(deps) {
	if (!deps || !Object.hasOwn(deps, "process")) return process;
	const processLike = deps.process;
	return isAgentCliProcessLike(processLike) ? processLike : process;
}
async function delayMs(ms, signal) {
	try {
		await sleep(ms, signal);
	} catch {
		throw createAbortError("gateway agent retry aborted");
	}
}
function isConfirmedChatAbortResponseForRun(value, runId) {
	const response = asOptionalRecord(value);
	if (response?.aborted !== true) return false;
	if (response.runIds === void 0) return true;
	return Array.isArray(response.runIds) && response.runIds.includes(runId);
}
async function abortAcceptedGatewayAgentRunWithRetries(params) {
	for (const [attempt, retryDelayMs] of [...GATEWAY_ABORT_RETRY_DELAYS_MS, 0].entries()) {
		const isFinalAttempt = attempt === GATEWAY_ABORT_RETRY_DELAYS_MS.length;
		const logFailure = params.logFailure !== false && isFinalAttempt;
		if (params.signal && params.runId && params.sessionKey) try {
			if (isConfirmedChatAbortResponseForRun(await params.request("chat.abort", {
				sessionKey: params.sessionKey,
				runId: params.runId,
				...params.agentId ? { agentId: params.agentId } : {}
			}, { timeoutMs: GATEWAY_ABORT_REQUEST_TIMEOUT_MS }), params.runId)) return true;
			if (logFailure) params.runtime.error?.(`Interrupted by ${params.signal}; Gateway run ${params.runId} was not confirmed aborted.`);
		} catch (err) {
			if (logFailure) params.runtime.error?.(`Interrupted by ${params.signal}; failed to abort Gateway run ${params.runId}: ${String(err)}`);
		}
		if (isFinalAttempt) return false;
		await delayMs(retryDelayMs);
	}
	return false;
}
function exitForReceivedSignal(signal, runtime) {
	if (!signal) return false;
	runtime.exit(AGENT_CLI_SIGNAL_EXIT_CODES[signal]);
	return true;
}
function returnAfterSignalExit(value, signal, runtime) {
	return exitForReceivedSignal(signal, runtime) ? void 0 : value;
}
function buildGatewayJsonResponse(response) {
	const deliveryStatus = response.result?.deliveryStatus;
	if (deliveryStatus === void 0) return response;
	return {
		...response,
		deliveryStatus
	};
}
function markAgentRunExitCode(status, signalBridge) {
	if (status === void 0 || status === null || status === "") return;
	signalBridge.setExitCode(status === "ok" || status === "completed" ? 0 : 1);
}
function formatInFlightGatewayAgentMessage(response) {
	return response.runId ? `Agent run ${response.runId} is already in flight; not starting a duplicate run.` : "Agent run is already in flight; not starting a duplicate run.";
}
async function agentViaGatewayCommand(opts, runtime, signalBridge, runContext) {
	const body = opts.message;
	const explicitSessionKey = opts.sessionKey?.trim();
	let cfg = opts.gatewayDispatchConfig ?? readGatewayDispatchConfig();
	const remoteGateway = usesRemoteGateway(cfg);
	const remoteRosterIsSole = opts.remoteGatewayRoster?.ownership === "sole" || !opts.remoteGatewayRoster?.ownership && opts.remoteGatewayRoster?.agentIds.length === 1;
	const remoteRosterUsesCompatibilityDefault = Boolean(opts.remoteGatewayRoster && usesImplicitRemoteCompatibilityDefault(opts.remoteGatewayRoster));
	const hasImplicitGlobalTarget = (opts.remoteGatewayRoster?.scope ?? cfg.session?.scope) === "global" && (opts.remoteGatewayRoster ? !opts.remoteGatewayRoster.selectionRequired && (remoteRosterIsSole || remoteRosterUsesCompatibilityDefault) : !remoteGateway && (tryResolveSoleAgentId(cfg) !== void 0 || opts.localGatewayCompatibilityAgentId !== void 0));
	if (!opts.to && !opts.sessionId && !opts.agent && !explicitSessionKey && !hasImplicitGlobalTarget) throw new Error(`No target session selected. Use --agent <id>, --session-key <key>, --session-id <id>, or --to <E.164>. Run ${formatCliCommand("openclaw agents list")} to see agents.`);
	const agentIdRaw = opts.agent?.trim();
	const agentId = agentIdRaw ? normalizeAgentId(agentIdRaw) : void 0;
	if (agentId) {
		const knownAgents = opts.remoteGatewayRoster?.agentIds ?? (remoteGateway ? void 0 : listAgentIds(cfg));
		if (knownAgents && !knownAgents.includes(agentId)) throw new Error(`Unknown agent id "${agentIdRaw}". Use "${formatCliCommand("openclaw agents list")}" to see configured agents.`);
	}
	const timeoutSeconds = parseTimeoutSeconds({
		cfg,
		timeout: opts.timeout
	});
	const channel = normalizeMessageChannel(opts.channel);
	const deferExplicitRecipientSession = Boolean(!explicitSessionKey && !opts.sessionId?.trim() && agentId && channel && channel !== "last" && opts.to?.trim() && classifySessionKeyShape(opts.to) !== "agent");
	const deferSessionId = Boolean(opts.sessionId?.trim() && !explicitSessionKey);
	const deferRemoteBareSessionKey = Boolean(remoteGateway && explicitSessionKey && classifySessionKeyShape(explicitSessionKey) !== "agent");
	const deferAgentDefaultSession = Boolean(agentId && !explicitSessionKey && !opts.sessionId?.trim() && !opts.to?.trim());
	const sessionKey = (remoteRosterIsSole || remoteRosterUsesCompatibilityDefault) && !agentId && (isUnscopedSessionKeySentinel(explicitSessionKey) || hasImplicitGlobalTarget) || deferRemoteBareSessionKey ? explicitSessionKey : deferAgentDefaultSession || deferExplicitRecipientSession || deferSessionId ? void 0 : classifySessionKeyShape(explicitSessionKey) === "agent" ? explicitSessionKey : (await (await import("./session.runtime.js")).resolveSessionKeyForRequest({
		cfg,
		agentId,
		to: opts.to,
		sessionId: opts.sessionId,
		sessionKey: explicitSessionKey
	})).sessionKey;
	const abortSessionKey = deferSessionId ? void 0 : deferExplicitRecipientSession ? (await (await import("./session.runtime.js")).resolveSessionKeyForRequest({
		cfg,
		agentId
	})).sessionKey : sessionKey;
	const idempotencyKey = normalizeOptionalString(opts.runId) || randomIdempotencyKey();
	const modelOverride = normalizeOptionalString(opts.model);
	const gatewayIdentity = resolveAgentGatewayIdentity(Boolean(modelOverride) || isSessionResetCommand(body), remoteGateway);
	let activeConnectionAbortAttempted = false;
	let activeConnectionAbortSucceeded = false;
	let response;
	const abortGatewayRun = (request, logFailure = true) => abortAcceptedGatewayAgentRunWithRetries({
		runId: runContext.accepted?.runId ?? idempotencyKey,
		sessionKey: runContext.accepted?.sessionKey ?? abortSessionKey,
		agentId: runContext.accepted?.agentId,
		signal: signalBridge.getReceivedSignal(),
		runtime,
		request,
		logFailure
	});
	const dispatchGatewayAgentCall = async (activeCfg) => await withProgress({
		label: "Waiting for agent reply…",
		indeterminate: true,
		enabled: opts.json !== true
	}, async () => await callGateway({
		method: "agent",
		requiredCapabilities: deferSessionId ? [GATEWAY_SERVER_CAPS.AGENT_SESSION_ID_CREATE] : void 0,
		params: {
			message: body,
			agentId,
			model: modelOverride,
			to: opts.to,
			replyTo: opts.replyTo,
			sessionId: opts.sessionId,
			sessionKey,
			createSessionIfMissing: deferSessionId || void 0,
			thinking: opts.thinking,
			deliver: Boolean(opts.deliver),
			channel,
			replyChannel: opts.replyChannel,
			replyAccountId: opts.replyAccount,
			bestEffortDeliver: opts.bestEffortDeliver,
			timeout: timeoutSeconds,
			lane: opts.lane,
			extraSystemPrompt: opts.extraSystemPrompt,
			idempotencyKey
		},
		expectFinal: true,
		timeoutMs: null,
		config: activeCfg,
		signal: signalBridge.signal,
		onAccepted: (payload) => {
			runContext.accepted = readAcceptedRunContext(payload);
		},
		onSignalAbort: async (request) => {
			activeConnectionAbortAttempted = true;
			activeConnectionAbortSucceeded = await abortGatewayRun(request, false);
		},
		...gatewayIdentity
	}));
	let shellEnvFallbackRetriesRemaining = 1;
	const consumeShellEnvFallbackRetry = () => shellEnvFallbackRetriesRemaining-- > 0;
	for (;;) try {
		response = await dispatchGatewayAgentCall(cfg);
		break;
	} catch (err) {
		if (!runContext.accepted && shouldRetryGatewayDispatchWithShellEnvFallback(err) && consumeShellEnvFallbackRetry()) {
			cfg = await readGatewayDispatchConfigWithShellEnvFallback();
			continue;
		}
		if (isAbortError(err) && !activeConnectionAbortSucceeded && (runContext.accepted || activeConnectionAbortAttempted)) await abortGatewayRun((method, params, requestOpts) => callGateway({
			method,
			params,
			timeoutMs: requestOpts?.timeoutMs ?? void 0,
			expectFinal: requestOpts?.expectFinal,
			config: cfg,
			...gatewayIdentity
		}));
		const payload = err instanceof GatewayProtocolRequestError ? asOptionalRecord(err.responsePayload) : void 0;
		if (payload?.reason === "input_withdrawn_before_turn" && typeof payload.pendingInputId === "string") {
			response = {
				...payload,
				status: "cancelled"
			};
			break;
		}
		recordCliGatewayRunFailure(err, normalizeOptionalString(payload?.runId) ?? runContext.accepted?.runId);
		throw err;
	}
	if (!response) throw new Error("gateway agent call did not return a response");
	markAgentRunExitCode(response.status, signalBridge);
	if (opts.json) {
		writeRuntimeJson(runtime, buildGatewayJsonResponse(response));
		return response;
	}
	const payloads = response.result?.payloads ?? [];
	if (response.result?.meta?.requestShaping?.thinkingClamp) runtime.log(response.result.meta.requestShaping.thinkingClamp);
	if (response.reason === "input_withdrawn_before_turn") {
		runtime.error?.(response.summary);
		return response;
	}
	if (response.status === "in_flight") {
		runtime.error?.(formatInFlightGatewayAgentMessage(response));
		return response;
	}
	if (payloads.length === 0) {
		if (response?.status !== "ok") runtime.log(response?.summary ? response.summary : "No reply from agent.");
		return response;
	}
	for (const payload of payloads) {
		const out = await formatPayloadForLog(payload);
		if (out) runtime.log(out);
	}
	return response;
}
async function agentViaGatewayCommandWithTransientRetries(opts, runtime, signalBridge) {
	const runContext = {};
	for (const [attempt, retryDelayMs] of [...GATEWAY_TRANSIENT_CONNECT_RETRY_DELAYS_MS, 0].entries()) try {
		return await agentViaGatewayCommand(opts, runtime, signalBridge, runContext);
	} catch (err) {
		if (isAbortError(err)) throw err;
		if (attempt === GATEWAY_TRANSIENT_CONNECT_RETRY_DELAYS_MS.length || !isTransientGatewayAgentConnectClose(err)) throw err;
		runtime.error?.(`Gateway agent connection closed during handshake; retrying in ${retryDelayMs}ms before failing.`);
		await delayMs(retryDelayMs, signalBridge.signal);
	}
	throw new Error("Gateway agent retry loop exhausted unexpectedly.");
}
async function agentCliCommand(opts, runtime, deps) {
	if (opts.local !== true) assertGatewayCliMessageContext("agent");
	for (const [flag, value] of [
		["--agent", opts.agent],
		["--session-id", opts.sessionId],
		["--session-key", opts.sessionKey],
		["--to", opts.to]
	]) if (value !== void 0 && !value.trim()) throw new Error(`${flag} must not be blank`);
	protectJsonStdout(opts);
	const messageOpts = await resolveAgentMessageOpts(opts);
	if (isCompactControlCommand(messageOpts.message)) throw new Error("Slash commands cannot be executed via --message from the CLI. Use: openclaw sessions compact <key>");
	const dispatchOpts = await normalizeSessionKeyOptsForDispatch(messageOpts);
	validateExplicitSessionKeyForDispatch(dispatchOpts);
	const gatewayDispatchOpts = dispatchOpts.runId ? dispatchOpts : {
		...dispatchOpts,
		runId: randomIdempotencyKey()
	};
	const signalBridge = createAgentCliSignalBridge(resolveAgentCliProcessLike(deps));
	try {
		if (dispatchOpts.local === true) {
			const stateLock = await acquireEmbeddedAgentStateLock(deps?.localGatewayLockOptions, signalBridge.signal);
			let result;
			try {
				result = await runEmbeddedAgentCommand({
					...gatewayDispatchOpts,
					agentId: gatewayDispatchOpts.agent ?? gatewayDispatchOpts.localGatewayCompatibilityAgentId,
					replyAccountId: gatewayDispatchOpts.replyAccount,
					cleanupBundleMcpOnRunEnd: true,
					cleanupCliLiveSessionOnRunEnd: true,
					oneShotCliRun: true,
					abortSignal: signalBridge.signal
				}, runtime, deps);
			} finally {
				await stateLock?.release();
			}
			markAgentRunExitCode(readAgentRunTerminalOutcome(result), signalBridge);
			return returnAfterSignalExit(result, signalBridge.getReceivedSignal(), runtime);
		}
		try {
			return returnAfterSignalExit(await agentViaGatewayCommandWithTransientRetries(gatewayDispatchOpts, runtime, signalBridge), signalBridge.getReceivedSignal(), runtime);
		} catch (err) {
			const failureHint = isAbortError(err) ? void 0 : formatGatewayAgentTransportLossHint(err);
			if (failureHint) runtime.error?.(failureHint);
			throw err;
		}
	} catch (err) {
		if (isAbortError(err) && exitForReceivedSignal(signalBridge.getReceivedSignal(), runtime)) return;
		throw err;
	} finally {
		signalBridge.dispose();
	}
}
//#endregion
export { agentCliCommand };
