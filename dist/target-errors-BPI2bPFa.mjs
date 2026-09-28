import { t as MessageActionDeniedError } from "./message-action-denial-DOmE5Ll7.mjs";
//#region src/infra/outbound/target-errors.ts
/**
* Formats the user-facing error shown when no target is available.
*/
function missingTargetMessage(provider, hint) {
	return `Delivering to ${provider} requires target${formatTargetHint(hint)}`;
}
/**
* Builds an Error for missing outbound target failures.
*/
function missingTargetError(provider, hint) {
	return new MessageActionDeniedError(missingTargetMessage(provider, hint), "message_target_missing", "message-target:required");
}
function missingMessageActionTargetError(action) {
	return new MessageActionDeniedError(`Action ${action} requires a target.`, "message_target_missing", "message-target:required");
}
function invalidMessageActionTargetError(message) {
	return new MessageActionDeniedError(message, "message_target_invalid", "message-target:valid");
}
/**
* Formats the user-facing error shown when a target name resolves ambiguously.
*/
function ambiguousTargetMessage(provider, raw, hint) {
	return `Ambiguous target "${raw}" for ${provider}. Provide a unique name or an explicit id.${formatTargetHint(hint, true)}`;
}
/**
* Builds an Error for ambiguous outbound target failures.
*/
function ambiguousTargetError(provider, raw, hint) {
	return new MessageActionDeniedError(ambiguousTargetMessage(provider, raw, hint), "message_target_ambiguous", "message-target:unique");
}
/**
* Formats the user-facing error shown when no target matches the input.
*/
function unknownTargetMessage(provider, raw, hint) {
	return `Unknown target "${raw}" for ${provider}.${formatTargetHint(hint, true)}`;
}
/**
* Builds an Error for unknown outbound target failures.
*/
function unknownTargetError(provider, raw, hint) {
	return new MessageActionDeniedError(unknownTargetMessage(provider, raw, hint), "message_target_unknown", "message-target:known");
}
function reservedTargetLiteralMessage(provider, raw, hint) {
	return `Reserved target "${raw}" for ${provider} cannot be used as a literal destination. Provide an explicit id or handle.${formatTargetHint(hint, true)}`;
}
function reservedTargetLiteralError(provider, raw, hint) {
	return new MessageActionDeniedError(reservedTargetLiteralMessage(provider, raw, hint), "message_target_reserved", "message-target:explicit");
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
