import { Buffer } from "node:buffer";
//#region packages/gateway-client/src/websocket-data.ts
function rawDataToString(data, encoding = "utf8") {
	if (Array.isArray(data)) return Buffer.concat(data).toString(encoding);
	return data instanceof ArrayBuffer ? Buffer.from(data).toString(encoding) : data.toString(encoding);
}
//#endregion
export { rawDataToString as t };
