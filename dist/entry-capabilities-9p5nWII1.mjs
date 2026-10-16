import { s as tokenizeConcreteConfigPath } from "./dot-path-CVD5Jolm.mjs";
import { c as findActiveDegradedSecretOwner, n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-oevwKU3u.mjs";
import { n as normalizeMediaProviderId } from "./provider-id-BZvihdyi.mjs";
//#region src/secrets/runtime-media-secret-owner.ts
/** Runtime owner for one configured media-understanding model entry. */
function runtimeMediaModelSecretOwnerId(index) {
	return `media-model:shared:${index}`;
}
/** Runtime owner for request defaults inherited by one media capability. */
function runtimeMediaRequestSecretOwnerId(capability) {
	return `media-model:${capability}:request`;
}
function modelRequestOverridesPath(entry, path) {
	const request = entry.request;
	if (!request) return false;
	const segments = tokenizeConcreteConfigPath(path).tokens;
	const field = segments[4];
	if (field === "auth") return request.auth !== void 0;
	if (field === "tls") return request.tls !== void 0;
	if (field === "proxy") return request.proxy !== void 0;
	const headerKey = segments[5];
	const headerName = field === "headers" && typeof headerKey === "string" ? headerKey.toLowerCase() : void 0;
	return Boolean(headerName && Object.keys(request.headers ?? {}).some((key) => key.toLowerCase() === headerName));
}
/** Rejects a cold capability request only when the model still inherits its failed field. */
function assertRuntimeMediaRequestSecretOwnerAvailable(params) {
	const owner = findActiveDegradedSecretOwner("capability", runtimeMediaRequestSecretOwnerId(params.capability));
	if (owner && owner.paths.some((path) => !modelRequestOverridesPath(params.entry, path))) throw new SecretSurfaceUnavailableError(owner);
}
//#endregion
//#region src/media-understanding/entry-capabilities.ts
const MEDIA_CAPABILITIES = [
	"audio",
	"image",
	"video"
];
function isMediaCapability(value) {
	return typeof value === "string" && MEDIA_CAPABILITIES.includes(value);
}
function resolveEntryType(entry) {
	return entry.type ?? (entry.command ? "cli" : "provider");
}
/** Returns valid explicit capability tags from a media model entry. */
function resolveConfiguredMediaEntryCapabilities(entry) {
	if (!Array.isArray(entry.capabilities)) return;
	const capabilities = entry.capabilities.filter(isMediaCapability);
	return capabilities.length > 0 ? capabilities : void 0;
}
/** Resolves the capability set for an entry, inferring shared provider entries from metadata. */
function resolveEffectiveMediaEntryCapabilities(params) {
	const configured = resolveConfiguredMediaEntryCapabilities(params.entry);
	if (configured) return configured;
	if (resolveEntryType(params.entry) === "cli") return;
	const providerId = normalizeMediaProviderId(params.entry.provider ?? "");
	if (!providerId) return;
	return params.providerRegistry.get(providerId)?.capabilities;
}
/** Tests whether an entry should be considered for a requested media capability. */
function matchesMediaEntryCapability(params) {
	return resolveEffectiveMediaEntryCapabilities(params)?.includes(params.capability) ?? false;
}
//#endregion
export { runtimeMediaModelSecretOwnerId as a, assertRuntimeMediaRequestSecretOwnerAvailable as i, resolveConfiguredMediaEntryCapabilities as n, runtimeMediaRequestSecretOwnerId as o, resolveEffectiveMediaEntryCapabilities as r, matchesMediaEntryCapability as t };
