import { C as parseStrictNonNegativeInteger } from "./number-coercion-CuVhdCBs.mjs";
import { a as writeRuntimeJson, o as writeRuntimeStdout } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as getInstallationTarget, t as LOCAL_INSTALLATION_TARGET_UNSUPPORTED } from "./installation-target-context-BOfhXm_n.mjs";
import { n as recordAgentCleanupFailure, t as createAgentCleanupScope } from "./run-cleanup-timeout-PkWBWOyt.mjs";
import { n as isExecutionIdentityCollectionEnabled } from "./audit-config-BXFCjLO0.mjs";
import { n as findAgentRunTerminalOutcome } from "./agent-run-terminal-error-ByvrtDXD.mjs";
import { a as createAgentToolExecutionBudget } from "./agent-tool-source-execution-guard-Mz8w3cgU.mjs";
import { n as resolveAgentExecPrompt, r as resolveExecBaseConfig, t as buildExecRunConfig } from "./agent-exec-input-DamAnk4K.mjs";
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
/** Classify an embedded result into the strict `agent exec` process contract. */
function classifyAgentExecResult(result, fallbackExhausted = false, projectedErrorPayload) {
	const meta = result.meta;
	const errorPayload = result.payloads?.find((payload) => payload.isError === true);
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
	const previous = {
		OPENCLAW_STATE_DIR: process.env.OPENCLAW_STATE_DIR,
		OPENCLAW_CONFIG_PATH: process.env.OPENCLAW_CONFIG_PATH,
		OPENCLAW_WORKSPACE_DIR: process.env.OPENCLAW_WORKSPACE_DIR
	};
	process.env.OPENCLAW_STATE_DIR = params.stateDir;
	delete process.env.OPENCLAW_CONFIG_PATH;
	process.env.OPENCLAW_WORKSPACE_DIR = params.cwd;
	return () => {
		for (const [key, value] of Object.entries(previous)) if (value === void 0) delete process.env[key];
		else process.env[key] = value;
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
async function agentExecCommand(positionalMessage, opts, runtime) {
	const sessionId = randomUUID();
	const abortController = new AbortController();
	const signal = abortController.signal;
	const toolBudget = createAgentToolExecutionBudget({
		signal,
		abort: (reason) => abortController.abort(reason)
	});
	const resultForEnvelope = (envelope) => ({
		envelope,
		exitCode: envelope.status === "ok" ? 0 : envelope.status === "timeout" ? 2 : 1,
		toolCalls: toolBudget.toolCalls
	});
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
		const codeModeOverride = normalizeCodeMode(opts.codeMode);
		const prompt = await resolveAgentExecPrompt(positionalMessage, opts.messageFile, process.stdin);
		const cwd = await requireDirectory(opts.cwd ?? process.cwd(), "Working directory");
		const stateDir = opts.stateDir ? await requireDirectory(opts.stateDir, "State directory") : await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-agent-exec-"));
		temporaryStateDir = opts.stateDir ? void 0 : stateDir;
		configIo = await import("./io-BM-qEheD.mjs");
		const previousRuntimeConfigSnapshot = configIo.getRuntimeConfigSnapshot();
		const snapshotIo = configIo;
		restoreRuntimeConfigSnapshot = () => {
			if (previousRuntimeConfigSnapshot) snapshotIo.setRuntimeConfigSnapshot(previousRuntimeConfigSnapshot);
			else snapshotIo.clearRuntimeConfigSnapshot();
		};
		const { restoreEnvChangesIfUnchanged, snapshotEnv } = configIo;
		const envBeforeConfigLoad = snapshotEnv(process.env);
		const baseConfig = await resolveExecBaseConfig(opts);
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
		const pluginInstallContext = opts.isolated !== true && opts.authEnvOnly !== true ? await import("./install-root-context-DqumpVmG.mjs") : void 0;
		const pluginInstallRoots = pluginInstallContext?.resolvePluginInstallRoots();
		const timeout = normalizeTimeoutSeconds(opts.timeout);
		const fallbacks = normalizeFallbacks(opts.model, opts.fallback);
		const { resolveAgentDir, resolveAmbientOwnerAgentId } = await import("./agent-scope-config-ChvRzaVS.mjs");
		const execAgentId = resolveAmbientOwnerAgentId(baseConfig, void 0, {
			surface: "agent exec",
			hint: "Set agents.defaults.systemAgent.agentId."
		});
		if (getInstallationTarget()) {
			const [{ resolveSandboxConfigForAgent }, { resolveExecToolConfig }] = await Promise.all([import("./config-CNeZ2G7f.mjs"), import("./lazy-exec-tool-C7WhNzMp.mjs")]);
			const execHost = resolveExecToolConfig({
				cfg: runConfig,
				agentId: execAgentId
			}).host;
			if (resolveSandboxConfigForAgent(runConfig, execAgentId).mode !== "off" || execHost === "node" || execHost === "sandbox") throw new Error(LOCAL_INSTALLATION_TARGET_UNSUPPORTED);
		}
		const storedAuthAgentDir = resolveAgentDir(baseConfig, execAgentId);
		runtimePaths = await import("./paths-CEShgFTd.mjs");
		const storedAuthStateDir = runtimePaths.resolveStateDir();
		restoreEnvironment = setAgentExecEnvironment({
			stateDir,
			cwd
		});
		runtimePaths.pinRuntimePaths();
		if (temporaryStateDir) {
			const { createOpenClawDatabaseMaintenanceScope } = await import("./openclaw-state-db-async-lifecycle-B0GRf5rO.mjs");
			temporaryDatabaseScope = createOpenClawDatabaseMaintenanceScope();
		}
		if (opts.stateDir) {
			const { acquireEmbeddedStateLock, createEmbeddedStateSignalBridge } = await import("./embedded-state-lock-D8oeMbOz.mjs");
			signalBridge = createEmbeddedStateSignalBridge(process);
			abortSignal = AbortSignal.any([abortSignal, signalBridge.signal]);
			stateLock = await acquireEmbeddedStateLock({
				signal: abortSignal,
				formatActiveGatewayRefusal: formatActiveGatewayExecRefusal
			});
		}
		snapshotIo.setRuntimeConfigSnapshot(runConfig);
		const [{ withAuthProfileStoreAgentDir, withEnvOnlyAuthProfileStore }, { withHostExecInheritedEnvOmitted }, { listKnownProviderAuthEnvVarNamesCore }, { agentCommand }] = await Promise.all([
			import("./auth-profiles-Dmn1qebk.mjs"),
			import("./host-env-security-BRA7KmT_.mjs"),
			import("./provider-env-vars-DA51mtIL.mjs"),
			import("./agent-CKXhOBT7.mjs")
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
			return await agentCommand({
				message: prompt,
				sessionId,
				agentId: execAgentId,
				workspaceDir: cwd,
				cwd,
				model: opts.model,
				codeModeOverride,
				thinking: opts.thinking,
				timeout,
				modelFallbacksOverride: fallbacks.length > 0 ? fallbacks : void 0,
				cleanupBundleMcpOnRunEnd: true,
				cleanupCliLiveSessionOnRunEnd: true,
				oneShotCliRun: true,
				abortSignal,
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
				stopLocalAuditWriter = (await import("./agent-local-audit-B5ieyHSf.mjs")).startAgentLocalAuditWriter(runConfig, { stateDir });
			} catch {}
			return await toolBudget.run(() => withHostExecInheritedEnvOmitted(listKnownProviderAuthEnvVarNamesCore({ env: process.env }), runWithAuthScope));
		};
		const result = await runtimeCleanup.run(() => temporaryDatabaseScope ? temporaryDatabaseScope.run(run) : run());
		signal.throwIfAborted();
		if (!result) throw new Error("Agent run returned no result");
		const envelope = classifyAgentExecResult(result, fallbackExhausted, resultErrorPayload);
		if (!envelope.sessionId) envelope.sessionId = sessionId;
		commandResult = resultForEnvelope(envelope);
	} catch (error) {
		commandResult = resultForEnvelope(errorEnvelope(error, sessionId));
	}
	let cleanupError = runtimeCleanup.outcome === "uncertain" ? /* @__PURE__ */ new Error("Agent runtime cleanup did not settle; state ownership retained until this process exits") : void 0;
	const stopAudit = async () => await stopLocalAuditWriter?.();
	await (temporaryDatabaseScope ? temporaryDatabaseScope.run(stopAudit) : stopAudit()).catch(() => void 0);
	if (!cleanupError && temporaryStateDir) {
		const { closeOpenClawAgentDatabasesAsync } = await import("./openclaw-agent-db-lifecycle-CxGnM_Lx.mjs");
		await closeOpenClawAgentDatabasesAsync(temporaryStateDir).catch((error) => {
			cleanupError = error;
		});
	}
	if (!cleanupError && temporaryStateDir) {
		const [{ closeOpenClawStateDatabaseByPathAsync }, { resolveOpenClawStateSqlitePath }] = await Promise.all([import("./openclaw-state-db-cache-CumK1G_0.mjs"), import("./openclaw-state-db.paths-BEzdbteY.mjs")]);
		await closeOpenClawStateDatabaseByPathAsync(resolveOpenClawStateSqlitePath({
			...process.env,
			OPENCLAW_STATE_DIR: temporaryStateDir
		})).catch((error) => {
			cleanupError = error;
		});
	}
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
		if (commandResult.envelope.ok) commandResult = resultForEnvelope(errorEnvelope(cleanupFailure, sessionId));
		else runtime.error(cleanupFailure.message);
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
