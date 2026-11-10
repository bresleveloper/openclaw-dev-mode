import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import "./src-Djeo9OvP.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { n as resolveChannelApprovalCapability } from "./plugins-CCVkYF8m.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { t as isApprovalNotFoundError } from "./approval-errors-Ccn5PiLn.mjs";
import { t as canChannelEnforcePluginReviewerPolicy } from "./approval-channel-policy-support-DWQOjoD0.mjs";
import { n as commandReply, u as requireGatewayClientScope } from "./command-gates-Dcr0LjaJ.mjs";
import { r as isImplicitSameChatApprovalAuthorization } from "./approval-auth-helpers-CKuqMzvH.mjs";
import { n as resolveApprovalOverGateway, t as isPendingSystemAgentApprovalOverGateway } from "./approval-gateway-resolver-BbTScaK5.mjs";
import { t as resolveChannelAccountId } from "./channel-context-DQlARESr.mjs";
//#region src/infra/channel-approval-auth.ts
/** Resolves whether a chat `/approve` command is authorized by channel-specific approval policy. */
async function resolveApprovalCommandAuthorization(params) {
	const channel = normalizeMessageChannel(params.channel);
	if (!channel) return {
		authorized: true,
		explicit: false
	};
	const approvalCapability = resolveChannelApprovalCapability(getChannelPlugin(channel));
	if (params.kind === "plugin" && !canChannelEnforcePluginReviewerPolicy(params.cfg, channel, approvalCapability)) return {
		authorized: false,
		explicit: true,
		reason: `Plugin approvals on ${channel} require an updated channel plugin for the configured reviewer policy.`
	};
	const resolved = await (approvalCapability?.authorizeActorActionAsync ?? approvalCapability?.authorizeActorAction)?.({
		cfg: params.cfg,
		accountId: params.accountId,
		senderId: params.senderId,
		action: "approve",
		approvalKind: params.kind
	});
	if (!resolved) return {
		authorized: true,
		explicit: false
	};
	const implicitSameChatAuthorization = isImplicitSameChatApprovalAuthorization(resolved);
	const availability = await (approvalCapability?.getActionAvailabilityStateAsync ?? approvalCapability?.getActionAvailabilityState)?.({
		cfg: params.cfg,
		accountId: params.accountId,
		action: "approve",
		approvalKind: params.kind
	});
	return {
		authorized: resolved.authorized,
		reason: resolved.reason,
		explicit: resolved.authorized ? !implicitSameChatAuthorization && availability?.kind !== "disabled" : true
	};
}
//#endregion
//#region src/auto-reply/reply/commands-approve.ts
const log = createSubsystemLogger("auto-reply/commands-approve");
const COMMAND_REGEX = /^\/?approve(?:\s|$)/i;
const FOREIGN_COMMAND_MENTION_REGEX = /^\/approve@([^\s]+)(?:\s|$)/i;
const DECISION_ALIASES = /* @__PURE__ */ new Map([
	["allow", "allow-once"],
	["once", "allow-once"],
	["allow-once", "allow-once"],
	["allowonce", "allow-once"],
	["always", "allow-always"],
	["allow-always", "allow-always"],
	["allowalways", "allow-always"],
	["deny", "deny"],
	["reject", "deny"],
	["block", "deny"]
]);
const APPROVE_USAGE_TEXT = "Usage: /approve <id> <decision> (see the pending approval message for available decisions)";
function parseApproveCommand(raw) {
	const trimmed = raw.trim();
	if (FOREIGN_COMMAND_MENTION_REGEX.test(trimmed)) return {
		ok: false,
		error: "❌ This /approve command targets a different Telegram bot."
	};
	const commandMatch = trimmed.match(COMMAND_REGEX);
	if (!commandMatch) return null;
	const tokens = trimmed.slice(commandMatch[0].length).trim().split(/\s+/);
	if (tokens.length < 2) return {
		ok: false,
		error: APPROVE_USAGE_TEXT
	};
	const first = normalizeLowercaseStringOrEmpty(tokens[0]);
	const second = normalizeLowercaseStringOrEmpty(tokens[1]);
	const firstDecision = DECISION_ALIASES.get(first);
	const decision = firstDecision ?? DECISION_ALIASES.get(second);
	if (decision) return {
		ok: true,
		decision,
		id: firstDecision ? tokens.slice(1).join(" ") : expectDefined(tokens[0], "tokens entry at 0")
	};
	return {
		ok: false,
		error: APPROVE_USAGE_TEXT
	};
}
async function handleApproveCommandFromContext(params, allowTextCommands) {
	if (!allowTextCommands) return null;
	const normalized = params.command.commandBodyNormalized;
	const parsed = parseApproveCommand(normalized);
	if (!parsed) return null;
	if (!parsed.ok) return commandReply(parsed.error);
	const effectiveAccountId = resolveChannelAccountId({
		cfg: params.cfg,
		ctx: params.ctx,
		command: params.command
	});
	const approvalCapability = resolveChannelApprovalCapability(getChannelPlugin(params.command.channel));
	const pluginReviewerSenderId = approvalCapability?.resolveReviewerSenderId?.({
		cfg: params.cfg,
		accountId: effectiveAccountId,
		senderId: params.command.senderId,
		spaceId: params.ctx.GroupSpace
	}) ?? params.command.senderId;
	const approvalKinds = [
		"exec",
		"plugin",
		"system-agent"
	];
	const authorize = (kind) => resolveApprovalCommandAuthorization({
		cfg: params.cfg,
		channel: params.command.channel,
		accountId: effectiveAccountId,
		senderId: kind === "plugin" ? pluginReviewerSenderId : params.command.senderId,
		kind
	});
	const [exec, plugin, systemAgent] = await Promise.all([
		authorize("exec"),
		authorize("plugin"),
		authorize("system-agent")
	]);
	const authorizations = {
		exec,
		plugin,
		"system-agent": systemAgent
	};
	const hasExplicitApprovalAuthorization = Object.values(authorizations).some((authorization) => authorization.explicit && authorization.authorized);
	if (!params.command.isAuthorizedSender && !hasExplicitApprovalAuthorization) {
		logVerbose(`Ignoring /approve from unauthorized sender: ${params.command.senderId || "<unknown>"}`);
		return { shouldContinue: false };
	}
	const missingScope = requireGatewayClientScope(params, {
		label: "/approve",
		allowedScopes: ["operator.approvals", "operator.admin"],
		missingText: "❌ /approve requires operator.approvals for gateway clients."
	});
	if (missingScope) return missingScope;
	const systemAgentNeedsOwner = !approvalCapability?.authorizeActorActionAsync && !approvalCapability?.authorizeActorAction;
	const commandBehaviors = /* @__PURE__ */ new Map();
	for (const approvalKind of approvalKinds) commandBehaviors.set(approvalKind, approvalCapability?.resolveApproveCommandBehavior?.({
		cfg: params.cfg,
		accountId: effectiveAccountId,
		senderId: params.command.senderId,
		approvalKind
	}));
	const blockedCommandResult = () => {
		const replyBehavior = Array.from(commandBehaviors.values()).find((behavior) => behavior?.kind === "reply");
		if (replyBehavior?.kind === "reply") return commandReply(replyBehavior.text);
		if (Array.from(commandBehaviors.values()).some((behavior) => behavior?.kind === "ignore")) return { shouldContinue: false };
		return systemAgentRefusedForOwner ? ownerOnlyResult : null;
	};
	const resolvedBy = `${params.command.channel}:${params.command.senderId ?? "unknown"}`;
	const callApprovalMethod = async (approvalKind) => {
		const reviewer = approvalCapability?.authorizeActorActionAsync || approvalCapability?.authorizeActorAction || approvalKind === "system-agent" && !Array.isArray(params.ctx.GatewayClientScopes) ? {
			channel: params.command.channel,
			accountId: effectiveAccountId,
			senderId: approvalKind === "plugin" ? pluginReviewerSenderId : params.command.senderId
		} : {};
		const clientDisplayName = `Chat approval (${resolvedBy})`;
		if (approvalKind === "system-agent") {
			if (!await isPendingSystemAgentApprovalOverGateway({
				cfg: params.cfg,
				approvalId: parsed.id,
				clientDisplayName
			})) throw new Error("unknown or expired approval id");
			if (systemAgentNeedsOwner) try {
				params.command.assertOwnerCurrent?.();
			} catch {
				throw new Error("your owner authority changed; send /approve again");
			}
		}
		const request = {
			cfg: params.cfg,
			approvalId: parsed.id,
			decision: parsed.decision,
			...reviewer,
			clientDisplayName
		};
		await (approvalKind === "system-agent" ? resolveApprovalOverGateway({
			...request,
			approvalKind
		}) : resolveApprovalOverGateway({
			...request,
			resolveMethod: approvalKind
		}));
	};
	const systemAgentRefusedForOwner = systemAgentNeedsOwner && !params.command.senderIsOwner && authorizations["system-agent"].authorized;
	const ownerOnlyResult = commandReply("❌ Only the owner can approve OpenClaw changes in this chat.");
	const methods = approvalKinds.filter((approvalKind) => {
		if (approvalKind === "system-agent" && systemAgentRefusedForOwner) return false;
		const behavior = commandBehaviors.get(approvalKind);
		return authorizations[approvalKind].authorized && (!behavior || behavior.kind === "allow");
	});
	if (methods.length === 0) {
		const blocked = blockedCommandResult();
		if (blocked) return blocked;
		return commandReply(Object.values(authorizations).find((authorization) => authorization.reason)?.reason ?? "❌ You are not authorized to approve this request.");
	}
	for (const [index, method] of methods.entries()) try {
		await callApprovalMethod(method);
		break;
	} catch (error) {
		if (isApprovalNotFoundError(error)) {
			if (index < methods.length - 1) continue;
			const blocked = blockedCommandResult();
			if (blocked) return blocked;
			return commandReply("That approval is no longer available. Check the request in the Control UI.");
		}
		log.warn(`Approval submission failed: ${formatErrorMessage(error)}`);
		return commandReply("⚠️ Couldn't confirm that approval. Check the request in the Control UI before trying again.");
	}
	return commandReply(`✅ Approval ${parsed.decision} submitted for ${parsed.id}.`);
}
//#endregion
export { handleApproveCommandFromContext as t };
