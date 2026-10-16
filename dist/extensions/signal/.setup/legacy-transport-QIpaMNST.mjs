import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/signal/src/legacy-transport.ts
const LEGACY_SIGNAL_TRANSPORT_FIELDS = [
	"configPath",
	"httpUrl",
	"httpHost",
	"httpPort",
	"cliPath",
	"autoStart",
	"startupTimeoutMs",
	"receiveMode",
	"ignoreStories"
];
function hasLegacySignalTransportFields(value) {
	return isRecord(value) && LEGACY_SIGNAL_TRANSPORT_FIELDS.some((field) => Object.hasOwn(value, field));
}
//#endregion
export { hasLegacySignalTransportFields as n, LEGACY_SIGNAL_TRANSPORT_FIELDS as t };
