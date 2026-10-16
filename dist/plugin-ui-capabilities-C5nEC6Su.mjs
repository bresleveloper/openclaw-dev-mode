//#region packages/gateway-protocol/src/plugin-ui-capabilities.ts
/** Static UI contribution kinds, in canonical presentation order. */
const PLUGIN_UI_CAPABILITIES = [
	"page",
	"navigation",
	"panel",
	"action",
	"accessory",
	"widget",
	"replacement",
	"link-reader"
];
/** Omission is unspecified; an empty declaration explicitly advertises no UI. */
function validatePluginUiCapabilities(value) {
	if (value === void 0) return { ok: true };
	if (!Array.isArray(value)) return {
		ok: false,
		error: "must be an array"
	};
	for (const entry of value) if (!PLUGIN_UI_CAPABILITIES.some((candidate) => candidate === entry)) return {
		ok: false,
		error: `contains unknown UI capability ${JSON.stringify(entry)}`
	};
	return {
		ok: true,
		capabilities: PLUGIN_UI_CAPABILITIES.filter((capability) => value.includes(capability))
	};
}
//#endregion
export { validatePluginUiCapabilities as n, PLUGIN_UI_CAPABILITIES as t };
