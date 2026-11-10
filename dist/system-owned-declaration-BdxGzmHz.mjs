//#region src/cron/system-owned-declaration.ts
const HEARTBEAT_TASK_DECLARATION_PREFIX = "heartbeat-task:";
const HEARTBEAT_DECLARATION_PREFIX = "heartbeat:";
/** Retired weekly Workshop curator jobs; the store deletes these rows on load. */
const RETIRED_SKILL_COLLECTION_REVIEW_DECLARATION_PREFIX = "skill-collection-review:";
/** Reserved creation namespaces, including Doctor-imported operator tasks. */
const SYSTEM_OWNED_DECLARATION_PREFIXES = [
	HEARTBEAT_TASK_DECLARATION_PREFIX,
	HEARTBEAT_DECLARATION_PREFIX,
	RETIRED_SKILL_COLLECTION_REVIEW_DECLARATION_PREFIX
];
function systemOwnedDeclarationKeyNamespace(declarationKey) {
	return SYSTEM_OWNED_DECLARATION_PREFIXES.find((prefix) => declarationKey?.startsWith(prefix));
}
function isSystemMonitorDeclaration(declarationKey) {
	return declarationKey?.startsWith(HEARTBEAT_DECLARATION_PREFIX) === true;
}
//#endregion
export { systemOwnedDeclarationKeyNamespace as a, isSystemMonitorDeclaration as i, HEARTBEAT_TASK_DECLARATION_PREFIX as n, RETIRED_SKILL_COLLECTION_REVIEW_DECLARATION_PREFIX as r, HEARTBEAT_DECLARATION_PREFIX as t };
