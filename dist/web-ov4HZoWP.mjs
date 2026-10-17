import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-Bd4757D_.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-ClVfZRCr.mjs";
import { i as formatEnvelopeForText, r as emitJsonOrText, t as registerLocalProvidersCommand } from "./providers-command-DH2kgqMZ.mjs";
//#region src/cli/capability-cli/web.ts
function describeWebResultFailure(result) {
	const statusCode = typeof result.statusCode === "number" && Number.isFinite(result.statusCode) ? result.statusCode : void 0;
	const error = result.error;
	const errorMessage = typeof error === "string" ? error : error && typeof error === "object" && typeof error.message === "string" ? error.message : void 0;
	if (result.ok !== false && (statusCode === void 0 || statusCode < 400) && !errorMessage) return;
	return errorMessage ?? (statusCode ? `provider returned status ${statusCode}` : "provider reported failure");
}
function runWebCommand(capability, json, run) {
	return runCommandWithRuntime(defaultRuntime, async () => {
		const { provider, result } = await run();
		const error = describeWebResultFailure(result);
		const envelope = {
			ok: error === void 0,
			capability,
			transport: "local",
			provider,
			attempts: [],
			outputs: [{ result }],
			...error ? { error } : {}
		};
		emitJsonOrText(defaultRuntime, Boolean(json), envelope, formatEnvelopeForText);
		if (!envelope.ok) exitCliAfterOutput(defaultRuntime, 1);
	});
}
async function runWebSearchCommand(params) {
	const { getRuntimeConfig } = await import("./config/config.js");
	const { getCapabilityWebSearchCommandSecretTargets } = await import("./command-secret-targets-B6SXHGID.mjs");
	const { resolveLocalCapabilityRuntimeConfig } = await import("./shared-CjdG1Gdc.mjs");
	const { runWebSearch } = await import("./runtime-Ck3MrL-X.mjs");
	const rawConfig = getRuntimeConfig();
	return runWebSearch({
		config: await resolveLocalCapabilityRuntimeConfig({
			commandName: "infer web search",
			...getCapabilityWebSearchCommandSecretTargets(rawConfig, { providerId: params.provider }),
			config: rawConfig
		}),
		providerId: params.provider,
		args: {
			query: params.query,
			count: params.limit,
			limit: params.limit
		}
	});
}
async function runWebFetchCommand(params) {
	const { getRuntimeConfig } = await import("./config/config.js");
	const { getCapabilityWebFetchCommandSecretTargets } = await import("./command-secret-targets-B6SXHGID.mjs");
	const { resolveLocalCapabilityRuntimeConfig } = await import("./shared-CjdG1Gdc.mjs");
	const { resolveWebFetchDefinition } = await import("./web-fetch/runtime.js");
	const rawConfig = getRuntimeConfig();
	const resolved = resolveWebFetchDefinition({
		config: await resolveLocalCapabilityRuntimeConfig({
			commandName: "infer web fetch",
			...getCapabilityWebFetchCommandSecretTargets(rawConfig, { providerId: params.provider }),
			config: rawConfig
		}),
		providerId: params.provider
	});
	if (!resolved) throw new Error("web.fetch is disabled or no provider is available.");
	const result = await resolved.definition.execute({
		url: params.url,
		extractMode: params.format
	});
	return {
		provider: resolved.provider.id,
		result
	};
}
function registerWebCapabilityCommands(capability) {
	const web = capability.command("web").description("Web capabilities");
	web.command("search").description("Run web search").requiredOption("--query <text>", "Search query").option("--provider <id>", "Provider id").option("--limit <n>", "Result limit").option("--json", "Output JSON", false).action((opts) => runWebCommand("web.search", opts.json, async () => {
		const { parseOptionalPositiveInteger } = await import("./shared-CjdG1Gdc.mjs");
		return runWebSearchCommand({
			query: String(opts.query),
			provider: opts.provider,
			limit: parseOptionalPositiveInteger(opts.limit, "--limit")
		});
	}));
	web.command("fetch").description("Fetch one URL").requiredOption("--url <url>", "URL").option("--provider <id>", "Provider id").option("--format <format>", "Format hint").option("--json", "Output JSON", false).action((opts) => runWebCommand("web.fetch", opts.json, () => runWebFetchCommand({
		url: String(opts.url),
		provider: opts.provider,
		format: opts.format
	})));
	registerLocalProvidersCommand(web, "List web providers", async (cfg, agentId) => {
		const { resolveAgentDir } = await import("./agent-scope-BbGZA7Yc.mjs");
		const { isWebFetchProviderConfigured, listWebFetchProviders } = await import("./web-fetch/runtime.js");
		const { isWebSearchProviderConfigured, listWebSearchProviders } = await import("./runtime-Ck3MrL-X.mjs");
		const agentDir = resolveAgentDir(cfg, agentId);
		const selectedSearchProvider = normalizeLowercaseStringOrEmpty(cfg.tools?.web?.search?.provider);
		const selectedFetchProvider = normalizeLowercaseStringOrEmpty(cfg.tools?.web?.fetch?.provider);
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
	});
}
//#endregion
export { registerWebCapabilityCommands };
