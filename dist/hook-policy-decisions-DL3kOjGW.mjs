//#region src/plugins/hook-policy-decisions.ts
function resolvePromptInjectionAllowed(policy) {
	return policy?.allowPromptInjection !== false;
}
function resolveConversationAccessAllowed(origin, policy) {
	return origin === "bundled" ? policy?.allowConversationAccess !== false : policy?.allowConversationAccess === true;
}
//#endregion
export { resolvePromptInjectionAllowed as n, resolveConversationAccessAllowed as t };
