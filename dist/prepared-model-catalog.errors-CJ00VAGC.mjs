//#region src/agents/prepared-model-catalog.errors.ts
var PreparedModelCatalogConfigReplacedError = class extends Error {
	constructor(agentDir) {
		super(`prepared model catalog owner config was replaced during the read (${agentDir})`);
		this.name = "PreparedModelCatalogConfigReplacedError";
	}
};
var PreparedModelCatalogAdmissionStalledError = class extends Error {
	constructor(pluginId, idleMs) {
		super(`${pluginId ? `Plugin ${pluginId} native reference verification` : "Catalog preparation"} stalled after ${idleMs} ms without progress; reload the plugin or restart the Gateway to retry`);
		this.name = "PreparedModelCatalogAdmissionStalledError";
	}
};
var PreparedModelCatalogGenerationMismatchError = class extends Error {
	constructor(agentDir, generationFingerprint, reconstructedFingerprint) {
		super(`prepared model catalog worker reconstructed a different runtime generation for ${agentDir} (owner=${generationFingerprint} worker=${reconstructedFingerprint})`);
		this.agentDir = agentDir;
		this.generationFingerprint = generationFingerprint;
		this.reconstructedFingerprint = reconstructedFingerprint;
		this.name = "PreparedModelCatalogGenerationMismatchError";
	}
};
//#endregion
export { PreparedModelCatalogConfigReplacedError as n, PreparedModelCatalogGenerationMismatchError as r, PreparedModelCatalogAdmissionStalledError as t };
