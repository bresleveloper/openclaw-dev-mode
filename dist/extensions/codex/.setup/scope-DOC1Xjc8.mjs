//#region extensions/codex/src/migration/scope.ts
function isOnlyMigrationKind({ itemKinds }, kind) {
	return Boolean(itemKinds?.length && itemKinds.every((itemKind) => itemKind === kind));
}
//#endregion
export { isOnlyMigrationKind as t };
