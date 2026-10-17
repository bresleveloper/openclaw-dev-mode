import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatFencedCodeBlock } from "./markdown-code-Buzx6wvi.mjs";
import { n as isWellFormedApprovalId } from "./approval-id-BTRnO3t1.mjs";
import { _ as resolveExecApprovalAllowedDecisions } from "./exec-approvals-authorization.kernel-C_vJhPCn.mjs";
import "./exec-approvals-B1rZTeax.mjs";
import { n as summarizeApprovalScope } from "./approval-scope-D8jXLqpU.mjs";
import { o as supportsNativeExecApprovalClient, r as listNativeExecApprovalClientLabels, t as describeNativeExecApprovalClientSetup } from "./exec-approval-surface-BJG9uJSO.mjs";
import { t as formatHumanList } from "./human-list-Do_69QrK.mjs";
import { t as formatApprovalDisplayPath } from "./approval-display-paths-DyUJ1OWu.mjs";
//#region src/infra/exec-approval-reply.ts
function buildGenericNativeExecApprovalFallbackText(params) {
	const clients = formatHumanList(listNativeExecApprovalClientLabels(params));
	let manualRecovery = "Print the Control UI URL with `openclaw dashboard --no-open`, open it in a browser, then use the approval inbox.";
	if (params?.host === "node") {
		const nodeId = normalizeOptionalString(params.nodeId) ?? "<id|name|ip>";
		manualRecovery += ` Inspect the node's effective exec policy with \`openclaw approvals get --node ${nodeId}\`.`;
	}
	return clients ? `Approve it from the Web UI, or enable a native chat approval client such as ${clients}. ${manualRecovery} If those accounts already know your owner ID via allowFrom or owner config, OpenClaw can often infer approvers automatically.` : `Approve it from the Web UI. ${manualRecovery}`;
}
function resolveAllowedDecisions(params) {
	return params.allowedDecisions ?? resolveExecApprovalAllowedDecisions({ ask: params.ask });
}
function buildExecApprovalCommandText(params) {
	return `/approve ${params.approvalCommandId} ${params.decision}`;
}
function buildApprovalActionDescriptors(approvalCommandId, allowedDecisions) {
	return [
		{
			decision: "allow-once",
			label: "Allow Once",
			style: "success"
		},
		{
			decision: "allow-always",
			label: "Allow Always",
			style: "primary"
		},
		{
			decision: "deny",
			label: "Deny",
			style: "danger"
		}
	].filter((descriptor) => allowedDecisions.includes(descriptor.decision)).map((descriptor) => ({
		decision: descriptor.decision,
		label: descriptor.label,
		style: descriptor.style,
		command: buildExecApprovalCommandText({
			approvalCommandId,
			decision: descriptor.decision
		})
	}));
}
function buildExecApprovalActionDescriptors(params) {
	const approvalCommandId = params.approvalCommandId.trim();
	return approvalCommandId ? buildApprovalActionDescriptors(approvalCommandId, resolveAllowedDecisions(params)) : [];
}
/** Build approval descriptors with explicit owner-aware typed actions. */
function buildTypedApprovalActionDescriptors(params) {
	const approvalId = params.approvalCommandId;
	if (!isWellFormedApprovalId(approvalId)) return [];
	return buildApprovalActionDescriptors(approvalId, resolveAllowedDecisions(params)).map((descriptor) => ({
		decision: descriptor.decision,
		label: descriptor.label,
		style: descriptor.style,
		command: descriptor.command,
		action: {
			type: "approval",
			approvalId,
			approvalKind: params.approvalKind,
			decision: descriptor.decision
		}
	}));
}
/** Build portable approval controls from decision descriptors. */
function buildApprovalPresentationFromActionDescriptors(actions) {
	const buttons = actions.map((descriptor) => {
		const action = descriptor.action ?? {
			type: "command",
			command: descriptor.command
		};
		return {
			label: descriptor.label,
			action,
			...descriptor.action ? {} : { value: descriptor.command },
			style: descriptor.style
		};
	});
	return buttons.length > 0 ? { blocks: [{
		type: "buttons",
		buttons
	}] } : void 0;
}
/** Build the shipped command-backed portable approval controls. */
function buildApprovalButtonPresentation(params) {
	return buildApprovalPresentationFromActionDescriptors(buildExecApprovalActionDescriptors({
		approvalCommandId: params.approvalId,
		ask: params.ask,
		allowedDecisions: params.allowedDecisions
	}));
}
/** Build portable approval controls with explicit owner-aware typed actions. */
function buildTypedApprovalPresentation(params) {
	return buildApprovalPresentationFromActionDescriptors(buildTypedApprovalActionDescriptors({
		approvalCommandId: params.approvalId,
		approvalKind: params.approvalKind,
		ask: params.ask,
		allowedDecisions: params.allowedDecisions
	}));
}
/** Build the shipped command-backed exec-approval presentation. */
function buildExecApprovalPresentation(params) {
	return buildApprovalButtonPresentation({
		approvalId: params.approvalCommandId,
		ask: params.ask,
		allowedDecisions: params.allowedDecisions
	});
}
/** Build an exec-approval presentation with canonical typed decision actions. */
function buildTypedExecApprovalPresentation(params) {
	return buildTypedApprovalPresentation({
		approvalId: params.approvalCommandId,
		approvalKind: "exec",
		ask: params.ask,
		allowedDecisions: params.allowedDecisions
	});
}
function getExecApprovalApproverDmNoticeText() {
	return "Approval required. I sent approval DMs to the approvers for this account.";
}
function parseExecApprovalCommandText(raw) {
	const match = raw.trim().match(/^\/?approve(?:@[^\s]+)?\s+([A-Za-z0-9][A-Za-z0-9._:-]*)\s+(allow-once|allow-always|always|deny)\b/i);
	if (!match) return null;
	const rawDecision = normalizeOptionalLowercaseString(match[2]) ?? "";
	return {
		approvalId: expectDefined(match[1], "exec approval reply regex capture 1"),
		decision: rawDecision === "always" ? "allow-always" : rawDecision
	};
}
function formatExecApprovalExpiresIn(expiresAtMs, nowMs) {
	const totalSeconds = Math.max(0, Math.round((expiresAtMs - nowMs) / 1e3));
	if (totalSeconds < 60) return `${totalSeconds}s`;
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor(totalSeconds % 3600 / 60);
	const seconds = totalSeconds % 60;
	const parts = [];
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);
	if (hours === 0 && minutes < 5 && seconds > 0) parts.push(`${seconds}s`);
	return parts.join(" ");
}
function getExecApprovalReplyMetadata(payload) {
	const record = asOptionalRecord(asOptionalRecord(payload.channelData)?.execApproval);
	if (!record) return null;
	const approvalId = normalizeOptionalString(record.approvalId) ?? "";
	const approvalSlug = normalizeOptionalString(record.approvalSlug) ?? "";
	if (!approvalId || !approvalSlug) return null;
	const approvalKind = record.approvalKind === "plugin" || record.approvalKind === "system-agent" ? record.approvalKind : "exec";
	const allowedDecisions = Array.isArray(record.allowedDecisions) ? record.allowedDecisions.filter((value) => value === "allow-once" || value === "allow-always" || value === "deny") : void 0;
	return {
		approvalId,
		approvalSlug,
		approvalKind,
		agentId: normalizeOptionalString(record.agentId),
		allowedDecisions,
		sessionKey: normalizeOptionalString(record.sessionKey)
	};
}
function buildExecApprovalPendingReplyPayload(params) {
	const approvalCommandId = params.approvalCommandId?.trim() || params.approvalSlug;
	const allowedDecisions = resolveAllowedDecisions(params);
	const descriptors = buildExecApprovalActionDescriptors({
		approvalCommandId,
		allowedDecisions
	});
	const primaryAction = descriptors[0] ?? null;
	const secondaryActions = descriptors.slice(1);
	const lines = [];
	const warningText = params.warningText?.trim();
	if (warningText) lines.push(warningText);
	lines.push("Approval required.");
	if (primaryAction) {
		lines.push("Run:");
		lines.push(formatFencedCodeBlock(primaryAction.command, "txt"));
	}
	lines.push("Pending command:");
	lines.push(formatFencedCodeBlock(params.command, "sh"));
	if (secondaryActions.length > 0) lines.push("Other options:", formatFencedCodeBlock(secondaryActions.map((descriptor) => descriptor.command).join("\n"), "txt"));
	if (!allowedDecisions.includes("allow-always")) lines.push("Allow Always is unavailable for this command.");
	const info = [];
	info.push(`Host: ${params.host}`);
	if (params.nodeId) info.push(`Node: ${params.nodeId}`);
	if (params.cwd) info.push(`CWD: ${formatApprovalDisplayPath(params.cwd)}`);
	if (params.scope) info.push(`Scope: ${summarizeApprovalScope(params.scope)}`);
	if (typeof params.expiresAtMs === "number" && Number.isFinite(params.expiresAtMs)) info.push(`Expires in: ${formatExecApprovalExpiresIn(params.expiresAtMs, params.nowMs ?? Date.now())}`);
	info.push(`Full id: \`${params.approvalId}\``);
	lines.push(info.join("\n"));
	return {
		text: lines.join("\n\n"),
		presentation: buildApprovalButtonPresentation({
			approvalId: params.approvalId,
			allowedDecisions
		}),
		channelData: { execApproval: {
			approvalId: params.approvalId,
			approvalSlug: params.approvalSlug,
			approvalKind: "exec",
			agentId: normalizeOptionalString(params.agentId),
			allowedDecisions,
			sessionKey: normalizeOptionalString(params.sessionKey)
		} }
	};
}
/** Build an exec approval prompt with canonical typed decision actions. */
function buildTypedExecApprovalPendingReplyPayload(params) {
	return {
		...buildExecApprovalPendingReplyPayload(params),
		presentation: buildTypedExecApprovalPresentation({
			approvalCommandId: params.approvalId,
			allowedDecisions: resolveAllowedDecisions(params)
		})
	};
}
function buildExecApprovalUnavailableReplyPayload(params) {
	const lines = [];
	const channelData = { execApprovalUnavailable: { reason: params.reason } };
	const warningText = params.warningText?.trim();
	if (warningText) lines.push(warningText);
	if (params.sentApproverDms) {
		lines.push(getExecApprovalApproverDmNoticeText());
		return {
			text: lines.join("\n\n"),
			channelData
		};
	}
	if (params.reason === "initiating-platform-disabled") {
		lines.push(`Exec approval is required, but native chat exec approvals are not configured on ${params.channelLabel ?? "this platform"}.`);
		const channel = normalizeOptionalLowercaseString(params.channel);
		const setupText = channel && params.channelLabel && supportsNativeExecApprovalClient(channel) ? describeNativeExecApprovalClientSetup({
			channel,
			channelLabel: params.channelLabel,
			accountId: params.accountId
		}) : null;
		if (setupText) lines.push(setupText);
		else lines.push(buildGenericNativeExecApprovalFallbackText({
			host: params.host,
			nodeId: params.nodeId
		}));
	} else if (params.reason === "initiating-platform-unsupported") {
		lines.push(`Exec approval is required, but ${params.channelLabel ?? "this platform"} does not support chat exec approvals.`);
		lines.push(buildGenericNativeExecApprovalFallbackText({
			excludeChannel: params.channel,
			host: params.host,
			nodeId: params.nodeId
		}));
	} else {
		lines.push("Exec approval is required, but no interactive approval client is currently available.");
		lines.push(`${buildGenericNativeExecApprovalFallbackText({
			host: params.host,
			nodeId: params.nodeId
		})} Then retry the command. You can usually leave execApprovals.approvers unset when owner config already identifies the approvers.`);
	}
	return {
		text: lines.join("\n\n"),
		channelData
	};
}
//#endregion
export { buildExecApprovalPendingReplyPayload as a, buildTypedApprovalActionDescriptors as c, buildTypedExecApprovalPresentation as d, formatExecApprovalExpiresIn as f, parseExecApprovalCommandText as h, buildExecApprovalCommandText as i, buildTypedApprovalPresentation as l, getExecApprovalReplyMetadata as m, buildApprovalPresentationFromActionDescriptors as n, buildExecApprovalPresentation as o, getExecApprovalApproverDmNoticeText as p, buildExecApprovalActionDescriptors as r, buildExecApprovalUnavailableReplyPayload as s, buildApprovalButtonPresentation as t, buildTypedExecApprovalPendingReplyPayload as u };
