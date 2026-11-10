import { D as parseSessionDeliveryRoute } from "./session-key-CSDERtm3.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-B4OWlHAG.mjs";
import { f as resolveToolsBySender } from "./group-policy-CBIUperA.mjs";
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
	return pickSandboxToolPolicy(resolveToolsBySender({
		toolsBySender: agentTools?.toolsBySender,
		...sender
	}) || resolveToolsBySender({
		toolsBySender: cfg.tools?.toolsBySender,
		...sender
	}));
}
//#endregion
export { resolveSenderToolPolicy as t };
