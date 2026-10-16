import { t as GatewayScheduler } from "./gateway-scheduler-BYbkpAYn.mjs";
import { n as createOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { s as sanitizeHostExecEnv, u as withHostExecInheritedEnvOmitted } from "./host-env-security-BgpkByrc.mjs";
import { i as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-DPmgR5gM.mjs";
import { s as resolveCoreToolProfilePolicy } from "./tool-catalog-DyHnjiiS.mjs";
import { o as isToolAllowedByPolicies } from "./tool-policy-match-Dn8gpf-E.mjs";
import { l as mergeAlsoAllowPolicy } from "./tool-policy-BKvvmcQR.mjs";
import { r as getBoundLegacyPluginSdkResourceHost, t as LegacyPluginSdkResourceHost } from "./legacy-sdk-resource-host-DC4n8Jcn.mjs";
import { a as withInstallationTarget, r as installationTargetEnv, t as LOCAL_INSTALLATION_TARGET_UNSUPPORTED } from "./installation-target-context-BOfhXm_n.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-PkWBWOyt.mjs";
import { d as prepareSystemAgentRunAdmission } from "./admitted-run-context-QJnFIxUZ.mjs";
import { t as buildUpdateDoctorEnv } from "./update-runner-doctor-IwT8TmRH.mjs";
import { n as resolveEffectiveToolPolicy } from "./agent-tools.policy-Ni4Rljqy.mjs";
import { i as resolveSandboxConfigForAgent } from "./config-DGIfx80_.mjs";
import { a as createAgentToolExecutionBudget } from "./agent-tool-source-execution-guard-Mz8w3cgU.mjs";
import { n as resolveExecToolConfig } from "./lazy-exec-tool-DaqWwvlf.mjs";
import { t as SessionManager } from "./session-manager-B2n0aSnK.mjs";
import { i as extractAgentRunText, r as extractAgentRunTerminalError } from "./agent-run-result-BvkKJ5Uv.mjs";
import { t as buildExecRunConfig } from "./agent-exec-input-B-OqVUHX.mjs";
import { r as updateRepairMaintenanceTool, t as readUpdateRepairMaintenanceRequest } from "./update-repair-maintenance-BN12DnJS.mjs";
import { randomUUID } from "node:crypto";
//#region src/infra/update-repair-agent.runtime.ts
const repairRuntime = {
	log: () => {},
	error: () => {},
	exit: (code) => {
		throw new Error(`Repair agent exited (${code}).`);
	}
};
/** The orchestrator serializes this phase; restore every config-load env effect. */
async function withUpdateRepairEnvironment(target, run) {
	const [io, paths] = await Promise.all([import("./io-DWAGT1Vv.mjs"), import("./paths-CEShgFTd.mjs")]);
	const previousConfig = io.getRuntimeConfigSnapshot();
	const previousEnv = io.snapshotEnv(process.env);
	if (target.environment) {
		const environment = {};
		for (const key of Object.keys(process.env)) if (target.environment[key] !== void 0) environment[key] = process.env[key];
		for (const key of [
			"HOME",
			"USERPROFILE",
			"TMPDIR",
			"TMP",
			"TEMP",
			"XDG_CONFIG_HOME",
			"XDG_CACHE_HOME",
			"XDG_DATA_HOME",
			"XDG_STATE_HOME",
			"OPENCLAW_HOME",
			"OPENCLAW_AGENT_DIR",
			"PI_CODING_AGENT_DIR"
		]) environment[key] = target.environment[key];
		const sanitized = sanitizeHostExecEnv({ baseEnv: environment });
		for (const key of Object.keys(process.env)) if (sanitized[key] === void 0) delete process.env[key];
		Object.assign(process.env, sanitized);
	}
	Object.assign(process.env, installationTargetEnv({
		stateDir: target.stateDir,
		configPath: target.configPath,
		defaultWorkspaceDir: target.workspaceDir
	}), buildUpdateDoctorEnv({
		allowGatewayServiceRepair: false,
		allowGatewayActivation: false,
		serviceRepairPolicy: "external",
		deferConfiguredPluginInstallRepair: Boolean(target.environment)
	}));
	io.clearRuntimeConfigSnapshot();
	paths.pinRuntimePaths();
	try {
		return await run();
	} finally {
		io.restoreEnvChangesIfUnchanged({
			env: process.env,
			before: previousEnv,
			after: io.snapshotEnv(process.env)
		});
		if (previousConfig) io.setRuntimeConfigSnapshot(previousConfig);
		else io.clearRuntimeConfigSnapshot();
		paths.pinRuntimePaths();
	}
}
async function withRepairResources(run) {
	const existingHost = getBoundLegacyPluginSdkResourceHost();
	const scheduler = existingHost ? existingHost.scheduler : new GatewayScheduler();
	const host = existingHost ?? new LegacyPluginSdkResourceHost();
	if (!existingHost) host.bindScheduler(scheduler);
	const resources = createOpenClawDatabaseMaintenanceScope();
	const [outcome] = await Promise.allSettled([Promise.resolve().then(() => {
		host.assertOpen();
		scheduler.signal.throwIfAborted();
		return host.run(() => resources.run(run));
	})]);
	try {
		const [sdkCleanup] = await Promise.allSettled([existingHost ? Promise.resolve() : scheduler.stop().then(() => host.close())]);
		if (sdkCleanup.status === "rejected" && hasRetainedPluginRuntimeCloseError(sdkCleanup.reason)) throw sdkCleanup.reason;
		try {
			await resources.close();
		} catch (error) {
			if (sdkCleanup.status === "rejected") throw new AggregateError([sdkCleanup.reason, error], "Repair SDK and database resource cleanup failed.", { cause: error });
			throw error;
		}
		if (sdkCleanup.status === "rejected") throw sdkCleanup.reason;
	} catch (error) {
		recordAgentCleanupFailure();
		if (outcome.status === "rejected") throw new AggregateError([outcome.reason, error], "Repair turn and database resource cleanup failed.", { cause: error });
		throw error;
	}
	if (outcome.status === "rejected") throw outcome.reason;
	return outcome.value;
}
async function prepareUpdateRepairInference(signal, timeoutMs) {
	return withRepairResources(async () => {
		signal.throwIfAborted();
		const { getRuntimeConfig } = await import("./io-DWAGT1Vv.mjs");
		signal.throwIfAborted();
		const config = getRuntimeConfig();
		const { selectUpdateRepairInference } = await import("./update-repair-inference-6METGspN.mjs");
		signal.throwIfAborted();
		return await selectUpdateRepairInference({
			config,
			runtime: repairRuntime,
			signal,
			timeoutMs
		});
	});
}
function repairRunConfig(route, fallbacks) {
	const base = route.runConfig;
	const exec = resolveExecToolConfig({
		cfg: base,
		agentId: route.agentId
	});
	if (resolveSandboxConfigForAgent(base, route.agentId).mode !== "off" || exec.host === "node" || exec.host === "sandbox") return err(LOCAL_INSTALLATION_TARGET_UNSUPPORTED);
	const allowedToolsForModel = (modelProvider, modelId) => {
		const policy = resolveEffectiveToolPolicy({
			config: base,
			agentId: route.agentId,
			modelProvider,
			modelId
		});
		const policies = [
			policy.globalPolicy,
			policy.agentPolicy,
			policy.globalProviderPolicy,
			policy.agentProviderPolicy,
			mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(policy.profile), policy.profileAlsoAllow),
			mergeAlsoAllowPolicy(resolveCoreToolProfilePolicy(policy.providerProfile), policy.providerProfileAlsoAllow)
		];
		return [
			"exec",
			"process",
			"read",
			"write",
			"edit",
			"apply_patch"
		].filter((tool) => isToolAllowedByPolicies(tool, policies));
	};
	const permitsRepair = (tools) => [
		"exec",
		"write",
		"edit",
		"apply_patch"
	].every((tool) => tools.includes(tool));
	const allowedTools = allowedToolsForModel(route.provider, route.model);
	if (exec.security === "deny" || !permitsRepair(allowedTools)) return err("exec-denied-by-policy");
	const modelFallbacks = fallbacks.filter((ref) => {
		const slash = ref.indexOf("/");
		return permitsRepair(allowedToolsForModel(ref.slice(0, slash), ref.slice(slash + 1)));
	});
	const localExec = {
		host: "gateway",
		mode: "full",
		security: void 0,
		ask: void 0,
		node: void 0
	};
	const nativeModels = Object.fromEntries([route.modelLabel, ...modelFallbacks].map((ref) => [ref, {
		...base.agents?.defaults?.models?.[ref],
		...base.agents?.entries?.[route.agentId]?.models?.[ref],
		agentRuntime: { id: "openclaw" }
	}]));
	return ok({
		modelFallbacks,
		runConfig: {
			...base,
			agents: {
				...base.agents,
				defaults: {
					...base.agents?.defaults,
					models: {
						...base.agents?.defaults?.models,
						...nativeModels
					}
				},
				entries: Object.fromEntries(Object.entries(base.agents?.entries ?? {}).map(([id, entry]) => [id, {
					...entry,
					models: {
						...entry.models,
						...nativeModels
					},
					tools: {
						...entry.tools,
						exec: {
							...entry.tools?.exec,
							...localExec
						},
						fs: {
							...entry.tools?.fs,
							workspaceOnly: true
						}
					}
				}]))
			},
			tools: {
				...base.tools,
				profile: base.tools?.profile ?? "coding",
				allow: allowedTools,
				alsoAllow: base.tools?.alsoAllow?.length ? allowedTools : void 0,
				exec: {
					...base.tools?.exec,
					...localExec
				},
				fs: {
					...base.tools?.fs,
					workspaceOnly: true
				}
			}
		}
	});
}
async function runUpdateRepairTurn(params) {
	return withRepairResources(() => runScopedUpdateRepairTurn(params));
}
async function runScopedUpdateRepairTurn(params) {
	params.signal.throwIfAborted();
	const { route, target } = params;
	const config = repairRunConfig(route, params.modelFallbacks);
	if (!config.ok) return {
		status: "unavailable",
		reason: config.error
	};
	const { modelFallbacks } = config.value;
	const runConfig = buildExecRunConfig({
		base: config.value.runConfig,
		cwd: target.installRoot
	});
	const controller = new AbortController();
	const signal = AbortSignal.any([params.signal, controller.signal]);
	const isLive = params.isLive ?? params.isCurrent;
	const assertAuthority = (isCurrent) => {
		signal.throwIfAborted();
		if (isCurrent?.() === false) throw new Error("Repair no longer owns the failed update.");
	};
	const assertCurrent = () => assertAuthority(params.isCurrent);
	const runId = `update-repair-${randomUUID()}`;
	const sessionKey = `agent:${route.agentId}:update-repair:${runId}`;
	const preparedRunAdmission = prepareSystemAgentRunAdmission(runConfig, runId, route.agentId, "update.repair", () => assertAuthority(isLive));
	const toolBudget = createAgentToolExecutionBudget({
		maxToolCalls: params.maxToolCalls,
		signal,
		abort: (reason) => controller.abort(reason),
		isCurrent: params.isCurrent
	});
	const deadline = Date.now() + params.timeoutMs;
	let timedOut = false;
	const timeout = setTimeout(() => {
		timedOut = true;
		controller.abort(/* @__PURE__ */ new Error("per-turn-budget"));
	}, params.timeoutMs);
	let cleanupProcessScope;
	let maintenance;
	let envelope;
	try {
		const [{ runEmbeddedAgent }, { runEmbeddedAgentEntry }, { getProcessSupervisor }, secrets] = await Promise.all([
			import("./embedded-agent-BA01iFq8.mjs"),
			import("./run-entry-DnSGIfvz.mjs"),
			import("./supervisor-6F97TQuJ.mjs"),
			import("./provider-env-vars-DA51mtIL.mjs")
		]);
		assertCurrent();
		cleanupProcessScope = getProcessSupervisor().acquireScopeCleanup(sessionKey, { processTree: "required-all" });
		const sessionManager = SessionManager.inMemory(target.installRoot);
		const result = await withInstallationTarget({
			stateDir: target.stateDir,
			configPath: target.configPath,
			defaultWorkspaceDir: target.workspaceDir
		}, () => toolBudget.run(() => withHostExecInheritedEnvOmitted(secrets.listKnownProviderAuthEnvVarNamesCore({ env: process.env }), () => runEmbeddedAgentEntry({
			preparedRunAdmission,
			selection: {
				cfg: runConfig,
				provider: route.provider,
				model: route.model,
				agentDir: route.agentDir,
				userLockedAuthProfileId: route.authProfileId,
				fallbacksOverride: modelFallbacks,
				requestedRouteResolution: "resolved"
			},
			identity: {
				runId,
				agentId: route.agentId,
				sessionId: runId,
				sessionKey
			},
			harness: {
				workspaceDir: target.installRoot,
				sessionKey,
				preparation: { kind: "direct" },
				resolveRuntimeOverride: () => "openclaw"
			},
			behavior: {
				kind: "command-rpc",
				hasCommittedSideEffect: () => toolBudget.toolCalls > 0
			},
			sessionOverride: { kind: "preserve" },
			abortSignal: signal,
			runCandidate: (provider, model, options) => {
				assertCurrent();
				return runEmbeddedAgent({
					...options,
					preparedRunAdmission,
					runId,
					sessionId: runId,
					sessionKey,
					sessionFile: `in-memory:${runId}`,
					sessionManager,
					sessionPersistence: "detached",
					agentId: route.agentId,
					agentDir: route.agentDir,
					workspaceDir: target.installRoot,
					cwd: target.installRoot,
					config: runConfig,
					prompt: params.prompt,
					clientTools: params.maintenanceHandoff ? [updateRepairMaintenanceTool] : void 0,
					provider,
					model,
					...route.authProfileId && provider === route.provider ? {
						authProfileId: route.authProfileId,
						authProfileIdSource: "user"
					} : {},
					modelFallbacksOverride: modelFallbacks,
					codeModeOverride: false,
					cleanupBundleMcpOnRunEnd: true,
					disableTrajectory: true,
					trigger: "manual",
					timeoutMs: Math.max(1, deadline - Date.now()),
					abortSignal: signal,
					lane: sessionKey
				});
			}
		}))));
		const error = extractAgentRunTerminalError(result.result);
		if (params.maintenanceHandoff && result.terminal.outcome.status === "ok" && !error) {
			assertCurrent();
			maintenance = readUpdateRepairMaintenanceRequest(result.result.meta);
		}
		envelope = {
			model: result.model,
			provider: result.provider,
			final: extractAgentRunText(result.result) ?? "",
			...error ? { error: { message: error } } : {},
			status: result.terminal.outcome.status
		};
	} catch (error) {
		envelope = {
			model: route.model,
			provider: route.provider,
			final: "",
			error: { message: error instanceof Error ? error.message : String(error) },
			status: timedOut ? "timeout" : "error"
		};
	} finally {
		clearTimeout(timeout);
		preparedRunAdmission.close();
		controller.abort(/* @__PURE__ */ new Error("Update repair turn completed"));
	}
	try {
		await cleanupProcessScope?.();
	} catch (error) {
		recordAgentCleanupFailure();
		throw error;
	}
	return {
		status: "completed",
		toolCalls: toolBudget.toolCalls,
		envelope,
		...maintenance ? { maintenance } : {}
	};
}
//#endregion
export { prepareUpdateRepairInference, runUpdateRepairTurn, withUpdateRepairEnvironment };
