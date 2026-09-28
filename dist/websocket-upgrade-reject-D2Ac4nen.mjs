import { STATUS_CODES } from "node:http";
//#region src/shared/websocket-upgrade-reject.ts
function rejectWebSocketUpgrade(socket, params) {
	const response = [
		`HTTP/1.1 ${params.status} ${params.reason ?? STATUS_CODES[params.status]}`,
		"Connection: close",
		...params.body ? [`Content-Type: ${params.body.contentType}`, `Content-Length: ${Buffer.byteLength(params.body.text, "utf8")}`] : [],
		...Object.entries(params.headers ?? {}).map(([name, value]) => `${name}: ${value}`),
		"",
		params.body?.text ?? ""
	].join("\r\n");
	try {
		socket.end(response, () => socket.destroy());
	} catch (error) {
		socket.destroy();
		throw error;
	}
}
//#endregion
export { rejectWebSocketUpgrade as t };
