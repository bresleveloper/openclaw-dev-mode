import { Z as validateCommandsListParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { r as defineValidatedGatewayMethod } from "./validation-Bu27N0nv.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-D1br86TX.mjs";
import { t as buildCommandsListResult } from "./commands-list-result-ByMoQA1j.mjs";
import { t as withSessionDiscoveryAccess } from "./session-discovery-access-FM3bRbnd.mjs";
//#region src/gateway/server-methods/commands.ts
/** Gateway handler for enumerating available chat/native commands. */
const commandsHandlers = { "commands.list": defineValidatedGatewayMethod("commands.list", validateCommandsListParams, async ({ params, respond, context, client, signal, hasCurrentClientAuthority }) => {
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg: context.getRuntimeConfig(),
		normalize: (rawAgentId) => typeof rawAgentId === "string" ? rawAgentId.trim() : void 0
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
