import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-f6PhkiZS.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as listWebFetchProviders, r as resolveWebFetchDefinition, t as isWebFetchProviderConfigured } from "./runtime-BaEOgRGK.mjs";
import { i as listWebSearchProviders, n as isWebSearchProviderConfigured, o as runWebSearch } from "./runtime-D6-VXQvF.mjs";
import { i as getCapabilityWebFetchCommandSecretTargets, o as getCapabilityWebSearchCommandSecretTargets } from "./command-secret-targets-Dxp8wSEx.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { n as formatEnvelopeForText, t as emitJsonOrText } from "./output-BaRjhBNO.mjs";
import { n as parseOptionalPositiveInteger, o as registerLocalProvidersCommand, u as resolveLocalCapabilityRuntimeConfig } from "./shared-CcZCj91E.mjs";
//#region src/cli/capability-cli/web.ts
function describeWebResultFailure(result) {
	const statusCode = typeof result.statusCode === "number" && Number.isFinite(result.statusCode) ? result.statusCode : void 0;
	const error = result.error;
	const errorMessage = typeof error === "string" ? error : error && typeof error === "object" && typeof error.message === "string" ? error.message : void 0;
	if (result.ok !== false && (statusCode === void 0 || statusCode < 400) && !errorMessage) return;
	return errorMessage ?? (statusCode ? `provider returned status ${statusCode}` : "provider reported failure");
}
async function runWebSearchCommand(params) {
	const rawConfig = getRuntimeConfig();
	const scopedTargets = getCapabilityWebSearchCommandSecretTargets(rawConfig, { providerId: params.provider });
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer web search",
		...scopedTargets,
		config: rawConfig
	});
	const result = await runWebSearch({
		config: cfg,
		providerId: params.provider,
		args: {
			query: params.query,
			count: params.limit,
			limit: params.limit
		}
	});
	const error = describeWebResultFailure(result.result);
	return {
		ok: error === void 0,
		capability: "web.search",
		transport: "local",
		provider: result.provider,
		attempts: [],
		outputs: [{ result: result.result }],
		...error ? { error } : {}
	};
}
async function runWebFetchCommand(params) {
	const rawConfig = getRuntimeConfig();
	const scopedTargets = getCapabilityWebFetchCommandSecretTargets(rawConfig, { providerId: params.provider });
	const cfg = await resolveLocalCapabilityRuntimeConfig({
		commandName: "infer web fetch",
		...scopedTargets,
		config: rawConfig
	});
	const resolved = resolveWebFetchDefinition({
		config: cfg,
		providerId: params.provider
	});
	if (!resolved) throw new Error("web.fetch is disabled or no provider is available.");
	const result = await resolved.definition.execute({
		url: params.url,
		format: params.format
	});
	const error = describeWebResultFailure(result);
	return {
		ok: error === void 0,
		capability: "web.fetch",
		transport: "local",
		provider: resolved.provider.id,
		attempts: [],
		outputs: [{ result }],
		...error ? { error } : {}
	};
}
function registerWebCapabilityCommands(capability) {
	const web = capability.command("web").description("Web capabilities");
	web.command("search").description("Run web search").requiredOption("--query <text>", "Search query").option("--provider <id>", "Provider id").option("--limit <n>", "Result limit").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runWebSearchCommand({
				query: String(opts.query),
				provider: opts.provider,
				limit: parseOptionalPositiveInteger(opts.limit, "--limit")
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
			if (!result.ok) exitCliAfterOutput(defaultRuntime, 1);
		});
	});
	web.command("fetch").description("Fetch one URL").requiredOption("--url <url>", "URL").option("--provider <id>", "Provider id").option("--format <format>", "Format hint").option("--json", "Output JSON", false).action(async (opts) => {
		await runCommandWithRuntime(defaultRuntime, async () => {
			const result = await runWebFetchCommand({
				url: String(opts.url),
				provider: opts.provider,
				format: opts.format
			});
			emitJsonOrText(defaultRuntime, Boolean(opts.json), result, formatEnvelopeForText);
			if (!result.ok) exitCliAfterOutput(defaultRuntime, 1);
		});
	});
	registerLocalProvidersCommand(web, "List web providers", (cfg, agentId) => {
		const agentDir = resolveAgentDir(cfg, agentId);
		const selectedSearchProvider = typeof cfg.tools?.web?.search?.provider === "string" ? normalizeLowercaseStringOrEmpty(cfg.tools.web.search.provider) : "";
		const selectedFetchProvider = typeof cfg.tools?.web?.fetch?.provider === "string" ? normalizeLowercaseStringOrEmpty(cfg.tools.web.fetch.provider) : "";
		return {
			search: listWebSearchProviders({ config: cfg }).map((provider) => ({
				available: true,
				configured: isWebSearchProviderConfigured({
					provider,
					config: cfg,
					agentDir
				}),
				selected: provider.id === selectedSearchProvider,
				id: provider.id,
				envVars: provider.envVars
			})),
			fetch: listWebFetchProviders({ config: cfg }).map((provider) => ({
				available: true,
				configured: isWebFetchProviderConfigured({
					provider,
					config: cfg
				}),
				selected: provider.id === selectedFetchProvider,
				id: provider.id,
				envVars: provider.envVars
			}))
		};
	}, (value) => JSON.stringify(value, null, 2));
}
//#endregion
export { registerWebCapabilityCommands };
