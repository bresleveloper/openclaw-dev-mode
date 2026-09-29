import { a as resolveClosestAspectRatio, o as resolveClosestResolution, s as resolveClosestSize } from "./runtime-shared-DCDF_8Js.mjs";
//#region src/media-generation/geometry-normalization.ts
/** Normalizes shared image/video geometry while retaining their capability-specific contracts. */
function resolveMediaGeometryOverrides(params) {
	const caps = params.capabilities;
	const ignoredOverrides = [];
	const normalization = {};
	let { size, aspectRatio, resolution } = params;
	if (!caps) return {
		size,
		aspectRatio,
		resolution,
		ignoredOverrides,
		normalization
	};
	if (size && (caps.sizes?.length ?? 0) > 0 && caps.supportsSize) {
		const normalizedSize = resolveClosestSize({
			requestedSize: size,
			requestedAspectRatio: params.useAspectRatioForRequestedSize ? aspectRatio : void 0,
			supportedSizes: caps.sizes
		});
		if (normalizedSize && normalizedSize !== size) normalization.size = {
			requested: size,
			applied: normalizedSize
		};
		size = normalizedSize;
	}
	if (size && !caps.supportsSize) {
		const translated = caps.supportsAspectRatio ? resolveClosestAspectRatio({
			requestedAspectRatio: aspectRatio,
			requestedSize: size,
			supportedAspectRatios: caps.aspectRatios
		}) : void 0;
		if (translated) {
			aspectRatio = translated;
			normalization.aspectRatio = {
				applied: translated,
				derivedFrom: "size"
			};
		} else ignoredOverrides.push({
			key: "size",
			value: size
		});
		size = void 0;
	}
	if (aspectRatio && (caps.aspectRatios?.length ?? 0) > 0 && caps.supportsAspectRatio) {
		const normalizedAspectRatio = resolveClosestAspectRatio({
			requestedAspectRatio: aspectRatio,
			requestedSize: size,
			supportedAspectRatios: caps.aspectRatios
		});
		if (normalizedAspectRatio && normalizedAspectRatio !== aspectRatio) normalization.aspectRatio = {
			requested: aspectRatio,
			applied: normalizedAspectRatio
		};
		else if (!normalizedAspectRatio && params.reportUnrecognizedOverrides) ignoredOverrides.push({
			key: "aspectRatio",
			value: aspectRatio
		});
		aspectRatio = normalizedAspectRatio;
	} else if (aspectRatio && !caps.supportsAspectRatio) {
		const translated = caps.supportsSize && !size ? resolveClosestSize({
			requestedSize: params.size,
			requestedAspectRatio: aspectRatio,
			supportedSizes: caps.sizes?.length === 0 ? params.fallbackSizes : caps.sizes
		}) : void 0;
		if (translated) {
			size = translated;
			normalization.size = {
				applied: translated,
				derivedFrom: "aspectRatio"
			};
		} else ignoredOverrides.push({
			key: "aspectRatio",
			value: aspectRatio
		});
		aspectRatio = void 0;
	}
	if (resolution && (caps.resolutions?.length ?? 0) > 0 && caps.supportsResolution) {
		const normalizedResolution = resolveClosestResolution({
			requestedResolution: resolution,
			supportedResolutions: caps.resolutions,
			order: params.resolutionOrder
		});
		if (normalizedResolution && normalizedResolution !== resolution) normalization.resolution = {
			requested: resolution,
			applied: normalizedResolution
		};
		else if (!normalizedResolution && params.reportUnrecognizedOverrides) ignoredOverrides.push({
			key: "resolution",
			value: resolution
		});
		resolution = normalizedResolution;
	} else if (resolution && !caps.supportsResolution) {
		ignoredOverrides.push({
			key: "resolution",
			value: resolution
		});
		resolution = void 0;
	}
	return {
		size,
		aspectRatio,
		resolution,
		ignoredOverrides,
		normalization
	};
}
//#endregion
export { resolveMediaGeometryOverrides as t };
