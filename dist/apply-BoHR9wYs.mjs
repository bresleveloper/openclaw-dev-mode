import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-f6PhkiZS.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-B7redWCL.mjs";
import { t as beginLifecycleWriteCustody } from "./lifecycle-write-custody-Y0-8ADx0.mjs";
import { r as withProgress } from "./progress-BQygak_O.mjs";
import { d as markMigrationItemSkipped, y as summarizeMigrationItems } from "./migration-DepQtnwV.mjs";
import { t as backupCreateCommand } from "./backup-Bucwkid5.mjs";
import { n as buildMigrationReportDir, t as buildMigrationContext } from "./context-Dp3Hhq9_.mjs";
import { t as applyMigrationItemSelection } from "./item-selection-DwfRs0sn.mjs";
import { n as assertApplySucceeded, o as writeApplyResult, r as assertConflictFreePlan, t as MIGRATION_CONFLICT_REASON_PHRASES } from "./output-BjJE7NTf.mjs";
import { t as buildMigrationProviderOptions } from "./providers-BdZYy8U1.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/migrate/selection.ts
/** Selection helpers for filtering migration plan items before apply. */
const MIGRATION_NOT_SELECTED_REASON = "not selected for migration";
const MIGRATION_SELECTION_ACCEPT = "__openclaw_migrate_accept_recommended__";
const MIGRATION_SELECTION_TOGGLE_ALL_ON = "__openclaw_migrate_toggle_all_on__";
const MIGRATION_SELECTION_TOGGLE_ALL_OFF = "__openclaw_migrate_toggle_all_off__";
function normalizeSelectionRef(value) {
	return value.trim().toLowerCase();
}
function readMigrationSkillName(item) {
	return normalizeOptionalString(item.details?.skillName);
}
function readMigrationSkillSourceLabel(item) {
	return normalizeOptionalString(item.details?.sourceLabel);
}
function readMigrationPluginName(item) {
	return normalizeOptionalString(item.details?.pluginName);
}
function readMigrationPluginConfigKey(item) {
	return normalizeOptionalString(item.details?.configKey);
}
function readMigrationPluginMarketplaceName(item) {
	return normalizeOptionalString(item.details?.marketplaceName);
}
function migrationSkillRefs(item) {
	const skillName = readMigrationSkillName(item);
	const idSuffix = item.id.startsWith("skill:") ? item.id.slice(6) : void 0;
	const sourceBase = item.source ? path.basename(item.source) : void 0;
	const targetBase = item.target ? path.basename(item.target) : void 0;
	return [
		item.id,
		idSuffix,
		skillName,
		sourceBase,
		targetBase
	].filter((value) => typeof value === "string" && value.trim().length > 0);
}
function migrationPluginRefs(item) {
	const pluginName = readMigrationPluginName(item);
	const configKey = readMigrationPluginConfigKey(item);
	const idSuffix = item.id.startsWith("plugin:") ? item.id.slice(7) : void 0;
	const sourceBase = item.source ? path.basename(item.source) : void 0;
	const targetBase = item.target ? path.basename(item.target) : void 0;
	return [
		item.id,
		idSuffix,
		pluginName,
		configKey,
		sourceBase,
		targetBase
	].filter((value) => typeof value === "string" && value.trim().length > 0);
}
function formatSelectionRefList(values) {
	if (values.length === 0) return "none";
	return values.map((value) => `"${value}"`).join(", ");
}
function buildSelectionIndex(items, refsForItem) {
	const index = /* @__PURE__ */ new Map();
	for (const item of items) for (const ref of refsForItem(item)) {
		const normalized = normalizeSelectionRef(ref);
		if (!normalized) continue;
		const existing = index.get(normalized) ?? /* @__PURE__ */ new Set();
		existing.add(item.id);
		index.set(normalized, existing);
	}
	return index;
}
function resolveSelectedMigrationItemIds(params) {
	const index = buildSelectionIndex(params.items, params.refsForItem);
	const selectedIds = /* @__PURE__ */ new Set();
	const unknownRefs = [];
	const ambiguousRefs = [];
	for (const ref of params.selectedRefs) {
		const normalized = normalizeSelectionRef(ref);
		if (!normalized) continue;
		const matches = index.get(normalized);
		if (!matches) {
			unknownRefs.push(ref);
			continue;
		}
		if (matches.size > 1) {
			ambiguousRefs.push(ref);
			continue;
		}
		const [id] = matches;
		if (id) selectedIds.add(id);
	}
	if (unknownRefs.length > 0 || ambiguousRefs.length > 0) {
		const available = params.items.map(params.formatSelectionLabel).toSorted((a, b) => a.localeCompare(b));
		const titleKind = expectDefined(params.kindLabel[0], "kind label entry at 0").toUpperCase() + params.kindLabel.slice(1);
		const parts = [];
		if (unknownRefs.length > 0) parts.push(`No migratable ${params.kindLabel} matched ${formatSelectionRefList(unknownRefs)}.`);
		if (ambiguousRefs.length > 0) parts.push(`${titleKind} selection ${formatSelectionRefList(ambiguousRefs)} was ambiguous.`);
		parts.push(`Available ${params.availableLabel}: ${available.length > 0 ? available.join(", ") : "none"}.`);
		throw new Error(parts.join(" "));
	}
	return selectedIds;
}
/** Returns skill copy items that can still be selected or deselected. */
function getSelectableMigrationSkillItems(plan) {
	return plan.items.filter((item) => item.kind === "skill" && item.action === "copy" && (item.status === "planned" || item.status === "conflict"));
}
/** Returns plugin install items that can still be selected or deselected. */
function getSelectableMigrationPluginItems(plan) {
	return plan.items.filter((item) => item.kind === "plugin" && item.action === "install" && (item.status === "planned" || item.status === "conflict"));
}
/** Formats the visible label for a plugin migration checkbox. */
function formatMigrationPluginSelectionLabel(item) {
	return readMigrationPluginName(item) ?? item.id.replace(/^plugin:/u, "");
}
/** Defaults migration checkboxes to planned item ids in plan order. */
function getDefaultMigrationSelectionValues(items) {
	return items.filter((item) => item.status === "planned").map((item) => item.id);
}
/** Formats the visible label for a skill migration checkbox. */
function formatMigrationSkillSelectionLabel(item) {
	return readMigrationSkillName(item) ?? item.id.replace(/^skill:/u, "");
}
function humanizeMigrationConflictReason(reason) {
	if (!reason) return "conflict";
	return MIGRATION_CONFLICT_REASON_PHRASES[reason] ?? reason;
}
/** Formats conflict helper text for a skill migration checkbox. */
function formatMigrationSkillSelectionHint(item) {
	if (item.status !== "conflict") return;
	const sourceLabel = readMigrationSkillSourceLabel(item);
	const reason = humanizeMigrationConflictReason(item.reason);
	return sourceLabel ? `${sourceLabel} ${reason}` : reason;
}
/** Formats conflict helper text for a plugin migration checkbox. */
function formatMigrationPluginSelectionHint(item) {
	if (item.status !== "conflict") return;
	const marketplace = readMigrationPluginMarketplaceName(item);
	const reason = humanizeMigrationConflictReason(item.reason);
	return marketplace ? `${marketplace} plugin ${reason}` : reason;
}
/** Keeps skill copies and their per-skill config patches inside the same selection. */
function applyMigrationSelectedSkillItemIds(plan, selectedItemIds) {
	const selectable = getSelectableMigrationSkillItems(plan);
	const selectableIds = new Set(selectable.map((item) => item.id));
	const selectedSkillNames = new Set(selectable.filter((item) => selectedItemIds.has(item.id)).map((item) => readMigrationSkillName(item) ?? (item.source ? path.basename(item.source) : void 0)).filter((name) => name !== void 0));
	const items = plan.items.map((item) => {
		const configPath = item.kind === "config" ? item.details?.path : void 0;
		if (Array.isArray(configPath) && configPath.length === 3 && configPath[0] === "skills" && configPath[1] === "entries" && !selectedSkillNames.has(configPath[2]) && (item.status === "planned" || item.status === "conflict")) return markMigrationItemSkipped(item, MIGRATION_NOT_SELECTED_REASON);
		if (!selectableIds.has(item.id) || selectedItemIds.has(item.id)) return item;
		return markMigrationItemSkipped(item, MIGRATION_NOT_SELECTED_REASON);
	});
	return {
		...plan,
		items,
		summary: summarizeMigrationItems(items)
	};
}
/** Applies skill refs passed by CLI flags to a migration plan. */
function applyMigrationSkillSelection(plan, selectedSkillRefs) {
	if (selectedSkillRefs === void 0) return plan;
	return applyMigrationSelectedSkillItemIds(plan, resolveSelectedMigrationItemIds({
		items: getSelectableMigrationSkillItems(plan),
		selectedRefs: selectedSkillRefs,
		refsForItem: migrationSkillRefs,
		formatSelectionLabel: formatMigrationSkillSelectionLabel,
		kindLabel: "skill",
		availableLabel: "skills"
	}));
}
/** Applies plugin refs passed by CLI flags to a migration plan. */
function applyMigrationPluginSelection(plan, selectedPluginRefs) {
	if (selectedPluginRefs === void 0) return plan;
	return applyMigrationSelectedPluginItemIds(plan, resolveSelectedMigrationItemIds({
		items: getSelectableMigrationPluginItems(plan),
		selectedRefs: selectedPluginRefs,
		refsForItem: migrationPluginRefs,
		formatSelectionLabel: formatMigrationPluginSelectionLabel,
		kindLabel: "plugin",
		availableLabel: "plugins"
	}));
}
/** Marks unselected plugin items skipped and filters matching Codex plugin config writes. */
function applyMigrationSelectedPluginItemIds(plan, selectedItemIds) {
	const selectable = getSelectableMigrationPluginItems(plan);
	const selectableIds = new Set(selectable.map((item) => item.id));
	const selectedConfigKeys = new Set(selectable.filter((item) => selectedItemIds.has(item.id)).map(readMigrationPluginConfigKey).filter((value) => value !== void 0));
	const items = plan.items.map((item) => {
		const selectedConfigItem = applyCodexPluginConfigSelection(item, selectedConfigKeys);
		if (selectedConfigItem) return selectedConfigItem;
		if (!selectableIds.has(item.id) || selectedItemIds.has(item.id)) return item;
		return markMigrationItemSkipped(item, MIGRATION_NOT_SELECTED_REASON);
	});
	return {
		...plan,
		items,
		summary: summarizeMigrationItems(items)
	};
}
function applyCodexPluginConfigSelection(item, selectedConfigKeys) {
	if (item.kind !== "config" || item.action !== "merge") return;
	const value = item.details?.value;
	if (!isRecord(value)) return;
	const config = value.config;
	if (!isRecord(config)) return;
	const codexPlugins = config.codexPlugins;
	if (!isRecord(codexPlugins) || !isRecord(codexPlugins.plugins)) return;
	const plugins = Object.fromEntries(Object.entries(codexPlugins.plugins).filter(([configKey]) => selectedConfigKeys.has(configKey)));
	if (Object.keys(plugins).length === 0) return markMigrationItemSkipped(item, MIGRATION_NOT_SELECTED_REASON);
	return {
		...item,
		details: {
			...item.details,
			value: {
				...value,
				config: {
					...config,
					codexPlugins: {
						...codexPlugins,
						plugins
					}
				}
			}
		}
	};
}
/** Resolves checkbox values into migration item ids for either selector. */
function resolveInteractiveMigrationSelection(items, selectedValues) {
	const selectableIds = new Set(items.map((item) => item.id));
	const selectedItemIds = new Set(selectedValues.filter((value) => selectableIds.has(value)));
	if (selectedItemIds.size > 0) return {
		action: "select",
		selectedItemIds
	};
	const selectedValueSet = new Set(selectedValues);
	if (selectedValueSet.has("__openclaw_migrate_toggle_all_off__")) return {
		action: "select",
		selectedItemIds: /* @__PURE__ */ new Set()
	};
	if (selectedValueSet.has("__openclaw_migrate_toggle_all_on__")) return {
		action: "select",
		selectedItemIds: selectableIds
	};
	return {
		action: "select",
		selectedItemIds
	};
}
function isMigrationSelectionToggleValue(value) {
	return value === "__openclaw_migrate_toggle_all_on__" || value === "__openclaw_migrate_toggle_all_off__";
}
function selectedMigrationItemValues(selectedValues) {
	return selectedValues.filter((value) => !isMigrationSelectionToggleValue(value));
}
function resolveMigrationSelectionBulkToggleValues(activatedValue, selectableValues) {
	if (activatedValue === "__openclaw_migrate_toggle_all_on__") return [MIGRATION_SELECTION_TOGGLE_ALL_ON, ...selectableValues];
	if (activatedValue === "__openclaw_migrate_toggle_all_off__") return [MIGRATION_SELECTION_TOGGLE_ALL_OFF];
}
/** Reconciles all/none checkbox toggles for the skill-selection prompt. */
function reconcileInteractiveMigrationSkillToggleValues(selectedValues, activatedValue, selectableValues) {
	const bulkValues = resolveMigrationSelectionBulkToggleValues(activatedValue, selectableValues);
	if (bulkValues !== void 0) return bulkValues;
	if (activatedValue !== void 0 && selectableValues.includes(activatedValue)) return selectedMigrationItemValues(selectedValues);
	return selectedValues.filter((value) => value !== "__openclaw_migrate_toggle_all_on__" || !selectedValues.includes("__openclaw_migrate_toggle_all_off__"));
}
/** Reconciles Enter-key selection behavior for interactive migration prompts. */
function reconcileInteractiveMigrationEnterValues(selectedValues, activatedValue, selectableValues, opts = {}) {
	const bulkValues = resolveMigrationSelectionBulkToggleValues(activatedValue, selectableValues);
	if (bulkValues !== void 0) return bulkValues;
	if (activatedValue !== void 0 && selectableValues.includes(activatedValue)) {
		const selectedSelectableValues = selectedMigrationItemValues(selectedValues);
		if (opts.preserveDeselectedActivatedValue && !selectedValues.includes(activatedValue)) return selectedSelectableValues;
		return uniqueStrings([...selectedSelectableValues, activatedValue]);
	}
	return [...selectedValues];
}
/** Reconciles keyboard shortcuts for all/none migration prompt selections. */
function reconcileInteractiveMigrationShortcutValues(previousValues, selectedValues, selectableValues, key) {
	const previousSelectable = previousValues.filter((value) => selectableValues.includes(value));
	if (key === "a" && previousSelectable.length === selectableValues.length) return [MIGRATION_SELECTION_TOGGLE_ALL_OFF];
	const selectedSelectable = selectedValues.filter((value) => selectableValues.includes(value));
	if (selectedSelectable.length === selectableValues.length) return [MIGRATION_SELECTION_TOGGLE_ALL_ON, ...selectableValues];
	if (selectedSelectable.length === 0) return [MIGRATION_SELECTION_TOGGLE_ALL_OFF];
	return selectedSelectable;
}
//#endregion
//#region src/commands/migrate/apply.ts
/** Applies migration plans with backup, filtering, reporting, and progress output. */
function shouldTreatMissingBackupAsEmptyState(error) {
	const message = error instanceof Error ? error.message : String(error);
	return message.includes("No local OpenClaw state was found to back up") || message.includes("No OpenClaw config file was found to back up");
}
/** Creates a verified pre-migration backup, treating absent local state as empty. */
async function createPreMigrationBackup(opts) {
	try {
		return (await backupCreateCommand({
			log() {},
			error() {},
			exit(code) {
				throw new Error(`backup exited with ${code}`);
			}
		}, {
			output: opts.output,
			verify: true
		})).archivePath;
	} catch (err) {
		if (shouldTreatMissingBackupAsEmptyState(err)) return;
		throw err;
	}
}
/** Applies the selected migration provider plan and writes the final result. */
async function runMigrationApply(params) {
	const applyMigration = async (progress) => {
		const total = (params.opts.preflightPlan ? 0 : 1) + (params.opts.noBackup ? 0 : 1) + 1;
		let completed = 0;
		const tick = () => {
			completed += 1;
			progress?.setPercent(completed / total * 100);
		};
		if (!params.opts.preflightPlan) progress?.setLabel("Preparing migration plan…");
		const preflightPlan = params.opts.preflightPlan ?? await params.provider.plan(buildMigrationContext({
			source: params.opts.source,
			targetAgentId: params.opts.targetAgentId,
			itemKinds: params.opts.itemKinds,
			includeSecrets: params.opts.includeSecrets,
			overwrite: params.opts.overwrite,
			configOverride: params.opts.configOverride,
			providerOptions: buildMigrationProviderOptions(params.opts, params.providerId),
			runtime: params.runtime,
			json: params.opts.json
		}));
		if (!params.opts.preflightPlan) tick();
		const selectedPlan = applyMigrationItemSelection(applyMigrationPluginSelection(applyMigrationSkillSelection(preflightPlan, params.opts.skills), params.opts.plugins), params.opts.itemIds);
		assertConflictFreePlan(selectedPlan, params.providerId);
		const stateDir = resolveStateDir();
		const reportDir = buildMigrationReportDir(params.providerId, stateDir);
		const releaseCustody = beginLifecycleWriteCustody("migration");
		let failure;
		try {
			if (!params.opts.noBackup) progress?.setLabel("Preparing migration backup…");
			const backupPath = params.opts.noBackup ? void 0 : await createPreMigrationBackup({ output: params.opts.backupOutput });
			if (!params.opts.noBackup) tick();
			await fs.mkdir(reportDir, { recursive: true });
			const ctx = buildMigrationContext({
				source: params.opts.source,
				targetAgentId: params.opts.targetAgentId,
				itemKinds: params.opts.itemKinds,
				includeSecrets: params.opts.includeSecrets,
				overwrite: params.opts.overwrite,
				configOverride: params.opts.configOverride,
				providerOptions: buildMigrationProviderOptions(params.opts, params.providerId),
				runtime: params.runtime,
				backupPath,
				reportDir,
				json: params.opts.json
			});
			progress?.setLabel("Applying migration…");
			const result = await withCommandProcessScope(async () => {
				const applied = await params.provider.apply(ctx, selectedPlan);
				params.onApplyCompleted?.();
				return applied;
			});
			tick();
			return {
				...result,
				backupPath: result.backupPath ?? backupPath,
				reportDir: result.reportDir ?? reportDir
			};
		} catch (error) {
			failure = error;
			throw error;
		} finally {
			releaseCustody(failure);
		}
	};
	const withBackup = params.opts.json ? await applyMigration() : await withProgress({ label: `Applying ${params.providerId} migration…` }, async (progress) => await applyMigration(progress));
	writeApplyResult(params.runtime, params.opts, withBackup);
	if (!params.opts.allowPartialResult) try {
		assertApplySucceeded(withBackup);
	} catch (error) {
		if (params.opts.json) exitCliAfterOutput(params.runtime, 1);
		throw error;
	}
	return withBackup;
}
//#endregion
export { reconcileInteractiveMigrationShortcutValues as _, applyMigrationPluginSelection as a, applyMigrationSkillSelection as c, formatMigrationSkillSelectionHint as d, formatMigrationSkillSelectionLabel as f, reconcileInteractiveMigrationEnterValues as g, getSelectableMigrationSkillItems as h, MIGRATION_SELECTION_TOGGLE_ALL_ON as i, formatMigrationPluginSelectionHint as l, getSelectableMigrationPluginItems as m, MIGRATION_SELECTION_ACCEPT as n, applyMigrationSelectedPluginItemIds as o, getDefaultMigrationSelectionValues as p, MIGRATION_SELECTION_TOGGLE_ALL_OFF as r, applyMigrationSelectedSkillItemIds as s, runMigrationApply as t, formatMigrationPluginSelectionLabel as u, reconcileInteractiveMigrationSkillToggleValues as v, resolveInteractiveMigrationSelection as y };
