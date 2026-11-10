import { D as createDiscordMessageNonce, N as createDiscordClient } from "./send.shared-CnlMgoqQ.mjs";
import { D as Row, ct as createChannelMessage, dt as editChannelMessage, j as TextDisplay, k as Separator, q as serializePayload, rt as createUserDmChannel, ut as deleteChannelMessage, x as Container, xt as stripUndefinedFields, y as Button } from "./discord-BMD-JiVS.mjs";
import { y as findGraphemeChunkEnd } from "./send.receipt-C18khRYH.mjs";
import { s as buildExecApprovalCustomId } from "./components-Du9NhD8h.mjs";
import { A as isDiscordExecApprovalClientEnabled, c as formatDiscordApprovalDisplayValue, s as DISCORD_APPROVAL_ALLOWED_MENTIONS } from "./outbound-session-route-BtUpGBTb.mjs";
import { a as shouldHandleDiscordApprovalRequest } from "./channel-ZilgdF5e.mjs";
import { t as discordApprovalMessageUpdates } from "./approval-message-updates-CdurC9Ej.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ButtonStyle } from "discord-api-types/v10";
import { logDebug, logError } from "openclaw/plugin-sdk/logging-core";
import { createChannelApprovalNativeRuntimeAdapterAsync } from "openclaw/plugin-sdk/approval-handler-runtime";
import { formatChannelApprovalResolvedLabel } from "openclaw/plugin-sdk/approval-runtime";
//#region extensions/discord/src/approval-handler.runtime.ts
function resolveHandlerContext(params) {
	const context = params.context;
	const accountId = normalizeOptionalString(params.accountId) ?? "";
	if (!context?.token || !accountId) return null;
	return {
		accountId,
		context
	};
}
var ExecApprovalActionButton = class extends Button {
	constructor(view, descriptor) {
		super();
		this.customId = buildExecApprovalCustomId(view.approvalId, view.approvalKind, descriptor.decision);
		this.label = descriptor.label;
		this.style = descriptor.style === "success" ? ButtonStyle.Success : descriptor.style === "primary" ? ButtonStyle.Primary : descriptor.style === "danger" ? ButtonStyle.Danger : ButtonStyle.Secondary;
	}
};
function buildExecApprovalPayload(container) {
	return {
		components: [container],
		allowed_mentions: DISCORD_APPROVAL_ALLOWED_MENTIONS
	};
}
function formatCommandPreview(commandText, maxChars) {
	const end = findGraphemeChunkEnd(commandText, 0, maxChars, maxChars, false);
	return (end < commandText.length ? `${commandText.slice(0, end)}...` : commandText).replace(/`/g, "​`");
}
function createApprovalContainer(view) {
	const plugin = view.approvalKind === "plugin";
	const systemAgent = view.approvalKind === "system-agent";
	const pending = view.phase === "pending";
	const approvalLabel = plugin ? "Plugin" : systemAgent ? "OpenClaw Change" : "Exec";
	const commandPreview = formatCommandPreview(plugin ? view.title : view.commandText, plugin ? 700 : pending ? 1e3 : 500);
	const secondaryText = plugin ? view.description : view.commandPreview;
	const commandSecondaryPreview = secondaryText ? formatCommandPreview(secondaryText, plugin ? 1e3 : pending ? 500 : 300) : null;
	const decisionLabel = view.phase === "resolved" ? formatChannelApprovalResolvedLabel(view, (decision) => decision === "allow-once" ? "Allowed (once)" : decision === "allow-always" ? "Allowed (always)" : "Denied") : void 0;
	const title = pending ? `${approvalLabel} Approval Required` : `${approvalLabel} Approval: ${view.phase === "expired" ? "Expired" : decisionLabel}`;
	const description = pending ? plugin ? "A plugin action needs your approval." : systemAgent ? "An OpenClaw change needs your approval." : "A command needs your approval." : view.phase === "expired" ? "This approval request has expired." : view.resolvedBy ? `Resolved by ${formatDiscordApprovalDisplayValue(view.resolvedBy)}` : "Resolved";
	const accentColor = view.phase === "expired" ? "#99AAB5" : view.phase === "resolved" ? view.decision === "deny" ? "#ED4245" : view.decision === "allow-always" ? "#5865F2" : "#57F287" : plugin ? view.severity === "critical" ? "#ED4245" : view.severity === "info" ? "#5865F2" : "#FAA61A" : "#FFA500";
	const approvalId = formatDiscordApprovalDisplayValue(view.approvalId);
	const footer = pending ? `Expires <t:${Math.max(0, Math.floor(view.expiresAtMs / 1e3))}:R> · ID: ${approvalId}` : `ID: ${approvalId}`;
	const components = [
		new TextDisplay(`## ${title}`),
		new TextDisplay(description),
		new Separator({
			divider: true,
			spacing: "small"
		}),
		new TextDisplay(`### ${systemAgent ? "Change" : "Command"}\n\`\`\`\n${commandPreview}\n\`\`\``)
	];
	if (commandSecondaryPreview) components.push(new TextDisplay(`### Shell Preview\n\`\`\`\n${commandSecondaryPreview}\n\`\`\``));
	if (view.metadata.length) components.push(new TextDisplay(view.metadata.map((item) => `- ${item.label}: ${item.value}`).join("\n")));
	if (pending) components.push(new Row(view.actions.map((descriptor) => new ExecApprovalActionButton(view, descriptor))));
	components.push(new Separator({
		divider: false,
		spacing: "small"
	}), new TextDisplay(`-# ${footer}`));
	return new Container(components, { accentColor });
}
async function finalizeMessage(params) {
	const operations = params.cleanupAfterResolve ? ["delete", "update"] : ["update"];
	for (const operation of operations) try {
		const { rest, request: discordRequest } = createDiscordClient({
			cfg: params.cfg,
			token: params.token,
			accountId: params.accountId
		});
		let request;
		if (operation === "delete") request = () => deleteChannelMessage(rest, params.channelId, params.messageId);
		else {
			const payload = buildExecApprovalPayload(params.container);
			request = () => editChannelMessage(rest, params.channelId, params.messageId, { body: stripUndefinedFields(serializePayload(payload)) });
		}
		await discordApprovalMessageUpdates.enqueue(params.messageId, () => discordRequest(request, `${operation}-approval`));
		return;
	} catch (err) {
		logError(`discord approvals: failed to ${operation} message: ${String(err)}`);
	}
}
function buildTerminalApprovalResult(params) {
	if (!resolveHandlerContext(params)) return { kind: "delete" };
	return {
		kind: "update",
		payload: createApprovalContainer(params.view)
	};
}
const discordApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapterAsync({
	eventKinds: [
		"exec",
		"plugin",
		"system-agent"
	],
	availability: {
		isConfigured: (params) => {
			const resolved = resolveHandlerContext(params);
			return resolved ? isDiscordExecApprovalClientEnabled({
				cfg: params.cfg,
				accountId: resolved.accountId,
				configOverride: resolved.context.config
			}) : false;
		},
		shouldHandle: (params) => {
			const resolved = resolveHandlerContext(params);
			return resolved ? shouldHandleDiscordApprovalRequest({
				cfg: params.cfg,
				accountId: resolved.accountId,
				request: params.request,
				configOverride: resolved.context.config
			}) : false;
		}
	},
	presentation: {
		buildPendingPayload: ({ cfg, accountId, context, view }) => {
			if (!resolveHandlerContext({
				cfg,
				accountId,
				context
			})) return { body: {} };
			const container = createApprovalContainer(view);
			return { body: stripUndefinedFields(serializePayload(buildExecApprovalPayload(container))) };
		},
		buildResolvedResult: buildTerminalApprovalResult,
		buildExpiredResult: buildTerminalApprovalResult
	},
	transport: {
		prepareTarget: async ({ cfg, accountId, context, plannedTarget }) => {
			const resolved = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolved) return null;
			if (plannedTarget.surface === "origin") {
				const destinationId = typeof plannedTarget.target.threadId === "string" && plannedTarget.target.threadId.trim().length > 0 ? plannedTarget.target.threadId.trim() : plannedTarget.target.to;
				return {
					dedupeKey: destinationId,
					target: { discordChannelId: destinationId }
				};
			}
			const { rest, request: discordRequest } = createDiscordClient({
				cfg,
				token: resolved.context.token,
				accountId: resolved.accountId
			});
			const userId = plannedTarget.target.to;
			const dmChannel = await discordRequest(() => createUserDmChannel(rest, userId), "dm-channel");
			if (!dmChannel?.id) {
				logError(`discord approvals: failed to create DM for user ${userId}`);
				return null;
			}
			return {
				dedupeKey: dmChannel.id,
				target: {
					discordChannelId: dmChannel.id,
					recipientUserId: userId
				}
			};
		},
		deliverPending: async ({ cfg, accountId, context, plannedTarget, preparedTarget, pendingPayload }) => {
			const resolved = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolved) return null;
			const { rest, request: discordRequest } = createDiscordClient({
				cfg,
				token: resolved.context.token,
				accountId: resolved.accountId
			});
			const body = {
				...pendingPayload.body,
				nonce: createDiscordMessageNonce(),
				enforce_nonce: true
			};
			const message = await discordRequest(() => createChannelMessage(rest, preparedTarget.discordChannelId, { body }), plannedTarget.surface === "origin" ? "send-approval-channel" : "send-approval", { safety: "nonce-protected-create" });
			if (!message?.id) {
				if (plannedTarget.surface === "origin") logError("discord approvals: failed to send to channel");
				else if (preparedTarget.recipientUserId) logError(`discord approvals: failed to send message to user ${preparedTarget.recipientUserId}`);
				return null;
			}
			return {
				discordMessageId: message.id,
				discordChannelId: preparedTarget.discordChannelId
			};
		},
		updateEntry: async ({ cfg, accountId, context, entry, payload, phase }) => {
			const resolved = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolved) return;
			const container = payload;
			await finalizeMessage({
				cfg,
				accountId: resolved.accountId,
				token: resolved.context.token,
				cleanupAfterResolve: phase === "resolved" ? resolved.context.config.cleanupAfterResolve : false,
				channelId: entry.discordChannelId,
				messageId: entry.discordMessageId,
				container
			});
		}
	},
	observe: {
		onDuplicateSkipped: ({ preparedTarget, request }) => {
			logDebug(`discord approvals: skipping duplicate approval ${request.id} for channel ${preparedTarget.dedupeKey}`);
		},
		onDelivered: ({ plannedTarget, preparedTarget, request }) => {
			if (plannedTarget.surface === "origin") {
				logDebug(`discord approvals: sent approval ${request.id} to channel ${preparedTarget.target.discordChannelId}`);
				return;
			}
			logDebug(`discord approvals: sent approval ${request.id} to user ${plannedTarget.target.to}`);
		},
		onDeliveryError: ({ error, plannedTarget }) => {
			if (plannedTarget.surface === "origin") {
				logError(`discord approvals: failed to send to channel: ${String(error)}`);
				return;
			}
			logError(`discord approvals: failed to notify user ${plannedTarget.target.to}: ${String(error)}`);
		}
	}
});
//#endregion
export { discordApprovalNativeRuntime };
