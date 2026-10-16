import { t as asBoolean } from "./boolean-BEb0Fdt8.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import { r as resolvePluginConfigObject } from "./plugin-config-runtime-DKh00pJ1.mjs";
//#region extensions/canvas/src/config.ts
function parseCanvasPluginConfig(value) {
	if (!isRecord(value) || !isRecord(value.host)) return {};
	const enabled = asBoolean(value.host.enabled);
	return { host: enabled === void 0 ? {} : { enabled } };
}
function resolveCanvasHostConfig(params) {
	return parseCanvasPluginConfig(params.pluginConfig ?? resolvePluginConfigObject(params.config, "canvas") ?? {}).host ?? {};
}
function isCanvasHostEnabled(config) {
	if (isTruthyEnvValue(process.env.OPENCLAW_SKIP_CANVAS_HOST)) return false;
	return resolveCanvasHostConfig({ config }).enabled !== false;
}
const canvasConfigSchema = { parse: parseCanvasPluginConfig };
//#endregion
export { resolveCanvasHostConfig as i, isCanvasHostEnabled as n, parseCanvasPluginConfig as r, canvasConfigSchema as t };
