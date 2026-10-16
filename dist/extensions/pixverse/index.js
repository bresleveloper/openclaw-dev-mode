import { PIXVERSE_PROVIDER_ID } from "./constants.js";
import { buildPixVerseApiKeyAuthMethod } from "./onboard.js";
import { buildPixVerseVideoGenerationProvider } from "./video-generation-provider.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/pixverse/index.ts
var pixverse_default = definePluginEntry({
	id: PIXVERSE_PROVIDER_ID,
	name: "PixVerse Provider",
	description: "Official external PixVerse video provider plugin",
	register(api) {
		api.registerProvider({
			id: PIXVERSE_PROVIDER_ID,
			label: "PixVerse",
			docsPath: "/providers/pixverse",
			envVars: ["PIXVERSE_API_KEY"],
			auth: [buildPixVerseApiKeyAuthMethod()]
		});
		api.registerVideoGenerationProvider(buildPixVerseVideoGenerationProvider());
	}
});
//#endregion
export { pixverse_default as default };
