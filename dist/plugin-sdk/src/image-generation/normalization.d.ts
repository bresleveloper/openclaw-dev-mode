import type { ImageGenerationBackground, ImageGenerationIgnoredOverride, ImageGenerationNormalization, ImageGenerationOutputFormat, ImageGenerationProvider, ImageGenerationQuality, ImageGenerationResolution, ImageGenerationSourceImage } from "./types.js";
type ResolvedImageGenerationOverrides = {
    size?: string;
    aspectRatio?: string;
    resolution?: ImageGenerationResolution;
    quality?: ImageGenerationQuality;
    outputFormat?: ImageGenerationOutputFormat;
    background?: ImageGenerationBackground;
    ignoredOverrides: ImageGenerationIgnoredOverride[];
    normalization?: ImageGenerationNormalization;
};
/** Returns supported image overrides plus ignored/normalized override metadata for replies. */
export declare function resolveImageGenerationOverrides(params: {
    provider: ImageGenerationProvider;
    model?: string;
    size?: string;
    aspectRatio?: string;
    resolution?: ImageGenerationResolution;
    quality?: ImageGenerationQuality;
    outputFormat?: ImageGenerationOutputFormat;
    background?: ImageGenerationBackground;
    inputImages?: ImageGenerationSourceImage[];
}): ResolvedImageGenerationOverrides;
export {};
