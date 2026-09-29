import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { ln as validateHooksStatusParams } from "./src-BRUl7oDv.mjs";
import { l as getActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { t as loadWorkspaceHookEntries } from "./workspace-B2MW5yrb.mjs";
import { t as buildWorkspaceHookStatus } from "./hooks-status-Daf4qIA7.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DCjK5aia.mjs";
//#region src/gateway/server-methods/hooks-status.ts
/** Gateway handler for the live hook status report. */
const hooksStatusHandlers = { "hooks.status": ({ params, respond, context }) => {
	if (!assertValidParams(params, validateHooksStatusParams, "hooks.status", respond)) return;
	const config = context.getRuntimeConfig();
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg: config,
		normalize: (value) => typeof value === "string" ? value.trim() || void 0 : void 0
	});
	if (!resolved) return;
	const workspaceDir = resolveAgentWorkspaceDir(config, resolved.agentId);
	const entries = [...(getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry())?.hooks.map((hook) => hook.entry) ?? [], ...loadWorkspaceHookEntries(workspaceDir, { config })];
	respond(true, buildWorkspaceHookStatus(workspaceDir, {
		config,
		entries
	}), void 0);
} };
//#endregion
export { hooksStatusHandlers };
