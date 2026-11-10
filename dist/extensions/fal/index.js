import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import { t as buildFalImageGenerationProvider } from "../../image-generation-provider-B17k21Q0.mjs";
import { t as buildFalMusicGenerationProvider } from "../../music-generation-provider-ll2RqJ-n.mjs";
import { t as createFalProvider } from "../../provider-registration-CcifgzUJ.mjs";
import { t as buildFalVideoGenerationProvider } from "../../video-generation-provider-Cl6Hvy4H.mjs";
var fal_default = definePluginEntry({
	id: "fal",
	name: "fal Provider",
	description: "Bundled fal image, video, and music generation provider",
	register(api) {
		api.registerProvider(createFalProvider());
		api.registerImageGenerationProvider(buildFalImageGenerationProvider());
		api.registerMusicGenerationProvider(buildFalMusicGenerationProvider());
		api.registerVideoGenerationProvider(buildFalVideoGenerationProvider());
	}
});
//#endregion
export { fal_default as default };
