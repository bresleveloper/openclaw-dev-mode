import { t as isProviderApiKeyConfigured } from "./provider-auth-availability-DlkWkL2p.mjs";
import "./provider-auth-C_UP8nFt.mjs";
//#region extensions/google/generation-provider-metadata.ts
const DEFAULT_GOOGLE_IMAGE_MODEL = "gemini-3.1-flash-image";
const GOOGLE_MAX_IMAGE_RESULTS = 4;
const GOOGLE_MEDIA_UNDERSTANDING_DEFAULT_MODELS = {
	image: "gemini-3-flash-preview",
	audio: "gemini-3-flash-preview",
	video: "gemini-3-flash-preview"
};
const DEFAULT_GOOGLE_MUSIC_MODEL = "lyria-3-clip-preview";
const GOOGLE_PRO_MUSIC_MODEL = "lyria-3-pro-preview";
const GOOGLE_MAX_INPUT_IMAGES = 10;
const DEFAULT_GOOGLE_VIDEO_MODEL = "veo-3.1-fast-generate-preview";
const GOOGLE_VIDEO_ALLOWED_DURATION_SECONDS = [
	4,
	6,
	8
];
const GOOGLE_VIDEO_MIN_DURATION_SECONDS = GOOGLE_VIDEO_ALLOWED_DURATION_SECONDS[0];
const GOOGLE_VIDEO_MAX_DURATION_SECONDS = GOOGLE_VIDEO_ALLOWED_DURATION_SECONDS[2];
function isGoogleProviderConfigured(ctx) {
	return isProviderApiKeyConfigured({
		provider: "google",
		...ctx
	});
}
function createGoogleVideoCommonCapabilities() {
	return {
		maxDurationSeconds: GOOGLE_VIDEO_MAX_DURATION_SECONDS,
		supportedDurationSeconds: [...GOOGLE_VIDEO_ALLOWED_DURATION_SECONDS],
		aspectRatios: ["16:9", "9:16"],
		resolutions: ["720P", "1080P"],
		supportsAspectRatio: true,
		supportsResolution: true,
		supportsSize: true,
		supportsAudio: false
	};
}
function createGoogleImageGenerationProviderMetadata() {
	return {
		id: "google",
		label: "Google",
		defaultModel: DEFAULT_GOOGLE_IMAGE_MODEL,
		models: [DEFAULT_GOOGLE_IMAGE_MODEL, "gemini-3-pro-image"],
		capabilities: {
			generate: {
				maxCount: 4,
				supportsSize: true,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			edit: {
				enabled: true,
				maxCount: 4,
				maxInputImages: 5,
				supportsSize: true,
				supportsAspectRatio: true,
				supportsResolution: true
			},
			geometry: {
				sizes: [
					"1024x1024",
					"1024x1536",
					"1536x1024",
					"1024x1792",
					"1792x1024"
				],
				aspectRatios: [
					"1:1",
					"2:3",
					"3:2",
					"3:4",
					"4:3",
					"4:5",
					"5:4",
					"9:16",
					"16:9",
					"21:9"
				],
				resolutions: [
					"1K",
					"2K",
					"4K"
				]
			}
		}
	};
}
function createGoogleMediaUnderstandingProviderMetadata() {
	return {
		id: "google",
		capabilities: [
			"image",
			"audio",
			"video"
		],
		defaultModels: { ...GOOGLE_MEDIA_UNDERSTANDING_DEFAULT_MODELS },
		autoPriority: {
			image: 30,
			audio: 40,
			video: 10
		},
		nativeDocumentInputs: ["pdf"],
		describeImage: void 0,
		describeImages: void 0
	};
}
function createGoogleMusicGenerationProviderMetadata() {
	return {
		id: "google",
		label: "Google",
		defaultModel: DEFAULT_GOOGLE_MUSIC_MODEL,
		models: [DEFAULT_GOOGLE_MUSIC_MODEL, GOOGLE_PRO_MUSIC_MODEL],
		isConfigured: isGoogleProviderConfigured,
		capabilities: {
			generate: {
				maxTracks: 1,
				supportsLyrics: true,
				supportsInstrumental: true,
				supportsFormat: true,
				supportedFormatsByModel: {
					[DEFAULT_GOOGLE_MUSIC_MODEL]: ["mp3"],
					[GOOGLE_PRO_MUSIC_MODEL]: ["mp3", "wav"]
				}
			},
			edit: {
				enabled: true,
				maxTracks: 1,
				maxInputImages: 10,
				supportsLyrics: true,
				supportsInstrumental: true,
				supportsFormat: true,
				supportedFormatsByModel: {
					[DEFAULT_GOOGLE_MUSIC_MODEL]: ["mp3"],
					[GOOGLE_PRO_MUSIC_MODEL]: ["mp3", "wav"]
				}
			}
		}
	};
}
function createGoogleVideoGenerationProviderMetadata() {
	return {
		id: "google",
		label: "Google",
		defaultModel: DEFAULT_GOOGLE_VIDEO_MODEL,
		models: [
			DEFAULT_GOOGLE_VIDEO_MODEL,
			"veo-3.1-generate-preview",
			"veo-3.1-lite-generate-preview"
		],
		isConfigured: isGoogleProviderConfigured,
		capabilities: {
			generate: {
				maxVideos: 1,
				...createGoogleVideoCommonCapabilities()
			},
			imageToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputImages: 1,
				...createGoogleVideoCommonCapabilities()
			},
			videoToVideo: {
				enabled: true,
				maxVideos: 1,
				maxInputVideos: 1,
				...createGoogleVideoCommonCapabilities()
			}
		}
	};
}
//#endregion
export { GOOGLE_MAX_INPUT_IMAGES as a, GOOGLE_VIDEO_ALLOWED_DURATION_SECONDS as c, createGoogleImageGenerationProviderMetadata as d, createGoogleMediaUnderstandingProviderMetadata as f, GOOGLE_MAX_IMAGE_RESULTS as i, GOOGLE_VIDEO_MAX_DURATION_SECONDS as l, createGoogleVideoGenerationProviderMetadata as m, DEFAULT_GOOGLE_MUSIC_MODEL as n, GOOGLE_MEDIA_UNDERSTANDING_DEFAULT_MODELS as o, createGoogleMusicGenerationProviderMetadata as p, DEFAULT_GOOGLE_VIDEO_MODEL as r, GOOGLE_PRO_MUSIC_MODEL as s, DEFAULT_GOOGLE_IMAGE_MODEL as t, GOOGLE_VIDEO_MIN_DURATION_SECONDS as u };
