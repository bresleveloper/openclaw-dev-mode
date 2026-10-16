import { t as rawDataToString$1 } from "./websocket-data-2vBvd4uX.mjs";
//#region src/infra/ws.ts
function rawDataToString(data, encoding = "utf8") {
	return rawDataToString$1(data, encoding);
}
function rawDataByteLength(data) {
	return Array.isArray(data) ? data.reduce((total, chunk) => total + chunk.byteLength, 0) : data.byteLength;
}
//#endregion
export { rawDataToString as n, rawDataByteLength as t };
