//#region src/agents/prepared-model-catalog.errors.ts
var PreparedModelCatalogConfigReplacedError = class extends Error {
	constructor(agentDir) {
		super(`prepared model catalog owner config was replaced during the read (${agentDir})`);
		this.name = "PreparedModelCatalogConfigReplacedError";
	}
};
//#endregion
export { PreparedModelCatalogConfigReplacedError as t };
