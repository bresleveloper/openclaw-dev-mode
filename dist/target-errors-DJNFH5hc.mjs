import { t as MessageActionDeniedError } from "./message-action-denial-DOmE5Ll7.mjs";
//#region src/infra/outbound/target-errors.ts
function missingTargetError(provider, hint) {
	return new MessageActionDeniedError(`Delivering to ${provider} requires target${formatTargetHint(hint)}`, "message_target_missing", "message-target:required");
}
function missingMessageActionTargetError(action) {
	return new MessageActionDeniedError(`Action ${action} requires a target.`, "message_target_missing", "message-target:required");
}
function invalidMessageActionTargetError(message) {
	return new MessageActionDeniedError(message, "message_target_invalid", "message-target:valid");
}
function ambiguousTargetError(provider, raw, hint) {
	return new MessageActionDeniedError(`Ambiguous target "${raw}" for ${provider}. Provide a unique name or an explicit id.${formatTargetHint(hint, true)}`, "message_target_ambiguous", "message-target:unique");
}
function unknownTargetError(provider, raw, hint) {
	return new MessageActionDeniedError(`Unknown target "${raw}" for ${provider}.${formatTargetHint(hint, true)}`, "message_target_unknown", "message-target:known");
}
function reservedTargetLiteralError(provider, raw, hint) {
	return new MessageActionDeniedError(`Reserved target "${raw}" for ${provider} cannot be used as a literal destination. Provide an explicit id or handle.${formatTargetHint(hint, true)}`, "message_target_reserved", "message-target:explicit");
}
function isReservedTargetLiteralError(error) {
	return error.message.includes("Reserved target");
}
function formatTargetHint(hint, withLabel = false) {
	const normalized = hint?.trim();
	if (!normalized) return "";
	return withLabel ? ` Hint: ${normalized}` : ` ${normalized}`;
}
//#endregion
export { missingTargetError as a, missingMessageActionTargetError as i, invalidMessageActionTargetError as n, reservedTargetLiteralError as o, isReservedTargetLiteralError as r, unknownTargetError as s, ambiguousTargetError as t };
