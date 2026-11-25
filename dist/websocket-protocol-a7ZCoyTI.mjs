//!src/gateway/websocket-protocol.ts
function normalizeWebSocketProtocol(e){return e===`https:`?`wss:`:e===`http:`?`ws:`:e}export{normalizeWebSocketProtocol as t};