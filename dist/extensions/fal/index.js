import { t as definePluginEntry } from "../../plugin-entry-CM_XK0Yw.js";
import { t as buildFalImageGenerationProvider } from "../../image-generation-provider-BWrvOcBv.js";
import { t as buildFalMusicGenerationProvider } from "../../music-generation-provider-CXUhNYd3.js";
import { t as createFalProvider } from "../../provider-registration-CjRTDYJ_.js";
import { t as buildFalVideoGenerationProvider } from "../../video-generation-provider-CqL5ArKV.js";
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
