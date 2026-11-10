import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { n as stylePromptMessage, r as stylePromptTitle, t as stylePromptHint } from "./prompt-style-zarsDmI2.mjs";
import { r as promptYesNo } from "./prompt-nkSTad_s.mjs";
import { r as withProgress } from "./progress-BIOeyA3T.mjs";
import { h as redactMigrationPlan, v as summarizeMigrationItems } from "./migration-Cf1WpRKe.mjs";
import { t as withPluginMigrationProviders } from "./migration-provider-runtime-Dh7Q8jDp.mjs";
import { i as formatMigrationPreview } from "./output-jbcFvGPJ.mjs";
import { n as createMigrationPlan, r as withMigrationProvider } from "./providers-XaOE3Hjh.mjs";
import { a as applyMigrationSelectedItemIds, c as formatMigrationSelectionLabel, d as reconcileInteractiveMigrationEnterValues, f as reconcileInteractiveMigrationShortcutValues, i as MIGRATION_SELECTION_TOGGLE_ALL_ON, l as getDefaultMigrationSelectionValues, m as resolveInteractiveMigrationSelection, n as MIGRATION_SELECTION_ACCEPT, o as applyMigrationSelections, p as reconcileInteractiveMigrationSkillToggleValues, r as MIGRATION_SELECTION_TOGGLE_ALL_OFF, s as formatMigrationSelectionHint, t as runMigrationApply, u as getSelectableMigrationItems } from "./apply-BbDCRXQq.mjs";
import { styleText } from "node:util";
import { S_BAR, S_BAR_END, S_CHECKBOX_ACTIVE, S_CHECKBOX_INACTIVE, S_CHECKBOX_SELECTED, cancel, confirm, isCancel, limitOptions, log, symbol, symbolBar } from "@clack/prompts";
import { MultiSelectPrompt, settings as settings$1, wrapTextWithPrefix } from "@clack/core";
//#region src/commands/migrate/skill-selection-prompt.ts
/** Custom Clack multi-select prompt for Codex migration skill/plugin choices. */
function formatOption(option, state) {
	const label = option.label ?? option.value;
	const withHint = option.hint ? `${label} ${styleText("dim", `(${option.hint})`)}` : label;
	switch (state) {
		case "active": return `${styleText("cyan", S_CHECKBOX_ACTIVE)} ${withHint}`;
		case "active-selected": return `${styleText("green", S_CHECKBOX_SELECTED)} ${withHint}`;
		case "cancelled": return styleText(["strikethrough", "dim"], label);
		case "selected": return `${styleText("green", S_CHECKBOX_SELECTED)} ${styleText("dim", withHint)}`;
		case "submitted": return styleText("dim", label);
		default: return `${styleText("dim", S_CHECKBOX_INACTIVE)} ${styleText("dim", withHint)}`;
	}
}
/** Prompts for migration selection values and reconciles all/none/recommended shortcuts. */
function promptMigrationSkillSelectionValues(opts) {
	const prompt = new MultiSelectPrompt({
		options: opts.options,
		input: opts.input,
		output: opts.output,
		initialValues: opts.initialValues,
		cursorAt: opts.cursorAt,
		render() {
			const withGuide = opts.withGuide ?? settings$1.withGuide;
			const message = wrapTextWithPrefix(opts.output, opts.message, withGuide ? `${symbolBar(this.state)}  ` : "", `${symbol(this.state)}  `);
			const header = `${withGuide ? `${styleText("gray", S_BAR)}\n` : ""}${message}\n`;
			const value = this.value ?? [];
			const optionState = (option, active) => {
				const selected = value.includes(option.value);
				if (active && selected) return formatOption(option, "active-selected");
				if (selected) return formatOption(option, "selected");
				return formatOption(option, active ? "active" : "inactive");
			};
			switch (this.state) {
				case "submit":
				case "cancel": {
					const selected = this.options.filter((option) => value.includes(option.value)).map((option) => formatOption(option, this.state === "submit" ? "submitted" : "cancelled")).join(styleText("dim", ", "));
					if (this.state === "submit") {
						const label = selected || styleText("dim", "none");
						return `${header}${wrapTextWithPrefix(opts.output, label, withGuide ? `${styleText("gray", S_BAR)}  ` : "")}`;
					}
					if (selected.trim() === "") return `${header}${styleText("gray", S_BAR)}`;
					return `${header}${wrapTextWithPrefix(opts.output, selected, withGuide ? `${styleText("gray", S_BAR)}  ` : "")}${withGuide ? `\n${styleText("gray", S_BAR)}` : ""}`;
				}
				default: {
					const prefix = withGuide ? `${styleText("cyan", S_BAR)}  ` : "";
					return `${header}${prefix}${limitOptions({
						output: opts.output,
						options: this.options,
						cursor: this.cursor,
						columnPadding: prefix.length,
						rowPadding: header.split("\n").length + (withGuide ? 2 : 1),
						style: optionState
					}).join(`\n${prefix}`)}\n${withGuide ? styleText("cyan", S_BAR_END) : ""}\n`;
				}
			}
		}
	});
	let lastSelectedValues = [...prompt.value ?? []];
	let lastSpaceDeselectedValue;
	prompt.on("cursor", (key) => {
		if (key !== "space") {
			lastSpaceDeselectedValue = void 0;
			return;
		}
		const activatedValue = prompt.options[prompt.cursor]?.value;
		if (activatedValue === "__openclaw_migrate_accept_recommended__") {
			prompt.value = [...opts.initialValues ?? []];
			lastSpaceDeselectedValue = void 0;
			lastSelectedValues = [...prompt.value ?? []];
			return;
		}
		const previousValues = lastSelectedValues;
		const selectedValuesAfterClack = prompt.value ?? [];
		prompt.value = reconcileInteractiveMigrationSkillToggleValues(selectedValuesAfterClack, activatedValue, opts.selectableValues);
		lastSpaceDeselectedValue = activatedValue !== void 0 && opts.selectableValues.includes(activatedValue) && previousValues.includes(activatedValue) && !(prompt.value ?? []).includes(activatedValue) ? activatedValue : void 0;
		lastSelectedValues = [...prompt.value ?? []];
	});
	prompt.on("key", (key, info) => {
		if (info.name === "return") {
			const activatedValue = prompt.options[prompt.cursor]?.value;
			if (activatedValue === "__openclaw_migrate_accept_recommended__") prompt.value = [...opts.initialValues ?? []];
			else prompt.value = reconcileInteractiveMigrationEnterValues(prompt.value ?? [], activatedValue, opts.selectableValues, { preserveDeselectedActivatedValue: activatedValue !== void 0 && activatedValue === lastSpaceDeselectedValue && !(prompt.value ?? []).includes(activatedValue) });
			lastSpaceDeselectedValue = void 0;
			lastSelectedValues = [...prompt.value ?? []];
			return;
		}
		if (key !== "a" && key !== "i") return;
		prompt.value = reconcileInteractiveMigrationShortcutValues(lastSelectedValues, prompt.value ?? [], opts.selectableValues, key);
		lastSpaceDeselectedValue = void 0;
		lastSelectedValues = [...prompt.value ?? []];
	});
	return prompt.prompt();
}
//#endregion
//#region src/commands/migrate.ts
function isAuthCredentialItem(item) {
	return item.kind === "auth" || item.kind === "secret" || item.sensitive === true;
}
function resolveDefaultIncludeSecrets(opts) {
	if (opts.authCredentials === false) return {
		...opts,
		includeSecrets: false
	};
	return opts;
}
function shouldPromptForAuthCredentials(opts) {
	return opts.includeSecrets === void 0 && opts.authCredentials !== false && !opts.yes && !opts.json && process.stdin.isTTY;
}
async function createInteractiveMigrationPlanWithAuthPrompt(runtime, opts, provider) {
	if (!shouldPromptForAuthCredentials(opts)) return await migratePlanCommand(runtime, resolveDefaultIncludeSecrets(opts), provider);
	const scan = (includeSecrets) => migratePlanCommand(runtime, {
		...opts,
		includeSecrets,
		suppressPlanLog: true
	}, provider);
	let plan = await scan(false);
	if (plan.items.some(isAuthCredentialItem)) {
		const includeSecrets = await confirm({
			message: stylePromptMessage("Do you want to migrate your auth credentials as well?"),
			initialValue: true
		});
		if (isCancel(includeSecrets)) {
			cancel(stylePromptTitle("Migration cancelled.") ?? "Migration cancelled.");
			runtime.exit(0);
			throw new Error("unreachable");
		}
		if (includeSecrets) plan = await scan(true);
	}
	if (!opts.suppressPlanLog) log.message(formatMigrationPreview(plan).join("\n"));
	return plan;
}
function assertVerifyPluginAppsProvider(providerId, opts) {
	if (opts.verifyPluginApps && providerId !== "codex") throw new Error("--verify-plugin-apps is only supported for Codex migrations.");
}
async function promptCodexMigrationSelection(runtime, plan, opts, kind) {
	if (plan.providerId !== "codex" || opts.yes || opts.json || opts[kind] !== void 0 || !process.stdin.isTTY) return plan;
	const skillSelection = kind === "skills";
	const itemKind = skillSelection ? "skill" : "plugin";
	const items = getSelectableMigrationItems(plan, itemKind);
	if (items.length === 0) return plan;
	const selected = await promptMigrationSkillSelectionValues({
		message: stylePromptMessage(skillSelection ? "Select Codex skills to migrate into this agent" : "Select native Codex plugins to activate in this agent"),
		options: [
			{
				value: MIGRATION_SELECTION_ACCEPT,
				label: "Accept recommended",
				hint: skillSelection ? "Migrate every recommended skill" : "Migrate every recommended plugin"
			},
			...items.map((item) => {
				const hint = formatMigrationSelectionHint(item, itemKind);
				return {
					value: item.id,
					label: formatMigrationSelectionLabel(item, itemKind),
					hint: hint === void 0 ? void 0 : stylePromptHint(hint)
				};
			}),
			{
				value: MIGRATION_SELECTION_TOGGLE_ALL_ON,
				label: "Toggle all on"
			},
			{
				value: MIGRATION_SELECTION_TOGGLE_ALL_OFF,
				label: "Toggle all off"
			}
		],
		initialValues: getDefaultMigrationSelectionValues(items),
		selectableValues: items.map((item) => item.id),
		cursorAt: MIGRATION_SELECTION_ACCEPT
	});
	if (typeof selected === "symbol") {
		cancel(stylePromptTitle("Migration cancelled.") ?? "Migration cancelled.");
		runtime.log("Migration cancelled.");
		return null;
	}
	const selection = resolveInteractiveMigrationSelection(items, selected ?? []);
	const selectedPlan = applyMigrationSelectedItemIds(plan, selection, itemKind);
	const purpose = skillSelection ? "Codex skills for migration" : "native Codex plugins for activation";
	runtime.log(`Selected ${selection.size} of ${items.length} ${purpose}.`);
	return selectedPlan;
}
async function confirmInteractiveMigrationPlan(runtime, plan, opts) {
	const skillSelectedPlan = await promptCodexMigrationSelection(runtime, plan, opts, "skills");
	const selectedPlan = skillSelectedPlan && await promptCodexMigrationSelection(runtime, skillSelectedPlan, opts, "plugins");
	if (!selectedPlan) return { plan };
	if (selectedPlan.providerId === "codex" && !hasSelectedCodexMigrationWork(selectedPlan)) {
		logNoCodexSelection(runtime, selectedPlan);
		return { plan: selectedPlan };
	}
	if (!await promptYesNo("Apply this migration now?", false)) {
		runtime.log("Migration cancelled.");
		return { plan: selectedPlan };
	}
	return {
		plan: selectedPlan,
		applyOpts: {
			...opts,
			yes: true,
			includeSecrets: opts.includeSecrets ?? selectedPlan.items.some((item) => item.status === "planned" && isAuthCredentialItem(item)),
			preflightPlan: selectedPlan
		}
	};
}
function hasSelectedCodexMigrationWork(plan) {
	return plan.items.some((item) => item.status === "planned" && (item.kind === "auth" || item.kind === "secret" || item.kind === "skill" && item.action === "copy" || item.kind === "plugin" && item.action === "install"));
}
function logNoCodexSelection(runtime, plan) {
	if (plan.providerId === "codex" && plan.items.some((item) => item.reason === "codex_subscription_required")) {
		const warning = plan.warnings?.find((entry) => entry.includes("Codex app-backed plugin migration requires"));
		if (warning) runtime.log(warning);
		runtime.log("No Codex skills selected; native Codex plugins are not eligible for migration in this run.");
		return;
	}
	runtime.log("No Codex skills or native Codex plugins selected for migration.");
}
/** Lists available migration providers as JSON or terse terminal rows. */
async function migrateListCommand(runtime, opts = {}) {
	return await withPluginMigrationProviders({}, async (registered) => {
		const providers = registered.map((provider) => ({
			id: provider.id,
			label: provider.label,
			description: provider.description
		}));
		if (opts.json) {
			writeRuntimeJson(runtime, { providers });
			return;
		}
		if (providers.length === 0) {
			runtime.log(`No migration providers found. Run ${formatCliCommand("openclaw plugins list")} to verify provider plugins are installed and enabled.`);
			return;
		}
		runtime.log(providers.map((provider) => provider.description ? `${provider.id}\t${provider.label} - ${provider.description}` : `${provider.id}\t${provider.label}`).join("\n"));
	});
}
/** Creates and prints a migration plan without applying it. */
async function migratePlanCommand(runtime, opts, provider) {
	const providerId = opts.provider?.trim();
	if (!providerId) throw new Error(`Migration provider is required. Run ${formatCliCommand("openclaw migrate list")} to choose one.`);
	const resolvedOpts = resolveDefaultIncludeSecrets(opts);
	assertVerifyPluginAppsProvider(providerId, resolvedOpts);
	if (!provider) return await withMigrationProvider(providerId, opts.configOverride, async (owned) => await migratePlanCommand(runtime, opts, owned));
	const createPlan = () => createMigrationPlan(runtime, {
		...resolvedOpts,
		provider: providerId
	}, provider);
	const plan = applyMigrationSelections(resolvedOpts.json ? await createPlan() : await withProgress({
		label: `Scanning ${providerId} migration…`,
		indeterminate: true
	}, async (progress) => {
		progress.setLabel("Reading migration source…");
		const scanned = await createPlan();
		progress.tick();
		return scanned;
	}), resolvedOpts);
	if (resolvedOpts.json) writeRuntimeJson(runtime, redactMigrationPlan(plan));
	else if (resolvedOpts.suppressPlanLog !== true) log.message(formatMigrationPreview(plan).join("\n"));
	return plan;
}
async function migrateApplyCommand(runtime, opts, provider) {
	const providerId = opts.provider?.trim();
	if (!providerId) throw new Error(`Migration provider is required. Run ${formatCliCommand("openclaw migrate list")} to choose one.`);
	assertVerifyPluginAppsProvider(providerId, opts);
	if (opts.noBackup && !opts.force) throw new Error("--no-backup requires --force because it skips the automatic rollback copy.");
	if (!opts.yes && !process.stdin.isTTY) throw new Error(`openclaw migrate apply requires --yes in non-interactive mode. Preview first with ${formatCliCommand(`openclaw migrate plan '${providerId.replaceAll("'", "'\\''")}'`)}.`);
	if (!provider) return await withMigrationProvider(providerId, opts.configOverride, async (owned) => await migrateApplyCommand(runtime, opts, owned));
	let applyOpts = resolveDefaultIncludeSecrets(opts);
	if (!opts.yes) {
		const plan = await createInteractiveMigrationPlanWithAuthPrompt(runtime, {
			...opts,
			provider: providerId
		}, provider);
		if (opts.json) return plan;
		const confirmed = await confirmInteractiveMigrationPlan(runtime, plan, opts);
		if (!confirmed.applyOpts) return confirmed.plan;
		applyOpts = {
			...confirmed.applyOpts,
			provider: providerId
		};
	}
	return await runMigrationApply({
		runtime,
		opts: applyOpts,
		providerId,
		provider
	});
}
/** Default migrate command: list providers, plan, dry-run, or apply based on flags. */
async function migrateDefaultCommand(runtime, opts, provider) {
	const providerId = opts.provider?.trim();
	if (!providerId) {
		await migrateListCommand(runtime, { json: opts.json });
		return {
			providerId: "list",
			source: "",
			summary: summarizeMigrationItems([]),
			items: []
		};
	}
	assertVerifyPluginAppsProvider(providerId, opts);
	if (!provider) return await withMigrationProvider(providerId, opts.configOverride, async (owned) => await migrateDefaultCommand(runtime, opts, owned));
	const resolvedOpts = resolveDefaultIncludeSecrets(opts);
	const planOpts = {
		...opts,
		provider: providerId,
		json: opts.json && (opts.dryRun || !opts.yes)
	};
	let plan = opts.json && opts.yes && !opts.dryRun ? applyMigrationSelections(await createMigrationPlan(runtime, {
		...resolvedOpts,
		provider: providerId
	}, provider), resolvedOpts) : !opts.yes && process.stdin.isTTY ? await createInteractiveMigrationPlanWithAuthPrompt(runtime, planOpts, provider) : await migratePlanCommand(runtime, resolveDefaultIncludeSecrets(planOpts), provider);
	if (opts.dryRun || opts.json && !opts.yes) return plan;
	let applyOpts = resolvedOpts;
	if (!opts.yes) {
		if (!process.stdin.isTTY) {
			runtime.log("Re-run with --yes to apply this migration non-interactively.");
			return plan;
		}
		const confirmed = await confirmInteractiveMigrationPlan(runtime, plan, opts);
		if (!confirmed.applyOpts) return confirmed.plan;
		plan = confirmed.plan;
		applyOpts = confirmed.applyOpts;
	}
	return await migrateApplyCommand(runtime, {
		...applyOpts,
		provider: providerId,
		yes: true,
		json: opts.json,
		preflightPlan: plan
	}, provider);
}
//#endregion
export { migratePlanCommand as i, migrateDefaultCommand as n, migrateListCommand as r, migrateApplyCommand as t };
