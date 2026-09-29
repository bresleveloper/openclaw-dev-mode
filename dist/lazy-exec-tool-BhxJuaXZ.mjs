import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./tool-description-presets-CT4WhVkI.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { a as withInstallationTarget, n as getInstallationTarget } from "./installation-target-context-CrBRhZSM.mjs";
import { t as applyExecPolicyLayer } from "./exec-policy-L7B_Bk9D.mjs";
import { n as execSchema, t as execCompletionSchema } from "./bash-tools.schemas-O2t-ZZ0a.mjs";
import { n as mergeGatewayAgentCliPath } from "./openclaw-cli-shim-BjJciFCe.mjs";
import { n as describeExecTool } from "./bash-tools.descriptions-CdVoGX1S.mjs";
import { t as resolveExecCommandHighlighting } from "./exec-command-highlighting-CNVIN6KX.mjs";
import { i as resolveMergedSafeBinProfileFixtures } from "./exec-safe-bin-runtime-policy-eHJh3MzL.mjs";
import { t as createExecToolExecutionTimeoutResolver } from "./exec-tool-timeout-Ber3V3yq.mjs";
//#region src/agents/lazy-exec-tool.ts
const bashToolsModuleLoader = createLazyImportLoader(() => import("./bash-tools-BMQ3bHLb.mjs"));
/** Build the exec tool lazily so non-shell agent surfaces avoid loading bash runtime code. */
function createLazyExecTool(defaults, presentation) {
	const installationTarget = getInstallationTarget();
	let loadedTool;
	let loadingTool;
	const loadTool = () => {
		if (loadedTool) return Promise.resolve(loadedTool);
		loadingTool ??= bashToolsModuleLoader.load().then(({ createExecTool }) => {
			loadedTool = withInstallationTarget(installationTarget, () => createExecTool(defaults));
			return loadedTool;
		});
		return loadingTool;
	};
	return {
		name: "exec",
		label: "exec",
		displaySummary: presentation?.displaySummary ?? "Run shell now.",
		getExecutionTimeoutMs: createExecToolExecutionTimeoutResolver(defaults),
		get description() {
			return presentation?.description ?? describeExecTool({
				hasCronTool: defaults?.hasCronTool === true,
				hasProcessTool: defaults?.processToolAvailabilityRef?.value,
				autoReview: defaults?.mode === "auto"
			});
		},
		get parameters() {
			return presentation?.parameters ?? (defaults?.processToolAvailabilityRef?.value === false ? execCompletionSchema : execSchema);
		},
		prepareBeforeToolCallParams: async (...args) => (await loadTool()).prepareBeforeToolCallParams?.(...args) ?? args[0],
		finalizeBeforeToolCallParams: (params, preparedParams) => loadedTool?.finalizeBeforeToolCallParams?.(params, preparedParams) ?? params,
		execute: async (toolCallId, params, signal, onUpdate) => (await loadTool()).execute(toolCallId, params, signal, onUpdate)
	};
}
/** Resolve global and per-agent exec defaults before runtime-only overrides. */
function resolveExecToolConfig(params) {
	const cfg = params.cfg;
	const globalExec = cfg?.tools?.exec;
	const agentExec = cfg && params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools?.exec : void 0;
	const layeredPolicy = applyExecPolicyLayer(applyExecPolicyLayer({}, globalExec), agentExec);
	return {
		host: agentExec?.host ?? globalExec?.host,
		mode: layeredPolicy.mode,
		security: layeredPolicy.security,
		ask: layeredPolicy.ask,
		node: agentExec?.node ?? globalExec?.node,
		pathPrepend: mergeGatewayAgentCliPath(agentExec?.pathPrepend ?? globalExec?.pathPrepend),
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
