import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import { t as buildMinimaxImageGenerationProvider } from "../../image-generation-provider-DsULO0Ci.mjs";
import { n as minimaxPortalMediaUnderstandingProvider, t as minimaxMediaUnderstandingProvider } from "../../media-understanding-provider-B9ABZmLS.mjs";
import { t as buildMinimaxMusicGenerationProvider } from "../../music-generation-provider-EC-63-Xx.mjs";
import { t as registerMinimaxProviders } from "../../provider-registration-DoWLvj5k.mjs";
import { t as buildMinimaxSpeechProvider } from "../../speech-provider-factory-B4VPFWvu.mjs";
import { t as createMiniMaxWebSearchProvider } from "../../minimax-web-search-provider-CzRypaso.mjs";
import { t as buildMinimaxVideoGenerationProvider } from "../../video-generation-provider-CLBKsCRF.mjs";
//#region extensions/minimax/index.ts
var minimax_default = definePluginEntry({
	id: "minimax",
	name: "MiniMax",
	description: "Bundled MiniMax API-key and OAuth provider plugin",
	register(api) {
		registerMinimaxProviders(api);
		api.registerMediaUnderstandingProvider(minimaxMediaUnderstandingProvider);
		api.registerMediaUnderstandingProvider(minimaxPortalMediaUnderstandingProvider);
		api.registerImageGenerationProvider(buildMinimaxImageGenerationProvider());
		api.registerImageGenerationProvider(buildMinimaxImageGenerationProvider("minimax-portal"));
		api.registerMusicGenerationProvider(buildMinimaxMusicGenerationProvider());
		api.registerMusicGenerationProvider(buildMinimaxMusicGenerationProvider("minimax-portal"));
		api.registerVideoGenerationProvider(buildMinimaxVideoGenerationProvider());
		api.registerVideoGenerationProvider(buildMinimaxVideoGenerationProvider("minimax-portal"));
		api.registerSpeechProvider(buildMinimaxSpeechProvider);
		api.registerWebSearchProvider(createMiniMaxWebSearchProvider());
	}
});
//#endregion
export { minimax_default as default };
