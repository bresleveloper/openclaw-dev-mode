import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { l as readChannelContextGatewayContextResolver } from "./admission-evidence-aqOMZf0e.mjs";
//#region src/auto-reply/reply/commands-system-agent.ts
const handleSystemAgentCommand = async (params, allowTextCommands) => {
	if (!allowTextCommands) return null;
	const host = (readChannelContextGatewayContextResolver(params.rootCtx ?? params.ctx) ?? getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext)?.()?.hostLifecycle;
	const { extractSystemAgentRescueMessage, runSystemAgentRescueMessage } = await import("./system-agent/rescue-message.js");
	if (extractSystemAgentRescueMessage(params.command.commandBodyNormalized) === null) return null;
	if (!params.command.isAuthorizedSender) {
		logVerbose(`Ignoring /openclaw from unauthorized sender: ${params.command.senderId || "<unknown>"}`);
		return { shouldContinue: false };
	}
	return {
		shouldContinue: false,
		reply: { text: await runSystemAgentRescueMessage({
			cfg: params.cfg,
			command: params.command,
			commandBody: params.command.commandBodyNormalized,
			agentId: params.agentId,
			isGroup: params.isGroup,
			deps: {
				setupSurface: "gateway",
				gatewayHostLifecycle: host && { request: (action, assertCaller) => host.request(action, () => {
					params.commandInvocationSignal?.throwIfAborted();
					assertCaller();
				}) }
			}
		}) ?? "OpenClaw did not find a rescue request." }
	};
};
//#endregion
export { handleSystemAgentCommand as t };
