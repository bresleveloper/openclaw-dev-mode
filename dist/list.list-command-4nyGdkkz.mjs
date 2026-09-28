import { a as writeRuntimeJson, o as writeRuntimeStdout } from "./runtime-BC29JSZp.mjs";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-f6PhkiZS.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import "./model-ref-shared-BgRrSHjn.mjs";
import { t as modelKey } from "./model-key-2xbDA5NJ.mjs";
import { r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { o as readActiveGatewayLockIdentity } from "./gateway-lock-CYjRlApN.mjs";
import { h as isImplicitLocalGatewayTarget, o as callGateway } from "./call-C_MP4_Gs.mjs";
import { Bg as GATEWAY_SERVER_CAPS } from "./src-BRUl7oDv.mjs";
import { t as ExpectedCliError } from "./failure-output-Cct-llrO.mjs";
import { _ as truncate, g as padTerminalCell, h as isRich, l as resolveModelsTargetAgent, m as formatTokenK, n as ensureFlagCompatibility, p as formatTag } from "./shared-yzzedLUF.mjs";
import { n as loadModelsConfigWithSource } from "./load-config-CQ4HhFsY.mjs";
//#region src/commands/models/list.table.ts
/** Terminal/JSON/plain table renderer for model-list rows. */
const MODEL_PAD = 42;
const INPUT_PAD = 10;
const CTX_PAD = 11;
const LOCAL_PAD = 5;
const AUTH_PAD = 5;
function formatContextLabel(row) {
	if (typeof row.contextTokens === "number" && Number.isFinite(row.contextTokens) && row.contextTokens > 0 && row.contextTokens !== row.contextWindow) return `${formatTokenK(row.contextTokens)}/${formatTokenK(row.contextWindow)}`;
	return formatTokenK(row.contextWindow);
}
/** Prints model-list rows in JSON, plain, or fixed-width terminal form. */
function printModelTable(rows, runtime, opts = {}) {
	if (opts.json) {
		writeRuntimeJson(runtime, {
			count: rows.length,
			models: rows
		});
		return;
	}
	if (opts.plain) {
		for (const row of rows) writeRuntimeStdout(runtime, sanitizeTerminalText(row.key));
		return;
	}
	const rich = isRich(opts);
	const formatRowTag = rich ? (tag) => formatTag(sanitizeTerminalText(tag)) : sanitizeTerminalText;
	const header = [
		padTerminalCell("Model", MODEL_PAD),
		padTerminalCell("Input", INPUT_PAD),
		padTerminalCell("Ctx", CTX_PAD),
		padTerminalCell("Local", LOCAL_PAD),
		padTerminalCell("Auth", AUTH_PAD),
		"Tags"
	].join(" ");
	runtime.log(rich ? theme.heading(header) : header);
	for (const row of rows) {
		const keyLabel = padTerminalCell(truncate(row.key, MODEL_PAD), MODEL_PAD);
		const inputLabel = padTerminalCell(sanitizeTerminalText(row.input) || "-", INPUT_PAD);
		const ctxLabel = padTerminalCell(formatContextLabel(row), CTX_PAD);
		const localText = row.local === null ? "-" : row.local ? "yes" : "no";
		const localLabel = padTerminalCell(localText, LOCAL_PAD);
		const authText = row.available === null ? "-" : row.available ? "yes" : "no";
		const authLabel = padTerminalCell(authText, AUTH_PAD);
		const tagsLabel = row.tags.map(formatRowTag).join(",");
		const coloredInput = colorize(rich, row.input.includes("image") ? theme.accentBright : theme.info, inputLabel);
		const coloredLocal = colorize(rich, row.local === null ? theme.muted : row.local ? theme.success : theme.muted, localLabel);
		const coloredAuth = colorize(rich, row.available === null ? theme.muted : row.available ? theme.success : theme.error, authLabel);
		const line = [
			rich ? theme.accent(keyLabel) : keyLabel,
			coloredInput,
			ctxLabel,
			coloredLocal,
			coloredAuth,
			tagsLabel
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
	const cfg = getRuntimeConfig({ skipPluginValidation: true });
	const params = {
		...opts.agent?.trim() ? { agentId: opts.agent.trim() } : {},
		view: opts.all || provider ? "all" : "default",
		...provider ? { provider } : {},
		includeDetails: true,
		...opts.refresh ? { refresh: true } : {}
	};
	const localTarget = await isImplicitLocalGatewayTarget({ config: cfg });
	const explicitPort = Boolean(process.env.OPENCLAW_GATEWAY_PORT?.trim());
	const gatewayOwner = localTarget && !explicitPort ? await readActiveGatewayLockIdentity({ requireInspection: true }) : void 0;
	let result;
	if (!localTarget || explicitPort || gatewayOwner) result = await callGateway({
		config: cfg,
		method: "models.list",
		...opts.refresh ? { timeoutMs: MODEL_CATALOG_REFRESH_TIMEOUT_MS } : {},
		requiredCapabilities: [GATEWAY_SERVER_CAPS.PUBLISHED_MODEL_CATALOG],
		...gatewayOwner ? { localPortOverride: gatewayOwner.port } : {},
		params
	});
	else {
		runtime.error(opts.refresh ? "Gateway is not running. Refreshing the local model catalog." : "Gateway is not running. Showing the local cached model catalog. Use --refresh to discover provider models.");
		const [{ resolvePublishedModelCatalogOwner }, { withPreparedModelCatalogOwner }, { getPreparedModelRuntimeAuthMaterializations }, { buildModelsListResult }] = await Promise.all([
			import("./prepared-model-catalog-owner-CA4_RBGd.mjs"),
			import("./prepared-model-catalog-CHKgcpJj.mjs"),
			import("./prepared-model-runtime-auth-KanpF77O.mjs"),
			import("./models-list-result-DhHD4kE_.mjs")
		]);
		const { resolvedConfig: localConfig } = await loadModelsConfigWithSource({
			commandName: "models list",
			runtime
		});
		const { agentId, agentDir } = resolveModelsTargetAgent(localConfig, opts.agent, { kind: "read" });
		result = await withPreparedModelCatalogOwner({
			agentId,
			agentDir,
			config: localConfig,
			readOnly: opts.refresh !== true,
			...opts.refresh ? { refreshFullCatalog: true } : {}
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
	}
	if (result.refreshFailed || opts.refresh && result.providerOutcomes?.some((outcome) => outcome.status !== "ready")) runtime.error("Model discovery could not refresh all providers. Showing the available published model list.");
	const rows = result.models.filter((model) => !opts.local || model.local === true).map(toCliModelRow);
	if (rows.length === 0 && !opts.json && !opts.plain) runtime.log("No models found.");
	else printModelTable(rows, runtime, opts);
	requestExitAfterOneShotOutput(runtime);
}
//#endregion
export { modelsListCommand };
