import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { M as collectConfiguredModelRefs } from "./runtime-snapshot-DYptB0Cf.mjs";
//#region src/commands/doctor/shared/configured-provider-selection-ids.ts
function collectConfiguredModelProviderSelectionIds(cfg) {
	const ids = /* @__PURE__ */ new Set();
	const add = (value) => {
		const id = normalizeNullableString(value);
		if (id) ids.add(id.toLowerCase());
	};
	for (const profile of Object.values(asNullableRecord(cfg.auth?.profiles) ?? {})) add(asNullableRecord(profile)?.provider);
	for (const providerId of Object.keys(asNullableRecord(cfg.models?.providers) ?? {})) add(providerId);
	const modelByChannel = asNullableRecord(cfg.channels?.modelByChannel);
	for (const [providerId, channelMap] of Object.entries(modelByChannel ?? {})) {
		add(providerId);
		for (const modelRef of Object.values(asNullableRecord(channelMap) ?? {})) {
			if (typeof modelRef !== "string") continue;
			const slash = modelRef.indexOf("/");
			if (slash > 0) add(modelRef.slice(0, slash));
		}
	}
	for (const { value } of collectConfiguredModelRefs(cfg, { includeChannelModelOverrides: false })) {
		const slash = value.indexOf("/");
		if (slash > 0) add(value.slice(0, slash));
	}
	return ids;
}
function collectConfiguredMediaProviderSelectionIds(cfg) {
	const models = cfg.tools?.media?.models;
	return new Set(normalizeTrimmedStringList(Array.isArray(models) ? models.map((model) => asNullableRecord(model)?.provider) : []).map((provider) => provider.toLowerCase()));
}
/** Provider ids used by static and installed-registry plugin matching. */
function collectConfiguredProviderSelectionIds(cfg) {
	return /* @__PURE__ */ new Set([...collectConfiguredModelProviderSelectionIds(cfg), ...collectConfiguredMediaProviderSelectionIds(cfg)]);
}
//#endregion
export { collectConfiguredModelProviderSelectionIds as n, collectConfiguredProviderSelectionIds as r, collectConfiguredMediaProviderSelectionIds as t };
