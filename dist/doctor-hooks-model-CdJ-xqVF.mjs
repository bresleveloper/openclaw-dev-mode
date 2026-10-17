//#region src/commands/doctor-hooks-model.ts
async function collectHooksModelIssues(cfg) {
	const model = cfg.hooks?.gmail?.model;
	if (!model?.trim()) return [];
	const { DEFAULT_MODEL, DEFAULT_PROVIDER } = await import("./defaults-DwjgwHqH.mjs");
	const { readPreparedModelCatalog } = await import("./prepared-model-catalog-CdRVgew8.mjs");
	const { getModelRefStatus, resolveConfiguredModelRef, resolveHooksGmailModel } = await import("./model-selection-B2XpruDT.mjs");
	const ref = resolveHooksGmailModel({
		cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	if (!ref) return [{
		kind: "unresolved",
		model
	}];
	const defaultModel = resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const status = getModelRefStatus({
		cfg,
		catalog: await readPreparedModelCatalog({
			config: cfg,
			readOnly: true,
			providerDiscoveryProviderIds: []
		}),
		ref,
		defaultProvider: defaultModel.provider,
		defaultModel
	});
	const issues = [];
	if (!status.allowed) issues.push({
		kind: "not-allowed",
		model: status.key
	});
	if (!status.inCatalog) issues.push({
		kind: "not-in-catalog",
		model: status.key
	});
	return issues;
}
//#endregion
export { collectHooksModelIssues };
