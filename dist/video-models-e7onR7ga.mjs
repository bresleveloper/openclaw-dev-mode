//#region extensions/kie/video-models.ts
const KLING = {
	durations: [5, 10],
	audioField: "sound",
	maxPromptLength: 1e3
};
const GROK = {
	durations: Array.from({ length: 25 }, (_, index) => index + 6),
	resolutions: [
		"480P",
		"720P",
		"1080P"
	],
	maxPromptLength: 5e3
};
const WAN = {
	durations: [
		5,
		10,
		15
	],
	resolutions: ["1080P", "720P"],
	maxPromptLength: 5e3
};
const HAILUO = { maxPromptLength: 1500 };
const HAILUO_23 = {
	durations: [6, 10],
	resolutions: ["768P", "1080P"],
	uppercaseResolution: true,
	imageField: "image_url",
	maxPromptLength: 5e3
};
const SEEDANCE = {
	durations: Array.from({ length: 9 }, (_, index) => index + 4),
	numericDuration: true,
	resolutions: [
		"720P",
		"480P",
		"1080P"
	],
	aspectRatios: [
		"16:9",
		"1:1",
		"4:3",
		"3:4",
		"9:16",
		"21:9"
	],
	audioField: "generate_audio",
	maxPromptLength: 2e4,
	minPromptLength: 3
};
const KIE_VIDEO_FAMILIES = [
	{
		textModel: "kling-2.6/text-to-video",
		imageModel: "kling-2.6/image-to-video",
		text: {
			...KLING,
			aspectRatios: [
				"16:9",
				"1:1",
				"9:16"
			]
		},
		image: {
			...KLING,
			imageField: "image_urls"
		}
	},
	{
		textModel: "grok-imagine/text-to-video",
		imageModel: "grok-imagine/image-to-video",
		text: {
			...GROK,
			numericDuration: true,
			aspectRatios: [
				"16:9",
				"2:3",
				"3:2",
				"1:1",
				"9:16"
			]
		},
		image: {
			...GROK,
			imageField: "image_urls"
		}
	},
	{
		textModel: "wan/2-6-text-to-video",
		imageModel: "wan/2-6-image-to-video",
		text: WAN,
		image: {
			...WAN,
			imageField: "image_urls",
			minPromptLength: 2
		}
	},
	{
		textModel: "hailuo/02-text-to-video-standard",
		imageModel: "hailuo/02-image-to-video-standard",
		text: {
			...HAILUO,
			durations: [6, 10]
		},
		image: {
			...HAILUO,
			durations: [6, 10],
			resolutions: ["768P", "512P"],
			uppercaseResolution: true,
			imageField: "image_url"
		}
	},
	{
		textModel: "hailuo/02-text-to-video-pro",
		imageModel: "hailuo/02-image-to-video-pro",
		text: HAILUO,
		image: {
			...HAILUO,
			imageField: "image_url"
		}
	},
	{
		imageModel: "hailuo/2-3-image-to-video-standard",
		image: HAILUO_23
	},
	{
		imageModel: "hailuo/2-3-image-to-video-pro",
		image: HAILUO_23
	},
	{
		textModel: "bytedance/seedance-1.5-pro",
		imageModel: "bytedance/seedance-1.5-pro",
		text: SEEDANCE,
		image: {
			...SEEDANCE,
			imageField: "input_urls"
		}
	}
];
const DEFAULT_KIE_VIDEO_MODEL = "kling-2.6/text-to-video";
function findKieVideoFamily(model) {
	const family = KIE_VIDEO_FAMILIES.find((entry) => entry.textModel === model || entry.imageModel === model);
	if (!family) throw new Error(`Kie AI video generation does not support model ${model}.`);
	return family;
}
function modeCapabilities(input) {
	return {
		maxVideos: 1,
		maxDurationSeconds: input?.durations ? Math.max(...input.durations) : void 0,
		supportedDurationSeconds: input?.durations ?? [],
		aspectRatios: input?.aspectRatios ?? [],
		resolutions: input?.resolutions ?? [],
		supportsAspectRatio: Boolean(input?.aspectRatios),
		supportsResolution: Boolean(input?.resolutions),
		supportsAudio: Boolean(input?.audioField),
		supportsSize: false,
		supportsWatermark: false,
		providerOptions: {}
	};
}
function kieVideoCapabilities(family) {
	return {
		generate: modeCapabilities(family.text),
		imageToVideo: {
			...modeCapabilities(family.image),
			enabled: true,
			maxInputImages: 1
		},
		videoToVideo: { enabled: false }
	};
}
function prepareKieVideoRequest(req) {
	if (req.inputVideos?.length || req.inputAudios?.length) throw new Error("Kie AI video generation does not support video or audio reference inputs.");
	if ((req.inputImages?.length ?? 0) > 1) throw new Error("Kie AI video generation supports at most one input image.");
	const image = req.inputImages?.[0];
	if (image?.role && image.role !== "first_frame") throw new Error("Kie AI image-to-video supports only an ordinary or first_frame image.");
	const family = findKieVideoFamily(req.model.trim() || "kling-2.6/text-to-video");
	const spec = image ? family.image : family.text;
	const model = image ? family.imageModel : family.textModel;
	if (!spec || !model) throw new Error(`Kie AI model ${req.model} requires one input image.`);
	const minPromptLength = spec.minPromptLength ?? 1;
	if (req.prompt.trim().length < minPromptLength || req.prompt.length > spec.maxPromptLength) throw new Error(`Kie AI ${model} requires a prompt of ${minPromptLength}-${spec.maxPromptLength} characters.`);
	const input = { prompt: req.prompt };
	if (spec.durations?.length) {
		const requested = req.durationSeconds;
		const duration = typeof requested === "number" && Number.isFinite(requested) ? spec.durations.reduce((best, next) => Math.abs(next - requested) < Math.abs(best - requested) ? next : best) : spec.durations[0];
		input.duration = spec.numericDuration ? duration : String(duration);
	}
	if (spec.aspectRatios) input.aspect_ratio = spec.aspectRatios.includes(req.aspectRatio ?? "") ? req.aspectRatio : spec.aspectRatios[0];
	if (spec.resolutions) {
		const requested = req.resolution?.toUpperCase();
		const resolution = spec.resolutions.find((value) => value === requested) ?? spec.resolutions[0];
		input.resolution = spec.uppercaseResolution ? resolution : resolution?.toLowerCase();
		if (model.startsWith("hailuo/2-3-") && resolution === "1080P" && input.duration === "10") throw new Error("Kie AI Hailuo 2.3 supports 1080P only at 6 seconds; use 768P for 10 seconds.");
	}
	if (spec.audioField) input[spec.audioField] = req.audio ?? false;
	return {
		model,
		input,
		image,
		imageField: spec.imageField
	};
}
//#endregion
export { prepareKieVideoRequest as a, kieVideoCapabilities as i, KIE_VIDEO_FAMILIES as n, findKieVideoFamily as r, DEFAULT_KIE_VIDEO_MODEL as t };
