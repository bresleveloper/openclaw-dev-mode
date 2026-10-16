import { t as asBoolean } from "./boolean-BEb0Fdt8.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/channels/streaming-config-readers.ts
function getChannelStreamingConfigObject(entry) {
	const streaming = asNullableRecord(entry?.streaming);
	return streaming ? streaming : void 0;
}
function resolveChannelStreamingNativeTransport(entry) {
	return asBoolean(getChannelStreamingConfigObject(entry)?.nativeTransport);
}
//#endregion
export { resolveChannelStreamingNativeTransport as n, getChannelStreamingConfigObject as t };
