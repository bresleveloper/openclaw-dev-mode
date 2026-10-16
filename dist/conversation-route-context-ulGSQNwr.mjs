import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/conversation-route-context.ts
const MAX_ROUTE_CONTEXT_ID_LENGTH = 512;
const MAX_ROUTE_CONTEXT_ROLE_IDS = 256;
const MAX_STORED_ROUTE_CONTEXT_LENGTH = 14e4;
function normalizeBoundedId(value) {
	const normalized = normalizeOptionalString(value);
	return normalized && normalized.length <= MAX_ROUTE_CONTEXT_ID_LENGTH ? normalized : void 0;
}
function normalizeRoleIds(value) {
	if (value === void 0) return { valid: true };
	if (!Array.isArray(value) || value.length > MAX_ROUTE_CONTEXT_ROLE_IDS) return { valid: false };
	const roleIds = [];
	for (const item of value) {
		const roleId = normalizeBoundedId(item);
		if (!roleId) return { valid: false };
		roleIds.push(roleId);
	}
	const unique = [...new Set(roleIds)].toSorted();
	return unique.length > 0 ? {
		valid: true,
		value: unique
	} : { valid: true };
}
/** Parses the closed, bounded route facts used to replay configured routing precedence. */
function parseConversationRouteContext(value) {
	if (!isRecord(value)) return;
	const context = {};
	for (const key of [
		"peerId",
		"guildId",
		"teamId",
		"parentPeerId"
	]) {
		const id = normalizeBoundedId(value[key]);
		if (value[key] !== void 0 && !id) return;
		if (id) context[key] = id;
	}
	const memberRoleIds = normalizeRoleIds(value.memberRoleIds);
	if (!memberRoleIds.valid) return;
	if (memberRoleIds.value) context.memberRoleIds = memberRoleIds.value;
	return Object.keys(context).length > 0 ? context : void 0;
}
/** Captures only authoritative inbound facts needed to replay configured route precedence. */
function conversationRouteContextFromMsgContext(ctx) {
	const channel = normalizeOptionalLowercaseString(ctx.OriginatingChannel ?? ctx.Provider);
	const spaceId = normalizeBoundedId(ctx.GroupSpace);
	const parentPeerId = normalizeBoundedId(ctx.ThreadParentId);
	return parseConversationRouteContext({
		...ctx.ConversationRoutePeerId !== void 0 ? { peerId: ctx.ConversationRoutePeerId } : {},
		...channel === "discord" && spaceId ? { guildId: spaceId } : {},
		...(channel === "slack" || channel === "mattermost" || channel === "msteams") && spaceId ? { teamId: spaceId } : {},
		...parentPeerId ? { parentPeerId } : {},
		...ctx.MemberRoleIds !== void 0 ? { memberRoleIds: ctx.MemberRoleIds } : {}
	});
}
function serializeStoredConversationRouteContext(context, observedAt) {
	const canonical = context === null ? null : parseConversationRouteContext(context);
	if (context !== null && !canonical) throw new Error("Invalid conversation route context");
	return JSON.stringify({
		version: 1,
		writeId: randomUUID(),
		observedAt,
		context: canonical ?? null
	});
}
function parseStoredConversationRouteContext(value, expectedObservedAt) {
	if (!value || value.length > MAX_STORED_ROUTE_CONTEXT_LENGTH) return;
	const parsed = safeParseJson(value);
	if (!isRecord(parsed) || parsed.version !== 1 || typeof parsed.writeId !== "string" || parsed.writeId.length === 0 || typeof parsed.observedAt !== "number" || parsed.observedAt !== expectedObservedAt) return;
	const context = parseConversationRouteContext(parsed.context);
	if (parsed.context !== null && !context) return;
	return context ? { context } : {};
}
function refreshStoredConversationRouteContext(value, previousObservedAt, observedAt) {
	const stored = parseStoredConversationRouteContext(value, previousObservedAt);
	return stored ? serializeStoredConversationRouteContext(stored.context ?? null, observedAt) : null;
}
//#endregion
export { serializeStoredConversationRouteContext as a, refreshStoredConversationRouteContext as i, parseConversationRouteContext as n, parseStoredConversationRouteContext as r, conversationRouteContextFromMsgContext as t };
