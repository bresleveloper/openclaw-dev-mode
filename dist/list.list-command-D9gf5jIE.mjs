import { o as writeRuntimeJson, s as writeRuntimeStdout } from "./runtime-BazLsT0s.mjs";
import "./model-ref-shared-BRJ3VRZV.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { t as captureRuntimeConfigAsyncReader } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { t as ExpectedCliError } from "./failure-output-CpIKhMiV.mjs";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-DmuNrGrj.mjs";
import { a as stopProxy, i as startProxy } from "./proxy-lifecycle-hAKSje34.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { _ as padTerminalCell, g as isRich, l as resolveModelsTargetAgent, m as formatTokenK, n as ensureFlagCompatibility, p as formatTag, v as truncate } from "./shared-Ck_WZImY.mjs";
import { n as loadModelsConfigWithSource } from "./load-config-DvAs1Afc.mjs";
import { r as readSelectedGatewayModelCatalog, t as getModelCatalogWarnings } from "./catalog-warnings-CCdCgm4g.mjs";
//#region src/commands/models/list.table.ts
const MODEL_PAD = 42;
const INPUT_PAD = 10;
const CTX_PAD = 11;
const STATE_PAD = 5;
function formatContextLabel(row) {
	if (typeof row.contextTokens === "number" && Number.isFinite(row.contextTokens) && row.contextTokens > 0 && row.contextTokens !== row.contextWindow) return `${formatTokenK(row.contextTokens)}/${formatTokenK(row.contextWindow)}`;
	return formatTokenK(row.contextWindow);
}
function printModelTable(rows, runtime, opts = {}) {
	if (opts.json) {
		const providerOutcomes = opts.providerOutcomes?.map(({ provider, profileId, status, unlistedConfiguredModelIds }) => ({
			provider,
			...profileId ? { profileId } : {},
			status,
			...status === "ready" && unlistedConfiguredModelIds?.length ? { unlistedConfiguredModelIds } : {}
		}));
		writeRuntimeJson(runtime, {
			count: rows.length,
			models: rows,
			...providerOutcomes?.length ? { providerOutcomes } : {}
		});
		return;
	}
	if (opts.plain) {
		for (const row of rows) writeRuntimeStdout(runtime, sanitizeTerminalText(row.key));
		return;
	}
	const rich = isRich(opts);
	const formatRowTag = rich ? (tag) => formatTag(sanitizeTerminalText(tag)) : sanitizeTerminalText;
	const formatState = (value, unavailableColor = theme.muted) => colorize(rich, value === null ? theme.muted : value ? theme.success : unavailableColor, padTerminalCell(value === null ? "-" : value ? "yes" : "no", STATE_PAD));
	const header = [
		padTerminalCell("Model", MODEL_PAD),
		padTerminalCell("Input", INPUT_PAD),
		padTerminalCell("Ctx", CTX_PAD),
		padTerminalCell("Local", STATE_PAD),
		padTerminalCell("Auth", STATE_PAD),
		"Tags"
	].join(" ");
	runtime.log(rich ? theme.heading(header) : header);
	for (const row of rows) {
		const keyLabel = padTerminalCell(truncate(row.key, MODEL_PAD), MODEL_PAD);
		const coloredInput = colorize(rich, row.input.includes("image") ? theme.accentBright : theme.info, padTerminalCell(sanitizeTerminalText(row.input) || "-", INPUT_PAD));
		const line = [
			rich ? theme.accent(keyLabel) : keyLabel,
			coloredInput,
			padTerminalCell(formatContextLabel(row), CTX_PAD),
			formatState(row.local),
			formatState(row.available, theme.error),
			row.tags.map(formatRowTag).join(",")
		].join(" ");
		runtime.log(line);
	}
}
//#endregion
//#region src/commands/models/list.list-command.ts
/** Reads the selected Gateway catalog or an explicitly identified local published view. */
const MODEL_CATALOG_REFRESH_TIMEOUT_MS = 21e4;
function toCliModelRow(model) {
	return {
		key: modelKey(model.provider, model.id),
		name: model.name,
		input: model.input?.join("+") || "-",
		contextWindow: model.contextWindow ?? null,
		...model.contextTokens !== void 0 ? { contextTokens: model.contextTokens } : {},
		local: model.local ?? null,
		available: model.available ?? null,
		tags: [.../* @__PURE__ */ new Set([...model.tags ?? [], ...model.alias ? [`alias:${model.alias}`] : []])]
	};
}
async function modelsListCommand(opts, runtime) {
	ensureFlagCompatibility(opts);
	const rawProvider = opts.provider?.trim();
	if (rawProvider && /\s/u.test(rawProvider)) {
		const message = `Invalid provider filter "${sanitizeTerminalText(rawProvider)}". Use a provider id such as "moonshot", not a display label.`;
		throw new ExpectedCliError({
			message,
			humanOutput: message,
			machineOutput: message
		});
	}
	const provider = rawProvider ? normalizeProviderId(rawProvider) : void 0;
	const cfg = await captureRuntimeConfigAsyncReader({ skipPluginValidation: true })();
	const params = {
		...opts.agent?.trim() ? { agentId: opts.agent.trim() } : {},
		view: opts.all || provider ? "all" : "default",
		...provider ? { provider } : {},
		includeDetails: true,
		...opts.refresh ? { refresh: true } : {}
	};
	let result = await readSelectedGatewayModelCatalog(cfg, params, opts.refresh ? MODEL_CATALOG_REFRESH_TIMEOUT_MS : void 0);
	if (!result) {
		runtime.error(opts.refresh ? "Gateway is not running. Refreshing the local model catalog." : "Gateway is not running. Showing the local cached model catalog. Use --refresh to discover provider models.");
		const [{ resolvePublishedModelCatalogOwner }, { withPreparedModelCatalogOwner }, { getPreparedModelRuntimeAuthMaterializations }, { buildModelsListResult }] = await Promise.all([
			import("./prepared-model-catalog-owner-DQxb3RgS.mjs"),
			import("./prepared-model-catalog-CCWmZ0HZ.mjs"),
			import("./prepared-model-runtime-auth-BG6-SJjE.mjs"),
			import("./models-list-result-yX_YwdVs.mjs")
		]);
		const readLocal = async () => {
			const { resolvedConfig: localConfig } = await loadModelsConfigWithSource({
				commandName: "models list",
				runtime
			});
			const { agentId, agentDir } = resolveModelsTargetAgent(localConfig, opts.agent, { kind: "read" });
			const proxy = opts.refresh ? await startProxy(localConfig.proxy) : null;
			try {
				return await withPreparedModelCatalogOwner({
					agentId,
					agentDir,
					config: localConfig,
					readOnly: opts.refresh !== true,
					...opts.refresh ? {
						refreshFullCatalog: true,
						persistOfflineRefresh: true
					} : {}
				}, async (snapshot) => {
					const owner = resolvePublishedModelCatalogOwner(snapshot);
					return await buildModelsListResult({
						source: {
							kind: "published",
							owner: {
								...owner,
								authMaterializations: getPreparedModelRuntimeAuthMaterializations(snapshot)
							}
						},
						agentId,
						params
					});
				});
			} finally {
				await stopProxy(proxy);
			}
		};
		result = opts.refresh ? await runWithLocalStateOwner({
			method: "models.list",
			params,
			target: "local model catalog",
			onForeignOwner: "refuse",
			runLocal: async ({ assertCurrent }) => {
				assertCurrent();
				const refreshed = await readLocal();
				assertCurrent();
				return refreshed;
			}
		}) : await readLocal();
	}
	for (const warning of getModelCatalogWarnings(result)) runtime.error(`${warning.message} ${warning.fixHint}`);
	if (result.refreshFailed) runtime.error("Model discovery could not refresh all providers. Showing the available published model list.");
	for (const outcome of result.providerOutcomes ?? []) {
		if (outcome.status === "ready") continue;
		const label = `${sanitizeTerminalText(outcome.provider)}${outcome.profileId ? ` (profile ${sanitizeTerminalText(outcome.profileId)})` : ""}`;
		runtime.error(outcome.status === "auth-rejected" ? `Model discovery authentication was rejected for ${label}. Open Models in the Control UI to check sign-in and catalog access, then retry with --refresh.` : `Model discovery is unavailable for ${label}. Retry with --refresh; if it still fails, check the provider in Models in the Control UI.`);
	}
	const rows = result.models.filter((model) => !opts.local || model.local === true).map(toCliModelRow);
	if (rows.length === 0 && !opts.json && !opts.plain) runtime.log("No models found.");
	else printModelTable(rows, runtime, {
		...opts,
		providerOutcomes: result.providerOutcomes
	});
	requestExitAfterOneShotOutput(runtime);
}
//#endregion
export { modelsListCommand };
