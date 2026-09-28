//#region src/gateway/session-method-policy.ts
const SESSION_TARGET_FIELDS_BY_METHOD = new Map([
	["skills.library.activate", ["sessionKey"]],
	["agent", ["sessionKey"]],
	["board.event", ["sessionKey"]],
	["board.update", ["sessionKey"]],
	["board.widget.grant", ["sessionKey"]],
	["board.widget.put", ["sessionKey"]],
	["chat.abort", ["sessionKey"]],
	["chat.inject", ["sessionKey"]],
	["chat.send", ["sessionKey"]],
	["mcp.app.callTool", ["sessionKey"]],
	["mcp.app.updateModelContext", ["sessionKey"]],
	["message.action", ["sessionKey"]],
	["plugins.sessionAction", ["sessionKey"]],
	["progressCard.get", ["sessionKey"]],
	["progressCard.put", ["sessionKey"]],
	["progressCard.refresh", ["sessionKey"]],
	["send", ["sessionKey"]],
	["session.discussion.open", ["sessionKey"]],
	["sessions.abort", ["key"]],
	["sessions.assignOwner", ["key"]],
	["sessions.setInvolvement", ["key"]],
	["sessions.companion.ask", ["sessionKey"]],
	["sessions.companion.reset", ["sessionKey"]],
	["sessions.companion.state", ["sessionKey"]],
	["sessions.compact", ["key"]],
	["sessions.create", ["key", "parentSessionKey"]],
	["sessions.delete", ["key"]],
	["sessions.dispatch", ["key"]],
	["sessions.files.set", ["sessionKey"]],
	["sessions.github.publish", ["sessionKey"]],
	["sessions.github.confirm", ["sessionKey"]],
	["sessions.fork", ["sessionKey"]],
	["sessions.patch", ["key"]],
	["sessions.goal.update", ["sessionKey"]],
	["sessions.goal.clear", ["sessionKey"]],
	["sessions.providerReview.continue", ["sessionKey"]],
	["sessions.pluginPatch", ["key"]],
	...["sessions.move", "sessions.reclaim"].map((method) => [method, ["key"]]),
	["sessions.recover", ["key"]],
	["sessions.reset", ["key"]],
	["sessions.rewind", ["sessionKey"]],
	["sessions.send", ["key"]],
	["sessions.steer", ["key"]],
	["sessions.branches.switch", ["sessionKey"]],
	["talk.voice.set", ["sessionKey"]],
	...[
		"taskSuggestions.create",
		"talk.client.close",
		"talk.client.create",
		"talk.client.steer",
		"talk.client.toolCall",
		"talk.client.transcript",
		"talk.session.create",
		"talk.session.steer",
		"wake"
	].map((method) => [method, ["sessionKey"]]),
	["tools.invoke", ["sessionKey"]]
]);
const REQUIRED_SESSION_TARGET_METHODS = /* @__PURE__ */ new Set([
	"skills.library.activate",
	"board.action",
	"board.event",
	"board.update",
	"board.widget.grant",
	"board.widget.put",
	"chat.abort",
	"chat.inject",
	"chat.send",
	"mcp.app.callTool",
	"mcp.app.updateModelContext",
	"progressCard.get",
	"progressCard.put",
	"progressCard.refresh",
	"session.discussion.open",
	"sessions.abort",
	"sessions.assignOwner",
	"sessions.branches.switch",
	"sessions.compact",
	"sessions.companion.reset",
	"sessions.delete",
	"sessions.dispatch",
	"sessions.files.set",
	"sessions.fork",
	"sessions.groups.delete",
	"sessions.groups.rename",
	"sessions.groups.update",
	"sessions.github.publish",
	"sessions.github.confirm",
	"sessions.patch",
	"sessions.goal.update",
	"sessions.goal.clear",
	"sessions.providerReview.continue",
	"sessions.pluginPatch",
	"sessions.reclaim",
	"sessions.recover",
	"sessions.move",
	"sessions.reset",
	"sessions.rewind",
	"sessions.send",
	"sessions.steer",
	"talk.client.close",
	"talk.client.steer",
	"talk.client.toolCall",
	"talk.client.transcript",
	"taskSuggestions.create"
]);
const APPROVAL_SESSION_TARGET_METHODS = /* @__PURE__ */ new Set([
	"approval.resolve",
	"exec.approval.resolve",
	"plugin.approval.resolve"
]);
const READ_ONLY_SESSION_TARGET_METHODS = /* @__PURE__ */ new Set([
	"sessions.setInvolvement",
	"sessions.companion.ask",
	"sessions.companion.state"
]);
const LEGACY_PROFILE_INDEPENDENT_MUTATION_METHODS = /* @__PURE__ */ new Set([
	"talk.client.close",
	"talk.client.create",
	"talk.client.steer",
	"talk.client.toolCall",
	"talk.client.transcript",
	"talk.session.create",
	"talk.session.steer",
	"wake"
]);
function sessionMutationTargetFields(method) {
	return READ_ONLY_SESSION_TARGET_METHODS.has(method) ? [] : SESSION_TARGET_FIELDS_BY_METHOD.get(method) ?? [];
}
function isRequiredSessionTargetMethod(method) {
	return REQUIRED_SESSION_TARGET_METHODS.has(method);
}
function isApprovalSessionTargetMethod(method) {
	return APPROVAL_SESSION_TARGET_METHODS.has(method);
}
function isSessionProfileDependentMethod(method) {
	if (LEGACY_PROFILE_INDEPENDENT_MUTATION_METHODS.has(method)) return false;
	return SESSION_TARGET_FIELDS_BY_METHOD.has(method) || REQUIRED_SESSION_TARGET_METHODS.has(method) || APPROVAL_SESSION_TARGET_METHODS.has(method) || method === "sessions.patchMany";
}
const AGENT_RUN_START_METHODS = /* @__PURE__ */ new Set([
	"sessions.providerReview.continue",
	"progressCard.refresh",
	"agent",
	"chat.send",
	"message.action",
	"send",
	"sessions.dispatch",
	"sessions.send",
	"sessions.steer",
	"talk.client.create",
	"talk.client.toolCall",
	"talk.session.create",
	"tools.invoke",
	"wake"
]);
/** Run starts require participation even when the operator has admin scope. */
function isAgentRunStartMethod(method, requestParams) {
	return AGENT_RUN_START_METHODS.has(method) || method === "sessions.goal.update" && typeof requestParams === "object" && requestParams !== null && "action" in requestParams && requestParams.action === "resume";
}
//#endregion
export { sessionMutationTargetFields as a, isSessionProfileDependentMethod as i, isApprovalSessionTargetMethod as n, isRequiredSessionTargetMethod as r, isAgentRunStartMethod as t };
