import { c as WEBSOCKET_CLOSE_GRACE_MS } from "./server-constants-Dx_kHnY5.mjs";
//#region src/gateway/server/connection-transport-close.ts
const closingTransports = /* @__PURE__ */ new WeakSet();
function closeGatewayTransportWithGrace(socket, code, reason) {
	if (closingTransports.has(socket)) return;
	closingTransports.add(socket);
	const handleClose = () => {
		clearTimeout(fallback);
		socket.off("close", handleClose);
		closingTransports.delete(socket);
	};
	const terminate = () => {
		try {
			socket.terminate();
		} catch {}
	};
	socket.once("close", handleClose);
	const fallback = setTimeout(() => {
		terminate();
	}, WEBSOCKET_CLOSE_GRACE_MS);
	fallback.unref?.();
	try {
		socket.close(code, reason);
	} catch {
		clearTimeout(fallback);
		terminate();
	}
}
//#endregion
export { closeGatewayTransportWithGrace as t };
