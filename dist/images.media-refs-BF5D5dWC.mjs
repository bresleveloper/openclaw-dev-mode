import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import "./utils-DgZn2dLu.mjs";
import { l as normalizeMediaFacts, o as isImageMediaFact } from "./media-facts-CJdQ4R61.mjs";
import { safeFileURLToPath } from "@openclaw/fs-safe/advanced";
//#region src/agents/embedded-agent-runner/run/images.media-refs.ts
const URL_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const WINDOWS_DRIVE_PATH_PATTERN = /^[A-Za-z]:[\\/]/;
function isOpenClawCliImageCachePath(filePath) {
	const parts = filePath.replaceAll("\\", "/").split("/");
	return parts.some((part, index) => {
		if (part === ".openclaw-cli-images") return true;
		const parent = parts[index - 1] ?? "";
		return part === "openclaw-cli-images" && /^openclaw(?:-\d+)?$/.test(parent);
	});
}
function resolveMediaFactLocalRef(fact) {
	const mediaUri = [fact.url, fact.path].find((value) => value?.startsWith("media://inbound/"));
	const identity = mediaUri ?? fact.path ?? fact.url;
	if (!identity) return;
	let resolved = mediaUri;
	if (!resolved && /^file:/i.test(identity)) try {
		resolved = safeFileURLToPath(identity);
	} catch {
		return;
	}
	else if (!resolved && (!URL_SCHEME_PATTERN.test(identity) || WINDOWS_DRIVE_PATH_PATTERN.test(identity))) resolved = identity;
	if (!resolved) return;
	return {
		raw: identity,
		type: mediaUri ? "media-uri" : "path",
		resolved: resolved.startsWith("~") ? resolveUserPath(resolved) : resolved
	};
}
function mediaFactToImageRef(fact, factIndex) {
	if (!isImageMediaFact(fact)) return;
	const localRef = resolveMediaFactLocalRef(fact);
	const identity = localRef?.raw ?? fact.path ?? fact.url;
	if (!identity && fact.hydrationSuppressed !== true) return;
	const usableRef = localRef && !isOpenClawCliImageCachePath(localRef.resolved) ? localRef : void 0;
	return {
		...usableRef ?? {
			raw: identity ?? "",
			type: "path",
			resolved: identity ?? ""
		},
		aliases: [
			fact.path,
			fact.url,
			usableRef?.resolved
		].filter((value) => Boolean(value)),
		...!usableRef ? { detect: false } : {},
		factIndex,
		hydrate: Boolean(usableRef) && fact.hydrationSuppressed !== true,
		...fact.workspaceDir ? { workspaceDir: fact.workspaceDir } : {}
	};
}
function collectMediaImageRefs(media) {
	return normalizeMediaFacts(media).flatMap((fact, factIndex) => isImageMediaFact(fact) ? [mediaFactToImageRef(fact, factIndex)] : []);
}
function hasHydratableMediaImages(media) {
	return normalizeMediaFacts(media).map(mediaFactToImageRef).some((ref) => ref?.hydrate === true);
}
//#endregion
export { resolveMediaFactLocalRef as i, hasHydratableMediaImages as n, isOpenClawCliImageCachePath as r, collectMediaImageRefs as t };
