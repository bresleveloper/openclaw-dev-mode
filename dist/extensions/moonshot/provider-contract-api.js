import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-CZNy9Kfm.mjs";
//#region extensions/moonshot/provider-contract-api.ts
const noopAuth = async () => ({ profiles: [] });
function createMoonshotProvider() {
	return {
		id: "moonshot",
		label: "Moonshot",
		docsPath: "/providers/moonshot",
		aliases: ["moonshotai", "moonshot-ai"],
		auth: openclaw_plugin_default.providerAuthChoices.map((choice) => ({
			id: choice.method,
			kind: "api_key",
			label: choice.choiceLabel,
			hint: choice.groupHint,
			run: noopAuth,
			wizard: { groupLabel: choice.groupLabel }
		}))
	};
}
//#endregion
export { createMoonshotProvider };
