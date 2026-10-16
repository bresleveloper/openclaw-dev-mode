import { D as createDiscordMessageNonce, N as createDiscordClient } from "./send.shared-C4CN24D9.mjs";
import { A as serializePayload, B as Container, J as Separator, K as Row, R as Button, X as TextDisplay, ct as deleteChannelMessage, lt as editChannelMessage, nt as createUserDmChannel, yt as stripUndefinedFields } from "./discord-9gysrhzp.mjs";
import { x as findGraphemeChunkEnd } from "./send.receipt-DVOg2Oaw.mjs";
import { s as buildExecApprovalCustomId } from "./components-DLJR0xU-.mjs";
import { D as isDiscordExecApprovalClientEnabled, c as formatDiscordApprovalDisplayValue, s as DISCORD_APPROVAL_ALLOWED_MENTIONS } from "./outbound-session-route-BvBH4LC6.mjs";
import { a as shouldHandleDiscordApprovalRequest } from "./channel-Dr-AUnGt.mjs";
import { t as discordApprovalMessageUpdates } from "./approval-message-updates-B0jdSqOj.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { ButtonStyle, Routes } from "discord-api-types/v10";
import { logDebug, logError } from "openclaw/plugin-sdk/logging-core";
import { createChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-runtime";
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
	constructor(params) {
		super();
		this.customId = buildExecApprovalCustomId(params.approvalId, params.approvalKind, params.descriptor.decision);
		this.label = params.descriptor.label;
		this.style = params.descriptor.style === "success" ? ButtonStyle.Success : params.descriptor.style === "primary" ? ButtonStyle.Primary : params.descriptor.style === "danger" ? ButtonStyle.Danger : ButtonStyle.Secondary;
	}
};
function createApprovalActionRow(view) {
	return new Row(view.actions.map((descriptor) => new ExecApprovalActionButton({
		approvalId: view.approvalId,
		approvalKind: view.approvalKind,
		descriptor
	})));
}
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
function formatOptionalCommandPreview(commandText, maxChars) {
	if (!commandText) return null;
	return formatCommandPreview(commandText, maxChars);
}
function createApprovalContainer(params) {
	const { view } = params;
	const plugin = view.approvalKind === "plugin";
	const systemAgent = view.approvalKind === "system-agent";
	const pending = view.phase === "pending";
	const approvalLabel = plugin ? "Plugin" : systemAgent ? "OpenClaw Change" : "Exec";
	const { commandPreview, commandSecondaryPreview } = plugin ? {
		commandPreview: formatCommandPreview(view.title, 700),
		commandSecondaryPreview: formatOptionalCommandPreview(view.description, 1e3)
	} : {
		commandPreview: formatCommandPreview(view.commandText, pending ? 1e3 : 500),
		commandSecondaryPreview: formatOptionalCommandPreview(view.commandPreview, pending ? 500 : 300)
	};
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
	if (params.actionRow) components.push(params.actionRow);
	components.push(new Separator({
		divider: false,
		spacing: "small"
	}), new TextDisplay(`-# ${footer}`));
	return new Container(components, { accentColor });
}
async function finalizeMessage(params) {
	if (params.cleanupAfterResolve) try {
		const { rest, request: discordRequest } = createDiscordClient({
			cfg: params.cfg,
			token: params.token,
			accountId: params.accountId
		});
		await discordApprovalMessageUpdates.enqueue(params.messageId, () => discordRequest(() => deleteChannelMessage(rest, params.channelId, params.messageId), "delete-approval"));
		return;
	} catch (err) {
		logError(`discord approvals: failed to delete message: ${String(err)}`);
	}
	try {
		const { rest, request: discordRequest } = createDiscordClient({
			cfg: params.cfg,
			token: params.token,
			accountId: params.accountId
		});
		const payload = buildExecApprovalPayload(params.container);
		await discordApprovalMessageUpdates.enqueue(params.messageId, () => discordRequest(() => editChannelMessage(rest, params.channelId, params.messageId, { body: stripUndefinedFields(serializePayload(payload)) }), "update-approval"));
	} catch (err) {
		logError(`discord approvals: failed to update message: ${String(err)}`);
	}
}
function buildTerminalApprovalResult(params) {
	if (!resolveHandlerContext(params)) return { kind: "delete" };
	return {
		kind: "update",
		payload: createApprovalContainer({ view: params.view })
	};
}
const discordApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
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
			const container = createApprovalContainer({
				view,
				actionRow: createApprovalActionRow(view)
			});
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
			const message = await discordRequest(() => rest.post(Routes.channelMessages(preparedTarget.discordChannelId), { body }), plannedTarget.surface === "origin" ? "send-approval-channel" : "send-approval", { safety: "nonce-protected-create" });
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
