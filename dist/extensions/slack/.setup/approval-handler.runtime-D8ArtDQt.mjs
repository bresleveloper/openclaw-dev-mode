import { a as parseSlackTarget } from "./target-parsing-FFE26kOV.mjs";
import { F as truncateSlackTextByUtf8Bytes, Lt as normalizeSlackApproverId, P as truncateSlackText, Tt as shouldHandleSlackNativeApprovalRequest, _t as isSlackAnyNativeApprovalClientEnabled, ct as SLACK_APPROVAL_HEADER_BLOCK_ID, k as SLACK_EDIT_TEXT_MAX_BYTES, n as setSlackSessionStatus } from "./session-status-Dv8wNBEt.mjs";
import { g as getSlackListenerWriteClient } from "./probe-IiHogLQN.mjs";
import { s as resolveSlackReplyBlocks } from "./reply-blocks-Ca-raz2z.mjs";
import { t as sendMessageSlack } from "./send-C-8wY0lK.mjs";
import { n as runSlackApprovalMessageUpdate } from "./approval-message-updates-DT7XBPbV.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { buildChannelApprovalNativeTargetKey } from "openclaw/plugin-sdk/approval-native-runtime";
import { buildApprovalPresentationFromActionDescriptors } from "openclaw/plugin-sdk/approval-reply-runtime";
import { logError } from "openclaw/plugin-sdk/logging-core";
import { createChannelApprovalNativeRuntimeAdapterAsync } from "openclaw/plugin-sdk/approval-handler-runtime";
import { formatChannelApprovalResolvedLabel } from "openclaw/plugin-sdk/approval-runtime";
//#region extensions/slack/src/approval-handler.runtime.ts
const SLACK_CONTEXT_ELEMENTS_MAX = 10;
const SLACK_TEXT_OBJECT_MAX = 3e3;
function resolveHandlerContext(params) {
	const context = params.context;
	const accountId = normalizeOptionalString(params.accountId) ?? "";
	if (!context?.app || !accountId) return null;
	return {
		accountId,
		context
	};
}
function truncateSlackMrkdwn(text, maxChars) {
	return truncateSlackText(text, Math.max(0, Math.floor(maxChars)), "preserve");
}
function buildSlackCodeBlock(text) {
	let fence = "```";
	while (text.includes(fence)) fence += "`";
	return `${fence}\n${text}\n${fence}`;
}
function formatSlackApprover(resolvedBy) {
	const normalized = resolvedBy ? normalizeSlackApproverId(resolvedBy) : void 0;
	if (normalized) return `<@${normalized}>`;
	const trimmed = normalizeOptionalString(resolvedBy);
	return trimmed ? trimmed : null;
}
function buildSlackMetadataContextBlock(lines) {
	const visibleLineCount = lines.length > SLACK_CONTEXT_ELEMENTS_MAX ? 9 : lines.length;
	const elements = lines.slice(0, visibleLineCount).map((line) => ({
		type: "mrkdwn",
		text: truncateSlackMrkdwn(line, SLACK_TEXT_OBJECT_MAX)
	}));
	if (lines.length > SLACK_CONTEXT_ELEMENTS_MAX) elements.push({
		type: "mrkdwn",
		text: `…+${lines.length - visibleLineCount} more`
	});
	return elements.length > 0 ? {
		type: "context",
		elements
	} : void 0;
}
function buildSlackApprovalSection(text, blockId) {
	return {
		type: "section",
		...blockId ? { block_id: blockId } : {},
		text: {
			type: "mrkdwn",
			text
		}
	};
}
function buildSlackApprovalPayload(input) {
	const { phase, view } = input;
	const isPlugin = view.approvalKind === "plugin";
	const isSystemAgent = view.approvalKind === "system-agent";
	const approvalName = isPlugin ? "Plugin" : isSystemAgent ? "OpenClaw change" : "Exec";
	let heading;
	let description;
	if (phase === "pending") {
		heading = `*${approvalName} approval required*`;
		description = view.approvalKind === "plugin" ? normalizeOptionalString(view.description) ?? "A plugin action needs your approval." : isSystemAgent ? "An OpenClaw change needs your approval." : "A command needs your approval.";
	} else if (phase === "resolved") {
		heading = `*${approvalName} approval: ${formatChannelApprovalResolvedLabel(view)}*`;
		const resolvedBy = formatSlackApprover(view.resolvedBy);
		description = resolvedBy ? `Resolved by ${resolvedBy}.` : "Resolved.";
	} else {
		heading = `*${approvalName} approval expired*`;
		description = "This approval request expired before it was resolved.";
	}
	const metadata = isPlugin ? [{
		label: "Approval ID",
		value: view.approvalId
	}, ...view.metadata] : view.metadata;
	const bodyLabel = isPlugin ? "*Request*" : isSystemAgent ? "*Change*" : "*Command*";
	const bodyText = isPlugin ? view.title : view.commandText;
	const renderBody = (text) => isPlugin ? text : buildSlackCodeBlock(text);
	const metadataLines = isPlugin || phase === "pending" ? metadata.map(({ label, value }) => `*${label}:* ${value}`) : [];
	const text = [
		heading,
		description,
		"",
		bodyLabel,
		renderBody(bodyText),
		...metadataLines
	].join("\n");
	const headerDescription = isPlugin && phase === "pending" ? truncateSlackMrkdwn(description, 2600) : description;
	const blocks = [buildSlackApprovalSection(`${heading}\n${headerDescription}`, phase === "pending" ? SLACK_APPROVAL_HEADER_BLOCK_ID : void 0), buildSlackApprovalSection(`${bodyLabel}\n${renderBody(truncateSlackMrkdwn(bodyText, 2600))}`)];
	const metadataBlock = buildSlackMetadataContextBlock(metadataLines);
	if (metadataBlock) blocks.push(metadataBlock);
	if (phase === "pending") blocks.push(...resolveSlackReplyBlocks({
		text: "",
		presentation: buildApprovalPresentationFromActionDescriptors(view.actions)
	}) ?? []);
	return {
		text,
		blocks
	};
}
async function updateMessage(client, accountId, { channelId, messageTs }, { text, blocks }) {
	try {
		await runSlackApprovalMessageUpdate({
			accountId,
			channelId,
			messageTs
		}, () => client.chat.update({
			channel: channelId,
			ts: messageTs,
			text: truncateSlackTextByUtf8Bytes(text, SLACK_EDIT_TEXT_MAX_BYTES),
			blocks
		}));
	} catch (err) {
		logError(`slack approvals: failed to update message: ${String(err)}`);
	}
}
const slackApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapterAsync({
	eventKinds: [
		"exec",
		"plugin",
		"system-agent"
	],
	availability: {
		isConfigured: (params) => {
			const resolved = resolveHandlerContext(params);
			return resolved ? isSlackAnyNativeApprovalClientEnabled({
				cfg: params.cfg,
				accountId: resolved.accountId
			}) : false;
		},
		shouldHandle: async (params) => {
			const resolved = resolveHandlerContext(params);
			if (!resolved) return false;
			return shouldHandleSlackNativeApprovalRequest({
				cfg: params.cfg,
				accountId: resolved.accountId,
				approvalKind: params.approvalKind,
				request: params.request
			});
		}
	},
	presentation: {
		buildPendingPayload: ({ view }) => buildSlackApprovalPayload({
			phase: "pending",
			view
		}),
		buildResolvedResult: ({ view }) => ({
			kind: "update",
			payload: buildSlackApprovalPayload({
				phase: "resolved",
				view
			})
		}),
		buildExpiredResult: ({ view }) => ({
			kind: "update",
			payload: buildSlackApprovalPayload({
				phase: "expired",
				view
			})
		})
	},
	transport: {
		prepareTarget: ({ plannedTarget }) => {
			const parsed = parseSlackTarget(plannedTarget.target.to, { defaultKind: "channel" });
			if (!parsed) throw new Error("Slack approval delivery target is missing");
			return {
				dedupeKey: buildChannelApprovalNativeTargetKey(plannedTarget.target),
				target: {
					to: `${parsed.kind}:${parsed.id}`,
					threadTs: plannedTarget.target.threadId != null ? String(plannedTarget.target.threadId) : void 0,
					teamId: parsed.teamId
				}
			};
		},
		deliverPending: async ({ cfg, accountId, context, preparedTarget, pendingPayload }) => {
			const resolved = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolved) return null;
			const client = resolveApprovalClient(resolved.context, preparedTarget.teamId);
			const to = await resolveApprovalChannel(client, preparedTarget.to, preparedTarget.teamId);
			const eventScope = preparedTarget.teamId ? {
				teamId: preparedTarget.teamId,
				client,
				writeClient: getSlackListenerWriteClient({
					listenerClient: client,
					teamId: preparedTarget.teamId,
					clientOptions: resolved.context.app.webClientOptions
				})
			} : void 0;
			const message = await sendMessageSlack(to, pendingPayload.text, {
				cfg,
				accountId: resolved.accountId,
				threadTs: preparedTarget.threadTs,
				blocks: pendingPayload.blocks,
				client,
				eventScope
			});
			await setSlackSessionStatus({
				client,
				channelId: message.channelId,
				threadTs: preparedTarget.threadTs,
				status: "suspended"
			});
			return {
				channelId: message.channelId,
				messageTs: message.messageId,
				threadTs: preparedTarget.threadTs,
				teamId: preparedTarget.teamId
			};
		},
		updateEntry: async ({ cfg, accountId, context, entry, payload, phase }) => {
			const resolved = resolveHandlerContext({
				cfg,
				accountId,
				context
			});
			if (!resolved) return;
			const client = resolveApprovalClient(resolved.context, entry.teamId);
			await updateMessage(client, resolved.accountId, entry, payload);
			await setSlackSessionStatus({
				client,
				channelId: entry.channelId,
				threadTs: entry.threadTs,
				status: phase === "resolved" ? "processing" : "active"
			});
		}
	},
	observe: { onDeliveryError: ({ error, request }) => {
		logError(`slack approvals: failed to deliver approval ${request.id}: ${String(error)}`);
	} }
});
function resolveApprovalClient(context, teamId) {
	if (!teamId) return context.app.client;
	if (!context.enterprise) {
		if (!context.workspaceTeamId || context.workspaceTeamId.toUpperCase() !== teamId.toUpperCase()) throw new Error("Slack approval workspace does not match the authenticated installation");
		return context.app.client;
	}
	const client = context.resolveClient?.(teamId);
	if (!client) throw new Error("Slack Enterprise Grid approval client is unavailable");
	return client;
}
async function resolveApprovalChannel(client, target, teamId) {
	if (!teamId) return target;
	const parsed = parseSlackTarget(target, { defaultKind: "channel" });
	if (!parsed) throw new Error("Slack approval delivery target is missing");
	if (parsed.kind === "channel") return `channel:${parsed.id}`;
	const opened = await client.conversations.open({
		users: parsed.id,
		return_im: true
	});
	const channelId = normalizeOptionalString(opened.channel?.id);
	if (!channelId) throw new Error("Slack approval DM did not return a channel id");
	return `channel:${channelId}`;
}
//#endregion
export { slackApprovalNativeRuntime };
