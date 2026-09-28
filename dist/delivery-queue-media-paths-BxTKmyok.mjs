import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.mjs";
import { g as resolveDeliveryQueueMediaDir } from "./paths-DehQwyE0.mjs";
import path from "node:path";
//#region src/infra/outbound/delivery-queue-media-paths.ts
const ARTIFACT_NAME_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:\.[A-Za-z0-9]{1,10})?(?:\.part)?$/;
function spoolRelativePath(absolutePath, stateDir) {
	const spoolRoot = path.resolve(resolveDeliveryQueueMediaDir(stateDir));
	const candidate = path.resolve(absolutePath);
	const relative = path.relative(spoolRoot, candidate);
	return relative && !relative.includes(path.sep) && ARTIFACT_NAME_RE.test(relative) ? relative : null;
}
function payloadMediaSources(payload) {
	const sources = [];
	if (hasNonEmptyString(payload.mediaUrl)) sources.push(payload.mediaUrl);
	for (const mediaUrl of payload.mediaUrls ?? []) if (hasNonEmptyString(mediaUrl)) sources.push(mediaUrl);
	return sources;
}
/** Absolute spool paths a queue entry still needs in order to replay. */
function collectEntrySpoolPaths(payloads, stateDir) {
	const paths = [];
	for (const payload of payloads) for (const source of payloadMediaSources(payload)) if (path.isAbsolute(source) && spoolRelativePath(source, stateDir)) paths.push(path.resolve(source));
	return paths;
}
//#endregion
export { spoolRelativePath as i, collectEntrySpoolPaths as n, payloadMediaSources as r, ARTIFACT_NAME_RE as t };
