import { g as readStringValue } from "./string-coerce-1VuiLaaR.mjs";
import { a as normalizeCsvOrLooseStringList } from "./string-normalization-CECOqf64.mjs";
import { a as resolveOpenClawManifestBlock, c as resolveOpenClawManifestRequires, i as parseOpenClawManifestInstallBase, o as resolveOpenClawManifestInstall, s as resolveOpenClawManifestOs, t as applyOpenClawManifestInstallCommonFields } from "./frontmatter-ByhFzIgC.mjs";
//#region src/hooks/frontmatter.ts
function parseInstallSpec(input) {
	const parsed = parseOpenClawManifestInstallBase(input, [
		"bundled",
		"npm",
		"git"
	]);
	if (!parsed) return;
	const { raw } = parsed;
	const spec = applyOpenClawManifestInstallCommonFields({ kind: parsed.kind }, parsed);
	if (typeof raw.package === "string") spec.package = raw.package;
	if (typeof raw.repository === "string") spec.repository = raw.repository;
	return spec;
}
/** Resolve OpenClaw hook metadata from the manifest block in HOOK.md frontmatter. */
function resolveHookManifestMetadata(frontmatter) {
	const metadataObj = resolveOpenClawManifestBlock({ frontmatter });
	if (!metadataObj) return;
	const requires = resolveOpenClawManifestRequires(metadataObj);
	const install = resolveOpenClawManifestInstall(metadataObj, parseInstallSpec);
	const osRaw = resolveOpenClawManifestOs(metadataObj);
	return {
		always: typeof metadataObj.always === "boolean" ? metadataObj.always : void 0,
		emoji: readStringValue(metadataObj.emoji),
		homepage: readStringValue(metadataObj.homepage),
		hookKey: readStringValue(metadataObj.hookKey),
		export: readStringValue(metadataObj.export),
		os: osRaw.length > 0 ? osRaw : void 0,
		events: normalizeCsvOrLooseStringList(metadataObj.events),
		requires,
		install: install.length > 0 ? install : void 0
	};
}
/** Resolve the config key for a hook, honoring metadata hookKey overrides. */
function resolveHookKey(hookName, entry) {
	return entry?.metadata?.hookKey ?? hookName;
}
//#endregion
export { resolveHookManifestMetadata as n, resolveHookKey as t };
