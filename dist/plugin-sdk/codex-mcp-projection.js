import { i as resolveProjectedMcpCodexToolApprovalMode, r as requiresMcpCodexToolApproval, t as formatMcpCodexApprovalRemedy } from "../mcp-codex-tool-approval-u1CcvKx0.mjs";
import { r as getPluginToolMeta } from "../tool-metadata-DpaqT_qU.mjs";
import { r as pinExecToolTarget } from "../exec-tool-target-pinning-s_GhmaTA.mjs";
import { c as resolveAgentHarnessTtsProvenanceTransferCapability, s as resolveAgentHarnessScheduledToolProjectionCapability } from "../host-private-capabilities-D8EEgJHq.mjs";
import { m as runWithCronCreatorAuthorityResolver, p as runWithCronCreatorAuthorityCapabilityResolver } from "../cron-creator-authority-context-DhhZn7kB.mjs";
import { s as resolveBootstrapFilesForPreparation } from "../bootstrap-files-Cueaawuk.mjs";
import { r as loadCodexBundleMcpApprovalConfig } from "../codex-mcp-config-Dgzz3FQY.mjs";
import { i as resolveCodexMcpToolOverridesForAgent, n as buildCodexUserMcpServersThreadConfigPatchForRuntime, t as buildCodexUserMcpServersThreadConfigPatchForRun } from "../bundle-mcp-codex-HZ70E1zO.mjs";
//#region src/plugin-sdk/codex-mcp-projection.ts
const CODEX_NATIVE_CRON_CREATOR_AUTHORITY = ["read", "exec"];
/** Resolve the private scheduled-tool projection issuer for the Codex harness owner. */
function resolveCodexScheduledToolProjectionFactory(hostCapabilities) {
	return resolveAgentHarnessScheduledToolProjectionCapability({
		hostCapabilities,
		ownerPluginId: "codex"
	});
}
/** Resolve private TTS delivery transfer for the bundled Codex harness owner. */
function resolveCodexTtsProvenanceTransfer(hostCapabilities) {
	return resolveAgentHarnessTtsProvenanceTransferCapability({
		hostCapabilities,
		ownerPluginId: "codex"
	});
}
/** Materialize static configured MCP under the Codex harness authority envelope. */
async function materializeStaticMcpToolsForHarnessRun(params) {
	const { materializeStaticMcpToolsForHarnessRunCore: materialize } = await import("../agent-bundle-mcp-harness-DDV4LDvx.mjs");
	return materialize(params);
}
/** Capture the final Codex dynamic-tool surface for cron creator authority. */
async function captureFinalCodexCronCreatorToolAllowlist(target, captureRef, tools, options = {}) {
	const { captureFinalEffectiveCronCreatorToolAllowlist: capture } = await import("../cron-tool-D8mtC3VW.mjs");
	return capture(target, captureRef, tools, (tool) => getPluginToolMeta(tool), { canonicalToolNames: options.nativeToolSurfaceEnabled ? CODEX_NATIVE_CRON_CREATOR_AUTHORITY : void 0 });
}
//#endregion
export { buildCodexUserMcpServersThreadConfigPatchForRun, buildCodexUserMcpServersThreadConfigPatchForRuntime, captureFinalCodexCronCreatorToolAllowlist, formatMcpCodexApprovalRemedy, loadCodexBundleMcpApprovalConfig, materializeStaticMcpToolsForHarnessRun, pinExecToolTarget, requiresMcpCodexToolApproval, resolveBootstrapFilesForPreparation, resolveCodexMcpToolOverridesForAgent, resolveCodexScheduledToolProjectionFactory, resolveCodexTtsProvenanceTransfer, resolveProjectedMcpCodexToolApprovalMode, runWithCronCreatorAuthorityCapabilityResolver, runWithCronCreatorAuthorityResolver };
