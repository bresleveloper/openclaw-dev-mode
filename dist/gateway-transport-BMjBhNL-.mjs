//#region src/gateway/terminal/gateway-transport.ts
const TERMINAL_EVENT_DATA = "terminal.data";
const TERMINAL_EVENT_EXIT = "terminal.exit";
/** Adapts terminal ownership to targeted gateway delivery and pressure state. */
function createTerminalSessionTransport(broadcastToConnIds, getBufferedAmount) {
	return {
		emit: (connId, event, payload) => broadcastToConnIds(event, payload, /* @__PURE__ */ new Set([connId]), { dropIfSlow: event === TERMINAL_EVENT_DATA }),
		getBufferedAmount
	};
}
//#endregion
export { TERMINAL_EVENT_EXIT as n, createTerminalSessionTransport as r, TERMINAL_EVENT_DATA as t };
