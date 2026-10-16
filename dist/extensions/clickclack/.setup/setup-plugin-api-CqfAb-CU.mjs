import { l as clickClackConfigAdapter, n as clickClackSetupContract, s as clickClackConfigSchema, t as clickClackSetupWizard, u as clickClackMeta } from "./setup-surface-DcF_7-VV.mjs";
//#region extensions/clickclack/src/channel.setup.ts
const clickClackSetupPlugin = {
	id: "clickclack",
	meta: clickClackMeta,
	capabilities: {
		chatTypes: ["direct", "group"],
		threads: true,
		blockStreaming: true
	},
	reload: { configPrefixes: ["channels.clickclack"] },
	configSchema: clickClackConfigSchema,
	config: clickClackConfigAdapter,
	setupContract: clickClackSetupContract,
	setupWizard: clickClackSetupWizard
};
//#endregion
export { clickClackSetupPlugin as t };
