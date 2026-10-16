import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-CSOrFNcy.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-IxJJNQFo.mjs";
import { t as beginLifecycleWriteCustody } from "./lifecycle-write-custody-C2y9H7om.mjs";
import { r as withProgress } from "./progress-UTM8yfZa.mjs";
import { d as markMigrationItemSkipped, y as summarizeMigrationItems } from "./migration-BeM6IrM8.mjs";
import { t as backupCreateCommand } from "./backup-BdWhgZmB.mjs";
import { n as buildMigrationReportDir, t as buildMigrationContext } from "./context-DyZXlNkc.mjs";
import { n as assertApplySucceeded, o as writeApplyResult, r as assertConflictFreePlan, t as MIGRATION_CONFLICT_REASON_PHRASES } from "./output-Xx6lAtMR.mjs";
import { t as buildMigrationProviderOptions } from "./providers-eGvXpWkO.mjs";
import { t as applyMigrationItemSelection } from "./item-selection-DbKxBUEq.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/migrate/selection.ts
const MIGRATION_NOT_SELECTED_REASON = "not selected for migration";
const MIGRATION_SELECTION_ACCEPT = "__openclaw_migrate_accept_recommended__";
const MIGRATION_SELECTION_TOGGLE_ALL_ON = "__openclaw_migrate_toggle_all_on__";
const MIGRATION_SELECTION_TOGGLE_ALL_OFF = "__openclaw_migrate_toggle_all_off__";
function migrationItemRefs(item, kind) {
	const prefix = `${kind}:`;
	const idSuffix = item.id.startsWith(prefix) ? item.id.slice(prefix.length) : void 0;
	const sourceBase = item.source ? path.basename(item.source) : void 0;
	const targetBase = item.target ? path.basename(item.target) : void 0;
	return [
		item.id,
		idSuffix,
		normalizeOptionalString(item.details?.[`${kind}Name`]),
		...kind === "plugin" ? [normalizeOptionalString(item.details?.configKey)] : [],
		sourceBase,
		targetBase
	].filter((value) => typeof value === "string" && value.trim().length > 0);
}
function formatSelectionRefList(values) {
	return values.length === 0 ? "none" : values.map((value) => `"${value}"`).join(", ");
}
function buildSelectionIndex(items, kind) {
	const index = /* @__PURE__ */ new Map();
	for (const item of items) for (const ref of migrationItemRefs(item, kind)) {
		const normalized = normalizeOptionalLowercaseString(ref);
		if (!normalized) continue;
		const existing = index.get(normalized) ?? /* @__PURE__ */ new Set();
		existing.add(item.id);
		index.set(normalized, existing);
	}
	return index;
}
function resolveSelectedMigrationItemIds(params) {
	const index = buildSelectionIndex(params.items, params.kind);
	const selectedIds = /* @__PURE__ */ new Set();
	const unknownRefs = [];
	const ambiguousRefs = [];
	for (const ref of params.selectedRefs) {
		const normalized = normalizeOptionalLowercaseString(ref);
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
		const available = params.items.map((item) => formatMigrationSelectionLabel(item, params.kind)).toSorted((a, b) => a.localeCompare(b));
		const titleKind = params.kind === "skill" ? "Skill" : "Plugin";
		const parts = [];
		if (unknownRefs.length > 0) parts.push(`No migratable ${params.kind} matched ${formatSelectionRefList(unknownRefs)}.`);
		if (ambiguousRefs.length > 0) parts.push(`${titleKind} selection ${formatSelectionRefList(ambiguousRefs)} was ambiguous.`);
		parts.push(`Available ${params.kind}s: ${available.length > 0 ? available.join(", ") : "none"}.`);
		throw new Error(parts.join(" "));
	}
	return selectedIds;
}
function getSelectableMigrationItems(plan, kind) {
	return plan.items.filter((item) => item.kind === kind && item.action === (kind === "skill" ? "copy" : "install") && (item.status === "planned" || item.status === "conflict"));
}
function formatMigrationSelectionLabel(item, kind) {
	const prefix = `${kind}:`;
	return normalizeOptionalString(item.details?.[`${kind}Name`]) ?? (item.id.startsWith(prefix) ? item.id.slice(prefix.length) : item.id);
}
function getDefaultMigrationSelectionValues(items) {
	return items.filter((item) => item.status === "planned").map((item) => item.id);
}
function formatMigrationSelectionHint(item, kind) {
	if (item.status !== "conflict") return;
	const label = normalizeOptionalString(item.details?.[kind === "skill" ? "sourceLabel" : "marketplaceName"]);
	const reason = item.reason ? MIGRATION_CONFLICT_REASON_PHRASES[item.reason] ?? item.reason : "conflict";
	return label ? `${label}${kind === "plugin" ? " plugin" : ""} ${reason}` : reason;
}
/** Keep selected copies/installs and their corresponding config writes together. */
function applyMigrationSelectedItemIds(plan, selectedItemIds, kind) {
	const selectable = getSelectableMigrationItems(plan, kind);
	const selectableIds = new Set(selectable.map((item) => item.id));
	const selectedConfigKeys = new Set(selectable.filter((item) => selectedItemIds.has(item.id)).map((item) => kind === "plugin" ? normalizeOptionalString(item.details?.configKey) : normalizeOptionalString(item.details?.skillName) ?? (item.source ? path.basename(item.source) : void 0)).filter((name) => name !== void 0));
	const items = plan.items.map((item) => {
		if (kind === "plugin") {
			const selectedConfigItem = applyCodexPluginConfigSelection(item, selectedConfigKeys);
			if (selectedConfigItem) return selectedConfigItem;
		} else {
			const configPath = item.kind === "config" ? item.details?.path : void 0;
			if (Array.isArray(configPath) && configPath.length === 3 && configPath[0] === "skills" && configPath[1] === "entries" && !selectedConfigKeys.has(configPath[2]) && (item.status === "planned" || item.status === "conflict")) return markMigrationItemSkipped(item, MIGRATION_NOT_SELECTED_REASON);
		}
		return selectableIds.has(item.id) && !selectedItemIds.has(item.id) ? markMigrationItemSkipped(item, MIGRATION_NOT_SELECTED_REASON) : item;
	});
	return {
		...plan,
		items,
		summary: summarizeMigrationItems(items)
	};
}
function applyMigrationSelections(plan, opts) {
	let selectedPlan = plan;
	for (const kind of ["skill", "plugin"]) {
		const selectedRefs = opts[`${kind}s`];
		if (selectedRefs === void 0) continue;
		const selectedIds = resolveSelectedMigrationItemIds({
			items: getSelectableMigrationItems(selectedPlan, kind),
			selectedRefs,
			kind
		});
		selectedPlan = applyMigrationSelectedItemIds(selectedPlan, selectedIds, kind);
	}
	return applyMigrationItemSelection(selectedPlan, opts.itemIds);
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
function resolveInteractiveMigrationSelection(items, selectedValues) {
	const selectableIds = new Set(items.map((item) => item.id));
	const selectedItemIds = new Set(selectedValues.filter((value) => selectableIds.has(value)));
	return selectedItemIds.size === 0 && !selectedValues.includes("__openclaw_migrate_toggle_all_off__") && selectedValues.includes("__openclaw_migrate_toggle_all_on__") ? selectableIds : selectedItemIds;
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
function reconcileInteractiveMigrationSkillToggleValues(selectedValues, activatedValue, selectableValues) {
	const bulkValues = resolveMigrationSelectionBulkToggleValues(activatedValue, selectableValues);
	if (bulkValues !== void 0) return bulkValues;
	if (activatedValue !== void 0 && selectableValues.includes(activatedValue)) return selectedMigrationItemValues(selectedValues);
	return selectedValues.filter((value) => value !== "__openclaw_migrate_toggle_all_on__" || !selectedValues.includes("__openclaw_migrate_toggle_all_off__"));
}
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
			...params.opts,
			providerOptions: buildMigrationProviderOptions(params.opts, params.providerId),
			runtime: params.runtime
		}));
		if (!params.opts.preflightPlan) tick();
		const selectedPlan = applyMigrationSelections(preflightPlan, params.opts);
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
				...params.opts,
				providerOptions: buildMigrationProviderOptions(params.opts, params.providerId),
				runtime: params.runtime,
				backupPath,
				reportDir
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
export { applyMigrationSelectedItemIds as a, formatMigrationSelectionLabel as c, reconcileInteractiveMigrationEnterValues as d, reconcileInteractiveMigrationShortcutValues as f, MIGRATION_SELECTION_TOGGLE_ALL_ON as i, getDefaultMigrationSelectionValues as l, resolveInteractiveMigrationSelection as m, MIGRATION_SELECTION_ACCEPT as n, applyMigrationSelections as o, reconcileInteractiveMigrationSkillToggleValues as p, MIGRATION_SELECTION_TOGGLE_ALL_OFF as r, formatMigrationSelectionHint as s, runMigrationApply as t, getSelectableMigrationItems as u };
