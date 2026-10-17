import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import "./tool-catalog-DyHnjiiS.mjs";
import { a as withInstallationTarget, n as getInstallationTarget } from "./installation-target-context-BOfhXm_n.mjs";
import { t as applyExecPolicyLayer } from "./exec-policy-DDPEdabr.mjs";
import { t as bindAgentToolAvailability } from "./agent-tool-availability-Bgm3tNkT.mjs";
import { n as execSchema, t as execCompletionSchema } from "./bash-tools.schemas-CYQpq8j2.mjs";
import { i as resolveMergedSafeBinProfileFixtures } from "./exec-safe-bin-runtime-policy-DWi4kqiG.mjs";
import { n as mergeGatewayAgentCliPath } from "./openclaw-cli-shim-I4WwJOH3.mjs";
import { n as describeExecTool } from "./bash-tools.descriptions-CdVoGX1S.mjs";
import { t as resolveExecCommandHighlighting } from "./exec-command-highlighting-D4gXcVK8.mjs";
import { t as createExecToolExecutionTimeoutResolver } from "./exec-tool-timeout-MN_b5T-U.mjs";
//#region src/agents/lazy-exec-tool.ts
const bashToolsModuleLoader = createLazyImportLoader(() => import("./bash-tools-DyD_VuDC.mjs"));
/** Build the exec tool lazily so non-shell agent surfaces avoid loading bash runtime code. */
function createLazyExecTool(defaults, presentation) {
	const installationTarget = getInstallationTarget();
	const processToolAvailabilityRef = defaults?.processToolAvailabilityRef ?? {};
	let loadedTool;
	let loadingTool;
	const loadTool = () => {
		if (loadedTool) return Promise.resolve(loadedTool);
		loadingTool ??= bashToolsModuleLoader.load().then(({ createExecTool }) => {
			loadedTool = withInstallationTarget(installationTarget, () => createExecTool({
				...defaults,
				processToolAvailabilityRef
			}));
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
			return presentation?.parameters ?? (processToolAvailabilityRef.value === false ? execCompletionSchema : execSchema);
		},
		prepareBeforeToolCallParams: async (...args) => (await loadTool()).prepareBeforeToolCallParams?.(...args) ?? args[0],
		finalizeBeforeToolCallParams: (params, preparedParams) => loadedTool?.finalizeBeforeToolCallParams?.(params, preparedParams) ?? params,
		execute: async (toolCallId, params, signal, onUpdate) => (await loadTool()).execute(toolCallId, params, signal, onUpdate)
	}, {
		prepareBeforeNormalization: true,
		prepare: (_tool, callableTools) => {
			processToolAvailabilityRef.value = callableTools.has("process");
		}
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
