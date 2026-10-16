import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
//#region src/shared/session-method-scopes-base.ts
const SESSION_READ_METHODS = /* @__PURE__ */ new Set([
	"agent.identity.get",
	"agents.list",
	"canvas.document.preview",
	"models.list",
	"progressCard.get",
	"projects.list",
	"session.suggestions.list",
	"session.reactions.list",
	"sessions.groups.list",
	"sessions.list",
	"sessions.subscribe",
	"sessions.messages.subscribe",
	"sessions.messages.unsubscribe",
	"sessions.viewers.set",
	"sessions.preview",
	"sessions.describe",
	"sessions.branches.list",
	"sessions.get",
	"sessions.github.options",
	"sessions.github.status",
	"sessions.resolve",
	"sessions.search",
	"sessions.files.list",
	"sessions.files.get",
	"sessions.files.assets",
	"sessions.setInvolvement",
	"chat.history",
	"chat.startup",
	"chat.metadata",
	"chat.message.get",
	"session.members.list",
	"session.members.listEvidence",
	"themes.get",
	"themes.list",
	"users.prefs.get",
	"users.self"
]);
const SESSION_WRITE_METHODS = /* @__PURE__ */ new Set([
	"question.request",
	"question.waitAnswer",
	"question.resolve",
	"question.get",
	"question.list",
	"chat.send",
	"chat.abort",
	"sessions.create",
	"sessions.patch",
	"sessions.patchMany",
	"sessions.fork",
	"sessions.recover",
	"sessions.send",
	"sessions.steer",
	"sessions.abort",
	"sessions.goal.update",
	"sessions.goal.clear"
]);
/** Admission only: reads retain sharing policy; mutation owners must bind the caller's own row. */
function resolveSessionMethodScope(method, params) {
	if (SESSION_READ_METHODS.has(method)) return "operator.sessions.read";
	if (SESSION_WRITE_METHODS.has(method) && resolveBaseSessionMutationRequiredScope(method, params) !== "operator.admin") return "operator.sessions.write";
}
const SESSIONS_PATCH_WRITE_SCOPE_MUTATIONS = /* @__PURE__ */ new Set([
	"label",
	"autoLabel",
	"icon",
	"color",
	"category",
	"boardFace",
	"boardPresentation",
	"pinned",
	"archived",
	"snoozedUntil",
	"unread",
	"model",
	"agentRuntime",
	"thinkingLevel",
	"fastMode",
	"permissionMode"
]);
const SESSIONS_PATCH_WRITE_SCOPE_ENVELOPE_FIELDS = /* @__PURE__ */ new Set([
	"key",
	"agentId",
	"expectedSessionId",
	"expectedLifecycleRevision",
	"expectedPermissionMode",
	"expectedMarkedUnreadAt"
]);
const SESSIONS_DELETE_WRITE_SCOPE_FIELDS = /* @__PURE__ */ new Set([
	"key",
	"agentId",
	"deleteTranscript",
	"expectedSessionId",
	"archivedOnly"
]);
function resolveSessionsPatchRequiredScope(params) {
	if (!isRecord(params)) return "operator.write";
	if (params.permissionMode === "full" || Object.hasOwn(params, "sandboxMode")) return "operator.admin";
	return Object.keys(params).every((key) => SESSIONS_PATCH_WRITE_SCOPE_ENVELOPE_FIELDS.has(key) || SESSIONS_PATCH_WRITE_SCOPE_MUTATIONS.has(key)) ? "operator.write" : "operator.admin";
}
function resolveSessionsPatchManyRequiredScope(params) {
	if (!isRecord(params) || !isRecord(params.patch)) return "operator.write";
	if (params.patch.permissionMode === "full" || Object.hasOwn(params.patch, "sandboxMode")) return "operator.admin";
	return Object.keys(params.patch).every((key) => SESSIONS_PATCH_WRITE_SCOPE_MUTATIONS.has(key)) ? "operator.write" : "operator.admin";
}
function resolveSessionsCreateRequiredScope(params) {
	if (!isRecord(params)) return "operator.write";
	if (params.incognito === true || typeof params.key === "string" && isIncognitoSessionKey(params.key) || typeof params.parentSessionKey === "string" && isIncognitoSessionKey(params.parentSessionKey) || Object.hasOwn(params, "execNode") || Object.hasOwn(params, "toolOverrides") || params.permissionMode === "full") return "operator.admin";
	return "operator.write";
}
function resolveSessionsDeleteRequiredScope(params) {
	if (!isRecord(params) || params.archivedOnly !== true) return "operator.admin";
	return Object.keys(params).every((key) => SESSIONS_DELETE_WRITE_SCOPE_FIELDS.has(key)) ? "operator.write" : "operator.admin";
}
/** Browser-safe session mutation policy for methods without protocol validation. */
function resolveBaseSessionMutationRequiredScope(method, params) {
	if (method === "sessions.recover") return "operator.write";
	if (method === "sessions.create") return resolveSessionsCreateRequiredScope(params);
	if (method === "sessions.patch") return resolveSessionsPatchRequiredScope(params);
	if (method === "sessions.patchMany") return resolveSessionsPatchManyRequiredScope(params);
	if (method === "sessions.delete") return resolveSessionsDeleteRequiredScope(params);
}
//#endregion
export { resolveSessionMethodScope as n, resolveBaseSessionMutationRequiredScope as t };
