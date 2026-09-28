import { a as resolveCodexPrivateLauncher, i as readCodexAppServerConfigOptions } from "./launch-args-DbFCehO7.mjs";
import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { d as readCodexEffectiveConfig } from "./config-options-BvaRs51b.mjs";
import "./config-BoTP_mrL.mjs";
import { n as resolveCodexAppServerRuntimeOptions } from "./config-runtime-C8Rw1m1m.mjs";
import { u as isCodexAppServerStartSelectionChangedError } from "./shared-client-DA4VR4Eb.mjs";
import { E as createCodexElicitationResponse, S as assertCodexTurnStartResponse, w as readCodexErrorNotification, x as assertCodexThreadStartResponse } from "./client-Cs08OXVQ.mjs";
import { o as closeCodexStartupClientBestEffort, s as interruptCodexTurnAndWaitBestEffort, t as CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS } from "./attempt-client-cleanup-CEv1cKwF.mjs";
import { t as CodexEphemeralTurn } from "./ephemeral-turn-poidXgek.mjs";
import { r as readModelListResult } from "./models-KnqBv0hE.mjs";
import { L as attestCodexRestrictedToolSurfaceMcpServersDisabled, l as readCodexInheritedMcpServerNames, n as buildCodexRingZeroThreadConfigPatch, r as buildCodexRuntimeThreadConfig, t as assertCodexManagedRequirementsDoNotOverrideToolPolicy, xt as mergeCodexThreadConfigs } from "./thread-requests-BLvGkP2R.mjs";
import { M as resolveCodexAppServerReasoningEffort } from "./thread-lifecycle-B3mfz1TG.mjs";
import { a as resolveCodexPromptError } from "./usage-limit-error-DUMbefVY.mjs";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { parse } from "smol-toml";
import path from "node:path";
import fs from "node:fs/promises";
import { canonicalPathFromExistingAncestor, isPathInside } from "openclaw/plugin-sdk/file-access-runtime";
import { resolvePreferredOpenClawTmpDir, withTempWorkspace } from "openclaw/plugin-sdk/temp-path";
//#region extensions/codex/src/app-server/bounded-hook-policy.ts
function assertNoHookDeclarations(config) {
	if (config.hooks === void 0) return;
	if (!isJsonObject(config.hooks) || Object.entries(config.hooks).some(([event, value]) => event === "state" ? !isJsonObject(value) : !Array.isArray(value) || value.length > 0)) throw new Error("Codex private completion received unmanaged hook declarations");
}
async function assertPrivateLayerPath(value, root) {
	if (typeof value !== "string" || !path.isAbsolute(value) || !isPathInside(root, await canonicalPathFromExistingAncestor(value))) throw new Error("Codex private completion inherited an external user or project config layer");
}
/** Proves hook discovery is confined to managed policy and this completion's private roots. */
async function assertCodexPrivateHookIsolation(client, workspace, signal) {
	signal?.throwIfAborted();
	const [codexHome, cwd] = await Promise.all([fs.realpath(workspace.codexHome), fs.realpath(workspace.cwd)]);
	const response = await readCodexEffectiveConfig(client, cwd, { signal });
	const features = response.config.features;
	if (!isJsonObject(features) || typeof features.hooks !== "boolean" || features.plugins !== false || !Array.isArray(response.config.project_root_markers) || response.config.project_root_markers.length !== 0) throw new Error("Codex private completion could not verify isolated hook discovery settings");
	if (!Array.isArray(response.layers)) throw new Error("Codex private completion config/read omitted config layers");
	let privateUserLayer = false;
	for (const layer of response.layers) {
		if (!isJsonObject(layer) || !isJsonObject(layer.name) || !isJsonObject(layer.config)) throw new Error("Codex private completion config/read returned invalid config layers");
		switch (layer.name.type) {
			case "user":
				await assertPrivateLayerPath(layer.name.file, codexHome);
				privateUserLayer = true;
				break;
			case "project":
				await assertPrivateLayerPath(layer.name.dotCodexFolder, cwd);
				break;
			case "packagedDefaults":
			case "sessionFlags":
				assertNoHookDeclarations(layer.config);
				break;
			case "system":
			case "mdm":
			case "enterpriseManaged": break;
			default: throw new Error("Codex private completion received an unsupported config layer");
		}
	}
	if (!privateUserLayer) throw new Error("Codex private completion could not verify its private Codex home");
	signal?.throwIfAborted();
	if (!features.hooks) {
		const requirementsResponse = await client.request("configRequirements/read", {}, { signal });
		if (!isJsonObject(requirementsResponse) || !isJsonObject(requirementsResponse.requirements) || !isJsonObject(requirementsResponse.requirements.featureRequirements) || requirementsResponse.requirements.featureRequirements.hooks !== false) throw new Error("Codex private completion cannot disable hooks without a managed requirement");
		return { activeManagedHooks: false };
	}
	const inventory = await client.request("hooks/list", { cwds: [cwd] }, { signal });
	if (!isJsonObject(inventory) || !Array.isArray(inventory.data) || inventory.data.length !== 1 || inventory.nextCursor !== void 0 && inventory.nextCursor !== null) throw new Error("Codex private completion received an incomplete hook inventory");
	const entry = inventory.data[0];
	if (!isJsonObject(entry) || entry.cwd !== cwd || !Array.isArray(entry.hooks) || !Array.isArray(entry.errors) || entry.errors.length !== 0 || !Array.isArray(entry.warnings) || entry.warnings.length !== 0) throw new Error("Codex private completion could not verify its hook inventory");
	let activeManagedHooks = false;
	for (const hook of entry.hooks) {
		if (!isJsonObject(hook) || typeof hook.key !== "string" || !hook.key.trim() || typeof hook.enabled !== "boolean" || typeof hook.isManaged !== "boolean") throw new Error("Codex private completion received invalid hook metadata");
		if (hook.enabled && !hook.isManaged) throw new Error("Codex private completion cannot run unmanaged hooks");
		activeManagedHooks ||= hook.enabled && hook.isManaged;
	}
	signal?.throwIfAborted();
	return { activeManagedHooks };
}
//#endregion
//#region extensions/codex/src/app-server/bounded-turn.ts
const CODEX_APP_SERVER_ARGS_ENV_KEY = "OPENCLAW_CODEX_APP_SERVER_ARGS";
const CODEX_BOUNDED_THREAD_CONFIG = {
	"agents.enabled": false,
	"features.multi_agent": false,
	"features.multi_agent_v2": false,
	"features.apps": false,
	"features.plugins": false,
	"features.image_generation": false,
	"features.standalone_web_search": false,
	web_search: "disabled"
};
const CODEX_PRIVATE_BOUNDED_THREAD_CONFIG = {
	"features.hooks": false,
	project_root_markers: [],
	notify: []
};
const CODEX_SETTLED_FINALIZER_THREAD_CONFIG = {
	"skills.include_instructions": false,
	include_environment_context: false
};
var CodexBoundedTurnTimeoutError = class extends Error {
	constructor(taskLabel, timeoutMs) {
		const bound = timeoutMs % 1e3 === 0 ? `${timeoutMs / 1e3}s` : `${timeoutMs}ms`;
		super(`codex app-server ${taskLabel} turn timed out after ${bound}`);
		this.name = "TimeoutError";
	}
};
async function runBoundedCodexAppServerTurn(params) {
	params.assertCurrent?.();
	const appServer = resolveCodexAppServerRuntimeOptions({
		pluginConfig: params.options.pluginConfig,
		managedCommandOrder: params.isolation === "private-stdio" ? "package-first" : void 0
	});
	if (params.isolation === "configured-transport") return await runBoundedCodexAppServerTurnInWorkspace(params, appServer, { cwd: params.agentDir?.trim() || process.cwd() });
	if (appServer.start.transport !== "stdio") throw new Error("Bounded Codex turns require stdio transport so native tools can be isolated.");
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "codex-bounded-turn-"
	}, async (workspace) => {
		const codexHome = path.join(workspace.dir, "codex-home");
		const cwd = path.join(workspace.dir, "workspace");
		await Promise.all([fs.mkdir(codexHome, { recursive: true }), fs.mkdir(cwd, { recursive: true })]);
		return await runBoundedCodexAppServerTurnInWorkspace(params, appServer, {
			codexHome,
			cwd
		});
	});
}
async function runBoundedCodexAppServerTurnInWorkspace(params, appServer, workspace, selectionAttempt = 0, timing) {
	const totalTimeoutMs = timing?.timeoutMs ?? resolveTimerTimeoutMs(params.timeoutMs, 100, 100);
	const timeoutError = new CodexBoundedTurnTimeoutError(params.taskLabel, totalTimeoutMs);
	const deadline = timing?.deadline ?? performance.now() + totalTimeoutMs;
	const timeoutMs = deadline - performance.now();
	if (timeoutMs <= 0) throw timeoutError;
	params.assertCurrent?.();
	const agentDir = params.agentDir?.trim() || void 0;
	const startOptions = workspace.codexHome ? buildPrivateCodexAppServerStartOptions(appServer.start, workspace.codexHome, workspace.cwd, params.requireNoExternalCapabilities === true) : appServer.start;
	const ownsClient = !params.options.clientFactory;
	const clientOptions = {
		startOptions,
		...params.preparedAuth ? { preparedAuth: params.preparedAuth } : { authProfileId: params.profile },
		authRequirement: params.authRequirement,
		agentDir,
		config: params.config,
		timeoutMs,
		assertCurrent: params.assertCurrent,
		...params.signal ? { abandonSignal: params.signal } : {}
	};
	const client = params.options.clientFactory ? await params.options.clientFactory(clientOptions) : await import("./shared-client-DA4VR4Eb.mjs").then((n) => n.y).then(({ createIsolatedCodexAppServerClient }) => createIsolatedCodexAppServerClient({
		...clientOptions,
		authProfileStore: params.authProfileStore
	}));
	const abortController = new AbortController();
	let activeThreadId;
	let activeTurnId = "";
	let interruptPromise;
	const requestInterrupt = () => {
		if (!activeThreadId || interruptPromise) return;
		interruptPromise = interruptCodexTurnAndWaitBestEffort(client, {
			threadId: activeThreadId,
			turnId: activeTurnId,
			timeoutMs: CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS
		});
	};
	const abortRun = (reason) => {
		abortController.abort(reason);
		requestInterrupt();
	};
	const abortFromCaller = () => abortRun(params.signal?.reason ?? "aborted");
	if (params.signal?.aborted) abortFromCaller();
	else params.signal?.addEventListener("abort", abortFromCaller, { once: true });
	const remainingRunMs = deadline - performance.now();
	if (remainingRunMs <= 0) abortRun(timeoutError);
	const timeout = setTimeout(() => abortRun(timeoutError), Math.max(1, remainingRunMs));
	timeout.unref?.();
	let retrySelection = false;
	const requestOptions = {
		timeoutMs,
		signal: abortController.signal,
		assertCurrent: params.assertCurrent
	};
	try {
		params.assertCurrent?.();
		const modelSelection = await resolveCodexBoundedTurnModel({
			client,
			selection: params.model,
			requiredModalities: params.requiredModalities,
			...requestOptions
		});
		const inheritedMcpServerNames = params.requireNoExternalCapabilities ? await readCodexInheritedMcpServerNames(client, workspace.cwd, abortController.signal) : [];
		let enableManagedHooks = false;
		if (params.requireNoExternalCapabilities) {
			let privateManagedHooksPresent = false;
			if (workspace.codexHome) privateManagedHooksPresent = (await assertCodexPrivateHookIsolation(client, {
				codexHome: workspace.codexHome,
				cwd: workspace.cwd
			}, abortController.signal)).activeManagedHooks;
			({enableManagedHooks} = await assertCodexManagedRequirementsDoNotOverrideToolPolicy(client, {
				restrictedToolSurface: true,
				allowConfiguredManagedHooks: workspace.codexHome !== void 0,
				privateManagedHooksPresent
			}, abortController.signal));
		}
		const threadConfig = buildCodexRuntimeThreadConfig(resolveBoundedThreadConfig(params, workspace, inheritedMcpServerNames, enableManagedHooks), { nativeCodeModeEnabled: false });
		params.assertCurrent?.();
		const thread = assertCodexThreadStartResponse(await client.request("thread/start", {
			model: modelSelection.model,
			...params.modelProvider ? { modelProvider: params.modelProvider } : {},
			cwd: workspace.cwd,
			approvalPolicy: "on-request",
			sandbox: "read-only",
			serviceName: "OpenClaw",
			...params.requireNoExternalCapabilities ? { baseInstructions: "" } : {},
			developerInstructions: params.developerInstructions,
			config: threadConfig,
			environments: [],
			dynamicTools: [],
			experimentalRawEvents: true,
			ephemeral: true
		}, requestOptions));
		activeThreadId = thread.thread.id;
		if (abortController.signal.aborted) requestInterrupt();
		if (params.requireNoExternalCapabilities) await attestCodexRestrictedToolSurfaceMcpServersDisabled(client, thread.thread.id, threadConfig, abortController.signal);
		if (params.historyItems?.length) await client.request("thread/inject_items", {
			threadId: thread.thread.id,
			items: params.historyItems
		}, requestOptions);
		params.assertCurrent?.();
		const collector = new CodexEphemeralTurn(client, thread.thread.id, {
			textMode: "all",
			onRequest: createCodexBoundedApprovalHandler(params.taskLabel)
		});
		try {
			const turn = assertCodexTurnStartResponse(await client.request("turn/start", {
				threadId: thread.thread.id,
				input: params.input,
				approvalPolicy: "on-request",
				effort: params.thinkLevel === void 0 ? "low" : resolveCodexAppServerReasoningEffort({
					thinkLevel: params.thinkLevel,
					modelId: modelSelection.model,
					supportedReasoningEfforts: modelSelection.supportedReasoningEfforts
				})
			}, requestOptions));
			activeTurnId = turn.turn.id;
			if (abortController.signal.aborted) requestInterrupt();
			const result = await collector.wait(turn.turn, {
				signal: abortController.signal,
				abortError: () => resolveCodexBoundedTurnAbortError(abortController.signal, params.taskLabel, timeoutError)
			});
			if (result.error || result.turn?.status === "failed") {
				const source = result.error ? readCodexErrorNotification(result.error)?.error : result.turn?.error;
				const failure = source ? resolveCodexPromptError(source) : void 0;
				throw failure instanceof Error ? failure : new Error(failure ?? `codex app-server ${params.taskLabel} turn failed`);
			}
			if (result.turn?.status !== "completed") throw new Error(`codex app-server ${params.taskLabel} turn ended with status ${result.turn?.status ?? "unknown"}`);
			const lastHookPrompt = enableManagedHooks ? result.items.findLastIndex((item) => item.type === "hookPrompt") : -1;
			const text = lastHookPrompt < 0 ? result.text : result.items.slice(lastHookPrompt + 1).filter((item) => item.type === "agentMessage").map((item) => item.text?.trim()).filter(Boolean).join("\n\n");
			if (!text && !params.allowEmptyText) throw new Error(`Codex app-server ${params.taskLabel} turn returned no text.`);
			params.assertCurrent?.();
			return {
				text,
				items: result.items,
				usage: result.usage,
				model: modelSelection.id,
				nativeSelection: {
					model: thread.model,
					modelProvider: thread.modelProvider
				},
				managedHooksEnabled: enableManagedHooks
			};
		} finally {
			await interruptPromise;
			collector.route.release();
		}
	} catch (error) {
		if (abortController.signal.aborted) throw resolveCodexBoundedTurnAbortError(abortController.signal, params.taskLabel, timeoutError);
		if (ownsClient && isCodexAppServerStartSelectionChangedError(error) && selectionAttempt === 0) retrySelection = true;
		else throw error;
	} finally {
		clearTimeout(timeout);
		params.signal?.removeEventListener("abort", abortFromCaller);
		await interruptPromise;
		if (ownsClient) await closeCodexStartupClientBestEffort(client);
	}
	if (retrySelection) return await runBoundedCodexAppServerTurnInWorkspace(params, appServer, workspace, selectionAttempt + 1, {
		deadline,
		timeoutMs: totalTimeoutMs
	});
	throw new Error("Codex bounded turn selection retry exited unexpectedly");
}
function resolveBoundedThreadConfig(params, workspace, inheritedMcpServerNames, enableManagedHooks) {
	const boundedConfig = mergeCodexThreadConfigs(CODEX_BOUNDED_THREAD_CONFIG, params.threadConfig) ?? CODEX_BOUNDED_THREAD_CONFIG;
	const privateConfig = workspace.codexHome ? mergeCodexThreadConfigs(boundedConfig, CODEX_PRIVATE_BOUNDED_THREAD_CONFIG) ?? boundedConfig : boundedConfig;
	if (!params.requireNoExternalCapabilities) return privateConfig;
	return mergeCodexThreadConfigs(privateConfig, CODEX_SETTLED_FINALIZER_THREAD_CONFIG, buildCodexRingZeroThreadConfigPatch({ toolsAllow: ["openclaw"] }, true, inheritedMcpServerNames), enableManagedHooks ? { "features.hooks": true } : void 0) ?? privateConfig;
}
function buildPrivateCodexAppServerStartOptions(start, codexHome, cwd, inspectManagedHooks) {
	const launchCwd = start.cwd ?? process.cwd();
	const { launcherArgs, nativeArgs } = resolveCodexPrivateLauncher({
		command: start.command,
		args: start.args,
		cwd: launchCwd
	});
	const providerArgs = readCodexAppServerConfigOptions(nativeArgs).flatMap(({ name, value }) => (name === "-c" || name === "--config") && value && /^\s*(?:openai_base_url|model_catalog_json)\s*=/u.test(value) ? ["-c", resolvePrivateProviderOverride(value, launchCwd)] : []);
	const privateEnv = Object.fromEntries(Object.entries(start.env ?? {}).filter(([name]) => name.trim().toUpperCase() !== CODEX_APP_SERVER_ARGS_ENV_KEY));
	const clearEnv = (start.clearEnv ?? []).filter((name) => {
		const normalized = name.trim().toUpperCase();
		return normalized !== "CODEX_HOME" && normalized !== CODEX_APP_SERVER_ARGS_ENV_KEY;
	});
	return {
		...start,
		command: !path.isAbsolute(start.command) && /[\\/]/u.test(start.command) ? path.resolve(launchCwd, start.command) : start.command,
		homeScope: "agent",
		cwd,
		args: [
			...launcherArgs,
			"app-server",
			...providerArgs,
			"-c",
			"project_root_markers=[]",
			...inspectManagedHooks ? [
				"-c",
				"features.hooks=true",
				"-c",
				"features.plugins=false"
			] : [],
			"--listen",
			"stdio://"
		],
		env: {
			...privateEnv,
			CODEX_HOME: codexHome
		},
		clearEnv: [...clearEnv, CODEX_APP_SERVER_ARGS_ENV_KEY]
	};
}
function resolvePrivateProviderOverride(override, launchCwd) {
	const separator = override.indexOf("=");
	if (override.slice(0, separator).trim() !== "model_catalog_json") return override;
	const rawPath = override.slice(separator + 1).trim();
	let catalogPath;
	try {
		catalogPath = parse(`path = ${rawPath}`).path;
	} catch {
		catalogPath = rawPath;
	}
	return typeof catalogPath === "string" && catalogPath && !path.isAbsolute(catalogPath) ? `model_catalog_json=${JSON.stringify(path.resolve(launchCwd, catalogPath))}` : override;
}
function createCodexBoundedApprovalHandler(taskLabel) {
	return (request) => {
		if (request.method === "item/commandExecution/requestApproval" || request.method === "item/fileChange/requestApproval") return {
			decision: "decline",
			reason: `OpenClaw Codex ${taskLabel} does not grant tool or file approvals.`
		};
		if (request.method === "item/permissions/requestApproval") return {
			permissions: {},
			scope: "turn"
		};
		if (request.method.includes("requestApproval")) return {
			decision: "decline",
			reason: `OpenClaw Codex ${taskLabel} does not grant native approvals.`
		};
		if (request.method === "mcpServer/elicitation/request") return createCodexElicitationResponse("decline", null, { message: `OpenClaw Codex ${taskLabel} does not support interactive input.` });
	};
}
async function resolveCodexBoundedTurnModel(params) {
	const result = await params.client.request("model/list", {
		limit: null,
		cursor: null,
		includeHidden: params.selection.mode === "required"
	}, {
		timeoutMs: Math.min(params.timeoutMs, 5e3),
		signal: params.signal,
		assertCurrent: params.assertCurrent
	});
	const listed = readModelListResult(result).models;
	if (params.selection.mode === "live-default") {
		const supported = listed.filter((entry) => params.requiredModalities.every((modality) => entry.inputModalities.includes(modality)));
		const selected = supported.find((entry) => entry.isDefault) ?? supported[0];
		if (!selected) throw new Error(`Codex app-server has no model supporting ${params.requiredModalities.join(" and ")} input.`);
		return selected;
	}
	const model = params.selection.id;
	const match = listed.find((entry) => entry.model === model || entry.id === model);
	if (!match) throw new Error(`Codex app-server model not found: ${model}`);
	if (params.requiredModalities.includes("image") && !match.inputModalities.includes("image")) throw new Error(`Codex app-server model does not support images: ${model}`);
	if (params.requiredModalities.includes("text") && !match.inputModalities.includes("text")) throw new Error(`Codex app-server model does not support text: ${model}`);
	return match;
}
function resolveCodexBoundedTurnAbortError(signal, taskLabel, timeoutError) {
	return signal.reason === timeoutError ? timeoutError : /* @__PURE__ */ new Error(`codex app-server ${taskLabel} turn aborted`);
}
//#endregion
export { runBoundedCodexAppServerTurn };
