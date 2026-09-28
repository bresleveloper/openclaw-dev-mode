import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { T as parseSessionDeliveryRoute } from "./session-key-CBvmC8zz.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-Dp4rlIlG.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { f as resolveToolsBySender } from "./group-policy-CsBeuTe8.mjs";
//#region src/agents/sender-tool-policy.ts
/**
* Sender-scoped sandbox tool policy resolver.
* Applies per-agent toolsBySender matches before global sender policy so
* channel delivery can narrow tool access by sender identity.
*/
/** Resolves sender-scoped sandbox tool policy, preferring agent config over global config. */
function resolveSenderToolPolicy(params) {
	const cfg = params.config;
	if (!cfg) return;
	const sender = {
		messageProvider: parseSessionDeliveryRoute(params.sessionKey)?.channel ?? params.messageProvider,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	};
	const agentTools = params.agentId && params.agentId.trim() ? resolveAgentConfig(cfg, params.agentId)?.tools : void 0;
	const agentPolicy = resolveToolsBySender({
		toolsBySender: agentTools?.toolsBySender,
		...sender
	});
	if (agentPolicy) return pickSandboxToolPolicy(agentPolicy);
	const globalPolicy = resolveToolsBySender({
		toolsBySender: cfg.tools?.toolsBySender,
		...sender
	});
	return pickSandboxToolPolicy(globalPolicy);
}
//#endregion
export { resolveSenderToolPolicy as t };
