import { C as parseStrictNonNegativeInteger, F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { n as captureAsyncWorkTracker, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { s as readFileDescriptorBounded } from "./boundary-file-read-D-Aa04On.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { M as tryResolveSoleAgentId, O as listAgentIds, t as AgentSelectionRequiredError, y as tryResolveAgentOperationAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CUi_tcgF.mjs";
import { l as resolveAgentIdFromSessionKey, m as scopeLegacySessionKeyToAgent, o as classifySessionKeyShape, s as isUnscopedSessionKeySentinel } from "./session-key-CBvmC8zz.mjs";
import { i as tryGetLegacyDefaultAgentId, t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { a as routeLogsToStderr } from "./console-DwqfhE-H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-zIYbDm7V.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-DBafeUlR.mjs";
import { a as READ_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { n as isGatewaySecretRefUnavailableError } from "./credentials-CyW929E5.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import "./message-channel-normalize-2tAtQt1g.mjs";
import { _ as assertGatewayCliMessageContext, g as randomIdempotencyKey, m as isGatewayExplicitAuthRequiredError, o as callGateway, p as isGatewayCredentialsRequiredError } from "./call-C_MP4_Gs.mjs";
import { n as readGatewayDispatchConfigWithShellEnvFallback, t as readGatewayDispatchConfig } from "./gateway-dispatch-config-D6ryKgcX.mjs";
import { t as GatewayProtocolRequestError } from "./protocol-request-BMUN1re6.mjs";
import { a as isGatewayTransportError } from "./transport-error-C-c71VUr.mjs";
import { c as recordCliGatewayRunFailure, s as readCliGatewayRunFailure } from "./failure-output-Cct-llrO.mjs";
import { i as classifyAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CgoAW2Q7.mjs";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BXFCjLO0.mjs";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { n as readAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-gv15pQgO.mjs";
import { r as withProgress } from "./progress-BQygak_O.mjs";
import { t as measureAgentStartup } from "./startup-timing-BKEd929M.mjs";
import { n as createEmbeddedStateSignalBridge } from "./embedded-state-lock-Cw9nQxv5.mjs";
import { TextDecoder } from "node:util";
import fs from "node:fs/promises";
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
/**
* Start the diagnostics OTel exporter for a one-shot embedded agent run.
*
* Gateway processes start diagnostics exporters via startPluginServices at
* startup; one-shot `openclaw agent --local` runs execute the agent in the CLI
* process where no plugin service ever starts, so diagnostic events had no OTel
* subscriber and spans were dropped.
* Returns null when OTel export is not configured or the plugin is not
* enabled/installed; the returned handle's stop() drains the diagnostic event
* queue and shuts the SDK down (force-flush) before the process exits.
*/
async function startOneShotDiagnosticsExporters(params) {
	const config = params.suppressStdoutDiagnosticLogs === true ? suppressOtelStdoutLogSink(params.config) : params.config;
	if (!isOtelExportConfigured(config)) return null;
	const [{ acquirePluginRegistryForInspection }, { startPluginServices }] = await Promise.all([import("./plugins/loader.js"), import("./services-SHULXw54.mjs")]);
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
//#region src/commands/agent-via-gateway.ts
const NO_GATEWAY_TIMEOUT_MS = 2147e6;
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
	const migratedConfig = remote ? cfg : migratePersistedImplicitMainRoster(cfg).config;
	const selectionCfg = remote ? cfg : inheritLegacyDefaultAgentId(tryGetLegacyDefaultAgentId(cfg) ? cfg : migratedConfig, migratedConfig);
	const selected = remote ? remote.selectionRequired ? void 0 : remote.defaultId : tryResolveAgentOperationAgentId(selectionCfg);
	if (selected) return selected;
	const agentIds = remote?.agentIds ?? listAgentIds(selectionCfg);
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
const embeddedAgentCommandLoader = createLazyPromiseLoader(() => import("./agent-CUacqy2D.mjs").then((module) => module.agentCommand), { cacheRejections: true });
const agentSessionModuleCache = createLazyPromiseLoader(() => import("./session.runtime.js"), { cacheRejections: true });
const runtimeConfigModuleLoader = createLazyPromiseLoader(() => import("./io-CPLwHuZl.mjs"), { cacheRejections: true });
const embeddedStateLockModuleLoader = createLazyPromiseLoader(() => import("./embedded-state-lock-BYJUg_WD.mjs"), { cacheRejections: true });
const replyPayloadModuleLoader = createLazyPromiseLoader(() => import("./plugin-sdk/reply-payload.js"), { cacheRejections: true });
let gatewayAbortRetryDelaysMsForTests;
function resolveGatewayAbortRetryDelaysMs() {
	return gatewayAbortRetryDelaysMsForTests ?? GATEWAY_ABORT_RETRY_DELAYS_MS;
}
const loadAgentSessionModule = agentSessionModuleCache.load;
async function startEmbeddedRunDiagnosticsExporters(runtime, options, config) {
	try {
		return await startOneShotDiagnosticsExporters({
			config,
			suppressStdoutDiagnosticLogs: options.suppressStdoutDiagnosticLogs
		});
	} catch (err) {
		runtime.error?.(`diagnostics exporter startup failed for embedded run: ${String(err)}`);
		return null;
	}
}
/**
* Run the embedded agent command with OTel diagnostics export for this
* one-shot process: the Gateway only starts diagnostics exporters in its own
* process, so embedded runs start one here and flush it before the CLI exits
* (including signal exits, which happen after this returns).
*/
async function runEmbeddedAgentCommand(opts, runtime, deps, diagnosticsOptions) {
	const agentCommand = await measureAgentStartup("command-import", () => embeddedAgentCommandLoader.load());
	const config = await loadRuntimeConfig();
	const diagnostics = await startEmbeddedRunDiagnosticsExporters(runtime, diagnosticsOptions, config);
	let stopLocalAuditWriter;
	if (isExecutionIdentityCollectionEnabled(config)) try {
		const { startAgentLocalAuditWriter } = await import("./agent-local-audit-Crk3o8Bp.mjs");
		stopLocalAuditWriter = startAgentLocalAuditWriter(config);
	} catch {}
	try {
		return await agentCommand(opts, runtime, deps);
	} finally {
		await Promise.all([diagnostics?.stop(), stopLocalAuditWriter?.().catch(() => void 0)]);
	}
}
async function loadRuntimeConfig() {
	const { getRuntimeConfig } = await runtimeConfigModuleLoader.load();
	return getRuntimeConfig();
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
	const { acquireEmbeddedStateLock } = await embeddedStateLockModuleLoader.load();
	return await acquireEmbeddedStateLock({
		options,
		signal,
		formatActiveGatewayRefusal: formatActiveGatewayLocalRefusal
	});
}
const loadReplyPayloadModule = replyPayloadModuleLoader.load;
/** Test-only hooks for resetting lazy imports and shortening retry timing. */
const agentViaGatewayTesting = {
	resetLazyImportsForTests() {
		embeddedAgentCommandLoader.clear();
		agentSessionModuleCache.clear();
		runtimeConfigModuleLoader.clear();
		embeddedStateLockModuleLoader.clear();
		replyPayloadModuleLoader.clear();
	},
	setGatewayAbortRetryDelaysMsForTests(delays) {
		gatewayAbortRetryDelaysMsForTests = delays;
	}
};
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
	try {
		handle = await fs.open(messageFile, "r");
	} catch (err) {
		throw new Error(formatMessageFileReadFailure(messageFile, err), { cause: err });
	}
	let buffer;
	try {
		const stat = await handle.stat();
		if (stat.isDirectory()) throw Object.assign(/* @__PURE__ */ new Error("Message file is a directory"), { code: "EISDIR" });
		if (stat.isFile() && stat.size > AGENT_MESSAGE_FILE_MAX_BYTES) throw new Error(`File exceeds ${AGENT_MESSAGE_FILE_MAX_BYTES} bytes: ${messageFile}`);
		buffer = await readFileDescriptorBounded(handle.fd, AGENT_MESSAGE_FILE_MAX_BYTES);
	} catch (err) {
		throw new Error(formatMessageFileReadFailure(messageFile, err), { cause: err });
	} finally {
		await handle.close().catch(() => void 0);
	}
	try {
		return MESSAGE_FILE_DECODER.decode(buffer).replace(/^\uFEFF/, "");
	} catch {
		throw new Error(`Message file must be valid UTF-8: ${messageFile}`);
	}
}
async function resolveAgentMessageOpts(opts) {
	const { messageFile: rawMessageFile, ...rest } = opts;
	const messageFile = rawMessageFile?.trim();
	if (opts.message !== void 0 && messageFile) throw new Error("Use either --message or --message-file, not both.");
	if (rawMessageFile !== void 0 && !messageFile) throw new Error("--message-file must not be empty.");
	if (messageFile) {
		const message = await readAgentMessageFile(messageFile);
		if (!message.trim()) throw new Error(`Message file is empty: ${messageFile}`);
		return {
			...rest,
			message
		};
	}
	const message = opts.message ?? "";
	if (!message.trim()) throw missingAgentMessageError();
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
function resolveGatewayAgentTimeoutMs(timeoutSeconds) {
	if (timeoutSeconds === 0) return NO_GATEWAY_TIMEOUT_MS;
	return resolveTimerTimeoutMs((timeoutSeconds + 30) * 1e3, 1e4, 1e4);
}
async function formatPayloadForLog(payload) {
	const { resolveSendableOutboundReplyParts } = await loadReplyPayloadModule();
	const parts = resolveSendableOutboundReplyParts({
		text: payload.text,
		mediaUrls: payload.mediaUrls,
		mediaUrl: typeof payload.mediaUrl === "string" ? payload.mediaUrl : void 0
	});
	const lines = [];
	if (parts.text) lines.push(parts.text.trimEnd());
	for (const url of parts.mediaUrls) lines.push(`Attachment: ${url}`);
	return lines.join("\n").trimEnd();
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
function resolveGatewayAgentFailureHint(err) {
	if (!isGatewayTransportError(err)) return;
	return err.kind === "timeout" ? "timed out" : "connection closed";
}
function formatGatewayAgentTransportLossHint(err) {
	const failureHint = resolveGatewayAgentFailureHint(err);
	if (!failureHint) return;
	const acceptedRun = readCliGatewayRunFailure(err);
	return `Gateway agent call ${failureHint}; the Gateway may still be running this turn${acceptedRun ? ` (accepted run ${acceptedRun.runId}` + (failureHint === "timed out" ? "; use --timeout <seconds> to extend the CLI wait" : "") + ")" : ""}. Check \`openclaw gateway status\` and the session transcript before retrying or rerunning with --local, so the turn does not execute twice.`;
}
function isTransientGatewayAgentConnectClose(err) {
	if (!isGatewayTransportError(err) || err.kind !== "closed") return false;
	const code = typeof err.code === "number" ? err.code : void 0;
	const reason = normalizeOptionalString(err.reason);
	return code === 1e3 && (!reason || reason === "no close reason");
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
	const shouldScopeDefaultAgentKey = isLegacySessionKey && !agentIdRaw && !isUnscopedSessionKeySentinel(rawSessionKey);
	const cfg = isLegacySessionKey && (agentIdRaw || shouldScopeDefaultAgentKey) ? normalizedOpts.local === true ? await loadRuntimeConfig() : selectionCfg ?? readGatewayDispatchConfig() : void 0;
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
function createAbortDelayError() {
	return createAbortError("gateway agent retry aborted");
}
function delayMs(ms, signal) {
	if (signal?.aborted) return Promise.reject(createAbortDelayError());
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			signal?.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		const onAbort = () => {
			clearTimeout(timer);
			signal?.removeEventListener("abort", onAbort);
			reject(createAbortDelayError());
		};
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
function isConfirmedChatAbortResponseForRun(value, runId) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const response = value;
	if (response.aborted !== true) return false;
	if (response.runIds === void 0) return true;
	return Array.isArray(response.runIds) && response.runIds.includes(runId);
}
async function abortAcceptedGatewayAgentRunWithRequest(params) {
	if (!params.signal || !params.runId || !params.sessionKey) return false;
	try {
		if (isConfirmedChatAbortResponseForRun(await params.request("chat.abort", {
			sessionKey: params.sessionKey,
			runId: params.runId,
			...params.agentId ? { agentId: params.agentId } : {}
		}, { timeoutMs: GATEWAY_ABORT_REQUEST_TIMEOUT_MS }), params.runId)) return true;
		if (params.logFailure !== false) params.runtime.error?.(`Interrupted by ${params.signal}; Gateway run ${params.runId} was not confirmed aborted.`);
		return false;
	} catch (err) {
		if (params.logFailure !== false) params.runtime.error?.(`Interrupted by ${params.signal}; failed to abort Gateway run ${params.runId}: ${String(err)}`);
		return false;
	}
}
async function abortAcceptedGatewayAgentRunWithGatewayCall(params) {
	const request = async (method, requestParams, opts) => await callGateway({
		method,
		params: requestParams,
		timeoutMs: opts?.timeoutMs ?? void 0,
		expectFinal: opts?.expectFinal,
		config: params.config,
		...params.gatewayIdentity
	});
	const retryDelaysMs = resolveGatewayAbortRetryDelaysMs();
	for (const [attempt, retryDelayMs] of [...retryDelaysMs, 0].entries()) {
		const isFinalAttempt = attempt === retryDelaysMs.length;
		if (await abortAcceptedGatewayAgentRunWithRequest({
			runId: params.runId,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			signal: params.signal,
			runtime: params.runtime,
			request,
			logFailure: isFinalAttempt
		}) || isFinalAttempt) return;
		await delayMs(retryDelayMs);
	}
}
async function abortAcceptedGatewayAgentRunOnActiveConnection(params) {
	const retryDelaysMs = resolveGatewayAbortRetryDelaysMs();
	for (const [attempt, retryDelayMs] of [...retryDelaysMs, 0].entries()) {
		const isFinalAttempt = attempt === retryDelaysMs.length;
		const aborted = await abortAcceptedGatewayAgentRunWithRequest({
			runId: params.runId,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			signal: params.signal,
			runtime: params.runtime,
			request: params.request,
			logFailure: false
		});
		if (aborted || isFinalAttempt) return aborted;
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
function isInFlightGatewayAgentResponse(response) {
	return response.status === "in_flight";
}
function markAgentRunExitCode(status, signalBridge) {
	const waitStatus = status === "ok" || status === "completed" ? "ok" : status === "timeout" ? "timeout" : status === void 0 || status === null || status === "" ? void 0 : "error";
	if (!waitStatus) return;
	const outcome = buildAgentRunTerminalOutcome({ status: waitStatus });
	signalBridge.setExitCode(classifyAgentRunTerminalOutcome(outcome) === "success" ? 0 : 1);
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
	const gatewayTimeoutMs = resolveGatewayAgentTimeoutMs(timeoutSeconds);
	const channel = normalizeMessageChannel(opts.channel);
	const deferExplicitRecipientSession = Boolean(!explicitSessionKey && !opts.sessionId?.trim() && agentId && channel && channel !== "last" && opts.to?.trim() && classifySessionKeyShape(opts.to) !== "agent");
	const deferRemoteSessionId = Boolean(remoteGateway && opts.sessionId?.trim() && !explicitSessionKey);
	const deferRemoteBareSessionKey = Boolean(remoteGateway && explicitSessionKey && classifySessionKeyShape(explicitSessionKey) !== "agent");
	const deferAgentDefaultSession = Boolean(agentId && !explicitSessionKey && !opts.sessionId?.trim() && !opts.to?.trim());
	const sessionKey = (remoteRosterIsSole || remoteRosterUsesCompatibilityDefault) && !agentId && (isUnscopedSessionKeySentinel(explicitSessionKey) || hasImplicitGlobalTarget) || deferRemoteBareSessionKey ? explicitSessionKey : deferAgentDefaultSession || deferExplicitRecipientSession || deferRemoteSessionId ? void 0 : classifySessionKeyShape(explicitSessionKey) === "agent" ? explicitSessionKey : (await loadAgentSessionModule()).resolveSessionKeyForRequest({
		cfg,
		agentId,
		to: opts.to,
		sessionId: opts.sessionId,
		sessionKey: explicitSessionKey
	}).sessionKey;
	const abortSessionKey = deferRemoteSessionId ? void 0 : deferExplicitRecipientSession ? (await loadAgentSessionModule()).resolveSessionKeyForRequest({
		cfg,
		agentId
	}).sessionKey : sessionKey;
	const idempotencyKey = normalizeOptionalString(opts.runId) || randomIdempotencyKey();
	const modelOverride = normalizeOptionalString(opts.model);
	const needsAdminGatewayIdentity = Boolean(modelOverride) || isSessionResetCommand(body);
	const gatewayIdentity = {
		clientName: needsAdminGatewayIdentity ? GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT : GATEWAY_CLIENT_NAMES.CLI,
		mode: needsAdminGatewayIdentity ? GATEWAY_CLIENT_MODES.BACKEND : GATEWAY_CLIENT_MODES.CLI,
		...needsAdminGatewayIdentity || !remoteGateway ? { scopes: [ADMIN_SCOPE] } : {}
	};
	let activeConnectionAbortAttempted = false;
	let activeConnectionAbortSucceeded = false;
	let response;
	const dispatchGatewayAgentCall = async (activeCfg) => await withProgress({
		label: "Waiting for agent reply…",
		indeterminate: true,
		enabled: opts.json !== true
	}, async () => await callGateway({
		method: "agent",
		params: {
			message: body,
			agentId,
			model: modelOverride,
			to: opts.to,
			replyTo: opts.replyTo,
			sessionId: opts.sessionId,
			sessionKey,
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
		timeoutMs: gatewayTimeoutMs,
		config: activeCfg,
		signal: signalBridge.signal,
		onAccepted: (payload) => {
			runContext.accepted = readAcceptedRunContext(payload);
		},
		onSignalAbort: async (request) => {
			activeConnectionAbortAttempted = true;
			activeConnectionAbortSucceeded = await abortAcceptedGatewayAgentRunOnActiveConnection({
				runId: runContext.accepted?.runId ?? idempotencyKey,
				sessionKey: runContext.accepted?.sessionKey ?? abortSessionKey,
				agentId: runContext.accepted?.agentId,
				signal: signalBridge.getReceivedSignal(),
				runtime,
				request
			});
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
		if (isAbortError(err) && !activeConnectionAbortSucceeded && (runContext.accepted || activeConnectionAbortAttempted)) await abortAcceptedGatewayAgentRunWithGatewayCall({
			runId: runContext.accepted?.runId ?? idempotencyKey,
			sessionKey: runContext.accepted?.sessionKey ?? abortSessionKey,
			agentId: runContext.accepted?.agentId,
			signal: signalBridge.getReceivedSignal(),
			runtime,
			gatewayIdentity,
			config: cfg
		});
		const payload = err instanceof GatewayProtocolRequestError ? asOptionalRecord(err.responsePayload) : void 0;
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
	if (isInFlightGatewayAgentResponse(response)) {
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
	if (isCompactControlCommand(messageOpts.message)) {
		runtime.error?.("Slash commands cannot be executed via --message from the CLI. Use: openclaw sessions compact <key>");
		runtime.exit(1);
		return;
	}
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
				}, runtime, deps, { suppressStdoutDiagnosticLogs: dispatchOpts.json === true });
			} finally {
				await stateLock?.release();
			}
			markAgentRunExitCode(readAgentRunTerminalOutcome(result), signalBridge);
			return returnAfterSignalExit(result, signalBridge.getReceivedSignal(), runtime);
		}
		try {
			return returnAfterSignalExit(await agentViaGatewayCommandWithTransientRetries(gatewayDispatchOpts, runtime, signalBridge), signalBridge.getReceivedSignal(), runtime);
		} catch (err) {
			if (isAbortError(err)) {
				if (exitForReceivedSignal(signalBridge.getReceivedSignal(), runtime)) return;
				throw err;
			}
			const failureHint = formatGatewayAgentTransportLossHint(err);
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
export { agentCliCommand, agentViaGatewayTesting };
