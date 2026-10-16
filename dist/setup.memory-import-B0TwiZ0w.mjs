import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { d as resolveAgentWorkspaceDir, g as resolveDefaultAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { r as t } from "./i18n-Cuh2pEdZ.mjs";
import { r as createMigrationLogger } from "./context-DyZXlNkc.mjs";
import { n as planProviderMemoryImport, r as withMemoryMigrationProviders, t as applyProviderMemoryImport } from "./memory-import-CCMyWcxj.mjs";
//#region src/wizard/setup.memory-import.ts
async function showSkipHint(prompter) {
	await prompter.note(t("wizard.memoryImport.skipHint"), t("wizard.memoryImport.title"));
}
async function runSetupMemoryImportStep(params) {
	const agentId = params.agentId ?? resolveDefaultAgentId(params.config);
	return await withMemoryMigrationProviders(params.config, async (providers) => {
		if (providers.length === 0) return {
			status: "nothing-to-import",
			providers: []
		};
		const logger = createMigrationLogger(params.runtime);
		const offers = [];
		for (const provider of providers) try {
			const { detection, plan } = await planProviderMemoryImport({
				provider,
				config: params.config,
				agentId,
				overwrite: false
			});
			const plannedIds = plan.items.filter((item) => item.status === "planned").map((item) => item.id);
			if (detection?.found === false || plannedIds.length === 0) continue;
			offers.push({
				provider,
				plan,
				source: detection?.source ?? plan.source,
				plannedIds,
				conflicts: plan.items.filter((item) => item.status === "conflict").length
			});
		} catch (error) {
			logger.debug?.(`Memory migration provider ${provider.id} planning failed: ${formatErrorMessage(error)}`);
		}
		if (offers.length === 0) return {
			status: "nothing-to-import",
			providers: []
		};
		const offerLines = offers.map((offer) => {
			const conflictSuffix = offer.conflicts ? t("wizard.memoryImport.conflictSuffix", { count: offer.conflicts }) : "";
			return t("wizard.memoryImport.offerLine", {
				label: offer.provider.label,
				source: offer.source,
				count: offer.plannedIds.length,
				conflictSuffix
			});
		});
		await params.prompter.note(offerLines.join("\n"), t("wizard.memoryImport.title"));
		if (!await params.prompter.confirm({
			message: t("wizard.memoryImport.confirm"),
			initialValue: true
		})) {
			await showSkipHint(params.prompter);
			return {
				status: "skipped",
				providers: []
			};
		}
		const selectedIds = offers.length === 1 ? [offers[0].provider.id] : await params.prompter.multiselect({
			message: t("wizard.memoryImport.selectSources"),
			options: offers.map((offer) => ({
				value: offer.provider.id,
				label: offer.provider.label,
				hint: offer.source
			})),
			initialValues: offers.map((offer) => offer.provider.id)
		});
		const selected = new Set(selectedIds);
		const selectedOffers = offers.filter((offer) => selected.has(offer.provider.id));
		if (selectedOffers.length === 0) {
			await showSkipHint(params.prompter);
			return {
				status: "skipped",
				providers: []
			};
		}
		params.prompter.disableBackNavigation?.();
		const workspace = resolveAgentWorkspaceDir(params.config, agentId);
		const summaryLines = [];
		const failureLines = [];
		const providerOutcomes = [];
		const recordProviderOutcome = (outcome) => {
			providerOutcomes.push(outcome);
			params.onProviderOutcome?.(outcome);
		};
		for (const offer of selectedOffers) {
			const progress = params.prompter.progress(t("wizard.memoryImport.importing", { label: offer.provider.label }));
			const reportFailure = async (reason) => {
				failureLines.push(t("wizard.memoryImport.failureLine", {
					label: offer.provider.label,
					reason
				}));
				progress.stop(t("wizard.memoryImport.importFailed", { label: offer.provider.label }));
				await params.prompter.note(t("wizard.memoryImport.applyFailed", {
					label: offer.provider.label,
					reason
				}), t("wizard.memoryImport.errorTitle"));
			};
			try {
				await params.beforeApply?.();
			} catch (error) {
				progress.stop(t("wizard.memoryImport.importFailed", { label: offer.provider.label }));
				throw error;
			}
			let result;
			try {
				result = await applyProviderMemoryImport({
					provider: offer.provider,
					config: params.config,
					agentId,
					itemIds: offer.plannedIds,
					overwrite: false,
					preflightPlan: offer.plan
				});
			} catch (error) {
				const reason = formatErrorMessage(error);
				recordProviderOutcome({
					providerId: offer.provider.id,
					label: offer.provider.label,
					failure: reason,
					copiesIndeterminate: true
				});
				summaryLines.push(t("wizard.memoryImport.summaryLine", {
					label: offer.provider.label,
					migrated: 0,
					skipped: 0,
					target: offer.plan.target ?? workspace
				}));
				await reportFailure(reason);
				continue;
			}
			summaryLines.push(t("wizard.memoryImport.summaryLine", {
				label: offer.provider.label,
				migrated: result.summary.migrated,
				skipped: result.summary.skipped,
				target: result.target ?? offer.plan.target ?? workspace
			}));
			const incomplete = result.summary.errors + result.summary.conflicts;
			const failure = incomplete > 0 ? t("wizard.memoryImport.partialFailure", { count: incomplete }) : void 0;
			recordProviderOutcome({
				providerId: offer.provider.id,
				label: offer.provider.label,
				migrated: result.summary.migrated,
				skipped: result.summary.skipped,
				...failure !== void 0 ? { failure } : {}
			});
			if (failure !== void 0) await reportFailure(failure);
			else progress.stop(t("wizard.memoryImport.imported", { label: offer.provider.label }));
		}
		await params.prompter.note([...summaryLines, ...failureLines].join("\n"), t("wizard.memoryImport.summaryTitle"));
		return {
			status: "completed",
			providers: providerOutcomes
		};
	}, (error) => {
		params.runtime.error(`Memory import result retained, but plugin cleanup failed: ${formatErrorMessage(error)}`);
	});
}
//#endregion
export { runSetupMemoryImportStep };
