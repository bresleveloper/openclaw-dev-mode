import { A as serializePayload, G as Row, L as Button, Y as TextDisplay, et as stripUndefinedFields, ft as editChannelMessage, nt as createUserDmChannel, q as Separator, st as createChannelMessage, ut as deleteChannelMessage, z as Container } from "./discord-BXpHW-cu.mjs";
import { s as buildExecApprovalCustomId } from "./components-yBEb75bB.mjs";
import { N as createDiscordClient, O as createDiscordMessageNonce } from "./send.shared-VNvWfX2T.mjs";
import { D as isDiscordExecApprovalClientEnabled, c as formatDiscordApprovalDisplayValue, s as DISCORD_APPROVAL_ALLOWED_MENTIONS } from "./outbound-session-route-VulUE0yV.mjs";
import { a as shouldHandleDiscordApprovalRequest } from "./channel-Dv4e3Jpc.mjs";
import { t as discordApprovalMessageUpdates } from "./approval-message-updates-jf9zMaIC.mjs";
import { logDebug, logError } from "openclaw/plugin-sdk/logging-core";
import { ButtonStyle } from "discord-api-types/v10";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createChannelApprovalNativeRuntimeAdapter } from "openclaw/plugin-sdk/approval-handler-runtime";
import { formatChannelApprovalResolvedLabel } from "openclaw/plugin-sdk/approval-runtime";
//#region extensions/discord/src/ui-colors.ts
const DEFAULT_DISCORD_ACCENT_COLOR = "#5865F2";
function normalizeDiscordAccentColor(raw) {
	const trimmed = (raw ?? "").trim();
	if (!trimmed) return null;
	const normalized = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
	if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return null;
	return normalized.toUpperCase();
}
function resolveDiscordAccentColor(_params) {
	return DEFAULT_DISCORD_ACCENT_COLOR;
}
//#endregion
//#region extensions/discord/src/ui.ts
var DiscordUiContainer = class extends Container {
	constructor(params) {
		const accentColor = normalizeDiscordAccentColor(params.accentColor) ?? resolveDiscordAccentColor({
			cfg: params.cfg,
			accountId: params.accountId
		});
		super(params.components, {
			accentColor,
			spoiler: params.spoiler
		});
	}
};
//#endregion
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
var ExecApprovalContainer = class extends DiscordUiContainer {
	constructor(params) {
		const components = [new TextDisplay(`## ${params.title}`)];
		if (params.description) components.push(new TextDisplay(params.description));
		components.push(new Separator({
			divider: true,
			spacing: "small"
		}));
		components.push(new TextDisplay(`### ${params.commandLabel ?? "Command"}\n\`\`\`\n${params.commandPreview}\n\`\`\``));
		if (params.commandSecondaryPreview) components.push(new TextDisplay(`### Shell Preview\n\`\`\`\n${params.commandSecondaryPreview}\n\`\`\``));
		if (params.metadataLines?.length) components.push(new TextDisplay(params.metadataLines.join("\n")));
		if (params.actionRow) components.push(params.actionRow);
		if (params.footer) {
			components.push(new Separator({
				divider: false,
				spacing: "small"
			}));
			components.push(new TextDisplay(`-# ${params.footer}`));
		}
		super({
			cfg: params.cfg,
			accountId: params.accountId,
			components,
			accentColor: params.accentColor
		});
	}
};
var ExecApprovalActionButton = class extends Button {
	constructor(params) {
		super();
		this.customId = buildExecApprovalCustomId(params.approvalId, params.approvalKind, params.descriptor.decision);
		this.label = params.descriptor.label;
		this.style = params.descriptor.style === "success" ? ButtonStyle.Success : params.descriptor.style === "primary" ? ButtonStyle.Primary : params.descriptor.style === "danger" ? ButtonStyle.Danger : ButtonStyle.Secondary;
	}
};
var ExecApprovalActionRow = class extends Row {
	constructor(params) {
		super(params.actions.map((descriptor) => new ExecApprovalActionButton({
			approvalId: params.approvalId,
			approvalKind: params.approvalKind,
			descriptor
		})));
	}
};
function createApprovalActionRow(view) {
	return new ExecApprovalActionRow({
		approvalId: view.approvalId,
		approvalKind: view.approvalKind,
		actions: view.actions
	});
}
function buildApprovalMetadataLines(metadata) {
	return metadata.map((item) => `- ${item.label}: ${item.value}`);
}
function buildExecApprovalPayload(container) {
	return {
		components: [container],
		allowed_mentions: DISCORD_APPROVAL_ALLOWED_MENTIONS
	};
}
const commandPreviewSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function* iterateCommandPreviewSegments(commandText) {
	if (!commandPreviewSegmenter) {
		yield* Array.from(commandText);
		return;
	}
	try {
		for (const segment of commandPreviewSegmenter.segment(commandText)) yield segment.segment;
	} catch {
		yield* Array.from(commandText);
	}
}
function truncateCommandPreview(commandText, maxChars) {
	let commandRaw = "";
	for (const segment of iterateCommandPreviewSegments(commandText)) {
		if (commandRaw.length + segment.length > maxChars) return `${commandRaw}...`;
		commandRaw += segment;
	}
	return commandText;
}
function formatCommandPreview(commandText, maxChars) {
	return truncateCommandPreview(commandText, maxChars).replace(/`/g, "​`");
}
function formatOptionalCommandPreview(commandText, maxChars) {
	if (!commandText) return null;
	return formatCommandPreview(commandText, maxChars);
}
function resolveCommandPreviews(commandText, commandPreview, maxChars, secondaryMaxChars) {
	return {
		commandPreview: formatCommandPreview(commandText, maxChars),
		commandSecondaryPreview: formatOptionalCommandPreview(commandPreview, secondaryMaxChars)
	};
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
	} : resolveCommandPreviews(view.commandText, view.commandPreview, pending ? 1e3 : 500, pending ? 500 : 300);
	const decisionLabel = view.phase === "resolved" ? formatChannelApprovalResolvedLabel(view, (decision) => decision === "allow-once" ? "Allowed (once)" : decision === "allow-always" ? "Allowed (always)" : "Denied") : void 0;
	const title = pending ? `${approvalLabel} Approval Required` : `${approvalLabel} Approval: ${view.phase === "expired" ? "Expired" : decisionLabel}`;
	const description = pending ? plugin ? "A plugin action needs your approval." : systemAgent ? "An OpenClaw change needs your approval." : "A command needs your approval." : view.phase === "expired" ? "This approval request has expired." : view.resolvedBy ? `Resolved by ${formatDiscordApprovalDisplayValue(view.resolvedBy)}` : "Resolved";
	const accentColor = view.phase === "expired" ? "#99AAB5" : view.phase === "resolved" ? view.decision === "deny" ? "#ED4245" : view.decision === "allow-always" ? "#5865F2" : "#57F287" : plugin ? view.severity === "critical" ? "#ED4245" : view.severity === "info" ? "#5865F2" : "#FAA61A" : "#FFA500";
	const approvalId = formatDiscordApprovalDisplayValue(view.approvalId);
	const footer = pending ? `Expires <t:${Math.max(0, Math.floor(view.expiresAtMs / 1e3))}:R> · ID: ${approvalId}` : `ID: ${approvalId}`;
	return new ExecApprovalContainer({
		cfg: params.cfg,
		accountId: params.accountId,
		title,
		description,
		commandLabel: systemAgent ? "Change" : "Command",
		commandPreview,
		commandSecondaryPreview,
		metadataLines: buildApprovalMetadataLines(view.metadata),
		actionRow: params.actionRow,
		footer,
		accentColor
	});
}
async function updateMessage(params) {
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
async function finalizeMessage(params) {
	if (!params.cleanupAfterResolve) {
		await updateMessage(params);
		return;
	}
	try {
		const { rest, request: discordRequest } = createDiscordClient({
			cfg: params.cfg,
			token: params.token,
			accountId: params.accountId
		});
		await discordApprovalMessageUpdates.enqueue(params.messageId, () => discordRequest(() => deleteChannelMessage(rest, params.channelId, params.messageId), "delete-approval"));
	} catch (err) {
		logError(`discord approvals: failed to delete message: ${String(err)}`);
		await updateMessage(params);
	}
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
			const resolved = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolved) return { body: {} };
			const container = createApprovalContainer({
				view,
				cfg,
				accountId: resolved.accountId,
				actionRow: createApprovalActionRow(view)
			});
			return { body: stripUndefinedFields(serializePayload(buildExecApprovalPayload(container))) };
		},
		buildResolvedResult: ({ cfg, accountId, context, view }) => {
			const resolvedContext = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolvedContext) return { kind: "delete" };
			return {
				kind: "update",
				payload: createApprovalContainer({
					view,
					cfg,
					accountId: resolvedContext.accountId
				})
			};
		},
		buildExpiredResult: ({ cfg, accountId, context, view }) => {
			const resolvedContext = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolvedContext) return { kind: "delete" };
			return {
				kind: "update",
				payload: createApprovalContainer({
					view,
					cfg,
					accountId: resolvedContext.accountId
				})
			};
		}
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
