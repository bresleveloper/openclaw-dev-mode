import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/auto-reply/command-turn-context.ts
/** Command-source normalization for native slash commands, text slash commands, and plain messages. */
function resolveCommandBody(input) {
	if (typeof input.commandText === "string") return input.commandText;
	return normalizeOptionalString(input.CommandBody) ?? normalizeOptionalString(input.BodyForCommands) ?? normalizeOptionalString(input.RawBody) ?? normalizeOptionalString(input.Body);
}
function parseCommandName(body) {
	if (!body?.startsWith("/")) return;
	const name = body.slice(1).split(/\s+/, 1)[0]?.split("@", 1)[0];
	return normalizeOptionalString(name);
}
/** Maps the internal turn discriminator to the source value used by downstream routing. */
function commandTurnKindToSource(kind) {
	if (kind === "native") return "native";
	if (kind === "text-slash") return "text";
	return "message";
}
function normalizeCommandTurnKind(value) {
	return value === "native" || value === "text-slash" || value === "normal" ? value : void 0;
}
function normalizeCommandTurnSource(value) {
	return value === "native" || value === "text" || value === "message" ? value : void 0;
}
/** Maps source metadata back to the closed turn kind used by command checks. */
function commandTurnSourceToKind(source) {
	if (source === "native") return "native";
	if (source === "text") return "text-slash";
	return "normal";
}
/** Builds a normalized command-turn context and forces normal messages to unauthorized. */
function createCommandTurnContext(source, input) {
	if (source === "native") return {
		kind: "native",
		source: "native",
		authorized: input.authorized,
		commandName: input.commandName,
		body: input.body
	};
	if (source === "text") return {
		kind: "text-slash",
		source: "text",
		authorized: input.authorized,
		commandName: input.commandName,
		body: input.body
	};
	return {
		kind: "normal",
		source: "message",
		authorized: false,
		commandName: input.commandName,
		body: input.body
	};
}
function normalizeExplicitCommandTurn(value, input) {
	if (!value || typeof value !== "object") return;
	const record = value;
	const kind = normalizeCommandTurnKind(record.kind);
	const source = normalizeCommandTurnSource(record.source) ?? (kind ? commandTurnKindToSource(kind) : void 0);
	const resolvedKind = kind ?? (source ? commandTurnSourceToKind(source) : void 0);
	if (kind && source && commandTurnKindToSource(kind) !== source) return;
	if (!resolvedKind || !source) return;
	const body = normalizeOptionalString(record.body) ?? resolveCommandBody(input);
	return createCommandTurnContext(source, {
		authorized: resolvedKind === "normal" ? false : typeof record.authorized === "boolean" ? record.authorized : input.CommandAuthorized === true,
		commandName: normalizeOptionalString(record.commandName) ?? parseCommandName(body),
		body
	});
}
/** Normalizes command metadata with a legacy body fallback for older channel contexts. */
function resolveCommandTurnContext(input) {
	const explicit = normalizeExplicitCommandTurn(input.CommandTurn, input);
	if (explicit) return explicit;
	const source = input.CommandSource === "native" ? "native" : input.CommandSource === "text" ? "text" : "message";
	const body = resolveCommandBody(input);
	return createCommandTurnContext(source, {
		authorized: commandTurnSourceToKind(source) === "normal" ? false : input.CommandAuthorized === true,
		commandName: parseCommandName(body),
		body
	});
}
/** Returns true for channel-native command turns. */
function isNativeCommandTurn(commandTurn) {
	return commandTurn?.kind === "native";
}
/** Returns true for text slash-command turns regardless of authorization. */
function isTextSlashCommandTurn(commandTurn) {
	return commandTurn?.kind === "text-slash";
}
function isAuthorizedTextSlashCommandTurn(commandTurn) {
	return commandTurn?.kind === "text-slash" && commandTurn.authorized;
}
/** Returns true when a turn was explicitly invoked by a native or authorized text command. */
function isExplicitCommandTurn(commandTurn) {
	return commandTurn?.kind === "native" || commandTurn?.kind === "text-slash" && commandTurn.authorized;
}
/** Resolves the target session override for trusted native or explicit steer command turns. */
function resolveCommandTurnTargetSessionKey(input) {
	const commandTurn = resolveCommandTurnContext(input);
	const isExplicitTextSteer = isAuthorizedTextSlashCommandTurn(commandTurn) && (commandTurn.commandName?.toLowerCase() === "steer" || commandTurn.commandName?.toLowerCase() === "tell");
	if (!isNativeCommandTurn(commandTurn) && !isExplicitTextSteer || typeof input.CommandTargetSessionKey !== "string") return;
	const trimmed = input.CommandTargetSessionKey.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}
//#endregion
export { isNativeCommandTurn as a, resolveCommandTurnContext as c, isExplicitCommandTurn as i, resolveCommandTurnTargetSessionKey as l, createCommandTurnContext as n, isTextSlashCommandTurn as o, isAuthorizedTextSlashCommandTurn as r, resolveCommandBody as s, commandTurnKindToSource as t };
