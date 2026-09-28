import { n as sanitizeExecApprovalDisplayText, t as exceedsApprovalTextLimit } from "./exec-approval-text-sanitize-B7wKpPNH.mjs";
//#region src/infra/approval-scope.ts
function summarizeApprovalScope(scope) {
	switch (scope.kind) {
		case "message-send": {
			const recipientLabel = scope.recipientCount === 1 ? "recipient" : "recipients";
			const audience = scope.audience ? ` (${scope.audience})` : "";
			const recipients = scope.recipients ?? [];
			const remaining = scope.recipientCount - recipients.length;
			const preview = recipients.length ? `: ${[...recipients, ...remaining > 0 ? [`+${remaining} more`] : []].join(", ")}` : "";
			return `Send to ${scope.recipientCount} ${recipientLabel} via ${scope.target}${audience}${preview}`;
		}
		case "payment": return `Pay ${scope.amount} ${scope.currency} to ${scope.target}`;
		case "external-post": return `Post ${scope.visibility === "public" ? "publicly" : "restricted"} to ${scope.target}`;
		case "standing-grant": {
			const term = scope.expiresInDays !== void 0 ? `for ${scope.expiresInDays} days` : "until revoked";
			return `Always allow runs this exact command for "${scope.automation}" without asking, ${term} (revocable)`;
		}
	}
	throw new Error("Unsupported approval scope");
}
function sanitizeApprovalScope(scope) {
	if (scope.kind === "standing-grant") {
		const automation = sanitizeExecApprovalDisplayText(scope.automation);
		const command = sanitizeExecApprovalDisplayText(scope.command);
		return exceedsApprovalTextLimit(automation, 128) || exceedsApprovalTextLimit(command, 256) ? null : {
			...scope,
			automation,
			command
		};
	}
	const target = sanitizeExecApprovalDisplayText(scope.target);
	if (exceedsApprovalTextLimit(target, 128)) return null;
	switch (scope.kind) {
		case "message-send": {
			const recipients = scope.recipients?.slice(0, scope.recipientCount).map(sanitizeExecApprovalDisplayText);
			if (recipients?.some((recipient) => exceedsApprovalTextLimit(recipient, 128))) return null;
			return {
				...scope,
				target,
				...recipients ? { recipients } : {}
			};
		}
		case "payment": {
			const amount = sanitizeExecApprovalDisplayText(scope.amount);
			const currency = sanitizeExecApprovalDisplayText(scope.currency);
			return exceedsApprovalTextLimit(amount, 40) || exceedsApprovalTextLimit(currency, 12) ? null : {
				...scope,
				amount,
				currency,
				target
			};
		}
		case "external-post": return {
			...scope,
			target
		};
	}
	return null;
}
//#endregion
export { summarizeApprovalScope as n, sanitizeApprovalScope as t };
