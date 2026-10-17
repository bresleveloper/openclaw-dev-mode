import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { l as getActivePluginRegistry } from "./runtime-DfYPSUKC.mjs";
import { dn as validateHooksStatusParams } from "./src-l2dWvEsN.mjs";
import { t as loadWorkspaceHookEntries } from "./workspace-DbjsEGEK.mjs";
import { t as buildWorkspaceHookStatus } from "./hooks-status-6OtVNQ39.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-D1br86TX.mjs";
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
