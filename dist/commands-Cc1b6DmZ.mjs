import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { X as validateCommandsListParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { I as authorizeSessionSharingTarget, K as resolveSessionSharingTarget } from "./session-sharing-C_5FkkwM.mjs";
import { n as defineValidatedGatewayMethod } from "./validation-CFv_zneu.mjs";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DCjK5aia.mjs";
import { t as buildCommandsListResult } from "./commands-list-result-C_bJq5Aj.mjs";
//#region src/gateway/server-methods/commands.ts
/** Gateway handler for enumerating available chat/native commands. */
const commandsHandlers = { "commands.list": defineValidatedGatewayMethod("commands.list", validateCommandsListParams, async ({ params, respond, context, client }) => {
	const resolved = resolveAgentIdOrRespondError({
		rawAgentId: params.agentId,
		respond,
		cfg: context.getRuntimeConfig(),
		normalize: (rawAgentId) => typeof rawAgentId === "string" ? rawAgentId.trim() : void 0
	});
	if (!resolved) return;
	const target = params.sessionKey ? resolveSessionSharingTarget({
		cfg: resolved.cfg,
		sessionKey: params.sessionKey,
		agentId: resolved.agentId
	}) : null;
	if (params.sessionKey && !target) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session not found."));
		return;
	}
	if (target) {
		const error = authorizeSessionSharingTarget({
			cfg: resolved.cfg,
			client,
			target
		});
		if (error) {
			respond(false, void 0, error);
			return;
		}
	}
	const result = await buildCommandsListResult({
		cfg: resolved.cfg,
		agentId: resolved.agentId,
		provider: params.provider,
		scope: params.scope,
		includeArgs: params.includeArgs,
		sessionKey: params.sessionKey,
		sessionEntry: target?.entry
	});
	if (target && params.sessionKey) {
		const cfg = context.getRuntimeConfig();
		const current = resolveSessionSharingTarget({
			cfg,
			sessionKey: params.sessionKey,
			agentId: resolved.agentId
		});
		if (!current || current.storePath !== target.storePath || current.storeKey !== target.storeKey || current.entry.sessionId !== target.entry.sessionId || current.entry.lifecycleRevision !== target.entry.lifecycleRevision || JSON.stringify(current.entry.skillLibrarySelections) !== JSON.stringify(target.entry.skillLibrarySelections)) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Session changed while preparing its commands. Retry the request."));
			return;
		}
		const error = authorizeSessionSharingTarget({
			cfg,
			client,
			target: current
		});
		if (error) {
			respond(false, void 0, error);
			return;
		}
	}
	respond(true, result, void 0);
}) };
//#endregion
export { commandsHandlers };
