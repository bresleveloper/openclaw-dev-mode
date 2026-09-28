let openclaw_plugin_sdk_string_coerce_runtime = require("openclaw/plugin-sdk/string-coerce-runtime");
let openclaw_plugin_sdk_approval_runtime = require("openclaw/plugin-sdk/approval-runtime");
//#region extensions/msteams/src/approval-card-actions.ts
const msTeamsApprovalControls = (0, openclaw_plugin_sdk_approval_runtime.createNativeApprovalControlRegistry)({ releaseClaimOnLookupExpiry: true });
function readMSTeamsApprovalActionToken(value) {
	if (!(0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value)) return null;
	const action = (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(value.action) ? value.action : void 0;
	const submitted = action && (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalLowercaseString)(action.type) === "action.submit" && (0, openclaw_plugin_sdk_string_coerce_runtime.isRecord)(action.data) ? action.data : value;
	if (submitted.openclawAction !== "approval") return null;
	return (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(submitted.token) ?? null;
}
//#endregion
//#region extensions/msteams/src/approval-card.ts
function buildCardHeading(title, subtitle) {
	return [{
		type: "TextBlock",
		text: title,
		weight: "Bolder",
		size: "Medium",
		wrap: true
	}, {
		type: "TextBlock",
		text: subtitle,
		isSubtle: true,
		wrap: true
	}];
}
function buildApprovalSubject(view) {
	if (view.approvalKind === "system-agent") return [{
		type: "TextBlock",
		text: "Change",
		weight: "Bolder",
		wrap: true
	}, {
		type: "TextBlock",
		text: view.operationSummary,
		wrap: true
	}];
	if (view.approvalKind === "exec") return [
		{
			type: "TextBlock",
			text: "Command",
			weight: "Bolder",
			wrap: true
		},
		{
			type: "TextBlock",
			text: view.commandText,
			fontType: "Monospace",
			wrap: true
		},
		...view.commandPreview && view.commandPreview !== view.commandText ? [{
			type: "TextBlock",
			text: "Preview",
			weight: "Bolder",
			wrap: true
		}, {
			type: "TextBlock",
			text: view.commandPreview,
			fontType: "Monospace",
			wrap: true
		}] : []
	];
	return [
		{
			type: "TextBlock",
			text: "Request",
			weight: "Bolder",
			wrap: true
		},
		{
			type: "TextBlock",
			text: view.title,
			weight: "Bolder",
			wrap: true
		},
		...view.description ? [{
			type: "TextBlock",
			text: view.description,
			wrap: true
		}] : []
	];
}
function buildApprovalMetadata(approvalId, metadata) {
	return {
		type: "FactSet",
		facts: [{
			title: "Approval ID:",
			value: approvalId
		}].concat(metadata.map(({ label, value }) => ({
			title: `${label}:`,
			value
		})))
	};
}
function buildAdaptiveCard(body, actions) {
	return {
		type: "AdaptiveCard",
		version: "1.5",
		body,
		...actions?.length ? { actions } : {}
	};
}
function buildMSTeamsPendingApprovalCard(params) {
	const { view, nowMs } = params;
	const kindLabel = view.approvalKind === "plugin" ? "Plugin" : view.approvalKind === "system-agent" ? "OpenClaw Change" : "Exec";
	const actionTokens = [];
	const actions = view.actions.map(({ decision, label }) => {
		const token = msTeamsApprovalControls.createToken();
		actionTokens.push({
			token,
			decision
		});
		return {
			type: "Action.Submit",
			title: label,
			data: {
				openclawAction: "approval",
				token
			}
		};
	});
	const remainingSeconds = Math.max(0, Math.ceil((view.expiresAtMs - nowMs) / 1e3));
	const body = [
		...buildCardHeading(`${kindLabel} Approval Required`, `Expires in ${remainingSeconds}s`),
		...buildApprovalSubject(view),
		buildApprovalMetadata(view.approvalId, view.metadata)
	];
	return {
		approvalId: view.approvalId,
		approvalKind: view.approvalKind,
		expiresAtMs: view.expiresAtMs,
		card: buildAdaptiveCard(body, actions),
		actionTokens,
		allowedDecisions: view.actions.map(({ decision }) => decision)
	};
}
function buildMSTeamsResolvedApprovalCard(view) {
	const kindLabel = view.approvalKind === "plugin" ? "Plugin" : view.approvalKind === "system-agent" ? "OpenClaw Change" : "Exec";
	const resolvedBy = (0, openclaw_plugin_sdk_string_coerce_runtime.normalizeOptionalString)(view.resolvedBy);
	return buildAdaptiveCard([
		...buildCardHeading(`${kindLabel} Approval: ${(0, openclaw_plugin_sdk_approval_runtime.formatChannelApprovalResolvedLabel)(view)}`, resolvedBy ? `Resolved by ${resolvedBy}` : "Resolved"),
		...buildApprovalSubject(view),
		buildApprovalMetadata(view.approvalId, view.metadata)
	]);
}
function buildMSTeamsExpiredApprovalCard(view) {
	return buildAdaptiveCard([
		...buildCardHeading(`${view.approvalKind === "plugin" ? "Plugin" : view.approvalKind === "system-agent" ? "OpenClaw Change" : "Exec"} Approval Expired`, "This approval request expired before it was resolved."),
		...buildApprovalSubject(view),
		buildApprovalMetadata(view.approvalId, view.metadata)
	]);
}
function buildMSTeamsCanonicalApprovalTerminalCard(result) {
	const { approval } = result;
	const { presentation } = approval;
	const kindLabel = presentation.kind === "exec" ? "Exec" : presentation.kind === "plugin" ? "Plugin" : "System Agent";
	const outcome = approval.status === "allowed" ? (0, openclaw_plugin_sdk_approval_runtime.formatApprovalDecisionLabel)(approval.decision) : approval.status === "denied" ? "Denied" : approval.status === "expired" ? "Expired" : "Cancelled";
	const subject = presentation.kind === "exec" ? [{
		type: "TextBlock",
		text: "Command",
		weight: "Bolder",
		wrap: true
	}, {
		type: "TextBlock",
		text: presentation.commandPreview ?? presentation.commandText,
		fontType: "Monospace",
		wrap: true
	}] : [{
		type: "TextBlock",
		text: presentation.title,
		weight: "Bolder",
		wrap: true
	}, {
		type: "TextBlock",
		text: presentation.description,
		wrap: true
	}];
	const metadata = [
		{
			label: "Status",
			value: approval.status
		},
		..."decision" in approval ? [{
			label: "Decision",
			value: approval.decision
		}] : [],
		{
			label: "Reason",
			value: approval.reason
		}
	];
	return buildAdaptiveCard([
		...buildCardHeading(`${kindLabel} Approval: ${outcome}`, result.applied ? "Resolved by this action" : "Already resolved"),
		...subject,
		buildApprovalMetadata(approval.id, metadata)
	]);
}
//#endregion
Object.defineProperty(exports, "buildMSTeamsCanonicalApprovalTerminalCard", {
	enumerable: true,
	get: function() {
		return buildMSTeamsCanonicalApprovalTerminalCard;
	}
});
Object.defineProperty(exports, "buildMSTeamsExpiredApprovalCard", {
	enumerable: true,
	get: function() {
		return buildMSTeamsExpiredApprovalCard;
	}
});
Object.defineProperty(exports, "buildMSTeamsPendingApprovalCard", {
	enumerable: true,
	get: function() {
		return buildMSTeamsPendingApprovalCard;
	}
});
Object.defineProperty(exports, "buildMSTeamsResolvedApprovalCard", {
	enumerable: true,
	get: function() {
		return buildMSTeamsResolvedApprovalCard;
	}
});
Object.defineProperty(exports, "msTeamsApprovalControls", {
	enumerable: true,
	get: function() {
		return msTeamsApprovalControls;
	}
});
Object.defineProperty(exports, "readMSTeamsApprovalActionToken", {
	enumerable: true,
	get: function() {
		return readMSTeamsApprovalActionToken;
	}
});
