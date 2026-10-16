//#region src/cron/system-owned-declaration.ts
const HEARTBEAT_TASK_DECLARATION_PREFIX = "heartbeat-task:";
const HEARTBEAT_DECLARATION_PREFIX = "heartbeat:";
const SKILL_COLLECTION_REVIEW_DECLARATION_PREFIX = "skill-collection-review:";
/** Reserved creation namespaces, including Doctor-imported operator tasks. */
const SYSTEM_OWNED_DECLARATION_PREFIXES = [
	HEARTBEAT_TASK_DECLARATION_PREFIX,
	HEARTBEAT_DECLARATION_PREFIX,
	SKILL_COLLECTION_REVIEW_DECLARATION_PREFIX
];
function systemOwnedDeclarationKeyNamespace(declarationKey) {
	return SYSTEM_OWNED_DECLARATION_PREFIXES.find((prefix) => declarationKey?.startsWith(prefix));
}
function isSystemMonitorDeclaration(declarationKey) {
	return declarationKey?.startsWith("heartbeat:") === true || declarationKey?.startsWith("skill-collection-review:") === true;
}
//#endregion
export { systemOwnedDeclarationKeyNamespace as a, isSystemMonitorDeclaration as i, HEARTBEAT_TASK_DECLARATION_PREFIX as n, SKILL_COLLECTION_REVIEW_DECLARATION_PREFIX as r, HEARTBEAT_DECLARATION_PREFIX as t };
