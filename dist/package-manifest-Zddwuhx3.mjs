import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as MANIFEST_KEY } from "./legacy-names-Cq8ruaO5.mjs";
//#region src/plugins/package-manifest.ts
const DEFAULT_PLUGIN_ENTRY_CANDIDATES = [
	"index.ts",
	"index.js",
	"index.mjs",
	"index.cjs"
];
function getPackageManifestMetadata(manifest) {
	return manifest?.[MANIFEST_KEY];
}
function resolvePackageExtensionEntries(manifest) {
	const rawOpenClaw = manifest?.[MANIFEST_KEY];
	if (rawOpenClaw === void 0 || rawOpenClaw === null) return {
		status: "missing",
		entries: []
	};
	if (!isRecord(rawOpenClaw)) return {
		status: "invalid",
		entries: [],
		error: "package.json openclaw must be an object"
	};
	const raw = rawOpenClaw.extensions;
	if (raw === void 0 || raw === null) return {
		status: "missing",
		entries: []
	};
	if (!Array.isArray(raw)) return {
		status: "invalid",
		entries: [],
		error: "package.json openclaw.extensions must be an array"
	};
	const entries = [];
	for (const [index, entry] of raw.entries()) {
		const normalized = normalizeOptionalString(entry);
		if (!normalized) return {
			status: "invalid",
			entries: [],
			error: `package.json openclaw.extensions[${index}] must be a non-empty string`
		};
		entries.push(normalized);
	}
	if (entries.length === 0) return {
		status: "empty",
		entries: []
	};
	return {
		status: "ok",
		entries
	};
}
//#endregion
export { getPackageManifestMetadata as n, resolvePackageExtensionEntries as r, DEFAULT_PLUGIN_ENTRY_CANDIDATES as t };
