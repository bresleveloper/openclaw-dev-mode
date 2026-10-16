//#region src/channels/plugins/exposure.ts
/**
* Resolves where a channel should appear in configured, setup, and docs views.
*/
function resolveChannelExposure(meta) {
	return {
		configured: meta.exposure?.configured ?? true,
		setup: meta.exposure?.setup ?? true,
		docs: meta.exposure?.docs ?? true
	};
}
/**
* Returns whether the channel should be listed for already configured agents.
*/
function isChannelVisibleInConfiguredLists(meta) {
	return resolveChannelExposure(meta).configured;
}
/**
* Returns whether the channel should be offered during setup/onboarding.
*/
function isChannelVisibleInSetup(meta) {
	return resolveChannelExposure(meta).setup;
}
//#endregion
//#region src/channels/plugins/channel-meta.ts
/**
* Builds normalized channel metadata from a plugin manifest channel declaration.
*/
function buildManifestChannelMeta(params) {
	const hasArrayField = (value) => params.arrayFieldMode === "defined" ? value !== void 0 : Boolean(value?.length);
	return {
		id: params.id,
		label: params.label,
		selectionLabel: params.selectionLabel,
		docsPath: params.docsPath,
		docsLabel: params.docsLabel,
		blurb: params.blurb,
		...hasArrayField(params.channel.aliases) ? { aliases: params.channel.aliases } : {},
		...params.channel.order !== void 0 ? { order: params.channel.order } : {},
		...typeof params.channel.selectionDocsPrefix === "string" ? { selectionDocsPrefix: params.channel.selectionDocsPrefix } : {},
		...params.channel.selectionDocsOmitLabel !== void 0 ? { selectionDocsOmitLabel: params.channel.selectionDocsOmitLabel } : {},
		...hasArrayField(params.channel.selectionExtras) ? { selectionExtras: params.channel.selectionExtras } : {},
		...params.detailLabel ? { detailLabel: params.detailLabel } : {},
		...params.systemImage ? { systemImage: params.systemImage } : {},
		...params.channel.markdownCapable !== void 0 ? { markdownCapable: params.channel.markdownCapable } : {},
		exposure: resolveChannelExposure(params.channel),
		...params.channel.quickstartAllowFrom !== void 0 ? { quickstartAllowFrom: params.channel.quickstartAllowFrom } : {},
		...params.channel.forceAccountBinding !== void 0 ? { forceAccountBinding: params.channel.forceAccountBinding } : {},
		...params.channel.preferSessionLookupForAnnounceTarget !== void 0 ? { preferSessionLookupForAnnounceTarget: params.channel.preferSessionLookupForAnnounceTarget } : {},
		...hasArrayField(params.channel.preferOver) ? { preferOver: params.channel.preferOver } : {}
	};
}
//#endregion
export { isChannelVisibleInConfiguredLists as n, isChannelVisibleInSetup as r, buildManifestChannelMeta as t };
