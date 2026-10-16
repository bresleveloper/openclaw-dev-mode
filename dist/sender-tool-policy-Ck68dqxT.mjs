import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { D as parseSessionDeliveryRoute } from "./session-key-C09ow4h0.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-BO1puJQ0.mjs";
import { f as resolveToolsBySender } from "./group-policy-BJ7vM7Bm.mjs";
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
