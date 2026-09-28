import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { d as markMigrationItemSkipped, y as summarizeMigrationItems } from "./migration-DepQtnwV.mjs";
//#region src/commands/migrate/item-selection.ts
/** Exact migration item selection for embedded and non-interactive callers. */
const MIGRATION_NOT_SELECTED_REASON = "not selected for migration";
function formatSelectionRefList(values) {
	return values.length === 0 ? "none" : values.map((value) => `"${value}"`).join(", ");
}
/** Applies an exact item-id selection to planned/conflicting migration items. */
function applyMigrationItemSelection(plan, selectedItemIds) {
	if (selectedItemIds === void 0) return plan;
	const selectable = plan.items.filter((item) => item.status === "planned" || item.status === "conflict");
	const selectableIds = new Set(selectable.map((item) => item.id));
	const unknown = uniqueStrings(selectedItemIds).filter((id) => !selectableIds.has(id));
	if (unknown.length > 0) throw new Error(`Unknown or unavailable migration item ids: ${formatSelectionRefList(unknown)}.`);
	const selected = new Set(selectedItemIds);
	const items = plan.items.map((item) => selectableIds.has(item.id) && !selected.has(item.id) ? markMigrationItemSkipped(item, MIGRATION_NOT_SELECTED_REASON) : item);
	return {
		...plan,
		items,
		summary: summarizeMigrationItems(items)
	};
}
//#endregion
export { applyMigrationItemSelection as t };
