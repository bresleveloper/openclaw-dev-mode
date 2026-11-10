import { Ng as errorShape, ht as validateCommandsListParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as defineValidatedGatewayMethod } from "./validation--xIH1Pj-.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-BTlRmOxU.mjs";
import { t as buildCommandsListResult } from "./commands-list-result-Ca9JmxRk.mjs";
import { t as withSessionDiscoveryAccess } from "./session-discovery-access-BOEBgHeh.mjs";
//#region src/gateway/server-methods/commands.ts
/** Gateway handler for enumerating available chat/native commands. */
const commandsHandlers = { "commands.list": defineValidatedGatewayMethod("commands.list", validateCommandsListParams, async ({ params, respond, context, client, signal, hasCurrentClientAuthority }) => {
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg: context.getRuntimeConfig()
	});
	if (!resolved) return;
	await withSessionDiscoveryAccess({
		client,
		context,
		respond,
		signal,
		hasCurrentClientAuthority,
		sessionKey: params.sessionKey,
		agentId: resolved.agentId,
		changedError: errorShape(ErrorCodes.UNAVAILABLE, "Session changed while preparing its commands. Retry the request.")
	}, (sessionEntry) => buildCommandsListResult({
		cfg: resolved.cfg,
		agentId: resolved.agentId,
		provider: params.provider,
		scope: params.scope,
		includeArgs: params.includeArgs,
		sessionKey: params.sessionKey,
		sessionEntry
	}));
}) };
//#endregion
export { commandsHandlers };
