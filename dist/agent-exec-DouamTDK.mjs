import { C as parseStrictNonNegativeInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as writeRuntimeJson, o as writeRuntimeStdout } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as getInstallationTarget, t as LOCAL_INSTALLATION_TARGET_UNSUPPORTED } from "./installation-target-context-CrBRhZSM.mjs";
import { n as recordAgentCleanupFailure, t as createAgentCleanupScope } from "./run-cleanup-timeout-BlChlpzQ.mjs";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BXFCjLO0.mjs";
import { n as findAgentRunTerminalOutcome } from "./agent-run-terminal-error-C7q9VIgV.mjs";
import { a as createAgentToolExecutionBudget } from "./agent-tool-source-execution-guard-CEFulHpI.mjs";
import { n as resolveAgentExecPrompt, r as resolveExecBaseConfig, t as buildExecRunConfig } from "./agent-exec-input-ogrRLYzr.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { randomUUID } from "node:crypto";
//#region src/commands/agent-exec-result.ts
function projectAgentExecPayload(payload) {
	return {
		...typeof payload.text === "string" ? { text: payload.text } : {},
		...payload.mediaUrl !== void 0 ? { mediaUrl: payload.mediaUrl } : {},
		...Array.isArray(payload.mediaUrls) ? { mediaUrls: [...payload.mediaUrls] } : {},
		...payload.isError === true ? { isError: true } : {},
		...payload.isReasoning === true ? { isReasoning: true } : {},
		...payload.isCommentary === true ? { isCommentary: true } : {}
	};
}
function finalTextFromResult(result, payloads, allowMetadataFallback) {
	return payloads.filter((payload) => payload.isError !== true && payload.isReasoning !== true && payload.isCommentary !== true && typeof payload.text === "string" && payload.text.trim().length > 0).map((payload) => payload.text.trimEnd()).join("\n") || (allowMetadataFallback ? result.meta.finalAssistantVisibleText?.trimEnd() : "") || "";
}
function firstErrorPayload(result) {
	return result.payloads?.find((payload) => payload.isError === true);
}
/** Classify an embedded result into the strict `agent exec` process contract. */
function classifyAgentExecResult(result, fallbackExhausted = false, projectedErrorPayload) {
	const meta = result.meta;
	const errorPayload = firstErrorPayload(result);
	const errorPayloadMessage = typeof projectedErrorPayload === "string" ? projectedErrorPayload : typeof errorPayload?.text === "string" && errorPayload.text.trim() ? errorPayload.text : void 0;
	const hasErrorPayload = projectedErrorPayload !== void 0 || errorPayload !== void 0;
	const payloads = (result.payloads ?? []).map(projectAgentExecPayload);
	if (typeof projectedErrorPayload === "string") {
		const projectedErrorIndex = payloads.findIndex((payload) => payload.isError !== true && payload.text === projectedErrorPayload);
		if (projectedErrorIndex >= 0) payloads[projectedErrorIndex] = {
			...payloads[projectedErrorIndex],
			isError: true
		};
	}
	const timeout = meta.stopReason === "timeout" || meta.timeoutPhase !== void 0;
	const failed = fallbackExhausted || meta.aborted === true || meta.error !== void 0 || meta.stopReason === "error" || hasErrorPayload;
	const status = timeout ? "timeout" : failed ? "error" : "ok";
	const errorMessage = timeout ? meta.error?.message ?? errorPayloadMessage ?? "Agent run timed out" : fallbackExhausted ? meta.error?.message ?? errorPayloadMessage ?? "All model fallback candidates failed" : meta.error?.message ?? errorPayloadMessage ?? (failed ? "Agent run failed" : void 0);
	const errorKind = timeout ? "timeout" : fallbackExhausted ? "fallback_exhausted" : meta.error?.kind ? meta.error.kind : meta.aborted ? "aborted" : hasErrorPayload ? "error_payload" : failed ? "agent_error" : void 0;
	const agentMeta = meta.agentMeta;
	return {
		ok: status === "ok",
		status,
		final: finalTextFromResult(result, payloads, !hasErrorPayload),
		payloads,
		...agentMeta?.usage ? { usage: agentMeta.usage } : {},
		...agentMeta?.costUsd !== void 0 ? { costUsd: agentMeta.costUsd } : {},
		...agentMeta?.codeModeEngaged !== void 0 ? { codeModeEngaged: agentMeta.codeModeEngaged } : {},
		...agentMeta?.assistantTurns !== void 0 ? { assistantTurns: agentMeta.assistantTurns } : {},
		...agentMeta?.bridgeCalls ? { bridgeCalls: agentMeta.bridgeCalls } : {},
		...meta.toolSummary ? { toolSummary: meta.toolSummary } : {},
		model: agentMeta?.model ?? null,
		provider: agentMeta?.provider ?? null,
		sessionId: agentMeta?.sessionId ?? "",
		...errorMessage && errorKind ? { error: {
			message: errorMessage,
			kind: errorKind
		} } : {}
	};
}
//#endregion
//#region src/commands/agent-exec.ts
const AGENT_EXEC_DEFAULT_TIMEOUT_SECONDS = 600;
function exitCodeForEnvelope(envelope) {
	return envelope.status === "ok" ? 0 : envelope.status === "timeout" ? 2 : 1;
}
function normalizeCodeMode(value) {
	if (value === void 0) return;
	if (value === "direct") return false;
	if (value === "auto") return "auto";
	if (value === "code") return true;
	throw new Error("--code-mode must be one of direct, auto, code.");
}
function normalizeTimeoutSeconds(value) {
	const raw = value ?? String(AGENT_EXEC_DEFAULT_TIMEOUT_SECONDS);
	if (parseStrictNonNegativeInteger(raw) === void 0) throw new Error("--timeout must be a non-negative integer in seconds.");
	return raw;
}
function normalizeFallbacks(model, values) {
	const fallbacks = (values ?? []).map((value) => value.trim()).filter(Boolean);
	if (fallbacks.length > 0 && !model?.trim()) throw new Error("--fallback requires --model so the primary model is explicit.");
	return fallbacks;
}
async function requireDirectory(value, label) {
	const resolved = path.resolve(value);
	let stat;
	try {
		stat = await fs.stat(resolved);
	} catch (error) {
		throw new Error(`${label} does not exist: ${resolved}`, { cause: error });
	}
	if (!stat.isDirectory()) throw new Error(`${label} is not a directory: ${resolved}`);
	return resolved;
}
function setAgentExecEnvironment(params) {
	const previousStateDir = process.env.OPENCLAW_STATE_DIR;
	const previousConfigPath = process.env.OPENCLAW_CONFIG_PATH;
	const previousWorkspaceDir = process.env.OPENCLAW_WORKSPACE_DIR;
	process.env.OPENCLAW_STATE_DIR = params.stateDir;
	delete process.env.OPENCLAW_CONFIG_PATH;
	process.env.OPENCLAW_WORKSPACE_DIR = params.cwd;
	return () => {
		if (previousStateDir === void 0) delete process.env.OPENCLAW_STATE_DIR;
		else process.env.OPENCLAW_STATE_DIR = previousStateDir;
		if (previousConfigPath === void 0) delete process.env.OPENCLAW_CONFIG_PATH;
		else process.env.OPENCLAW_CONFIG_PATH = previousConfigPath;
		if (previousWorkspaceDir === void 0) delete process.env.OPENCLAW_WORKSPACE_DIR;
		else process.env.OPENCLAW_WORKSPACE_DIR = previousWorkspaceDir;
	};
}
function formatActiveGatewayExecRefusal(identity) {
	return `A Gateway is running for this state directory (pid ${identity.pid}, port ${identity.port}). Omit --state-dir to use isolated temporary state, or stop the Gateway first (${formatCliCommand("openclaw gateway stop")}).`;
}
function isStructuredTimeoutError(error) {
	if (findAgentRunTerminalOutcome(error)?.status === "timeout") return true;
	let candidate = error;
	for (let depth = 0; depth < 4; depth += 1) {
		if (!candidate || typeof candidate !== "object") return false;
		const record = candidate;
		if (record.name === "TimeoutError" || record.code === "ETIMEDOUT" || record.reason === "timeout") return true;
		candidate = record.cause;
	}
	return false;
}
function errorEnvelope(error, sessionId) {
	const status = isStructuredTimeoutError(error) ? "timeout" : "error";
	return {
		ok: false,
		status,
		final: "",
		payloads: [],
		model: null,
		provider: null,
		sessionId,
		error: {
			message: formatErrorMessage(error),
			kind: status === "timeout" ? "timeout" : "exception"
		}
	};
}
function writeAgentExecOutput(runtime, envelope, json) {
	if (json) writeRuntimeJson(runtime, envelope);
	else if (envelope.final) writeRuntimeStdout(runtime, envelope.final);
	if (!envelope.ok && envelope.error) runtime.error(envelope.error.message);
}
/** Run one isolated embedded agent turn and project its stable CLI result. */
async function agentExecCommand(positionalMessage, opts, runtime, deps = {}) {
	const sessionId = randomUUID();
	const abortController = new AbortController();
	const signal = deps.abortSignal ? AbortSignal.any([abortController.signal, deps.abortSignal]) : abortController.signal;
	const toolBudget = createAgentToolExecutionBudget({
		maxToolCalls: deps.maxToolCalls,
		signal,
		abort: (reason) => abortController.abort(reason),
		isCurrent: deps.isCurrent
	});
	let timeoutTimer;
	let cleanupProcessScope;
	let commandResult;
	const runtimeCleanup = createAgentCleanupScope();
	let temporaryStateDir;
	let restoreEnvironment;
	let restoreConfigEnvironment;
	let restoreRuntimeConfigSnapshot;
	let runtimePaths;
	let configIo;
	let stopLocalAuditWriter;
	let stateLock;
	let temporaryDatabaseScope;
	let abortSignal = signal;
	let signalBridge;
	try {
		signal.throwIfAborted();
		if (deps.maxToolCalls !== void 0 && (!Number.isSafeInteger(deps.maxToolCalls) || deps.maxToolCalls < 0)) throw new Error("maxToolCalls must be a non-negative safe integer");
		if (deps.timeoutMs !== void 0) {
			if (!Number.isSafeInteger(deps.timeoutMs) || deps.timeoutMs <= 0) throw new Error("timeoutMs must be a positive safe integer");
			timeoutTimer = setTimeout(() => abortController.abort(new DOMException("Agent execution deadline elapsed", "TimeoutError")), deps.timeoutMs);
			timeoutTimer.unref();
		}
		const codeModeOverride = normalizeCodeMode(opts.codeMode);
		const prompt = await resolveAgentExecPrompt(positionalMessage, opts.messageFile, deps.stdin ?? process.stdin);
		const cwd = await requireDirectory(opts.cwd ?? process.cwd(), "Working directory");
		const stateDir = opts.stateDir ? await requireDirectory(opts.stateDir, "State directory") : await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-agent-exec-"));
		temporaryStateDir = opts.stateDir ? void 0 : stateDir;
		configIo = await import("./io-CPLwHuZl.mjs");
		const previousRuntimeConfigSnapshot = configIo.getRuntimeConfigSnapshot();
		const snapshotIo = configIo;
		restoreRuntimeConfigSnapshot = () => {
			if (previousRuntimeConfigSnapshot) snapshotIo.setRuntimeConfigSnapshot(previousRuntimeConfigSnapshot);
			else snapshotIo.clearRuntimeConfigSnapshot();
		};
		const { restoreEnvChangesIfUnchanged, snapshotEnv } = configIo;
		const envBeforeConfigLoad = snapshotEnv(process.env);
		const baseConfig = deps.baseConfig ?? await resolveExecBaseConfig(opts);
		const envAfterConfigLoad = snapshotEnv(process.env);
		restoreConfigEnvironment = () => restoreEnvChangesIfUnchanged({
			env: process.env,
			before: envBeforeConfigLoad,
			after: envAfterConfigLoad
		});
		const runConfig = buildExecRunConfig({
			base: baseConfig,
			cwd,
			opts
		});
		const pluginInstallContext = opts.isolated !== true && opts.authEnvOnly !== true ? await import("./install-root-context-CSeE7bPS.mjs") : void 0;
		const pluginInstallRoots = pluginInstallContext?.resolvePluginInstallRoots();
		const timeout = normalizeTimeoutSeconds(deps.timeoutMs === void 0 ? opts.timeout : String(Math.ceil(deps.timeoutMs / 1e3)));
		const fallbacks = normalizeFallbacks(opts.model, deps.modelFallbacksOverride ?? opts.fallback);
		const { resolveAgentDir, resolveAmbientOwnerAgentId } = await import("./agent-scope-config-YrCdQ9uN.mjs");
		const execAgentId = resolveAmbientOwnerAgentId(baseConfig, deps.agentId, {
			surface: "agent exec",
			hint: "Set agents.defaults.systemAgent.agentId."
		});
		if (getInstallationTarget()) {
			const [{ resolveSandboxConfigForAgent }, { resolveExecToolConfig }] = await Promise.all([import("./config-CmZGy9SW.mjs"), import("./lazy-exec-tool-CMblXzO8.mjs")]);
			const execHost = resolveExecToolConfig({
				cfg: runConfig,
				agentId: execAgentId
			}).host;
			if (resolveSandboxConfigForAgent(runConfig, execAgentId).mode !== "off" || execHost === "node" || execHost === "sandbox") throw new Error(LOCAL_INSTALLATION_TARGET_UNSUPPORTED);
		}
		const storedAuthAgentDir = resolveAgentDir(baseConfig, execAgentId);
		runtimePaths = await import("./paths-bFNjVB0r.mjs");
		const storedAuthStateDir = runtimePaths.resolveStateDir();
		const processScopeKey = deps.timeoutMs !== void 0 || deps.maxToolCalls !== void 0 ? `agent:${execAgentId}:agent-exec:${sessionId}` : void 0;
		if (processScopeKey) {
			const { getProcessSupervisor } = await import("./supervisor-CaCgUea8.mjs");
			cleanupProcessScope = getProcessSupervisor().acquireScopeCleanup(processScopeKey, { processTree: "required-all" });
		}
		restoreEnvironment = setAgentExecEnvironment({
			stateDir,
			cwd
		});
		runtimePaths.pinRuntimePaths();
		if (temporaryStateDir) {
			const { createOpenClawDatabaseMaintenanceScope } = await import("./openclaw-state-db-async-lifecycle-DgJM3Y2C.mjs");
			temporaryDatabaseScope = createOpenClawDatabaseMaintenanceScope();
		}
		if (opts.stateDir) {
			const { acquireEmbeddedStateLock, createEmbeddedStateSignalBridge } = await import("./embedded-state-lock-BYJUg_WD.mjs");
			signalBridge = createEmbeddedStateSignalBridge(deps.process ?? process);
			abortSignal = AbortSignal.any([abortSignal, signalBridge.signal]);
			stateLock = await acquireEmbeddedStateLock({
				options: deps.gatewayLockOptions,
				signal: abortSignal,
				formatActiveGatewayRefusal: formatActiveGatewayExecRefusal
			});
		}
		snapshotIo.setRuntimeConfigSnapshot(runConfig);
		const [{ withAuthProfileStoreAgentDir, withEnvOnlyAuthProfileStore }, { withHostExecInheritedEnvOmitted }, { listKnownProviderAuthEnvVarNamesCore }, runAgent] = await Promise.all([
			import("./auth-profiles-ChKCcK-T.mjs"),
			import("./host-env-security-aoP6IiwY.mjs"),
			import("./provider-env-vars-BY5WlyfF.mjs"),
			deps.runAgent ? Promise.resolve(deps.runAgent) : import("./agent-CUacqy2D.mjs").then((module) => module.agentCommand)
		]);
		let fallbackExhausted = false;
		let resultErrorPayload;
		const silentRuntime = {
			log: () => {},
			error: (...args) => runtime.error(...args),
			exit: (code, exitOpts) => runtime.exit(code, exitOpts)
		};
		const invoke = async () => {
			abortSignal.throwIfAborted();
			deps.assertSourceCurrent?.();
			if (deps.isCurrent?.() === false) throw new Error("Agent execution scope is no longer active");
			return await runAgent({
				message: prompt,
				sessionId,
				...processScopeKey ? { sessionKey: processScopeKey } : {},
				agentId: execAgentId,
				workspaceDir: cwd,
				cwd,
				model: opts.model,
				codeModeOverride,
				thinking: opts.thinking,
				timeout,
				modelFallbacksOverride: fallbacks.length > 0 || deps.modelFallbacksOverride !== void 0 ? fallbacks : void 0,
				cleanupBundleMcpOnRunEnd: true,
				cleanupCliLiveSessionOnRunEnd: true,
				oneShotCliRun: true,
				abortSignal,
				assertSourceCurrent: deps.assertSourceCurrent,
				onModelFallbackExhausted: () => {
					fallbackExhausted = true;
				},
				onResultErrorPayload: (message) => {
					resultErrorPayload = message ?? true;
				}
			}, silentRuntime);
		};
		const runWithPluginInstallRoots = () => pluginInstallContext && pluginInstallRoots ? pluginInstallContext.withPluginInstallRoots(pluginInstallRoots, invoke) : invoke();
		const runWithAuthScope = () => opts.authEnvOnly === true ? withEnvOnlyAuthProfileStore(runWithPluginInstallRoots) : withAuthProfileStoreAgentDir(storedAuthAgentDir, storedAuthStateDir, runWithPluginInstallRoots);
		const run = async () => {
			if (isExecutionIdentityCollectionEnabled(runConfig)) try {
				stopLocalAuditWriter = (await import("./agent-local-audit-Crk3o8Bp.mjs")).startAgentLocalAuditWriter(runConfig, { stateDir });
			} catch {}
			return await toolBudget.run(() => withHostExecInheritedEnvOmitted(listKnownProviderAuthEnvVarNamesCore({ env: process.env }), runWithAuthScope));
		};
		const result = await runtimeCleanup.run(() => temporaryDatabaseScope ? temporaryDatabaseScope.run(run) : run());
		signal.throwIfAborted();
		if (!result) throw new Error("Agent run returned no result");
		const envelope = classifyAgentExecResult(result, fallbackExhausted, resultErrorPayload);
		if (!envelope.sessionId) envelope.sessionId = sessionId;
		commandResult = {
			envelope,
			exitCode: exitCodeForEnvelope(envelope),
			toolCalls: toolBudget.toolCalls
		};
	} catch (error) {
		const envelope = errorEnvelope(error, sessionId);
		commandResult = {
			envelope,
			exitCode: exitCodeForEnvelope(envelope),
			toolCalls: toolBudget.toolCalls
		};
	}
	let cleanupError = runtimeCleanup.outcome === "uncertain" ? /* @__PURE__ */ new Error("Agent runtime cleanup did not settle; state ownership retained until this process exits") : void 0;
	clearTimeout(timeoutTimer);
	if (cleanupProcessScope) {
		abortController.abort(/* @__PURE__ */ new Error("Agent execution completed"));
		try {
			await cleanupProcessScope();
		} catch (error) {
			cleanupError = error;
		}
	}
	const stopAudit = async () => await stopLocalAuditWriter?.();
	await (temporaryDatabaseScope ? temporaryDatabaseScope.run(stopAudit) : stopAudit()).catch(() => void 0);
	if (!cleanupError) await temporaryDatabaseScope?.close().catch((error) => {
		cleanupError = error;
	});
	if (!cleanupError) await stateLock?.release().catch((error) => {
		cleanupError = error;
	});
	const runCleanupStep = (step) => {
		try {
			step();
		} catch (error) {
			cleanupError ??= error;
		}
	};
	runCleanupStep(() => restoreEnvironment?.());
	runCleanupStep(() => restoreConfigEnvironment?.());
	runCleanupStep(() => configIo?.clearConfigCache());
	runCleanupStep(() => restoreRuntimeConfigSnapshot ? restoreRuntimeConfigSnapshot() : configIo?.clearRuntimeConfigSnapshot());
	runCleanupStep(() => runtimePaths?.pinRuntimePaths());
	if (temporaryStateDir && !cleanupError) try {
		await fs.rm(temporaryStateDir, {
			recursive: true,
			force: true
		});
	} catch (error) {
		cleanupError ??= error;
	}
	if (cleanupError) {
		recordAgentCleanupFailure();
		const cleanupFailure = /* @__PURE__ */ new Error(`Agent exec cleanup failed: ${formatErrorMessage(cleanupError)}`);
		if (commandResult.envelope.ok) {
			const envelope = errorEnvelope(cleanupFailure, sessionId);
			commandResult = {
				envelope,
				exitCode: exitCodeForEnvelope(envelope),
				toolCalls: toolBudget.toolCalls
			};
		} else runtime.error(cleanupFailure.message);
	}
	const receivedSignal = signalBridge?.getReceivedSignal();
	signalBridge?.dispose();
	if (receivedSignal) {
		runtime.exit(receivedSignal === "SIGINT" ? 130 : 143, { resetStream: process.stderr });
		return commandResult;
	}
	writeAgentExecOutput(runtime, commandResult.envelope, opts.json === true);
	return commandResult;
}
//#endregion
export { agentExecCommand };
