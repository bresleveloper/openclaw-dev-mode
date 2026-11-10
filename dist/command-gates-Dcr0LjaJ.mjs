import { t as redactIdentifier } from "./node-crypto-BG4u3UnX.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { n as isRestartEnabled, t as isCommandFlagEnabled } from "./commands.flags-DCgrWS7a.mjs";
import { a as isNativeCommandTurn, c as resolveCommandTurnContext } from "./command-turn-context-TJGbDzsZ.mjs";
import { r as formatCommandOwnerHint } from "./doctor-command-owner-DAqinR9q.mjs";
//#region src/auto-reply/reply/command-gates.ts
/** Builds the standard terminal response shared by chat command handlers. */
function commandReply(reply) {
	return {
		shouldContinue: false,
		reply: typeof reply === "string" ? { text: reply } : reply
	};
}
function renderCommandJsonBlock(label, value) {
	return `${label}\n\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
}
/** Returns command arguments only when the complete slash-command token matches. */
function matchCommandPrefix(body, command, options = {}) {
	return body === command ? "" : body.startsWith(`${command} `) || options.allowColon && body.startsWith(`${command}:`) ? body.slice(command.length + 1).trim() : null;
}
/** Keeps matching, text-command enablement, and sender authorization in one owner. */
function defineAuthorizedTextCommand(options, run) {
	return async (params, allowTextCommands) => {
		if (!allowTextCommands) return null;
		const match = options.match(params.command.commandBodyNormalized, params);
		if (match === null) return null;
		const unauthorized = rejectUnauthorizedCommand(params, options.label);
		if (unauthorized) return options.silentUnauthorized ? { shouldContinue: false } : unauthorized;
		return (typeof options.ownerOnly === "function" ? options.ownerOnly(params, match) : options.ownerOnly) ? rejectNonOwnerCommand(params, options.label) ?? run(params, match) : run(params, match);
	};
}
function defineGatewayControlCommand(label, run) {
	return defineAuthorizedTextCommand({
		label,
		match: (body) => body === label ? true : null,
		ownerOnly: true,
		silentUnauthorized: true
	}, async (params) => {
		if (!isRestartEnabled(params.cfg)) return commandReply(`⚠️ ${label} is disabled (commands.restart=false).`);
		await params.opts?.turnAdoptionLifecycle?.onAdopted();
		return rejectNonOwnerCommand(params, label) ?? run(params);
	});
}
function rejectUnauthorizedCommand(params, commandLabel) {
	if (params.command.isAuthorizedSender) return null;
	logVerbose(`Ignoring ${commandLabel} from unauthorized sender: ${redactIdentifier(params.command.senderId)}`);
	if (isNativeCommandTurn(resolveCommandTurnContext(params.ctx))) return commandReply("You are not authorized to use this command.");
	return { shouldContinue: false };
}
function rejectNonOwnerCommand(params, commandLabel) {
	if (params.command.senderIsOwner) {
		try {
			params.command.assertOwnerCurrent?.();
		} catch {
			return commandReply("Your owner authority changed; send a new request.");
		}
		return null;
	}
	logVerbose(`Ignoring ${commandLabel} from non-owner sender: ${redactIdentifier(params.command.senderId)}`);
	if (!params.command.isAuthorizedSender) return rejectUnauthorizedCommand(params, commandLabel);
	return commandReply(`You are not authorized to use this owner-only command. ${formatCommandOwnerHint({
		cfg: params.cfg,
		channel: params.command.channel,
		id: params.command.senderId
	})}`);
}
function requireGatewayClientScope(params, config) {
	const scopes = params.ctx.GatewayClientScopes;
	if (!Array.isArray(scopes)) return null;
	if (config.allowedScopes.some((scope) => scopes.includes(scope))) return null;
	logVerbose(`Ignoring ${config.label} from gateway client missing scope: ${config.allowedScopes.join(" or ")}`);
	return commandReply(config.missingText);
}
function buildDisabledCommandReply(params) {
	const disabledVerb = params.disabledVerb ?? "is";
	const docsSuffix = params.docsUrl ? ` Docs: ${params.docsUrl}` : "";
	return { text: `⚠️ ${params.label} ${disabledVerb} disabled. Set commands.${params.configKey}=true to enable.${docsSuffix}` };
}
function requireCommandFlagEnabled(cfg, params) {
	if (isCommandFlagEnabled(cfg, params.configKey)) return null;
	return {
		shouldContinue: false,
		reply: buildDisabledCommandReply(params)
	};
}
//#endregion
export { matchCommandPrefix as a, renderCommandJsonBlock as c, defineGatewayControlCommand as i, requireCommandFlagEnabled as l, commandReply as n, rejectNonOwnerCommand as o, defineAuthorizedTextCommand as r, rejectUnauthorizedCommand as s, buildDisabledCommandReply as t, requireGatewayClientScope as u };
