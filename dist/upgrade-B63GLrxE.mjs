import { n as WebSocketServer } from "./websocket-CGHaToS5.mjs";
import { t as startWebSocketKeepalive } from "./websocket-keepalive-DYmRD_O3.mjs";
import { t as rejectWebSocketUpgrade } from "./websocket-upgrade-reject-D2Ac4nen.mjs";
import { n as consumeBrowserScreencastToken } from "./tokens-6QA9aAzN.mjs";
import { t as attachBrowserScreencastViewer } from "./session-DcUO3vEC.mjs";
//#region extensions/browser/src/browser/screencast/upgrade.ts
const wss = new WebSocketServer({
	noServer: true,
	maxPayload: 16384
});
async function handleBrowserScreencastUpgrade(req, socket, head) {
	const url = new URL(req.url ?? "/", "http://127.0.0.1");
	if (url.pathname !== "/browser/screencast") return false;
	const params = consumeBrowserScreencastToken(url.searchParams.get("token") ?? "");
	if (!params || params.requesterSignal?.aborted || params.isRequesterCurrent?.() === false) {
		rejectWebSocketUpgrade(socket, { status: 401 });
		return true;
	}
	wss.handleUpgrade(req, socket, head, (ws) => {
		startWebSocketKeepalive(ws, () => ws.terminate());
		ws.on("error", () => ws.terminate());
		ws.on("message", (_data, binary) => {
			if (binary) ws.close(1003, "view_only");
		});
		attachBrowserScreencastViewer(params, ws);
	});
	return true;
}
//#endregion
export { handleBrowserScreencastUpgrade };
