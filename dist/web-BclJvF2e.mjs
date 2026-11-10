import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-DmuNrGrj.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-C0bJ9VIR.mjs";
import { i as formatEnvelopeForText, r as emitJsonOrText, t as registerLocalProvidersCommand } from "./providers-command-BKm6xsdL.mjs";
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
function registerWebCapabilityCommands(capability) {
	const web = capability.command("web").description("Web capabilities");
	web.command("search").description("Run web search").requiredOption("--query <text>", "Search query").option("--provider <id>", "Provider id").option("--limit <n>", "Result limit").option("--json", "Output JSON", false).action((opts) => runWebCommand("web.search", opts.json, async () => {
		const { parseOptionalPositiveInteger } = await import("./shared-44vrfXju.mjs");
		const query = String(opts.query);
		const provider = opts.provider;
		const limit = parseOptionalPositiveInteger(opts.limit, "--limit");
		const { captureRuntimeConfigAsyncReader } = await import("./config/config.js");
		const { getCapabilityWebSearchCommandSecretTargets } = await import("./command-secret-targets-BF6Ekt_4.mjs");
		const { resolveLocalCapabilityRuntimeConfig } = await import("./shared-44vrfXju.mjs");
		const { runWebSearch } = await import("./runtime-CrsiKoeq.mjs");
		const rawConfig = await captureRuntimeConfigAsyncReader()();
		return runWebSearch({
			config: await resolveLocalCapabilityRuntimeConfig({
				commandName: "infer web search",
				...getCapabilityWebSearchCommandSecretTargets(rawConfig, { providerId: provider }),
				config: rawConfig
			}),
			providerId: provider,
			args: {
				query,
				count: limit,
				limit
			}
		});
	}));
	web.command("fetch").description("Fetch one URL").requiredOption("--url <url>", "URL").option("--provider <id>", "Provider id").option("--format <format>", "Format hint").option("--json", "Output JSON", false).action((opts) => runWebCommand("web.fetch", opts.json, async () => {
		const url = String(opts.url);
		const provider = opts.provider;
		const format = opts.format;
		const { captureRuntimeConfigAsyncReader } = await import("./config/config.js");
		const { getCapabilityWebFetchCommandSecretTargets } = await import("./command-secret-targets-BF6Ekt_4.mjs");
		const { resolveLocalCapabilityRuntimeConfig } = await import("./shared-44vrfXju.mjs");
		const { resolveWebFetchDefinition } = await import("./web-fetch/runtime.js");
		const rawConfig = await captureRuntimeConfigAsyncReader()();
		const resolved = resolveWebFetchDefinition({
			config: await resolveLocalCapabilityRuntimeConfig({
				commandName: "infer web fetch",
				...getCapabilityWebFetchCommandSecretTargets(rawConfig, { providerId: provider }),
				config: rawConfig
			}),
			providerId: provider
		});
		if (!resolved) throw new Error("web.fetch is disabled or no provider is available.");
		const result = await resolved.definition.execute({
			url,
			extractMode: format
		});
		return {
			provider: resolved.provider.id,
			result
		};
	}));
	registerLocalProvidersCommand(web, "List web providers", async (cfg, agentId) => {
		const { resolveAgentDir } = await import("./agent-scope-B7r8PTbp.mjs");
		const { isWebFetchProviderConfigured, listWebFetchProviders } = await import("./web-fetch/runtime.js");
		const { isWebSearchProviderConfigured, listWebSearchProvidersAsync } = await import("./runtime-CrsiKoeq.mjs");
		const agentDir = resolveAgentDir(cfg, agentId);
		const { ensureAuthProfileStoreWithoutExternalProfilesAsync } = await import("./store-runtime-DcCJgCJz.mjs");
		const authStore = await ensureAuthProfileStoreWithoutExternalProfilesAsync(agentDir);
		const selectedSearchProvider = normalizeLowercaseStringOrEmpty(cfg.tools?.web?.search?.provider);
		const selectedFetchProvider = normalizeLowercaseStringOrEmpty(cfg.tools?.web?.fetch?.provider);
		return {
			search: (await listWebSearchProvidersAsync({ config: cfg })).map((provider) => ({
				available: true,
				configured: isWebSearchProviderConfigured({
					provider,
					config: cfg,
					agentDir,
					authStore
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
