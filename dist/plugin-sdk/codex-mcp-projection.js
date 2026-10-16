import { i as readMcpAppToolExtensions, r as readMcpAppSettingsCapability, t as readMcpAppIcons } from "../mcp-app-extension-metadata-moidhg1Q.mjs";
import { i as resolveProjectedMcpCodexToolApprovalMode, n as normalizeMcpCodexToolAnnotations, r as requiresMcpCodexToolApproval, t as formatMcpCodexApprovalRemedy } from "../mcp-codex-tool-approval-DQZI_si1.mjs";
import { r as captureMcpClientElicitation } from "../mcp-client-elicitation-BDpk6re9.mjs";
import { r as getPluginToolMeta } from "../tool-metadata-DEC0Rqn3.mjs";
import { d as pinExecToolTarget } from "../agent-tool-metadata-BiQWQ4ti.mjs";
import { c as resolveAgentHarnessTtsProvenanceTransferCapability, s as resolveAgentHarnessScheduledToolProjectionCapability } from "../host-private-capabilities-D9XrALSb.mjs";
import { m as runWithCronCreatorAuthorityResolver, p as runWithCronCreatorAuthorityCapabilityResolver } from "../cron-creator-authority-context-aezDQHzt.mjs";
import { o as resolveBootstrapFilesForPreparation } from "../bootstrap-files-CtnU-4C-.mjs";
import { r as loadCodexBundleMcpApprovalConfig } from "../codex-mcp-config-B-AG67VE.mjs";
import { i as resolveCodexMcpToolOverridesForAgent, n as buildCodexUserMcpServersThreadConfigPatchForRuntime, t as buildCodexUserMcpServersThreadConfigPatchForRun } from "../bundle-mcp-codex-DQTL1lFU.mjs";
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
	const { materializeStaticMcpToolsForHarnessRunCore: materialize } = await import("../agent-bundle-mcp-harness-BPRO77_k.mjs");
	return materialize(params);
}
/** Capture the final Codex dynamic-tool surface for cron creator authority. */
async function captureFinalCodexCronCreatorToolAllowlist(target, captureRef, tools, options = {}) {
	const { captureFinalEffectiveCronCreatorToolAllowlist: capture } = await import("../cron-tool-4aAPWrEG.mjs");
	return capture(target, captureRef, tools, (tool) => getPluginToolMeta(tool), { canonicalToolNames: options.nativeToolSurfaceEnabled ? CODEX_NATIVE_CRON_CREATOR_AUTHORITY : void 0 });
}
/** Bind rich-form resources to the exact originating harness MCP connection. */
async function createHarnessMcpFormResourceContext(params) {
	const { createMcpAppFormResourceContext } = await import("../mcp-app-form-resources-Br4wGVe9.mjs");
	params.origin.assertCurrent();
	const { prepareMcpAppFormUpload } = await import("../mcp-form-resource-upload-BC6dJjq0.mjs");
	const prepare = params.origin.prepareToolCall;
	const origin = {
		...params.origin,
		prepareToolCall: prepare ? async ({ toolName, input, assertCurrent, signal }) => prepare({
			toolName,
			input,
			assertCurrent,
			signal
		}) : void 0
	};
	return await createMcpAppFormResourceContext({
		origin,
		snapshot: params.snapshot,
		signal: params.signal,
		uploadResources: await prepareMcpAppFormUpload(origin)
	});
}
//#endregion
export { buildCodexUserMcpServersThreadConfigPatchForRun, buildCodexUserMcpServersThreadConfigPatchForRuntime, captureFinalCodexCronCreatorToolAllowlist, captureMcpClientElicitation, createHarnessMcpFormResourceContext, formatMcpCodexApprovalRemedy, loadCodexBundleMcpApprovalConfig, materializeStaticMcpToolsForHarnessRun, normalizeMcpCodexToolAnnotations, pinExecToolTarget, readMcpAppIcons, readMcpAppSettingsCapability, readMcpAppToolExtensions, requiresMcpCodexToolApproval, resolveBootstrapFilesForPreparation, resolveCodexMcpToolOverridesForAgent, resolveCodexScheduledToolProjectionFactory, resolveCodexTtsProvenanceTransfer, resolveProjectedMcpCodexToolApprovalMode, runWithCronCreatorAuthorityCapabilityResolver, runWithCronCreatorAuthorityResolver };
