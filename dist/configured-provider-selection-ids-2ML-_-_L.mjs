import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-ngXQhRsV.mjs";
//#region src/commands/doctor/shared/configured-provider-selection-ids.ts
function collectConfiguredProviderIds(cfg) {
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
function collectConfiguredMediaProviderIds(cfg) {
	const ids = /* @__PURE__ */ new Set();
	const add = (value) => {
		const id = normalizeNullableString(value);
		if (id) ids.add(id.toLowerCase());
	};
	const addModels = (value) => {
		if (!Array.isArray(value)) return;
		for (const model of value) add(asNullableRecord(model)?.provider);
	};
	const media = cfg.tools?.media;
	addModels(media?.models);
	return ids;
}
/** Provider ids used by static and installed-registry plugin matching. */
function collectConfiguredProviderSelectionIds(cfg) {
	return /* @__PURE__ */ new Set([...collectConfiguredProviderIds(cfg), ...collectConfiguredMediaProviderIds(cfg)]);
}
function collectConfiguredMediaProviderSelectionIds(cfg) {
	return collectConfiguredMediaProviderIds(cfg);
}
function collectConfiguredModelProviderSelectionIds(cfg) {
	return collectConfiguredProviderIds(cfg);
}
//#endregion
export { collectConfiguredModelProviderSelectionIds as n, collectConfiguredProviderSelectionIds as r, collectConfiguredMediaProviderSelectionIds as t };
