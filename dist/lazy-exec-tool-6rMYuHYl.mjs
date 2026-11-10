import { n as mergeGatewayAgentCliPath } from "./openclaw-cli-shim-NzMcmIk3.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import "./tool-catalog-DGlfxTaj.mjs";
import { d as withExecRequestOwners, o as captureExecRequestOwners } from "./exec-request-context-CWnK9ayt.mjs";
import { t as applyExecPolicyLayer } from "./exec-policy-CTi1mi_7.mjs";
import { t as bindAgentToolAvailability } from "./agent-tool-availability-DZN62JsD.mjs";
import { a as withInstallationTarget, n as getInstallationTarget } from "./installation-target-context-B9ZDUs_O.mjs";
import { i as resolveMergedSafeBinProfileFixtures } from "./exec-safe-bin-runtime-policy-_gMQWKKJ.mjs";
import { n as describeExecTool } from "./bash-tools.descriptions-Cf_AKbJ6.mjs";
import { t as resolveExecCommandHighlighting } from "./exec-command-highlighting-Co6wYJSc.mjs";
import { a as execSchema, i as createExecSchema, t as createExecToolExecutionTimeoutResolver } from "./exec-tool-timeout-nIvSSNNO.mjs";
import { Type } from "typebox";
//#region src/agents/lazy-exec-tool.ts
const bashToolsModuleLoader = createLazyImportLoader(() => import("./bash-tools-C8Xjw2dO.mjs"));
/** Build the exec tool lazily so non-shell agent surfaces avoid loading bash runtime code. */
function createLazyExecTool(defaults, presentation) {
	const installationTarget = getInstallationTarget();
	const requestOwners = captureExecRequestOwners({
		runId: defaults?.runId,
		sessionId: defaults?.sessionId
	});
	const processToolAvailabilityRef = defaults?.processToolAvailabilityRef ?? {};
	const execSchema$1 = createExecSchema(defaults);
	const execCompletionSchema = Type.Omit(execSchema$1, ["yieldMs", "background"]);
	let loadedTool;
	let loadingTool;
	const loadTool = () => {
		loadingTool ??= bashToolsModuleLoader.load().then(({ createExecTool }) => {
			loadedTool = withInstallationTarget(installationTarget, () => createExecTool(withExecRequestOwners({
				...defaults,
				processToolAvailabilityRef
			}, requestOwners)));
			return loadedTool;
		});
		return loadingTool;
	};
	return bindAgentToolAvailability({
		name: "exec",
		label: "exec",
		displaySummary: presentation?.displaySummary ?? "Run shell now.",
		getExecutionTimeoutMs: createExecToolExecutionTimeoutResolver(defaults),
		get description() {
			return presentation?.description ?? describeExecTool({
				hasCronTool: defaults?.hasCronTool === true,
				hasProcessTool: processToolAvailabilityRef.value,
				autoReview: defaults?.mode === "auto"
			});
		},
		get parameters() {
			return presentation?.parameters ?? (processToolAvailabilityRef.value === false ? execCompletionSchema : execSchema$1);
		},
		prepareBeforeToolCallParams: async (...args) => (await loadTool()).prepareBeforeToolCallParams?.(...args) ?? args[0],
		finalizeBeforeToolCallParams: (params, preparedParams) => loadedTool?.finalizeBeforeToolCallParams?.(params, preparedParams) ?? params,
		execute: async (toolCallId, params, signal, onUpdate) => (await loadTool()).execute(toolCallId, params, signal, onUpdate)
	}, {
		prepareBeforeNormalization: true,
		prepare: (_tool, callableTools) => {
			processToolAvailabilityRef.value = callableTools.has("process");
		},
		executionSchema: presentation?.parameters ? void 0 : () => execSchema
	});
}
/** Resolve global and per-agent exec defaults before runtime-only overrides. */
function resolveExecToolConfig(params) {
	const cfg = params.cfg;
	const globalExec = cfg?.tools?.exec;
	const agentExec = cfg && params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools?.exec : void 0;
	const layeredPolicy = applyExecPolicyLayer(applyExecPolicyLayer({}, globalExec), agentExec);
	const configuredPathPrepend = agentExec?.pathPrepend ?? globalExec?.pathPrepend;
	return {
		host: agentExec?.host ?? globalExec?.host,
		mode: layeredPolicy.mode,
		security: layeredPolicy.security,
		ask: layeredPolicy.ask,
		node: agentExec?.node ?? globalExec?.node,
		configuredPathPrepend,
		pathPrepend: mergeGatewayAgentCliPath(configuredPathPrepend),
		safeBins: agentExec?.safeBins ?? globalExec?.safeBins,
		strictInlineEval: agentExec?.strictInlineEval ?? globalExec?.strictInlineEval,
		commandHighlighting: resolveExecCommandHighlighting({
			config: cfg,
			agentId: params.agentId
		}),
		safeBinTrustedDirs: agentExec?.safeBinTrustedDirs ?? globalExec?.safeBinTrustedDirs,
		safeBinProfiles: resolveMergedSafeBinProfileFixtures({
			global: globalExec,
			local: agentExec
		}),
		reviewer: agentExec?.reviewer ?? globalExec?.reviewer,
		backgroundMs: agentExec?.backgroundMs ?? globalExec?.backgroundMs,
		timeoutSec: agentExec?.timeoutSeconds ?? globalExec?.timeoutSeconds,
		approvalRunningNoticeMs: agentExec?.approvalRunningNoticeMs ?? globalExec?.approvalRunningNoticeMs,
		cleanupMs: agentExec?.cleanupMs ?? globalExec?.cleanupMs,
		notifyOnExit: agentExec?.notifyOnExit ?? globalExec?.notifyOnExit,
		notifyOnExitEmptySuccess: agentExec?.notifyOnExitEmptySuccess ?? globalExec?.notifyOnExitEmptySuccess,
		applyPatch: agentExec?.applyPatch ?? globalExec?.applyPatch
	};
}
//#endregion
export { resolveExecToolConfig as n, createLazyExecTool as t };
