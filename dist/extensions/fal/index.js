import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { t as buildFalImageGenerationProvider } from "../../image-generation-provider-ChdovFrm.mjs";
import { t as buildFalMusicGenerationProvider } from "../../music-generation-provider-D8m6Lzpc.mjs";
import { t as createFalProvider } from "../../provider-registration-BkHeIz4d.mjs";
import { t as buildFalVideoGenerationProvider } from "../../video-generation-provider-BtGy0Bzm.mjs";
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
