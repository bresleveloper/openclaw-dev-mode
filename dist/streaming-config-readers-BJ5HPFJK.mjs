import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as asBoolean } from "./boolean-C30ltbL7.mjs";
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
