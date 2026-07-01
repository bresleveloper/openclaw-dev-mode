import type { MigrationItem, MigrationPlan } from "../../plugins/types.js";
export declare const MIGRATION_SKILL_NOT_SELECTED_REASON = "not selected for migration";
export declare const MIGRATION_PLUGIN_NOT_SELECTED_REASON = "not selected for migration";
export declare const MIGRATION_SELECTION_ACCEPT = "__openclaw_migrate_accept_recommended__";
export declare const MIGRATION_SELECTION_TOGGLE_ALL_ON = "__openclaw_migrate_toggle_all_on__";
export declare const MIGRATION_SELECTION_TOGGLE_ALL_OFF = "__openclaw_migrate_toggle_all_off__";
export declare const MIGRATION_SKILL_SELECTION_ACCEPT = "__openclaw_migrate_accept_recommended__";
export declare const MIGRATION_SKILL_SELECTION_TOGGLE_ALL_ON = "__openclaw_migrate_toggle_all_on__";
export declare const MIGRATION_SKILL_SELECTION_TOGGLE_ALL_OFF = "__openclaw_migrate_toggle_all_off__";
type InteractiveMigrationSelection = {
    action: "select";
    selectedItemIds: Set<string>;
};
/** Interactive skill selection result consumed by the apply flow. */
type InteractiveMigrationSkillSelection = InteractiveMigrationSelection;
/** Interactive plugin selection result consumed by the apply flow. */
type InteractiveMigrationPluginSelection = InteractiveMigrationSelection;
/** Returns skill copy items that can still be selected or deselected. */
export declare function getSelectableMigrationSkillItems(plan: MigrationPlan): MigrationItem[];
/** Returns plugin install items that can still be selected or deselected. */
export declare function getSelectableMigrationPluginItems(plan: MigrationPlan): MigrationItem[];
/** Returns the stable checkbox value for a skill migration item. */
export declare function getMigrationSkillSelectionValue(item: MigrationItem): string;
/** Returns the stable checkbox value for a plugin migration item. */
export declare function getMigrationPluginSelectionValue(item: MigrationItem): string;
/** Formats the visible label for a plugin migration checkbox. */
export declare function formatMigrationPluginSelectionLabel(item: MigrationItem): string;
/** Defaults skill selection to planned items only. */
export declare function getDefaultMigrationSkillSelectionValues(items: readonly MigrationItem[]): string[];
/** Defaults plugin selection to planned items only. */
export declare function getDefaultMigrationPluginSelectionValues(items: readonly MigrationItem[]): string[];
/** Formats the visible label for a skill migration checkbox. */
export declare function formatMigrationSkillSelectionLabel(item: MigrationItem): string;
/** Formats conflict helper text for a skill migration checkbox. */
export declare function formatMigrationSkillSelectionHint(item: MigrationItem): string | undefined;
/** Formats conflict helper text for a plugin migration checkbox. */
export declare function formatMigrationPluginSelectionHint(item: MigrationItem): string | undefined;
/** Marks unselected selectable skill items as skipped and recomputes plan summary. */
export declare function applyMigrationSelectedSkillItemIds(plan: MigrationPlan, selectedItemIds: ReadonlySet<string>): MigrationPlan;
/** Applies skill refs passed by CLI flags to a migration plan. */
export declare function applyMigrationSkillSelection(plan: MigrationPlan, selectedSkillRefs: readonly string[] | undefined): MigrationPlan;
/** Applies plugin refs passed by CLI flags to a migration plan. */
export declare function applyMigrationPluginSelection(plan: MigrationPlan, selectedPluginRefs: readonly string[] | undefined): MigrationPlan;
/** Marks unselected plugin items skipped and filters matching Codex plugin config writes. */
export declare function applyMigrationSelectedPluginItemIds(plan: MigrationPlan, selectedItemIds: ReadonlySet<string>): MigrationPlan;
/** Resolves checkbox values into selected skill migration item ids. */
export declare function resolveInteractiveMigrationSkillSelection(items: readonly MigrationItem[], selectedValues: readonly string[]): InteractiveMigrationSkillSelection;
/** Resolves checkbox values into selected plugin migration item ids. */
export declare function resolveInteractiveMigrationPluginSelection(items: readonly MigrationItem[], selectedValues: readonly string[]): InteractiveMigrationPluginSelection;
/** Reconciles all/none checkbox toggles for the skill-selection prompt. */
export declare function reconcileInteractiveMigrationSkillToggleValues(selectedValues: readonly string[], activatedValue: string | undefined, selectableValues: readonly string[]): string[];
/** Reconciles Enter-key selection behavior for interactive migration prompts. */
export declare function reconcileInteractiveMigrationEnterValues(selectedValues: readonly string[], activatedValue: string | undefined, selectableValues: readonly string[], opts?: {
    preserveDeselectedActivatedValue?: boolean;
}): string[];
/** Reconciles keyboard shortcuts for all/none migration prompt selections. */
export declare function reconcileInteractiveMigrationShortcutValues(previousValues: readonly string[], selectedValues: readonly string[], selectableValues: readonly string[], key: "a" | "i"): string[];
export {};
