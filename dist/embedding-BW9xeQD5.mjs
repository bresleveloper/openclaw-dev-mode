import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as providerSummaryText, i as formatEnvelopeForText, n as runCapabilityCommand, t as registerLocalProvidersCommand } from "./providers-command-BKm6xsdL.mjs";
import { t as collectOption } from "./helpers-CZZt1vds.mjs";
//#region src/cli/capability-cli/embedding.ts
function registerEmbeddingCapabilityCommands(capability) {
	const embeddingCommand = capability.command("embedding").description("Embedding providers").option("--agent <id>", "Agent whose model and auth state should be used");
	embeddingCommand.command("create").description("Create embeddings").requiredOption("--text <text>", "Input text", collectOption).option("--provider <id>", "Provider id").option("--model <provider/model>", "Model override").option("--agent <id>", "Agent whose saved provider auth is used (default: agents.defaults.systemAgent.agentId, then the sole agent)").option("--json", "Output JSON", false).action((opts, command) => runCapabilityCommand(opts.json, formatEnvelopeForText, async () => {
		const { requireProviderModelOverride, resolveLocalCapabilityAgent, resolveCapabilityAgentOption } = await import("./shared-44vrfXju.mjs");
		const texts = opts.text;
		const agent = resolveCapabilityAgentOption(command, opts.agent);
		const { getMemoryEmbeddingCommandSecretTargetIds } = await import("./command-secret-targets-BF6Ekt_4.mjs");
		const { createEmbeddingProvider } = await import("./memory-core-bundled-runtime-CsLAo91h.mjs");
		const modelRef = requireProviderModelOverride(opts.model);
		const { cfg, agentDir } = await resolveLocalCapabilityAgent({
			commandName: "infer embedding create",
			targetIds: getMemoryEmbeddingCommandSecretTargetIds(),
			agent
		});
		const result = await createEmbeddingProvider({
			config: cfg,
			agentDir,
			provider: normalizeOptionalString(opts.provider) || modelRef?.provider || "auto",
			fallback: "none",
			model: modelRef?.model ?? ""
		});
		if (!result.provider) throw new Error(result.providerUnavailableReason ?? "No embedding provider available.");
		const provider = result.provider;
		let embeddings;
		try {
			embeddings = await provider.embedBatch(texts, { inputType: "document" });
		} catch (err) {
			await Promise.resolve().then(() => provider.close?.()).catch(() => {});
			throw err;
		}
		await provider.close?.();
		return {
			ok: true,
			capability: "embedding.create",
			transport: "local",
			provider: provider.id,
			model: provider.model,
			attempts: result.fallbackFrom ? [{
				provider: result.fallbackFrom,
				outcome: "failed",
				error: result.fallbackReason
			}] : [],
			outputs: embeddings.map((embedding, index) => ({
				text: texts[index],
				embedding,
				dimensions: embedding.length
			}))
		};
	}));
	registerLocalProvidersCommand(embeddingCommand, "List embedding providers", async (cfg, agentId) => {
		const { providerHasGenericConfig } = await import("./shared-44vrfXju.mjs");
		const { resolveMemorySearchConfig } = await import("./memory-search-EtX3skSa.mjs");
		const { listEmbeddingProviders } = await import("./embedding-provider-runtime-pcBptXO5.mjs");
		const { listRegisteredMemoryEmbeddingProviderAdapters } = await import("./memory-embedding-provider-runtime-vlafildq.mjs");
		const resolvedMemory = resolveMemorySearchConfig(cfg, agentId);
		const selectedProvider = resolvedMemory?.provider;
		const providers = new Map(listRegisteredMemoryEmbeddingProviderAdapters().map((provider) => [provider.id, {
			id: provider.id,
			defaultModel: provider.defaultModel,
			transport: provider.transport,
			autoSelectPriority: provider.autoSelectPriority
		}]));
		for (const provider of listEmbeddingProviders(cfg)) {
			if (providers.has(provider.id)) continue;
			providers.set(provider.id, {
				id: provider.id,
				defaultModel: provider.defaultModel,
				transport: provider.transport,
				autoSelectPriority: void 0
			});
		}
		if (selectedProvider && !providers.has(selectedProvider)) providers.set(selectedProvider, {
			id: selectedProvider,
			defaultModel: resolvedMemory?.model || void 0,
			transport: providerHasGenericConfig({
				cfg,
				providerId: selectedProvider,
				agentId
			}) ? "remote" : void 0,
			autoSelectPriority: void 0
		});
		return Array.from(providers.values()).map((provider) => ({
			available: true,
			configured: provider.id === selectedProvider || providerHasGenericConfig({
				cfg,
				providerId: provider.id,
				agentId
			}),
			selected: provider.id === selectedProvider,
			id: provider.id,
			defaultModel: provider.defaultModel,
			transport: provider.transport,
			autoSelectPriority: provider.autoSelectPriority
		}));
	}, providerSummaryText);
}
//#endregion
export { registerEmbeddingCapabilityCommands };
