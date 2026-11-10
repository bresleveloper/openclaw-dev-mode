import { o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { An as validateHooksStatusParams } from "./src-pLJQA6J5.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { t as loadWorkspaceHookEntries } from "./workspace-CHuPMd88.mjs";
import { t as buildWorkspaceHookStatus } from "./hooks-status-DjRj_Usg.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BTlRmOxU.mjs";
//#region src/gateway/server-methods/hooks-status.ts
/** Gateway handler for the live hook status report. */
const hooksStatusHandlers = { "hooks.status": ({ params, respond, context }) => {
	if (!assertValidParams(params, validateHooksStatusParams, "hooks.status", respond)) return;
	const config = context.getRuntimeConfig();
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg: config
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
